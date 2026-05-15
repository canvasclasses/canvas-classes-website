'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Tier, TopCollege } from './topCollegesData';

const TIER_BADGE: Record<Tier, string> = {
  IIT: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
  NIT: 'bg-sky-500/10 border-sky-500/30 text-sky-300',
  IIIT: 'bg-violet-500/10 border-violet-500/30 text-violet-300',
  BITS: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  Private: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
};

// Short 2-3 letter tag used on placeholder tiles while real images aren't loaded.
function initialsFor(name: string): string {
  const stripped = name.replace(/^(IIT|NIT|IIIT|BITS|MNIT|VNIT|MNNIT|SRM|VIT|MIT)\s+/, '');
  const parts = stripped.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 3).toUpperCase();
  return parts.map((p) => p[0]).join('').slice(0, 3).toUpperCase();
}

function PlaceholderTile({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-white/5 bg-gradient-to-br from-[#1a2340] via-[#151E32] to-[#0B0F15] flex items-center justify-center ${className ?? ''}`}
    >
      <span className="text-sm font-semibold text-white/30 tracking-wider">{label}</span>
    </div>
  );
}

export default function TopCollegeCard({ college }: { college: TopCollege }) {
  const [open, setOpen] = useState(false);
  const initials = initialsFor(college.name);
  const hasImages = Array.isArray(college.images) && college.images.length > 0;
  const thumb = hasImages ? college.images![0] : null;
  const gallery = hasImages ? college.images!.slice(0, 4) : [];
  // Always render 4 gallery slots for consistent layout; pad with placeholders.
  const gallerySlots = 4;

  return (
    <article className="rounded-xl bg-[#0B0F15] border border-white/5 overflow-hidden transition-colors hover:border-white/15">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`college-${college.slug}-details`}
        className="w-full text-left flex items-center gap-4 p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 rounded-xl"
      >
        {thumb ? (
          <div className="relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-white/10">
            <Image
              src={thumb}
              alt={`${college.name} campus`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        ) : (
          <PlaceholderTile label={initials} className="shrink-0 w-20 h-20" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base md:text-lg font-semibold text-white truncate">
              {college.name}
            </h3>
            <span
              className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${TIER_BADGE[college.tier]}`}
            >
              {college.tier}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">
            {college.city}, {college.state} · Est. {college.established}
          </p>
        </div>

        <svg
          className={`shrink-0 w-4 h-4 text-zinc-400 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path fillRule="evenodd" clipRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </button>

      {/* Always-rendered details (SEO-friendly); CSS grid trick collapses height smoothly. */}
      <div
        id={`college-${college.slug}-details`}
        className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-5 pt-1 space-y-4 border-t border-white/5">
            {/* Gallery — 4 tiles, responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
              {Array.from({ length: gallerySlots }).map((_, i) => {
                const src = gallery[i];
                if (src) {
                  return (
                    <div
                      key={i}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/5 bg-[#0B0F15]"
                    >
                      <Image
                        src={src}
                        alt={`${college.name} photo ${i + 1}`}
                        fill
                        sizes="(min-width: 768px) 240px, 45vw"
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                  );
                }
                return (
                  <PlaceholderTile
                    key={i}
                    label={initials}
                    className="aspect-[4/3]"
                  />
                );
              })}
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">{college.description}</p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {college.flagshipBranches.map((b) => (
                <span
                  key={b}
                  className="text-[11px] font-medium px-2 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-200"
                >
                  {b}
                </span>
              ))}
              <span
                className="text-[11px] font-medium px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-300 ml-auto"
                title="General category, tuition + institute fees across the full program. Excludes hostel & mess."
              >
                Fees {college.fees}
              </span>
            </div>

            <div className="pt-1">
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-orange-400/90 mb-2">
                Connectivity &amp; Climate
              </h4>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex gap-3">
                <span aria-hidden className="text-zinc-500 shrink-0 w-14 font-medium">Road</span>
                <span className="leading-relaxed">{college.connectivity.road}</span>
              </div>
              <div className="flex gap-3">
                <span aria-hidden className="text-zinc-500 shrink-0 w-14 font-medium">Rail</span>
                <span className="leading-relaxed">{college.connectivity.rail}</span>
              </div>
              <div className="flex gap-3">
                <span aria-hidden className="text-zinc-500 shrink-0 w-14 font-medium">Air</span>
                <span className="leading-relaxed">{college.connectivity.air}</span>
              </div>
              <div className="flex gap-3 pt-1">
                <span aria-hidden className="text-zinc-500 shrink-0 w-14 font-medium">Climate</span>
                <span className="leading-relaxed">{college.climate}</span>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
