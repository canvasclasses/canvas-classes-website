'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    Atom,
    BookmarkCheck,
    Calculator,
    CheckCircle2,
    FlaskConical,
    Layers,
    LucideIcon,
    Repeat,
    Sparkles,
    Target,
    TestTube,
    TrendingUp,
} from 'lucide-react';
import { getToolCardForSlug, type ToolCardConfig } from '../data/toolCardConfig';

// ─── Brand-style SVG icons ────────────────────────────────────────────────────

function CrucibleLogoIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
            <circle cx="29" cy="35" r="22" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="29" cy="35" r="13.5" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="29" cy="35" r="5" fill="currentColor" />
            <circle cx="50" cy="15" r="4.5" fill="currentColor" />
        </svg>
    );
}

function FlashcardLightningIcon({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
            <path
                d="M37 6 L18 36 L29 36 L26 58 L46 28 L34 28 L37 6 Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
            />
        </svg>
    );
}

function PeriodicGridIcon({ className }: { className?: string }) {
    // 3x3 grid suggesting the periodic table; one cell highlighted to suggest
    // "select an element" interactivity.
    return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden>
            <rect x="8" y="8" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <rect x="25" y="8" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <rect x="42" y="8" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <rect x="8" y="25" width="14" height="14" rx="2.5" fill="currentColor" />
            <rect x="25" y="25" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <rect x="42" y="25" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <rect x="8" y="42" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <rect x="25" y="42" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
            <rect x="42" y="42" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

// ─── Theme palette ─────────────────────────────────────────────────────────────

interface Theme {
    accentRgba: string; // for the dot pattern + glow
    sectionLabel: string;
    iconBackBorder: string;
    iconBackBg: string;
    iconFrontBorder: string;
    iconFrontBg: string;
    iconColor: string;
    pillIconBg: string;
    pillIconText: string;
    button: string;
    buttonShadow: string;
    gradientBorder: string;
    hoverBorder: string;
}

const ORANGE: Theme = {
    accentRgba: 'rgba(251,146,60,',
    sectionLabel: 'text-orange-400',
    iconBackBorder: 'border-orange-500/25',
    iconBackBg: 'bg-orange-500/[0.06]',
    iconFrontBorder: 'border-orange-500/40',
    iconFrontBg: 'bg-orange-500/[0.10]',
    iconColor: 'text-orange-400',
    pillIconBg: 'bg-orange-500/15',
    pillIconText: 'text-orange-400',
    button: 'from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white',
    buttonShadow: 'shadow-orange-500/20',
    gradientBorder: 'from-orange-500/30 to-transparent',
    hoverBorder: 'group-hover:border-orange-400/30',
};

const VIOLET: Theme = {
    accentRgba: 'rgba(167,139,250,',
    sectionLabel: 'text-violet-400',
    iconBackBorder: 'border-violet-500/20',
    iconBackBg: 'bg-violet-500/[0.05]',
    iconFrontBorder: 'border-violet-500/40',
    iconFrontBg: 'bg-violet-500/[0.10]',
    iconColor: 'text-violet-400',
    pillIconBg: 'bg-violet-500/15',
    pillIconText: 'text-violet-400',
    button: 'from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-white',
    buttonShadow: 'shadow-violet-500/20',
    gradientBorder: 'from-violet-500/30 to-transparent',
    hoverBorder: 'group-hover:border-violet-400/30',
};

const CYAN: Theme = {
    accentRgba: 'rgba(34,211,238,',
    sectionLabel: 'text-cyan-400',
    iconBackBorder: 'border-cyan-500/25',
    iconBackBg: 'bg-cyan-500/[0.06]',
    iconFrontBorder: 'border-cyan-500/40',
    iconFrontBg: 'bg-cyan-500/[0.10]',
    iconColor: 'text-cyan-400',
    pillIconBg: 'bg-cyan-500/15',
    pillIconText: 'text-cyan-400',
    button: 'from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white',
    buttonShadow: 'shadow-cyan-500/20',
    gradientBorder: 'from-cyan-500/30 to-transparent',
    hoverBorder: 'group-hover:border-cyan-400/30',
};

const EMERALD: Theme = {
    accentRgba: 'rgba(52,211,153,',
    sectionLabel: 'text-emerald-400',
    iconBackBorder: 'border-emerald-500/25',
    iconBackBg: 'bg-emerald-500/[0.06]',
    iconFrontBorder: 'border-emerald-500/40',
    iconFrontBg: 'bg-emerald-500/[0.10]',
    iconColor: 'text-emerald-400',
    pillIconBg: 'bg-emerald-500/15',
    pillIconText: 'text-emerald-400',
    button: 'from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white',
    buttonShadow: 'shadow-emerald-500/20',
    gradientBorder: 'from-emerald-500/30 to-transparent',
    hoverBorder: 'group-hover:border-emerald-400/30',
};

const AMBER: Theme = {
    accentRgba: 'rgba(251,191,36,',
    sectionLabel: 'text-amber-400',
    iconBackBorder: 'border-amber-500/25',
    iconBackBg: 'bg-amber-500/[0.06]',
    iconFrontBorder: 'border-amber-500/40',
    iconFrontBg: 'bg-amber-500/[0.10]',
    iconColor: 'text-amber-400',
    pillIconBg: 'bg-amber-500/15',
    pillIconText: 'text-amber-400',
    button: 'from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white',
    buttonShadow: 'shadow-amber-500/20',
    gradientBorder: 'from-amber-500/30 to-transparent',
    hoverBorder: 'group-hover:border-amber-400/30',
};

const ROSE: Theme = {
    accentRgba: 'rgba(251,113,133,',
    sectionLabel: 'text-rose-400',
    iconBackBorder: 'border-rose-500/25',
    iconBackBg: 'bg-rose-500/[0.06]',
    iconFrontBorder: 'border-rose-500/40',
    iconFrontBg: 'bg-rose-500/[0.10]',
    iconColor: 'text-rose-400',
    pillIconBg: 'bg-rose-500/15',
    pillIconText: 'text-rose-400',
    button: 'from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white',
    buttonShadow: 'shadow-rose-500/20',
    gradientBorder: 'from-rose-500/30 to-transparent',
    hoverBorder: 'group-hover:border-rose-400/30',
};

const INDIGO: Theme = {
    accentRgba: 'rgba(129,140,248,',
    sectionLabel: 'text-indigo-400',
    iconBackBorder: 'border-indigo-500/25',
    iconBackBg: 'bg-indigo-500/[0.06]',
    iconFrontBorder: 'border-indigo-500/40',
    iconFrontBg: 'bg-indigo-500/[0.10]',
    iconColor: 'text-indigo-400',
    pillIconBg: 'bg-indigo-500/15',
    pillIconText: 'text-indigo-400',
    button: 'from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white',
    buttonShadow: 'shadow-indigo-500/20',
    gradientBorder: 'from-indigo-500/30 to-transparent',
    hoverBorder: 'group-hover:border-indigo-400/30',
};

// ─── Shared card shell ─────────────────────────────────────────────────────────

interface FeatureStat {
    icon: LucideIcon;
    value: string;
    label: string;
}

interface CardShellProps {
    theme: Theme;
    iconNode: ReactNode;          // the front-of-stack icon (custom SVG or Lucide)
    iconStack: 'subtle' | 'fanned'; // single back layer vs. two rotated layers
    sectionLabel: string;
    title: string;
    description: string;
    stats: FeatureStat[];
    ctaLabel: string;
    ctaHref: string;
}

function CardShell({
    theme,
    iconNode,
    iconStack,
    sectionLabel,
    title,
    description,
    stats,
    ctaLabel,
    ctaHref,
}: CardShellProps) {
    return (
        <div className={`group relative rounded-2xl bg-gradient-to-br ${theme.gradientBorder} p-[1px]`}>
            <div className={`relative h-full overflow-hidden rounded-2xl border border-white/5 bg-[#0B1220]/85 p-7 backdrop-blur-xl transition-all duration-300 ${theme.hoverBorder}`}>
                {/* Soft glow on the left */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 h-full w-1/2"
                    style={{
                        backgroundImage: `radial-gradient(circle at 15% 30%, ${theme.accentRgba}0.12), transparent 55%)`,
                    }}
                />

                {/* Dotted texture lower-left */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-0 h-44 w-44"
                    style={{
                        backgroundImage: `radial-gradient(${theme.accentRgba}0.32) 1px, transparent 1px)`,
                        backgroundSize: '13px 13px',
                        maskImage: 'radial-gradient(circle at 0% 100%, black, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(circle at 0% 100%, black, transparent 70%)',
                    }}
                />

                {/* Header — icon stack on left, text on right */}
                <div className="relative flex items-start gap-5">
                    <div className="relative h-[108px] w-[108px] shrink-0">
                        {iconStack === 'fanned' && (
                            <div
                                aria-hidden
                                className={`absolute inset-0 rounded-[20px] border ${theme.iconBackBorder} ${theme.iconBackBg}`}
                                style={{ transform: 'translate(11px, 4px) rotate(10deg)' }}
                            />
                        )}
                        <div
                            aria-hidden
                            className={`absolute inset-0 rounded-[20px] border ${theme.iconBackBorder} ${theme.iconBackBg}`}
                            style={{
                                transform: iconStack === 'fanned'
                                    ? 'translate(6px, 2px) rotate(5deg)'
                                    : 'translate(7px, 7px) rotate(-7deg)',
                            }}
                        />
                        <div className={`relative flex h-full w-full items-center justify-center rounded-[20px] border ${theme.iconFrontBorder} ${theme.iconFrontBg}`}>
                            {iconNode}
                        </div>
                    </div>

                    <div className="min-w-0 flex-1 pt-2">
                        <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${theme.sectionLabel}`}>
                            {sectionLabel}
                        </p>
                        <h3 className="mt-1.5 text-[22px] font-bold leading-tight text-white md:text-2xl">
                            {title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-400">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Stats pills */}
                <div className="relative mt-6 grid grid-cols-3 gap-3">
                    {stats.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={s.label}
                                className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5"
                            >
                                <div className={`shrink-0 rounded-md ${theme.pillIconBg} p-1.5 ${theme.pillIconText}`}>
                                    <Icon size={14} />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-[13px] font-bold leading-tight text-white">
                                        {s.value}
                                    </p>
                                    <p className="truncate text-[10px] leading-tight text-gray-500">
                                        {s.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <Link
                    href={ctaHref}
                    className={`relative mt-6 block w-full rounded-xl bg-gradient-to-r py-3.5 text-center text-sm font-semibold transition shadow-lg ${theme.button} ${theme.buttonShadow}`}
                >
                    {ctaLabel} →
                </Link>
            </div>
        </div>
    );
}

// ─── Crucible card ─────────────────────────────────────────────────────────────

export function CruciblePracticeCard({
    chapterId,
    chapterName,
}: {
    chapterId: string;
    chapterName: string;
}) {
    return (
        <CardShell
            theme={ORANGE}
            iconNode={<CrucibleLogoIcon className="h-16 w-16 text-orange-400" />}
            iconStack="subtle"
            sectionLabel="Crucible"
            title={`Solve ${chapterName} questions`}
            description="Adaptive difficulty, instant feedback, and a worked solution for every wrong answer."
            stats={[
                { icon: Target, value: 'PYQ', label: 'Tagged' },
                { icon: TrendingUp, value: 'Adaptive', label: 'Difficulty' },
                { icon: CheckCircle2, value: '100%', label: 'Solutions' },
            ]}
            ctaLabel="Start Practicing"
            ctaHref={`/the-crucible/${chapterId}`}
        />
    );
}

// ─── Tool variants ─────────────────────────────────────────────────────────────

function FlashcardsCard({ flashcardSlug }: { flashcardSlug: string }) {
    return (
        <CardShell
            theme={VIOLET}
            iconNode={<FlashcardLightningIcon className="h-16 w-16 text-violet-400" />}
            iconStack="fanned"
            sectionLabel="Flash Cards"
            title="Revise with Flashcards"
            description="Tap to reveal answers — chemistry flashcards with spaced repetition for active recall."
            stats={[
                { icon: Layers, value: '2,000+', label: 'Cards' },
                { icon: Repeat, value: 'Spaced', label: 'Repetition' },
                { icon: BookmarkCheck, value: 'Chapter', label: 'Specific' },
            ]}
            ctaLabel="Open Flashcards"
            ctaHref={`/chemistry-flashcards/${flashcardSlug}`}
        />
    );
}

function PeriodicExplorerCard() {
    return (
        <CardShell
            theme={CYAN}
            iconNode={<PeriodicGridIcon className="h-16 w-16 text-cyan-400" />}
            iconStack="subtle"
            sectionLabel="Periodic Tools"
            title="Interactive Periodic Table and Periodic Trends"
            description="Explore atomic and ionic radii, ionisation enthalpy, electron affinity, and electronegativity gradients — element by element."
            stats={[
                { icon: Atom, value: '118', label: 'Elements' },
                { icon: TrendingUp, value: 'All', label: 'Trends' },
                { icon: Sparkles, value: 'Visual', label: 'Learning' },
            ]}
            ctaLabel="Explore Trends"
            ctaHref="/periodic-trends"
        />
    );
}

function OrganicWizardCard() {
    return (
        <CardShell
            theme={EMERALD}
            iconNode={<FlaskConical className="h-14 w-14 text-emerald-400" strokeWidth={1.5} />}
            iconStack="subtle"
            sectionLabel="Organic Wizard"
            title="Predict products and mechanisms"
            description="Guess products, classify reaction mechanisms, and stress-test your understanding of organic chemistry."
            stats={[
                { icon: FlaskConical, value: 'Reactions', label: 'Library' },
                { icon: Repeat, value: 'Quick', label: 'Quiz' },
                { icon: CheckCircle2, value: 'Instant', label: 'Feedback' },
            ]}
            ctaLabel="Open Wizard"
            ctaHref="/organic-wizard"
        />
    );
}

function SaltAnalysisSimCard() {
    return (
        <CardShell
            theme={AMBER}
            iconNode={<TestTube className="h-14 w-14 text-amber-400" strokeWidth={1.5} />}
            iconStack="subtle"
            sectionLabel="Salt Analysis Sim"
            title="Run a virtual cation/anion test scheme"
            description="Step-by-step lab simulation — exactly the scheme you'd run in the practical exam, with all confirmatory tests."
            stats={[
                { icon: FlaskConical, value: 'Cations', label: 'Group I–VI' },
                { icon: TestTube, value: 'Anions', label: 'All Groups' },
                { icon: Sparkles, value: 'Lab', label: 'Realistic' },
            ]}
            ctaLabel="Open Simulator"
            ctaHref="/salt-analysis"
        />
    );
}

function KspCalculatorCard() {
    return (
        <CardShell
            theme={ROSE}
            iconNode={<Calculator className="h-14 w-14 text-rose-400" strokeWidth={1.5} />}
            iconStack="subtle"
            sectionLabel="Ksp Calculator"
            title="Solubility-product solver"
            description="Crunch Ksp, common-ion, and selective-precipitation numericals in seconds — with the full step-by-step working shown."
            stats={[
                { icon: Calculator, value: 'Ksp', label: 'Solver' },
                { icon: Repeat, value: 'Common', label: 'Ion' },
                { icon: CheckCircle2, value: 'Steps', label: 'Shown' },
            ]}
            ctaLabel="Open Calculator"
            ctaHref="/solubility-product-ksp-calculator"
        />
    );
}

function VseprExplorerCard() {
    return (
        <CardShell
            theme={INDIGO}
            iconNode={<Atom className="h-14 w-14 text-indigo-400" strokeWidth={1.5} />}
            iconStack="subtle"
            sectionLabel="VSEPR Reference"
            title="Geometry, bond angles, hybridisation"
            description="Look up the predicted shape, bond angle, and hybridisation for any molecule — VSEPR rules applied for you."
            stats={[
                { icon: Atom, value: 'Shapes', label: 'AB-type' },
                { icon: TrendingUp, value: 'Angles', label: 'Predicted' },
                { icon: Sparkles, value: 'Hybrid', label: 'sp / sp²/ sp³' },
            ]}
            ctaLabel="Open Reference"
            ctaHref="/inorganic-chemistry-hub/vsepr"
        />
    );
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────

export default function ChapterToolCard() {
    const params = useParams<{ chapter: string }>();
    const chapterSlug = params?.chapter ?? '';
    const config: ToolCardConfig | null = getToolCardForSlug(chapterSlug);

    if (!config) return null;

    switch (config.kind) {
        case 'flashcards':
            return <FlashcardsCard flashcardSlug={config.flashcardSlug} />;
        case 'periodic-explorer':
            return <PeriodicExplorerCard />;
        case 'organic-wizard':
            return <OrganicWizardCard />;
        case 'salt-analysis-sim':
            return <SaltAnalysisSimCard />;
        case 'ksp-calculator':
            return <KspCalculatorCard />;
        case 'vsepr-explorer':
            return <VseprExplorerCard />;
    }
}
