import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: { gameId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "You must be logged in." },
                { status: 401 }
            );
        }
        const gameId = params.gameId;

        const game = await prisma.game.findUnique({
            where: {
                id: gameId,
            },
            include: {
                questions: true,
            },
        });

        if (!game) {
            return NextResponse.json(
                { error: "Game not found." },
                { status: 404 }
            );
        }

        // Ensure the user owns this game
        if (game.userId !== session.user.id) {
            return NextResponse.json(
                { error: "You are not authorized to view this game." },
                { status: 403 }
            );
        }

        return NextResponse.json({ game });
    } catch (error) {
        console.error("Error fetching game details:", error);
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
