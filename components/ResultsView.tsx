"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import {
  Answer,
  Question,
  Mapping,
} from "@/types/document";

import QuestionList from "./QuestionList";
import AppShell from "./AppShell";

const AnswerSheetViewer = dynamic(
  () => import("./AnswerSheetViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-500">
        Loading answer sheet...
      </div>
    ),
  }
);

interface ResultsViewProps {
  questions: Question[];
  answers: Answer[];
  mappings: Mapping[];
  answerPdfUrl: string | null;
}

export default function ResultsView({
  questions,
  answers,
  mappings,
  answerPdfUrl,
}: ResultsViewProps) {
  const [
    selectedQuestionId,
    setSelectedQuestionId,
  ] = useState<string | null>(
    questions[0]?.id ?? null
  );

  const [
    expandedQuestionIds,
    setExpandedQuestionIds,
  ] = useState<Set<string>>(
    () => new Set(questions[0]?.id ? [questions[0].id] : [])
  );

  const [
    mobileTab,
    setMobileTab,
  ] = useState<
    "questions" | "answers"
  >("questions");

  const selectedMapping =
    mappings.find(
      (mapping) =>
        mapping.questionId ===
        selectedQuestionId
    );

  const selectedAnswer =
    answers.find(
      (answer) =>
        answer.id ===
        selectedMapping?.answerId
    ) ?? null;

  const handleQuestionSelect = (
    id: string
  ) => {
    setSelectedQuestionId(id);

    setExpandedQuestionIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

    setMobileTab("answers");
  };

  return (
    <AppShell>
    <div className="flex min-h-full flex-col overflow-hidden bg-[#f1f0ef]">
      {/* Mobile tabs */}
      <div className="flex gap-1 border-b bg-white p-2 md:hidden">
        <button
          onClick={() =>
            setMobileTab("questions")
          }
          className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${
            mobileTab === "questions"
              ? "bg-[#303131] text-white"
              : "text-[#8c8987]"
          }`}
        >
          Questions
        </button>

        <button
          onClick={() =>
            setMobileTab("answers")
          }
          className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${
            mobileTab === "answers"
              ? "bg-[#303131] text-white"
              : "text-[#8c8987]"
          }`}
        >
          Answer Sheet
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden min-h-0 flex-1 grid-cols-[minmax(360px,0.95fr)_minmax(480px,1.2fr)] gap-2 p-2 md:grid lg:p-3">
        {/* Questions */}
        <div className="min-h-0 overflow-hidden rounded-xl bg-[#f7f6f5]">
          <QuestionList
            questions={questions}
            mappings={mappings}
            selectedQuestionId={
              selectedQuestionId
            }
            expandedQuestionIds={expandedQuestionIds}
            onSelect={
              handleQuestionSelect
            }
            onExpand={(id) => setExpandedQuestionIds((current) => {
              const next = new Set(current);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
            })}
          />
        </div>

        {/* Answer */}
        <div className="min-h-0">
          <AnswerSheetViewer
            pdfUrl={answerPdfUrl}
            selectedAnswer={
              selectedAnswer
            }
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="min-h-0 flex-1 md:hidden">
        {mobileTab === "questions" ? (
          <QuestionList
            questions={questions}
            mappings={mappings}
            selectedQuestionId={
              selectedQuestionId
            }
            expandedQuestionIds={expandedQuestionIds}
            onSelect={
              handleQuestionSelect
            }
            onExpand={(id) => setExpandedQuestionIds((current) => {
              const next = new Set(current);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
            })}
          />
        ) : (
          <AnswerSheetViewer
            pdfUrl={answerPdfUrl}
            selectedAnswer={
              selectedAnswer
            }
          />
        )}
      </div>
    </div>
    </AppShell>
  );
}