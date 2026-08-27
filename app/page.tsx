"use client";

import { useState } from "react";

import UploadZone from "@/components/UploadZone";
import ProcessingStatus from "@/components/ProcessingState";
import ResultsView from "@/components/ResultsView";

import {
  AnalysisResult,
  Answer,
  Mapping,
  Question,
} from "@/types/document";

type AppState = "upload" | "processing" | "results";

export default function Home() {
  const [questionFile, setQuestionFile] =
    useState<File | null>(null);

  const [answerFile, setAnswerFile] =
    useState<File | null>(null);

  const [questionPdfUrl, setQuestionPdfUrl] =
    useState<string | null>(null);

  const [answerPdfUrl, setAnswerPdfUrl] =
    useState<string | null>(null);

  const [state, setState] =
    useState<AppState>("upload");

  const [processingStep, setProcessingStep] =
    useState(0);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [answers, setAnswers] =
    useState<Answer[]>([]);

  const [mappings, setMappings] =
    useState<Mapping[]>([]);

  const analyzeDocuments = async () => {
    if (!questionFile || !answerFile) {
      alert(
        "Please upload both the question paper and answer sheet."
      );

      return;
    }

    try {
      setState("processing");
      setProcessingStep(0);

      const newQuestionPdfUrl =
        URL.createObjectURL(questionFile);

      const newAnswerPdfUrl =
        URL.createObjectURL(answerFile);

      setQuestionPdfUrl(newQuestionPdfUrl);
      setAnswerPdfUrl(newAnswerPdfUrl);

      const formData = new FormData();

      formData.append("questionPaper", questionFile);
      formData.append("answerSheet", answerFile);

      setProcessingStep(1);

      const extractResponse = await fetch(
        "/api/extract",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!extractResponse.ok) {
        throw new Error("Document extraction failed.");
      }

      const extracted: AnalysisResult =
        await extractResponse.json();

      setQuestions(extracted.questions);
      setAnswers(extracted.answers);

      setProcessingStep(2);

      setProcessingStep(3);

      const mapResponse = await fetch("/api/map", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: extracted.questions,
          answers: extracted.answers,
        }),
      });

      console.log("Mapping response status:", mapResponse.status);
      console.log("Mapping response content type:", mapResponse.headers.get("content-type"));

      const responseText = await mapResponse.text();

      console.log("Mapping raw response:", responseText);

      if (!mapResponse.ok) {
        throw new Error(
          `Question mapping failed (${mapResponse.status}): ${responseText}`
        );
      }

      let mapped;

      try {
        mapped = JSON.parse(responseText);
      } catch {
        throw new Error(
          "Mapping API returned an invalid JSON response."
        );
      }

      setMappings(mapped.mappings);

      setProcessingStep(4);

      setTimeout(() => {
        setState("results");
      }, 500);
    } catch (error) {
      console.error(error);

      alert(
        "Something went wrong while processing the documents."
      );

      setState("upload");
    }
  };

  const reset = () => {
    if (questionPdfUrl) {
      URL.revokeObjectURL(
        questionPdfUrl
      );
    }

    if (answerPdfUrl) {
      URL.revokeObjectURL(
        answerPdfUrl
      );
    }

    setQuestionFile(null);
    setAnswerFile(null);

    setQuestionPdfUrl(null);
    setAnswerPdfUrl(null);

    setQuestions([]);
    setAnswers([]);
    setMappings([]);

    setState("upload");
    setProcessingStep(0);
  };

  if (state === "processing") {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              AI Answer Mapper
            </h1>

            <p className="mt-2 text-gray-500">
              Analyzing your documents...
            </p>
          </div>

          <ProcessingStatus
            currentStep={processingStep}
          />
        </div>
      </main>
    );
  }

  if (state === "results") {
    return (
      <ResultsView
        questions={questions}
        answers={answers}
        mappings={mappings}
        answerPdfUrl={answerPdfUrl}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            AI-Powered Document Analysis
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            AI Answer Mapper
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Upload a question paper and a student answer
            sheet. Our system extracts the content and maps
            each question to its corresponding answer.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <UploadZone
            title="Question Paper"
            file={questionFile}
            onFileChange={setQuestionFile}
          />

          <UploadZone
            title="Student Answer Sheet"
            file={answerFile}
            onFileChange={setAnswerFile}
          />
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={analyzeDocuments}
            disabled={!questionFile || !answerFile}
            className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Analyze Documents →
          </button>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6">
            <div className="mb-3 text-2xl">📄</div>

            <h3 className="font-semibold">
              Extract Questions
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Automatically detect and extract questions
              from the uploaded paper.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <div className="mb-3 text-2xl">🤖</div>

            <h3 className="font-semibold">
              Map Answers
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Identify which student answer belongs to
              each question.
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <div className="mb-3 text-2xl">🔎</div>

            <h3 className="font-semibold">
              Visual Mapping
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              View questions and their corresponding
              answers side by side.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}