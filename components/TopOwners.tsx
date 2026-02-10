'use client';

interface OwnerStat {
    owner: string;
    count: number;
    percentage: number;
}

const AVATARS = ['🧑‍💻', '🤖', '🚀', '⚡', '🔮', '🎯', '💎', '🌟', '🔥', '🧬'];
const BADGE_COLORS = [
    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'bg-gray-400/20 text-gray-300 border-gray-400/30',
    'bg-orange-500/20 text-orange-400 border-orange-500/30',
];

export function TopOwners({ owners }: { owners: OwnerStat[] }) {
    const top = owners.slice(0, 8);

    return (
        <div className="tech-card p-3 rounded-md shrink-0">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Top Contributors</h3>
                <span className="font-mono text-xs text-text-secondary">OWNERS</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {top.map((item, i) => (
                    <a
                        key={item.owner}
                        href={`https://skills.sh/${item.owner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 rounded-md bg-surface/30 hover:bg-surface/60 transition-all group cursor-pointer"
                    >
                        {/* Rank badge or avatar */}
                        <div className="shrink-0">
                            {i < 3 ? (
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${BADGE_COLORS[i]}`}>
                                    #{i + 1}
                                </span>
                            ) : (
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface/50 text-sm">
                                    {AVATARS[i % AVATARS.length]}
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                            <div className="text-xs font-mono truncate group-hover:text-white transition-colors">
                                {item.owner}
                            </div>
                            <div className="text-[10px] font-mono text-text-muted">
                                {item.count} skills
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
