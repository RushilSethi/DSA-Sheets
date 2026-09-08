'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, X } from 'lucide-react';
import { Badge } from './ui/badge';

interface FilterBarProps {
  difficulty: string[];
  status: string[];
  onDifficultyChange: (val: string[]) => void;
  onStatusChange: (val: string[]) => void;
  onClear: () => void;
  availableDifficulties?: string[];
}

export function FilterBar({ 
  difficulty, 
  status, 
  onDifficultyChange, 
  onStatusChange,
  onClear,
  availableDifficulties = [],
}: FilterBarProps) {
  const statuses = ['Completed', 'Attempted', 'Bookmarked', 'Not Started'];
  const showDifficultyFilter = availableDifficulties.length > 0;

  const toggleDifficulty = (val: string) => {
    if (difficulty.includes(val)) {
      onDifficultyChange(difficulty.filter(d => d !== val));
    } else {
      onDifficultyChange([...difficulty, val]);
    }
  };

  const toggleStatus = (val: string) => {
    if (status.includes(val)) {
      onStatusChange(status.filter(s => s !== val));
    } else {
      onStatusChange([...status, val]);
    }
  };

  const hasFilters = difficulty.length > 0 || status.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {showDifficultyFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-9 gap-2" />}>
            <Filter className="w-4 h-4" />
            Difficulty
            {difficulty.length > 0 && (
              <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal lg:hidden">
                {difficulty.length}
              </Badge>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Difficulty</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableDifficulties.map((d) => (
                <DropdownMenuCheckboxItem
                  key={d}
                  checked={difficulty.includes(d)}
                  onCheckedChange={() => toggleDifficulty(d)}
                >
                  {d}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-9 gap-2" />}>
          <Filter className="w-4 h-4" />
          Status
          {status.length > 0 && (
            <Badge variant="secondary" className="ml-1 rounded-sm px-1 font-normal lg:hidden">
              {status.length}
            </Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statuses.map((s) => (
              <DropdownMenuCheckboxItem
                key={s}
                checked={status.includes(s)}
                onCheckedChange={() => toggleStatus(s)}
              >
                {s}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {hasFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="h-9 gap-2 text-muted-foreground"
        >
          <X className="w-4 h-4" />
          Clear all
        </Button>
      )}

      <div className="ml-auto flex gap-2">
        {difficulty.map(d => (
          <Badge key={d} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {d}
          </Badge>
        ))}
        {status.map(s => (
          <Badge key={s} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {s}
          </Badge>
        ))}
      </div>
    </div>
  );
}
