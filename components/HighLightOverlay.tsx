"use client";

import {
  Answer,
  Question,
} from "@/types/document";

interface HighlightOverlayProps {
  item: Question | Answer;
  renderedWidth: number;
  renderedHeight: number;
}

export default function HighlightOverlay({
  item,
  renderedWidth,
  renderedHeight,
}: HighlightOverlayProps) {
  const {
    x,
    y,
    width,
    height,
  } = item.boundingBox;

  const scaleX = renderedWidth / 1000;
  const scaleY = renderedHeight / 1000;

  return (
    <div
      className="pointer-events-none absolute z-30 rounded-md border-2 border-green-500 bg-green-400/25"
      style={{
        left: x * scaleX,
        top: y * scaleY,
        width: width * scaleX,
        height: height * scaleY,
      }}
    >
      <div className="absolute -top-6 left-0 rounded bg-green-600 px-2 py-0.5 text-[10px] font-semibold text-white">
        Matched
      </div>
    </div>
  );
}