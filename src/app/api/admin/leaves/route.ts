import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const leaveRequests = await prisma.leaveRequest.findMany({
            include: {
                user: {
                    select: { name: true, email: true },
                },
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

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { requestId, status } = await req.json();

        const leaveRequest = await prisma.leaveRequest.update({
            where: { id: requestId },
            data: { status },
        });

        return NextResponse.json(leaveRequest);
    } catch (error) {
        console.error("Error updating leave request:", error);
        return NextResponse.json(
            { error: "Failed to update leave request" },
            { status: 500 }
        );
    }
}
