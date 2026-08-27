import { Answer, Question } from "@/types/document";

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