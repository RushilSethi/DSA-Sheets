export interface Question {
  id: string;
  name: string;
  difficulty?: string;
  topic: string;
  url: string;
  sheetName: string;
  platform?: string;
  pattern?: string;
  leetcodeNumber?: number;
}

export type ProgressStatus = 'completed' | 'attempted' | null;

export interface Progress {
  questionId: string;
  sheetName: string;
  timestamp: number;
  progressStatus: ProgressStatus;
  bookmarked: boolean;
}

export interface SheetMetadata {
  name: string;
  totalQuestions: number;
  categories: string[];
}
