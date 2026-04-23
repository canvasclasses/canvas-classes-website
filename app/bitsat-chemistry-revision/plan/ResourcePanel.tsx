'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Check,
    ChevronRight,
    ExternalLink,
    Play,
    FileText,
    Layers,
    Lightbulb,
    Lock,
} from 'lucide-react';
import {
    Resource,
    ResourceKind,
    KIND_GROUP,
    GROUP_ORDER,
    ResourceGroup,
} from '../planTypes';

// Only resources with an explicit embedUrl (YouTube, Google Drive) render
// inline. Internal app tools (flashcards, periodic table, wizard, etc.) open
// in a new tab — embedding them inline renders the full app chrome which
// isn't useful.
export function canIframeResource(r: Resource): boolean {
    if (r.kind === 'comingsoon') return false;
    return Boolean(r.embedUrl);
}

const GLYPH: Record<ResourceKind, { Icon: typeof Play; label: string }> = {
    'oneshot':      { Icon: Play,       label: 'Lecture' },
    'crash-course': { Icon: Play,       label: 'Crash-course lecture' },
    'twomin':       { Icon: Play,       label: '2-minute video' },
    'notes':        { Icon: FileText,   label: 'Handwritten notes' },
    'flashcards':   { Icon: Layers,     label: 'Flashcard deck' },
    'periodic':     { Icon: Lightbulb,  label: 'Interactive tool' },
    'trends':       { Icon: Lightbulb,  label: 'Interactive tool' },
    'physical':     { Icon: Lightbulb,  label: 'Interactive tool' },
    'organic':      { Icon: Lightbulb,  label: 'Interactive tool' },
    'inorganic':    { Icon: Lightbulb,  label: 'Interactive tool' },
    'name-rxns':    { Icon: Lightbulb,  label: 'Reference tool' },
    'wizard':       { Icon: Lightbulb,  label: 'Interactive tool' },
    'salt':         { Icon: Lightbulb,  label: 'Simulator' },
    'top50':        { Icon: FileText,   label: 'Reference' },
    'comingsoon':   { Icon: Lock,       label: 'Coming soon' },
};

type Tab = 'resources' | 'checklist';

type Props = {
    dayNumber: number;
    resources: Resource[];
    checklist?: string[];
    selectedIndex: number | null;
    onSelectResource: (index: number) => void;
    isModuleDone: (index: number) => boolean;
    onToggleModule: (index: number) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
    // 'rail' = desktop sidebar (default, collapsible, own scroll, left border)
    // 'inline' = mobile inline section below day content (no border, no collapse)
    variant?: 'rail' | 'inline';
};

export function ResourcePanel({
    dayNumber,
    resources,
    checklist,
    selectedIndex,
    onSelectResource,
    isModuleDone,
    onToggleModule,
    collapsed,
    onToggleCollapse,
    variant = 'rail',
}: Props) {
    const isInline = variant === 'inline';
    const [tab, setTab] = useState<Tab>('resources');
    const [checked, setChecked] = useState<Set<number>>(new Set());

    useEffect(() => {
        setChecked(new Set());
        setTab('resources');
    }, [dayNumber]);

    const toggleChecklist = (i: number) => {
        setChecked((prev) => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i);
            else next.add(i);
            return next;
        });
    };

    if (!isInline && collapsed) return null;

    const grouped: { group: ResourceGroup; items: { resource: Resource; index: number }[] }[] =
        GROUP_ORDER.map((group) => ({
            group,
            items: resources
                .map((r, i) => ({ resource: r, index: i }))
                .filter(({ resource }) => KIND_GROUP[resource.kind] === group),
        })).filter((g) => g.items.length > 0);

    const hasChecklist = !!(checklist && checklist.length > 0);

    return (
        <aside
            className={
                isInline
                    ? 'bg-[#050505]'
                    : 'bg-[#050505] border-l border-white/[0.05] overflow-y-auto'
            }
        >
            {!isInline && (
                <div className="flex items-center justify-between px-3 pt-3.5 pb-2">
                    <button
                        type="button"
                        onClick={onToggleCollapse}
                        className="w-6 h-6 grid place-items-center text-zinc-500 hover:text-white hover:bg-white/[0.05] rounded transition-colors"
                        aria-label="Hide panel"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            )}

            {isInline && (
                <div className="px-5 pt-4 pb-3 border-t border-white/[0.05]">
                    <h2 className="font-[var(--font-outfit)] text-[11px] font-semibold text-zinc-500 uppercase tracking-wider m-0">
                        Today&apos;s Modules
                    </h2>
                </div>
            )}

            <div className={isInline ? 'px-5 mb-4' : 'px-4 mb-3'}>
                <div role="tablist" className="grid grid-cols-2 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === 'resources'}
                        onClick={() => setTab('resources')}
                        className={[
                            'py-1.5 text-[12px] font-medium rounded-md transition-colors',
                            tab === 'resources' ? 'bg-white/[0.08] text-white' : 'text-zinc-400 hover:text-white',
                        ].join(' ')}
                    >
                        Resources
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === 'checklist'}
                        onClick={() => setTab('checklist')}
                        className={[
                            'py-1.5 text-[12px] font-medium rounded-md transition-colors',
                            tab === 'checklist' ? 'bg-white/[0.08] text-white' : 'text-zinc-400 hover:text-white',
                        ].join(' ')}
                    >
                        Checklist
                    </button>
                </div>
            </div>

            {tab === 'resources' ? (
                <div className={isInline ? 'px-5 pb-8' : 'px-4 pb-24'}>
                    {grouped.map(({ group, items }) => (
                        <section key={group} className="mb-5">
                            <div className="flex items-baseline justify-between mb-2">
                                <h3 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider m-0">
                                    {group}
                                </h3>
                                <span className="text-[11px] text-zinc-600 tabular-nums">
                                    {items.length}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {items.map(({ resource, index }) => (
                                    <ResourceRow
                                        key={`${resource.href}-${index}`}
                                        resource={resource}
                                        index={index}
                                        isActive={selectedIndex === index}
                                        isDone={isModuleDone(index)}
                                        onSelect={onSelectResource}
                                        onToggleDone={onToggleModule}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            ) : (
                <div className={isInline ? 'px-5 pb-8' : 'px-4 pb-24'}>
                    {hasChecklist && checklist ? (
                        <>
                            <h3 className="font-[var(--font-outfit)] text-[13px] font-semibold text-white m-0 mb-1 tracking-tight">
                                Lock this in
                            </h3>
                            <p className="text-xs text-zinc-500 m-0 mb-3">
                                {checklist.length === 1 ? 'One thing to nail' : `${checklist.length} things to nail`} before marking done.
                            </p>
                            {checklist.map((item, i) => {
                                const isDone = checked.has(i);
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => toggleChecklist(i)}
                                        className="w-full grid grid-cols-[16px_1fr] gap-2.5 items-start py-2.5 border-b border-white/[0.04] last:border-b-0 text-left cursor-pointer"
                                    >
                                        <span
                                            className={[
                                                'w-3.5 h-3.5 mt-0.5 border rounded-[3px] grid place-items-center transition-all',
                                                isDone ? 'bg-emerald-500 border-emerald-500' : 'border-white/15',
                                            ].join(' ')}
                                        >
                                            {isDone && <Check size={9} strokeWidth={3} className="text-black" />}
                                        </span>
                                        <span
                                            className={[
                                                'text-[13px] leading-relaxed',
                                                isDone ? 'text-zinc-500 line-through decoration-white/20' : 'text-zinc-300',
                                            ].join(' ')}
                                        >
                                            {item}
                                        </span>
                                    </button>
                                );
                            })}
                        </>
                    ) : (
                        <p className="text-[13px] text-zinc-500 italic m-0">No checklist for this day.</p>
                    )}
                </div>
            )}
        </aside>
    );
}

function ResourceRow({
    resource,
    index,
    isActive,
    isDone,
    onSelect,
    onToggleDone,
}: {
    resource: Resource;
    index: number;
    isActive: boolean;
    isDone: boolean;
    onSelect: (index: number) => void;
    onToggleDone: (index: number) => void;
}) {
    const g = GLYPH[resource.kind];
    const Icon = g.Icon;

    if (resource.kind === 'comingsoon') {
        return (
            <div className="grid grid-cols-[32px_1fr_auto] gap-2.5 items-center p-2 px-2.5 rounded-lg bg-[#0B0F15] border border-white/[0.05] opacity-60 cursor-not-allowed">
                <div className="w-8 h-8 rounded-md bg-white/[0.03] grid place-items-center text-zinc-600">
                    <Lock size={14} />
                </div>
                <div className="min-w-0">
                    <h4 className="text-[13px] font-medium text-zinc-500 m-0 leading-tight">{resource.label}</h4>
                    <p className="text-[11px] text-zinc-600 m-0">Coming soon</p>
                </div>
                <span className="text-[10px] text-zinc-600 font-mono">Soon</span>
            </div>
        );
    }

    const iframeable = canIframeResource(resource);
    const cardClasses = [
        'w-full grid grid-cols-[32px_1fr] gap-2.5 items-center pl-2.5 pr-9 py-2 rounded-lg border transition-all text-left no-underline',
        isActive
            ? 'bg-blue-500/[0.10] border-blue-500/40'
            : isDone
            ? 'bg-emerald-500/[0.04] border-emerald-500/25 hover:border-emerald-500/40'
            : 'bg-[#0B0F15] border-white/[0.06] hover:border-white/[0.15] hover:bg-[#0E131B]',
    ].join(' ');

    const body = (
        <>
            <div
                className={[
                    'w-8 h-8 rounded-md grid place-items-center shrink-0',
                    isActive
                        ? 'bg-blue-500/20 text-blue-200'
                        : isDone
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : 'bg-white/[0.04] text-blue-300',
                ].join(' ')}
            >
                <Icon size={14} />
            </div>
            <div className="min-w-0">
                <h4
                    className={[
                        'text-[13px] font-medium m-0 leading-tight truncate',
                        isActive ? 'text-white' : isDone ? 'text-zinc-400' : 'text-zinc-100',
                    ].join(' ')}
                >
                    {resource.label}
                </h4>
                <p className="text-[11px] text-zinc-500 m-0 flex items-center gap-1">
                    <span className="truncate">{g.label}</span>
                    {!iframeable && <ExternalLink size={10} className="shrink-0 text-zinc-600" />}
                </p>
            </div>
        </>
    );

    const card = iframeable ? (
        <button type="button" onClick={() => onSelect(index)} className={cardClasses}>
            {body}
        </button>
    ) : resource.href.startsWith('http') ? (
        <a href={resource.href} target="_blank" rel="noreferrer" className={cardClasses}>
            {body}
        </a>
    ) : (
        <Link href={resource.href} target="_blank" className={cardClasses}>
            {body}
        </Link>
    );

    return (
        <div className="relative group">
            {card}
            <button
                type="button"
                onClick={() => onToggleDone(index)}
                aria-pressed={isDone}
                aria-label={isDone ? `Mark ${resource.label} as not done` : `Mark ${resource.label} as done`}
                className={[
                    'absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 md:w-5 md:h-5 rounded-full grid place-items-center border transition-all z-10',
                    isDone
                        ? 'bg-emerald-500 border-emerald-500 hover:bg-emerald-400'
                        : 'border-white/25 hover:border-emerald-400 hover:bg-emerald-400/10 md:opacity-50 md:group-hover:opacity-100',
                ].join(' ')}
            >
                <Check
                    size={12}
                    strokeWidth={3.5}
                    className={isDone ? 'text-black' : 'text-white/30 md:text-transparent md:group-hover:text-emerald-400/70 transition-colors'}
                />
            </button>
        </div>
    );
}
