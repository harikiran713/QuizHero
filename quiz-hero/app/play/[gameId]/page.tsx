import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/authOptions";
import prisma from "@/lib/db";
import QuizGame from "@/components/QuizGame";

interface PageParams {
  params: {
    gameId: string;
  };
}

export default async function GamePage({ params }: PageParams) {
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

  // Parse question options (stringified JSON) and enrich question data
  const parsedGame = {
    ...game,
    questions: game.questions.map((q) => {
      const parsedOptions = typeof q.options === "string" ? JSON.parse(q.options) : q.options;
      return {
        ...q,
        options: parsedOptions,
        correctAnswer: q.answer,
        explanation: parsedOptions.reason ?? "", // Use explanation if present
      };
    }),
  };

  return <QuizGame game={parsedGame} />;
}
