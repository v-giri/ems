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
        const tasks = await prisma.task.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json(
            { error: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "EMPLOYEE") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { taskId, status } = await req.json();

        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task || task.userId !== session.user.id) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { status },
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error("Error updating task:", error);
        return NextResponse.json(
            { error: "Failed to update task" },
            { status: 500 }
        );
    }
}
