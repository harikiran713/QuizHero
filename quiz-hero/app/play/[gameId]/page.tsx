import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/authOptions";
import prisma from "@/lib/db";
import QuizGame from "@/components/QuizGame"; // Adjust path if needed

interface Props {
  params: {
    gameId: string;
  };
}

export default async function GamePage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  const game = await prisma.game.findUnique({
    where: { id: params.gameId },
    include: {
      questions: true,
    },
  });

  if (!game || !game.questions || game.questions.length === 0) {
    return (
      <div className="p-4 text-center text-red-600 font-semibold">
        Game not found or no questions available.
      </div>
    );
  }

  // Parse JSON options and pass to QuizGame
  const parsedGame = {
    ...game,
    questions: game.questions.map((q) => ({
      ...q,
      options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
      correctAnswer: q.answer,
      explanation: JSON.parse(q.options).reason ?? "", // Optional fallback
    })),
  };

  return <QuizGame game={parsedGame} />;
}
