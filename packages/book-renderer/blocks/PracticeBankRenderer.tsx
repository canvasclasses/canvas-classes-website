'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Practice Bank — the section-navigated, source-tagged end-of-chapter bank.
// Two-pane UI: a section list on the left (vertical on desktop, a horizontal
// scroll of pills on mobile); the chosen section's question bank on the right.
// Two item kinds: MCQ (pick → check → explanation, mirrors InlineQuizRenderer)
// and numerical (tap-to-reveal worked solution). Every item shows a SOURCE
// badge (NCERT exercise / CBSE PYQ / JEE-NEET / MCQ). Switching sections
// remounts the items (keyed by id), so per-item answer state resets cleanly.
// Founder design 2026-06-25 — see _agents/plans/CHEMICAL_EQUILIBRIUM_BUILD.md.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';
import {
  PracticeBankBlock, PracticeBankMCQ, PracticeBankNumerical, PracticeSource,
} from '@canvas/data/types/books';
import { REHYPE_KATEX_OPTIONS } from './_katexConfig';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const remarkPlugins = [remarkMath, remarkGfm] as any[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rehypePlugins = [[rehypeKatex, REHYPE_KATEX_OPTIONS]] as any[];

// inline markdown (collapses <p> to <span> — for prompts / options)
const Md = ({ children }: { children: string }) => (
  <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins}
    components={{ p: ({ children: c }) => <span>{c}</span> }}>{children}</ReactMarkdown>
);
// block markdown (keeps paragraphs / lists — for worked solutions).
// Explicit component overrides — not a `prose`/`prose-practice` wrapper class,
// which has no matching CSS rule in this Tailwind v4 app and silently collapses
// every paragraph's margin to 0 (see TextBlockRenderer.tsx's own note on why
// prose modifier classes are unreliable here).
const mdBlockComponents = {
  p: ({ children: c }: { children?: React.ReactNode }) => (
    <p className="mb-3 last:mb-0">{c}</p>
  ),
  ul: ({ children: c }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-5 mb-3 last:mb-0 space-y-1.5">{c}</ul>
  ),
  ol: ({ children: c }: { children?: React.ReactNode }) => (
    <ol className="list-decimal pl-5 mb-3 last:mb-0 space-y-1.5">{c}</ol>
  ),
};
const MdBlock = ({ children }: { children: string }) => (
  <ReactMarkdown remarkPlugins={remarkPlugins} rehypePlugins={rehypePlugins} components={mdBlockComponents}>
    {children}
  </ReactMarkdown>
);

const SOURCE_META: Record<PracticeSource, { label: string; color: string; bg: string; border: string }> = {
  ncert_exercise: { label: 'NCERT', color: '#a5b4fc', bg: 'rgba(129,140,248,0.13)', border: 'rgba(129,140,248,0.32)' },
  ncert_exemplar: { label: 'NCERT Exemplar', color: '#7dd3fc', bg: 'rgba(56,189,248,0.13)', border: 'rgba(56,189,248,0.32)' },
  cbse_pyq:       { label: 'CBSE PYQ', color: '#fcd34d', bg: 'rgba(251,191,36,0.13)', border: 'rgba(251,191,36,0.32)' },
  jee_neet:       { label: 'JEE / NEET', color: '#f0abfc', bg: 'rgba(217,70,239,0.13)', border: 'rgba(217,70,239,0.32)' },
  mcq:            { label: 'MCQ', color: '#6ee7b7', bg: 'rgba(16,185,129,0.13)', border: 'rgba(16,185,129,0.30)' },
};

function SourceBadge({ source, label }: { source: PracticeSource; label?: string }) {
  const m = SOURCE_META[source];
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: m.color, background: m.bg, border: `1px solid ${m.border}` }}>
      {label || m.label}
    </span>
  );
}

function ItemShell({ n, source, source_label, children }:
  { n: number; source: PracticeSource; source_label?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl px-4 py-3.5"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.32)' }}>Q{n}</span>
        <SourceBadge source={source} label={source_label} />
      </div>
      {children}
    </div>
  );
}

// ── MCQ item (mirrors InlineQuizRenderer option styling) ─────────────────────
function MCQItem({ item, n }: { item: PracticeBankMCQ; n: number }) {
  const [locked, setLocked] = useState<number | null>(null);
  const answered = locked !== null;
  const isCorrect = answered && locked === item.correct_index;
  return (
    <ItemShell n={n} source={item.source} source_label={item.source_label}>
      <div className="text-[15px] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.88)' }}>
        <Md>{item.prompt}</Md>
      </div>
      <div className="flex flex-col gap-2">
        {item.options.map((opt, i) => {
          const chosen = locked === i, correct = i === item.correct_index;
          let bg = 'transparent', border = 'rgba(255,255,255,0.08)', color = 'rgba(255,255,255,0.6)', lab = 'rgba(255,255,255,0.22)';
          if (answered && correct) { bg = 'rgba(52,211,153,0.08)'; border = 'rgba(52,211,153,0.5)'; color = '#a7f3d0'; lab = '#34d399'; }
          else if (answered && chosen) { bg = 'rgba(248,113,113,0.08)'; border = 'rgba(248,113,113,0.5)'; color = '#fecaca'; lab = '#f87171'; }
          else if (answered) { color = 'rgba(255,255,255,0.2)'; lab = 'rgba(255,255,255,0.1)'; }
          return (
            <button key={i} disabled={answered} onClick={() => setLocked(i)}
              className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-150 ${answered ? '' : 'hover:border-indigo-500/40 hover:bg-indigo-500/5'}`}
              style={{ border: `1.5px solid ${border}`, background: bg, color }}>
              <span className="text-xs font-bold mr-2" style={{ color: lab }}>{String.fromCharCode(65 + i)}.</span>
              <Md>{opt}</Md>
              {answered && correct && <span className="ml-2 text-xs" style={{ color: '#34d399' }}>✓</span>}
              {answered && chosen && !correct && <span className="ml-2 text-xs" style={{ color: '#f87171' }}>✗</span>}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="text-sm leading-relaxed rounded-xl px-4 py-3 mt-3"
          style={{ background: isCorrect ? 'rgba(52,211,153,0.04)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.07)'}`, color: 'rgba(255,255,255,0.6)' }}>
          <span className="text-[11px] font-bold uppercase tracking-wider mr-2" style={{ color: isCorrect ? '#34d399' : '#f87171' }}>
            {isCorrect ? 'Correct' : 'Not quite'}
          </span>
          <Md>{item.explanation}</Md>
        </div>
      )}
    </ItemShell>
  );
}

// ── Numerical item (tap-to-reveal worked solution) ───────────────────────────
function NumericalItem({ item, n }: { item: PracticeBankNumerical; n: number }) {
  const [open, setOpen] = useState(false);
  return (
    <ItemShell n={n} source={item.source} source_label={item.source_label}>
      <div className="text-[15px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.88)' }}>
        <Md>{item.prompt}</Md>
      </div>
      <div className="mt-3">
        {!open ? (
          <button onClick={() => setOpen(true)}
            className="text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            style={{ background: 'rgba(129,140,248,0.12)', border: '1.5px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}>
            Show solution
          </button>
        ) : (
          <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {item.answer && (
              <p className="text-sm mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider mr-2" style={{ color: '#34d399' }}>Answer</span>
                <span style={{ color: '#a7f3d0' }}><Md>{item.answer}</Md></span>
              </p>
            )}
            <div className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              <MdBlock>{item.solution}</MdBlock>
            </div>
          </div>
        )}
      </div>
    </ItemShell>
  );
}

export default function PracticeBankRenderer({ block }: { block: PracticeBankBlock }) {
  const [active, setActive] = useState(0);
  const section = block.sections[Math.min(active, block.sections.length - 1)];

  return (
    <div className="my-8 rounded-2xl p-4 md:p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {(block.title || block.intro) && (
        <div className="mb-4">
          {block.title && <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">{block.title}</h2>}
          {block.intro && <p className="text-sm mt-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{block.intro}</p>}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-4">
        {/* ── section nav ── */}
        <nav className="lg:w-60 shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.28)' }}>Sections</div>
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {block.sections.map((s, i) => {
              const on = i === active;
              return (
                <button key={s.id} onClick={() => setActive(i)}
                  className="text-left px-3 py-2.5 rounded-xl shrink-0 transition-all min-w-[160px] lg:min-w-0 lg:w-full"
                  style={{ background: on ? 'rgba(129,140,248,0.16)' : 'rgba(255,255,255,0.03)', border: `1px solid ${on ? 'rgba(129,140,248,0.45)' : 'rgba(255,255,255,0.07)'}` }}>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0"
                      style={{ background: on ? '#6366f1' : 'rgba(255,255,255,0.06)', color: on ? '#fff' : 'rgba(255,255,255,0.5)' }}>{i + 1}</span>
                    <span className="text-[13px] font-bold leading-tight" style={{ color: on ? '#c7d2fe' : 'rgba(255,255,255,0.65)' }}>{s.title}</span>
                  </div>
                  <div className="text-[10px] mt-1 ml-7" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.items.length} questions</div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ── section bank ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3 mb-1 flex-wrap">
            <h3 className="text-lg font-bold text-white">{section.title}</h3>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{section.items.length} questions</span>
          </div>
          {section.blurb && <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>{section.blurb}</p>}
          {/* source legend */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(['ncert_exemplar', 'ncert_exercise', 'cbse_pyq', 'mcq'] as PracticeSource[]).map((s) => <SourceBadge key={s} source={s} />)}
          </div>
          <div className="flex flex-col gap-3">
            {section.items.map((it, i) =>
              it.kind === 'mcq'
                ? <MCQItem key={it.id} item={it} n={i + 1} />
                : <NumericalItem key={it.id} item={it} n={i + 1} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
