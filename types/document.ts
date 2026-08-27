export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  coordinateSpace?: "normalized-1000";
}

export interface TextBlock {
  text: string;
  page: number;
  boundingBox: BoundingBox;
}

export interface Question {
  id: string;
  number: string;
  text: string;
  page: number;
  boundingBox: BoundingBox;
  marks?: number;
}

export interface Answer {
  id: string;
  questionNumber?: string;
  text: string;
  page: number;
  boundingBox: BoundingBox;
}

export interface Mapping {
  questionId: string;
  answerId: string | null;

  confidence: number;
  reason: string;

  marksObtained?: number;
  totalMarks?: number;

  feedback?: string;
}

export interface AnalysisResult {
  questions: Question[];
  answers: Answer[];
  mappings: Mapping[];
}