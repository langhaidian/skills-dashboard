import { getTrendingSkills } from '../../lib/skills';
import Link from 'next/link';

export default async function TrendingSkillsPage() {
    const skills = await getTrendingSkills();

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-green-400">trending_up</span>
                    <h1 className="text-sm font-bold tracking-tight">Trending Skills</h1>
                    <span className="text-xs font-mono text-text-muted bg-surface px-2 py-0.5 rounded">
                        24h
                    </span>
                </div>
                <span className="font-mono text-xs text-text-secondary">
                    {skills.length} TRENDING
                </span>
            </header>

            {/* Ranked List */}
            <div className="flex-1 overflow-y-auto">
                <div className="divide-y divide-border/50">
                    {skills.map((skill) => (
                        <Link
                            key={`${skill.owner}-${skill.repo}-${skill.name}`}
                            href={`/skill/${skill.owner}/${skill.repo}/${skill.name}`}
                            className="flex items-center gap-4 px-6 py-3 hover:bg-surface/50 transition-colors group"
                        >
                            {/* Rank */}
                            <span className="text-sm font-mono text-green-400 w-8 text-right shrink-0">
                                #{skill.rank}
                            </span>

                            {/* Trend icon */}
                            <span className="material-icons-outlined text-green-400/60 text-[16px] shrink-0">
                                trending_up
                            </span>

                            {/* Name + Owner */}
                            <div className="flex-1 min-w-0">
                                <span className="text-sm font-bold text-white group-hover:text-green-400 transition-colors truncate block">
                                    {skill.name}
                                </span>
                                <span className="text-xs text-text-secondary font-mono truncate block">
                                    {skill.owner}/{skill.repo}
                                </span>
                            </div>

                            {/* Downloads */}
                            <span className="text-xs font-mono text-text-secondary shrink-0 flex items-center gap-1">
                                <span className="material-icons-outlined text-[14px] text-text-muted">download</span>
                                {skill.downloads}
                            </span>

                            {/* Arrow */}
                            <span className="material-icons-outlined text-[16px] text-text-muted group-hover:text-white transition-colors shrink-0">
                                chevron_right
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}

