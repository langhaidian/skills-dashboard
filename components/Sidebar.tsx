
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function Sidebar() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 border-r border-border flex flex-col justify-between p-6 bg-black shrink-0">
            <div>
                {/* Header Logo */}
                <Link href="/" className="mb-10 flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="h-8 w-8 bg-white text-black flex items-center justify-center font-bold font-mono text-lg rounded-sm">S</div>
                    <h1 className="font-bold text-lg tracking-tight">SKILLS.SH</h1>
                </Link>

                {/* Navigation */}
                <nav className="space-y-1">
                    <Link
                        href="/"
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

        </aside>
    );
}
