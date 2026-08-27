import { NextResponse } from "next/server";
import { extractTextFromDocument } from "@/lib/ocr";
import { extractQuestions } from "@/lib/question-parser";
import { extractAnswers } from "@/lib/answer-parser";

export async function POST(request: Request) {
  try {

    console.log("Running Extraction...");

    const formData = await request.formData();

    console.log(formData)

    const questionFile = formData.get("questionPaper") as File | null;
    const answerFile = formData.get("answerSheet") as File | null;

    if (!questionFile || !answerFile) {
      return NextResponse.json(
        {
          error: "Both files are required.",
        },
        { status: 400 }
      );
    }

    const questionBlocks = await extractTextFromDocument(
      questionFile,
      "question"
    );

    const answerBlocks = await extractTextFromDocument(
      answerFile,
      "answer"
    );

    const questions = extractQuestions(questionBlocks);
    const answers = extractAnswers(answerBlocks);

    return NextResponse.json({
      questions,
      answers,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to process documents.",
      },
      { status: 500 }
    );
  }
}