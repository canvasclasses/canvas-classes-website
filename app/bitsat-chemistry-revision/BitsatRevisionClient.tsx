'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    Atom,
    BookOpen,
    Brain,
    Calculator,
    CheckCircle2,
    ChevronDown,
    Circle,
    Clock,
    Clapperboard,
    Flame,
    FlaskConical,
    Layers,
    Lightbulb,
    Lock,
    Microscope,
    Play,
    Sparkles,
    Target,
    Timer,
    TrendingUp,
    Trophy,
    X,
    Zap,
} from 'lucide-react';

// =====================================================================
// DATA — Session 1 visualisations
// =====================================================================

type StatCard = {
    label: string;
    value: number;
    prefix?: string;
    suffix: string;
    accent: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    sub: string;
};

const SESSION1_STATS: StatCard[] = [
    {
        label: 'Mark Handicap',
        value: 30,
        prefix: '−',
        suffix: '',
        accent: 'text-red-400',
        icon: AlertTriangle,
        sub: 'lost by JEE-only aspirants ignoring deleted chapters',
    },
    {
        label: 'Deleted-Syllabus Qs',
        value: 10,
        suffix: '/paper',
        accent: 'text-orange-400',
        icon: Layers,
        sub: 'from Polymers, Solid State, s-Block, Environmental',
    },
    {
        label: '"Mark for Review"',
        value: 130,
        suffix: ' Qs',
        accent: 'text-amber-400',
        icon: Timer,
        sub: 'button was missing — UI panic',
    },
    {
        label: 'LPP + Stats Qs',
        value: 5,
        suffix: '/section',
        accent: 'text-emerald-400',
        icon: TrendingUp,
        sub: 'free marks JEE students usually skip',
    },
];

type TopicSlice = { label: string; value: number; color: string };

const CHEM_DISTRIBUTION: TopicSlice[] = [
    { label: 'Physical Chemistry', value: 32, color: '#10b981' },
    { label: 'Organic Chemistry', value: 28, color: '#a855f7' },
    { label: 'Inorganic (niche)', value: 15, color: '#f97316' },
    { label: 'Deleted-syllabus', value: 25, color: '#ef4444' },
];

type BarItem = { label: string; value: number };

const MATHS_DISTRIBUTION: BarItem[] = [
    { label: 'LPP', value: 5 },
    { label: 'Statistics', value: 4 },
    { label: 'Probability', value: 4 },
    { label: 'Calculus', value: 3 },
    { label: 'Coordinate', value: 3 },
    { label: 'Vectors / 3D', value: 3 },
    { label: 'Algebra', value: 2 },
];

type ToneKey = 'red' | 'orange' | 'amber' | 'emerald' | 'purple';

const TONE_CLASSES: Record<ToneKey, { border: string; borderHover: string; iconBg: string; iconBorder: string; text: string }> = {
    red: {
        border: 'border-red-500/20',
        borderHover: 'hover:border-red-500/40',
        iconBg: 'bg-red-500/10',
        iconBorder: 'border-red-500/20',
        text: 'text-red-400',
    },
    orange: {
        border: 'border-orange-500/20',
        borderHover: 'hover:border-orange-500/40',
        iconBg: 'bg-orange-500/10',
        iconBorder: 'border-orange-500/20',
        text: 'text-orange-400',
    },
    amber: {
        border: 'border-amber-500/20',
        borderHover: 'hover:border-amber-500/40',
        iconBg: 'bg-amber-500/10',
        iconBorder: 'border-amber-500/20',
        text: 'text-amber-400',
    },
    emerald: {
        border: 'border-emerald-500/20',
        borderHover: 'hover:border-emerald-500/40',
        iconBg: 'bg-emerald-500/10',
        iconBorder: 'border-emerald-500/20',
        text: 'text-emerald-400',
    },
    purple: {
        border: 'border-purple-500/20',
        borderHover: 'hover:border-purple-500/40',
        iconBg: 'bg-purple-500/10',
        iconBorder: 'border-purple-500/20',
        text: 'text-purple-400',
    },
};

type Trap = { title: string; body: string; icon: React.ComponentType<{ className?: string; size?: number }>; tone: ToneKey };

const TRAPS: Trap[] = [
    {
        title: 'The Deleted-Syllabus Trap',
        body: 'BITSAT does NOT follow the reduced JEE syllabus. Polymers, Solid State, s-Block and Environmental Chemistry account for ~30 marks. Ignoring them = an automatic handicap.',
        icon: Layers,
        tone: 'red',
    },
    {
        title: 'The Calculation Trap',
        body: 'Physical Chemistry is now calculation-heavy with awkward numbers (e.g. 10.1 min half-life). No calculator allowed — approximation skill is the differentiator.',
        icon: Calculator,
        tone: 'orange',
    },
    {
        title: 'The Inorganic Trivia Trap',
        body: 'Niche fact-checks like "lightest metal" or "oxidation state of Fe in deoxymyoglobin" appear. Flashcards are the only viable defense.',
        icon: Brain,
        tone: 'amber',
    },
    {
        title: 'The UI Glitch Trap',
        body: '"Mark for Review" was missing for the first 130 questions in Session 1. Practise without it — track doubts on a physical rough sheet.',
        icon: AlertTriangle,
        tone: 'emerald',
    },
    {
        title: 'The Bonus-Question Trap',
        body: 'Bonus block was reported as "weirdly hard" with duplicate options. Unlock ONLY if you have 20+ minutes and 115+ confident attempts.',
        icon: Trophy,
        tone: 'purple',
    },
];

// =====================================================================
// 30-DAY MASTER PLAN
// =====================================================================

type ResourceKind =
    | 'flashcards'
    | 'periodic'
    | 'trends'
    | 'oneshot'
    | 'crash-course'
    | 'twomin'
    | 'notes'
    | 'top50'
    | 'organic'
    | 'inorganic'
    | 'physical'
    | 'name-rxns'
    | 'wizard'
    | 'salt'
    | 'comingsoon';

type Resource = {
    label: string;
    href: string;
    kind: ResourceKind;
    embedUrl?: string;
};

type Day = {
    day: number;
    title: string;
    focus: string;
    tip?: string;
    resources: Resource[];
};

type Phase = {
    id: string;
    label: string;
    days: string;
    goal: string;
    accent: string;
    gradient: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    items: Day[];
};

// Helper to build embed URLs
const yt = (id: string, start?: number): string =>
    `https://www.youtube.com/embed/${id}${start ? `?start=${start}` : ''}`;
const pdf = (driveId: string): string =>
    `https://drive.google.com/file/d/${driveId}/preview`;

const PHASES: Phase[] = [
    {
        id: 'phase1',
        label: 'Phase 1 · The "Deleted" Goldmine',
        days: 'Days 1–7',
        goal: 'Secure the ~30 marks that everyone else is losing.',
        accent: 'text-red-400',
        gradient: 'from-red-500/20 via-orange-500/10 to-transparent',
        icon: Layers,
        items: [
            {
                day: 1,
                title: 'Solid State — Crystal Lattices',
                focus: 'Bravais lattices, packing efficiency, density formula. BITSAT loves "glass properties" and FCC vs BCC density questions.',
                tip: 'Memorise z = 1, 2, 4 for SC, BCC, FCC by heart.',
                resources: [
                    { label: 'Crash Course — Lecture 1', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('0K9cPDaex-Q') },
                    { label: 'Crash Course — Lecture 2', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('MbkBw_25flA') },
                    { label: 'Solid State Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('11XN4k6SsM5Ah-3XIUPB6HcKes1xx49oO') },
                    { label: 'Solid State Flashcards', href: '/chemistry-flashcards/solid-state', kind: 'flashcards' },
                ],
            },
            {
                day: 2,
                title: 'Solid State — Defects & Magnetic',
                focus: 'Schottky vs Frenkel, F-centres, ferro/ferri/anti-ferromagnetism, semiconductor doping.',
                resources: [
                    { label: 'Defects One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('vR50K7Qnrm8') },
                    { label: 'Crash Course — Lecture 3', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('qCtrDH3vdTk') },
                    { label: 'Crash Course — Lecture 4', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('hIGYm9aXwrY') },
                    { label: 'Solid State Flashcards', href: '/chemistry-flashcards/solid-state', kind: 'flashcards' },
                ],
            },
            {
                day: 3,
                title: 'Polymers — Classification & PDI',
                focus: 'Addition vs condensation, monomers of Nylon-6, Nylon-6,6, Bakelite, Neoprene. Polydispersity Index calculation.',
                tip: 'BITSAT 2024 + 2026 both asked PDI numericals.',
                resources: [
                    { label: 'Polymers One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('uOHeVhjFg2M') },
                    { label: 'Polymers Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1ik9tKOvOObojUyD-t4e8RpvNY7j7lZT2') },
                ],
            },
            {
                day: 4,
                title: 'Chemistry in Everyday Life',
                focus: 'Drug classification — antihistamines, antacids, sweeteners (Aspartame vs Saccharin), antiseptics vs disinfectants.',
                resources: [
                    { label: 'Everyday Life One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('CiHMGlxPPoM') },
                    { label: 'Polymers & Everyday Life Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1ik9tKOvOObojUyD-t4e8RpvNY7j7lZT2') },
                ],
            },
            {
                day: 5,
                title: 'Environmental Chemistry',
                focus: 'Ozone depletion (UV-B), greenhouse gases ranking, BOD/COD, photochemical smog vs classical smog.',
                resources: [
                    { label: 'Environmental One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('GKUEh6FIGUY') },
                ],
            },
            {
                day: 6,
                title: 's-Block — Group 1 & 2 Anomalies',
                focus: 'Diagonal relationship, solubility trends, Li anomaly, Be anomaly, lattice/hydration enthalpy logic.',
                resources: [
                    { label: 's-Block One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('zmnRASd0GhA') },
                    { label: 's-Block Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1KtSpn3o1jg379BWeP8VmKjohyqoPe3GP') },
                    { label: 'Interactive Periodic Table', href: '/interactive-periodic-table', kind: 'periodic' },
                ],
            },
            {
                day: 7,
                title: 'Metallurgy',
                focus: 'Ore names per metal, froth-flotation depressants, Ellingham diagram intuition, electrolytic refining cathode/anode.',
                resources: [
                    { label: 'Metallurgy One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('2XWd2XsZMyo') },
                    { label: 'Ellingham Diagram', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('nFAob7yxwNM') },
                    { label: 'Metallurgy Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('18QSAqxCor5xibarUu1askEeVfThudu3e') },
                    { label: 'Metallurgy Flashcards', href: '/chemistry-flashcards/metallurgy', kind: 'flashcards' },
                ],
            },
        ],
    },
    {
        id: 'phase2',
        label: 'Phase 2 · The Calculation Heavyweight',
        days: 'Days 8–17',
        goal: 'Build no-calculator stamina for Physical Chemistry.',
        accent: 'text-emerald-400',
        gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
        icon: Calculator,
        items: [
            {
                day: 8,
                title: 'Atomic Structure — Quantum Numbers',
                focus: 'Bohr model edge-cases, de Broglie, Heisenberg, photoelectric numerical patterns.',
                resources: [
                    { label: 'Atomic Structure One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('_fOi9q31vHQ', 7313) },
                    { label: 'Atomic in 18 Min', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('l6Q-Z18DdSg') },
                    { label: 'Atomic Structure Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1P09Ze_DwfSyla-klmuP9JF3Qby1GakP9') },
                    { label: 'Atomic Structure Flashcards', href: '/chemistry-flashcards/atomic-structure', kind: 'flashcards' },
                ],
            },
            {
                day: 9,
                title: 'Chemical Kinetics — Order & Rate',
                focus: 'Pseudo-first-order, integrated rate laws, half-life with awkward numbers (e.g. t½ = 10.1 min).',
                tip: 'Round once, calculate, round again.',
                resources: [
                    { label: 'Kinetics One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('ns2zwlXgwCw') },
                    { label: 'Kinetics Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('10S4kxF-cRE0dUKEzu2VNQERf4R68pn6Z') },
                    { label: 'Kinetics Flashcards', href: '/chemistry-flashcards/chemical-kinetics', kind: 'flashcards' },
                ],
            },
            {
                day: 10,
                title: 'Kinetics — Arrhenius & Mechanisms',
                focus: 'Activation energy two-temperature problems, catalyst effect, molecularity vs order.',
                resources: [
                    { label: 'Kinetics One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('ns2zwlXgwCw') },
                    { label: 'Kinetics Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('10S4kxF-cRE0dUKEzu2VNQERf4R68pn6Z') },
                    { label: 'Kinetics Flashcards', href: '/chemistry-flashcards/chemical-kinetics', kind: 'flashcards' },
                ],
            },
            {
                day: 11,
                title: 'Thermodynamics — Laws & Processes',
                focus: 'Reversible vs irreversible work, Carnot cycle efficiency, Hess law shortcuts.',
                resources: [
                    { label: 'Thermodynamics One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('GLBB7iwpJMw') },
                    { label: 'Top 50 Concepts', href: '/top-50-concepts', kind: 'top50' },
                ],
            },
            {
                day: 12,
                title: 'Thermodynamics — Spontaneity',
                focus: '∆G, ∆S of universe, Gibbs–Helmholtz, coupling reactions.',
                resources: [
                    { label: 'Thermodynamics One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('GLBB7iwpJMw') },
                    { label: 'Top 50 Concepts', href: '/top-50-concepts', kind: 'top50' },
                ],
            },
            {
                day: 13,
                title: 'Solutions — Colligative Properties',
                focus: 'van\'t Hoff factor, abnormal molar mass, Raoult deviations, osmotic pressure numericals.',
                resources: [
                    { label: 'Crash Course — Lecture 1', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('iaL2uo2yrA8') },
                    { label: 'Crash Course — Lecture 2', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('W0DOYAVl-vs') },
                    { label: 'Solutions Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1qyIOR1Y5aMQP12a_n6iYwJIsxZjJUWp7') },
                    { label: 'Solutions Flashcards', href: '/chemistry-flashcards/solutions', kind: 'flashcards' },
                ],
            },
            {
                day: 14,
                title: 'Equilibrium — Ionic & Chemical',
                focus: 'Kc/Kp, Le Chatelier shifts, buffer pH (Henderson), Ksp common-ion effect.',
                resources: [
                    { label: 'Solutions Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1qyIOR1Y5aMQP12a_n6iYwJIsxZjJUWp7') },
                    { label: 'Ksp Calculator', href: '/solubility-product-ksp-calculator', kind: 'physical' },
                ],
            },
            {
                day: 15,
                title: 'Electrochemistry — Cells',
                focus: 'EMF, Nernst at non-standard log values, Kohlrausch law, electrolysis quantitative problems.',
                tip: 'Practise log 2 = 0.30, log 3 = 0.48 by heart.',
                resources: [
                    { label: 'Electrochemistry One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('rewf5tsVEAU') },
                    { label: 'Electrochemistry Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1hHYRF_B5mZLnZKy_GEy0Cb4RYBmDjnfj') },
                    { label: 'Electrochemistry Flashcards', href: '/chemistry-flashcards/electrochemistry', kind: 'flashcards' },
                ],
            },
            {
                day: 16,
                title: 'Electrochemistry — Conductance',
                focus: 'Molar/equivalent conductivity, transport number, fuel cells, corrosion electrochemistry.',
                resources: [
                    { label: 'Electrochemistry One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('rewf5tsVEAU') },
                    { label: 'Electrochemistry Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1hHYRF_B5mZLnZKy_GEy0Cb4RYBmDjnfj') },
                    { label: 'Electrochemistry Flashcards', href: '/chemistry-flashcards/electrochemistry', kind: 'flashcards' },
                ],
            },
            {
                day: 17,
                title: 'Surface Chemistry',
                focus: 'Adsorption isotherms (Freundlich, Langmuir), colloids classification, Hardy-Schulze, emulsions.',
                resources: [
                    { label: 'Surface Chemistry Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1A-BcI6wcUqadh3ki3xrQdS5XS5jXIkgL') },
                    { label: 'Surface Chemistry Flashcards', href: '/chemistry-flashcards/surface-chemistry', kind: 'flashcards' },
                ],
            },
        ],
    },
    {
        id: 'phase3',
        label: 'Phase 3 · The Mechanistic Deep-Dive',
        days: 'Days 18–25',
        goal: 'Multi-step Organic + niche Inorganic trivia.',
        accent: 'text-purple-400',
        gradient: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
        icon: Microscope,
        items: [
            {
                day: 18,
                title: 'GOC — Resonance & Hyperconjugation',
                focus: 'Stability orderings, +M / −M groups, electrophile/nucleophile strength.',
                resources: [
                    { label: 'GOC One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('yg_xIkyGtxg') },
                    { label: 'GOC Handwritten Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('11vnQB7wHZeQAdKp4d27NzLAicgsnM1QO') },
                    { label: 'GOC & POC Flashcards', href: '/chemistry-flashcards/goc-and-poc', kind: 'flashcards' },
                ],
            },
            {
                day: 19,
                title: 'Stereochemistry — Fischer & Newman',
                focus: 'R/S assignment, E/Z, optical activity, meso identification — appeared 3–4 times in Session 1.',
                resources: [
                    { label: 'Stereo Top 20 MCQ', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('Ilcx5-TDIsA') },
                    { label: 'Stereochemistry Flashcards', href: '/chemistry-flashcards/stereochemistry', kind: 'flashcards' },
                ],
            },
            {
                day: 20,
                title: 'Hydrocarbons + Halides',
                focus: 'Markovnikov / anti-Markovnikov, SN1 vs SN2, E1 vs E2, free-radical chain.',
                resources: [
                    { label: 'Haloalkanes Flashcards', href: '/chemistry-flashcards/haloalkanes', kind: 'flashcards' },
                    { label: 'Name Reactions', href: '/organic-name-reactions', kind: 'name-rxns' },
                    { label: 'Organic Wizard', href: '/organic-wizard', kind: 'wizard' },
                ],
            },
            {
                day: 21,
                title: 'Alcohols, Phenols, Ethers',
                focus: 'Lucas test, Williamson synthesis, Reimer-Tiemann, Kolbe — high-yield mechanism questions.',
                resources: [
                    { label: 'Alcohols Flashcards', href: '/chemistry-flashcards/alcohols', kind: 'flashcards' },
                    { label: 'Name Reactions', href: '/organic-name-reactions', kind: 'name-rxns' },
                    { label: '2-Min Chemistry', href: '/2-minute-chemistry', kind: 'twomin' },
                ],
            },
            {
                day: 22,
                title: 'Aldehydes, Ketones, Acids',
                focus: 'Aldol vs Cannizzaro, HVZ, Clemmensen vs Wolff-Kishner, decarboxylation.',
                resources: [
                    { label: 'Aldehydes Flashcards', href: '/chemistry-flashcards/aldehydes', kind: 'flashcards' },
                    { label: 'Name Reactions', href: '/organic-name-reactions', kind: 'name-rxns' },
                    { label: 'Organic Wizard', href: '/organic-wizard', kind: 'wizard' },
                ],
            },
            {
                day: 23,
                title: 'Amines + Biomolecules',
                focus: 'Hofmann vs Saytzeff, diazonium salts, peptide linkages, anomeric carbon, DNA vs RNA bases.',
                tip: 'Know Fe oxidation state in deoxymyoglobin (+2) — asked in Session 1.',
                resources: [
                    { label: 'Amines One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('bLhQJYmZDos') },
                    { label: 'Biomolecules One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('PnwNgp7HUeg') },
                    { label: 'Biomolecules Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1mAWd4AAKevz8CeNQUwIZ3_dIXa0UwpxI') },
                    { label: 'Amines Flashcards', href: '/chemistry-flashcards/amines', kind: 'flashcards' },
                    { label: 'Biomolecules Flashcards', href: '/chemistry-flashcards/biomolecules', kind: 'flashcards' },
                ],
            },
            {
                day: 24,
                title: 'Coordination Compounds',
                focus: 'IUPAC naming, CFT splitting, magnetic moment, isomerism, EAN rule.',
                resources: [
                    { label: 'Coordination One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('X_sLzR_ZFfI', 194) },
                    { label: 'Coordination Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('14BiqjbfPBn415hfyYoHew-ba0JzVShqm') },
                    { label: 'Coordination Flashcards', href: '/chemistry-flashcards/coordination-compounds', kind: 'flashcards' },
                ],
            },
            {
                day: 25,
                title: 'p-Block + d/f-Block trivia',
                focus: 'High-yield trends, lanthanide contraction consequences, KMnO₄/K₂Cr₂O₇ reactions, interhalogens.',
                resources: [
                    { label: 'p-Block G13 & G14 One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('agvzhBBhsLY') },
                    { label: 'All Structures of p-Block', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('9A-5gd9Q8os') },
                    { label: 'Top 30 Trends Video', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('7myt2pUILzM') },
                    { label: 'p-Block Revision Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('12-aOxkpqWop0YiuzllAJoDwwdkITs5z2') },
                    { label: 'p-Block G13/14 Flashcards', href: '/chemistry-flashcards/p-block-group-13-14', kind: 'flashcards' },
                    { label: 'p-Block G15–18 Flashcards', href: '/chemistry-flashcards/p-block-elements-g15-18', kind: 'flashcards' },
                    { label: 'Periodic Trends', href: '/periodic-trends', kind: 'trends' },
                ],
            },
        ],
    },
    {
        id: 'phase4',
        label: 'Phase 4 · The Chaos Simulation',
        days: 'Days 26–30',
        goal: 'Speed, UI adaptation, full revision.',
        accent: 'text-amber-400',
        gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
        icon: Flame,
        items: [
            {
                day: 26,
                title: 'Mock 1 + Speed Drill',
                focus: 'Solve 30 Chemistry questions in 25 minutes. Practise WITHOUT the "Mark for Review" mindset — track doubts on paper.',
                resources: [
                    { label: 'BITSAT Speed Drill', href: '#', kind: 'comingsoon' },
                    { label: 'All Flashcards', href: '/chemistry-flashcards', kind: 'flashcards' },
                ],
            },
            {
                day: 27,
                title: 'Deleted-Syllabus Sprint',
                focus: 'Re-flip Polymers, Solid State, Everyday Chemistry, Environmental, s-Block flashcards. 1 hour total.',
                resources: [
                    { label: 'BITSAT Mock Test', href: '#', kind: 'comingsoon' },
                    { label: 'Chemistry Flashcards', href: '/chemistry-flashcards', kind: 'flashcards' },
                    { label: 'Handwritten Notes', href: '/handwritten-notes', kind: 'notes' },
                ],
            },
            {
                day: 28,
                title: 'Mock 2 + Inorganic Trivia Sprint',
                focus: 'Full Chemistry section. Then 1 hour on Periodic Trends + Inorganic Hub for "anomaly" questions.',
                resources: [
                    { label: 'BITSAT Mock Test', href: '#', kind: 'comingsoon' },
                    { label: 'Periodic Trends', href: '/periodic-trends', kind: 'trends' },
                    { label: 'Interactive Periodic Table', href: '/interactive-periodic-table', kind: 'periodic' },
                ],
            },
            {
                day: 29,
                title: 'Organic Mechanism Sprint',
                focus: 'Re-run all Name Reactions + Organic Wizard. Focus on multi-step conversions.',
                resources: [
                    { label: 'BITSAT Speed Drill', href: '#', kind: 'comingsoon' },
                    { label: 'Name Reactions', href: '/organic-name-reactions', kind: 'name-rxns' },
                    { label: 'Organic Wizard', href: '/organic-wizard', kind: 'wizard' },
                ],
            },
            {
                day: 30,
                title: 'Final Mock + Strategy Lock',
                focus: 'One full mock under exam conditions. No phone. No calculator. Lock your skip rule + bonus rule.',
                tip: 'Sleep 8 hours tonight. Trust the prep.',
                resources: [
                    { label: 'BITSAT Full Mock', href: '#', kind: 'comingsoon' },
                    { label: 'Top 50 Concepts', href: '/top-50-concepts', kind: 'top50' },
                    { label: '2-Minute Chemistry', href: '/2-minute-chemistry', kind: 'twomin' },
                ],
            },
        ],
    },
];

const RESOURCE_META: Record<ResourceKind, { icon: React.ComponentType<{ className?: string; size?: number }>; tone: string }> = {
    flashcards: { icon: Sparkles, tone: 'text-cyan-400' },
    periodic: { icon: Atom, tone: 'text-orange-400' },
    trends: { icon: TrendingUp, tone: 'text-orange-400' },
    oneshot: { icon: Play, tone: 'text-red-400' },
    'crash-course': { icon: Clapperboard, tone: 'text-rose-400' },
    twomin: { icon: Zap, tone: 'text-yellow-400' },
    notes: { icon: BookOpen, tone: 'text-emerald-400' },
    top50: { icon: Trophy, tone: 'text-amber-400' },
    organic: { icon: FlaskConical, tone: 'text-purple-400' },
    inorganic: { icon: Atom, tone: 'text-orange-400' },
    physical: { icon: Calculator, tone: 'text-emerald-400' },
    'name-rxns': { icon: BookOpen, tone: 'text-purple-400' },
    wizard: { icon: Lightbulb, tone: 'text-purple-400' },
    salt: { icon: FlaskConical, tone: 'text-orange-400' },
    comingsoon: { icon: Lock, tone: 'text-zinc-500' },
};

// =====================================================================
// HELPERS
// =====================================================================

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const done = useRef(false);

    useEffect(() => {
        if (done.current || value === 0) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !done.current) {
                    done.current = true;
                    const dur = 1400;
                    const start = performance.now();
                    const tick = (now: number) => {
                        const t = Math.min((now - start) / dur, 1);
                        const eased = 1 - Math.pow(1 - t, 3);
                        setDisplay(Math.floor(eased * value));
                        if (t < 1) requestAnimationFrame(tick);
                        else setDisplay(value);
                    };
                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.4 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [value]);

    return (
        <span ref={ref}>
            {display}
            {suffix}
        </span>
    );
}

// =====================================================================
// SVG DONUT CHART
// =====================================================================

function DonutChart({ data, size = 220 }: { data: TopicSlice[]; size?: number }) {
    const total = data.reduce((s, d) => s + d.value, 0);
    const r = size / 2 - 18;
    const c = 2 * Math.PI * r;
    let acc = 0;

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={28} />
                {data.map((slice, i) => {
                    const dash = (slice.value / total) * c;
                    const offset = c - acc;
                    acc += dash;
                    return (
                        <motion.circle
                            key={slice.label}
                            cx={size / 2}
                            cy={size / 2}
                            r={r}
                            fill="none"
                            stroke={slice.color}
                            strokeWidth={28}
                            strokeDasharray={`${dash} ${c}`}
                            strokeDashoffset={offset}
                            transform={`rotate(-90 ${size / 2} ${size / 2})`}
                            initial={{ opacity: 0, strokeDasharray: `0 ${c}` }}
                            whileInView={{ opacity: 1, strokeDasharray: `${dash} ${c}` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: i * 0.15, ease: 'easeOut' }}
                            strokeLinecap="butt"
                        />
                    );
                })}
                <text x="50%" y="46%" textAnchor="middle" className="fill-white font-bold" style={{ fontSize: 28 }}>
                    ~40
                </text>
                <text x="50%" y="60%" textAnchor="middle" className="fill-zinc-500" style={{ fontSize: 11 }}>
                    Chem Qs / paper
                </text>
            </svg>
            <div className="flex-1 grid grid-cols-1 gap-2.5 w-full">
                {data.map((slice) => (
                    <div key={slice.label} className="flex items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: slice.color }} />
                            <span className="text-zinc-300 truncate">{slice.label}</span>
                        </div>
                        <span className="text-white font-semibold tabular-nums">{slice.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// =====================================================================
// BAR CHART
// =====================================================================

function BarChart({ data }: { data: BarItem[] }) {
    const max = Math.max(...data.map((d) => d.value));
    return (
        <div className="space-y-2.5">
            {data.map((bar, i) => (
                <div key={bar.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-zinc-400">{bar.label}</span>
                        <span className="text-zinc-200 font-semibold tabular-nums">{bar.value} Qs</span>
                    </div>
                    <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(bar.value / max) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: i * 0.08, ease: 'easeOut' }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

// =====================================================================
// RESOURCE DRAWER
// =====================================================================

type DrawerState = { url: string; title: string } | null;

function ResourceDrawer({ drawer, onClose }: { drawer: DrawerState; onClose: () => void }) {
    useEffect(() => {
        if (!drawer) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [drawer, onClose]);

    return (
        <AnimatePresence>
            {drawer && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    {/* Panel */}
                    <motion.div
                        key="panel"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="fixed top-0 right-0 h-full w-full md:w-[56%] lg:w-[50%] bg-[#0B0F15] border-l border-white/[0.08] z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.08] shrink-0">
                            <p className="text-sm font-semibold text-white truncate">{drawer.title}</p>
                            <button
                                onClick={onClose}
                                className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] hover:bg-white/[0.10] border border-white/[0.08] text-zinc-400 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        {/* iframe */}
                        <div className="flex-1 overflow-hidden">
                            <iframe
                                key={drawer.url}
                                src={drawer.url}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                allowFullScreen
                                title={drawer.title}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// =====================================================================
// RESOURCE CHIP
// =====================================================================

function ResourceChip({
    resource,
    onOpenDrawer,
}: {
    resource: Resource;
    onOpenDrawer: (url: string, title: string) => void;
}) {
    const meta = RESOURCE_META[resource.kind];
    const Icon = meta.icon;

    if (resource.kind === 'comingsoon') {
        return (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] cursor-not-allowed text-xs">
                <Lock size={12} className="text-zinc-600" />
                <span className="text-zinc-600">{resource.label}</span>
                <span className="text-[10px] text-zinc-700 font-semibold uppercase tracking-wide">Soon</span>
            </span>
        );
    }

    if (resource.embedUrl) {
        return (
            <button
                onClick={() => onOpenDrawer(resource.embedUrl!, resource.label)}
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 transition-all text-xs"
            >
                <Icon size={13} className={`${meta.tone} group-hover:scale-110 transition-transform`} />
                <span className="text-zinc-300 group-hover:text-white transition-colors">{resource.label}</span>
                <Play size={11} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </button>
        );
    }

    return (
        <Link
            href={resource.href}
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 transition-all text-xs"
        >
            <Icon size={13} className={`${meta.tone} group-hover:scale-110 transition-transform`} />
            <span className="text-zinc-300 group-hover:text-white transition-colors">{resource.label}</span>
        </Link>
    );
}

// =====================================================================
// PHASE CARD (accordion)
// =====================================================================

function PhaseCard({
    phase,
    open,
    onToggle,
    completed,
    onToggleDay,
    onOpenDrawer,
}: {
    phase: Phase;
    open: boolean;
    onToggle: () => void;
    completed: Set<number>;
    onToggleDay: (day: number) => void;
    onOpenDrawer: (url: string, title: string) => void;
}) {
    const Icon = phase.icon;
    const phaseDays = phase.items.map((d) => d.day);
    const phaseDone = phaseDays.filter((d) => completed.has(d)).length;
    const phasePct = Math.round((phaseDone / phaseDays.length) * 100);

    return (
        <div className={`rounded-2xl bg-gradient-to-br ${phase.gradient} border border-white/[0.06] overflow-hidden`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-4 p-5 md:p-6 text-left hover:bg-white/[0.02] transition-colors"
            >
                <div className={`w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center ${phase.accent}`}>
                    <Icon size={22} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base md:text-lg font-bold text-white">{phase.label}</h3>
                        <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">{phase.days}</span>
                    </div>
                    <p className="text-sm text-zinc-400 mt-0.5">{phase.goal}</p>
                    <div className="mt-2.5 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-white/[0.04] rounded-full overflow-hidden max-w-[200px]">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                                style={{ width: `${phasePct}%` }}
                            />
                        </div>
                        <span className="text-[11px] text-zinc-500 tabular-nums">
                            {phaseDone}/{phaseDays.length} days
                        </span>
                    </div>
                </div>
                <ChevronDown
                    size={20}
                    className={`shrink-0 text-zinc-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </button>

            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 md:px-6 pb-5 md:pb-6 space-y-3 border-t border-white/[0.06]">
                            {phase.items.map((day) => {
                                const isDone = completed.has(day.day);
                                return (
                                    <div
                                        key={day.day}
                                        className={`rounded-xl border transition-colors ${
                                            isDone
                                                ? 'bg-emerald-500/[0.04] border-emerald-500/20'
                                                : 'bg-[#0B0F15] border-white/[0.06] hover:border-white/[0.12]'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3 p-4">
                                            <button
                                                onClick={() => onToggleDay(day.day)}
                                                className="shrink-0 mt-0.5"
                                                aria-label={`Toggle Day ${day.day}`}
                                            >
                                                {isDone ? (
                                                    <CheckCircle2 size={20} className="text-emerald-400" />
                                                ) : (
                                                    <Circle size={20} className="text-zinc-600 hover:text-zinc-400 transition-colors" />
                                                )}
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 px-1.5 py-0.5 rounded bg-white/[0.04]">
                                                        Day {day.day}
                                                    </span>
                                                    <h4 className={`text-sm md:text-base font-semibold ${isDone ? 'text-zinc-400 line-through' : 'text-white'}`}>
                                                        {day.title}
                                                    </h4>
                                                </div>
                                                <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">{day.focus}</p>
                                                {day.tip && (
                                                    <div className="mt-2.5 flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/[0.15]">
                                                        <Lightbulb size={13} className="text-amber-400 shrink-0 mt-0.5" />
                                                        <p className="text-xs text-amber-200/80 leading-relaxed">{day.tip}</p>
                                                    </div>
                                                )}
                                                <div className="mt-3 flex flex-wrap gap-1.5">
                                                    {day.resources.map((r, i) => (
                                                        <ResourceChip
                                                            key={`${r.href}-${i}`}
                                                            resource={r}
                                                            onOpenDrawer={onOpenDrawer}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// =====================================================================
// FAQ
// =====================================================================

const FAQS = [
    {
        q: 'Why is BITSAT Chemistry harder than JEE Mains Chemistry?',
        a: 'BITSAT does not follow the reduced JEE syllabus. Polymers, Solid State, s-Block, Chemistry in Everyday Life and Environmental Chemistry account for 5–10 questions per paper — roughly 30 marks JEE-only aspirants typically lose.',
    },
    {
        q: 'Which Chemistry chapters were most asked in BITSAT Session 1?',
        a: 'Solid State, Polymers, Chemistry in Everyday Life, Electrochemistry, Chemical Kinetics, Stereoisomerism, Coordination Compounds — plus niche trivia like Polydispersity Index, Agostic interactions, oxidation state of Fe in deoxymyoglobin.',
    },
    {
        q: 'Is 30 days enough for BITSAT Chemistry?',
        a: 'Yes if you follow the phased plan. Days 1–7 lock in the deleted syllabus, Days 8–17 build calculation stamina, Days 18–25 cover Organic mechanisms, and Days 26–30 are pure mock simulation.',
    },
    {
        q: 'How do I practise without a calculator the way BITSAT demands?',
        a: 'Round numbers to one significant figure first, then refine. Memorise log 2 = 0.30 and log 3 = 0.48. If a Physical Chemistry calculation takes more than 90 seconds, skip and return.',
    },
    {
        q: 'Should I attempt the BITSAT bonus questions?',
        a: 'Only if you have 20+ minutes left and have confidently attempted 115+ regular questions. The Session 1 bonus block was advanced and trap-heavy — high risk to your accuracy.',
    },
    {
        q: 'Is this BITSAT Chemistry plan free?',
        a: 'Yes — the entire 30-day plan and every linked resource (flashcards, interactive periodic table, one-shot lectures, handwritten notes) is completely free on Canvas Classes.',
    },
];

function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-xl bg-[#0B0F15] border border-white/[0.06] overflow-hidden">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
            >
                <span className="text-sm md:text-base font-semibold text-white">{q}</span>
                <ChevronDown
                    size={18}
                    className={`shrink-0 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <p className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">{a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// =====================================================================
// MAIN CLIENT
// =====================================================================

const STORAGE_KEY = 'bitsat-chem-plan-v1';

export default function BitsatRevisionClient() {
    const [openPhase, setOpenPhase] = useState<string>('phase1');
    const [completed, setCompleted] = useState<Set<number>>(new Set());
    const [hydrated, setHydrated] = useState(false);
    const [drawer, setDrawer] = useState<DrawerState>(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const arr = JSON.parse(raw);
                if (Array.isArray(arr)) setCompleted(new Set(arr));
            }
        } catch {}
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)));
        } catch {}
    }, [completed, hydrated]);

    const toggleDay = (day: number) => {
        setCompleted((prev) => {
            const next = new Set(prev);
            if (next.has(day)) next.delete(day);
            else next.add(day);
            return next;
        });
    };

    const openDrawer = (url: string, title: string) => setDrawer({ url, title });
    const closeDrawer = () => setDrawer(null);

    const totalDone = completed.size;
    const overallPct = Math.round((totalDone / 30) * 100);

    const allTopics = useMemo(() => CHEM_DISTRIBUTION, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <ResourceDrawer drawer={drawer} onClose={closeDrawer} />

            {/* ============== HERO ============== */}
            <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.08),transparent_50%)]" />
                <div className="relative max-w-6xl mx-auto px-5 md:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-6"
                    >
                        <Flame size={12} />
                        BITSAT 2026 · Session 2 Master Plan
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl mx-auto"
                    >
                        Crack BITSAT Chemistry in{' '}
                        <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                            30 Days
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-5 md:mt-6 text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        Built from real Session 1 data. The chapters JEE aspirants ignore, the calculation traps that wreck timing, and a daily plan mapped to every free Canvas resource you need.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
                    >
                        <a
                            href="#plan"
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm hover:scale-[1.02] transition-transform"
                        >
                            Start Day 1
                        </a>
                        <a
                            href="#post-mortem"
                            className="px-6 py-3 rounded-full bg-white/[0.05] border border-white/10 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
                        >
                            Read Session 1 Post-Mortem
                        </a>
                    </motion.div>

                    {hydrated && totalDone > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-10 max-w-md mx-auto p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]"
                        >
                            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                                <span className="font-semibold text-zinc-300">Your Progress</span>
                                <span className="tabular-nums">{totalDone} / 30 days · {overallPct}%</span>
                            </div>
                            <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full transition-all duration-500"
                                    style={{ width: `${overallPct}%` }}
                                />
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* ============== POST-MORTEM ============== */}
            <section id="post-mortem" className="py-16 md:py-24 border-t border-white/[0.05]">
                <div className="max-w-6xl mx-auto px-5 md:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider mb-4">
                            <AlertTriangle size={12} />
                            Session 1 Post-Mortem
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                            Session 1 wasn&apos;t a speed test. It was a{' '}
                            <span className="text-red-400">psychological trap</span>.
                        </h2>
                        <p className="mt-4 text-zinc-400 leading-relaxed">
                            The most prepared students didn&apos;t fail because they didn&apos;t know the concepts. They failed because they walked in expecting JEE — and got blindsided by deleted-syllabus questions and a missing UI button.
                        </p>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-12">
                        {SESSION1_STATS.map((stat, i) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.08 }}
                                    className="p-4 md:p-5 rounded-2xl bg-[#0B0F15] border border-white/[0.06]"
                                >
                                    <Icon className={`${stat.accent} mb-3`} size={20} />
                                    <div className={`text-3xl md:text-4xl font-black ${stat.accent} tabular-nums`}>
                                        {stat.prefix ?? ''}
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <div className="mt-1.5 text-xs font-semibold text-white">{stat.label}</div>
                                    <div className="mt-1 text-[11px] text-zinc-500 leading-relaxed">{stat.sub}</div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Charts row */}
                    <div className="grid lg:grid-cols-2 gap-4 md:gap-6 mb-12">
                        <div className="p-6 md:p-8 rounded-2xl bg-[#0B0F15] border border-white/[0.06]">
                            <div className="flex items-center gap-2 mb-1">
                                <FlaskConical size={16} className="text-emerald-400" />
                                <h3 className="text-base font-bold text-white">Chemistry Question Mix</h3>
                            </div>
                            <p className="text-xs text-zinc-500 mb-6">
                                Roughly 25% of Chemistry came from JEE-deleted chapters.
                            </p>
                            <DonutChart data={allTopics} />
                        </div>
                        <div className="p-6 md:p-8 rounded-2xl bg-[#0B0F15] border border-white/[0.06]">
                            <div className="flex items-center gap-2 mb-1">
                                <Calculator size={16} className="text-orange-400" />
                                <h3 className="text-base font-bold text-white">Maths Question Distribution</h3>
                            </div>
                            <p className="text-xs text-zinc-500 mb-6">
                                LPP, Stats and Probability dominated — easy marks JEE students skip.
                            </p>
                            <BarChart data={MATHS_DISTRIBUTION} />
                        </div>
                    </div>

                    {/* Traps */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-5 flex items-center gap-2">
                        <Target size={20} className="text-orange-400" />
                        The 5 Traps That Cost Students Their Rank
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {TRAPS.map((trap, i) => {
                            const Icon = trap.icon;
                            const tone = TONE_CLASSES[trap.tone];
                            return (
                                <motion.div
                                    key={trap.title}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.35, delay: i * 0.06 }}
                                    className={`p-5 rounded-2xl bg-[#0B0F15] border ${tone.border} ${tone.borderHover} transition-colors`}
                                >
                                    <Icon size={18} className={`${tone.text} mb-3`} />
                                    <h4 className="text-sm font-bold text-white mb-1.5">{trap.title}</h4>
                                    <p className="text-xs text-zinc-400 leading-relaxed">{trap.body}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============== 30-DAY PLAN ============== */}
            <section id="plan" className="py-16 md:py-24 border-t border-white/[0.05]">
                <div className="max-w-6xl mx-auto px-5 md:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-4">
                            <Clock size={12} />
                            The 30-Day Master Plan
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                            4 phases. 30 days.{' '}
                            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                                Zero fluff.
                            </span>
                        </h2>
                        <p className="mt-4 text-zinc-400 leading-relaxed">
                            Every resource chip opens directly on this page — no tab-switching. Click a lecture or notes chip to read or watch without leaving your plan.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {PHASES.map((phase) => (
                            <PhaseCard
                                key={phase.id}
                                phase={phase}
                                open={openPhase === phase.id}
                                onToggle={() => setOpenPhase(openPhase === phase.id ? '' : phase.id)}
                                completed={completed}
                                onToggleDay={toggleDay}
                                onOpenDrawer={openDrawer}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ============== EXAM-DAY STRATEGY ============== */}
            <section className="py-16 md:py-24 border-t border-white/[0.05]">
                <div className="max-w-5xl mx-auto px-5 md:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-4">
                            <Target size={12} />
                            Exam-Day Tactics
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                            The 4 rules that protect your accuracy
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {([
                            {
                                icon: Timer,
                                title: 'The 10-Second Skip Rule',
                                body: 'If a Physical Chemistry question looks like a multi-step calculation, OR a question seems mathematically off (duplicate options, impossible setup), skip in 10 seconds. Do not ego-solve.',
                                tone: 'orange' as ToneKey,
                            },
                            {
                                icon: Trophy,
                                title: 'The Bonus-Question Gate',
                                body: 'Unlock bonus questions ONLY when you have 20+ minutes left AND you have confidently attempted 115+ questions. Otherwise, do not touch them — they tank accuracy.',
                                tone: 'amber' as ToneKey,
                            },
                            {
                                icon: AlertTriangle,
                                title: 'The "No Mark for Review" Mindset',
                                body: 'Practise as if the button does not exist. Track your doubts on a physical rough sheet — write the question number, circle it, move on. Revisit only after one full pass.',
                                tone: 'red' as ToneKey,
                            },
                            {
                                icon: Calculator,
                                title: 'The 90-Second Trap Check',
                                body: 'Any Physical Chemistry calculation taking longer than 90 seconds is engineered to waste your time. Skip, finish the rest of the section, return at the end if you still have buffer.',
                                tone: 'emerald' as ToneKey,
                            },
                        ]).map((rule, i) => {
                            const Icon = rule.icon;
                            const tone = TONE_CLASSES[rule.tone];
                            return (
                                <motion.div
                                    key={rule.title}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.35, delay: i * 0.06 }}
                                    className="p-5 md:p-6 rounded-2xl bg-[#0B0F15] border border-white/[0.06] hover:border-white/[0.15] transition-colors"
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tone.iconBg} border ${tone.iconBorder} mb-3`}>
                                        <Icon size={18} className={tone.text} />
                                    </div>
                                    <h4 className="text-base font-bold text-white mb-2">{rule.title}</h4>
                                    <p className="text-sm text-zinc-400 leading-relaxed">{rule.body}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ============== FAQ ============== */}
            <section className="py-16 md:py-24 border-t border-white/[0.05]">
                <div className="max-w-3xl mx-auto px-5 md:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                        {FAQS.map((f) => (
                            <FAQItem key={f.q} q={f.q} a={f.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ============== FOOTER CTA ============== */}
            <section className="py-16 md:py-20 border-t border-white/[0.05]">
                <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-4">
                        Bookmark this page. Come back every day.
                    </h2>
                    <p className="text-zinc-400 leading-relaxed mb-6">
                        Your daily progress is saved on this device. Open the page each morning, knock out the day&apos;s focus, tick the box, and come back tomorrow.
                    </p>
                    <a
                        href="#plan"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm hover:scale-[1.02] transition-transform"
                    >
                        <Sparkles size={16} />
                        Open the Plan
                    </a>
                </div>
            </section>
        </div>
    );
}
