import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const page = parseInt(searchParams.get("page") || "1");
        const skip = (page - 1) * limit;

        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "You must be logged in to view history." },
                { status: 401 }
            );
        }

        const games = await prisma.game.findMany({
            where: {
                userId: session.user.id,
            },
            take: limit,
            skip: skip,
            orderBy: {
                timeStarted: "desc",
            },
            select: {
                id: true,
                topic: true,
                gameType: true,
                difficulty: true,
                timeStarted: true,
                totalQuestions: true,
                score: true,
            },
        });

        return NextResponse.json({ games });
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json(
            { error: "Something went wrong while fetching history." },
            { status: 500 }
        );
    }
}
