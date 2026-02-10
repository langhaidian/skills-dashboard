'use client';

import { useState, useEffect } from 'react';

export function SyncIndicator({ syncedAt }: { syncedAt: string }) {
    const [relativeTime, setRelativeTime] = useState('');

    useEffect(() => {
        function update() {
            const diff = Date.now() - new Date(syncedAt).getTime();
            const minutes = Math.floor(diff / 60000);
            if (minutes < 1) {
                setRelativeTime('just now');
            } else if (minutes < 60) {
                setRelativeTime(`${minutes}m ago`);
            } else {
                const hours = Math.floor(minutes / 60);
                setRelativeTime(`${hours}h ago`);
            }
        }
        update();
        const timer = setInterval(update, 30000);
        return () => clearInterval(timer);
    }, [syncedAt]);

    return (
        <div className="flex items-center gap-2 font-mono text-xs text-text-secondary">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>SYNCED {relativeTime}</span>
        </div>
    );
}
