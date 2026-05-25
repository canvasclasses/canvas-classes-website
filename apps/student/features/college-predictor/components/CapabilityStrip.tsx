// 4-icon capability strip rendered between the hero and the predictor form.
// Two roles:
//   1. Onboarding — a first-time visitor instantly sees the full surface
//      (predict → list → share → drop-year) rather than just the form.
//   2. Anchor links — clicking each tile scrolls to the relevant section.
//
// Pure presentational. No state, no client behaviour beyond the smooth-scroll
// anchors, so we can stay a server component.

interface Capability {
  emoji: string;
  title: string;
  body: string;
  /** Anchor name on the page. The form/results host these targets. */
  anchor: string;
}

const CAPABILITIES: Capability[] = [
  {
    emoji: '🎯',
    title: 'Predict',
    body: 'Safe / Target / Reach colleges from your rank or BITSAT score.',
    anchor: '#predictor',
  },
  {
    emoji: '🧩',
    title: 'Build a smart choice list',
    body: 'JoSAA-ready list with moonshots at top, safety nets at bottom.',
    anchor: '#predictor',
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'Share with parents',
    body: 'WhatsApp-ready image card or plain-English Parent view.',
    anchor: '#predictor',
  },
  {
    emoji: '🔄',
    title: 'Drop-year analysis',
    body: 'See the realistic range of outcomes if you took another year of prep.',
    anchor: '#predictor',
  },
];

export default function CapabilityStrip() {
  return (
    <section
      aria-label="What this tool can do"
      className="mb-8 mx-auto max-w-5xl"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CAPABILITIES.map((c) => (
          <a
            key={c.title}
            href={c.anchor}
            className="group flex flex-col gap-2 p-4 rounded-xl bg-[#0B0F15] border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/[0.03] transition-colors"
          >
            <div className="text-2xl leading-none" aria-hidden>{c.emoji}</div>
            <div className="text-sm font-semibold text-white group-hover:text-orange-300 transition-colors">
              {c.title}
            </div>
            <div className="text-[11px] text-zinc-400 leading-snug">{c.body}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
