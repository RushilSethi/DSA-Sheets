'use client';

import { useEffect, useState, use } from 'react';
import { DynamicBreadcrumb } from '@/components/Breadcrumb';
import { QuestionTable } from '@/components/QuestionTable';
import { FilterBar } from '@/components/FilterBar';
import { getSheetData } from '@/lib/data';
import { Question } from '@/lib/types';
import { useProgress } from '@/hooks/useProgress';
import { matchesStatusFilter } from '@/lib/progressHelpers';
import { getAvailableDifficulties } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function CategoryPage({ 
  params 
}: { 
  params: Promise<{ sheetName: string; categoryName: string }> 
}) {
  const { sheetName, categoryName: encodedCategoryName } = use(params);
  const categoryName = decodeURIComponent(encodedCategoryName);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'none' | 'easy' | 'hard'>('none');
  
  const { progress, isLoading } = useProgress();

  useEffect(() => {
    async function loadData() {
      const data = await getSheetData(sheetName);
      const categoryQuestions = data.filter(q => q.topic === categoryName);
      setQuestions(categoryQuestions);
      setFilteredQuestions(categoryQuestions);
    }
    loadData();
  }, [sheetName, categoryName]);

  useEffect(() => {
    let filtered = [...questions];

    if (difficultyFilter.length > 0) {
      filtered = filtered.filter(q => q.difficulty && difficultyFilter.includes(q.difficulty));
    }

    if (statusFilter.length > 0 && progress) {
      filtered = filtered.filter((q) => {
        const entry = progress.find((p) => p.questionId === q.id);
        return matchesStatusFilter(entry, statusFilter);
      });
    }

    // Apply sorting
    if (sortOrder !== 'none') {
      const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
      filtered = [...filtered].sort((a, b) => {
        const orderA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 2;
        const orderB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 2;
        return sortOrder === 'easy' ? orderA - orderB : orderB - orderA;
      });
    }

    setFilteredQuestions(filtered);
  }, [difficultyFilter, statusFilter, questions, progress, sortOrder]);

  const availableDifficulties = getAvailableDifficulties(questions);
  const hasDifficultyData = availableDifficulties.length > 0;

  if (isLoading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-8 w-48 bg-card rounded" />
      <div className="h-96 bg-card rounded-xl" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <DynamicBreadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{categoryName}</h1>
          <p className="text-muted-foreground">
            Showing {filteredQuestions.length} of {questions.length} questions
          </p>
        </div>
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

      <FilterBar 
        difficulty={difficultyFilter}
        status={statusFilter}
        onDifficultyChange={setDifficultyFilter}
        onStatusChange={setStatusFilter}
        availableDifficulties={availableDifficulties}
        onClear={() => {
          setDifficultyFilter([]);
          setStatusFilter([]);
        }}
      />

      {filteredQuestions.length > 0 ? (
        <QuestionTable questions={filteredQuestions} />
      ) : (
        <div className="text-center py-20 border rounded-xl bg-card">
          <p className="text-muted-foreground text-lg">No questions match your filters.</p>
          <button 
            onClick={() => { setDifficultyFilter([]); setStatusFilter([]); setSortOrder('none'); }}
            className="text-primary hover:underline mt-2 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
