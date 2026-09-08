'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps {
  defaultQuery?: string;
}

export function SearchBar({ defaultQuery = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultQuery);
  const router = useRouter();

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto flex gap-2 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search questions across all sheets..."
          className="pl-10 h-12 rounded-full border-muted-foreground/20 focus:border-primary transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Button type="submit" className="h-12 rounded-full px-6 shrink-0" disabled={!query.trim()}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
