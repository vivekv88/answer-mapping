import { Answer, Mapping, Question } from "@/types/document";

interface MappingPanelProps {
  question: Question | null;
  answer: Answer | null;
  mapping: Mapping | null;
}

export default function MappingPanel({
  question,
  answer,
  mapping,
}: MappingPanelProps) {
  if (!question) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-gray-400">
        Select a question to view its mapping.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Question
        </p>

        <h2 className="mt-2 text-lg font-semibold text-gray-900">
          Q{question.number}
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          {question.text}
        </p>
      </div>

      <div className="mb-6 border-t pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Matching Answer
        </p>

        {answer ? (
          <>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              {answer.text}
            </p>

            <p className="mt-3 text-xs text-gray-400">
              Page {answer.page}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-red-500">
            No matching answer found.
          </p>
        )}
      </div>

      {mapping && (
        <div className="rounded-xl bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              Confidence
            </span>

            <span className="font-semibold text-blue-600">
              {mapping.confidence}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{
                width: `${mapping.confidence}%`,
              }}
            />
          </div>

          <p className="mt-3 text-xs leading-5 text-gray-500">
            {mapping.reason}
          </p>
        </div>
      )}
    </div>
  );
}