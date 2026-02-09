
'use client';

import { useState, useEffect, useRef } from 'react';

interface Skill {
    id: string;
    name: string;
    installs: number;
}

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const input = wrapperRef.current?.querySelector('input');
                if (input) {
                    input.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim()) {
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`);
                    const data = await res.json();
                    setResults(data.skills || []);
                    setIsOpen(true);
                } catch (error) {
                    console.error('Search failed', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (skillId: string) => {
        window.location.href = `https://skills.sh/${skillId}`;
    };

    return (
        <div className="relative group w-full" ref={wrapperRef}>
            <span className="absolute left-3 top-2.5 text-text-secondary group-focus-within:text-white transition-colors">
                <span className="material-icons-outlined text-[20px]">search</span>
            </span>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setIsOpen(true)}
                placeholder="Search resources..."
                className="w-full bg-surface border border-border rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-primary/50 transition-all font-mono"
            />
            <div className="absolute right-2 top-2 px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono text-text-secondary pointer-events-none">CMD+K</div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-border rounded-md shadow-2xl overflow-hidden z-50">
                    <div className="max-h-[300px] overflow-y-auto">
                        {results.map((skill) => (
                            <button
                                key={skill.id}
                                onClick={() => handleSelect(skill.id)}
                                className="w-full text-left px-4 py-3 hover:bg-neutral-800 transition-colors border-b border-border/50 last:border-0 flex justify-between items-center group/item"
                            >
                                <span className="text-sm text-white font-mono group-hover/item:text-primary transition-colors truncate pr-4">{skill.name}</span>
                                <span className="text-xs text-text-secondary font-mono bg-surface px-1.5 py-0.5 rounded">{skill.installs.toLocaleString()}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
