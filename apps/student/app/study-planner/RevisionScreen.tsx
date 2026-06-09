'use client';

import { useMemo } from 'react';
import { RotateCw, Clock, Check } from 'lucide-react';
import type { ChapterPlanItem } from './planner-data';
import {
    revisionEntries,
    revisionRetention,
    REV_STAGE_LABEL,
    type PlannerState,
    type RevisionItem,
} from './lib/state';
import { Ring } from './Ring';

type Props = {
    catalog: ChapterPlanItem[];
    state: PlannerState;
    today: string;
    onChapter: (id: string) => void;
    onRecalled: (chapterId: string) => void;
    onForgot: (chapterId: string) => void;
};

function fmtShort(iso: string): string {
    const d = new Date(iso + 'T12:00:00Z');
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function agoText(n: number | null): string {
    if (n === null) return 'new';
    if (n <= 0) return 'today';
    if (n === 1) return 'yesterday';
    return `${n} days ago`;
}

export function RevisionScreen({ catalog, state, today, onChapter, onRecalled, onForgot }: Props) {
    const items = useMemo(() => revisionEntries(catalog, state, today), [catalog, state, today]);
    const due = items.filter((x) => x.bucket === 'due').sort((a, b) => (a.dueOn < b.dueOn ? -1 : 1));
    const tomorrow = items.filter((x) => x.bucket === 'tomorrow');
    const week = items.filter((x) => x.bucket === 'week').sort((a, b) => (a.dueOn < b.dueOn ? -1 : 1));
    const later = items.filter((x) => x.bucket === 'later').sort((a, b) => (a.dueOn < b.dueOn ? -1 : 1));
    const retention = revisionRetention(items);

    return (
        <div className="dyp-wrap dyp-narrow">
            <div className="dyp-eyebrow">JEE 2027 · Chemistry</div>
            <div className="dyp-plan-head">
                <h1 className="dyp-h1">Revision queue</h1>
                <p className="dyp-hero-desc" style={{ margin: '10px 0 0' }}>
                    Spaced repetition keeps chapters from fading. Recall a topic and it comes back at 1 → 3 → 7 → 21 → 45 day gaps. Forget it, and it resets to tomorrow.
                </p>
            </div>

            <div className="dyp-rev-stats">
                <div className="dyp-rev-stat dyp-hot">
                    <Ring pct={due.length ? 100 : 0} size={54} stroke={6} color="var(--c-new)">
                        <span className="dyp-rs-num">{due.length}</span>
                    </Ring>
                    <div>
                        <div className="dyp-rs-lab">Due today</div>
                        <div className="dyp-rs-sub">recall these now</div>
                    </div>
                </div>
                <div className="dyp-rev-stat">
                    <div className="dyp-rs-big">{items.length}</div>
                    <div>
                        <div className="dyp-rs-lab">In rotation</div>
                        <div className="dyp-rs-sub">chapters tracked</div>
                    </div>
                </div>
                <div className="dyp-rev-stat">
                    <div className="dyp-rs-big">{retention}%</div>
                    <div>
                        <div className="dyp-rs-lab">Retained</div>
                        <div className="dyp-rs-sub">reached week-3+ gaps</div>
                    </div>
                </div>
            </div>

            <section className="dyp-ch-sec" style={{ marginTop: 26 }}>
                <div className="dyp-sec-head">
                    <RotateCw size={18} style={{ color: 'var(--c-new)' }} />
                    <h2 className="dyp-sec-title">Due today</h2>
                    <span className="dyp-loop-count">{due.length}</span>
                </div>
                {due.length === 0 ? (
                    <div className="dyp-card dyp-pad dyp-rev-allclear">
                        <Check size={20} style={{ color: 'var(--c-strong)' }} />
                        Nothing due — your memory&apos;s fresh. New items appear here a day after you finish a chapter.
                    </div>
                ) : (
                    <div className="dyp-due-grid">
                        {due.map((x) => (
                            <DueCard key={x.chapter.chapterId} item={x} onOpen={onChapter} onRecalled={onRecalled} onForgot={onForgot} />
                        ))}
                    </div>
                )}
            </section>

            <section className="dyp-ch-sec">
                <div className="dyp-sec-head">
                    <Clock size={18} style={{ color: 'var(--accent)' }} />
                    <h2 className="dyp-sec-title">Coming up</h2>
                </div>
                <div className="dyp-upcoming">
                    <UpGroup label="Tomorrow" list={tomorrow} onChapter={onChapter} />
                    <UpGroup label="This week" list={week} onChapter={onChapter} />
                    <UpGroup label="Later" list={later} onChapter={onChapter} />
                </div>
            </section>
        </div>
    );
}

function DueCard({
    item, onOpen, onRecalled, onForgot,
}: {
    item: RevisionItem;
    onOpen: (id: string) => void;
    onRecalled: (id: string) => void;
    onForgot: (id: string) => void;
}) {
    return (
        <div className="dyp-duecard">
            <div className="dyp-dc-top">
                <span className="dyp-dc-stage">
                    Stage {item.stage + 1} · {REV_STAGE_LABEL[Math.min(item.stage, REV_STAGE_LABEL.length - 1)]}
                </span>
                {item.chapter.highYield && (
                    <span className="dyp-hy dyp-sm">
                        <Flame12 />
                        High yield
                    </span>
                )}
            </div>
            <button type="button" className="dyp-dc-name" onClick={() => onOpen(item.chapter.chapterId)}>
                {item.chapter.name}
            </button>
            <div className="dyp-dc-meta">
                {item.chapter.group} · Class {item.chapter.classLevel} · last revised {agoText(item.ago)}
            </div>
            <div className="dyp-dc-actions">
                <button type="button" className="dyp-btn dyp-primary dyp-sm" onClick={() => onRecalled(item.chapter.chapterId)}>
                    <Check size={14} strokeWidth={2.2} />
                    Recalled it
                </button>
                <button type="button" className="dyp-btn dyp-sm" onClick={() => onForgot(item.chapter.chapterId)}>
                    <RotateCw size={13} />
                    Forgot — reset
                </button>
                <button type="button" className="dyp-btn dyp-ghost dyp-sm" onClick={() => onOpen(item.chapter.chapterId)}>
                    Open
                </button>
            </div>
        </div>
    );
}

function UpGroup({
    label, list, onChapter,
}: {
    label: string;
    list: RevisionItem[];
    onChapter: (id: string) => void;
}) {
    return (
        <div>
            <div className="dyp-up-label">
                {label}
                <span className="dyp-up-count">{list.length}</span>
            </div>
            {list.length === 0 ? (
                <div className="dyp-empty" style={{ padding: '8px 2px' }}>—</div>
            ) : (
                list.map((x) => (
                    <button
                        key={x.chapter.chapterId}
                        type="button"
                        className="dyp-uprow"
                        onClick={() => onChapter(x.chapter.chapterId)}
                    >
                        <span className="dyp-up-when">{fmtShort(x.dueOn)}</span>
                        <span className="dyp-up-name">{x.chapter.name}</span>
                        <span className="dyp-up-stage">
                            {REV_STAGE_LABEL[Math.min(x.stage, REV_STAGE_LABEL.length - 1)]}
                        </span>
                    </button>
                ))
            )}
        </div>
    );
}

function Flame12() {
    return (
        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c1.5 3 4.5 4.5 4.5 8a4.5 4.5 0 1 1-9 0c0-1.2.4-2.2 1-3 .2 1 .8 1.6 1.5 1.8C10 8 11 5.5 12 3z" />
        </svg>
    );
}
