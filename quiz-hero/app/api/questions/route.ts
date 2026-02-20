import { NextRequest, NextResponse } from "next/server";
import { generateQuizQuestions } from "@/lib/gemini";

interface QuizRequest {
    topic: string;
    level: "easy" | "medium" | "hard";
    count: number;
    mode?: "neet" | "upsc" | "jee_inorganic" | "gate";
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const body: QuizRequest = await req.json();
        const { topic, level, count, mode = "general" } = body;

        try {
            const quizData = await generateQuizQuestions({ topic, level, count, mode });
            return NextResponse.json(quizData, { status: 200 });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

    } catch (err: any) {
        console.error("API Route Error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to generate quiz due to an unexpected internal server error." },
            { status: 500 }
        );
    }
};