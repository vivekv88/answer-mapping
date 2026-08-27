"use client";

import { Question, Mapping } from "@/types/document";
import QuestionCard from "./QuestionCard";

interface QuestionListProps {
  questions: Question[];
  mappings: Mapping[];
  selectedQuestionId: string | null;
  expandedQuestionIds: Set<string>;
  onSelect: (id: string) => void;
  onExpand: (id: string) => void;
}

export default function QuestionList({
  questions,
  mappings,
  selectedQuestionId,
  expandedQuestionIds,
  onSelect,
  onExpand,
}: QuestionListProps) {
  const getMapping = (
    questionId: string
  ) =>
    mappings.find(
      (mapping) =>
        mapping.questionId === questionId
    );

  const allExpanded = questions.length > 0 && questions.every((question) => expandedQuestionIds.has(question.id));

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f7f6f5]">
      {/* Header */}
      <div className="border-b border-[#e7e4e2] bg-[#f7f6f5] px-4 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-[#3c3b3a]">
            Extracted Questions <span className="font-normal text-[#9a9795]">(from question paper)</span>
          </h2>

          <button
            onClick={() => questions.forEach((question) => {
              const isExpanded = expandedQuestionIds.has(question.id);
              if (allExpanded ? isExpanded : !isExpanded) onExpand(question.id);
            })}
            className="rounded-full bg-white px-3 py-1.5 text-[10px] font-medium text-[#555250] shadow-sm"
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-[#f7f6f5] px-3 pb-4">
        {questions.map((question) => {
          const mapping =
            getMapping(question.id);

          const selected =
            selectedQuestionId ===
            question.id;

          const expanded = expandedQuestionIds.has(question.id);

          return (
            <QuestionCard
              key={question.id}
              question={question}
              mapping={mapping}
              selected={selected}
              expanded={expanded}
              onClick={() => {
                onSelect(question.id);
              }}
              onToggleExpand={() => onExpand(question.id)}
            />
          );
        })}
      </div>
    </div>
  );
}