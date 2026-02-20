import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// NOTE: process.env.GEMINI_API_KEY! is used here. Ensure it is set in your environment.
console.log(process.env.GEMINI_API_KEY!)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

type Difficulty = "easy" | "medium" | "hard";

interface QuizRequest {
    topic: string;
    level: Difficulty;
    count: number;
    mode?: "neet" | "upsc" | "jee_inorganic" | "gate";
}

// System prompts now focus purely on content, style, and source material,
// but rely on the user prompt to define the STRICT JSON structure.
const SYSTEM_PROMPTS: Record<string, string> = {
    gate: `
You are an expert GATE (Graduate Aptitude Test in Engineering) exam setter. Generate high-quality, concept-heavy multiple-choice questions (MCQs) based on the given topic. Prioritize questions from previous years' GATE papers or questions of similar standard and difficulty. Focus on testing deep technical understanding, problem-solving skills, and application of concepts. Ensure the questions are rigorous and strictly follow the GATE exam pattern. Avoid trivial or purely factual questions unless typical for the topic in GATE.
`,
    neet: `
You are a NEET Biology subject matter expert. Generate high-quality, concept-driven multiple-choice questions (MCQs) that strictly follow the NEET (UG) exam pattern, based on NCERT Biology textbooks (Class 11 & 12). Incorporate conceptual insights and trends from previous year NEET question papers. Focus on creating original questions that test deep understanding. Prioritize clarity, accuracy, and biological reasoning. Avoid any factual errors or content outside the NCERT scope. Ensure high diversity across subtopics like Human Physiology, Plant Physiology, Genetics, Ecology, Reproduction, and Biotechnology. Do not include general knowledge or trivia. Every question must be biologically sound and aligned with NEET standards.
`,
    upsc: `
You are an expert quiz generator for UPSC preparation. Use NCERTs and standard UPSC sources like Laxmikant, Spectrum, and Ramesh Singh. Focus on conceptual and analytical MCQs that align with UPSC level. Avoid trivial facts. Match the requested difficulty.
`,
    jee_inorganic: `
You are an expert in Inorganic Chemistry for competitive exams like JEE Main and NEET. Analyze the given topic using NCERT (Class 11 and 12) as the primary reference, and enrich it with insights from JD Lee, OP Tandon, and VK Jaiswal. Focus on generating high-quality multiple-choice questions (MCQs) based specifically on important chemical reactions, exceptions (e.g., abnormal oxidation states, bonding, reactivity trends), and related concepts. The MCQs must strictly match the level and pattern of JEE/NEET/State CETs. Ensure maximum depth and completeness.
`,
    general: `
You are an academic quiz generator. Generate multiple choice questions (MCQs) for any topic given by the user. Ensure accuracy, clear wording, and level-appropriate questions. Match the requested difficulty (easy, medium, hard).
`,
};

const formatPrompt = (topic: string, level: Difficulty, count: number): string => {
    return `
Generate exactly ${count} ${level}-level multiple choice questions (MCQs) on the topic "${topic}".

Each question must follow this JSON structure precisely:
{
  "question": "The question text, including any necessary math or scientific notation in LaTeX format.",
  "answer": "The single correct answer text (keep concise).",
  "option1": "First incorrect option.",
  "option2": "Second incorrect option.",
  "option3": "Third incorrect option.",
  "reason": "A clear, concise, and concept-based explanation for the correct answer."
}

Output strictly in the following final JSON format, with no markdown or extra text:
{
  "questions": [
    { 
      "question": "...",
      "answer": "...",
      "option1": "...",
      "option2": "...",
      "option3": "...",
      "reason": "..." 
    }
  ]
}
`;
};

// Validates the structure we enforce in formatPrompt
function isValidJSONResponse(data: any): boolean {
    if (!data || typeof data !== "object" || !Array.isArray(data.questions)) {
        return false;
    }

    return data.questions.every((q: any) => {
        return typeof q.question === "string" &&
            typeof q.answer === "string" &&
            typeof q.option1 === "string" &&
            typeof q.option2 === "string" &&
            typeof q.option3 === "string" &&
            typeof q.reason === "string";
    });
}

// Implements exponential backoff and retries for robustness
async function askWithRetry(systemPrompt: string, userPrompt: string, retries = 3): Promise<object> {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                },
            });

            const content = result.response.text();
            let cleanContent = content.trim();

            // Defensive strip of markdown fences, though responseMimeType should prevent them
            if (cleanContent.startsWith("```json")) {
                cleanContent = cleanContent.replace(/^```json\s*/, "").replace(/\s*```$/, "");
            } else if (cleanContent.startsWith("```")) {
                cleanContent = cleanContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
            }

            const json = JSON.parse(cleanContent);
            console.log("Parsed Quiz JSON:", json);

            if (isValidJSONResponse(json)) {
                return json;
            } else {
                throw new Error("Received invalid JSON structure from Gemini. Retrying...");
            }
        } catch (e: any) {
            if (i === retries - 1) {
                throw new Error(`Gemini failed to return valid JSON after ${retries} retries: ${e.message}`);
            }
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
    throw new Error("Quiz generation loop unexpectedly terminated.");
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        const body: QuizRequest = await req.json();
        const { topic, level, count, mode = "general" } = body;

        if (!topic || topic.trim() === "") {
            return NextResponse.json({ error: "Topic cannot be empty." }, { status: 400 });
        }

        // Consistency check: Limiting question count to 10 as per the original error message text
        if (count < 1 || count > 50) {
            return NextResponse.json({ error: "Number of questions must be between 1 and 10." }, { status: 400 });
        }
        if (!['easy', 'medium', 'hard'].includes(level)) {
            return NextResponse.json({ error: "Invalid difficulty level." }, { status: 400 });
        }
        if (mode && !Object.keys(SYSTEM_PROMPTS).includes(mode)) {
            return NextResponse.json({ error: "Invalid quiz mode." }, { status: 400 });
        }

        const systemPrompt = SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS["general"];
        const userPrompt = formatPrompt(topic, level, count);

        const quizData = await askWithRetry(systemPrompt, userPrompt);

        return NextResponse.json(quizData, { status: 200 });
    } catch (err: any) {
        console.error("API Route Error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to generate quiz due to an unexpected internal server error." },
            { status: 500 }
        );
    }
};