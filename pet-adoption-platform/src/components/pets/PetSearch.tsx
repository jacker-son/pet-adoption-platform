'use client';

import { useState } from 'react';

interface PetSearchProps {
    onSearch: (query: string) => void;
    initialQuery?: string;
}

export function PetSearch({ onSearch, initialQuery = '' }: PetSearchProps) {
    const [query, setQuery] = useState(initialQuery);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索宠物名字、品种..."
                className="w-full px-5 py-3 pr-12 bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-full text-[var(--color-foreground)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--color-primary)] text-white rounded-full hover:bg-[var(--color-primary-dark)] transition-colors"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
        </form>
    );
}
