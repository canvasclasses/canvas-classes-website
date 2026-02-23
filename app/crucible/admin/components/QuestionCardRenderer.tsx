'use client';

import { forwardRef } from 'react';
import type React from 'react';
import MathRenderer from './MathRenderer';

interface Question {
  _id: string;
  display_id: string;
  question_text: { markdown: string };
  type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC';
  options: Array<{ id: string; text: string; is_correct: boolean }>;
  answer?: { integer_value?: number; decimal_value?: number };
  solution: { text_markdown: string };
  metadata: { difficulty: 'Easy' | 'Medium' | 'Hard'; chapter_id: string };
  svg_scales?: Record<string, number>;
}

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  showAnswerKey: boolean;
  includeSolution: boolean;
  sheetTitle: string;
  width?: number;   // px — capture width
  height?: number;  // px — capture height (full page)
}

// ── Design tokens ────────────────────────────────────────────────────────────
// Deep navy — the single background colour used everywhere
const BG        = '#0d1117';
const BG_CARD   = '#161b27';   // slightly lighter panel
const ACCENT    = '#7c3aed';   // purple
const ACCENT2   = '#a78bfa';   // light purple
const TEXT_PRI  = '#e2e8f0';   // primary text
const TEXT_SEC  = '#94a3b8';   // secondary / muted
const TEXT_DIM  = '#475569';   // very muted
const DIVIDER   = '#1e2a3a';   // subtle divider
const GREEN     = '#34d399';   // correct answer highlight
const GREEN_DIM = 'rgba(52,211,153,0.12)';

const TYPE_PILL: Record<string, { bg: string; text: string }> = {
  SCQ: { bg: 'rgba(124,58,237,0.25)', text: '#a78bfa' },
  MCQ: { bg: 'rgba(59,130,246,0.2)',  text: '#93c5fd' },
  NVT: { bg: 'rgba(192,132,252,0.2)', text: '#d8b4fe' },
  AR:  { bg: 'rgba(251,146,60,0.2)',  text: '#fdba74' },
  MST: { bg: 'rgba(34,211,238,0.2)',  text: '#67e8f9' },
  MTC: { bg: 'rgba(244,114,182,0.2)', text: '#f9a8d4' },
};

const DIFF_PILL: Record<string, { text: string }> = {
  Easy:   { text: '#34d399' },
  Medium: { text: '#fbbf24' },
  Hard:   { text: '#f87171' },
};

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

// html2canvas collapses word-spaces when web fonts (Inter, KaTeX) aren't
// available in the off-screen render context. Explicit word-spacing + a
// guaranteed system font stack prevents character collapse.
const FONT_FAMILY = '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
const TEXT_STYLE: React.CSSProperties = {
  wordSpacing: '0.05em',
  letterSpacing: '0.01em',
  fontFamily: FONT_FAMILY,
};

export function getSvgScaleForQ(q: Question, field: string): number {
  return q.svg_scales?.[field] ?? 100;
}

/**
 * Full-page question renderer — fills the entire capture area with a uniform
 * deep-navy background. No boxes around options. Clean, professional exam look.
 * Designed to be mounted off-screen and captured with html2canvas.
 */
const QuestionCard = forwardRef<HTMLDivElement, QuestionCardProps>(
  ({ question: q, index, total, showAnswerKey, includeSolution, sheetTitle, width = 1200, height }, ref) => {
    const tp = TYPE_PILL[q.type] ?? TYPE_PILL.SCQ;
    const dp = DIFF_PILL[q.metadata.difficulty] ?? DIFF_PILL.Medium;

    const PAD_H = Math.round(width * 0.055);  // ~66px at 1200
    const PAD_V = Math.round(width * 0.038);  // ~46px at 1200

    return (
      <div
        ref={ref}
        style={{
          width,
          minHeight: height ?? 'auto',
          background: BG,
          fontFamily: FONT_FAMILY,
          color: TEXT_PRI,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── Top accent stripe ── */}
        <div style={{
          height: 4,
          background: `linear-gradient(90deg, ${ACCENT} 0%, #9333ea 60%, #6366f1 100%)`,
          flexShrink: 0,
        }} />

        {/* ── Header bar ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${PAD_V * 0.7}px ${PAD_H}px`,
          borderBottom: `1px solid ${DIVIDER}`,
          background: BG_CARD,
          flexShrink: 0,
        }}>
          {/* Left: ID + type + difficulty */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'nowrap' }}>
            <span style={{
              fontFamily: '"Courier New", monospace',
              fontWeight: 700,
              fontSize: Math.round(width * 0.014),
              color: ACCENT2,
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}>
              {q.display_id}
            </span>

            <span style={{
              fontSize: Math.round(width * 0.011),
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 20,
              background: tp.bg,
              color: tp.text,
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              lineHeight: 1.4,
            }}>
              {q.type}
            </span>

            <span style={{
              fontSize: Math.round(width * 0.012),
              fontWeight: 600,
              color: dp.text,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>
              {q.metadata.difficulty}
            </span>
          </div>

          {/* Right: sheet info */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: Math.round(width * 0.010), color: TEXT_DIM, fontWeight: 500 }}>
              {sheetTitle}
            </div>
            <div style={{ fontSize: Math.round(width * 0.010), color: TEXT_DIM, marginTop: 2 }}>
              Q {index + 1} <span style={{ color: DIVIDER }}>/ {total}</span>
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{
          flex: 1,
          padding: `${PAD_V}px ${PAD_H}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: Math.round(width * 0.026),
        }}>

          {/* Question text */}
          <div style={{ lineHeight: 1.75, ...TEXT_STYLE }}>
            <MathRenderer
              markdown={q.question_text.markdown}
              className="export-question-text"
              fontSize={Math.round(width * 0.018)}
              imageScale={getSvgScaleForQ(q, 'question')}
            />
          </div>

          {/* ── Options (no boxes — clean text list) ── */}
          {q.type !== 'NVT' && q.options.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: Math.round(width * 0.013),
              paddingLeft: Math.round(width * 0.004),
            }}>
              {q.options.map((opt, oi) => {
                const label = OPTION_LABELS[oi] ?? opt.id.toUpperCase();
                const correct = opt.is_correct && showAnswerKey;
                const optFontSize = Math.round(width * 0.016);
                const labelWidth = Math.round(width * 0.030);
                return (
                  <div
                    key={opt.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: Math.round(width * 0.012),
                      // identical padding for all options — no shifting
                      padding: `${Math.round(width * 0.005)}px 0`,
                    }}
                  >
                    {/* Letter label — fixed width so all options align */}
                    <span style={{
                      flexShrink: 0,
                      fontWeight: 700,
                      fontSize: optFontSize,
                      // Only the label changes colour for correct answer
                      color: correct ? GREEN : ACCENT2,
                      width: labelWidth,
                      lineHeight: 1.65,
                      textAlign: 'right',
                      ...TEXT_STYLE,
                    }}>
                      ({label})
                    </span>

                    {/* Option content — same colour for all, no background */}
                    <div style={{
                      flex: 1,
                      lineHeight: 1.65,
                      color: TEXT_PRI,
                      ...TEXT_STYLE,
                    }}>
                      <MathRenderer
                        markdown={opt.text}
                        className="export-option-text"
                        fontSize={optFontSize}
                        imageScale={getSvgScaleForQ(q, `option_${opt.id}`)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── NVT answer line ── */}
          {q.type === 'NVT' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              paddingTop: Math.round(width * 0.008),
            }}>
              <span style={{
                fontSize: Math.round(width * 0.014),
                fontWeight: 600,
                color: TEXT_SEC,
                letterSpacing: '0.04em',
              }}>
                Answer:
              </span>
              {showAnswerKey ? (
                <span style={{
                  fontSize: Math.round(width * 0.018),
                  fontWeight: 700,
                  color: ACCENT2,
                  background: 'rgba(124,58,237,0.15)',
                  padding: '4px 18px',
                  borderRadius: 8,
                  borderLeft: `3px solid ${ACCENT}`,
                }}>
                  {q.answer?.integer_value ?? q.answer?.decimal_value ?? '—'}
                </span>
              ) : (
                <span style={{
                  fontSize: Math.round(width * 0.016),
                  color: TEXT_DIM,
                  borderBottom: `1px dashed ${TEXT_DIM}`,
                  minWidth: 120,
                  display: 'inline-block',
                }}>
                  &nbsp;
                </span>
              )}
            </div>
          )}

          {/* ── Solution ── */}
          {includeSolution && q.solution?.text_markdown && (
            <div style={{
              borderTop: `1px solid ${DIVIDER}`,
              paddingTop: Math.round(width * 0.022),
              marginTop: Math.round(width * 0.004),
            }}>
              <div style={{
                fontSize: Math.round(width * 0.010),
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: ACCENT,
                textTransform: 'uppercase',
                marginBottom: Math.round(width * 0.014),
              }}>
                Solution
              </div>
              <div style={{ lineHeight: 1.7, color: TEXT_SEC, ...TEXT_STYLE }}>
                <MathRenderer
                  markdown={q.solution.text_markdown}
                  className="export-solution-text"
                  fontSize={Math.round(width * 0.015)}
                  imageScale={getSvgScaleForQ(q, 'solution')}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          borderTop: `1px solid ${DIVIDER}`,
          padding: `${Math.round(PAD_V * 0.55)}px ${PAD_H}px`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: BG_CARD,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: Math.round(width * 0.010), color: TEXT_DIM }}>
            Canvas Classes
          </span>
          <span style={{ fontSize: Math.round(width * 0.010), color: TEXT_DIM }}>
            {sheetTitle}
          </span>
          <span style={{ fontSize: Math.round(width * 0.010), color: TEXT_DIM }}>
            {q.display_id}
          </span>
        </div>

        {/* ── Bottom accent stripe ── */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, #6366f1 0%, ${ACCENT} 50%, #9333ea 100%)`,
          flexShrink: 0,
        }} />
      </div>
    );
  }
);

QuestionCard.displayName = 'QuestionCard';
export default QuestionCard;
