'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { DynamicBreadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSheetData, getSheetDisplayName, getSheetMetadata } from '@/lib/data';
import { Question, SheetMetadata } from '@/lib/types';
import { useProgress } from '@/hooks/useProgress';
import { CheckCircle2, Circle, List } from 'lucide-react';

// Sheet descriptions
const sheetDescriptions: Record<string, string> = {
  "450 DSA": "A beginner-friendly sheet that covers topics from basics to advanced, providing a solid foundation in data structures and algorithms.",
  "NeetCode 150": "A balanced sheet that hits a middle point between difficulty and problem range, perfect for interview preparation.",
  "Striver SDE Sheet": "A more advanced sheet ideal for brushing up your skills, focusing on comprehensive problem coverage for SDE roles."
};

export default function SheetDetailPage({ params }: { params: Promise<{ sheetName: string }> }) {
  const { sheetName } = use(params);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [metadata, setMetadata] = useState<SheetMetadata | null>(null);
  const { progress, isLoading } = useProgress();

  useEffect(() => {
    async function loadData() {
      const data = await getSheetData(sheetName);
      const displayName = getSheetDisplayName(sheetName);
      const meta = getSheetMetadata(data, displayName);
      setQuestions(data);
      setMetadata(meta);
    }
    loadData();
  }, [sheetName]);

  if (!metadata || isLoading) {
    return <div className="animate-pulse space-y-8">
      <div className="h-8 w-48 bg-card rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => <div key={i} className="h-40 bg-card rounded-xl" />)}
      </div>
    </div>;
  }

  const categories = metadata.categories.map(cat => {
    const catQuestions = questions.filter(q => q.topic === cat);
    const completed = progress?.filter(
      (p) => catQuestions.some((q) => q.id === p.questionId) && p.progressStatus === 'completed'
    ).length || 0;
    
    return {
      name: cat,
      total: catQuestions.length,
      completed,
      percentage: Math.round((completed / catQuestions.length) * 100)
    };
  });

  return (
    <div className="space-y-8">
      <DynamicBreadcrumb />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">{metadata.name}</h1>
          <CardDescription className="text-lg mt-2 max-w-2xl">
            {sheetDescriptions[metadata.name] || "Select a category to start practicing"}
          </CardDescription>
        </div>
        <div className="bg-card border rounded-lg px-6 py-3 flex items-center gap-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{metadata.totalQuestions}</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-500">
              {progress?.filter(
                (p) => p.sheetName === metadata.name && p.progressStatus === 'completed'
              ).length || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link 
            key={cat.name} 
            href={`/sheet/${sheetName}/category/${encodeURIComponent(cat.name)}`}
          >
            <Card className="hover:border-primary transition-all group cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {cat.name}
                  </CardTitle>
                  <List className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{cat.completed} / {cat.total} Completed</span>
                    <span className="font-medium">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-500" 
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
