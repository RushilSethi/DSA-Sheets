import Dexie, { Table } from 'dexie';
import { Progress } from './types';

interface LegacyProgress {
  questionId: string;
  status?: 'completed' | 'attempted' | 'bookmarked' | 'none';
  timestamp: number;
  sheetName: string;
  progressStatus?: Progress['progressStatus'];
  bookmarked?: boolean;
}

export class DSAProgressDB extends Dexie {
  progress!: Table<Progress>;

  constructor() {
    super('DSAProgressDB');
    this.version(1).stores({
      progress: 'questionId, status, sheetName',
    });
    this.version(2)
      .stores({
        progress: 'questionId, sheetName, progressStatus, bookmarked',
      })
      .upgrade(async (tx) => {
        await tx
          .table<LegacyProgress>('progress')
          .toCollection()
          .modify((item) => {
            const legacyStatus = item.status;

            if (item.progressStatus !== undefined && item.bookmarked !== undefined) {
              return;
            }

            if (legacyStatus === 'completed') {
              item.progressStatus = 'completed';
              item.bookmarked = false;
            } else if (legacyStatus === 'attempted') {
              item.progressStatus = 'attempted';
              item.bookmarked = false;
            } else if (legacyStatus === 'bookmarked') {
              item.progressStatus = null;
              item.bookmarked = true;
            } else {
              item.progressStatus = null;
              item.bookmarked = false;
            }

            delete item.status;
            item.timestamp = item.timestamp || Date.now();
          });
      });
  }
}

export const db = new DSAProgressDB();
