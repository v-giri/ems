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
        const payrolls = await prisma.payroll.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(payrolls);
    } catch (error) {
        console.error("Error fetching payroll:", error);
        return NextResponse.json(
            { error: "Failed to fetch payroll" },
            { status: 500 }
        );
    }
}
