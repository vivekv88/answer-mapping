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
    <div className="mx-auto mt-8 max-w-xl text-left">
      <div className="space-y-2">
        {steps.map((step, index) => {
          const completed = index < currentStep;
          const active = index === currentStep;

          return (
            <div
              key={step}
              className="flex items-center gap-3"
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ${
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
                    ? "font-medium text-[#ff5a32]"
                    : "text-[#85817f]"
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