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
        const leaveRequests = await prisma.leaveRequest.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(leaveRequests);
    } catch (error) {
        console.error("Error fetching leave requests:", error);
        return NextResponse.json(
            { error: "Failed to fetch leave requests" },
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
        const { startDate, endDate, reason, leaveType } = await req.json();

        const leaveRequest = await prisma.leaveRequest.create({
            data: {
                userId: session.user.id,
                leaveType: leaveType || "CASUAL_LEAVE",
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                reason,
                status: "PENDING",
            },
        });

        return NextResponse.json(leaveRequest, { status: 201 });
    } catch (error) {
        console.error("Error submitting leave request:", error);
        return NextResponse.json(
            { error: "Failed to submit leave request" },
            { status: 500 }
        );
    }
}
