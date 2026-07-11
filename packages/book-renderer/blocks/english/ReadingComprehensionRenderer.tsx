'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type {
  ReadingComprehensionBlock,
  ReadingMCQ,
  ReadingAssertionReason,
  ReadingShortAnswer,
} from '@canvas/data/types/books';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gfm = [remarkGfm] as any[];
const MdInline = ({ children }: { children: string }) => (
  <ReactMarkdown remarkPlugins={gfm} components={{ p: ({ children: c }) => <span>{c}</span> }}>{children}</ReactMarkdown>
);
// Dark-theme table styling for case-based passages (which carry data tables).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TABLE_COMPONENTS: any = {
  table: ({ node, ...p }: any) => <table className="w-full text-left border-collapse" {...p} />,
  th: ({ node, ...p }: any) => <th className="px-3 py-1.5 text-[13px] font-semibold border-b" style={{ color: '#bae6fd', borderColor: 'rgba(255,255,255,0.15)' }} {...p} />,
  td: ({ node, ...p }: any) => <td className="px-3 py-1.5 text-[14px] border-b" style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.08)' }} {...p} />,
};
const MdTable = ({ children }: { children: string }) => (
  <ReactMarkdown remarkPlugins={gfm} components={TABLE_COMPONENTS}>{children}</ReactMarkdown>
);

// The four standard CBSE assertion-reason options (rendered by the component, not authored per question).
const AR_OPTIONS = [
  'Both A and R are true, and R is the correct explanation of A.',
  'Both A and R are true, but R is not the correct explanation of A.',
  'A is true, but R is false.',
  'A is false, but R is true.',
];
// Hindi labels — used when block.lang === 'hindi' (the गंगा अपठित module).
const AR_OPTIONS_HI = [
  'A और R दोनों सही हैं, और R, A की सही व्याख्या है।',
  'A और R दोनों सही हैं, पर R, A की सही व्याख्या नहीं है।',
  'A सही है, पर R ग़लत है।',
  'A ग़लत है, पर R सही है।',
];

const TYPE_LABEL: Record<string, string> = {
  discursive: 'Discursive Passage',
  factual: 'Factual Passage',
  case_based: 'Case-based Passage',
  literary: 'Literary Passage',
  descriptive: 'Descriptive Passage',
};
const TYPE_LABEL_HI: Record<string, string> = {
  discursive: 'विचारात्मक गद्यांश',
  factual: 'तथ्यात्मक गद्यांश',
  case_based: 'प्रसंग-आधारित गद्यांश',
  literary: 'काव्यांश',
  descriptive: 'वर्णनात्मक गद्यांश',
};

const ACCENT = '#38bdf8'; // sky — distinct from inline_quiz (indigo) & practice (violet)

// ── A tappable option list shared by MCQ + Assertion-Reason ───────────────────
function OptionList({ options, correctIndex, chosen, onChoose }: {
  options: string[]; correctIndex: number; chosen: number | null; onChoose: (i: number) => void;
}) {
  const answered = chosen !== null;
  return (
    <div className="flex flex-col gap-2 mt-3">
      {options.map((opt, i) => {
        const isChosen = chosen === i;
        const isCorrect = i === correctIndex;
        let bg = 'transparent', border = 'rgba(255,255,255,0.1)', color = 'rgba(255,255,255,0.78)', label = 'rgba(255,255,255,0.3)';
        if (answered && isCorrect) { bg = 'rgba(52,211,153,0.08)'; border = 'rgba(52,211,153,0.5)'; color = '#a7f3d0'; label = '#34d399'; }
        else if (answered && isChosen) { bg = 'rgba(248,113,113,0.08)'; border = 'rgba(248,113,113,0.5)'; color = '#fecaca'; label = '#f87171'; }
        else if (answered) { color = 'rgba(255,255,255,0.3)'; label = 'rgba(255,255,255,0.15)'; }
        return (
          <button key={i} disabled={answered} onClick={() => onChoose(i)}
            className={`text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-150 ${!answered ? 'hover:border-sky-400/40 hover:bg-sky-400/5' : ''}`}
            style={{ border: `1.5px solid ${border}`, background: bg, color, cursor: answered ? 'default' : 'pointer' }}>
            <span className="text-xs font-bold mr-2" style={{ color: label }}>{String.fromCharCode(65 + i)}.</span>
            <MdInline>{opt}</MdInline>
            {answered && isCorrect && <span className="ml-2 text-xs" style={{ color: '#34d399' }}>✓</span>}
            {answered && isChosen && !isCorrect && <span className="ml-2 text-xs" style={{ color: '#f87171' }}>✗</span>}
          </button>
        );
      })}
    </div>
  );
}

function Feedback({ correct, explanation }: { correct: boolean; explanation?: string }) {
  if (!explanation) return null;
  return (
    <div className="text-[13px] leading-relaxed rounded-xl px-4 py-3 mt-3"
      style={{ background: correct ? 'rgba(52,211,153,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${correct ? 'rgba(52,211,153,0.18)' : 'rgba(255,255,255,0.08)'}`, color: 'rgba(255,255,255,0.6)' }}>
      <span className="font-semibold" style={{ color: correct ? '#34d399' : '#fbbf24' }}>{correct ? 'Bilkul sahi! ' : 'Dekho — '}</span>
      <MdInline>{explanation}</MdInline>
    </div>
  );
}

function McqView({ q, n }: { q: ReadingMCQ; n: number }) {
  const [chosen, setChosen] = useState<number | null>(null);
  return (
    <div>
      <p className="text-[15px] leading-relaxed text-white/88"><span className="text-xs font-bold mr-2" style={{ color: ACCENT }}>Q{n}.</span><MdInline>{q.question}</MdInline></p>
      <OptionList options={q.options} correctIndex={q.correct_index} chosen={chosen} onChoose={setChosen} />
      {chosen !== null && <Feedback correct={chosen === q.correct_index} explanation={q.explanation} />}
    </div>
  );
}

function AssertionReasonView({ q, n, hindi }: { q: ReadingAssertionReason; n: number; hindi?: boolean }) {
  const [chosen, setChosen] = useState<number | null>(null);
  return (
    <div>
      <p className="text-xs font-bold mb-2" style={{ color: ACCENT }}>Q{n}. <span className="text-white/40 font-semibold uppercase tracking-wider">{hindi ? 'कथन–कारण' : 'Assertion–Reason'}</span></p>
      <div className="rounded-xl px-4 py-3 mb-1 text-[14px] leading-relaxed" style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)', color: 'rgba(255,255,255,0.82)' }}>
        <p className="mb-1.5"><span className="font-semibold text-sky-300">{hindi ? 'कथन (A): ' : 'Assertion (A): '}</span><MdInline>{q.assertion}</MdInline></p>
        <p><span className="font-semibold text-sky-300">{hindi ? 'कारण (R): ' : 'Reason (R): '}</span><MdInline>{q.reason}</MdInline></p>
      </div>
      <OptionList options={hindi ? AR_OPTIONS_HI : AR_OPTIONS} correctIndex={q.correct_index} chosen={chosen} onChoose={setChosen} />
      {chosen !== null && <Feedback correct={chosen === q.correct_index} explanation={q.explanation} />}
    </div>
  );
}

function ShortAnswerView({ q, n }: { q: ReadingShortAnswer; n: number }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div>
      <p className="text-[15px] leading-relaxed text-white/88"><span className="text-xs font-bold mr-2" style={{ color: ACCENT }}>Q{n}.</span><MdInline>{q.question}</MdInline></p>
      {q.hint && !revealed && <p className="mt-1.5 text-[12px] text-white/35">💡 {q.hint}</p>}
      {!revealed ? (
        <button onClick={() => setRevealed(true)}
          className="mt-3 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
          style={{ background: 'rgba(56,189,248,0.1)', border: '1.5px solid rgba(56,189,248,0.3)', color: '#7dd3fc' }}>
          Likho phir dekho ✍️
        </button>
      ) : (
        <div className="mt-3 rounded-xl px-4 py-3 text-[14px] leading-relaxed" style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.18)', color: 'rgba(255,255,255,0.7)' }}>
          <p className="text-[11px] uppercase tracking-wide text-emerald-400/70 font-semibold mb-1.5">Ek achha jawab aisa ho sakta hai</p>
          <MdInline>{q.model_answer}</MdInline>
          <p className="mt-2 text-[12px] text-white/40">Apne jawab se milao — kya tumne yeh baat cover ki?</p>
        </div>
      )}
    </div>
  );
}

export default function ReadingComprehensionRenderer({ block }: { block: ReadingComprehensionBlock }) {
  const hindi = block.lang === 'hindi';
  const paras = (block.passage || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="my-8 rounded-2xl border px-5 py-5" style={{ borderColor: 'rgba(56,189,248,0.2)', background: 'rgba(56,189,248,0.03)' }}>
      {/* header */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span style={{ color: ACCENT }} className="font-bold">📖</span>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(56,189,248,0.8)' }}>{(hindi ? TYPE_LABEL_HI : TYPE_LABEL)[block.passage_type] || (hindi ? 'गद्यांश' : 'Reading Passage')}</span>
        </div>
        {block.word_count ? <span className="text-[11px] text-white/35 tabular-nums">{block.word_count} {hindi ? 'शब्द' : 'words'}</span> : null}
      </div>

      {block.title && <h3 className="text-lg font-bold text-white/90 mb-1">{block.title}</h3>}
      {block.intro && <div className="mb-3"><p className="text-[13.5px] leading-relaxed text-white/55"><MdInline>{block.intro}</MdInline></p></div>}

      {/* passage card — prose paragraphs are numbered (CBSE style); table chunks
          render as a styled data table, not inside a <p>. */}
      <div className="rounded-xl px-4 py-3 mb-5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {(() => {
          let pn = 0;
          return paras.map((para, i) => {
            if (para.trimStart().startsWith('|')) {
              return <div key={i} className="my-3 overflow-x-auto rounded-lg" style={{ border: '1px solid rgba(255,255,255,0.08)' }}><MdTable>{para}</MdTable></div>;
            }
            pn += 1;
            return (
              <div key={i} className="mb-3 last:mb-0 flex gap-2.5">
                {block.numbered && <span className="font-mono text-xs shrink-0 mt-1" style={{ color: 'rgba(56,189,248,0.5)' }}>{pn}</span>}
                <p className="flex-1 text-[15px] leading-[1.9] text-white/85"><MdInline>{para}</MdInline></p>
              </div>
            );
          });
        })()}
        {block.source_note && <p className="mt-2 text-[11px] italic text-white/30">{block.source_note}</p>}
      </div>

      {/* questions */}
      <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>Ab sawaalon ke jawab do</p>
      <div className="flex flex-col gap-5">
        {block.questions.map((q, i) => {
          if (q.kind === 'mcq') return <McqView key={q.id} q={q} n={i + 1} />;
          if (q.kind === 'assertion_reason') return <AssertionReasonView key={q.id} q={q} n={i + 1} hindi={hindi} />;
          return <ShortAnswerView key={q.id} q={q as ReadingShortAnswer} n={i + 1} />;
        })}
      </div>
    </div>
  );
}
