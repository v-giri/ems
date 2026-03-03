import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "EMPLOYEE") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const attendance = await prisma.attendance.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                date: "desc",
            },
        });

        return NextResponse.json(attendance);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return NextResponse.json(
            { error: "Failed to fetch attendance" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "EMPLOYEE") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { action } = await req.json(); // "CHECK_IN" or "CHECK_OUT"
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendanceRecord = await prisma.attendance.findFirst({
            where: {
                userId: session.user.id,
                date: today,
            },
        });

        if (action === "CHECK_IN") {
            if (attendanceRecord?.checkIn) {
                return NextResponse.json(
                    { error: "Already checked in today" },
                    { status: 400 }
                );
            }

            const now = new Date();
            // Simple logic: if checking in after 10 AM, mark as half day, else present
            const isLate = now.getHours() >= 10;

            if (attendanceRecord) {
                attendanceRecord = await prisma.attendance.update({
                    where: { id: attendanceRecord.id },
                    data: {
                        checkIn: now,
                        status: isLate ? "HALF_DAY" : "PRESENT",
                    },
                });
            } else {
                attendanceRecord = await prisma.attendance.create({
                    data: {
                        userId: session.user.id,
                        date: today,
                        checkIn: now,
                        status: isLate ? "HALF_DAY" : "PRESENT",
                    },
                });
            }
        } else if (action === "CHECK_OUT") {
            if (!attendanceRecord?.checkIn) {
                return NextResponse.json(
                    { error: "Must check in first" },
                    { status: 400 }
                );
            }
            if (attendanceRecord.checkOut) {
                return NextResponse.json(
                    { error: "Already checked out today" },
                    { status: 400 }
                );
            }

            attendanceRecord = await prisma.attendance.update({
                where: { id: attendanceRecord.id },
                data: {
                    checkOut: new Date(),
                },
            });
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        return NextResponse.json(attendanceRecord);
    } catch (error) {
        console.error("Error updating attendance:", error);
        return NextResponse.json(
            { error: "Failed to update attendance" },
            { status: 500 }
        );
    }
}
