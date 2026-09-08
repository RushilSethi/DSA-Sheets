'use client';

import { useEffect } from 'react';
import { db } from '@/lib/db';

const sheetNameMigrations: Record<string, string> = {
  '450DSA': '450 DSA',
  'Neetcode150': 'NeetCode 150',
  'StriversSDE': 'Striver SDE Sheet',
};

export function ProgressMigration() {
  useEffect(() => {
    async function runMigration() {
      try {
        const allProgress = await db.progress.toArray();
        const toUpdate = allProgress.filter(p => sheetNameMigrations[p.sheetName]);
        
        for (const item of toUpdate) {
          await db.progress.put({
            ...item,
            sheetName: sheetNameMigrations[item.sheetName]
          });
        }
        
        console.log(`Migrated ${toUpdate.length} progress entries.`);
      } catch (e) {
        console.error('Migration error:', e);
      }
    }
    
    runMigration();
  }, []);

  return null;
}
