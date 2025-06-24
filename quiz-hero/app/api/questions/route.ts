import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

type Difficulty = "easy" | "medium" | "hard";

interface QuizRequest {
  topic: string;
  level: Difficulty;
  count: number;
  mode?: "neet" | "upsc" | "jee_inorganic";
}

const SYSTEM_PROMPTS: Record<string, string> = {
  neet: `
You are a subject matter expert specialized in generating NEET-level MCQ quiz questions. Base your questions strictly on NCERT textbooks for Biology, Chemistry, or Physics. Refer to important NEET past year papers. Generate original, concept-driven MCQs that match NEET difficulty. Avoid factual errors. Output must be in valid JSON only.
`,

  upsc: `
You are an expert quiz generator for UPSC preparation. Use NCERTs and standard UPSC sources like Laxmikant, Spectrum, and Ramesh Singh. Focus on conceptual and analytical MCQs that align with UPSC level. Avoid trivial facts. Match the requested difficulty. Output must be valid JSON only.
`,

  jee_inorganic: `
You are an expert in JEE Inorganic Chemistry. Use NCERT and references like JD Lee, OP Tandon, and Jaiswal. Generate concept-based MCQs on reactions, periodic trends, hybridization, and exceptions. Match the requested difficulty level and follow JEE Main/Advanced style. Output must be strictly in JSON format.
`,

  general: `
You are an academic quiz generator. Generate multiple choice questions (MCQs) for any topic given by the user. Ensure accuracy, clear wording, and level-appropriate questions. Match the requested difficulty (easy, medium, hard). Output must be in valid JSON with no extra text.
`,
};

const formatPrompt = (topic: string, level: Difficulty, count: number): string => {
  return `
Generate ${count} ${level}-level multiple choice questions (MCQs) on the topic "${topic}".

Each question must follow this JSON format:
{
  "question": "question text",
  "answer": "correct answer with max length of 15 words",
  "option1": "first incorrect option (max 15 words)",
  "option2": "second incorrect option (max 15 words)",
  "option3": "third incorrect option (max 15 words)"
}

Output strictly in the following JSON format:
{
  "questions": [
    { ... },
    ...
  ]
}

Do not include explanations, markdown, or any text outside of the JSON.
`;
};

function isValidJSONResponse(data: any): boolean {
  if (!data || typeof data !== "object" || !Array.isArray(data.questions)) return false;

  return data.questions.every((q: any) =>
    typeof q.question === "string" &&
    typeof q.answer === "string" &&
    typeof q.option1 === "string" &&
    typeof q.option2 === "string" &&
    typeof q.option3 === "string"
  );
}

async function askWithRetry(systemPrompt: string, userPrompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(systemPrompt + "\n\n" + userPrompt);
      console.log(result)
      const content = result.response.text();
      console.log(content)

      // Clean response from possible code blocks
      let cleanContent = content.trim();
      console.log(cleanContent)
      if (cleanContent.startsWith("```json")) {
        cleanContent = cleanContent.replace(/```json\s*/, "").replace(/```\s*$/, "");
      } else if (cleanContent.startsWith("```")) {
        cleanContent = cleanContent.replace(/```\s*/, "").replace(/```\s*$/, "");
      }

      const json = JSON.parse(cleanContent);
      if (isValidJSONResponse(json)) return json;
    } catch (e) {
      console.log(`Attempt ${i + 1} failed:`, e);
    }
  }

  throw new Error("Gemini failed to return valid JSON after 3 retries.");
}

export const POST = async (req: NextRequest) => {
  try {
    const body: QuizRequest = await req.json();
    const { topic, level, count, mode = "general" } = body;

    const systemPrompt = SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS["general"];
    const userPrompt = formatPrompt(topic, level, count);

    const quizData = await askWithRetry(systemPrompt, userPrompt);
    return NextResponse.json(quizData, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate quiz" },
      { status: 500 }
    );
  }
};
