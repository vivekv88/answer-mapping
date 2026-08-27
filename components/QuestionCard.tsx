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
      className={`rounded-[10px] border bg-white transition-all ${
        selected
          ? "border-[#ff693f] shadow-[0_3px_10px_rgba(255,105,63,0.12)]"
          : "border-transparent shadow-[0_2px_8px_rgba(44,40,38,0.04)]"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full p-3 text-left"
      >
        <div className="flex items-start gap-3">
          {/* Question number */}
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              selected
                ? "bg-[#ff5a32] text-white"
                : "bg-[#5d5b59] text-white"
            }`}
          >
            {question.number}
          </div>

          {/* Question */}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] leading-[1.35] text-[#3f3d3c]">
              {question.text}
            </p>
          </div>

          {/* Marks */}
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-[10px] font-semibold ${scoreClass}`}
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
        <div className="border-t border-[#eeeae8] px-3 pb-3 pt-2">
          <div className="rounded-lg bg-[#f5f4f3] p-3">
            <p className="mb-1 text-[10px] font-semibold text-[#3e3c3a]">
              AI Feedback
            </p>

            <p className="text-[10px] leading-4 text-[#666260]">
              {mapping?.feedback ??
                "Answer analyzed successfully. The response was matched with this question."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}