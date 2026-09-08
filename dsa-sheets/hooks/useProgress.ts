import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import {
  getNextProgressStatus,
  getProgressEntry,
  isAttempted,
  isBookmarked,
  isCompleted,
  shouldKeepProgressEntry,
} from '@/lib/progressHelpers';
import { Progress, ProgressStatus } from '@/lib/types';

async function upsertProgress(
  questionId: string,
  sheetName: string,
  updater: (current: Progress) => Pick<Progress, 'progressStatus' | 'bookmarked'>
) {
  const existing = await db.progress.get(questionId);
  const current: Progress = existing ?? {
    questionId,
    sheetName,
    progressStatus: null,
    bookmarked: false,
    timestamp: Date.now(),
  };

  const updated: Progress = {
    ...current,
    ...updater(current),
    sheetName,
    timestamp: Date.now(),
  };

  if (shouldKeepProgressEntry(updated)) {
    await db.progress.put(updated);
  } else {
    await db.progress.delete(questionId);
  }
}

export const useProgress = (sheetName?: string) => {
  const progress = useLiveQuery(
    () =>
      sheetName
        ? db.progress.where('sheetName').equals(sheetName).toArray()
        : db.progress.toArray(),
    [sheetName]
  );

  const toggleCompleted = async (questionId: string, sheetName: string) => {
    await upsertProgress(questionId, sheetName, (current) => ({
      progressStatus: getNextProgressStatus(current.progressStatus, 'completed'),
      bookmarked: current.bookmarked,
    }));
  };

  const toggleAttempted = async (questionId: string, sheetName: string) => {
    await upsertProgress(questionId, sheetName, (current) => ({
      progressStatus: getNextProgressStatus(current.progressStatus, 'attempted'),
      bookmarked: current.bookmarked,
    }));
  };

  const toggleBookmarked = async (questionId: string, sheetName: string) => {
    await upsertProgress(questionId, sheetName, (current) => ({
      progressStatus: current.progressStatus,
      bookmarked: !current.bookmarked,
    }));
  };

  const getEntry = (questionId: string, currentProgress?: Progress[]) =>
    getProgressEntry(currentProgress ?? progress, questionId);

  const getProgressStatus = (questionId: string, currentProgress?: Progress[]): ProgressStatus =>
    getEntry(questionId, currentProgress)?.progressStatus ?? null;

  return {
    progress,
    isLoading: progress === undefined,
    getEntry,
    isCompleted: (questionId: string, currentProgress?: Progress[]) =>
      isCompleted(getEntry(questionId, currentProgress)),
    isAttempted: (questionId: string, currentProgress?: Progress[]) =>
      isAttempted(getEntry(questionId, currentProgress)),
    isBookmarked: (questionId: string, currentProgress?: Progress[]) =>
      isBookmarked(getEntry(questionId, currentProgress)),
    toggleCompleted,
    toggleAttempted,
    toggleBookmarked,
    getProgressStatus,
  };
};
