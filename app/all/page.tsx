import { getAllSkills } from '../../lib/skills';
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
    const skills = allSkills.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <main className="flex-1 flex flex-col overflow-hidden p-6">
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-end justify-between mb-4 shrink-0">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white mb-1">All Skills</h1>
                        <p className="text-sm text-text-secondary">Discover and install capabilities for your agent.</p>
                    </div>
                    <span className="font-mono text-xs text-text-secondary">
                        {allSkills.length} SKILLS · PAGE {currentPage}/{totalPages}
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 min-h-0 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {skills.map((skill) => (
                            <div
                                key={`${skill.owner}-${skill.repo}-${skill.name}`}
                                className="group bg-black border border-border rounded-md p-3 hover:border-white transition-colors flex flex-col justify-between h-28"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors truncate pr-2 w-full" title={skill.name}>
                                        {skill.name}
                                    </h3>
                                    <span className="text-xs font-mono text-text-muted shrink-0">
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

                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-2 pt-3 border-t border-border mt-3 shrink-0">
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
                        {/* Show page numbers */}
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
            </div>
        </main>
    );
}
