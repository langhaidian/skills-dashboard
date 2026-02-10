import { getHotSkills } from '../../lib/skills';
import Link from 'next/link';

export default async function HotSkillsPage() {
    const skills = await getHotSkills();

    return (
        <main className="flex-1 flex flex-col overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto w-full">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Hot Skills</h1>
                        <p className="text-text-secondary">The hottest skills by popularity right now.</p>
                    </div>
                    <span className="font-mono text-xs text-text-secondary">
                        {skills.length} HOT
                    </span>
                </div>

                <div className="pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {skills.map((skill) => (
                            <div
                                key={`${skill.owner}-${skill.repo}-${skill.name}`}
                                className="group bg-black border border-border rounded-md p-4 hover:border-orange-500 transition-colors flex flex-col justify-between h-32"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors truncate pr-2 w-full" title={skill.name}>
                                        {skill.name}
                                    </h3>
                                    <span className="text-xs font-mono text-orange-400 shrink-0 flex items-center gap-0.5">
                                        <span className="material-icons-outlined text-[12px]">local_fire_department</span>
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

                                    <Link
                                        href={`/skill/${skill.owner}/${skill.repo}/${skill.name}`}
                                        className="text-xs text-text-muted hover:text-white transition-colors"
                                    >
                                        <span className="material-icons-outlined text-[16px]">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
