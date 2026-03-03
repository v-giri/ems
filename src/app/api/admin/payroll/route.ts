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
        const payrolls = await prisma.payroll.findMany({
            include: {
                user: { select: { name: true, email: true, department: true } },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(payrolls);
    } catch (error) {
        console.error("Error fetching payrolls:", error);
        return NextResponse.json(
            { error: "Failed to fetch payrolls" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { userId, payPeriod, netAmount } = await req.json();

        const payroll = await prisma.payroll.create({
            data: {
                userId,
                payPeriod,
                netAmount: Number(netAmount),
                isPaid: false,
            },
            include: {
                user: { select: { name: true, email: true, department: true } },
            }
        });

        return NextResponse.json(payroll, { status: 201 });
    } catch (error) {
        console.error("Error creating payroll:", error);
        return NextResponse.json(
            { error: "Failed to create payroll" },
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
        const { payrollId, isPaid } = await req.json();

        const payroll = await prisma.payroll.update({
            where: { id: payrollId },
            data: { isPaid },
            include: {
                user: { select: { name: true, email: true, department: true } },
            }
        });

        return NextResponse.json(payroll);
    } catch (error) {
        console.error("Error updating payroll:", error);
        return NextResponse.json(
            { error: "Failed to update payroll" },
            { status: 500 }
        );
    }
}
