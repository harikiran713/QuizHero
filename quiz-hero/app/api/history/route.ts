import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import prisma from "@/lib/db";

export async function GET() {
    try {
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
            orderBy: {
                timeStarted: "desc",
            },
            include: {
                _count: {
                    select: {
                        questions: true,
                    },
                },
                questions: {
                    select: {
                        isCorrect: true,
                    },
                },
            },
        });

        const parsedGames = games.map((game) => {
            const correctAnswers = game.questions.filter((q) => q.isCorrect).length;
            return {
                id: game.id,
                topic: game.topic,
                gameType: game.gameType,
                difficulty: game.difficulty,
                timeStarted: game.timeStarted,
                totalQuestions: game._count.questions,
                score: correctAnswers,
            };
        });

        return NextResponse.json({ games: parsedGames });
    } catch (error) {
        console.error("Error fetching history:", error);
        return NextResponse.json(
            { error: "Something went wrong while fetching history." },
            { status: 500 }
        );
    }
}
