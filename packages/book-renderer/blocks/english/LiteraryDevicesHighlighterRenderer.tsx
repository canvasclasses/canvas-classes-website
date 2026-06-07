'use client';

import { useState, useMemo } from 'react';
import { LiteraryDevicesHighlighterBlock, LiteraryDevice, DeviceMatch } from '@canvas/data/types/books';

const DEVICE_LABEL: Record<LiteraryDevice, string> = {
  simile: 'Simile',
  metaphor: 'Metaphor',
  personification: 'Personification',
  imagery: 'Imagery',
  alliteration: 'Alliteration',
  rhyme: 'Rhyme',
  symbolism: 'Symbolism',
  hyperbole: 'Hyperbole',
  onomatopoeia: 'Onomatopoeia',
  // Hindi गद्य narrative features — English approximations for the english-mode label
  vyangya: 'Satire',
  virodhabhas: 'Paradox',
  samvadatmakta: 'Dialogue',
  sandeh: 'Suspense',
};

// Devanagari labels used when block.lang === 'hindi' (काव्य अलंकार + गद्य features).
const DEVICE_LABEL_HI: Record<LiteraryDevice, string> = {
  simile: 'उपमा',
  metaphor: 'रूपक',
  personification: 'मानवीकरण',
  imagery: 'चित्रात्मकता',
  alliteration: 'अनुप्रास',
  rhyme: 'तुक',
  symbolism: 'प्रतीक',
  hyperbole: 'अतिशयोक्ति',
  onomatopoeia: 'ध्वन्यात्मकता',
  vyangya: 'व्यंग्य',
  virodhabhas: 'विरोधाभास',
  samvadatmakta: 'संवादात्मकता',
  sandeh: 'संदेह',
};

const DEVICE_COLOR: Record<LiteraryDevice, string> = {
  simile: '#c084fc',
  metaphor: '#f472b6',
  personification: '#fb923c',
  imagery: '#34d399',
  alliteration: '#60a5fa',
  rhyme: '#fbbf24',
  symbolism: '#a78bfa',
  hyperbole: '#f87171',
  onomatopoeia: '#22d3ee',
  vyangya: '#fb7185',
  virodhabhas: '#2dd4bf',
  samvadatmakta: '#818cf8',
  sandeh: '#facc15',
};

export default function LiteraryDevicesHighlighterRenderer({ block, hinglish }: { block: LiteraryDevicesHighlighterBlock; hinglish?: boolean }) {
  const [activeDevice, setActiveDevice] = useState<LiteraryDevice | null>(null);
  const [openExplanation, setOpenExplanation] = useState<DeviceMatch | null>(null);
  const isHindi = block.lang === 'hindi';
  const label = (d: LiteraryDevice) => (isHindi ? DEVICE_LABEL_HI[d] : DEVICE_LABEL[d]);

  // Find every match span in passage for the active device, sorted by start.
  const matchSpans = useMemo(() => {
    if (!activeDevice) return [];
    const dev = block.devices.find((d) => d.device === activeDevice);
    if (!dev) return [];
    type Span = { start: number; end: number; match: DeviceMatch };
    const spans: Span[] = [];
    for (const m of dev.matches) {
      const idx = block.passage.indexOf(m.text);
      if (idx === -1) continue;
      spans.push({ start: idx, end: idx + m.text.length, match: m });
    }
    spans.sort((a, b) => a.start - b.start);
    return spans;
  }, [activeDevice, block]);

  const segments = useMemo(() => {
    if (matchSpans.length === 0) return [{ text: block.passage, match: null as DeviceMatch | null }];
    const out: { text: string; match: DeviceMatch | null }[] = [];
    let cursor = 0;
    for (const s of matchSpans) {
      if (s.start > cursor) out.push({ text: block.passage.slice(cursor, s.start), match: null });
      out.push({ text: block.passage.slice(s.start, s.end), match: s.match });
      cursor = s.end;
    }
    if (cursor < block.passage.length) out.push({ text: block.passage.slice(cursor), match: null });
    return out;
  }, [matchSpans, block.passage]);

  const activeColor = activeDevice ? DEVICE_COLOR[activeDevice] : '#a78bfa';

  return (
    <div className="my-8 rounded-2xl border border-violet-500/15 bg-violet-500/[0.02] px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-violet-400 font-bold">✦</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400/70">
          {isHindi ? 'सौंदर्य पहचानो' : 'Find the Devices'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {block.devices.map((d) => {
          const isActive = activeDevice === d.device;
          const color = DEVICE_COLOR[d.device];
          return (
            <button
              key={d.id}
              onClick={() => {
                setOpenExplanation(null);
                setActiveDevice(isActive ? null : d.device);
              }}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{
                background: isActive ? `${color}25` : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${isActive ? color : 'rgba(255,255,255,0.08)'}`,
                color: isActive ? color : 'rgba(255,255,255,0.55)',
              }}
            >
              {label(d.device)}
              <span className="ml-1.5 text-[10px]" style={{ opacity: 0.7 }}>
                {d.matches.length}
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="rounded-xl p-4 text-[16px] leading-[1.85] font-serif"
        style={{ background: 'rgba(0,0,0,0.2)', color: 'rgba(255,255,255,0.85)' }}
      >
        {segments.map((seg, i) =>
          seg.match ? (
            <button
              key={i}
              type="button"
              onClick={() => setOpenExplanation(seg.match)}
              className="inline"
              style={{
                background: `${activeColor}28`,
                color: activeColor,
                fontWeight: 600,
                padding: '1px 4px',
                borderRadius: 4,
                cursor: 'pointer',
                border: `1px solid ${activeColor}50`,
                font: 'inherit',
              }}
            >
              {seg.text}
            </button>
          ) : (
            <span key={i}>{seg.text}</span>
          )
        )}
      </div>

      {openExplanation && activeDevice && (
        <div
          className="mt-3 rounded-xl px-4 py-3 text-[14px] leading-relaxed"
          style={{
            background: `${activeColor}12`,
            border: `1px solid ${activeColor}40`,
            color: 'rgba(255,255,255,0.78)',
          }}
        >
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: activeColor }}>
            {label(activeDevice)}
          </div>
          “<span className="italic">{openExplanation.text}</span>” — {hinglish && openExplanation.explanation_hinglish ? openExplanation.explanation_hinglish : openExplanation.explanation}
        </div>
      )}

      {!activeDevice && (
        <p className="text-[12px] mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {isHindi
            ? 'ऊपर किसी विशेषता पर टैप करें — गद्यांश में उसके सभी उदाहरण रेखांकित हो जाएँगे।'
            : 'Tap a device above to highlight every example in the passage.'}
        </p>
      )}
    </div>
  );
}
