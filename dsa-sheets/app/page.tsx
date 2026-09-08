'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { SheetCard } from '@/components/SheetCard';
import { getSheetData, getSheetMetadata, SHEET_CONFIGS } from '@/lib/data';
import { SheetMetadata } from '@/lib/types';
import { useProgress } from '@/hooks/useProgress';
import { TrendingUp, Zap, Shuffle, Bookmark, Search, Filter, CircleDot, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Sheet descriptions
const sheetDescriptions: Record<string, string> = {
  "450 DSA": "A beginner-friendly sheet that covers topics from basics to advanced, providing a solid foundation in data structures and algorithms.",
  "NeetCode 150": "A balanced sheet that hits a middle point between difficulty and problem range, perfect for interview preparation.",
  "Striver SDE Sheet": "A more advanced sheet ideal for brushing up your skills, focusing on comprehensive problem coverage for SDE roles."
};

const usageTips = [
  {
    icon: Bookmark,
    iconClass: "text-yellow-500",
    bgClass: "bg-yellow-500/10",
    title: "Bookmark the problems that humbled you",
    body: "If you \"got it\" in the shower but blank in the interview, that's not mastery—that's a bookmark waiting to happen. Save it. Revisit it. Stop lying to yourself about Two Sum.",
    action: { label: "Open your bookmarks", href: "/bookmarks" },
  },
  {
    icon: Shuffle,
    iconClass: "text-blue-500",
    bgClass: "bg-blue-500/10",
    title: "Can't pick what to solve? Don't.",
    body: "Spending 25 minutes choosing a problem is not DSA practice. Use Random, filter by topic, and let the app bully you into productivity.",
    action: { label: "Spin the random wheel", href: "/random" },
  },
  {
    icon: CircleDot,
    iconClass: "text-sky-500",
    bgClass: "bg-sky-500/10",
    title: "Mark Attempted before you peek",
    body: "Watched the solution after 4 minutes? Fair. Mark it Attempted so you know it wasn't a clean solve. Your future mock interview will thank you for the honesty.",
    action: { label: "Pick a sheet & start", href: "/sheet/450dsa" },
  },
  {
    icon: Filter,
    iconClass: "text-purple-500",
    bgClass: "bg-purple-500/10",
    title: "Filter \"Not Started\" and eat the frog",
    body: "That DP category sitting at 2%? Open it, filter by Not Started, and do one problem. Not eleven. One. Consistency beats the heroic 6-hour binge you'll never repeat.",
    action: { label: "Open NeetCode 150", href: "/sheet/neetcode150" },
  },
  {
    icon: Search,
    iconClass: "text-pink-500",
    bgClass: "bg-pink-500/10",
    title: "Search instead of doom-scrolling",
    body: "You will not manually hunt for \"Kth largest\" across 400 problems at midnight. Type three words. Click Search. Pretend you had a system all along.",
    action: { label: "Try search", href: "/search" },
  },
  {
    icon: Target,
    iconClass: "text-green-500",
    bgClass: "bg-green-500/10",
    title: "One sheet. One era. No main character arc.",
    body: "450 DSA if you're building foundations. NeetCode if interviews are close. Striver if you enjoy pain. Doing all three at once is how people finish none of them.",
    action: { label: "Start with 450 DSA", href: "/sheet/450dsa" },
  },
];

export default function HomePage() {
  const [sheets, setSheets] = useState<{ metadata: SheetMetadata; completed: number }[]>([]);
  const { progress, isLoading } = useProgress();

  useEffect(() => {
    async function loadSheets() {
      const loadedSheets = await Promise.all(
        SHEET_CONFIGS.map(async (sheet) => {
          const questions = await getSheetData(sheet.slug);
          const metadata = getSheetMetadata(questions, sheet.displayName);
          return { metadata, questions };
        })
      );

      const sheetsWithProgress = loadedSheets.map(({ metadata, questions }) => {
        const completed = progress?.filter(
          (p) => p.sheetName === metadata.name && p.progressStatus === 'completed'
        ).length || 0;
        return { metadata, completed };
      });

      setSheets(sheetsWithProgress);
    }

    if (!isLoading) {
      loadSheets();
    }
  }, [progress, isLoading]);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Master your
            </span>
            <span className="block">DSA Journey</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track progress, stay organized, and crush your coding interview prep with DSA Sheets
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2 bg-card border px-6 py-3 rounded-full shadow-sm">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">3 Sheets • 500+ Problems</span>
          </div>
          <div className="flex items-center gap-2 bg-card border px-6 py-3 rounded-full shadow-sm">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="font-semibold">Offline Progress Tracking</span>
          </div>
        </div>
      </section>

      {/* Quick Actions Section - Subtle Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/random" className="group">
          <Card className="h-full hover:border-primary transition-all duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Shuffle className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <CardTitle>Random Question Generator</CardTitle>
                <CardDescription>Filter by difficulty and topic, then generate</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Pick a problem at random to practice with custom filters</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/bookmarks" className="group">
          <Card className="h-full hover:border-primary transition-all duration-200 cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <Bookmark className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <CardTitle>My Bookmarks</CardTitle>
                <CardDescription>View all your saved problems</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">All your bookmarked questions in one place</p>
            </CardContent>
          </Card>
        </Link>
      </section>

      {/* Search Bar */}
      <section className="max-w-2xl mx-auto">
        <SearchBar />
      </section>

      {/* Sheet Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sheets.length > 0 ? (
          sheets.map((sheet) => (
            <SheetCard 
              key={sheet.metadata.name} 
              sheet={sheet.metadata} 
              completedCount={sheet.completed} 
              description={sheetDescriptions[sheet.metadata.name] || ""} 
            />
          ))
        ) : (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-card animate-pulse border" />
          ))
        )}
      </section>

      {/* How to use this app */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent rounded-3xl p-8 md:p-12 border border-primary/10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold">How to actually use this</h2>
            <p className="text-muted-foreground">
              Not another &quot;track your journey&quot; poster. Real moves for people who&apos;ve reopened the same Array problem twice.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usageTips.map((tip) => (
              <Card key={tip.title} className="bg-card/80 border-border/60 h-full">
                <CardHeader className="space-y-4">
                  <div className={`w-12 h-12 ${tip.bgClass} rounded-xl flex items-center justify-center`}>
                    <tip.icon className={`w-6 h-6 ${tip.iconClass}`} />
                  </div>
                  <CardTitle className="text-lg leading-snug">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.body}</p>
                  <Link
                    href={tip.action.href}
                    className="text-sm font-medium text-primary hover:underline inline-block"
                  >
                    {tip.action.label} →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
