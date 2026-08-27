import { Answer, BoundingBox, TextBlock } from "@/types/document";

export function extractAnswers(textBlocks: TextBlock[]): Answer[] {
  const answers: Answer[] = [];

  for (let index = 0; index < textBlocks.length; index += 1) {
    const block = textBlocks[index];
    const text = block.text.trim();

    const match = text.match(
      /^(?:Ans(?:wer)?|Q(?:uestion)?|\(?)(\d+)(?:[\.\):\s]|$)\s*(.*)/i
    );

    const questionNumber = match?.[1];
    let answerText = match?.[2]?.trim() ?? "";
    let boundingBox = block.boundingBox;
    let nextIndex = index + 1;

    if (!match && answers.length > 0 && answers[answers.length - 1].page === block.page) {
      const previous = answers[answers.length - 1];
      previous.text = `${previous.text} ${text}`.trim();
      previous.boundingBox = unionBoxes(previous.boundingBox, block.boundingBox);
      continue;
    }

    if (!match) answerText = text;

    while (nextIndex < textBlocks.length) {
      const nextBlock = textBlocks[nextIndex];
      if (nextBlock.page !== block.page || startsAnswer(nextBlock.text)) break;
      answerText = `${answerText} ${nextBlock.text.trim()}`.trim();
      boundingBox = unionBoxes(boundingBox, nextBlock.boundingBox);
      nextIndex += 1;
    }
    index = nextIndex - 1;

    if (!answerText) {
      continue;
    }

    answers.push({
      id: `a-${answers.length + 1}`,
      questionNumber,
      text: answerText,
      page: block.page,
      boundingBox,
    });
  }

  return answers;
}

function startsAnswer(text: string): boolean {
  return /^(?:Ans(?:wer)?|Q(?:uestion)?|\(?)(\d+)(?:[\.\):\s]|$)/i.test(text.trim());
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