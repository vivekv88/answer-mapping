interface ProcessingStatusProps {
  currentStep: number;
}

const steps = [
  "Uploading documents",
  "Extracting text",
  "Detecting questions",
  "Mapping answers",
  "Generating results",
];

export default function ProcessingStatus({
  currentStep,
}: ProcessingStatusProps) {
  return (
    <div className="mx-auto mt-8 max-w-xl rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold">
        Processing documents
      </h2>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;

          return (
            <div
              key={step}
              className="flex items-center gap-3"
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  completed
                    ? "bg-green-100 text-green-700"
                    : active
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {completed ? "✓" : index + 1}
              </div>

              <span
                className={
                  active
                    ? "font-medium text-gray-900"
                    : "text-gray-500"
                }
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}