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

import PdfToolbar from "./PdfToolbar";
import HighlightOverlay from "./HighLightOverlay";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface AnswerSheetViewerProps {
  pdfUrl: string | null;
  isImage: boolean;
  selectedAnswer: Answer | null;
}

export default function AnswerSheetViewer({
  pdfUrl,
  isImage,
  selectedAnswer,
}: AnswerSheetViewerProps) {
  const [numPages, setNumPages] =
    useState(0);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [zoom, setZoom] =
    useState(1);

  const [pageDimensions, setPageDimensions] =
    useState<Record<number, { width: number; height: number }>>({});

  const [imageDimensions, setImageDimensions] =
    useState({ width: 1000, height: 1414 });

  const pageRefs =
    useRef<Record<number, HTMLDivElement | null>>(
      {}
    );

  const viewerRef =
    useRef<HTMLDivElement | null>(null);

  /*
   * Whenever selected answer changes,
   * jump to its page.
   */
  useEffect(() => {
    if (!selectedAnswer || numPages === 0) return;

    const page = selectedAnswer.page;
    setCurrentPage(page);

    let attempts = 0;
    let frame = 0;

    const centerSelectedPage = () => {
      const element = pageRefs.current[page];
      const viewer = viewerRef.current;

      if (!element || !viewer) {
        if (attempts < 8) {
          attempts += 1;
          frame = window.requestAnimationFrame(centerSelectedPage);
        }
        return;
      }

      const elementRect = element.getBoundingClientRect();
      const viewerRect = viewer.getBoundingClientRect();
      const targetTop = viewer.scrollTop + elementRect.top - viewerRect.top - (viewer.clientHeight - elementRect.height) / 2;
      viewer.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "smooth",
      });
    };

    frame = window.requestAnimationFrame(centerSelectedPage);

    return () => window.cancelAnimationFrame(frame);
  }, [selectedAnswer?.id, selectedAnswer?.page, numPages]);

  const scrollToPage = (page: number) => {
    setCurrentPage(page);
    const element = pageRefs.current[page];
    const viewer = viewerRef.current;
    if (!element || !viewer) return;

    const elementRect = element.getBoundingClientRect();
    const viewerRect = viewer.getBoundingClientRect();
    const targetTop = viewer.scrollTop + elementRect.top - viewerRect.top - (viewer.clientHeight - elementRect.height) / 2;
    viewer.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
  };

  if (!pdfUrl) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-400">
        Answer sheet unavailable
      </div>
    );
  }

  const pageWidth =
    700 * zoom;

  if (isImage) {
    const imageHeight = pageWidth * imageDimensions.height / imageDimensions.width;
    return (
      <div className="flex h-full min-h-0 flex-col rounded-xl bg-[#e3e1e0]">
        <PdfToolbar page={1} totalPages={1} zoom={zoom} onPrevious={() => undefined} onNext={() => undefined} onZoomIn={() => setZoom((value) => Math.min(1.5, value + 0.1))} onZoomOut={() => setZoom((value) => Math.max(0.6, value - 0.1))} />
        <div ref={viewerRef} className="min-h-0 flex-1 overflow-auto p-3 sm:p-5">
          <div className="relative mx-auto w-fit bg-white shadow-xl">
            <img src={pdfUrl} alt="Uploaded answer sheet" className="block max-w-none" style={{ width: pageWidth }} onLoad={(event) => setImageDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} />
            {selectedAnswer?.page === 1 && <HighlightOverlay item={selectedAnswer} renderedWidth={pageWidth} renderedHeight={imageHeight} />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col rounded-xl bg-[#e3e1e0]">
      <PdfToolbar
        page={currentPage}
        totalPages={numPages}
        zoom={zoom}
        onPrevious={() =>
          scrollToPage(Math.max(1, currentPage - 1))
        }
        onNext={() =>
          scrollToPage(Math.min(numPages, currentPage + 1))
        }
        onZoomIn={() =>
          setZoom(
            (value) =>
              Math.min(
                1.5,
                value + 0.1
              )
          )
        }
        onZoomOut={() =>
          setZoom(
            (value) =>
              Math.max(
                0.6,
                value - 0.1
              )
          )
        }
      />

      <div
        ref={viewerRef}
        className="min-h-0 flex-1 overflow-auto p-3 sm:p-5"
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={({ numPages }) =>
            setNumPages(numPages)
          }
          loading={
            <div className="flex h-full items-center justify-center">
              Loading answer sheet...
            </div>
          }
        >
          <div className="mx-auto w-fit space-y-8">
            {Array.from(
              { length: numPages },
              (_, index) => {
                const page =
                  index + 1;

                return (
                  <div
                    key={page}
                    ref={(element) => {
                      pageRefs.current[
                        page
                      ] = element;
                    }}
                    className="relative"
                  >
                    <div className="relative overflow-hidden bg-white shadow-xl">
                      <Page
                        pageNumber={page}
                        width={pageWidth}
                        onLoadSuccess={({ width, height }) =>
                          setPageDimensions((current) => ({
                            ...current,
                            [page]: { width, height },
                          }))
                        }
                        renderTextLayer
                        renderAnnotationLayer
                      />

                      {selectedAnswer &&
                        selectedAnswer.page ===
                          page && (
                          <HighlightOverlay
                            item={
                              selectedAnswer
                            }
                            renderedWidth={
                              pageDimensions[page]?.width ?? pageWidth
                            }
                            renderedHeight={
                              pageDimensions[page]?.height ?? pageWidth * 1.414
                            }
                          />
                        )}
                    </div>

                    <div className="py-2 text-center text-xs text-gray-500">
                      Page {page}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </Document>
      </div>
    </div>
  );
}