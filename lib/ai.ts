import { GoogleGenAI } from "@google/genai";
import { Answer, Question } from "@/types/document";

export interface GradingResult {
  questionId: string;
  marksObtained: number;
  totalMarks: number;
  confidence: number;
  feedback: string;
}

interface GradingInput {
  question: Question;
  answer: Answer;
}

export async function aiMapQuestions(
  questions: Question[],
  answers: Answer[]
) {
  // AI integration will be added here.
  //
  // Eventually this function will:
  //
  // 1. Send questions and answers to the AI model
  // 2. Ask the model to identify the matching answer
  // 3. Return confidence scores
  //
  // For now we use question-number matching.

  return questions.map((question) => {
    const answer = answers.find(
      (answer) => answer.questionNumber === question.number
    );

    return {
      questionId: question.id,
      answerId: answer?.id ?? null,
      confidence: answer ? 100 : 0,
      reason: answer
        ? "Matched using question number."
        : "No matching answer found.",
    };
  });
}

export async function gradeAnswers(
  inputs: GradingInput[]
): Promise<Map<string, GradingResult>> {
  const results = new Map<string, GradingResult>();
  if (inputs.length === 0) return results;

  const fallback = (input: GradingInput): GradingResult => ({
    questionId: input.question.id,
    marksObtained: 0,
    totalMarks: input.question.marks ?? 0,
    confidence: 0,
    feedback: "Answer matched, but AI grading was unavailable. Please review this response manually.",
  });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Grade each student answer against its question. Award only marks supported by the answer. Do not invent facts. Keep feedback to one or two concise sentences. Return ONLY valid JSON as an array with this shape:
[{
  "questionId": "q-1",
  "marksObtained": 2,
  "totalMarks": 5,
  "confidence": 0.85,
  "feedback": "The answer identifies the main idea but omits two important details."
}]

${inputs.map((input) => JSON.stringify({
      questionId: input.question.id,
      totalMarks: input.question.marks ?? 0,
      question: input.question.text,
      studentAnswer: input.answer.text,
    })).join("\n")}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [{ text: prompt }],
    });

    const parsed: unknown = JSON.parse(cleanJson(response.text ?? ""));
    if (!Array.isArray(parsed)) throw new Error("Invalid grading response.");

    for (const item of parsed) {
      if (!isGradingResult(item)) continue;
      const input = inputs.find((candidate) => candidate.question.id === item.questionId);
      if (!input) continue;
      const totalMarks = input.question.marks ?? item.totalMarks;
      results.set(item.questionId, {
        questionId: item.questionId,
        marksObtained: Math.max(0, Math.min(totalMarks, item.marksObtained)),
        totalMarks,
        confidence: Math.max(0, Math.min(1, item.confidence)),
        feedback: item.feedback.trim(),
      });
    }
  } catch (error) {
    console.error("AI grading failed:", error);
  }

  for (const input of inputs) {
    if (!results.has(input.question.id)) results.set(input.question.id, fallback(input));
  }
  return results;
}

function cleanJson(text: string): string {
  return text.trim().replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();
}

function isGradingResult(value: unknown): value is GradingResult {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.questionId === "string" && typeof item.marksObtained === "number" && typeof item.totalMarks === "number" && typeof item.confidence === "number" && typeof item.feedback === "string";
}