// Per-chapter "tool card" configuration. Read by both the server page
// (to decide whether to render a 2-column grid vs. Crucible-only) and the
// client component (to render the right-hand card variant).
//
// Slugs were verified against MongoDB on 2026-05-05 — only chapters that
// actually have flashcards built map to `flashcards`. Chapters without any
// matched tool return null; the page collapses gracefully when the chapter
// has no companion tool yet.

export type ToolCardConfig =
    | { kind: 'flashcards'; flashcardSlug: string }
    | { kind: 'periodic-explorer' }
    | { kind: 'organic-wizard' }
    | { kind: 'salt-analysis-sim' }
    | { kind: 'ksp-calculator' }
    | { kind: 'vsepr-explorer' };

const TOOL_BY_CHAPTER: Record<string, ToolCardConfig> = {
    // ─── Specific-tool overrides ─────────────────────────────────────────
    'periodic-properties': { kind: 'periodic-explorer' },
    'chemical-bonding': { kind: 'vsepr-explorer' },
    'ionic-equilibrium': { kind: 'ksp-calculator' },
    'aromatic-compounds': { kind: 'organic-wizard' },
    'salt-analysis': { kind: 'salt-analysis-sim' },

    // ─── Flashcards (verified to exist in MongoDB) ───────────────────────
    'atomic-structure': { kind: 'flashcards', flashcardSlug: 'atomic-structure' },
    'goc-and-mechanisms': { kind: 'flashcards', flashcardSlug: 'goc-and-poc' },
    'hydrocarbons-and-halides': { kind: 'flashcards', flashcardSlug: 'haloalkanes' },
    'solid-state': { kind: 'flashcards', flashcardSlug: 'solid-state' },
    solutions: { kind: 'flashcards', flashcardSlug: 'solutions' },
    electrochemistry: { kind: 'flashcards', flashcardSlug: 'electrochemistry' },
    'chemical-kinetics': { kind: 'flashcards', flashcardSlug: 'chemical-kinetics' },
    'surface-chemistry': { kind: 'flashcards', flashcardSlug: 'surface-chemistry' },
    metallurgy: { kind: 'flashcards', flashcardSlug: 'metallurgy' },
    'p-block': { kind: 'flashcards', flashcardSlug: 'p-block-elements-g15-18' },
    'd-and-f-block': { kind: 'flashcards', flashcardSlug: 'd-f-block' },
    'coordination-compounds': { kind: 'flashcards', flashcardSlug: 'coordination-compounds' },
    amines: { kind: 'flashcards', flashcardSlug: 'amines' },
    'biomolecules-and-polymers': { kind: 'flashcards', flashcardSlug: 'biomolecules' },
    'name-reactions': { kind: 'flashcards', flashcardSlug: 'named-reactions' },

    // ─── Chapters with NO tool card ──────────────────────────────────────
    // Intentionally absent: mole-concept, states-of-matter, thermodynamics,
    // environmental-chemistry, practical-chemistry. These have neither
    // flashcards built nor a specific companion tool — the right-side card
    // is hidden so we don't link to anything that doesn't exist.
};

export function getToolCardForSlug(slug: string): ToolCardConfig | null {
    return TOOL_BY_CHAPTER[slug] ?? null;
}
