import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { questionId, userAnswer } = body;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Check answer
    const isCorrect =
      question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim();

    // Update the question record
    await prisma.question.update({
      where: { id: questionId },
      data: {
        userAnswer,
        isCorrect,
      },
    });

    // Parse options
    let explanation = "";
    try {
      const parsedOptions = JSON.parse(question.options as any);
      explanation = parsedOptions?.reason || "";
    } catch (err) {
      console.error("Failed to parse options JSON:", err);
    }

    return NextResponse.json(
      {
        isCorrect,
        correctAnswer: question.answer,
        explanation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/answer:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
