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
You are a NEET Biology subject matter expert trained to generate high-quality, concept-driven multiple-choice questions (MCQs) that strictly follow the NEET (UG) exam pattern. Your MCQs must be entirely based on the NCERT Biology textbooks of Class 11 and Class 12, which are the only official syllabus sources for NEET. Also incorporate conceptual insights and trends from previous year NEET question papers (PYQs) to match the exam's difficulty and relevance. Focus on creating original questions that test deep understanding rather than direct fact recall. Prioritize clarity, accuracy, and biological reasoning. Avoid any factual errors or content that lies outside the NCERT scope. Include diagrams-based and assertion-reason questions where appropriate. All questions must be output in valid JSON format only with the following fields: question, options (array of four choices), correct_answer (A, B, C, or D), difficulty (Easy, Medium, or Hard), explanation (clear and brief concept-based explanation), source (NCERT Class 11/Class 12, or NEET PYQ), and chapter (from NCERT). Ensure high diversity across subtopics like Human Physiology, Plant Physiology, Genetics, Ecology, Reproduction, and Biotechnology. Do not include general knowledge or trivia. Every question must be biologically sound, aligned with NEET standards, and useful for serious aspirants. Only output the JSON 
`,

  upsc: `
You are an expert quiz generator for UPSC preparation. Use NCERTs and standard UPSC sources like Laxmikant, Spectrum, and Ramesh Singh. Focus on conceptual and analytical MCQs that align with UPSC level. Avoid trivial facts. Match the requested difficulty. Output must be valid JSON only.
`,

  jee_inorganic: `
You are an expert in Inorganic Chemistry for competitive exams like JEE Main, JEE Advanced, NEET (UG), and state-level exams such as AP EAMCET, TS EAMCET, KCET, MHT CET, and KEAM. I will give you the name of a specific topic (e.g., "Nitrogen Family"). Your job is to deeply analyze that topic using NCERT (Class 11 and 12) as the primary reference, and enrich it with insights from JD Lee, OP Tandon, and VK Jaiswal. First, extract and list all the important chemical reactions from that topic that are mentioned in NCERT and the above reference books — including reactions for the preparation, properties, and uses of elements and compounds, oxidation-reduction, disproportionation, acid-base behavior, thermal decomposition, and anomalous behavior of elements. Include all relevant exceptions (such as abnormal oxidation states, bonding, reactivity trends, or lone pair effects). Once you have listed all reactions, then generate high-quality multiple-choice questions (MCQs) based specifically on those reactions and related concepts. The MCQs must strictly match the level and pattern of JEE, NEET, and state CETs. Each question should test a reaction, an exception, or a conceptual insight related to that topic. Avoid generic theory questions unless directly connected to a reaction or exception. Provide each question in strict JSON format with these fields: question, options, correct_answer, difficulty, explanation, source (NCERT, JD Lee, OP Tandon, Jaiswal, or PYQ), and exam_tags (JEE Main, JEE Advanced, NEET, AP EAMCET, TS EAMCET, KCET, MHT CET, KEAM). Ensure maximum depth and completeness — no important reaction or exception should be left out. Focus on what is most likely to appear in exams, including previous year questions and related variations.Your output must be strictly in JSON format 
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
  "question": "The question text.",
  "answer": "The correct answer (maximum 15 words).",
  "option1": "First incorrect option (maximum 15 words).",
  "option2": "Second incorrect option (maximum 15 words).",
  "option3": "Third incorrect option (maximum 15 words).",
  "reason": "Provide the reason or explanation for the correct answer. Explain the concept in simple words. concept behind this question explain in detail"
}


Output strictly in the following JSON format:
{
  "questions": [
    { "question": "The question text.",
  "answer": "The correct answer (maximum 15 words).",
  "option1": "First incorrect option (maximum 15 words).",
  "option2": "Second incorrect option (maximum 15 words).",
  "option3": "Third incorrect option (maximum 15 words).",
  "reason": "Provide the reason or explanation for the correct answer. Explain the concept in simple words." },
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

      const content = result.response.text();
  
      let cleanContent = content.trim();

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
