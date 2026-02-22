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
You are an expert GATE (Graduate Aptitude Test in Engineering) exam setter. Generate high-quality, concept-heavy multiple-choice questions (MCQs). For every question, you MUST provide a detailed, step-by-step derivation or logical reasoning in the explanation. Prioritize testing deep technical understanding and application of engineering principles.
`,
    neet: `
You are a NEET Biology subject matter expert. Generate high-quality MCQs based on NCERT Biology (Class 11 & 12). For every question, the explanation must not just state the fact but explain the underlying biological mechanism or reasoning, ensuring it aligns perfectly with NCERT concepts.
`,
    upsc: `
You are an expert quiz generator for UPSC preparation. Use NCERTs and standard UPSC sources. Focus on conceptual and analytical MCQs. The explanation should provide context, historical/legal background where applicable, and a clear reason why the correct option is right and others are less suitable.
`,
    jee_inorganic: `
You are an expert in Inorganic Chemistry for competitive exams like JEE Main and NEET. Focus on chemical reactions, exceptions (abnormal oxidation states, bonding, reactivity trends), and related concepts. For every explanation, provide the specific chemical logic (e.g., Fajan's rule, inert pair effect, shielding) that determines the answer.
`,
    general: `
You are an academic quiz generator. Ensure accuracy and clear wording. For every question, provide a pedagologically sound explanation that helps the student learn the concept, providing step-by-step solutions for mathematical or logical problems.
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
  "reason": "A detailed, step-by-step pedagogical explanation. For numericals, show the full calculation. For concepts, explain the 'why' and clear up potential confusion. Wrap all math in '$' or '$$'."
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
        throw new Error("Number of questions must be between 1 and 10.");
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
Carefully analyze the content in the provided image (textbook pages, handwritten notes, diagrams, or question papers).
Extract all key concepts, formulas, and data points.
Then generate exactly ${count} ${level}-level MCQs based on the image content.
IMPORTANT: For the 'reason' field, you MUST provide a thorough, educator-quality explanation. If the question involves a calculation or derivation, provide it step-by-step so a student can follow the entire solution.

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
