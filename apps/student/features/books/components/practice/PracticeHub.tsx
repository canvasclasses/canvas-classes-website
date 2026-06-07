'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bricolage_Grotesque, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import BlockRenderer from '@canvas/book-renderer/BlockRenderer';
import { BookProvider } from '@canvas/book-renderer/book-context';
import { flattenBlocks } from '@canvas/data/books/utils';
import type { Book, BookPage, ChapterPracticeBlock, ApplyExpressBlock } from '@canvas/data/types/books';
import { useBookProgress } from '@/features/books/hooks/useBookProgress';
import { Icon, Ring, StarRow, fireConfetti } from './hubUi';
import './practiceHub.css';

const fDisplay = Bricolage_Grotesque({ subsets: ['latin'], weight: ['400', '600', '700'] });
const fBody = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const fNum = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700'] });

interface Props {
  book: Book;
  page: BookPage;
  bookSlug: string;
  basePath: string;
}

interface Attempt { question_id: string; correct: boolean; chapter_number: number }

export default function PracticeHub({ book, page, bookSlug, basePath }: Props) {
  const router = useRouter();
  const chapterNumber = page.chapter_number;
  const chapterTitle = book.chapters.find((c) => c.number === chapterNumber)?.title ?? `Chapter ${chapterNumber}`;
  const { markComplete } = useBookProgress(bookSlug);

  // Find the two practice blocks authored on this page.
  const flat = useMemo(() => flattenBlocks(page.blocks ?? []), [page.blocks]);
  const mcqBlock = flat.find((b) => b.type === 'chapter_practice') as ChapterPracticeBlock | undefined;
  const applyBlock = flat.find((b) => b.type === 'apply_express') as ApplyExpressBlock | undefined;
  const challengeCount = applyBlock?.challenges.length ?? 0;
  const questionCount = mcqBlock?.session_size ?? 8;

  const [view, setView] = useState<'landing' | 'practice' | 'challenges'>('landing');
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);

  // Pull this user's attempt history → drives the *real* parts of the gamification.
  const loadAttempts = useCallback(() => {
    fetch(`/api/v2/books/practice?book_slug=${encodeURIComponent(bookSlug)}`, { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((b) => setAttempts((b?.data ?? []) as Attempt[]))
      .catch(() => setAttempts([]));
  }, [bookSlug]);
  useEffect(loadAttempts, [loadAttempts]);

  // ── Derived stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const all = attempts ?? [];
    const here = all.filter((a) => a.chapter_number === chapterNumber);
    const total = here.length;
    const correct = here.filter((a) => a.correct).length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    const stars = !total ? 0 : accuracy >= 85 ? 3 : accuracy >= 60 ? 2 : 1;
    const challengeIds = new Set(here.filter((a) => a.question_id.includes('-ae-')).map((a) => a.question_id));
    const triedMcq = here.some((a) => a.question_id.includes('-pr-'));
    const triedChallenge = challengeIds.size > 0;
    return {
      accuracy, stars, totalAttempts: total, correct,
      challengeProgress: Math.min(challengeIds.size, challengeCount),
      xp: correct * 15,                 // real: 15 XP per correct attempt
      triedMcq, triedChallenge,
    };
  }, [attempts, chapterNumber, challengeCount]);

  // Illustrative gamification — needs a real XP-ledger / streak backend to be
  // truthful; rendered per the design until that exists.
  const STREAK = 6;
  const LEVEL = 4;
  const DAILY_GOAL = 100;
  const dailyDone = Math.min(DAILY_GOAL, 40 + stats.correct * 10);

  // Mark the practice page complete + celebrate when a flow is finished.
  const onFlowComplete = useCallback((score: number) => {
    markComplete({ pageSlug: page.slug, chapterNumber, quizScore: score }).catch(() => {});
    if (score >= 80) setTimeout(() => fireConfetti({ y: 0.3 }), 120);
  }, [markComplete, page.slug, chapterNumber]);

  const backToLanding = useCallback(() => { setView('landing'); loadAttempts(); }, [loadAttempts]);

  // Build the chapter journey from the real book.
  const journey = useMemo(() => {
    const chapters = [...book.chapters].sort((a, b) => a.number - b.number);
    const start = Math.max(0, chapters.findIndex((c) => c.number === chapterNumber) - 1);
    return chapters.slice(start, start + 4).map((c) => ({
      title: c.title.replace(/^Ch\.?\s*\d+\s*[|:—-]\s*/i, ''),
      status: c.number < chapterNumber ? 'done' : c.number === chapterNumber ? 'current' : 'locked',
      number: c.number,
    }));
  }, [book.chapters, chapterNumber]);

  const rootStyle = {
    '--font-display': fDisplay.style.fontFamily,
    '--font-body': fBody.style.fontFamily,
    '--font-num': fNum.style.fontFamily,
  } as React.CSSProperties;

  // ── Launched flow (reuses the real renderers) ──────────────────────────
  if (view !== 'landing') {
    const block = view === 'practice' ? mcqBlock : applyBlock;
    return (
      <div className={`phub ${fBody.className}`} style={rootStyle}>
        <div className="ambient"><div className="glow g1" /><div className="glow g2" /><div className="glow g3" /></div>
        <div className="flowwrap fade-in">
          <button className="flowback" onClick={backToLanding}><Icon.arrowleft /> Back to chapter hub</button>
          {block ? (
            <BookProvider value={{ bookSlug, onExit: backToLanding }}>
              <BlockRenderer block={block} onQuizPass={(_id, score) => onFlowComplete(score)} />
            </BookProvider>
          ) : (
            <p style={{ color: 'var(--muted)', padding: '40px 0' }}>This activity isn’t available yet.</p>
          )}
        </div>
      </div>
    );
  }

  // ── Landing ────────────────────────────────────────────────────────────
  const cleanTitle = chapterTitle.replace(/^Ch\.?\s*\d+\s*[|:—-]\s*/i, '');
  return (
    <div className={`phub ${fBody.className}`} style={rootStyle}>
      <div className="ambient"><div className="glow g1" /><div className="glow g2" /><div className="glow g3" /></div>
      <canvas id="phub-confetti" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }} />

      <div className="shell fade-in">
        {/* top bar */}
        <div className="topbar">
          <button className="crumb" onClick={() => router.push(basePath)}>
            <div className="bk" />
            <span><b>{cleanTitle}</b></span>
            <span className="sep">/</span>
            <span>Chapter {chapterNumber}</span>
          </button>
          <div className="lvlchip">
            <span className="lab">Level</span>
            <span className="lv num">{LEVEL}</span>
            <div className="avatar">A</div>
          </div>
        </div>

        {/* hero */}
        <div className="hero">
          <div className="hero-grid">
            <div>
              <span className="complete-badge"><Icon.check style={{ width: 14, height: 14 }} /> CHAPTER {chapterNumber} COMPLETE</span>
              <h1>You finished the chapter.<br /><span className="accent">Now make it stick.</span></h1>
              <p className="lede">
                You’ve read every page of <i>{cleanTitle}</i>. One last step turns reading into knowing —
                a short, adaptive set drawn from the people, the ideas, and the words.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="ic ic-xp"><Icon.bolt /></div>
                  <div><div className="v num">{stats.xp.toLocaleString()}</div><div className="l">XP earned here</div></div>
                </div>
                <div className="stat">
                  <div className="ic ic-streak"><Icon.flame /></div>
                  <div><div className="v num">{STREAK}-day</div><div className="l">Reading streak</div></div>
                </div>
                <div className="stat">
                  <div className="ic ic-acc"><Icon.target /></div>
                  <div><div className="v num">{stats.accuracy}%</div><div className="l">Practice accuracy</div></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', justifyItems: 'center' }}>
              <Ring value={stats.stars / 3} size={188} stroke={14} gid="mastery">
                <div className="big num">{stats.stars}<span style={{ fontSize: 22, color: 'var(--muted-2)' }}>/3</span></div>
                <div className="sub">Mastery</div>
                <div className="starstrip"><StarRow filled={stats.stars} size={18} /></div>
              </Ring>
              <div style={{ fontSize: 12.5, color: 'var(--muted-2)', marginTop: 12, fontWeight: 600, textAlign: 'center', maxWidth: 180 }}>
                {stats.stars >= 3 ? 'Chapter mastered — beautiful work.' : stats.stars === 0 ? 'Practise to earn your first star.' : `Earn ${3 - stats.stars} more star${3 - stats.stars === 1 ? '' : 's'} to master this chapter.`}
              </div>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="seclabel"><h2>Keep the momentum</h2><div className="rule" /></div>
        <div className="actions">
          <div className="acard violet" onClick={() => mcqBlock && setView('practice')} role="button" tabIndex={0}>
            <div className="acard-top">
              <div className="kicker"><span className="badge" style={{ color: 'var(--violet)' }}><Icon.brain /></span> Adaptive Practice</div>
              <div className="difftag M">ADAPTS</div>
            </div>
            <h3>Make it stick</h3>
            <p className="desc">{questionCount} questions that read how you answer — nail a streak and they climb; slip and they ease off. Drawn from the story, its vocabulary, and word-formation.</p>
            <div className="metarow">
              <span className="chip"><Icon.brain /> {questionCount} questions</span>
              <span className="chip"><Icon.sparkle /> Adaptive difficulty</span>
            </div>
            <div className="rewardrow">
              <div className="rw" style={{ color: 'var(--gold)' }}><Icon.bolt /> <span className="num">+{questionCount * 15}</span> XP</div>
              <div className="div" />
              <div className="rw" style={{ color: 'var(--gold)' }}><Icon.star /> up to 3 stars</div>
            </div>
            <button className="cta">Start practice <Icon.play /></button>
          </div>

          <div className="acard pink" onClick={() => applyBlock && setView('challenges')} role="button" tabIndex={0}>
            <div className="acard-top">
              <div className="kicker"><span className="badge" style={{ color: 'var(--pink)' }}><Icon.trophy /></span> Apply &amp; Express</div>
              <div className="difftag H">+XP</div>
            </div>
            <h3>Show what you can do</h3>
            <p className="desc">Not just what you remember — what you can <i>do</i>. Fill the blanks, predict the next word, build words, and write your own sentences.</p>
            <div className="metarow">
              <span className="chip"><Icon.blocks /> {challengeCount} challenges</span>
              <span className="chip"><Icon.pen /> Write your own</span>
            </div>
            <div className="progress-mini">
              <div className="ptop"><span>Challenge progress</span><span className="num">{stats.challengeProgress} / {challengeCount}</span></div>
              <div className="bar"><span style={{ width: `${challengeCount ? Math.max(4, (stats.challengeProgress / challengeCount) * 100) : 4}%` }} /></div>
            </div>
            <button className="cta">Start challenges <Icon.arrow /></button>
          </div>
        </div>

        {/* widgets */}
        <div className="widgets">
          <div className="panel">
            <h4>Today’s goal</h4>
            <div className="ph-sub">Keep the {STREAK}-day streak alive.</div>
            <div className="goalrow">
              <div className="goalring">
                <Ring value={dailyDone / DAILY_GOAL} size={118} stroke={10} gid="daily" from="#34d399" to="#10b981">
                  <div className="gc">
                    <div className="n num">{dailyDone}<span style={{ fontSize: 13, color: 'var(--muted-2)' }}>/{DAILY_GOAL}</span></div>
                    <div className="t">XP today</div>
                  </div>
                </Ring>
              </div>
              <div className="goallist">
                <div className="gtask done"><span className="tick"><Icon.check style={{ color: '#06241a' }} /></span> Read the chapter</div>
                <div className={`gtask${stats.triedMcq ? ' done' : ''}`}><span className="tick">{stats.triedMcq && <Icon.check style={{ color: '#06241a' }} />}</span> Finish adaptive practice</div>
                <div className={`gtask${stats.triedChallenge ? ' done' : ''}`}><span className="tick">{stats.triedChallenge && <Icon.check style={{ color: '#06241a' }} />}</span> Try one challenge</div>
              </div>
            </div>
          </div>

          <div className="panel">
            <h4>Your reading journey</h4>
            <div className="ph-sub">{Math.max(0, book.chapters.length - chapterNumber)} chapters to go before the finale.</div>
            <div className="journey">
              {journey.map((n, i) => (
                <div key={n.number} className={`jnode ${n.status}`}>
                  <div className="rail">
                    <div className="dot">
                      {n.status === 'done' ? <Icon.check style={{ width: 18, height: 18, color: '#06241a' }} />
                        : n.status === 'locked' ? <Icon.lock style={{ width: 16, height: 16 }} />
                        : n.number}
                    </div>
                    {i < journey.length - 1 && <div className="line" />}
                  </div>
                  <div className="jbody">
                    <div className="jt">{n.title}</div>
                    {n.status === 'current' && <div className="js">Practise now to master this chapter</div>}
                    {n.status === 'locked' && <div className="js">Unlocks as you progress</div>}
                    {n.status === 'current' && <span className="jpill now">You are here</span>}
                    {n.status === 'done' && <span className="jpill done">Done</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
