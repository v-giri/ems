import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [
            totalEmployees,
            pendingLeaves,
            pendingTasks,
            unpaidPayroll,
            todayPresent,
            todayAbsent,
        ] = await Promise.all([
            prisma.user.count({ where: { role: "EMPLOYEE" } }),
            prisma.leaveRequest.count({ where: { status: "PENDING" } }),
            prisma.task.count({ where: { status: { in: ["TODO", "IN_PROGRESS"] } } }),
            prisma.payroll.count({ where: { isPaid: false } }),
            prisma.attendance.count({
                where: { date: { gte: today, lt: tomorrow }, status: "PRESENT" },
            }),
            prisma.attendance.count({
                where: { date: { gte: today, lt: tomorrow }, status: "ABSENT" },
            }),
        ]);

        const recentLeaves = await prisma.leaveRequest.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } },
        });

        const recentTasks = await prisma.task.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } },
        });

        return NextResponse.json({
            totalEmployees,
            pendingLeaves,
            pendingTasks,
            unpaidPayroll,
            todayPresent,
            todayAbsent,
            recentLeaves,
            recentTasks,
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
