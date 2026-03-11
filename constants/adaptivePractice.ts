// ADAPTIVE ENGINE: Named constants for the adaptive guided practice system.
// Never hardcode these values elsewhere — always import from here.

// ── Session lengths ──────────────────────────────────────────────────────────
export const SESSION_DIAGNOSTIC_LENGTH = 5;   // silent warm-up questions
export const SESSION_MAX_QUESTIONS = 30;       // hard cap before auto-summary
export const SESSION_PYQ_FINAL_PCT = 0.2;      // last 20% of session → prefer PYQ

// ── Adaptive difficulty thresholds ──────────────────────────────────────────
export const CONCEPT_MASTERY_THRESHOLD = 3;    // got_it/too_easy signals → deprioritize concept
export const STRUGGLE_REPEAT_THRESHOLD = 2;    // too_hard × N on same concept → drop difficulty
export const ACCURACY_ESCALATE = 0.8;          // ≥80% accuracy → bump difficulty
export const ACCURACY_DROP = 0.4;              // ≤40% accuracy → reduce difficulty

// ── Concept rotation ─────────────────────────────────────────────────────────
export const CONCEPT_ROTATION_AFTER = 2;       // switch concept after N consecutive same-concept Qs

// ── Session phases ───────────────────────────────────────────────────────────
export const SESSION_PHASE_DIAGNOSTIC = 'diagnostic' as const;
export const SESSION_PHASE_PRACTICE   = 'practice'   as const;
export const SESSION_PHASE_COMPLETE   = 'complete'   as const;

// ── Feature flag (read from env at runtime) ──────────────────────────────────
// Set NEXT_PUBLIC_FEATURE_ADAPTIVE_PRACTICE=true in .env.local / Vercel to enable.
// Default false → legacy 10-batch mode remains active.
export const FEATURE_ADAPTIVE_PRACTICE =
  process.env.NEXT_PUBLIC_FEATURE_ADAPTIVE_PRACTICE === 'true';
