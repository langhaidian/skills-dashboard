'use client';

import { useMemo } from 'react';

interface CategoryPieChartProps {
    skillNames: string[];
}

const CATEGORIES: { key: string; keywords: string[]; color: string; label: string }[] = [
    {
        key: 'ai',
        keywords: ['ai', 'agent', 'llm', 'gpt', 'openai', 'anthropic', 'claude', 'gemini', 'model', 'ml', 'machine', 'learning', 'whisper', 'sam', 'vision', 'copilot', 'chat'],
        color: '#8b5cf6',
        label: 'AI / ML',
    },
    {
        key: 'web',
        keywords: ['react', 'vue', 'next', 'nuxt', 'svelte', 'angular', 'css', 'html', 'frontend', 'front-end', 'tailwind', 'web', 'dom', 'browser', 'vite'],
        color: '#3b82f6',
        label: 'Web',
    },
    {
        key: 'design',
        keywords: ['design', 'ui', 'ux', 'figma', 'style', 'layout', 'animation', 'motion', 'typography', 'color', 'theme'],
        color: '#ec4899',
        label: 'Design',
    },
    {
        key: 'dev',
        keywords: ['cli', 'terminal', 'git', 'docker', 'dev', 'build', 'test', 'debug', 'lint', 'format', 'tool', 'script', 'deploy', 'ci', 'cd'],
        color: '#10b981',
        label: 'DevTools',
    },
    {
        key: 'data',
        keywords: ['data', 'database', 'sql', 'api', 'rest', 'graphql', 'json', 'csv', 'scrape', 'fetch', 'analytics'],
        color: '#f59e0b',
        label: 'Data',
    },
    {
        key: 'docs',
        keywords: ['doc', 'readme', 'markdown', 'write', 'content', 'blog', 'seo', 'text', 'guide', 'tutorial', 'best-practice', 'guidelines', 'practices'],
        color: '#06b6d4',
        label: 'Docs',
    },
];

interface CategoryItem {
    key: string;
    label: string;
    color: string;
    count: number;
    pct: number;       // exact percentage for gradient
    display: string;   // display string e.g. "32%"
}

function classifySkills(names: string[]): CategoryItem[] {
    const counts: Record<string, number> = {};
    let otherCount = 0;
    const total = names.length || 1;

    for (const name of names) {
        const lower = name.toLowerCase();
        let matched = false;

        for (const cat of CATEGORIES) {
            if (cat.keywords.some(kw => lower.includes(kw))) {
                counts[cat.key] = (counts[cat.key] || 0) + 1;
                matched = true;
                break;
            }
        }

        if (!matched) otherCount++;
    }

    const result: CategoryItem[] = CATEGORIES
        .filter(cat => counts[cat.key])
        .map(cat => ({
            key: cat.key,
            label: cat.label,
            color: cat.color,
            count: counts[cat.key],
            pct: (counts[cat.key] / total) * 100,
            display: `${Math.round((counts[cat.key] / total) * 100)}%`,
        }))
        .sort((a, b) => b.count - a.count);

    if (otherCount > 0) {
        result.push({
            key: 'other',
            label: 'Other',
            color: '#6b7280',
            count: otherCount,
            pct: (otherCount / total) * 100,
            display: `${Math.round((otherCount / total) * 100)}%`,
        });
    }

    return result;
}

export function CategoryPieChart({ skillNames }: CategoryPieChartProps) {
    const categories = useMemo(() => classifySkills(skillNames), [skillNames]);

    // Build conic-gradient with exact (non-rounded) percentages
    const gradient = useMemo(() => {
        let acc = 0;
        const stops: string[] = [];
        for (const cat of categories) {
            stops.push(`${cat.color} ${acc}% ${acc + cat.pct}%`);
            acc += cat.pct;
        }
        return `conic-gradient(from 0deg, ${stops.join(', ')})`;
    }, [categories]);

    return (
        <div className="tech-card p-3 rounded-md shrink-0">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Skill Categories</h3>
                <span className="font-mono text-xs text-text-secondary">DISTRIBUTION</span>
            </div>

            <div className="flex items-center gap-6">
                {/* Pie */}
                <div
                    className="w-[72px] h-[72px] rounded-full shrink-0"
                    style={{
                        background: gradient,
                        boxShadow: '0 0 0 2px var(--color-border)',
                    }}
                />

                {/* Legend */}
                <div className="flex-1 grid grid-cols-3 gap-x-6 gap-y-1.5">
                    {categories.map(cat => (
                        <div key={cat.key} className="flex items-center gap-1.5">
                            <span
                                className="w-2.5 h-2.5 rounded-sm shrink-0"
                                style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-[11px] font-mono text-text-secondary whitespace-nowrap">
                                {cat.label}
                            </span>
                            <span className="text-[11px] font-mono text-text-muted ml-auto">
                                {cat.display}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
