'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  MonitorPlay,
  Volume2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Flame,
  BarChart2,
  Calendar,
  Tag,
  ArrowLeft,
} from 'lucide-react';
import MathRenderer from '@/app/crucible/admin/components/MathRenderer';
import { QuestionDetail } from '../../actions';
import { Chapter } from '../../components/types';

interface Props {
  question: QuestionDetail;
  chapter: Chapter | null;
  adjacent: {
    prev: { id: string; display_id: string } | null;
    next: { id: string; display_id: string } | null;
  };
  related: Array<{
    id: string;
    display_id: string;
    question_text: string;
    metadata: { difficulty: string; exam_source?: any };
  }>;
}

const DIFF_COLOR: Record<string, string> = {
  Easy: '#34d399',
  Medium: '#fbbf24',
  Hard: '#f87171',
};

const CAT_COLOR: Record<string, string> = {
  Physical: '#38bdf8',
  Organic: '#a78bfa',
  Inorganic: '#34d399',
  Practical: '#fbbf24',
};

function OptionLabel({ id }: { id: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
      fontSize: 12, fontWeight: 700, flexShrink: 0,
    }}>{id.toUpperCase()}</span>
  );
}

export default function QuestionDetailPage({ question, chapter, adjacent, related }: Props) {
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [audioExpanded, setAudioExpanded] = useState<Record<number, boolean>>({});
  const [showSolution, setShowSolution] = useState(false);

  const examSource = question.metadata.exam_source;
  const examLabel = examSource?.exam && examSource?.year
    ? `${examSource.exam} ${examSource.year}${examSource.shift ? ` · ${examSource.shift}` : ''}`
    : null;

  const chapterColor = CAT_COLOR[chapter?.category ?? 'Physical'] ?? '#a78bfa';
  const diffColor = DIFF_COLOR[question.metadata.difficulty] ?? '#fbbf24';

  const hasMedia = !!(
    question.solution.video_url ||
    (question.solution.asset_ids?.audio && question.solution.asset_ids.audio.length > 0)
  );
  const hasSolution = !!(question.solution.text_markdown || hasMedia);

  // JSON-LD structured data (injected server-side via script tag in parent, but also here for client fallback)
  const questionText = question.question_text.markdown
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\$\$?[^$]*\$\$?/g, '')
    .replace(/[*_`#>]/g, '')
    .trim();

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'QAPage',
            'mainEntity': {
              '@type': 'Question',
              'name': questionText.substring(0, 200),
              'text': questionText,
              'answerCount': hasSolution ? 1 : 0,
              'acceptedAnswer': hasSolution ? {
                '@type': 'Answer',
                'text': question.solution.text_markdown
                  .replace(/\$\$?[^$]*\$\$?/g, '')
                  .replace(/[*_`#>]/g, '')
                  .trim()
                  .substring(0, 500),
                'upvoteCount': 0,
                'url': `https://www.canvasclasses.in/the-crucible/q/${question.id}`,
                'author': {
                  '@type': 'Organization',
                  'name': 'Canvas Classes',
                  'url': 'https://www.canvasclasses.in',
                },
                ...(question.solution.video_url ? {
                  'video': {
                    '@type': 'VideoObject',
                    'name': `Video Solution — ${question.display_id}`,
                    'description': `Video explanation for ${question.display_id}${examLabel ? ` from ${examLabel}` : ''}`,
                    'contentUrl': question.solution.video_url,
                    'uploadDate': question.updated_at,
                    'publisher': {
                      '@type': 'Organization',
                      'name': 'Canvas Classes',
                    },
                  },
                } : {}),
              } : undefined,
            },
            'breadcrumb': {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'The Crucible', 'item': 'https://www.canvasclasses.in/the-crucible' },
                ...(chapter ? [{ '@type': 'ListItem', 'position': 2, 'name': chapter.name, 'item': `https://www.canvasclasses.in/the-crucible/${chapter.id}` }] : []),
                { '@type': 'ListItem', 'position': chapter ? 3 : 2, 'name': question.display_id, 'item': `https://www.canvasclasses.in/the-crucible/q/${question.id}` },
              ],
            },
          }),
        }}
      />

      <main style={{ minHeight: '100vh', background: '#0a0a0f', paddingTop: 80, paddingBottom: 60 }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 16px' }}>

          {/* ── Breadcrumb ── */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 24, flexWrap: 'wrap' }}>
            <Link href="/the-crucible" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>The Crucible</Link>
            <span>/</span>
            {chapter && (
              <>
                <Link href={`/the-crucible/${chapter.id}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>{chapter.name}</Link>
                <span>/</span>
              </>
            )}
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>{question.display_id}</span>
          </nav>

          {/* ── Question Card ── */}
          <article style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '24px 24px 28px',
            marginBottom: 20,
          }}>
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span style={{
                padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', letterSpacing: '0.06em',
              }}>{question.display_id}</span>

              <span style={{
                padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: `${diffColor}18`, border: `1px solid ${diffColor}40`,
                color: diffColor,
              }}>{question.metadata.difficulty}</span>

              {chapter && (
                <span style={{
                  padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: `${chapterColor}15`, border: `1px solid ${chapterColor}35`,
                  color: chapterColor,
                }}>{chapter.name}</span>
              )}

              {question.metadata.is_top_pyq && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)',
                  color: '#fbbf24',
                }}>
                  <Flame style={{ width: 10, height: 10 }} /> Top PYQ
                </span>
              )}

              {examLabel && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '3px 10px', borderRadius: 6, fontSize: 11,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  <Calendar style={{ width: 10, height: 10 }} /> {examLabel}
                </span>
              )}
            </div>

            {/* Question text */}
            <div style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.92)', marginBottom: 20 }}>
              <MathRenderer
                markdown={question.question_text.markdown}
                className="text-base leading-relaxed"
                fontSize={17}
                imageScale={question.svg_scales?.question ?? 100}
              />
            </div>

            {/* Options */}
            {question.options && question.options.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {question.options.map((opt: any) => (
                  <div key={opt.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: opt.is_correct ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${opt.is_correct ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  }}>
                    <OptionLabel id={opt.id} />
                    <div style={{ fontSize: 14, color: opt.is_correct ? '#34d399' : 'rgba(255,255,255,0.75)', paddingTop: 4 }}>
                      <MathRenderer
                        markdown={opt.text || ''}
                        className="text-sm"
                        fontSize={14}
                        imageScale={100}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* NVT answer */}
            {question.type === 'NVT' && question.answer?.integer_value !== undefined && (
              <div style={{
                marginTop: 16, padding: '10px 14px', borderRadius: 10,
                background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.3)',
                fontSize: 14, color: '#34d399',
              }}>
                Answer: <strong>{question.answer.integer_value}</strong>
              </div>
            )}
          </article>

          {/* ── Solution Section ── */}
          {hasSolution && (
            <section style={{
              background: 'rgba(124,58,237,0.05)',
              border: '1px solid rgba(124,58,237,0.2)',
              borderRadius: 16,
              padding: '20px 24px 24px',
              marginBottom: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Expert Solution
                </span>

                {/* Media buttons */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {question.solution.video_url && (
                    <button
                      onClick={() => setVideoExpanded(v => !v)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '7px 14px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                        border: 'none', borderRadius: 8, color: '#fff',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
                      }}
                    >
                      <MonitorPlay style={{ width: 14, height: 14 }} />
                      {videoExpanded ? 'Hide' : 'Watch'} Video
                      {videoExpanded ? <ChevronUp style={{ width: 12, height: 12 }} /> : <ChevronDown style={{ width: 12, height: 12 }} />}
                    </button>
                  )}

                  {question.solution.asset_ids?.audio?.map((url, idx) =>
                    url ? (
                      <button
                        key={idx}
                        onClick={() => setAudioExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '7px 14px',
                          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                          border: 'none', borderRadius: 8, color: '#fff',
                          fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(168,85,247,0.3)',
                        }}
                      >
                        <Volume2 style={{ width: 14, height: 14 }} />
                        {audioExpanded[idx] ? 'Hide' : 'Play'} Audio{(question.solution.asset_ids?.audio?.length ?? 0) > 1 ? ` ${idx + 1}` : ''}
                        {audioExpanded[idx] ? <ChevronUp style={{ width: 12, height: 12 }} /> : <ChevronDown style={{ width: 12, height: 12 }} />}
                      </button>
                    ) : null
                  )}
                </div>
              </div>

              {/* Video Player */}
              {question.solution.video_url && videoExpanded && (
                <div style={{ marginBottom: 20 }}>
                  {question.solution.video_url.includes('youtube.com') || question.solution.video_url.includes('youtu.be') ? (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 10, background: '#000' }}>
                      <iframe
                        src={question.solution.video_url.replace('watch?v=', 'embed/').split('&')[0].replace('youtu.be/', 'youtube.com/embed/')}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div style={{ aspectRatio: '1/1', borderRadius: 10, overflow: 'hidden', background: '#000' }}>
                      <video
                        controls
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onKeyDown={(e) => {
                          if (e.key === ' ') { e.preventDefault(); const v = e.currentTarget; v.paused ? v.play() : v.pause(); }
                          else if (e.key === 'ArrowRight') { e.preventDefault(); e.currentTarget.currentTime += 5; }
                          else if (e.key === 'ArrowLeft') { e.preventDefault(); e.currentTarget.currentTime -= 5; }
                        }}
                      >
                        <source src={question.solution.video_url} type="video/mp4" />
                      </video>
                    </div>
                  )}
                </div>
              )}

              {/* Audio Players */}
              {question.solution.asset_ids?.audio?.map((url, idx) =>
                url && audioExpanded[idx] ? (
                  <div key={idx} style={{ marginBottom: 12 }}>
                    <audio controls style={{ width: '100%', borderRadius: 8 }}>
                      <source src={url} type="audio/webm" />
                      <source src={url} type="audio/mpeg" />
                    </audio>
                  </div>
                ) : null
              )}

              {/* Text Solution */}
              {question.solution.text_markdown && (
                <div style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.85)' }}>
                  <MathRenderer
                    markdown={question.solution.text_markdown}
                    className="text-sm leading-relaxed"
                    fontSize={15}
                    imageScale={question.svg_scales?.solution ?? 100}
                  />
                </div>
              )}
            </section>
          )}

          {/* ── Prev / Next Navigation ── */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
            {adjacent.prev ? (
              <Link
                href={`/the-crucible/q/${adjacent.prev.id}`}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 16px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13, fontWeight: 500,
                }}
              >
                <ChevronLeft style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>PREVIOUS</div>
                  {adjacent.prev.display_id}
                </span>
              </Link>
            ) : <div style={{ flex: 1 }} />}

            {adjacent.next ? (
              <Link
                href={`/the-crucible/q/${adjacent.next.id}`}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8,
                  padding: '12px 16px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13, fontWeight: 500,
                  textAlign: 'right',
                }}
              >
                <span>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>NEXT</div>
                  {adjacent.next.display_id}
                </span>
                <ChevronRight style={{ width: 16, height: 16, flexShrink: 0 }} />
              </Link>
            ) : <div style={{ flex: 1 }} />}
          </div>

          {/* ── CTA ── */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(59,130,246,0.1) 100%)',
            border: '1px solid rgba(124,58,237,0.25)',
            borderRadius: 16, padding: '24px 28px', marginBottom: 28, textAlign: 'center',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
              Practice more from {chapter?.name ?? 'this chapter'}
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 18 }}>
              Browse all questions, take timed tests, and track your progress with The Crucible.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {chapter && (
                <Link
                  href={`/the-crucible/${chapter.id}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '10px 22px', borderRadius: 10,
                    background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                    color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600,
                  }}
                >
                  <BookOpen style={{ width: 15, height: 15 }} />
                  Browse Chapter
                </Link>
              )}
              <Link
                href="/the-crucible"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 22px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: 14, fontWeight: 600,
                }}
              >
                All Chapters
              </Link>
            </div>
          </div>

          {/* ── Related Questions ── */}
          {related.length > 0 && (
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: 14 }}>
                More questions from {chapter?.name ?? 'this chapter'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {related.map((rq) => {
                  const rqExam = rq.metadata.exam_source;
                  const rqLabel = rqExam?.exam && rqExam?.year ? `${rqExam.exam} ${rqExam.year}` : null;
                  const rqDiff = DIFF_COLOR[rq.metadata.difficulty] ?? '#fbbf24';
                  const snippet = rq.question_text
                    .replace(/!\[.*?\]\(.*?\)/g, '[diagram]')
                    .replace(/\$\$?[^$]*\$\$?/g, '[formula]')
                    .replace(/[*_`#>]/g, '')
                    .trim()
                    .substring(0, 110);

                  return (
                    <Link
                      key={rq.id}
                      href={`/the-crucible/q/${rq.id}`}
                      style={{
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
                        padding: '12px 16px', borderRadius: 10,
                        background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)',
                        textDecoration: 'none', color: 'inherit',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{rq.display_id}</span>
                          {rqLabel && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{rqLabel}</span>}
                          <span style={{ fontSize: 11, color: rqDiff }}>{rq.metadata.difficulty}</span>
                        </div>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                          {snippet}{snippet.length >= 110 ? '…' : ''}
                        </div>
                      </div>
                      <ChevronRight style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.25)', flexShrink: 0, marginTop: 3 }} />
                    </Link>
                  );
                })}
              </div>
              {chapter && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                  <Link
                    href={`/the-crucible/${chapter.id}`}
                    style={{ fontSize: 13, color: '#a78bfa', textDecoration: 'none' }}
                  >
                    View all {chapter.name} questions →
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
