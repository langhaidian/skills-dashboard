import Link from 'next/link';

type SkillCardVariant = 'default' | 'trending' | 'hot';

interface SkillCardProps {
    name: string;
    owner: string;
    repo: string;
    rank: number;
    downloads: string | number;
    variant?: SkillCardVariant;
}

const VARIANT_CONFIG = {
    default: {
        hoverBorder: 'hover:border-blue-500',
        hoverText: 'group-hover:text-blue-400',
        badgeColor: 'text-text-muted',
        icon: null as string | null,
    },
    trending: {
        hoverBorder: 'hover:border-green-500',
        hoverText: 'group-hover:text-green-400',
        badgeColor: 'text-green-400',
        icon: 'trending_up',
    },
    hot: {
        hoverBorder: 'hover:border-orange-500',
        hoverText: 'group-hover:text-orange-400',
        badgeColor: 'text-orange-400',
        icon: 'local_fire_department',
    },
};

export function SkillCard({ name, owner, repo, rank, downloads, variant = 'default' }: SkillCardProps) {
    const config = VARIANT_CONFIG[variant];

    return (
        <div
            className={`group tech-card rounded-md p-3 ${config.hoverBorder} transition-all flex flex-col justify-between min-h-[104px]`}
        >
            {/* Top: Name + Rank */}
            <div className="flex justify-between items-start">
                <h3
                    className={`font-bold text-white ${config.hoverText} transition-colors truncate pr-2 text-sm`}
                    title={name}
                >
                    {name}
                </h3>
                <span className={`text-xs font-mono ${config.badgeColor} shrink-0 flex items-center gap-0.5`}>
                    {config.icon && (
                        <span className="material-icons-outlined text-[12px]">{config.icon}</span>
                    )}
                    #{rank}
                </span>
            </div>

            {/* Middle: Owner/Repo */}
            <p className="text-xs text-text-secondary truncate font-mono mt-1">
                {owner}/{repo}
            </p>

            {/* Bottom: Downloads + Link */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                    <span className="material-icons-outlined text-[14px] text-text-muted">download</span>
                    {downloads}
                </span>

                <Link
                    href={`/skill/${owner}/${repo}/${name}`}
                    className="text-xs text-text-muted hover:text-white transition-colors"
                >
                    <span className="material-icons-outlined text-[16px]">arrow_forward</span>
                </Link>
            </div>
        </div>
    );
}
