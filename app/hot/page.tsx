import { getHotSkills } from '../../lib/skills';
import Link from 'next/link';

export default async function HotSkillsPage() {
    const skills = await getHotSkills();

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-orange-400">local_fire_department</span>
                    <h1 className="text-sm font-bold tracking-tight">Hot Skills</h1>
                    <span className="text-xs font-mono text-orange-400/60 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                        🔥 HOT
                    </span>
                </div>
                <span className="font-mono text-xs text-text-secondary">
                    {skills.length} HOT
                </span>
            </header>

            {/* Content — 2 column large cards */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {skills.map((skill) => (
                        <Link
                            key={`${skill.owner}-${skill.repo}-${skill.name}`}
                            href={`/skill/${skill.owner}/${skill.repo}/${skill.name}`}
                            className="group tech-card rounded-md p-4 hover:border-orange-500 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="min-w-0">
                                    <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors text-base truncate">
                                        {skill.name}
                                    </h3>
                                    <p className="text-xs text-text-secondary font-mono mt-0.5 truncate">
                                        {skill.owner}/{skill.repo}
                                    </p>
                                </div>
                                <span className="text-xs font-mono text-orange-400 shrink-0 flex items-center gap-0.5">
                                    <span className="material-icons-outlined text-[12px]">local_fire_department</span>
                                    #{skill.rank}
                                </span>
                            </div>

                            <div className="flex items-center justify-between mt-3">
                                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                                    <span className="material-icons-outlined text-[16px] text-text-muted">download</span>
                                    {skill.downloads}
                                </span>
                                <span className="material-icons-outlined text-[16px] text-text-muted group-hover:text-orange-400 transition-colors">
                                    arrow_forward
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}

