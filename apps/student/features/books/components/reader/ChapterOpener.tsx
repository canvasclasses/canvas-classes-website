'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Gamepad2, FlaskConical, CheckCircle2, Clock, ArrowRight, Sparkles } from 'lucide-react';
import type { ChapterJourney } from '@canvas/data/types/books';

/**
 * Chapter opener (§15.1) — the motivating on-ramp to a chapter. A full-bleed
 * cover, a one-line promise, the auto-derived "journey" through every lesson
 * with per-page badges, the chapter totals, and a single Start CTA. Authors
 * supply only the hero + intro (+ optional outcomes); the journey is computed.
 */
export default function ChapterOpener({
  chapterNumber,
  chapterTitle,
  heroSrc,
  heroAlt,
  intro,
  outcomes,
  journey,
  basePath,
}: {
  chapterNumber: number;
  chapterTitle: string;
  heroSrc?: string;
  heroAlt?: string;
  intro?: string;
  outcomes?: string[];
  journey: ChapterJourney;
  basePath: string;
}) {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const { entries, totals, firstPageSlug } = journey;
  const startHref = firstPageSlug ? `${basePath}/${firstPageSlug}` : basePath;

  return (
    <div className="w-full">
      {/* ── Full-bleed hero ─────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: '54vh' }}>
        {heroSrc ? (
          <>
            {!heroLoaded && <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(110deg,#0b0c0f,#15171f,#0b0c0f)' }} />}
            <Image
              src={heroSrc}
              alt={heroAlt ?? chapterTitle}
              fill
              priority
              sizes="100vw"
              className={`object-cover transition-opacity duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setHeroLoaded(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 30%, #1e204a, #050614)' }} />
        )}
        {/* Legibility gradient */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,6,9,0.96) 0%, rgba(5,6,9,0.45) 45%, rgba(5,6,9,0.15) 100%)' }} />

        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 px-6 sm:px-12 pb-10 max-w-[1000px]">
          <p className="text-[12px] font-black uppercase tracking-[0.2em] text-orange-400/90 mb-3">
            Chapter {chapterNumber}
          </p>
          <h1
            className="text-[34px] sm:text-[52px] font-black leading-[1.05] tracking-tight bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(120deg, #6ee7b7 0%, #34d399 45%, #22d3ee 100%)' }}
          >
            {chapterTitle}
          </h1>
          {intro && (
            <p className="mt-4 text-[17px] sm:text-[19px] text-white/75 leading-snug max-w-[680px]">
              {intro}
            </p>
          )}
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="max-w-[920px] mx-auto px-5 sm:px-8 py-10">

        {/* Totals strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-7 mb-8 border-b border-white/8">
          <Stat icon={<Sparkles size={15} className="text-amber-300" />} value={totals.pages} label={totals.pages === 1 ? 'lesson' : 'lessons'} />
          {totals.sims > 0 && <Stat icon={<Gamepad2 size={15} className="text-violet-300" />} value={totals.sims} label={totals.sims === 1 ? 'simulation' : 'simulations'} />}
          {totals.workedExamples > 0 && <Stat icon={<FlaskConical size={15} className="text-orange-300" />} value={totals.workedExamples} label="worked examples" />}
          {totals.checks > 0 && <Stat icon={<CheckCircle2 size={15} className="text-emerald-300" />} value={totals.checks} label="checks" />}
          {totals.readingTimeMin > 0 && <Stat icon={<Clock size={15} className="text-sky-300" />} value={`~${totals.readingTimeMin}`} label="min" />}
        </div>

        {/* What you'll master */}
        {outcomes && outcomes.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[13px] font-black uppercase tracking-widest text-white/40 mb-4">What you'll master</h2>
            <ul className="space-y-2.5">
              {outcomes.map((o, i) => (
                <li key={i} className="flex items-start gap-3 text-[16px] text-white/80 leading-snug">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>{renderInline(o)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Journey */}
        <h2 className="text-[13px] font-black uppercase tracking-widest text-white/40 mb-5">Your journey through this chapter</h2>
        <ol className="relative flex flex-col gap-3">
          {entries.map((e, i) => (
            <li key={e.slug}>
              <Link
                href={`${basePath}/${e.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-white/8 bg-white/[0.025]
                  hover:bg-white/[0.05] hover:border-white/15 transition-all p-4"
              >
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black
                  bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-400/25 text-orange-300">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-semibold text-white/90 leading-snug group-hover:text-white">
                    {e.title}
                  </p>
                  {e.subtitle && (
                    <p className="text-[13px] text-white/45 leading-snug mt-0.5 line-clamp-2">{e.subtitle}</p>
                  )}
                  {(e.sims > 0 || e.workedExamples > 0 || e.checks > 0) && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                      {e.sims > 0 && <Badge icon={<Gamepad2 size={12} />} n={e.sims} label="sim" color="#c4b5fd" />}
                      {e.workedExamples > 0 && <Badge icon={<FlaskConical size={12} />} n={e.workedExamples} label="example" color="#fdba74" />}
                      {e.checks > 0 && <Badge icon={<CheckCircle2 size={12} />} n={e.checks} label="check" color="#6ee7b7" />}
                    </div>
                  )}
                </div>
                <ArrowRight size={16} className="text-white/20 group-hover:text-white/50 shrink-0 mt-1 transition-colors" />
              </Link>
            </li>
          ))}
        </ol>

        {/* Colour-coding legend — defined once so students learn what each
            coloured section signals across every page of the book. */}
        <div className="mt-9 rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <h2 className="text-[13px] font-black uppercase tracking-widest text-white/40 mb-4">How to read this book</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {[
              { color: '#dba846', name: 'Learn', desc: 'Worked examples & exam tips — study how it’s done' },
              { color: '#a99bcf', name: 'Think', desc: 'Your turn — reason it out, then reveal' },
              { color: '#7fd4c9', name: 'Connect', desc: 'Real-World Application — where it shows up in life' },
              { color: '#38bdf8', name: 'Remember', desc: 'A key fact worth locking in' },
            ].map((f) => (
              <div key={f.name} className="flex items-start gap-2.5">
                <span className="mt-1 w-3 h-3 rounded-full shrink-0" style={{ background: f.color }} />
                <div>
                  <span className="text-[13px] font-bold" style={{ color: f.color }}>{f.name}</span>
                  <span className="text-[13px] text-white/50"> — {f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start CTA */}
        <Link
          href={startHref}
          className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl
            bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-[15px]
            hover:opacity-90 transition-opacity"
        >
          Start the chapter <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}

// Minimal **bold** support for the authored outcome bullets.
function renderInline(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) => {
    const m = p.match(/^\*\*([^*]+)\*\*$/);
    return m
      ? <strong key={i} className="text-white font-semibold">{m[1]}</strong>
      : <span key={i}>{p}</span>;
  });
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-white font-bold tabular-nums">{value}</span>
      <span className="text-white/40 text-[13px]">{label}</span>
    </div>
  );
}

function Badge({ icon, n, label, color }: { icon: React.ReactNode; n: number; label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color }}>
      {icon}
      {n} {label}{n > 1 ? 's' : ''}
    </span>
  );
}
