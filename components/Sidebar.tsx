
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
            )}

            <aside className={clsx(
                "w-64 border-r border-border flex flex-col justify-between p-6 bg-black shrink-0 z-50 transition-transform duration-300",
                "fixed lg:relative h-full",
                isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div>
                    {/* Header Logo */}
                    <Link href="/" className="mb-10 flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={onClose}>
                        <div className="h-8 w-8 bg-white text-black flex items-center justify-center font-bold font-mono text-lg rounded-sm">S</div>
                        <h1 className="font-bold text-lg tracking-tight">SKILLS.SH</h1>
                    </Link>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        <Link
                            href="/"
                            onClick={onClose}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                isActive('/') ? "text-white bg-surface border border-border" : "text-text-secondary hover:text-white hover:bg-surface/50 border border-transparent"
                            )}
                        >
                            <span className={clsx("material-icons-outlined text-[20px]", isActive('/') ? "" : "group-hover:text-white transition-colors")}>dashboard</span>
                            <span>Overview</span>
                        </Link>
                        <Link
                            href="/all"
                            onClick={onClose}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                isActive('/all') ? "text-white bg-surface border border-border" : "text-text-secondary hover:text-white hover:bg-surface/50 border border-transparent"
                            )}
                        >
                            <span className={clsx("material-icons-outlined text-[20px]", isActive('/all') ? "" : "group-hover:text-white transition-colors")}>view_module</span>
                            <span>All</span>
                        </Link>
                        <Link
                            href="/trending"
                            onClick={onClose}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                isActive('/trending') ? "text-white bg-surface border border-border" : "text-text-secondary hover:text-white hover:bg-surface/50 border border-transparent"
                            )}
                        >
                            <span className={clsx("material-icons-outlined text-[20px]", isActive('/trending') ? "" : "group-hover:text-white transition-colors")}>trending_up</span>
                            <span>Trending (24h)</span>
                        </Link>
                        <Link
                            href="/hot"
                            onClick={onClose}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors group",
                                isActive('/hot') ? "text-white bg-surface border border-border" : "text-text-secondary hover:text-white hover:bg-surface/50 border border-transparent"
                            )}
                        >
                            <span className={clsx("material-icons-outlined text-[20px]", isActive('/hot') ? "" : "group-hover:text-white transition-colors")}>whatshot</span>
                            <span>Hot</span>
                        </Link>
                    </nav>
                </div>

                {/* Bottom Info */}
                <div className="space-y-3 border-t border-border pt-4">
                    <a
                        href="https://skills.sh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-text-secondary hover:text-white transition-colors font-mono"
                    >
                        <span className="material-icons-outlined text-[16px]">language</span>
                        skills.sh
                    </a>
                    <a
                        href="https://github.com/langhaidian/skills-dashboard"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-text-secondary hover:text-white transition-colors font-mono"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        GitHub
                    </a>
                    <div className="text-[10px] text-text-muted font-mono">
                        v0.1.0 · Built with Next.js
                    </div>
                </div>
            </aside>
        </>
    );
}
