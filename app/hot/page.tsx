import { getHotSkills } from '../../lib/skills';
import { SkillCard } from '../../components/SkillCard';

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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {skills.map((skill) => (
                        <SkillCard
                            key={`${skill.owner}-${skill.repo}-${skill.name}`}
                            name={skill.name}
                            owner={skill.owner}
                            repo={skill.repo}
                            rank={skill.rank}
                            downloads={skill.downloads}
                            variant="hot"
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
