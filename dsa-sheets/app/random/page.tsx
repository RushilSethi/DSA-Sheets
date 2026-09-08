'use client';

import { useEffect, useMemo, useState } from 'react';
import { DynamicBreadcrumb } from '@/components/Breadcrumb';
import { getAllQuestions, SHEET_CONFIGS } from '@/lib/data';
import { Question } from '@/lib/types';
import { useProgress } from '@/hooks/useProgress';
import { Button } from '@/components/ui/button';
import { Shuffle, ExternalLink, CheckCircle2, Circle, Bookmark as BookmarkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, getAvailableDifficulties, getAvailableTopics } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DEFAULT_SHEET = '450 DSA';

export default function RandomGeneratorPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [selectedSheet, setSelectedSheet] = useState(DEFAULT_SHEET);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const { isCompleted, isAttempted, isBookmarked, toggleCompleted, toggleAttempted, toggleBookmarked } =
    useProgress();

  useEffect(() => {
    async function initialize() {
      const questions = await getAllQuestions();
      setAllQuestions(questions);

      const defaultQuestions = questions.filter((q) => q.sheetName === DEFAULT_SHEET);
      setSelectedTopics(getAvailableTopics(defaultQuestions));
      setSelectedDifficulties(getAvailableDifficulties(defaultQuestions));
    }

    initialize();
  }, []);

  const sheetQuestions = useMemo(
    () => allQuestions.filter((q) => q.sheetName === selectedSheet),
    [allQuestions, selectedSheet]
  );

  const availableTopics = useMemo(() => getAvailableTopics(sheetQuestions), [sheetQuestions]);
  const availableDifficulties = useMemo(
    () => getAvailableDifficulties(sheetQuestions),
    [sheetQuestions]
  );

  const filteredQuestions = useMemo(() => {
    if (selectedTopics.length === 0) return [];

    let filtered = sheetQuestions.filter((q) => selectedTopics.includes(q.topic));

    if (availableDifficulties.length > 0) {
      if (selectedDifficulties.length === 0) return [];
      filtered = filtered.filter(
        (q) => q.difficulty && selectedDifficulties.includes(q.difficulty)
      );
    }

    return filtered;
  }, [sheetQuestions, selectedTopics, selectedDifficulties, availableDifficulties]);

  useEffect(() => {
    if (currentQuestion && !filteredQuestions.some((q) => q.id === currentQuestion.id)) {
      setCurrentQuestion(null);
    }
  }, [filteredQuestions, currentQuestion]);

  const handleSheetChange = (displayName: string) => {
    setSelectedSheet(displayName);

    const questions = allQuestions.filter((q) => q.sheetName === displayName);
    setSelectedTopics(getAvailableTopics(questions));
    setSelectedDifficulties(getAvailableDifficulties(questions));
    setCurrentQuestion(null);
  };

  const generateRandomQuestion = () => {
    if (filteredQuestions.length === 0) return;

    let pool = filteredQuestions;
    if (currentQuestion && filteredQuestions.length > 1) {
      pool = filteredQuestions.filter((q) => q.id !== currentQuestion.id);
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    setCurrentQuestion(pool[randomIndex]);
  };

  const handleStatusToggle = (
    questionId: string,
    targetStatus: 'completed' | 'attempted' | 'bookmarked',
    sheetName: string
  ) => {
    if (targetStatus === 'completed') toggleCompleted(questionId, sheetName);
    if (targetStatus === 'attempted') toggleAttempted(questionId, sheetName);
    if (targetStatus === 'bookmarked') toggleBookmarked(questionId, sheetName);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'hard':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSheetColor = (sheetName: string) => {
    if (sheetName.includes('450')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    if (sheetName.includes('Neet')) return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    if (sheetName.includes('Striver')) return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-8">
      <DynamicBreadcrumb />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Random Question Generator</h1>
          <p className="text-muted-foreground mt-2">
            Pick a sheet, filter by topic{availableDifficulties.length > 0 ? ' and difficulty' : ''}, then generate a random question.
          </p>
        </div>
        <Button
          variant="default"
          className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          onClick={generateRandomQuestion}
          disabled={filteredQuestions.length === 0}
        >
          <Shuffle className="w-5 h-5 mr-2" />
          Generate Random Question
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Filters</CardTitle>
              <CardDescription>Select one sheet and refine by topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Sheet
                </h3>
                <div className="space-y-2">
                  {SHEET_CONFIGS.map((sheet) => (
                    <label
                      key={sheet.slug}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sheet"
                        checked={selectedSheet === sheet.displayName}
                        onChange={() => handleSheetChange(sheet.displayName)}
                        className="accent-primary"
                      />
                      <span className="text-sm">{sheet.displayName}</span>
                    </label>
                  ))}
                </div>
              </div>

              {availableDifficulties.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Difficulty
                  </h3>
                  <div className="space-y-2">
                    {availableDifficulties.map((diff) => (
                      <label key={diff} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          id={diff}
                          checked={selectedDifficulties.includes(diff)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedDifficulties([...selectedDifficulties, diff]);
                            } else {
                              setSelectedDifficulties(
                                selectedDifficulties.filter((d) => d !== diff)
                              );
                            }
                          }}
                        />
                        <span className="text-sm">{diff}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                    Topics
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => setSelectedTopics(availableTopics)}
                    >
                      All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2"
                      onClick={() => setSelectedTopics([])}
                    >
                      None
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableTopics.map((topic) => (
                    <label key={topic} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        id={topic}
                        checked={selectedTopics.includes(topic)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTopics([...selectedTopics, topic]);
                          } else {
                            setSelectedTopics(selectedTopics.filter((t) => t !== topic));
                          }
                        }}
                      />
                      <span className="text-sm truncate">{topic}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}{' '}
                  match your filters
                </p>
                {selectedTopics.length === 0 && (
                  <p className="text-sm text-amber-500 mt-1">Select at least one topic</p>
                )}
                {availableDifficulties.length > 0 && selectedDifficulties.length === 0 && (
                  <p className="text-sm text-amber-500 mt-1">
                    Select at least one difficulty
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {currentQuestion ? (
            <Card>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-3">
                  {currentQuestion.difficulty && (
                    <Badge
                      variant="outline"
                      className={cn('py-1.5', getDifficultyColor(currentQuestion.difficulty))}
                    >
                      {currentQuestion.difficulty}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={cn('py-1.5', getSheetColor(currentQuestion.sheetName))}
                  >
                    {currentQuestion.sheetName}
                  </Badge>
                  <Badge variant="secondary" className="py-1.5">
                    {currentQuestion.platform || 'LeetCode'}
                  </Badge>
                  {currentQuestion.pattern && (
                    <Badge variant="outline" className="py-1.5">
                      {currentQuestion.pattern}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl">{currentQuestion.name}</CardTitle>
                <CardDescription>Topic: {currentQuestion.topic}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 border border-border"
                    onClick={() =>
                      handleStatusToggle(currentQuestion.id, 'completed', currentQuestion.sheetName)
                    }
                  >
                    {isCompleted(currentQuestion.id) ? (
                      <CheckCircle2 className="h-7 w-7 text-green-500" />
                    ) : (
                      <Circle className="h-7 w-7 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-12 w-12 border border-border',
                      isBookmarked(currentQuestion.id) &&
                        'text-yellow-500 border-yellow-500/20 bg-yellow-500/10'
                    )}
                    onClick={() =>
                      handleStatusToggle(currentQuestion.id, 'bookmarked', currentQuestion.sheetName)
                    }
                  >
                    <BookmarkIcon
                      className={cn(
                        'h-6 w-6',
                        isBookmarked(currentQuestion.id) && 'fill-current'
                      )}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-12 w-12 border border-border',
                      isAttempted(currentQuestion.id) && 'text-blue-500'
                    )}
                    onClick={() =>
                      handleStatusToggle(currentQuestion.id, 'attempted', currentQuestion.sheetName)
                    }
                  >
                    <Circle
                      className={cn(
                        'h-6 w-6',
                        isAttempted(currentQuestion.id) && 'fill-current'
                      )}
                    />
                  </Button>
                  <a
                    href={currentQuestion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button className="w-full h-12 text-lg font-semibold">
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Solve Problem
                    </Button>
                  </a>
                  <Button variant="secondary" className="h-12" onClick={generateRandomQuestion}>
                    <Shuffle className="w-5 h-5 mr-2" />
                    New Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-16">
                <Shuffle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No question selected yet</h3>
                <p className="text-muted-foreground mb-6">
                  {filteredQuestions.length === 0
                    ? 'Adjust your filters to include at least one topic'
                    : 'Click "Generate Random Question" to get started'}
                </p>
                <Button
                  variant="default"
                  onClick={generateRandomQuestion}
                  disabled={filteredQuestions.length === 0}
                >
                  <Shuffle className="w-5 h-5 mr-2" />
                  Generate Random Question
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
