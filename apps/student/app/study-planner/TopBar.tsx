'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, Sparkles, Cloud, CloudOff, Loader2, Check } from 'lucide-react';
import type { ScreenName } from './PlannerClient';
import type { SyncStatus } from './usePlannerState';
import { MODE_META, PLANNER_MODES, type PlannerMode } from './lib/state';

type Props = {
    screen: ScreenName;
    activeChapterName: string | null;
    overall: { done: number; total: number; pct: number };
    onNavDashboard: () => void;
    syncStatus: SyncStatus;
    lastSyncedAt: number | null;
    isAuthed: boolean;
    mode: PlannerMode;
    onChangeMode: (m: PlannerMode) => void;
};

function fmtAgo(ms: number): string {
    if (ms < 5_000) return 'just now';
    if (ms < 60_000) return `${Math.floor(ms / 1000)}s ago`;
    if (ms < 3_600_000) return `${Math.floor(ms / 60_000)}m ago`;
    return `${Math.floor(ms / 3_600_000)}h ago`;
}

function ModeSwitch({ mode, onChange }: { mode: PlannerMode; onChange: (m: PlannerMode) => void }) {
    return (
        <div role="tablist" aria-label="Planner mode" className="dyp-modeswitch">
            {PLANNER_MODES.map((m) => {
                const active = m === mode;
                return (
                    <button
                        key={m}
                        role="tab"
                        aria-selected={active}
                        type="button"
                        onClick={() => onChange(m)}
                        className={['dyp-modeseg', active ? 'dyp-on' : ''].join(' ')}
                    >
                        {MODE_META[m].label}
                    </button>
                );
            })}
        </div>
    );
}

function SyncPill({ status, lastSyncedAt, isAuthed }: { status: SyncStatus; lastSyncedAt: number | null; isAuthed: boolean }) {
    // re-render so the "Saved 5s ago" timer ticks without action
    const [, setTick] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setTick((n) => n + 1), 10_000);
        return () => clearInterval(t);
    }, []);

    if (!isAuthed) {
        return (
            <div className="dyp-tb-pill" title="Sign in to save your progress across devices. Until then, your work is saved on this device only.">
                <CloudOff size={14} style={{ color: 'var(--text-3)' }} />
                <span style={{ color: 'var(--text-3)', fontSize: 12 }}>Local only</span>
            </div>
        );
    }

    if (status === 'syncing') {
        return (
            <div className="dyp-tb-pill" title="Saving your changes to the server…">
                <Loader2 size={14} className="dyp-spin" style={{ color: 'var(--accent)' }} />
                <span style={{ color: 'var(--text-2)', fontSize: 12 }}>Saving…</span>
            </div>
        );
    }

    if (status === 'offline') {
        return (
            <div className="dyp-tb-pill" title="Could not reach the server. Your changes are saved on this device and will sync when you're back online.">
                <CloudOff size={14} style={{ color: 'var(--c-weak)' }} />
                <span style={{ color: 'var(--c-weak)', fontSize: 12 }}>Offline</span>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="dyp-tb-pill" title="The server rejected the save. Your work is still on this device. Refresh or sign in again to retry.">
                <CloudOff size={14} style={{ color: 'var(--c-danger)' }} />
                <span style={{ color: 'var(--c-danger)', fontSize: 12 }}>Save failed</span>
            </div>
        );
    }

    if (status === 'saved' && lastSyncedAt) {
        const ago = Date.now() - lastSyncedAt;
        return (
            <div className="dyp-tb-pill" title={`Last saved ${fmtAgo(ago)}`}>
                <Check size={13} style={{ color: 'var(--c-strong)' }} />
                <span style={{ color: 'var(--text-3)', fontSize: 12 }}>Saved {fmtAgo(ago)}</span>
            </div>
        );
    }

    // idle (signed in but nothing synced yet)
    return (
        <div className="dyp-tb-pill" title="Synced with your account">
            <Cloud size={14} style={{ color: 'var(--c-strong)' }} />
            <span style={{ color: 'var(--text-3)', fontSize: 12 }}>Synced</span>
        </div>
    );
}

export function TopBar({ screen, activeChapterName, overall, onNavDashboard, syncStatus, lastSyncedAt, isAuthed, mode, onChangeMode }: Props) {
    const inChapter = screen === 'chapter';
    const modeTitle = mode === 'class11' ? 'Class 11 Planner' : mode === 'class12' ? 'Class 12 Planner' : 'Dropper Planner';
    return (
        <div className="dyp-topbar">
            <div className="dyp-tb-brand">
                <Link href="/" className="dyp-tb-logo" aria-label="Canvas Classes home">
                    <Layers size={17} strokeWidth={2} color="#1a0f05" />
                </Link>
                <div>
                    <div className="dyp-tb-title">{modeTitle}</div>
                </div>
            </div>
            {inChapter ? (
                <div className="dyp-tb-crumb">
                    <button type="button" className="dyp-tb-back" onClick={onNavDashboard}>
                        <ArrowLeft size={16} />
                        Dashboard
                    </button>
                    <span style={{ color: 'var(--text-4)' }}>·</span>
                    <span style={{ color: 'var(--text)', fontWeight: 600 }}>{activeChapterName ?? ''}</span>
                </div>
            ) : (
                <ModeSwitch mode={mode} onChange={onChangeMode} />
            )}
            <div className="dyp-tb-spacer" />
            <SyncPill status={syncStatus} lastSyncedAt={lastSyncedAt} isAuthed={isAuthed} />
            <button type="button" className="dyp-tb-pill" title="Self-rating happens per chapter — open any chapter and use the Strong / Weak / New pills">
                <Sparkles size={15} style={{ color: 'var(--accent)' }} />
                Quick rate
            </button>
            <div className="dyp-tb-pill dyp-tb-count">
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{overall.done}</span>
                <span style={{ color: 'var(--text-4)' }}>/ {overall.total}</span>
                <span style={{ color: 'var(--text-3)' }}>· {overall.pct}%</span>
            </div>
        </div>
    );
}
