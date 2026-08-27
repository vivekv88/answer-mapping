# AIEvaluator

VedaAI helps teachers review examination papers by connecting questions with the answers found in a student's answer sheet. The teacher uploads both documents, and the application extracts the content, maps each answer to a question, and shows the result next to the original answer sheet.

## How It Works

The browser sends the question paper and answer sheet to the server as form data. The server sends each document to Gemini for OCR. The extracted questions and answers include their page numbers and bounding boxes, so the results page can show the real answer-sheet document and highlight the matching answer.

Question numbers are used first when matching answers. When a number is missing, the application uses text similarity as a fallback. Matched answers are then sent to Gemini in one grading request. The returned score and short feedback are shown when a question is expanded.

The answer viewer renders PDF files with React-PDF. Image uploads are displayed directly in the viewer. OCR coordinates use a top-left origin and are normalized to a 0-to-1000 page coordinate system; the viewer scales them to the actual rendered page dimensions rather than assuming a fixed PDF width.

## AI Model and API

The application uses Google Gemini through the `@google/genai` package. The current model is `gemini-3.6-flash`, used for:

- Reading question papers and handwritten answer sheets.
- Returning page numbers and normalized answer locations.
- Matching answers when an explicit question number is not available.
- Assigning marks and writing brief feedback.

The Gemini API key is used only in server-side routes and must be stored in `.env`:

```env
GEMINI_API_KEY=your_key_here
```

## Assumptions and Limitations

- OCR results depend on the quality, lighting, orientation, and legibility of the uploaded document. Very unclear handwriting or diagrams may be extracted inaccurately.
- Bounding boxes are approximate. They are normalized consistently, but the model may still place a box slightly above or below the true writing.
- Explicit question numbers produce the most reliable mapping. The text-similarity fallback is useful when numbers are missing, but it cannot replace a teacher's review in ambiguous cases.
- AI grading is an aid, not a final authority. Teachers should check scores for unusual answers, diagrams, partial credit, or questions where the expected marking scheme is complex.
- If Gemini grading fails, the application keeps the mapping result and shows a manual-review message instead of stopping the whole analysis.
- PDF files can contain multiple pages. A single uploaded image is treated as one page.
- The application currently processes documents in memory during a request and does not provide long-term document storage or user authentication.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
