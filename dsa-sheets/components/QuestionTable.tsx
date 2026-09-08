'use client';

import { Question } from '@/lib/types';
import { useProgress } from '@/hooks/useProgress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Bookmark, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface QuestionTableProps {
  questions: Question[];
  showSheet?: boolean;
}

export function QuestionTable({ questions, showSheet = false }: QuestionTableProps) {
  const { isCompleted, isAttempted, isBookmarked, toggleCompleted, toggleAttempted, toggleBookmarked } =
    useProgress();

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
    <div className="rounded-md border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Status</TableHead>
            <TableHead>Problem</TableHead>
            <TableHead>Difficulty</TableHead>
            {showSheet && <TableHead>Sheet</TableHead>}
            <TableHead>Platform</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map((q) => {
            const completed = isCompleted(q.id);
            const attempted = isAttempted(q.id);
            const bookmarked = isBookmarked(q.id);

            return (
              <TableRow key={q.id} className={cn(completed && 'bg-green-500/5')}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleCompleted(q.id, q.sheetName)}
                  >
                    {completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">
                  <a
                    href={q.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary flex items-center gap-2 group"
                  >
                    {q.name}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  {q.pattern && (
                    <span className="text-[10px] text-muted-foreground block">{q.pattern}</span>
                  )}
                </TableCell>
                <TableCell>
                  {q.difficulty ? (
                    <Badge variant="outline" className={cn('font-normal', getDifficultyColor(q.difficulty))}>
                      {q.difficulty}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                {showSheet && (
                  <TableCell>
                    <Badge variant="outline" className={cn('font-normal', getSheetColor(q.sheetName))}>
                      {q.sheetName}
                    </Badge>
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant="secondary" className="font-normal">
                    {q.platform || 'LeetCode'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn('h-8 w-8', bookmarked && 'text-yellow-500')}
                      onClick={() => toggleBookmarked(q.id, q.sheetName)}
                    >
                      <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current')} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn('h-8 w-8', attempted && 'text-blue-500')}
                      onClick={() => toggleAttempted(q.id, q.sheetName)}
                    >
                      <Circle className={cn('h-4 w-4', attempted && 'fill-current')} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
