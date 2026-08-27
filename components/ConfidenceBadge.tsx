interface ConfidenceBadgeProps {
  confidence: number;
}

export default function ConfidenceBadge({
  confidence,
}: ConfidenceBadgeProps) {
  const label =
    confidence >= 80
      ? "High confidence"
      : confidence >= 50
      ? "Medium confidence"
      : "Low confidence";

  const className =
    confidence >= 80
      ? "bg-green-100 text-green-700"
      : confidence >= 50
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}