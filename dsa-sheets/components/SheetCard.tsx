'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSheetSlug } from '@/lib/data';
import { SheetMetadata } from '@/lib/types';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface SheetCardProps {
  sheet: SheetMetadata;
  completedCount: number;
  description: string;
}

export function SheetCard({ sheet, completedCount, description }: SheetCardProps) {
  const progress = (completedCount / sheet.totalQuestions) * 100;

  return (
    <Link href={`/sheet/${getSheetSlug(sheet.name)}`}>
      <Card className="hover:border-primary transition-all duration-300 group cursor-pointer h-full">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
              {sheet.name}
            </CardTitle>
            <Badge variant="secondary" className="flex gap-1 items-center">
              <BookOpen className="w-3 h-3" />
              {sheet.totalQuestions}
            </Badge>
          </div>
          <CardDescription className="text-sm leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm items-center">
              <span className="text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Progress
              </span>
              <span className="font-medium">{completedCount} / {sheet.totalQuestions}</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500 ease-in-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
