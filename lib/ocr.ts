import { GoogleGenAI } from "@google/genai";

import { TextBlock } from "@/types/document";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error(
    "GEMINI_API_KEY is not configured in .env.local"
  );
}

const ai = new GoogleGenAI({
  apiKey,
});

interface GeminiTextBlock {
  text: string;
  page: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface GeminiOCRResponse {
  blocks: GeminiTextBlock[];
}

export async function extractTextFromDocument(
  file: File,
  type: "question" | "answer"
): Promise<TextBlock[]> {
  console.log(
    `Processing ${type} document: ${file.name}`
  );

  console.log(
    `File type: ${file.type}, size: ${file.size} bytes`
  );

  const arrayBuffer = await file.arrayBuffer();

  const base64Data =
    Buffer.from(arrayBuffer).toString("base64");

  console.log(
    `${type}: File converted to base64`
  );

  const prompt =
    type === "question"
      ? `
Analyze this examination question paper.

Extract every question.

For each question return:
- the complete question text
- page number
- approximate bounding box
- bounding box coordinates normalized to 0-1000 for the complete page

Return coordinates normalized to 0-1000 relative to the complete page. Top-left is 0,0 and bottom-right is 1000,1000. Use a top-left origin, not PDF bottom-left coordinates.

Return ONLY valid JSON.

Format:

{
  "blocks": [
    {
      "text": "1. What is photosynthesis?",
      "page": 1,
      "boundingBox": {
        "x": 100,
        "y": 200,
        "width": 500,
        "height": 80
      }
    }
  ]
}

Do not use markdown.
Do not provide explanations.
`
      : `
Analyze this student's examination answer sheet.

Extract every answer.

Important:
- The answers may be handwritten.
- Preserve the student's wording.
- Detect question numbers such as Q1, Q2, 1, 2, Ans 1, Answer 1.
- If there is no question number, still extract the answer.
- Return the page number.
- Return an approximate bounding box.
- bounding box coordinates normalized to 0-1000 for the complete page

Return coordinates normalized to 0-1000 relative to the complete page. Top-left is 0,0 and bottom-right is 1000,1000. Use a top-left origin, not PDF bottom-left coordinates.

Return ONLY valid JSON.

Format:

{
  "blocks": [
    {
      "text": "Ans 1 Photosynthesis is the process...",
      "page": 1,
      "boundingBox": {
        "x": 100,
        "y": 200,
        "width": 500,
        "height": 120
      }
    }
  ]
}

Do not use markdown.
Do not provide explanations.
`;

  console.log(
    `Calling Gemini for ${type} document...`
  );

  try {
    const responsePromise =
      ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            inlineData: {
              mimeType:
                file.type || "application/pdf",
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      });

    const timeoutPromise = new Promise<never>(
      (_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "Gemini request timed out after 60 seconds."
            )
          );
        }, 60000);
      }
    );

    const response = await Promise.race([
      responsePromise,
      timeoutPromise,
    ]);

    console.log(
      `Gemini response received for ${type}`
    );

    const text = response.text;

    console.log(
      `Gemini response length: ${text?.length ?? 0}`
    );

    if (!text) {
      throw new Error(
        "Gemini returned an empty response."
      );
    }

    console.log(
      `Gemini raw response for ${type}:`,
      text
    );

    const cleanedText =
      cleanJsonResponse(text);

    const parsed: GeminiOCRResponse =
      JSON.parse(cleanedText);

    if (!Array.isArray(parsed.blocks)) {
      throw new Error(
        "Gemini response does not contain a blocks array."
      );
    }

    const blocks: TextBlock[] =
      parsed.blocks.map((block) => ({
        text: block.text,
        page: block.page,
        boundingBox: {
          x: block.boundingBox.x,
          y: block.boundingBox.y,
          width: block.boundingBox.width,
          height: block.boundingBox.height,
          coordinateSpace: "normalized-1000",
        },
      }));

    console.log(
      `${type}: Extracted ${blocks.length} blocks`
    );

    return blocks;
  } catch (error) {
    console.error(
      `Gemini OCR failed for ${type}:`,
      error
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : "Gemini OCR failed."
    );
  }
}

function cleanJsonResponse(
  text: string
): string {
  let cleaned = text.trim();

  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  }

  if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }

  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }

  return cleaned.trim();
}