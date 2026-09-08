import { Progress, ProgressStatus } from './types';

export function getProgressEntry(
  progress: Progress[] | undefined,
  questionId: string
): Progress | undefined {
  return progress?.find((entry) => entry.questionId === questionId);
}

export function isCompleted(entry?: Progress): boolean {
  return entry?.progressStatus === 'completed';
}

export function isAttempted(entry?: Progress): boolean {
  return entry?.progressStatus === 'attempted';
}

export function isBookmarked(entry?: Progress): boolean {
  return entry?.bookmarked ?? false;
}

export function matchesStatusFilter(
  entry: Progress | undefined,
  statusFilter: string[]
): boolean {
  if (statusFilter.length === 0) return true;

  if (statusFilter.includes('Not Started') && !entry?.progressStatus) return true;
  if (statusFilter.includes('Completed') && isCompleted(entry)) return true;
  if (statusFilter.includes('Attempted') && isAttempted(entry)) return true;
  if (statusFilter.includes('Bookmarked') && isBookmarked(entry)) return true;

  return false;
}

export function shouldKeepProgressEntry(entry: {
  progressStatus: ProgressStatus;
  bookmarked: boolean;
}): boolean {
  return !!entry.progressStatus || entry.bookmarked;
}

export function getNextProgressStatus(
  current: ProgressStatus,
  target: 'completed' | 'attempted'
): ProgressStatus {
  return current === target ? null : target;
}
