import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Question } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const DIFFICULTY_ORDER = ['Easy', 'Medium', 'Hard'] as const;

export function getAvailableDifficulties(questions: Question[]): string[] {
  const found = new Set(
    questions.map((q) => q.difficulty).filter((d): d is string => Boolean(d))
  );
  return DIFFICULTY_ORDER.filter((d) => found.has(d));
}

export function getAvailableTopics(questions: Question[]): string[] {
  return Array.from(new Set(questions.map((q) => q.topic))).sort();
}
