import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import authOptions from "@/lib/authOptions";
import prisma from "@/lib/db";
import dynamic from "next/dynamic";
const QuizGame = dynamic(() => import("@/components/QuizGame"), {
  loading: () => <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>,
});

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
      <div className="p-4 text-center text-red-600 font-semibold">
        Game not found or no questions available.
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
