import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import authoptions from "@/lib/authOptions";
import { NextRequest, NextResponse } from "next/server";
import { generateQuizQuestions } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  let step = "parse_request";
  try {
    const session = await getServerSession(authoptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { questions, topic, mode, difficulty } = body;

    // Step 1: Create game in DB
    step = "create_game_in_db";
    const game = await prisma.game.create({
      data: {
        gameType: mode,
        difficulty,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });

    // Step 2: Generate questions via Gemini
    step = "call_gemini_api";
    const data = await generateQuizQuestions({
      topic,
      level: difficulty,
      count: questions,
      mode,
    });

    // Step 3: Save questions to DB
    step = "save_questions_to_db";
    const manyData = data.questions.map((question: any) => {
      let options = [question.answer, question.option1, question.option2, question.option3];
      options = options.sort(() => Math.random() - 0.5);
      return {
        question: question.question,
        answer: question.answer,
        options: JSON.stringify(options),
        gameId: game.id,
        questionType: mode,
        reason: question.reason,
      };
    });

    await prisma.question.createMany({ data: manyData });
    return NextResponse.json({ success: true, gameId: game.id });

  } catch (error: any) {
    const message = error?.message ?? "Unknown error";
    console.error(`[game/route] Failed at step "${step}":`, message);
    return NextResponse.json(
      { error: "Something went wrong", failedAt: step, detail: message },
      { status: 500 }
    );
  }
}
