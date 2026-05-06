'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    ChevronRight,
    Columns2,
    Download,
    ExternalLink,
    FileText,
    Maximize2,
    Minimize2,
    SquareSplitHorizontal,
    Target,
    X,
} from 'lucide-react';
import { toInlineViewerUrl, type HandwrittenNote } from '../../lib/handwrittenNotesData';

// localStorage schema. Single key, two fields, easy to inspect/clear.
//
//   canvas:handwritten-notes:state = {
//     openedNotes: string[]                       // every note id ever opened
//     lastNoteByChapter: Record<chapterSlug, id>  // most recent note per chapter
//   }
const LS_KEY = 'canvas:handwritten-notes:state';

interface PersistedState {
    openedNotes: string[];
    lastNoteByChapter: Record<string, string>;
}

function loadState(): PersistedState {
    if (typeof window === 'undefined') return { openedNotes: [], lastNoteByChapter: {} };
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return { openedNotes: [], lastNoteByChapter: {} };
        const parsed = JSON.parse(raw) as Partial<PersistedState>;
        return {
            openedNotes: Array.isArray(parsed.openedNotes) ? parsed.openedNotes : [],
            lastNoteByChapter: parsed.lastNoteByChapter && typeof parsed.lastNoteByChapter === 'object'
                ? parsed.lastNoteByChapter
                : {},
        };
    } catch {
        return { openedNotes: [], lastNoteByChapter: {} };
    }
}

function persistState(state: PersistedState) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
        // localStorage may be disabled (incognito/strict privacy) — silently no-op
    }
}

interface Props {
    notes: HandwrittenNote[];
    crucibleChapterId?: string | null;
}

// Chapter pages have 1–5 notes. The reader lives inline in the page —
// tap a card → cards collapse into tabs and a full-width PDF embed
// renders right below them. No modal, no new tab, no full-viewport
// takeover. Hero + breadcrumb stay visible; user can scroll up at any time.
export default function ChapterNotesGrid({ notes, crucibleChapterId }: Props) {
    const params = useParams<{ chapter: string }>();
    const chapterSlug = params?.chapter || '';

    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [splitMode, setSplitMode] = useState(false);
    const [openedNotes, setOpenedNotes] = useState<Set<string>>(new Set());
    const [lastReadId, setLastReadId] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);
    const readerRef = useRef<HTMLDivElement>(null);

    const active = activeIdx !== null ? notes[activeIdx] : null;

    // Hydrate localStorage state on mount.
    useEffect(() => {
        const s = loadState();
        setOpenedNotes(new Set(s.openedNotes));
        setLastReadId(s.lastNoteByChapter[chapterSlug] ?? null);
        setHydrated(true);
    }, [chapterSlug]);

    // Mark a note as read whenever it becomes active. We persist the union
    // of all opened notes (so the green dot stays after revisits) plus the
    // most recent note per chapter (so the "Continue" indicator works).
    useEffect(() => {
        if (!hydrated) return;
        if (activeIdx === null) return;
        const note = notes[activeIdx];
        if (!note) return;

        setOpenedNotes((prev) => {
            if (prev.has(note.id)) return prev;
            const next = new Set(prev);
            next.add(note.id);
            return next;
        });
        setLastReadId(note.id);

        const fresh = loadState();
        const opened = new Set(fresh.openedNotes);
        opened.add(note.id);
        persistState({
            openedNotes: Array.from(opened),
            lastNoteByChapter: { ...fresh.lastNoteByChapter, [chapterSlug]: note.id },
        });
    }, [activeIdx, notes, hydrated, chapterSlug]);

    // Scroll the inline reader into view when a card is opened.
    useEffect(() => {
        if (activeIdx === null) return;
        readerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [activeIdx]);

    // Keyboard shortcuts (Esc to close fullscreen, arrows to switch).
    useEffect(() => {
        if (activeIdx === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isFullscreen) setIsFullscreen(false);
                else if (splitMode) setSplitMode(false);
                else setActiveIdx(null);
            } else if (e.key === 'ArrowRight' && notes.length > 1) {
                setActiveIdx((i) => (i === null ? null : (i + 1) % notes.length));
            } else if (e.key === 'ArrowLeft' && notes.length > 1) {
                setActiveIdx((i) => (i === null ? null : (i - 1 + notes.length) % notes.length));
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [activeIdx, isFullscreen, splitMode, notes.length]);

    // Lock background scroll only when fullscreen
    useEffect(() => {
        if (!isFullscreen) return;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullscreen]);

    // Closing the reader also exits split mode so we don't leave it stuck on next open.
    const closeReader = () => {
        setActiveIdx(null);
        setSplitMode(false);
        setIsFullscreen(false);
    };

    return (
        <>
            {/* Cards grid — only shown when no note is open */}
            {active === null && (
                <div className="grid gap-3 md:grid-cols-2">
                    {notes.map((note, idx) => (
                        <NoteCardButton
                            key={note.id}
                            note={note}
                            isRead={hydrated && openedNotes.has(note.id)}
                            isLastRead={hydrated && lastReadId === note.id}
                            onOpen={() => setActiveIdx(idx)}
                        />
                    ))}
                </div>
            )}

            {/* Inline reader — replaces the cards grid in-place */}
            {active && (
                <div ref={readerRef} className={isFullscreen ? '' : 'space-y-3'}>
                    {/* Tab strip — switch between notes without leaving the reader */}
                    {!isFullscreen && (
                        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-2">
                            {notes.map((note, idx) => (
                                <button
                                    key={note.id}
                                    type="button"
                                    onClick={() => setActiveIdx(idx)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                        idx === activeIdx
                                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                            : 'text-zinc-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                                    }`}
                                    title={note.title}
                                >
                                    {hydrated && openedNotes.has(note.id) && idx !== activeIdx && (
                                        <span
                                            className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"
                                            aria-label="Already read"
                                        />
                                    )}
                                    <span className="line-clamp-1 max-w-[200px]">{note.title}</span>
                                </button>
                            ))}
                            <div className="ml-auto flex items-center gap-1.5">
                                {/* Side-by-side Crucible — primary CTA, prominent orange gradient
                                    when off so users actually try it; muted when active. */}
                                {crucibleChapterId && !isFullscreen && (
                                    <button
                                        type="button"
                                        onClick={() => setSplitMode((v) => !v)}
                                        className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all ${
                                            splitMode
                                                ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                                                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:from-orange-400 hover:to-amber-400'
                                        }`}
                                        title={splitMode ? 'Exit split — read only' : 'Open Crucible practice alongside the notes'}
                                        aria-label={splitMode ? 'Exit split mode' : 'Practice while reading (split view)'}
                                    >
                                        {splitMode ? <Columns2 size={14} /> : <SquareSplitHorizontal size={14} />}
                                        <span className="hidden sm:inline">
                                            {splitMode ? 'Exit split' : 'Practice while reading'}
                                        </span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setIsFullscreen(true)}
                                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                                    title="Read fullscreen"
                                    aria-label="Read fullscreen"
                                >
                                    <Maximize2 size={14} />
                                </button>
                                <a
                                    href={active.notesUrl}
                                    download
                                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                                    title="Download PDF"
                                    aria-label="Download PDF"
                                >
                                    <Download size={14} />
                                </a>
                                <a
                                    href={toInlineViewerUrl(active.notesUrl)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                                    title="Open in new tab"
                                    aria-label="Open in new tab"
                                >
                                    <ExternalLink size={14} />
                                </a>
                                <button
                                    type="button"
                                    onClick={closeReader}
                                    className="ml-1 p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    title="Close reader"
                                    aria-label="Close reader (Esc)"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Reader body. Single iframe by default; PDF + Crucible side-by-side when splitMode is on. */}
                    <div
                        className={
                            isFullscreen
                                ? 'fixed inset-0 z-[60] bg-slate-900'
                                : 'rounded-2xl overflow-hidden border border-white/[0.07] bg-slate-900 h-[78vh]'
                        }
                    >
                        {isFullscreen && (
                            <button
                                type="button"
                                onClick={() => setIsFullscreen(false)}
                                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors shadow-lg"
                                aria-label="Exit fullscreen"
                                title="Exit fullscreen (Esc)"
                            >
                                <Minimize2 size={18} />
                            </button>
                        )}
                        {splitMode && crucibleChapterId ? (
                            <div className="grid h-full grid-cols-1 md:grid-cols-2">
                                <iframe
                                    src={toInlineViewerUrl(active.notesUrl) + '#view=FitH&toolbar=1'}
                                    className="w-full h-full border-0 md:border-r md:border-slate-800"
                                    title={active.title}
                                />
                                {/* `?mode=browse` skips the Choose-mode chooser and lands
                                    directly on the topic-organised browse view. */}
                                <iframe
                                    src={`/the-crucible/${crucibleChapterId}?mode=browse`}
                                    className="w-full h-full border-0 hidden md:block"
                                    title={`Crucible practice for ${chapterSlug}`}
                                />
                            </div>
                        ) : (
                            <iframe
                                src={toInlineViewerUrl(active.notesUrl) + '#view=FitH&toolbar=1'}
                                className="w-full h-full border-0"
                                title={active.title}
                            />
                        )}
                    </div>

                    {/* Mobile note: split-mode hides Crucible on small screens; tell the user. */}
                    {splitMode && (
                        <p className="md:hidden text-center text-[11px] text-zinc-500">
                            Practice mode is desktop-only — open Crucible directly on mobile.
                        </p>
                    )}
                </div>
            )}
        </>
    );
}

function NoteThumbnail({ note }: { note: HandwrittenNote }) {
    const [failed, setFailed] = useState(false);
    if (!note.thumbnailUrl || failed) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent text-amber-400/60">
                <FileText size={28} />
            </div>
        );
    }
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={note.thumbnailUrl}
            alt={`${note.title} cover`}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
        />
    );
}

interface NoteCardButtonProps {
    note: HandwrittenNote;
    isRead: boolean;
    isLastRead: boolean;
    onOpen: () => void;
}

function NoteCardButton({ note, isRead, isLastRead, onOpen }: NoteCardButtonProps) {
    return (
        <button
            type="button"
            onClick={onOpen}
            className={`group relative flex gap-4 rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                isLastRead
                    ? 'border-amber-500/40 bg-amber-500/[0.04]'
                    : 'border-white/[0.07] bg-white/[0.02] hover:border-amber-500/30 hover:bg-amber-500/[0.04]'
            }`}
        >
            {/* Read indicator — top-right green dot */}
            {isRead && !isLastRead && (
                <span
                    className="absolute top-3 right-3 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-900"
                    aria-label="Already read"
                    title="You've opened this note"
                />
            )}
            {/* Last-read pill — overrides the dot when this is the most recent note */}
            {isLastRead && (
                <span
                    className="absolute top-2.5 right-3 inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-amber-300"
                    title="Last note you opened in this chapter"
                >
                    <Target size={9} /> Continue
                </span>
            )}

            <div className="aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black md:w-28">
                <NoteThumbnail note={note} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/80">
                        Handwritten PDF
                    </p>
                    <h3 className="mt-1 line-clamp-3 text-sm font-semibold text-white group-hover:text-amber-300 md:text-base">
                        {note.title}
                    </h3>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300">
                    {isLastRead ? 'Resume reading' : 'Read inline'} <ChevronRight size={12} />
                </div>
            </div>
        </button>
    );
}
