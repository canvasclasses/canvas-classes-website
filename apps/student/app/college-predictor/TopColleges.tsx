import Image from 'next/image';
import TopCollegeCard from './TopCollegeCard';
import {
  TOP_COLLEGES,
  TIER_INTROS,
  TIER_ORDER,
  TOP_COLLEGES_HERO,
} from './topCollegesData';

export default function TopColleges() {
  return (
    <section className="mt-20">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          Top engineering colleges in India
        </h2>
        <p className="mt-2 text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Quick facts on the institutes most often chosen by top rankers — what makes each one
          distinctive, how to reach it, and what the weather is like year-round. Tap any college
          to expand.
        </p>
      </div>

      {/* Ultra-wide hero strip */}
      <div className="relative w-full aspect-[16/5] md:aspect-[16/4] rounded-2xl overflow-hidden border border-white/5 bg-[#0B0F15] mb-12">
        {TOP_COLLEGES_HERO ? (
          <Image
            src={TOP_COLLEGES_HERO}
            alt="Top engineering college campus in India"
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-[#151E32] to-[#0B0F15]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        <div className="absolute bottom-4 left-5 md:bottom-6 md:left-7 right-5">
          <p className="text-xs uppercase tracking-wider text-orange-300/80 font-semibold">
            29 campuses · 5 tiers
          </p>
          <p className="mt-1 text-sm md:text-base text-white/90 max-w-xl leading-snug">
            From IIT Bombay's Powai lakes to BITS Pilani's Rajasthan desert — a quick tour of where
            you might spend the next four years.
          </p>
        </div>
      </div>

      {TIER_ORDER.map((tier) => {
        const colleges = TOP_COLLEGES.filter((c) => c.tier === tier);
        if (colleges.length === 0) return null;
        const intro = TIER_INTROS[tier];
        return (
          <div key={tier} className="mb-14 last:mb-0">
            <div className="mb-5">
              <h3 className="text-xl font-semibold text-white">{intro.heading}</h3>
              <p className="mt-1.5 text-sm text-zinc-400 max-w-3xl leading-relaxed">
                {intro.blurb}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {colleges.map((c) => (
                <TopCollegeCard key={c.slug} college={c} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
