"use client";

import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";

interface PdfToolbarProps {
  page: number;
  totalPages: number;
  zoom: number;
  onPrevious: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function PdfToolbar({
  page,
  totalPages,
  zoom,
  onPrevious,
  onNext,
  onZoomIn,
  onZoomOut,
}: PdfToolbarProps) {
  return (
    <div className="flex h-12 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-1 rounded-lg border bg-gray-50 p-1">
        <button
          onClick={onZoomOut}
          className="rounded p-1.5 hover:bg-white"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="min-w-12 text-center text-xs font-medium">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={onZoomIn}
          className="rounded p-1.5 hover:bg-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1 rounded-lg border bg-gray-50 p-1">
        <button
          disabled={page <= 1}
          onClick={onPrevious}
          className="rounded p-1.5 hover:bg-white disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="px-2 text-xs font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={onNext}
          className="rounded p-1.5 hover:bg-white disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}