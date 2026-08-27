import { BoundingBox, Question, TextBlock } from "@/types/document";

export function extractQuestions(textBlocks: TextBlock[]): Question[] {
  const questions: Question[] = [];

  for (let index = 0; index < textBlocks.length; index += 1) {
    const block = textBlocks[index];
    const text = block.text.trim();

    const match = text.match(
      /^(?:Q(?:uestion)?\s*)?(\d+)(?:[\.\):]|\s|$)\s*(.*)/i
    );

    if (!match) {
      continue;
    }

    const number = match[1];
    let questionText = match[2]?.trim() ?? "";
    let boundingBox = block.boundingBox;
    let nextIndex = index + 1;

    while (nextIndex < textBlocks.length) {
      const nextBlock = textBlocks[nextIndex];
      if (nextBlock.page !== block.page || /^(?:Q(?:uestion)?\s*)?\d+(?:[\.\):]|\s|$)/i.test(nextBlock.text.trim())) break;
      questionText = `${questionText} ${nextBlock.text.trim()}`.trim();
      boundingBox = unionBoxes(boundingBox, nextBlock.boundingBox);
      nextIndex += 1;
    }
    index = nextIndex - 1;

    if (!questionText) {
      continue;
    }

    const marks = extractMarks(questionText);

    questions.push({
      id: `q-${number}`,
      number,
      text: questionText,
      page: block.page,
      boundingBox,
      marks,
    });
  }

  return questions;
}

function unionBoxes(first: BoundingBox, second: BoundingBox): BoundingBox {
  const x = Math.min(first.x, second.x);
  const y = Math.min(first.y, second.y);
  return {
    x,
    y,
    width: Math.max(first.x + first.width, second.x + second.width) - x,
    height: Math.max(first.y + first.height, second.y + second.height) - y,
    coordinateSpace: "normalized-1000",
  };
}

function extractMarks(text: string): number | undefined {
  const match = text.match(/(?:\[\s*|\(\s*|\b)(\d+(?:\.\d+)?)\s*(?:marks?|pts?)(?:\s*\]|\s*\))?/i)
    ?? text.match(/max(?:imum)?\s*marks?\s*[:=-]?\s*(\d+(?:\.\d+)?)/i);
  return match ? Number(match[1]) : undefined;
}