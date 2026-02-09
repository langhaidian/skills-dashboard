import { getTrendingSkills } from '../../lib/skills';
import Link from 'next/link';

export default async function TrendingSkillsPage() {
    const skills = await getTrendingSkills();

    return (
        <main className="flex-1 flex flex-col overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Trending Skills (24h)</h1>
                        <p className="text-text-secondary">Skills gaining popularity in the last 24 hours.</p>
                    </div>
                    <span className="font-mono text-xs text-text-secondary">
                        {skills.length} TRENDING
                    </span>
                </div>

                <div className="pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {skills.map((skill) => (
                            <div
                                key={`${skill.owner}-${skill.repo}-${skill.name}`}
                                className="group bg-black border border-border rounded-md p-4 hover:border-green-500 transition-colors flex flex-col justify-between h-32"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white group-hover:text-green-400 transition-colors truncate pr-2 w-full" title={skill.name}>
                                        {skill.name}
                                    </h3>
                                    <span className="text-xs font-mono text-green-400 shrink-0 flex items-center gap-0.5">
                                        <span className="material-icons-outlined text-[12px]">trending_up</span>
                                        #{skill.rank}
                                    </span>
                                </div>

                                <div className="mt-2 mb-auto">
                                    <p className="text-xs text-text-secondary truncate font-mono">
                                        {skill.owner}/{skill.repo}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-2">
                                    <span className="text-xs font-bold text-white flex items-center gap-1">
                                        <span className="material-icons-outlined text-[14px] text-text-muted">download</span>
                                        {skill.downloads}
                                    </span>

                                    <a
                                        href={skill.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-text-muted hover:text-white transition-colors"
                                    >
                                        <span className="material-icons-outlined text-[16px]">open_in_new</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
