import { Answer, TextBlock } from "@/types/document";

export function extractAnswers(textBlocks: TextBlock[]): Answer[] {
  const answers: Answer[] = [];

  for (const block of textBlocks) {
    const text = block.text.trim();

    const match = text.match(
      /^(?:Ans(?:wer)?|Q(?:uestion)?|\(?)(\d+)(?:[\.\):\s]|$)\s*(.*)/i
    );

    if (!match) {
      continue;
    }

    const questionNumber = match[1];
    const answerText = match[2]?.trim();

    if (!answerText) {
      continue;
    }

    answers.push({
      id: `a-${answers.length + 1}`,
      questionNumber,
      text: answerText,
      page: block.page,
      boundingBox: block.boundingBox,
    });
  }

  return answers;
}