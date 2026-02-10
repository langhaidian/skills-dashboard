import { getAllSkills } from '../../lib/skills';
import { SkillCard } from '../../components/SkillCard';
import Link from 'next/link';

const ITEMS_PER_PAGE = 20;

export default async function AllSkillsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const params = await searchParams;
    const currentPage = Math.max(1, parseInt(params.page || '1', 10));

    const allSkills = await getAllSkills();
    const totalPages = Math.ceil(allSkills.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, allSkills.length);
    const skills = allSkills.slice(startIndex, endIndex);

    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-3">
                    <span className="material-icons-outlined text-text-muted">apps</span>
                    <h1 className="text-sm font-bold tracking-tight">All Skills</h1>
                    <span className="text-xs font-mono text-text-muted bg-surface px-2 py-0.5 rounded">
                        {allSkills.length}
                    </span>
                </div>
                <span className="font-mono text-xs text-text-secondary">
                    {startIndex + 1}–{endIndex} of {allSkills.length} · PAGE {currentPage}/{totalPages}
                </span>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 min-h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 h-full" style={{ gridAutoRows: '1fr' }}>
                    {skills.map((skill) => (
                        <SkillCard
                            key={`${skill.owner}-${skill.repo}-${skill.name}`}
                            name={skill.name}
                            owner={skill.owner}
                            repo={skill.repo}
                            rank={skill.rank}
                            downloads={skill.downloads}
                        />
                    ))}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 py-3 px-6 border-t border-border shrink-0">
                <Link
                    href={`/all?page=${currentPage - 1}`}
                    className={`px-3 py-1.5 text-xs font-mono rounded border border-border transition-colors ${currentPage <= 1
                        ? 'opacity-50 pointer-events-none text-text-muted'
                        : 'text-white hover:bg-surface hover:border-white'
                        }`}
                >
                    <span className="material-icons-outlined text-sm align-middle">chevron_left</span>
                    PREV
                </Link>

                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }

                        return (
                            <Link
                                key={pageNum}
                                href={`/all?page=${pageNum}`}
                                className={`w-8 h-8 flex items-center justify-center text-xs font-mono rounded border transition-colors ${pageNum === currentPage
                                    ? 'bg-white text-black border-white'
                                    : 'border-border text-text-secondary hover:border-white hover:text-white'
                                    }`}
                            >
                                {pageNum}
                            </Link>
                        );
                    })}
                </div>

                <Link
                    href={`/all?page=${currentPage + 1}`}
                    className={`px-3 py-1.5 text-xs font-mono rounded border border-border transition-colors ${currentPage >= totalPages
                        ? 'opacity-50 pointer-events-none text-text-muted'
                        : 'text-white hover:bg-surface hover:border-white'
                        }`}
                >
                    NEXT
                    <span className="material-icons-outlined text-sm align-middle">chevron_right</span>
                </Link>
            </div>
        </main>
    );
}
