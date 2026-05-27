// Hero trust strip — 4 KPI columns separated by dashed verticals.
// From the Claude Design handoff bundle. Replaced the design's mock
// stats ("84,392 predictions run this week") with honest figures we
// can actually defend from the validation harness.

const ITEMS = [
  { kpi: '9 yrs', label: 'BITSAT data we ingest end-to-end' },
  { kpi: '5 yrs', label: 'JoSAA cutoffs (2020–2024)' },
  { kpi: '90.5%', label: 'Safe-bucket hit rate, hindsight tested' },
  { kpi: '100%', label: 'free during JEE 2026' },
];

export default function TrustStrip() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-6 md:mt-11 mx-auto max-w-5xl py-3 md:py-[22px] px-2"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {ITEMS.map((it, i) => (
        <div
          key={it.kpi}
          className="text-center px-2 md:px-5"
          style={{
            // Only show vertical dashed dividers when the cell isn't last in
            // its row. On mobile (2 cols) that means the right border drops
            // on every even-indexed cell; on desktop (4 cols) only the last.
            borderRight: i < ITEMS.length - 1 ? '1px dashed rgba(255,255,255,0.06)' : 'none',
          }}
        >
          <div
            className="text-white text-[19px] md:text-[28px]"
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontWeight: 700,
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1.1,
            }}
          >
            {it.kpi}
          </div>
          <div
            className="text-[10.5px] md:text-[12px] mt-0.5 md:mt-1"
            style={{ color: '#7d7d88', letterSpacing: '0.01em', lineHeight: 1.35 }}
          >
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}
