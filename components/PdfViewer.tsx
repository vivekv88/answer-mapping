"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import {
  Answer,
  Question,
} from "@/types/document";

import HighlightOverlay from "./HighLightOverlay";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  type: "question" | "answer";

  pdfUrl: string | null;

  selectedQuestion: Question | null;

  selectedAnswer: Answer | null;
}

export default function PdfViewer({
  type,
  pdfUrl,
  selectedQuestion,
  selectedAnswer,
}: PdfViewerProps) {
  const [numPages, setNumPages] =
    useState<number>(0);

  const [pageWidth, setPageWidth] =
    useState<number>(700);

  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const selectedPageRef =
    useRef<HTMLDivElement | null>(null);

  const selectedItem =
    type === "question"
      ? selectedQuestion
      : selectedAnswer;

  const selectedPage =
    selectedItem?.page ?? null;

  /*
   * Scroll to the selected PDF page.
   */
  useEffect(() => {
    if (
      selectedPageRef.current &&
      selectedPage
    ) {
      selectedPageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [
    selectedPage,
    selectedItem?.id,
  ]);

  /*
   * Calculate a reasonable PDF width based
   * on the viewer container.
   */
  useEffect(() => {
    const updateWidth = () => {
      if (!containerRef.current) {
        return;
      }

      const width =
        containerRef.current.clientWidth;

      setPageWidth(
        Math.max(
          300,
          Math.min(width - 40, 800)
        )
      );
    };

    updateWidth();

    window.addEventListener(
      "resize",
      updateWidth
    );

    return () => {
      window.removeEventListener(
        "resize",
        updateWidth
      );
    };
  }, []);

  if (!pdfUrl) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-400">
        PDF not available
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto bg-gray-200 p-5"
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
        }}
        loading={
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            Loading PDF...
          </div>
        }
        error={
          <div className="flex h-full items-center justify-center text-sm text-red-500">
            Failed to load PDF.
          </div>
        }
      >
        <div className="space-y-8">
          {Array.from(
            { length: numPages },
            (_, index) => {
              const pageNumber =
                index + 1;

              const isSelectedPage =
                selectedPage ===
                pageNumber;

              return (
                <div
                  key={pageNumber}
                  ref={
                    isSelectedPage
                      ? selectedPageRef
                      : undefined
                  }
                  className={`relative mx-auto w-fit transition-all duration-300 ${
                    isSelectedPage
                      ? "rounded-lg ring-4 ring-blue-400/40"
                      : ""
                  }`}
                >
                  <div className="relative bg-white shadow-xl">
                    <Page
                      pageNumber={
                        pageNumber
                      }
                      width={
                        pageWidth
                      }
                      renderTextLayer
                      renderAnnotationLayer
                    />

                    {isSelectedPage &&
                      selectedItem && (
                        <HighlightOverlay
                          item={
                            selectedItem
                          }
                          renderedWidth={pageWidth}
                          renderedHeight={pageWidth * 1.414}
                        />
                      )}
                  </div>

                  <div className="py-2 text-center text-xs text-gray-500">
                    Page {pageNumber}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </Document>
    </div>
  );
}