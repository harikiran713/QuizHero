import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionId, userAnswer } = body;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    console.log("question")
    console.log(question)

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

   
    const isCorrect =
      question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim();

    await prisma.question.update({
      where: { id: questionId },
      data: {
        userAnswer,
        isCorrect,
      },
    });

    return NextResponse.json(
      {
        isCorrect,
        correctAnswer: question.answer,
        explanation:question.reason,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/answer:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
