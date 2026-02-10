
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Skill {
    id: string;
    name: string;
    installs: number;
}

const CATEGORY_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'ai', label: 'AI', keywords: ['ai', 'agent', 'llm', 'gpt', 'openai', 'anthropic', 'claude', 'model', 'ml', 'whisper', 'copilot', 'chat'] },
    { key: 'web', label: 'Web', keywords: ['react', 'vue', 'next', 'nuxt', 'svelte', 'css', 'html', 'frontend', 'tailwind', 'web', 'vite'] },
    { key: 'dev', label: 'DevTools', keywords: ['cli', 'terminal', 'git', 'docker', 'dev', 'build', 'test', 'lint', 'tool', 'deploy'] },
    { key: 'design', label: 'Design', keywords: ['design', 'ui', 'ux', 'figma', 'style', 'animation', 'theme'] },
];

function matchesCategory(skillId: string, categoryKey: string): boolean {
    if (categoryKey === 'all') return true;
    const cat = CATEGORY_FILTERS.find(c => c.key === categoryKey);
    if (!cat || !cat.keywords) return true;
    const lower = skillId.toLowerCase();
    return cat.keywords.some(kw => lower.includes(kw));
}

function parseSkillId(id: string): { owner: string; repo: string; name: string } | null {
    // id format: "owner/repo/name" or "owner/repo"
    const parts = id.split('/');
    if (parts.length >= 3) {
        return { owner: parts[0], repo: parts[1], name: parts.slice(2).join('/') };
    } else if (parts.length === 2) {
        return { owner: parts[0], repo: parts[1], name: parts[1] };
    }
    return null;
}

export function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // CMD+K shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                const input = wrapperRef.current?.querySelector('input');
                if (input) input.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Search debounce
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim()) {
                setIsLoading(true);
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20`);
                    const data = await res.json();
                    setResults(data.skills || []);
                    setIsOpen(true);
                    setSelectedIndex(-1);
                } catch (error) {
                    console.error('Search failed', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
                setIsOpen(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Filtered results
    const filteredResults = results.filter(skill => matchesCategory(skill.id, activeCategory));

    const handleSelect = useCallback((skillId: string) => {
        const parsed = parseSkillId(skillId);
        if (parsed) {
            router.push(`/skill/${parsed.owner}/${parsed.repo}/${parsed.name}`);
        } else {
            router.push(`/skill/${skillId}`);
        }
        setIsOpen(false);
        setQuery('');
    }, [router]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || filteredResults.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredResults.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev <= 0 ? filteredResults.length - 1 : prev - 1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSelect(filteredResults[selectedIndex].id);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
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
                onKeyDown={handleKeyDown}
                placeholder="Search resources..."
                className="w-full bg-surface border border-border rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-text-secondary focus:outline-none focus:border-primary/50 transition-all font-mono"
            />
            <div className="absolute right-2 top-2 px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono text-text-secondary pointer-events-none">CMD+K</div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-border rounded-md shadow-2xl overflow-hidden z-50">
                    {/* Category filters */}
                    <div className="flex items-center gap-1 px-3 py-2 border-b border-border/50 overflow-x-auto">
                        {CATEGORY_FILTERS.map(cat => (
                            <button
                                key={cat.key}
                                onClick={() => { setActiveCategory(cat.key); setSelectedIndex(-1); }}
                                className={`px-2 py-0.5 text-[11px] font-mono rounded-full border transition-colors whitespace-nowrap ${activeCategory === cat.key
                                        ? 'bg-white text-black border-white'
                                        : 'border-border text-text-secondary hover:border-white hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Results */}
                    <div className="max-h-[300px] overflow-y-auto">
                        {isLoading ? (
                            <div className="px-4 py-6 text-center text-text-secondary text-sm font-mono">
                                <span className="material-icons-outlined animate-spin text-sm mr-1 align-middle">refresh</span>
                                Searching...
                            </div>
                        ) : filteredResults.length > 0 ? (
                            filteredResults.map((skill, i) => {
                                const parsed = parseSkillId(skill.id);
                                return (
                                    <button
                                        key={skill.id}
                                        onClick={() => handleSelect(skill.id)}
                                        className={`w-full text-left px-4 py-2.5 transition-colors border-b border-border/50 last:border-0 flex justify-between items-center group/item ${i === selectedIndex ? 'bg-neutral-800' : 'hover:bg-neutral-800'
                                            }`}
                                    >
                                        <div className="min-w-0 flex-1 pr-3">
                                            <span className="text-sm text-white font-mono group-hover/item:text-primary transition-colors truncate block">
                                                {skill.name}
                                            </span>
                                            {parsed && (
                                                <span className="text-[11px] text-text-muted font-mono">
                                                    {parsed.owner}/{parsed.repo}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-xs text-text-secondary font-mono bg-surface px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <span className="material-icons-outlined text-[12px]">download</span>
                                                {skill.installs.toLocaleString()}
                                            </span>
                                            <span className="material-icons-outlined text-[14px] text-text-muted">arrow_forward</span>
                                        </div>
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-4 py-6 text-center text-text-secondary text-sm font-mono">
                                <span className="material-icons-outlined text-base mr-1 align-middle">search_off</span>
                                {activeCategory !== 'all'
                                    ? `No "${CATEGORY_FILTERS.find(c => c.key === activeCategory)?.label}" skills found`
                                    : 'No skills found'
                                }
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {filteredResults.length > 0 && (
                        <div className="px-3 py-1.5 border-t border-border/50 flex items-center justify-between text-[10px] font-mono text-text-muted">
                            <span>{filteredResults.length} results</span>
                            <span>↑↓ navigate · ↵ select · esc close</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
