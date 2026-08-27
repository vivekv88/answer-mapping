import { NextResponse } from "next/server";
import { Answer, Mapping, Question } from "@/types/document";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const questions = body.questions as Question[];
    const answers = body.answers as Answer[];

    if (!Array.isArray(questions) || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Questions and answers must be arrays." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      mappings: questions.map((question): Mapping => {
        const answer = findAnswer(question, answers);
        const totalMarks = question.marks ?? 0;
        return {
        questionId: question.id,
        answerId: answer?.id ?? null,
        confidence: answer ? 1 : 0,
        reason: answer
          ? answer.questionNumber === question.number
            ? "Matched using the explicit question number."
            : "Matched using answer text similarity."
          : "No matching answer found.",
        marksObtained: 0,
        totalMarks,
        feedback: answer
          ? "Answer matched. Review the response for completeness and supporting detail."
          : "No answer was found for this question.",
        };
      }),
    });
  } catch (error) {
    console.error("MAP API ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown mapping error",
      },
      { status: 500 }
    );
  }
}

function findAnswer(question: Question, answers: Answer[]): Answer | undefined {
  const explicit = answers.find((answer) => answer.questionNumber === question.number);
  if (explicit) return explicit;

  const words = new Set(question.text.toLowerCase().split(/\W+/).filter((word) => word.length > 3));
  const candidates = answers.map((answer) => ({
    answer,
    score: answer.text.toLowerCase().split(/\W+/).filter((word) => words.has(word)).length,
  })).sort((left, right) => right.score - left.score);

  return candidates[0]?.score ? candidates[0].answer : undefined;
}