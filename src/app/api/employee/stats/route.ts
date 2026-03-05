import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "EMPLOYEE") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const userId = session.user.id;

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [
            pendingTasks,
            completedTasks,
            pendingLeaves,
            approvedLeaves,
            todayAttendance,
            latestPayroll,
        ] = await Promise.all([
            prisma.task.count({ where: { userId, status: { in: ["TODO", "IN_PROGRESS"] } } }),
            prisma.task.count({ where: { userId, status: "DONE" } }),
            prisma.leaveRequest.count({ where: { userId, status: "PENDING" } }),
            prisma.leaveRequest.count({ where: { userId, status: "APPROVED" } }),
            prisma.attendance.findFirst({
                where: { userId, date: { gte: today, lt: tomorrow } },
            }),
            prisma.payroll.findFirst({
                where: { userId },
                orderBy: { createdAt: "desc" },
            }),
        ]);

        return NextResponse.json({
            pendingTasks,
            completedTasks,
            pendingLeaves,
            approvedLeaves,
            todayAttendance,
            latestPayroll,
        });
    } catch (error) {
        console.error("Error fetching employee stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
