"use client";

import { useState } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";

import UploadZone from "@/components/UploadZone";
import ProcessingStatus from "@/components/ProcessingState";
import ResultsView from "@/components/ResultsView";
import AppShell from "@/components/AppShell";

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

  const [answerIsImage, setAnswerIsImage] =
    useState(false);

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
      setAnswerIsImage(answerFile.type.startsWith("image/"));

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
    setAnswerIsImage(false);

    setQuestions([]);
    setAnswers([]);
    setMappings([]);

    setState("upload");
    setProcessingStep(0);
  };

  if (state === "processing") {
    return (
      <AppShell>
        <div className="flex min-h-full items-center justify-center px-5 py-10">
          <div className="w-full max-w-3xl rounded-[22px] bg-white px-6 py-16 text-center shadow-[0_10px_35px_rgba(44,40,38,0.06)] sm:px-16">
            <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#ffe0d6] text-[#ff5a2f]">
              <Sparkles className="h-11 w-11" strokeWidth={1.7} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#2f3030] sm:text-3xl">Extracting...</h1>
            <p className="mt-2 text-sm text-[#8c8987]">This may take a while</p>
            <div className="mx-auto mt-10 max-w-md"><ProcessingStatus currentStep={processingStep} /></div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (state === "results") {
    return (
      <ResultsView
        questions={questions}
        answers={answers}
        mappings={mappings}
        answerPdfUrl={answerPdfUrl}
        answerIsImage={answerIsImage}
      />
    );
  }

  return (
    <AppShell>
      <div className="mx-auto flex min-h-full w-full max-w-257.5 flex-col items-center px-4 py-10 sm:px-8 lg:py-16">
        <div className="text-center">
          <h1 className="text-[30px] font-extrabold tracking-[-1.3px] text-[#2f3030] sm:text-[38px]">Upload <span className="rounded-md px-1.5 text-[#ff572f]">Question Paper &amp; Answer Sheets</span></h1>
          <p className="mt-2 text-sm text-[#454342] sm:text-base">Upload both files to get started</p>
          <div className="mx-auto mt-6 grid h-24 w-24 place-items-center rounded-full bg-[#ffe1d8] text-[#ff613b] sm:mt-7 sm:h-28 sm:w-28"><div className="grid h-16 w-16 place-items-center rounded-full border-[7px] border-[#ffb29c] bg-white text-3xl sm:h-20 sm:w-20">✦</div></div>
        </div>
        <div className="mt-7 grid w-full max-w-165 gap-3 rounded-[22px] bg-white p-3 shadow-[0_8px_30px_rgba(44,40,38,0.07)] sm:grid-cols-2 sm:gap-3 sm:p-3.5">
          <UploadZone title="Question Paper" file={questionFile} onFileChange={setQuestionFile} />
          <UploadZone title="Answer Sheet" file={answerFile} onFileChange={setAnswerFile} />
        </div>
        <button onClick={analyzeDocuments} disabled={!questionFile || !answerFile} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#303131] px-6 py-3 text-xs font-semibold text-white shadow-[0_3px_0_#ff6841] transition hover:bg-[#ff5a32] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none">Start Mapping <ChevronLeft className="h-4 w-4 rotate-180" /></button>
        <p className="mt-4 text-xs text-[#85817f]">Once both files are uploaded, you&apos;ll be able to map answers with questions</p>
      </div>
    </AppShell>
  );
}
