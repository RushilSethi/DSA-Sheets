import { map450DSA } from './mappers/map450DSA';
import { mapNeetcode150 } from './mappers/mapNeetcode150';
import { mapStriversSDE } from './mappers/mapStriversSDE';
import { Question, SheetMetadata } from './types';

import dsa450Data from '@/data/450DSA.json';
import neetcode150Data from '@/data/Neetcode150.json';
import striversSDEData from '@/data/StriversSDE.json';

export const SHEET_CONFIGS = [
  {
    slug: '450dsa',
    displayName: '450 DSA',
    map: () => map450DSA(dsa450Data),
  },
  {
    slug: 'neetcode150',
    displayName: 'NeetCode 150',
    map: () => mapNeetcode150(neetcode150Data),
  },
  {
    slug: 'strivers-sde',
    displayName: 'Striver SDE Sheet',
    map: () => mapStriversSDE(striversSDEData),
  },
] as const;

const SLUG_ALIASES: Record<string, string> = {
  '450-dsa': '450dsa',
  'neetcode-150': 'neetcode150',
  'striver-sde-sheet': 'strivers-sde',
};

export function normalizeSheetSlug(slug: string): string {
  return SLUG_ALIASES[slug] ?? slug;
}

export function getSheetDisplayName(slug: string): string {
  const normalized = normalizeSheetSlug(slug);
  const config = SHEET_CONFIGS.find((sheet) => sheet.slug === normalized);
  return config?.displayName ?? slug.replace(/-/g, ' ');
}

export function getSheetSlug(displayName: string): string {
  const config = SHEET_CONFIGS.find((sheet) => sheet.displayName === displayName);
  return config?.slug ?? displayName.toLowerCase().replace(/\s+/g, '-');
}

export async function getAllQuestions(): Promise<Question[]> {
  return SHEET_CONFIGS.flatMap((sheet) => sheet.map());
}

export async function getSheetData(sheetName: string): Promise<Question[]> {
  const normalized = normalizeSheetSlug(sheetName);
  const config = SHEET_CONFIGS.find((sheet) => sheet.slug === normalized);

  if (!config) {
    throw new Error(`Unknown sheet: ${sheetName}`);
  }

  return config.map();
}

export function getSheetMetadata(questions: Question[], name: string): SheetMetadata {
  const categories = Array.from(new Set(questions.map((q) => q.topic)));
  return {
    name,
    totalQuestions: questions.length,
    categories,
  };
}
