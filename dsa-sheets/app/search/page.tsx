'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DynamicBreadcrumb } from '@/components/Breadcrumb';
import { QuestionTable } from '@/components/QuestionTable';
import { getAllQuestions } from '@/lib/data';
import { Question } from '@/lib/types';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<Question[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  const [sortOrder, setSortOrder] = useState<'none' | 'easy' | 'hard'>('none');

  useEffect(() => {
    async function performSearch() {
      setIsSearching(true);
      if (!query) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      const allQuestions = await getAllQuestions();
      let filtered = allQuestions.filter(
        (q) =>
          q.name.toLowerCase().includes(query.toLowerCase()) ||
          q.topic.toLowerCase().includes(query.toLowerCase())
      );

      if (sortOrder !== 'none') {
        const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
        filtered = [...filtered].sort((a, b) => {
          const orderA = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 2;
          const orderB = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 2;
          return sortOrder === 'easy' ? orderA - orderB : orderB - orderA;
        });
      }

      setResults(filtered);
      setIsSearching(false);
    }
    performSearch();
  }, [query, sortOrder]);

  return (
    <div className="space-y-8">
      <DynamicBreadcrumb />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={sortOrder === 'none' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortOrder('none')}
            >
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Default
            </Button>
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
          </div>
        </div>
        <SearchBar defaultQuery={query} />
      </div>

      {isSearching ? (
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-card rounded w-full" />
          <div className="h-64 bg-card rounded w-full" />
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Found {results.length} results for &quot;{query}&quot;
          </p>
          <QuestionTable questions={results} showSheet />
        </div>
      ) : (
        <div className="text-center py-20 border rounded-xl bg-card">
          <p className="text-muted-foreground text-lg">
            {query ? `No results found for "${query}"` : 'Enter a search term above'}
          </p>
        </div>
      )}
    </div>
  );
}

function SearchPageFallback() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-6 w-40 bg-card rounded" />
      <div className="h-10 w-64 bg-card rounded" />
      <div className="h-12 w-full max-w-xl bg-card rounded-full" />
      <div className="h-64 bg-card rounded-xl" />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}
