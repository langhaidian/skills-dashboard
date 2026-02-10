'use client';

import { useMemo } from 'react';

interface TagCloudProps {
    skillNames: string[];
}

// Common keywords to extract from skill names
const STOP_WORDS = new Set(['the', 'a', 'an', 'and', 'or', 'for', 'to', 'in', 'of', 'with', 'on', 'at', 'by', 'is', 'it', 'as', 'do', 'no', 'my', 'up', 'if', 'so', 'be', 'we', 'he', 'me', 'us']);

function extractKeywords(names: string[]): Map<string, number> {
    const counts = new Map<string, number>();
    names.forEach(name => {
        // Split by common separators
        const words = name.toLowerCase().split(/[-_.\s/]+/);
        words.forEach(word => {
            if (word.length > 2 && !STOP_WORDS.has(word) && !/^\d+$/.test(word)) {
                counts.set(word, (counts.get(word) || 0) + 1);
            }
        });
    });
    return counts;
}

const TAG_COLORS = [
    'text-blue-400 hover:text-blue-300',
    'text-purple-400 hover:text-purple-300',
    'text-green-400 hover:text-green-300',
    'text-orange-400 hover:text-orange-300',
    'text-pink-400 hover:text-pink-300',
    'text-cyan-400 hover:text-cyan-300',
    'text-yellow-400 hover:text-yellow-300',
    'text-red-400 hover:text-red-300',
];

export function TagCloud({ skillNames }: TagCloudProps) {
    const tags = useMemo(() => {
        const counts = extractKeywords(skillNames);
        return Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 30);
    }, [skillNames]);

    if (tags.length === 0) return null;

    const maxCount = tags[0][1];
    const minCount = tags[tags.length - 1][1];

    return (
        <div className="tech-card p-4 rounded-md">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Skill Keywords</h3>
                <span className="font-mono text-xs text-text-secondary">TAG CLOUD</span>
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-center py-2">
                {tags.map(([word, count], i) => {
                    const ratio = maxCount === minCount ? 0.5 : (count - minCount) / (maxCount - minCount);
                    const fontSize = 0.7 + ratio * 0.8; // 0.7rem to 1.5rem
                    const opacity = 0.5 + ratio * 0.5;
                    return (
                        <span
                            key={word}
                            className={`font-mono cursor-default transition-all duration-200 hover:scale-110 ${TAG_COLORS[i % TAG_COLORS.length]}`}
                            style={{ fontSize: `${fontSize}rem`, opacity }}
                            title={`${count} skills`}
                        >
                            {word}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}
