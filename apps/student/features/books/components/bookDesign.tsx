/*
 * Shared visual language for the Live Books landing surfaces — the Class 9/10
 * grade landing pages and the Class 11/12 single-book table-of-contents. Keeps
 * subject theming, decor, and the custom Live Books logo in one place so both
 * surfaces stay visually in sync.
 */

import {
  Atom, Calculator, Microscope, Beaker, Globe, Languages, Sparkles,
  FlaskConical, Clock, Leaf, Heart, Zap, Hash, Divide, Plus, BookOpen,
  Pencil, MapPin, Brain, Cpu, type LucideIcon,
} from 'lucide-react';

/* ─── Subject theming ─────────────────────────────────────────────────────── */

export interface SubjectTheme {
  icon: LucideIcon;
  accent: string;
  bg: string;
  border: string;
  bar: string;
  badge: string;
  gradient: string;
  ring: string;
}

export const SUBJECT_THEME: Record<string, SubjectTheme> = {
  physics: {
    icon: Atom,
    accent: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    bar: 'from-sky-500 to-cyan-400',
    badge: 'bg-sky-500/15 text-sky-400',
    gradient: 'from-sky-500/[0.08] via-transparent to-transparent',
    ring: 'ring-sky-500/30',
  },
  mathematics: {
    icon: Calculator,
    accent: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    bar: 'from-violet-500 to-purple-400',
    badge: 'bg-violet-500/15 text-violet-400',
    gradient: 'from-violet-500/[0.08] via-transparent to-transparent',
    ring: 'ring-violet-500/30',
  },
  science: {
    icon: Microscope,
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    bar: 'from-emerald-500 to-teal-400',
    badge: 'bg-emerald-500/15 text-emerald-400',
    gradient: 'from-emerald-500/[0.08] via-transparent to-transparent',
    ring: 'ring-emerald-500/30',
  },
  chemistry: {
    icon: Beaker,
    accent: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    bar: 'from-orange-500 to-amber-400',
    badge: 'bg-orange-500/15 text-orange-400',
    gradient: 'from-orange-500/[0.08] via-transparent to-transparent',
    ring: 'ring-orange-500/30',
  },
  biology: {
    icon: Microscope,
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    bar: 'from-emerald-500 to-teal-400',
    badge: 'bg-emerald-500/15 text-emerald-400',
    gradient: 'from-emerald-500/[0.08] via-transparent to-transparent',
    ring: 'ring-emerald-500/30',
  },
  'social science': {
    icon: Globe,
    accent: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    bar: 'from-rose-500 to-pink-400',
    badge: 'bg-rose-500/15 text-rose-400',
    gradient: 'from-rose-500/[0.08] via-transparent to-transparent',
    ring: 'ring-rose-500/30',
  },
  english: {
    icon: Languages,
    accent: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    bar: 'from-amber-500 to-yellow-400',
    badge: 'bg-amber-500/15 text-amber-400',
    gradient: 'from-amber-500/[0.08] via-transparent to-transparent',
    ring: 'ring-amber-500/30',
  },
  ai: {
    icon: Sparkles,
    accent: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/20',
    bar: 'from-fuchsia-500 to-pink-400',
    badge: 'bg-fuchsia-500/15 text-fuchsia-400',
    gradient: 'from-fuchsia-500/[0.08] via-transparent to-transparent',
    ring: 'ring-fuchsia-500/30',
  },
};

export function getTheme(subject: string): SubjectTheme {
  return SUBJECT_THEME[subject.toLowerCase()] ?? SUBJECT_THEME.science;
}

/* ─── Subject decor icons (faint floating glyphs in header cards) ─────────── */

export interface DecorIcon {
  Icon: LucideIcon;
  top: string;
  left: string;
  size: number;
  rotate: number;
  opacity: number;
}

export const SUBJECT_DECOR: Record<string, DecorIcon[]> = {
  mathematics: [
    { Icon: Calculator,  top: '-15%', left: '58%', size: 90, rotate: 14,  opacity: 0.08 },
    { Icon: Divide,      top: '55%',  left: '92%', size: 48, rotate: -8,  opacity: 0.1  },
    { Icon: Hash,        top: '20%',  left: '82%', size: 40, rotate: 22,  opacity: 0.09 },
    { Icon: Plus,        top: '75%',  left: '68%', size: 32, rotate: -18, opacity: 0.1  },
  ],
  science: [
    { Icon: Microscope,  top: '-10%', left: '60%', size: 96, rotate: 10,  opacity: 0.08 },
    { Icon: FlaskConical,top: '55%',  left: '90%', size: 48, rotate: -14, opacity: 0.1  },
    { Icon: Atom,        top: '20%',  left: '82%', size: 42, rotate: 18,  opacity: 0.08 },
    { Icon: Leaf,        top: '72%',  left: '66%', size: 34, rotate: -10, opacity: 0.1  },
  ],
  chemistry: [
    { Icon: Beaker,      top: '-10%', left: '60%', size: 92, rotate: 10,  opacity: 0.08 },
    { Icon: FlaskConical,top: '55%',  left: '88%', size: 48, rotate: -12, opacity: 0.1  },
    { Icon: Atom,        top: '22%',  left: '80%', size: 40, rotate: 20,  opacity: 0.08 },
  ],
  physics: [
    { Icon: Atom,        top: '-10%', left: '60%', size: 96, rotate: 10,  opacity: 0.08 },
    { Icon: Zap,         top: '55%',  left: '88%', size: 44, rotate: -10, opacity: 0.1  },
    { Icon: Sparkles,    top: '22%',  left: '82%', size: 34, rotate: 18,  opacity: 0.09 },
  ],
  biology: [
    { Icon: Leaf,        top: '-10%', left: '60%', size: 88, rotate: 12,  opacity: 0.09 },
    { Icon: Heart,       top: '55%',  left: '88%', size: 44, rotate: -10, opacity: 0.1  },
    { Icon: Microscope,  top: '22%',  left: '80%', size: 42, rotate: 18,  opacity: 0.08 },
  ],
  'social science': [
    { Icon: Globe,       top: '-12%', left: '60%', size: 96, rotate: 10,  opacity: 0.08 },
    { Icon: MapPin,      top: '58%',  left: '88%', size: 44, rotate: -12, opacity: 0.1  },
    { Icon: Clock,       top: '22%',  left: '82%', size: 38, rotate: 18,  opacity: 0.08 },
  ],
  english: [
    { Icon: Languages,   top: '-10%', left: '60%', size: 88, rotate: 10,  opacity: 0.08 },
    { Icon: Pencil,      top: '55%',  left: '88%', size: 44, rotate: -16, opacity: 0.1  },
    { Icon: BookOpen,    top: '22%',  left: '82%', size: 40, rotate: 18,  opacity: 0.08 },
  ],
  ai: [
    { Icon: Brain,       top: '-10%', left: '60%', size: 88, rotate: 10,  opacity: 0.08 },
    { Icon: Cpu,         top: '55%',  left: '88%', size: 44, rotate: -10, opacity: 0.1  },
    { Icon: Sparkles,    top: '22%',  left: '82%', size: 36, rotate: 18,  opacity: 0.1  },
  ],
};

export function getDecor(subject: string): DecorIcon[] {
  return SUBJECT_DECOR[subject.toLowerCase()] ?? SUBJECT_DECOR.science;
}

/* ─── Live Books custom logo ──────────────────────────────────────────────── */
/* Warm cream-paper book + pulsing red broadcast dot. Reads as               */
/* "book (knowledge) + live broadcast (interactive)".                        */

export function LiveBooksLogo({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <rect x="9" y="5.5" width="15" height="22" rx="1.8" fill="#2A1C0A" fillOpacity="0.55" />
      <rect x="7" y="4" width="15" height="22" rx="1.8" fill="#FFF4D6" />
      <path d="M8.8 4H20.2C21.2 4 22 4.8 22 5.8V6.2H7V5.8C7 4.8 7.8 4 8.8 4Z"
        fill="#FFFFFF" fillOpacity="0.65" />
      <rect x="8" y="4" width="0.6" height="22" rx="0.3" fill="#C98A2B" fillOpacity="0.55" />
      <rect x="9.8"  y="9"   width="10"  height="1.4" rx="0.7" fill="#2A1C0A" fillOpacity="0.7" />
      <rect x="9.8"  y="12"  width="7"   height="1.4" rx="0.7" fill="#2A1C0A" fillOpacity="0.5" />
      <rect x="9.8"  y="15"  width="10"  height="1.4" rx="0.7" fill="#2A1C0A" fillOpacity="0.7" />
      <rect x="9.8"  y="18"  width="5"   height="1.4" rx="0.7" fill="#2A1C0A" fillOpacity="0.5" />
      <rect x="9.8"  y="21"  width="8.5" height="1.4" rx="0.7" fill="#2A1C0A" fillOpacity="0.7" />
      <path d="M17.2 4H19.8V8.8L18.5 7.8L17.2 8.8V4Z" fill="#DC2626" />
      <circle cx="24" cy="6.5" r="4.2" fill="#FFF4D6" />
      <circle cx="24" cy="6.5" r="3.5" fill="#050505" fillOpacity="0.9" />
      <circle cx="24" cy="6.5" r="2.2" fill="#EF4444">
        <animate attributeName="opacity" values="1;0.55;1" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx="24" cy="6.5" r="2.2" fill="none" stroke="#EF4444" strokeWidth="0.9" strokeOpacity="0.7">
        <animate attributeName="r" values="2.2;5.5;2.2" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.7;0;0.7" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
