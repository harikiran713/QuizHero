import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/authOptions";
import prisma from "@/lib/db";
import QuizGame from "@/components/QuizGame";

export default async function GamePage({ params }: any) {
  const x = await params

  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/");

  const game = await prisma.game.findUnique({
    where: { id: x.gameId },
    include: {
      questions: true,
    },
  });

  if (!game || !game.questions || game.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
        <div className="p-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-center text-red-300 font-semibold shadow-xl">
          Game not found or no questions available.
        </div>
      </div>
    );
  }

  const parsedGame = {
    ...game,
    questions: game.questions.map((q) => {
      const parsedOptions =
        typeof q.options === "string" ? JSON.parse(q.options) : q.options;

      return {
        ...q,
        options: parsedOptions,
        correctAnswer: q.answer,
        explanation: parsedOptions?.reason ?? "",
      };
    }),
  };

  return <QuizGame game={parsedGame} />;
}
