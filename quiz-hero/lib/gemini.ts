import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy initialization: avoid constructing at module-load time so that
// Vercel serverless env vars are reliably available on the first call.
let _model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

function getModel() {
    if (!_model) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY environment variable is not set.");
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        _model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }
    return _model;
}

type Difficulty = "easy" | "medium" | "hard";

interface QuizRequest {
    topic: string;
    level: Difficulty;
    count: number;
    mode?: "neet" | "upsc" | "jee_inorganic" | "gate" | "general";
}

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
  "question": "The question text. IMPORTANT: All math, scientific notation, or formulas MUST be wrapped in '$' for inline math like $E=mc^2$ or '$$' for block math.",
  "answer": "The single correct answer text (keep concise). Wrap math in '$' if needed.",
  "option1": "First incorrect option. Wrap math in '$' if needed.",
  "option2": "Second incorrect option. Wrap math in '$' if needed.",
  "option3": "Third incorrect option. Wrap math in '$' if needed.",
  "reason": "A clear, concise, and concept-based explanation for the correct answer. Wrap all math in '$' or '$$'."
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

async function askWithRetry(systemPrompt: string, userPrompt: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await getModel().generateContent({
                contents: [{ role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                },
            });

            const content = result.response.text();
            let cleanContent = content.trim();

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
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
    throw new Error("Quiz generation loop unexpectedly terminated.");
}

export async function generateQuizQuestions({ topic, level, count, mode = "general" }: QuizRequest) {
    if (!topic || topic.trim() === "") {
        throw new Error("Topic cannot be empty.");
    }
    if (count < 1 || count > 50) {
        throw new Error("Number of questions must be between 1 and 50.");
    }
    if (!['easy', 'medium', 'hard'].includes(level)) {
        throw new Error("Invalid difficulty level.");
    }
    if (mode && !Object.keys(SYSTEM_PROMPTS).includes(mode)) {
        throw new Error("Invalid quiz mode.");
    }

    const systemPrompt = SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS["general"];
    const userPrompt = formatPrompt(topic, level, count);

    return await askWithRetry(systemPrompt, userPrompt);
}

export async function generateFromImage({
    imageBase64,
    mimeType,
    count,
    level,
    mode = "general",
}: {
    imageBase64: string;
    mimeType: string;
    count: number;
    level: Difficulty;
    mode?: string;
}) {
    if (count < 1 || count > 50) throw new Error("Number of questions must be between 1 and 50.");
    if (!['easy', 'medium', 'hard'].includes(level)) throw new Error("Invalid difficulty level.");

    const systemPrompt = SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS["general"];

    const userPrompt = `
Carefully analyze the content in the provided image (it may be a textbook page, notes, diagram, or code).
Extract the key concepts, facts, and topics shown in the image.
Then generate exactly ${count} ${level}-level multiple choice questions (MCQs) based ONLY on the content visible in the image.

${formatPrompt("the image content", level, count)}
`;

    for (let i = 0; i < 3; i++) {
        try {
            const result = await getModel().generateContent({
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: systemPrompt + "\n\n" + userPrompt },
                            {
                                inlineData: {
                                    mimeType,
                                    data: imageBase64,
                                },
                            },
                        ],
                    },
                ],
                generationConfig: {
                    responseMimeType: "application/json",
                },
            });

            const content = result.response.text().trim();
            let clean = content;
            if (clean.startsWith("```json")) clean = clean.replace(/^```json\s*/, "").replace(/\s*```$/, "");
            else if (clean.startsWith("```")) clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "");

            const json = JSON.parse(clean);
            if (isValidJSONResponse(json)) return json;
            throw new Error("Invalid JSON structure from Gemini Vision.");
        } catch (e: any) {
            if (i === 2) throw new Error(`Gemini Vision failed after 3 retries: ${e.message}`);
            await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
        }
    }
    throw new Error("Gemini Vision loop unexpectedly ended.");
}
