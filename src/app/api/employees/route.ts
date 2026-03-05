import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const employees = await prisma.user.findMany({
            where: {
                role: "EMPLOYEE",
            },
            select: {
                id: true,
                employeeId: true,
                name: true,
                email: true,
                role: true,
                department: true,
                salary: true,
                cvUrl: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(employees);
    } catch (error) {
        console.error("Error fetching employees:", error);
        return NextResponse.json(
            { error: "Failed to fetch employees" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { name, email, password, department, salary, employeeId } = body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployee = await prisma.user.create({
            data: {
                employeeId,
                name,
                email,
                password: hashedPassword,
                department,
                salary: parseFloat(salary),
                role: "EMPLOYEE",
            },
            select: {
                id: true,
                employeeId: true,
                name: true,
                email: true,
                department: true,
                salary: true,
            },
        });

        return NextResponse.json(newEmployee);
    } catch (error) {
        console.error("Error creating employee:", error);
        return NextResponse.json(
            { error: "Failed to create employee" },
            { status: 500 }
        );
    }
}
