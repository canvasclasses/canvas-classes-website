'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { GlossaryEntry } from '@canvas/data/types/books';
import type { Root, Element, Text, Parent } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * Per-page glossary (`page.glossary`) → hover/tap definitions in the prose.
 *
 * Injected by PageRenderer, consumed by TextBlockRenderer. Empty default → the
 * whole feature is a no-op (correct for books with no glossary, and for any
 * renderer surface that doesn't pass one).
 */
export const GlossaryContext = createContext<GlossaryEntry[]>([]);

export function GlossaryProvider({
  value,
  children,
}: {
  value: GlossaryEntry[];
  children: React.ReactNode;
}) {
  return <GlossaryContext.Provider value={value}>{children}</GlossaryContext.Provider>;
}

export function useGlossary() {
  return useContext(GlossaryContext);
}

// ─── The matcher ──────────────────────────────────────────────────────────────

/**
 * Node types whose text must NEVER be touched.
 *
 * Why a rehype plugin instead of a string replace on the markdown source: our
 * prose is full of `$LaTeX$`, `\ce{}`, links and image syntax. Replacing on the
 * raw markdown would happily corrupt a term that appears inside a URL, a code
 * span or a formula. Running on the HAST *after* remark/rehype means we only
 * ever see real rendered text, and we can skip these subtrees explicitly.
 *
 * `.katex` covers rehype-katex output (its internals include plain-text nodes
 * that must not be rewritten or the formula breaks).
 */
const SKIP_TAGS = new Set(['code', 'pre', 'a', 'script', 'style', 'kbd']);
function isSkipped(node: Element): boolean {
  if (SKIP_TAGS.has(node.tagName)) return true;
  const cls = node.properties?.className;
  const classes = Array.isArray(cls) ? cls.map(String) : typeof cls === 'string' ? [cls] : [];
  return classes.some((c) => c === 'katex' || c.startsWith('katex-'));
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * rehype plugin: wrap the FIRST occurrence of each glossary term in a
 * `<glossary-term data-term="...">` element, which TextBlockRenderer maps to the
 * popover component.
 *
 * First-occurrence-only is deliberate: underlining every "pollen" on the page
 * turns the prose into noise. The student needs the definition where the word
 * first lands on them.
 *
 * Longest terms match first, so "pollen tube" wins over "pollen".
 */
export function rehypeGlossary(terms: GlossaryEntry[]) {
  return function transformer(tree: Root) {
    if (!terms.length) return;

    const used = new Set<string>();
    const ordered = [...terms].sort((a, b) => b.term.length - a.term.length);

    visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || index === undefined) return;
      if (parent.type === 'element' && isSkipped(parent as Element)) return;

      for (const entry of ordered) {
        const key = entry.term.toLowerCase();
        if (used.has(key)) continue;

        // Word-boundary, case-insensitive. \b is fine here: terms are
        // alphabetic words/phrases (verified across all 1,754 authored entries).
        const re = new RegExp(`\\b${escapeRe(entry.term)}\\b`, 'i');
        const m = re.exec(node.value);
        if (!m) continue;

        const before = node.value.slice(0, m.index);
        const hit = node.value.slice(m.index, m.index + m[0].length);
        const after = node.value.slice(m.index + m[0].length);

        const replacement: (Text | Element)[] = [];
        if (before) replacement.push({ type: 'text', value: before });
        replacement.push({
          type: 'element',
          tagName: 'glossary-term',
          properties: { dataTerm: entry.term, dataDefinition: entry.definition },
          children: [{ type: 'text', value: hit }],
        } as Element);
        if (after) replacement.push({ type: 'text', value: after });

        parent.children.splice(index, 1, ...replacement);
        used.add(key);

        // Resume ON the trailing text node so the REST of this sentence can
        // still match other terms. Returning `index + replacement.length` here
        // would jump past the tail — which silently meant only ever one term
        // per sentence (caught by _glossary_verify: "pollen tube" after
        // "sporopollenin" was never wrapped).
        // Terminates because `used` only grows and the term list is finite.
        if (after) return index + (before ? 1 : 0) + 1;
        return index + replacement.length;
      }
    });
  };
}

// ─── The popover ──────────────────────────────────────────────────────────────

/**
 * A glossed term in the prose. Tap (or hover on a pointer device) to see the
 * definition. Mirrors the gloss popover already proven in
 * `blocks/english/NarratedPassageRenderer.tsx` — dotted underline + a small
 * point-anchored card, positioned so it can't fall off-screen.
 */
export function GlossaryTerm({
  term,
  definition,
  children,
}: {
  term: string;
  definition: string;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  // Which input device drove the last interaction. See the handler note below.
  const lastPointer = useRef<string>('mouse');

  // Close on click-outside / Escape — same behaviour as the passage glosses.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span ref={ref} className="relative inline-block">
      {/*
        Input handling — this is fiddly and was a real bug, so it's written out.

        The naive version (onMouseEnter → open, onClick → toggle) is BROKEN on
        touch: mobile browsers fire a compatibility `mouseenter` immediately
        before `click`, so a tap opened the card and the click then toggled it
        straight back shut. Verified live: the event order on a real tap/click is
        pointerenter → mouseenter → pointerdown → mousedown → mouseup → click,
        which netted out to "nothing happens" — the feature was dead on phones.

        So: hover is gated to a real mouse, and click only toggles when the
        interaction did NOT come from a mouse (i.e. touch/pen), which leaves the
        two paths independent:
          mouse    → hover opens / leaving closes; the click is a no-op
          touch    → tap toggles
          keyboard → focus opens / blur closes
      */}
      <button
        type="button"
        onPointerDown={(e) => { lastPointer.current = e.pointerType || 'mouse'; }}
        onClick={(e) => {
          e.stopPropagation();
          if (lastPointer.current !== 'mouse') setOpen((v) => !v);
        }}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') setOpen(true); }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') setOpen(false); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-expanded={open}
        aria-label={`Definition of ${term}`}
        className="cursor-help border-b border-dotted border-amber-400/60 text-inherit hover:border-amber-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/70 rounded-sm"
      >
        {children ?? term}
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute z-40 left-1/2 -translate-x-1/2 top-full mt-1.5 w-[min(19rem,78vw)] rounded-xl border border-white/10 bg-[#181A21] p-3 text-left shadow-2xl"
          style={{ pointerEvents: 'auto' }}
        >
          <span className="mb-1 block text-[13px] font-bold" style={{ color: '#fbbf24' }}>
            {term}
          </span>
          <span className="block text-[13px] leading-snug" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {definition}
          </span>
        </span>
      )}
    </span>
  );
}
