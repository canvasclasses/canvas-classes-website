'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Atom, Bell, Magnet, Orbit, Waves, Zap } from 'lucide-react';

export default function PhysicsComingSoon() {
  return (
    <div className="relative min-h-screen bg-[#050505] text-white flex flex-col pt-[72px] overflow-hidden">

      {/* Ambient background — cool palette to contrast with the warm Live Books page */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[460px] h-[460px] rounded-full
          bg-cyan-500/[0.06] blur-[130px]" />
        <div className="absolute top-[55%] -right-[10%] w-[420px] h-[420px] rounded-full
          bg-sky-500/[0.05] blur-[130px]" />
        <div className="absolute bottom-[5%] left-[30%] w-[360px] h-[360px] rounded-full
          bg-blue-500/[0.04] blur-[130px]" />
        {/* Faint grid — engineering paper feel */}
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(125,211,252,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 50%, transparent 85%)',
          }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl text-center">

          {/* Animated pendulum hero */}
          <div className="flex justify-center mb-8">
            <PendulumMark />
          </div>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
            bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
              In the Lab · Coming Soon
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
            Physics{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 bg-clip-text text-transparent">
              Simulations
            </span>
          </h1>

          <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
            Pendulums you can swing, projectiles you can launch, circuits you can break and
            rebuild. We&apos;re turning the physics syllabus into things you can actually play
            with — not just read.
          </p>

          {/* Feature chips — physics-specific, distinct from Live Books */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { icon: Orbit,  label: 'Pendulum & motion',     color: 'text-cyan-300', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
              { icon: Zap,    label: 'Energy conservation',    color: 'text-sky-300',  bg: 'bg-sky-500/10',  border: 'border-sky-500/20' },
              { icon: Waves,  label: 'Waves & optics',         color: 'text-blue-300', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { icon: Magnet, label: 'Electromagnetism',       color: 'text-indigo-300', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
              { icon: Atom,   label: 'Modern physics',         color: 'text-violet-300', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
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

          {/* Glassmorphic info card — cyan accents instead of orange */}
          <div className="relative rounded-2xl border border-white/[0.09] overflow-hidden
            bg-white/[0.02] backdrop-blur-xl shadow-xl shadow-black/40 p-6 mb-8 text-left">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r
              from-transparent via-cyan-300/[0.25] to-transparent" />
            <div className="relative flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20
                flex items-center justify-center shrink-0 mt-0.5">
                <Bell size={18} className="text-cyan-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white mb-1">First sims drop soon</p>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Follow Canvas Classes on YouTube or Instagram — we ship simulations alongside
                  chapter walkthroughs, so you&apos;ll see them the moment they&apos;re live.
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

// ─────────────────────────────────────────────────────────────────────────────
// Animated pendulum hero mark
// ─────────────────────────────────────────────────────────────────────────────

function PendulumMark() {
  return (
    <div className="relative w-32 h-32 flex flex-col items-center">
      {/* Glow halo */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-sky-500/10 blur-2xl" />
      {/* Pivot */}
      <div className="relative z-10 w-3 h-3 rounded-full bg-cyan-300 ring-2 ring-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
      {/* Swinging string + bob */}
      <motion.div
        className="relative z-10 origin-top flex flex-col items-center"
        style={{ transformOrigin: 'top center' }}
        animate={{ rotate: [-22, 22, -22] }}
        transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity }}
      >
        <div className="w-px h-20 bg-gradient-to-b from-cyan-300/70 to-cyan-400/30" />
        <div className="relative -mt-1 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-sky-500
          shadow-[0_0_20px_rgba(34,211,238,0.55)] ring-2 ring-cyan-200/30" />
      </motion.div>
    </div>
  );
}
