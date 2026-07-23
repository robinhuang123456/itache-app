'use client';

import { Search, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
}

export default function FilterBar({
  searchQuery,
  onSearchQueryChange,
}: FilterBarProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="搜索城市、IP或车型"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="w-full h-9 pl-3.5 pr-10 text-sm rounded-xl border border-[var(--color-border)] bg-white/90 outline-none focus:border-[var(--color-primary-light)] focus:ring-1 focus:ring-[var(--color-primary-light)]/30 transition-all"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)] pointer-events-none" />
        {searchQuery && (
          <button
            onClick={() => onSearchQueryChange('')}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200/80 flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <X className="w-3 h-3 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}
