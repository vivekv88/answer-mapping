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
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="border-b bg-white px-5 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">
            Extracted Questions
          </h2>

          <button
            onClick={() => questions.forEach((question) => {
              const isExpanded = expandedQuestionIds.has(question.id);
              if (allExpanded ? isExpanded : !isExpanded) onExpand(question.id);
            })}
            className="rounded-full border px-3 py-1 text-xs text-gray-600"
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto bg-gray-50 p-3">
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
                onExpand(question.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}