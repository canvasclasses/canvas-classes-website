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
  /** Bookbinding cloth for the 3D cover on the shelf — a CSS gradient. */
  cloth: string;
  /**
   * Ambient light colour the shelf takes on while THIS book is selected.
   * A single rgb() the wash tints toward — deliberately light-and-colour, not
   * floating subject icons (see BookShelf.tsx header for why).
   */
  ambient: string;
}

/* ─── Plum is the standard (design system v1, locked 2026-07-09) ───────────
 *
 * Every subject shares ONE interaction colour. The old per-subject rainbow
 * (sky / violet / emerald / orange / rose / amber / fuchsia / indigo) is gone:
 * it made the landing read as decoration rather than information, and it put
 * eight competing hues on a reading surface. Under the plum system, colour
 * carries meaning — plum = interaction, gold = reward, green/red = outcomes —
 * so it cannot also be used to say "this is chemistry".
 *
 * Subjects stay distinguishable by the two channels that do NOT spend the
 * colour budget: the ICON, and the CLOTH of the book's cover on the shelf.
 * Cloth is depicted physical material (the same content exemption the system
 * grants chemistry flame-test colours), not UI chrome — so it may carry hue.
 * All cloth is low-saturation and dark: one publisher's matched set.
 *
 * These read through the CSS variables in globals.css, so retuning the brand
 * there restyles every Live Books surface at once.
 */
const PLUM = {
  accent:   'text-[var(--plum-text)]',
  bg:       'bg-[var(--plum-tint)]',
  border:   'border-[var(--plum-line)]',
  bar:      'from-[var(--plum)] to-[var(--plum-hover)]',
  badge:    'bg-[var(--plum-tint)] text-[var(--plum-text)]',
  gradient: 'from-[var(--plum-tint)] via-transparent to-transparent',
  ring:     'ring-[var(--plum-line)]',
} as const;

/**
 * [cloth gradient, ambient light] per binding.
 *
 * Deliberately brighter and more saturated than the first pass: against the
 * lifted #121316 reading ground the earlier near-black bindings read as dull
 * and barely separated from the page. These are still real bookcloth tones —
 * the value range of a good hardback under gallery light, not neon.
 */
const CLOTH = {
  slate:     ['linear-gradient(152deg,#3E4A73 0%,#2A3252 46%,#1B2036 100%)', '110, 145, 220'],
  plum:      ['linear-gradient(152deg,#7A3560 0%,#542242 46%,#331428 100%)', '206,  96, 162'],
  forest:    ['linear-gradient(152deg,#2C5A46 0%,#1E3F31 46%,#132719 100%)', ' 92, 190, 140'],
  umber:     ['linear-gradient(152deg,#6B5327 0%,#4A391A 46%,#2C2110 100%)', '214, 166,  86'],
  aubergine: ['linear-gradient(152deg,#553770 0%,#3B2650 46%,#241633 100%)', '176, 128, 220'],
  oxblood:   ['linear-gradient(152deg,#6E2E2C 0%,#4C1F1E 46%,#2D1211 100%)', '214, 110, 100'],
  teal:      ['linear-gradient(152deg,#255A5F 0%,#183E42 46%,#0F262A 100%)', ' 98, 190, 196'],
} as const;

const subject = (icon: LucideIcon, [cloth, ambient]: readonly [string, string]): SubjectTheme =>
  ({ icon, cloth, ambient, ...PLUM });

export const SUBJECT_THEME: Record<string, SubjectTheme> = {
  physics:          subject(Atom,       CLOTH.slate),
  mathematics:      subject(Calculator, CLOTH.forest),
  science:          subject(Microscope, CLOTH.teal),
  chemistry:        subject(Beaker,     CLOTH.plum),
  biology:          subject(Leaf,       CLOTH.umber),
  'social science': subject(Globe,      CLOTH.oxblood),
  english:          subject(Languages,  CLOTH.aubergine),
  ai:               subject(Sparkles,   CLOTH.aubergine),
  ict:              subject(Cpu,        CLOTH.slate),
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
  ict: [
    { Icon: Cpu,         top: '-10%', left: '60%', size: 92, rotate: 10,  opacity: 0.08 },
    { Icon: Globe,       top: '55%',  left: '88%', size: 46, rotate: -12, opacity: 0.1  },
    { Icon: Zap,         top: '22%',  left: '82%', size: 38, rotate: 18,  opacity: 0.09 },
  ],
  life_skills: [
    { Icon: Brain,       top: '-10%', left: '60%', size: 92, rotate: 10,  opacity: 0.08 },
    { Icon: Heart,       top: '55%',  left: '88%', size: 44, rotate: -10, opacity: 0.1  },
    { Icon: Sparkles,    top: '22%',  left: '82%', size: 36, rotate: 18,  opacity: 0.09 },
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
