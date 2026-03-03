import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { name, email, password, department, salary } = body;
        const { id } = await params;

        const dataToUpdate: any = {
            name,
            email,
            department,
            salary: parseFloat(salary),
        };

        if (password && password.trim() !== "") {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }

        const updatedEmployee = await prisma.user.update({
            where: { id },
            data: dataToUpdate,
            select: {
                id: true,
                name: true,
                email: true,
                department: true,
                salary: true,
            },
        });

        return NextResponse.json(updatedEmployee);
    } catch (error) {
        console.error("Error updating employee:", error);
        return NextResponse.json(
            { error: "Failed to update employee" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { id } = await params;

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        return NextResponse.json(
            { error: "Failed to delete employee" },
            { status: 500 }
        );
    }
}
