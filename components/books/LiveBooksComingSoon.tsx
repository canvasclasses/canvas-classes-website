'use client';

import Link from 'next/link';
import { ArrowLeft, Bell, Sparkles, Gamepad2, ClipboardCheck, Languages, Zap } from 'lucide-react';
import { LiveBooksLogo } from './bookDesign';

interface Props {
  grade: number;
  expectedSubjects?: string[];
}

export default function LiveBooksComingSoon({ grade, expectedSubjects = [] }: Props) {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col pt-[72px]">

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[15%] -left-[10%] w-[400px] h-[400px] rounded-full
          bg-orange-500/[0.04] blur-[120px]" />
        <div className="absolute top-[50%] -right-[8%] w-[380px] h-[380px] rounded-full
          bg-violet-500/[0.03] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg text-center">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500
                blur-xl opacity-30" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500
                flex items-center justify-center shadow-lg shadow-orange-500/20 ring-1 ring-orange-300/30">
                <LiveBooksLogo size={46} />
              </div>
            </div>
          </div>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
            bg-orange-500/10 border border-orange-500/20 mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-400">
              Coming Soon
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
            Class {grade}{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Live Books
            </span>
          </h1>

          <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 max-w-sm mx-auto">
            We&apos;re building interactive NCERT Class {grade} books with simulations, worked
            examples, and Hinglish mode.{' '}
            {expectedSubjects.length > 0
              ? `${expectedSubjects.join(', ')} — coming up next.`
              : 'Check back soon.'}
          </p>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { icon: Gamepad2,       label: 'Simulations',   color: 'text-sky-400',    bg: 'bg-sky-500/10',    border: 'border-sky-500/20' },
              { icon: ClipboardCheck, label: 'Quizzes',       color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
              { icon: Languages,      label: 'Hinglish mode', color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20' },
              { icon: Zap,            label: 'Adaptive',      color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
              { icon: Sparkles,       label: 'Free forever',  color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
            ].map(chip => {
              const Icon = chip.icon;
              return (
                <span
                  key={chip.label}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                    text-xs font-semibold border ${chip.bg} ${chip.border} ${chip.color}`}
                >
                  <Icon size={11} />
                  {chip.label}
                </span>
              );
            })}
          </div>

          {/* Glassmorphic info card */}
          <div className="relative rounded-2xl border border-white/[0.09] overflow-hidden
            bg-white/[0.02] backdrop-blur-xl shadow-xl shadow-black/40 p-6 mb-8 text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.06] via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
              from-transparent via-white/[0.18] to-transparent" />
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20
                flex items-center justify-center shrink-0 mt-0.5">
                <Bell size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Stay in the loop</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Follow Canvas Classes on YouTube or Instagram — we announce new live books
                  there first, along with chapter drops and study tips.
                </p>
              </div>
            </div>
          </div>

          {/* Back CTA */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Canvas Classes
          </Link>
        </div>
      </div>
    </div>
  );
}
