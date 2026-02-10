'use client';

import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            {/* Mobile menu button */}
            <button
                className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-surface border border-border text-text-secondary hover:text-white transition-colors"
                onClick={() => setSidebarOpen(true)}
            >
                <span className="material-icons-outlined text-[22px]">menu</span>
            </button>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            {children}
        </>
    );
}
