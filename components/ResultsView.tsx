"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import {
  Answer,
  Question,
  Mapping,
} from "@/types/document";

import QuestionList from "./QuestionList";

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
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-gray-100">
      {/* Mobile tabs */}
      <div className="flex border-b bg-white md:hidden">
        <button
          onClick={() =>
            setMobileTab("questions")
          }
          className={`flex-1 py-3 text-sm font-semibold ${
            mobileTab === "questions"
              ? "border-b-2 border-orange-500 text-gray-900"
              : "text-gray-400"
          }`}
        >
          Questions
        </button>

        <button
          onClick={() =>
            setMobileTab("answers")
          }
          className={`flex-1 py-3 text-sm font-semibold ${
            mobileTab === "answers"
              ? "border-b-2 border-orange-500 text-gray-900"
              : "text-gray-400"
          }`}
        >
          Answer Sheet
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden min-h-0 flex-1 grid-cols-[minmax(380px,0.95fr)_minmax(500px,1.2fr)] md:grid">
        {/* Questions */}
        <div className="min-h-0 border-r">
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
  );
}