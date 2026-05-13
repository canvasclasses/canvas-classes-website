// Shared helper for rendering the exam-attribution badge / label on question
// cards across The Crucible (BrowseView, QuestionDetailPage, page metadata,
// AdaptiveQuestionCard, etc.).
//
// Why this exists:
//   Multiple sites previously used bespoke inline logic to render
//   "JEE Main 2024 (Shift-I)" style labels. Each had its own bugs:
//   - some never rendered month, others never rendered shift,
//   - some forgot to normalize "JEE_Main" → "JEE Main",
//   - one had a `replace('Shift ', 'S')` that didn't match `Shift-I` (hyphen).
//   This helper unifies the format: one truth, used everywhere.
//
// Usage:
//   const label = formatExamLabel(question.metadata.examDetails, question.metadata.exam_source);
//   if (label) <span>{label}</span>  // null when no year set anywhere
//
// Output shape (in order of completeness):
//   "JEE Main 2024 · Jan · S-I"   ← year + month + shift
//   "JEE Main 2024 · Jan"          ← month, no shift (e.g. NEET — single-shift)
//   "JEE Main 2024 · S-I"          ← shift, no month
//   "JEE Main 2024"                ← year only

type RawObj = Record<string, unknown> | { [k: string]: unknown } | undefined | null;

const EXAM_NAME_NORMALIZED: Record<string, string> = {
    JEE_Main: 'JEE Main',
    JEE_Advanced: 'JEE Adv',
    NEET_UG: 'NEET',
    NEET_PG: 'NEET PG',
    // Legacy / human-typed variants that may appear in older `exam_source` rows.
    'JEE Main': 'JEE Main',
    'JEE Advanced': 'JEE Adv',
    'JEE Adv.': 'JEE Adv',
    'IIT JEE': 'JEE Adv',
    NEET: 'NEET',
};

const MONTH_NORMALIZED: Record<string, string> = {
    January: 'Jan', Jan: 'Jan',
    February: 'Feb', Feb: 'Feb',
    March: 'Mar', Mar: 'Mar',
    April: 'Apr', Apr: 'Apr',
    May: 'May',
    June: 'Jun', Jun: 'Jun',
    July: 'Jul', Jul: 'Jul',
    August: 'Aug', Aug: 'Aug',
    September: 'Sep', Sep: 'Sep', Sept: 'Sep',
    October: 'Oct', Oct: 'Oct',
    November: 'Nov', Nov: 'Nov',
    December: 'Dec', Dec: 'Dec',
};

/**
 * Read a field from `examDetails` first, fall back to `exam_source`.
 * Treats null / undefined / "" / "null" / "undefined" / 0 (for non-year) as missing.
 */
function pickField(
    examDetails: RawObj,
    exam_source: RawObj,
    key: string
): unknown {
    const isMissing = (v: unknown) =>
        v === null ||
        v === undefined ||
        v === '' ||
        v === 'null' ||
        v === 'undefined';

    const m = (examDetails as Record<string, unknown> | null | undefined)?.[key];
    if (!isMissing(m)) return m;
    const l = (exam_source as Record<string, unknown> | null | undefined)?.[key];
    if (!isMissing(l)) return l;
    return undefined;
}

/**
 * Compress shift labels: "Shift-I" / "Shift I" / "Shift 1" / "Session-II" → "S-I"
 * etc. Anything not matching "Shift" or "Session" prefix is returned unchanged.
 */
export function shortenShift(shift: string): string {
    return shift.replace(/^(Shift|Session)\s*-?\s*/i, 'S-').replace(/^S--/, 'S-');
}

/**
 * Build the display label for a question's exam attribution. Returns null
 * if no year is available (in which case the caller should hide the badge
 * entirely).
 *
 * Pass both fields — modern (examDetails) wins per-key when both are set;
 * legacy (exam_source) is used as fallback for any individual missing field.
 */
export function formatExamLabel(
    examDetails: RawObj,
    exam_source: RawObj
): string | null {
    const year = pickField(examDetails, exam_source, 'year');
    if (typeof year !== 'number' && typeof year !== 'string') return null;

    const examRaw = pickField(examDetails, exam_source, 'exam');
    const examName =
        typeof examRaw === 'string'
            ? EXAM_NAME_NORMALIZED[examRaw] ?? examRaw
            : 'JEE Main';

    const monthRaw = pickField(examDetails, exam_source, 'month');
    const month =
        typeof monthRaw === 'string'
            ? MONTH_NORMALIZED[monthRaw] ?? monthRaw
            : null;

    const phaseRaw = pickField(examDetails, exam_source, 'phase');
    const phase = typeof phaseRaw === 'string' ? phaseRaw : null;

    const shiftRaw = pickField(examDetails, exam_source, 'shift');
    const shift = typeof shiftRaw === 'string' ? shortenShift(shiftRaw) : null;

    const parts: string[] = [`${examName} ${year}`];
    if (month) parts.push(month);
    // Phase OR Shift, never both — they describe the same axis (NEET uses phase, JEE uses shift).
    if (phase) parts.push(phase);
    else if (shift) parts.push(shift);

    return parts.join(' · ');
}

/**
 * For places that need just the year (e.g. year-filter dropdowns).
 * Reads modern field first, legacy fallback.
 */
export function pickYear(
    examDetails: RawObj,
    exam_source: RawObj
): number | null {
    const y = pickField(examDetails, exam_source, 'year');
    if (typeof y === 'number') return y;
    if (typeof y === 'string' && /^\d{4}$/.test(y)) return Number(y);
    return null;
}

// ─── PYQ-detection bridges (canonical field + legacy fallback) ──────────────
// These helpers replace bespoke inline reads of `q.metadata.is_pyq` and
// `q.metadata.exam_source.exam` regex matching across the Crucible. They
// always read the modern canonical field first, falling back to legacy only
// when the modern field is absent.
//
// After Phase 4 of the May 2026 cleanup ($unset legacy fields), the
// legacy-fallback branches here become dead code and can be removed.

type QuestionMetadataLike = {
    sourceType?: string;
    is_pyq?: boolean;
    examDetails?: { exam?: string } | Record<string, unknown> | null;
    exam_source?: { exam?: string } | Record<string, unknown> | null;
} | null | undefined;

/**
 * Is this question a previous-year question (any exam)?
 * Modern: sourceType === 'PYQ'.
 * Legacy: is_pyq === true.
 */
export function isPyq(metadata: QuestionMetadataLike): boolean {
    if (!metadata) return false;
    if (metadata.sourceType === 'PYQ') return true;
    if (metadata.is_pyq === true) return true;
    return false;
}

/**
 * Resolve a question's specific exam (when it's a PYQ).
 * Returns one of the canonical examDetails enum values, or null if it can't
 * be determined (e.g. for non-PYQs or legacy data with unrecognised exam strings).
 */
export type ExamType = 'JEE_Main' | 'JEE_Advanced' | 'NEET_UG' | 'NEET_PG';

export function getExamType(metadata: QuestionMetadataLike): ExamType | null {
    if (!metadata) return null;
    // Modern field — already canonical enum value.
    const modernRaw = (metadata.examDetails as { exam?: string } | null | undefined)?.exam;
    if (modernRaw === 'JEE_Main' || modernRaw === 'JEE_Advanced' || modernRaw === 'NEET_UG' || modernRaw === 'NEET_PG') {
        return modernRaw;
    }
    // Legacy field — free-text OR bridged-from-modern (which contains underscore form).
    // Allow whitespace OR underscore between words ("JEE Main" / "JEE_Main" both match).
    const legacyRaw = ((metadata.exam_source as { exam?: string } | null | undefined)?.exam ?? '').trim();
    if (!legacyRaw) return null;
    if (/iit[\s_]*jee|jee[\s_]*adv/i.test(legacyRaw)) return 'JEE_Advanced';
    if (/jee[\s_]*main/i.test(legacyRaw)) return 'JEE_Main';
    if (/neet/i.test(legacyRaw)) return 'NEET_UG';
    return null;
}

/**
 * Convenience predicates for "PYQ of a specific exam" — used in stat counts
 * (Chapter Practice page, Analytics Dashboard) and filter conditions.
 */
export function isJeeMainPyq(metadata: QuestionMetadataLike): boolean {
    return isPyq(metadata) && getExamType(metadata) === 'JEE_Main';
}

export function isJeeAdvancedPyq(metadata: QuestionMetadataLike): boolean {
    return isPyq(metadata) && getExamType(metadata) === 'JEE_Advanced';
}

export function isNeetPyq(metadata: QuestionMetadataLike): boolean {
    if (!isPyq(metadata)) return false;
    const t = getExamType(metadata);
    return t === 'NEET_UG' || t === 'NEET_PG';
}
