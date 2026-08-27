"use client";

import { Question, Mapping } from "@/types/document";
import { ChevronDown, ChevronUp } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  mapping?: Mapping;
  selected: boolean;
  expanded: boolean;
  onClick: () => void;
}

export default function QuestionCard({
  question,
  mapping,
  selected,
  expanded,
  onClick,
}: QuestionCardProps) {
  const marks =
    mapping?.marksObtained ?? 0;

  const total =
    mapping?.totalMarks ??
    question.marks ??
    0;

  const percentage =
    total > 0
      ? marks / total
      : 0;

  const scoreClass =
    percentage >= 0.8
      ? "bg-green-100 text-green-700"
      : percentage >= 0.5
        ? "bg-orange-100 text-orange-700"
        : "bg-red-100 text-red-700";

  return (
    <div
      className={`rounded-xl border bg-white transition-all ${
        selected
          ? "border-orange-400 shadow-sm"
          : "border-gray-200"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start gap-3">
          {/* Question number */}
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              selected
                ? "bg-orange-500 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            {question.number}
          </div>

          {/* Question */}
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-5 text-gray-800">
              {question.text}
            </p>
          </div>

          {/* Marks */}
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${scoreClass}`}
            >
              {marks}/{total}
            </span>

            {expanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-3">
          <div className="rounded-lg bg-orange-50 p-3">
            <p className="mb-1 text-xs font-semibold text-orange-700">
              AI Feedback
            </p>

            <p className="text-xs leading-5 text-gray-700">
              {mapping?.feedback ??
                "Answer analyzed successfully. The response was matched with this question."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}