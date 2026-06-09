'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Book, ChevronRight, Edit3, List, RotateCw, Play, FileText, Plus, Star, ExternalLink, Calendar, Check, X,
} from 'lucide-react';
import type { ChapterPlanItem, LoopStep, PlannerResource, ResourceKind } from './planner-data';
import { LOOP_STEPS } from './planner-data';
import { Ring } from './Ring';
import { parseResourceUrl } from './lib/toEmbed';
import type { UserResource, Diagnostic, PlannerState, PlannerMode } from './lib/state';
import { chapterPct, chapterStepsDone, REV_INTERVALS, addDaysISO } from './lib/state';
import type { PlannerStateApi } from './usePlannerState';

const STEP_META: Record<LoopStep, { n: number; title: string; desc: string; Icon: typeof Book }> = {
    learn: { n: 1, title: 'Learn', desc: 'Watch / read the concept once.', Icon: Book },
    apply: { n: 2, title: 'Apply', desc: 'Learn how to solve — worked DPPs & the right method.', Icon: Edit3 },
    practice: { n: 3, title: 'Practice', desc: 'Solve questions yourself on Crucible.', Icon: List },
    revise: { n: 4, title: 'Revise', desc: 'Flashcards + a mock test, a few days later.', Icon: RotateCw },
};

const KIND_ICON: Record<ResourceKind, typeof Play> = {
    lecture: Play,
    notes: FileText,
    questions: List,
    flashcards: List,
    tool: List,
};

const KIND_LABEL: Record<ResourceKind, string> = {
    lecture: 'Lecture',
    notes: 'Notes',
    questions: 'Practice questions',
    flashcards: 'Flashcards',
    tool: 'Tool',
};

const RATING_META: { value: Diagnostic; label: string; color: string }[] = [
    { value: 'strong', label: 'Strong', color: 'var(--c-strong)' },
    { value: 'weak', label: 'Weak', color: 'var(--c-weak)' },
    { value: 'new', label: 'New', color: 'var(--c-new)' },
];

type Props = {
    chapter: ChapterPlanItem;
    state: PlannerState;
    completed: Set<string>;
    api: PlannerStateApi;
    fullCatalog: ChapterPlanItem[];   // for prereq chapter name lookup
    mode: PlannerMode;                // active batch — selects the resource list
    onOpenChapter: (chapterId: string) => void;
    showPrereqs: boolean;             // true only in Class 12 mode (driven by parent)
};

export function ChapterScreen({ chapter, state, completed, api, fullCatalog, mode, onOpenChapter, showPrereqs }: Props) {
    const { isStepDone, toggleStep, setRating, setDeadline, setNote, isStarred, toggleStar,
            isCustomDone, toggleCustomDone, addCustomResource, removeCustomResource } = api;

    const prereqChapters = useMemo(
        () =>
            (chapter.prerequisites ?? [])
                .map((id) => fullCatalog.find((c) => c.chapterId === id))
                .filter((c): c is ChapterPlanItem => !!c),
        [chapter.prerequisites, fullCatalog]
    );

    // Resources for the active batch (Class 11 / Class 12 / Dropper).
    const resources = useMemo(() => chapter.resourcesByMode[mode] ?? [], [chapter.resourcesByMode, mode]);

    const customs = useMemo(
        () => state.customResources[chapter.chapterId] ?? [],
        [state.customResources, chapter.chapterId]
    );
    // Curated resources the student has starred — the only curated items shown
    // in the "Your Resources" shortlist (the loop above holds the full set).
    const starredResources = useMemo(
        () => resources.map((r, idx) => ({ r, idx })).filter(({ idx }) => isStarred(chapter.chapterId, `r${idx}`)),
        [resources, isStarred, chapter.chapterId]
    );
    const allResources = useMemo(
        () => [
            ...resources.map((r, idx) => ({ kind: 'curated' as const, r, idx })),
            ...customs.map((r) => ({ kind: 'custom' as const, r, idx: -1 })),
        ],
        [resources, customs]
    );

    const stepRes: Record<LoopStep, typeof allResources> = {
        learn: allResources.filter((x) => (x.kind === 'curated' ? x.r.steps?.includes('learn') : x.r.kind === 'lecture' || x.r.kind === 'notes')),
        apply: allResources.filter((x) => (x.kind === 'curated' ? x.r.steps?.includes('apply') : false)),
        practice: allResources.filter((x) => (x.kind === 'curated' ? x.r.steps?.includes('practice') : x.r.kind === 'questions')),
        revise: allResources.filter((x) => (x.kind === 'curated' ? x.r.steps?.includes('revise') : x.r.kind === 'flashcards')),
    };

    const pct = chapterPct(chapter.chapterId, completed);
    const done = chapterStepsDone(chapter.chapterId, completed);
    const rating = state.diagnostic[chapter.chapterId];
    const note = state.notes[chapter.chapterId] ?? '';
    const dueDate = state.deadlines[chapter.chapterId] ?? '';
    const reviseDone = isStepDone(chapter.chapterId, 'revise');

    const [adding, setAdding] = useState(false);
    // Inline video/PDF player. Set when an embeddable resource is clicked; the
    // src is the provider-built embed URL (built by us — never a raw paste — see
    // toEmbed.ts), so the iframe is safe per CLAUDE.md §8.4.
    const [player, setPlayer] = useState<{ src: string; title: string } | null>(null);
    const openPlayer = (embedUrl: string, title: string) => {
        const isYouTube = embedUrl.includes('youtube.com/embed') || embedUrl.includes('youtube-nocookie.com/embed');
        const src = isYouTube ? `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0` : embedUrl;
        setPlayer({ src, title });
    };

    return (
        <div className="dyp-wrap dyp-narrow">
            <div className="dyp-ch-crumb">
                Class {chapter.classLevel}
                <ChevronRight size={13} />
                {chapter.group}
            </div>

            <div className="dyp-ch-head">
                <div>
                    <h1 className="dyp-h1 dyp-ch-title">{chapter.name}</h1>
                    <div className="dyp-ch-tags">
                        {chapter.highYield && (
                            <span className="dyp-hy">
                                <span style={{ display: 'inline-flex' }}>
                                    <FireGlyph />
                                </span>
                                High yield
                            </span>
                        )}
                        <span className="dyp-ch-q">{chapter.questionCount} Qs</span>
                        <span className="dyp-ch-dot">·</span>
                        <span className="dyp-ch-q">{chapter.weightagePct > 0 ? `~${chapter.weightagePct.toFixed(1)}% in JEE Main` : 'Weightage TBD'}</span>
                    </div>
                </div>
                <Ring pct={pct} size={88} stroke={8}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--dyp-ff-display)', fontWeight: 700, fontSize: 20, color: 'var(--text)' }}>{done}/4</div>
                        <div style={{ fontSize: 10.5, color: 'var(--text-3)' }}>loop</div>
                    </div>
                </Ring>
            </div>

            {chapter.oneShotVideoId && (
                <OneShotButton videoId={chapter.oneShotVideoId} durationMin={chapter.oneShotDurationMin} chapterName={chapter.name} />
            )}

            {showPrereqs && prereqChapters.length > 0 && (
                <PrereqCallout chapters={prereqChapters} onOpen={onOpenChapter} />
            )}

            <div className="dyp-ch-controls">
                <div className="dyp-ch-rate">
                    <span className="dyp-ch-rate-label">Self-rating</span>
                    <div className="dyp-rating">
                        {RATING_META.map((r) => {
                            const on = rating === r.value;
                            return (
                                <button
                                    key={r.value}
                                    type="button"
                                    className={['dyp-rating-pill', on ? 'dyp-on' : ''].join(' ')}
                                    style={on ? ({ ['--dyp-rc' as never]: r.color } as React.CSSProperties) : undefined}
                                    onClick={() => setRating(chapter.chapterId, on ? null : r.value)}
                                >
                                    <span className="dyp-rdot" style={{ background: r.color }} />
                                    {r.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <label className="dyp-target-ctl dyp-compact">
                    <Calendar size={15} className="dyp-ico" />
                    <span className="dyp-tc-label">Do by</span>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDeadline(chapter.chapterId, e.target.value || null)}
                    />
                </label>
            </div>

            <section className="dyp-ch-sec">
                <div className="dyp-sec-head">
                    <h2 className="dyp-sec-title">The chapter loop</h2>
                    <span className="dyp-sec-sub">Learn → Apply → Practice → Revise. Tick each as you go.</span>
                    <span className="dyp-loop-count">{done}/4</span>
                </div>
                <div className="dyp-loop-grid">
                    {LOOP_STEPS.map((s) => {
                        const meta = STEP_META[s.id];
                        const isDone = isStepDone(chapter.chapterId, s.id);
                        const I = meta.Icon;
                        return (
                            <div key={s.id} className={['dyp-stepcard', isDone ? 'dyp-done' : ''].join(' ')}>
                                <div className="dyp-step-top">
                                    <span className="dyp-step-n">{isDone ? <Check size={15} strokeWidth={2.4} /> : meta.n}</span>
                                    <I size={17} className="dyp-step-ic" />
                                    <span className="dyp-step-title">{meta.title}</span>
                                    <button
                                        type="button"
                                        className={['dyp-step-toggle', isDone ? 'dyp-on' : ''].join(' ')}
                                        onClick={() => toggleStep(chapter.chapterId, s.id)}
                                    >
                                        {isDone ? <><Check size={14} strokeWidth={2.2} />Done</> : 'Mark done'}
                                    </button>
                                </div>
                                <div className="dyp-step-desc">{meta.desc}</div>
                                {stepRes[s.id].length > 0 && (
                                    <div className="dyp-step-res">
                                        {stepRes[s.id].map((x) => {
                                            const label = x.r.label;
                                            const key = `${s.id}-${x.kind === 'curated' ? `r${x.idx}` : x.r.id}`;
                                            const embedUrl = x.kind === 'curated'
                                                ? x.r.embedUrl
                                                : (x.r.embeddable ? parseResourceUrl(x.r.url).embedUrl : undefined);
                                            const href = x.kind === 'curated' ? x.r.href : x.r.url;
                                            if (embedUrl) {
                                                return (
                                                    <button key={key} type="button" className="dyp-rchip" onClick={() => openPlayer(embedUrl, label)}>
                                                        <Play size={14} className="dyp-ico" />
                                                        {label}
                                                    </button>
                                                );
                                            }
                                            return (
                                                <a key={key} className="dyp-rchip" href={href} target="_blank" rel="noreferrer">
                                                    <ExternalLink size={13} className="dyp-ico" />
                                                    {label}
                                                </a>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {reviseDone && (
                    <div className="dyp-retest-sched">
                        <RotateCw size={15} style={{ color: 'var(--c-new)' }} />
                        Revise done — scheduled for spaced revision in <b>{REV_INTERVALS[0]} day</b>, then <b>{REV_INTERVALS[1]}</b>, then <b>{REV_INTERVALS[2]}</b>, then <b>{REV_INTERVALS[3]}</b>, then <b>{REV_INTERVALS[4]}</b>. See the <b>Revision</b> queue.
                    </div>
                )}
            </section>

            <section className="dyp-ch-sec">
                <div className="dyp-sec-head">
                    <h2 className="dyp-sec-title">Your Resources</h2>
                    <span className="dyp-sec-sub">Starred from the loop above + anything you add.</span>
                </div>
                {adding && (
                    <AddResource
                        onAdd={(input) => addCustomResource(chapter.chapterId, input)}
                        onClose={() => setAdding(false)}
                    />
                )}
                <div className="dyp-res-list">
                    {/* Model A: the loop above is the home for all curated resources.
                        Here we keep only the student's shortlist — starred curated
                        + their own additions — so it isn't a duplicate of the loop. */}
                    {starredResources.length === 0 && customs.length === 0 && !adding && (
                        <div className="dyp-empty">Tap the ☆ on any resource in the loop above to pin it here.</div>
                    )}
                    {starredResources.map(({ r, idx }) => (
                        <CuratedResourceRow
                            key={`r${idx}`}
                            resource={r}
                            starred
                            onStar={() => toggleStar(chapter.chapterId, `r${idx}`)}
                            onPlay={openPlayer}
                        />
                    ))}
                    {customs.map((r) => (
                        <CustomResourceRow
                            key={r.id}
                            resource={r}
                            done={isCustomDone(chapter.chapterId, r.id)}
                            starred={isStarred(chapter.chapterId, r.id)}
                            onStar={() => toggleStar(chapter.chapterId, r.id)}
                            onToggleDone={() => toggleCustomDone(chapter.chapterId, r.id)}
                            onRemove={() => removeCustomResource(chapter.chapterId, r.id)}
                            onPlay={openPlayer}
                        />
                    ))}
                    {!adding && (
                        <button type="button" className="dyp-res-add" onClick={() => setAdding(true)}>
                            <span className="dyp-res-add-ic"><Plus size={16} strokeWidth={2.4} /></span>
                            <span className="dyp-res-add-main">
                                <span className="dyp-res-add-title">Add your own YouTube lecture or notes</span>
                                <span className="dyp-res-add-sub">Paste any YouTube, Drive or Vimeo link — it plays right here.</span>
                            </span>
                        </button>
                    )}
                </div>
            </section>

            <section className="dyp-ch-sec">
                <div className="dyp-sec-head">
                    <h2 className="dyp-sec-title">Notes &amp; doubts</h2>
                    <span className="dyp-sec-sub">Jot formulae, mistakes, or things to ask.</span>
                </div>
                <textarea
                    className="dyp-notes-area"
                    placeholder="e.g. Revisit limiting reagent problems · n-factor in redox confusing · ask about back-titration…"
                    value={note}
                    onChange={(e) => setNote(chapter.chapterId, e.target.value)}
                />
            </section>

            {player && <InlinePlayer src={player.src} title={player.title} onClose={() => setPlayer(null)} />}
        </div>
    );
}

// Inline video / PDF player — a lightbox that opens within the planner so a
// student never leaves the page to watch a one-shot. The `src` is a
// provider-built embed URL (see toEmbed.ts), never a raw user paste.
function InlinePlayer({ src, title, onClose }: { src: string; title: string; onClose: () => void }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);
    return (
        <div className="dyp-player-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
            <div className="dyp-player-box" onClick={(e) => e.stopPropagation()}>
                <div className="dyp-player-head">
                    <span className="dyp-player-title">{title}</span>
                    <button type="button" className="dyp-player-close" onClick={onClose} aria-label="Close player">
                        <X size={18} />
                    </button>
                </div>
                <div className="dyp-player-frame">
                    <iframe
                        src={src}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                    />
                </div>
            </div>
        </div>
    );
}

// One-Shot Lecture CTA. Surfaces when chapter.oneShotVideoId is present.
// A single button opening the full chapter video in a new tab — perfect for a
// revising Class 12 student who just wants a 45-min refresher on a Class 11
// prereq instead of a multi-video detailed playlist.
function OneShotButton({ videoId, durationMin, chapterName }: { videoId: string; durationMin?: number; chapterName: string }) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    return (
        <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="dyp-oneshot"
            aria-label={`Watch the one-shot lecture for ${chapterName}`}
        >
            <span className="dyp-oneshot-icon">
                <Play size={16} strokeWidth={2.4} fill="currentColor" />
            </span>
            <span className="dyp-oneshot-main">
                <span className="dyp-oneshot-eyebrow">One-Shot Lecture</span>
                <span className="dyp-oneshot-title">
                    Watch the whole chapter in one go
                    {durationMin && <span className="dyp-oneshot-len"> · ~{durationMin} min</span>}
                </span>
            </span>
            <span className="dyp-oneshot-arrow">
                <ExternalLink size={14} />
            </span>
        </a>
    );
}

// "Revise alongside" — Class 12 prereq callout. Only rendered when:
//   1) The student is in Class 12 mode (showPrereqs prop true), AND
//   2) The chapter has at least one prerequisite chapter in PREREQUISITE_MAP.
// Tapping a chip opens that Class 11 chapter in the FULL chapter screen
// (Plan A from the design discussion). The student returns to the Class 12
// chapter via the topbar's "Dashboard" button.
function PrereqCallout({ chapters, onOpen }: { chapters: ChapterPlanItem[]; onOpen: (id: string) => void }) {
    return (
        <div className="dyp-prereq">
            <div className="dyp-prereq-head">
                <RotateCw size={14} className="dyp-prereq-icon" />
                <div>
                    <div className="dyp-prereq-eyebrow">Revise alongside</div>
                    <div className="dyp-prereq-hint">Class 11 chapters that this builds on — tap one for a quick re-test pass.</div>
                </div>
            </div>
            <div className="dyp-prereq-chips">
                {chapters.map((c) => (
                    <button key={c.chapterId} type="button" className="dyp-prereq-chip" onClick={() => onOpen(c.chapterId)}>
                        <RotateCw size={11} />
                        {c.name.split('(')[0].trim()}
                    </button>
                ))}
            </div>
        </div>
    );
}

function FireGlyph() {
    // small flame to avoid lucide Flame heavy weight at 12px
    return (
        <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c1.5 3 4.5 4.5 4.5 8a4.5 4.5 0 1 1-9 0c0-1.2.4-2.2 1-3 .2 1 .8 1.6 1.5 1.8C10 8 11 5.5 12 3z" />
        </svg>
    );
}

// --- AddResource (matches design's segmented type buttons + URL) ----------
function AddResource({
    onAdd, onClose,
}: {
    onAdd: (input: { label: string; kind: ResourceKind; url: string }) => { ok: boolean; error?: string };
    onClose: () => void;
}) {
    const [title, setTitle] = useState('');
    const [kind, setKind] = useState<ResourceKind>('lecture');
    const [url, setUrl] = useState('');
    const [error, setError] = useState<string | null>(null);
    const preview = url.trim() ? parseResourceUrl(url) : null;

    const submit = () => {
        setError(null);
        if (!url.trim()) {
            setError('Paste a link.');
            return;
        }
        const res = onAdd({ label: title.trim() || 'My resource', kind, url });
        if (!res.ok) {
            setError(res.error ?? 'Could not add that link.');
            return;
        }
        onClose();
    };

    const types: { k: ResourceKind; label: string }[] = [
        { k: 'lecture', label: 'Lecture' },
        { k: 'notes', label: 'Notes' },
        { k: 'questions', label: 'Practice' },
        { k: 'flashcards', label: 'Flashcards' },
    ];

    return (
        <div className="dyp-addres">
            <div className="dyp-addres-row">
                <input
                    type="text"
                    className="dyp-inp"
                    autoFocus
                    placeholder="Resource title — e.g. Mole Concept by your fav YouTuber"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                />
            </div>
            <div className="dyp-addres-row">
                <div className="dyp-typeseg">
                    {types.map((t) => (
                        <button
                            key={t.k}
                            type="button"
                            className={['dyp-typebtn', kind === t.k ? 'dyp-on' : ''].join(' ')}
                            onClick={() => setKind(t.k)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <input
                    type="url"
                    className="dyp-inp"
                    placeholder="Paste a link (YouTube, Drive, Vimeo, …)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                />
            </div>
            {preview && preview.ok && (
                <div className="dyp-addres-ok">
                    {preview.embeddable ? (
                        <><Check size={12} /> Plays inline in the player</>
                    ) : (
                        <><ExternalLink size={12} /> Will open in a new tab</>
                    )}
                </div>
            )}
            {error && <div className="dyp-addres-msg">{error}</div>}
            <div className="dyp-addres-actions">
                <button type="button" className="dyp-btn dyp-ghost dyp-sm" onClick={onClose}>Cancel</button>
                <button type="button" className="dyp-btn dyp-primary dyp-sm" onClick={submit}>
                    <Plus size={14} strokeWidth={2.4} />
                    Add resource
                </button>
            </div>
        </div>
    );
}

function CuratedResourceRow({
    resource, starred, onStar, onPlay,
}: {
    resource: PlannerResource;
    starred: boolean;
    onStar: () => void;
    onPlay: (embedUrl: string, title: string) => void;
}) {
    const Icon = KIND_ICON[resource.kind];
    const isInternal = resource.href.startsWith('/');
    const embeddable = !!resource.embedUrl;
    const play = () => resource.embedUrl && onPlay(resource.embedUrl, resource.label);
    const iconClass = `dyp-res-ic dyp-ic-${resource.kind}`;
    return (
        <div className="dyp-resrow">
            {embeddable ? (
                <button type="button" className={iconClass} onClick={play} aria-label={`Play ${resource.label}`}>
                    <Icon size={17} />
                </button>
            ) : (
                <a className={iconClass} href={resource.href} target="_blank" rel="noreferrer" aria-label={resource.label}>
                    <Icon size={17} />
                </a>
            )}
            <div className="dyp-res-main">
                {embeddable ? (
                    <button type="button" className="dyp-res-title dyp-res-titlebtn" onClick={play}>{resource.label}</button>
                ) : (
                    <a className="dyp-res-title dyp-res-titlebtn" href={resource.href} target="_blank" rel="noreferrer">{resource.label}</a>
                )}
                <div className="dyp-res-sub">
                    {KIND_LABEL[resource.kind]}
                    {embeddable && <span className="dyp-res-inline"> · plays here</span>}
                    {!isInternal && (
                        <>
                            <span> · </span>
                            <a className="dyp-res-link" href={resource.href} target="_blank" rel="noreferrer">
                                Open <ExternalLink size={11} />
                            </a>
                        </>
                    )}
                </div>
            </div>
            <button
                type="button"
                className={['dyp-res-star', starred ? 'dyp-on' : ''].join(' ')}
                onClick={onStar}
                aria-pressed={starred}
                title="Star"
            >
                <Star size={15} strokeWidth={1.8} fill={starred ? 'currentColor' : 'none'} />
            </button>
        </div>
    );
}

function CustomResourceRow({
    resource, done, starred, onStar, onToggleDone, onRemove, onPlay,
}: {
    resource: UserResource;
    done: boolean;
    starred: boolean;
    onStar: () => void;
    onToggleDone: () => void;
    onRemove: () => void;
    onPlay: (embedUrl: string, title: string) => void;
}) {
    const Icon = KIND_ICON[resource.kind];
    // Re-derive the safe embed src from the stored URL (never trust a stored
    // src directly). Only embeddable student links play inline.
    const embedUrl = resource.embeddable ? parseResourceUrl(resource.url).embedUrl : undefined;
    const play = () => embedUrl && onPlay(embedUrl, resource.label);
    const iconClass = `dyp-res-ic dyp-ic-${resource.kind}`;
    return (
        <div className="dyp-resrow">
            {embedUrl ? (
                <button type="button" className={iconClass} onClick={play} aria-label={`Play ${resource.label}`}>
                    <Icon size={17} />
                </button>
            ) : (
                <a className={iconClass} href={resource.url} target="_blank" rel="noreferrer" aria-label={resource.label}>
                    <Icon size={17} />
                </a>
            )}
            <div className="dyp-res-main">
                <div className="dyp-res-title">
                    {embedUrl ? (
                        <button type="button" className="dyp-res-titlebtn" onClick={play}>{resource.label}</button>
                    ) : (
                        <a className="dyp-res-titlebtn" href={resource.url} target="_blank" rel="noreferrer">{resource.label}</a>
                    )}
                    <span className="dyp-res-own">yours</span>
                </div>
                <div className="dyp-res-sub">
                    {KIND_LABEL[resource.kind]} ·
                    <a className="dyp-res-link" href={resource.url} target="_blank" rel="noreferrer">
                        {resource.url.replace(/^https?:\/\//, '').slice(0, 30)}
                        <ExternalLink size={11} />
                    </a>
                </div>
            </div>
            <button
                type="button"
                className={['dyp-res-star', done ? 'dyp-on' : ''].join(' ')}
                onClick={onToggleDone}
                title={done ? 'Mark not done' : 'Mark done'}
            >
                <Check size={15} strokeWidth={2} />
            </button>
            <button
                type="button"
                className={['dyp-res-star', starred ? 'dyp-on' : ''].join(' ')}
                onClick={onStar}
                title="Star"
            >
                <Star size={15} strokeWidth={1.8} fill={starred ? 'currentColor' : 'none'} />
            </button>
            <button type="button" className="dyp-res-star" onClick={onRemove} title="Remove">
                <X size={15} />
            </button>
        </div>
    );
}

// unused but kept for potential future use
export { addDaysISO };
