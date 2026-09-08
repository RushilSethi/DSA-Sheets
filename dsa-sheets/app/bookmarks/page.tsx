'use client';

import { useEffect, useState } from 'react';
import { DynamicBreadcrumb } from '@/components/Breadcrumb';
import { QuestionTable } from '@/components/QuestionTable';
import { getAllQuestions } from '@/lib/data';
import { Question } from '@/lib/types';
import { useProgress } from '@/hooks/useProgress';
import { isBookmarked, getProgressEntry } from '@/lib/progressHelpers';
import { getAvailableDifficulties } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function BookmarksPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Question[]>([]);
  const [sortOrder, setSortOrder] = useState<'none' | 'easy' | 'hard'>('none');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const { progress, isLoading } = useProgress();

  useEffect(() => {
    async function loadData() {
      setIsDataLoading(true);
      const questions = await getAllQuestions();
      setAllQuestions(questions);
      setIsDataLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!progress) return;

    let filtered = allQuestions.filter((q) => {
      const entry = getProgressEntry(progress, q.id);
      return isBookmarked(entry);
    });

    // Apply sorting
    if (sortOrder !== 'none') {
      const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
      filtered = [...filtered].sort((a, b) => {
        const orderA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 2;
        const orderB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 2;
        return sortOrder === 'easy' ? orderA - orderB : orderB - orderA;
      });
    }

    setBookmarkedQuestions(filtered);
  }, [allQuestions, progress, sortOrder]);

  const hasDifficultyData = getAvailableDifficulties(bookmarkedQuestions).length > 0;
  const isPageLoading = isLoading || isDataLoading;

  return (
    <div className="space-y-8">
      <DynamicBreadcrumb />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Bookmarks</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={sortOrder === 'none' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortOrder('none')}
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Default
            </Button>
            {hasDifficultyData && (
              <>
                <Button
                  variant={sortOrder === 'easy' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortOrder('easy')}
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Easy First
                </Button>
                <Button
                  variant={sortOrder === 'hard' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortOrder('hard')}
                >
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Hard First
                </Button>
              </>
            )}
          </div>
        </div>
        <p className="text-muted-foreground">
          {bookmarkedQuestions.length} bookmarked problem{bookmarkedQuestions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {isPageLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-card rounded-xl" />
        </div>
      ) : bookmarkedQuestions.length > 0 ? (
        <QuestionTable questions={bookmarkedQuestions} showSheet />
      ) : (
        <div className="text-center py-20 border rounded-xl bg-card">
          <p className="text-muted-foreground text-lg">No bookmarks yet</p>
          <p className="text-muted-foreground">Click the bookmark icon on any problem to save it here</p>
        </div>
      )}
    </div>
  );
}
