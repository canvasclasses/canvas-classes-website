// Branch Finder — pure scoring functions.
//
// No React, no I/O — every function here is a deterministic transform from
// (selection, profiles) → results, so the declutter UI can call it on every
// tap and it stays trivially unit-testable. This is the "transparent
// tag-scoring" engine the design locked on: match% = how well a branch's
// affinities overlap the signals the user picked.

import {
  BRANCH_PROFILES,
  BranchProfile,
  OutlookBucket,
  SignalFamily,
  SIGNAL_LABELS,
  SUBJECT_SIGNALS,
  TRAIT_SIGNALS,
  VISION_SIGNALS,
  SubjectKey,
  TraitKey,
  VisionKey,
} from './branchProfiles';

// Healthier futures break ties first (lower = better), so when two branches
// match a student equally well, the more future-ready one surfaces above.
const OUTLOOK_RANK: Record<OutlookBucket, number> = {
  booming: 0,
  resilient: 1,
  evolving: 2,
  caution: 3,
};

export interface Selection {
  subjects: SubjectKey[];
  traits: TraitKey[];
  vision: VisionKey[];
}

export type Band = 'strong' | 'maybe' | 'faded' | 'idle';

export interface BranchScore {
  branch: BranchProfile;
  raw: number;   // sum of matched affinity weights
  max: number;   // best possible given the current picks (3 × #picks)
  pct: number;   // 0–100, raw/max
  band: Band;
  reasons: string[]; // labels of the strongest matched signals (≤3)
  matchedCount: number; // how many picked signals this branch weights strongly (≥2)
}

const BAND_STRONG = 70;
const BAND_MAYBE = 40;

export function totalPicks(sel: Selection): number {
  return sel.subjects.length + sel.traits.length + sel.vision.length;
}

// Affinity lookup for one (family, key) against a branch — missing => 0.
function affinity(branch: BranchProfile, family: SignalFamily, key: string): number {
  const bucket =
    family === 'subjects' ? branch.subjects : family === 'traits' ? branch.traits : branch.vision;
  return (bucket as Record<string, number>)[key] ?? 0;
}

export function scoreBranch(branch: BranchProfile, sel: Selection): BranchScore {
  const picks: Array<{ family: SignalFamily; key: string }> = [
    ...sel.subjects.map((key) => ({ family: 'subjects' as const, key })),
    ...sel.traits.map((key) => ({ family: 'traits' as const, key })),
    ...sel.vision.map((key) => ({ family: 'vision' as const, key })),
  ];

  if (picks.length === 0) {
    return { branch, raw: 0, max: 0, pct: 0, band: 'idle', reasons: [], matchedCount: 0 };
  }

  let raw = 0;
  const matched: Array<{ key: string; weight: number }> = [];
  for (const p of picks) {
    const w = affinity(branch, p.family, p.key);
    raw += w;
    if (w >= 2) matched.push({ key: p.key, weight: w });
  }
  const max = picks.length * 3;
  const pct = Math.round((raw / max) * 100);
  const band: Band = pct >= BAND_STRONG ? 'strong' : pct >= BAND_MAYBE ? 'maybe' : 'faded';

  const reasons = matched
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((m) => SIGNAL_LABELS[m.key] ?? m.key);

  return { branch, raw, max, pct, band, reasons, matchedCount: matched.length };
}

// Score every branch and sort: highest match first, demand tier as tiebreak
// (a tied CSE outranks a tied Mining), then name for stability.
export function scoreAll(sel: Selection): BranchScore[] {
  return BRANCH_PROFILES.map((b) => scoreBranch(b, sel)).sort((a, b) => {
    if (b.pct !== a.pct) return b.pct - a.pct;
    const oa = OUTLOOK_RANK[a.branch.outlook];
    const ob = OUTLOOK_RANK[b.branch.outlook];
    if (oa !== ob) return oa - ob;
    if (a.branch.demandTier !== b.branch.demandTier)
      return a.branch.demandTier - b.branch.demandTier;
    return a.branch.name.localeCompare(b.branch.name);
  });
}

// ── "We need a little more" — discriminating-signal suggestions ───────────────
//
// When the top of the list is crowded (several branches bunched near the
// leader), we surface ONE more question: the unselected signals that best split
// the current contenders. A signal "splits" well when some contenders weight it
// highly and others not at all — i.e. high variance of affinity across the
// contenders. Tapping a suggestion just adds that signal to the selection.

export interface SignalSuggestion {
  key: string;
  label: string;
  family: SignalFamily;
}

const ALL_SIGNALS = [...SUBJECT_SIGNALS, ...TRAIT_SIGNALS, ...VISION_SIGNALS];

function isSelected(sel: Selection, family: SignalFamily, key: string): boolean {
  const arr =
    family === 'subjects' ? sel.subjects : family === 'traits' ? sel.traits : sel.vision;
  return (arr as string[]).includes(key);
}

// Population variance of a list of numbers (0 when <2 points).
function variance(xs: number[]): number {
  if (xs.length < 2) return 0;
  const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
  return xs.reduce((s, x) => s + (x - mean) ** 2, 0) / xs.length;
}

// Is the current result set ambiguous enough to warrant asking more?
export function isAmbiguous(scored: BranchScore[]): boolean {
  const strong = scored.filter((s) => s.band === 'strong');
  if (strong.length >= 3) return true;
  // Or: leader and 3rd place are within 15 points (a tight cluster at the top).
  const ranked = scored.filter((s) => s.pct > 0);
  if (ranked.length >= 3 && ranked[0].pct - ranked[2].pct <= 15) return true;
  return false;
}

export function suggestNextSignals(
  sel: Selection,
  scored: BranchScore[],
  limit = 3,
): SignalSuggestion[] {
  // Contenders = the top branches we're trying to tell apart.
  const contenders = scored.filter((s) => s.pct > 0).slice(0, 6).map((s) => s.branch);
  if (contenders.length < 2) return [];

  const ranked = ALL_SIGNALS.filter((sig) => !isSelected(sel, sig.family, sig.key))
    .map((sig) => {
      const weights = contenders.map((b) => affinity(b, sig.family, sig.key));
      // Only useful if at least one contender actually cares about it.
      const peak = Math.max(...weights);
      return { sig, score: variance(weights), peak };
    })
    .filter((x) => x.peak >= 2 && x.score > 0)
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, limit).map(({ sig }) => ({
    key: sig.key,
    label: sig.label,
    family: sig.family,
  }));
}
