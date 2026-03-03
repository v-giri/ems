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
        const documents = await prisma.document.findMany({
            include: {
                user: { select: { name: true, email: true } },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(documents);
    } catch (error) {
        console.error("Error fetching documents:", error);
        return NextResponse.json(
            { error: "Failed to fetch documents" },
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
        const { userId, fileName, fileUrl } = await req.json();

        const document = await prisma.document.create({
            data: {
                userId,
                fileName,
                fileUrl,
            },
            include: {
                user: { select: { name: true, email: true } },
            }
        });

        return NextResponse.json(document, { status: 201 });
    } catch (error) {
        console.error("Error creating document record:", error);
        return NextResponse.json(
            { error: "Failed to create document record" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        await prisma.document.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting document record:", error);
        return NextResponse.json(
            { error: "Failed to delete document record" },
            { status: 500 }
        );
    }
}
