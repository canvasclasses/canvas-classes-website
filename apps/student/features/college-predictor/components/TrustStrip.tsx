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
      className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-11 mx-auto max-w-5xl"
      style={{
        padding: '22px 8px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {ITEMS.map((it, i) => (
        <div
          key={it.kpi}
          className="text-center"
          style={{
            padding: '0 20px',
            borderRight: i < ITEMS.length - 1 ? '1px dashed rgba(255,255,255,0.06)' : 'none',
          }}
        >
          <div
            className="text-white"
            style={{
              fontFamily: "'Space Grotesk', system-ui, sans-serif",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {it.kpi}
          </div>
          <div style={{ color: '#7d7d88', fontSize: 12, marginTop: 4, letterSpacing: '0.01em' }}>
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}
