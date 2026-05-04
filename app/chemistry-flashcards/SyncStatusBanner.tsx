'use client';

import { CloudOff, AlertTriangle, RefreshCw } from 'lucide-react';
import type { SyncStatus } from '../hooks/useCardProgress';

interface Props {
    status: SyncStatus;
    pendingWrites: number;
    onRetry?: () => void;
}

export default function SyncStatusBanner({ status, pendingWrites, onRetry }: Props) {
    if (status === 'idle' || status === 'syncing') return null;

    const isOffline = status === 'offline';
    const isError = status === 'error';
    const isQueued = status === 'queued';

    const Icon = isOffline ? CloudOff : isError ? AlertTriangle : RefreshCw;
    const color = isError
        ? 'bg-red-500/10 border-red-500/30 text-red-300'
        : isOffline
            ? 'bg-slate-700/40 border-slate-600/40 text-slate-300'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300';

    const message = isOffline
        ? `You're offline. ${pendingWrites > 0 ? `${pendingWrites} unsaved review${pendingWrites > 1 ? 's' : ''} will sync when you reconnect.` : 'Reviews will sync when you reconnect.'}`
        : isError
            ? `Couldn't reach the server. ${pendingWrites} review${pendingWrites > 1 ? 's' : ''} pending.`
            : isQueued
                ? `${pendingWrites} review${pendingWrites > 1 ? 's' : ''} waiting to sync.`
                : '';

    return (
        <div className={`fixed bottom-4 right-4 z-50 max-w-sm border rounded-xl px-4 py-3 backdrop-blur ${color} flex items-start gap-3 shadow-lg`}>
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="flex-1 text-sm">
                <p>{message}</p>
                {(isError || isQueued) && onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-2 underline hover:text-white text-xs"
                    >
                        Retry now
                    </button>
                )}
            </div>
        </div>
    );
}
