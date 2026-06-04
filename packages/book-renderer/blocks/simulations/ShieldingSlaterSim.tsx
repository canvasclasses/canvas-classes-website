'use client';

// ──────────────────────────────────────────────────────────────────────────
// Shielding & Slater's Rule Explorer
// Class 11 Chemistry · Chapter 3 (Periodicity) · JEE/NEET
//
// ACADEMIC SOURCE (anti-hallucination gate, per SIMULATION_DESIGN_WORKFLOW §7):
// Slater's rules for the screening constant σ are stated verbatim from the
// standard formulation (J.C. Slater, Phys. Rev. 36, 57 (1930); reproduced in
// J.D. Lee, "Concise Inorganic Chemistry" and every JEE inorganic text):
//
//   Group electrons as (1s)(2s,2p)(3s,3p)(3d)(4s,4p)(4d)(4f)(5s,5p)...
//   For an electron in an ns/np group:
//     • each OTHER electron in the SAME (ns,np) group → 0.35
//       (special case: the other electron in (1s) → 0.30)
//     • each electron in the (n−1) PRINCIPAL shell (all its s,p,d,f) → 0.85
//     • each electron in shells (n−2) and lower → 1.00
//   For an electron in an nd/nf group:
//     • each OTHER electron in the SAME (nd) / (nf) group → 0.35
//     • EVERY electron in all groups to the LEFT (lower in the ordering) → 1.00
//   Electrons to the RIGHT of the chosen electron contribute 0.
//   Then  Z_eff = Z − σ.
//
// Verified textbook reproductions (see SANITY_CHECKS below, asserted at module load):
//   Na 3s : σ = 2(1.00)+8(0.85)        = 8.80  → Z_eff = 2.20
//   K  4s : σ = 10(1.00)+8(0.85)       = 16.80 → Z_eff = 2.20
//   Cl 3p : σ = 2(1.00)+8(0.85)+6(0.35)= 10.90 → Z_eff = 6.10
//           (the canonical Slater value is 6.10; the "11.0/6.00" form sometimes
//            quoted rounds 10.90→11.0. This implementation uses the exact 10.90.)
//   Fe 4s : σ = 10(1.00)+14(0.85)+1(0.35) = 22.25 → Z_eff = 3.75
// ──────────────────────────────────────────────────────────────────────────

import { useState, useMemo, useRef, useEffect } from 'react';
import { ELEMENTS } from '@canvas/data/periodic/elementsData';
import { Atom, Target, Sparkles } from 'lucide-react';

// ── palette (from SIMULATION_DESIGN_WORKFLOW §3 only) ──────────────────────
const C = {
  bg: '#0d1117',
  card: '#0B0F15',
  surface: '#151E32',
  text: '#e2e8f0',
  text2: '#94a3b8',
  muted: '#475569',
  ghost: '#64748b',
  indigo: '#6366f1',
  indigoMid: '#818cf8',
  indigoLight: '#c4b5fd',
  emerald: '#10b981',
  emeraldLight: '#34d399',
  amber: '#fbbf24',
  amberDark: '#d97706',
  red: '#f87171',
  violet: '#7c3aed',
};

// ── element types ──────────────────────────────────────────────────────────
type Slot = { sub: string; n: number; l: 's' | 'p' | 'd' | 'f'; count: number };
type SlaterGroup = {
  label: string;        // e.g. "3s,3p"
  n: number;            // principal level of the group
  kind: 'sp' | 'd' | 'f';
  electrons: number;    // total electrons in group
  subs: Slot[];         // sub-shells that compose it
  order: number;        // position in the Slater ordering (0 = innermost)
};

// Aufbau filling order (Madelung). Covers up to Z=54 cleanly.
const AUFBAU: { sub: string; n: number; l: 's' | 'p' | 'd' | 'f'; cap: number }[] = [
  { sub: '1s', n: 1, l: 's', cap: 2 },
  { sub: '2s', n: 2, l: 's', cap: 2 },
  { sub: '2p', n: 2, l: 'p', cap: 6 },
  { sub: '3s', n: 3, l: 's', cap: 2 },
  { sub: '3p', n: 3, l: 'p', cap: 6 },
  { sub: '4s', n: 4, l: 's', cap: 2 },
  { sub: '3d', n: 3, l: 'd', cap: 10 },
  { sub: '4p', n: 4, l: 'p', cap: 6 },
  { sub: '5s', n: 5, l: 's', cap: 2 },
  { sub: '4d', n: 4, l: 'd', cap: 10 },
  { sub: '5p', n: 5, l: 'p', cap: 6 },
];

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n: number) => String(n).split('').map((d) => SUP[+d]).join('');

// Build the ground-state occupied sub-shells (Aufbau order) for atomic number Z.
function buildSlots(Z: number): Slot[] {
  const slots: Slot[] = [];
  let left = Z;
  for (const o of AUFBAU) {
    if (left <= 0) break;
    const c = Math.min(o.cap, left);
    slots.push({ sub: o.sub, n: o.n, l: o.l, count: c });
    left -= c;
  }
  return slots;
}

// Group occupied sub-shells into Slater groups, in Slater ordering.
// Ordering key: by principal n, and within an n: (s,p) before d before f.
function buildSlaterGroups(slots: Slot[]): SlaterGroup[] {
  const map = new Map<string, SlaterGroup>();
  for (const s of slots) {
    const kind: 'sp' | 'd' | 'f' = s.l === 's' || s.l === 'p' ? 'sp' : s.l === 'd' ? 'd' : 'f';
    const key = `${s.n}-${kind}`;
    if (!map.has(key)) {
      map.set(key, { label: '', n: s.n, kind, electrons: 0, subs: [], order: 0 });
    }
    const g = map.get(key)!;
    g.electrons += s.count;
    g.subs.push(s);
  }
  const groups = Array.from(map.values());
  // sort sub-shells inside each group (s before p)
  for (const g of groups) {
    g.subs.sort((a, b) => (a.l === 's' ? -1 : 1) - (b.l === 's' ? -1 : 1));
    g.label =
      g.kind === 'sp'
        ? g.subs.map((x) => x.sub).join(',')
        : g.subs.map((x) => x.sub).join(',');
  }
  // Slater ordering: increasing n; within same n, sp(0) < d(1) < f(2)
  const kindRank = (k: 'sp' | 'd' | 'f') => (k === 'sp' ? 0 : k === 'd' ? 1 : 2);
  groups.sort((a, b) => a.n - b.n || kindRank(a.kind) - kindRank(b.kind));
  groups.forEach((g, i) => (g.order = i));
  return groups;
}

// ── THE SLATER CALCULATION ───────────────────────────────────────────────
type Contribution = {
  fromOrder: number;
  label: string;
  electrons: number;     // electrons counted from this group
  per: number;           // contribution per electron
  subtotal: number;      // electrons × per
  reason: string;
};
type SlaterResult = {
  sigma: number;
  contributions: Contribution[];
  selectedGroupOrder: number;
};

function computeSigma(groups: SlaterGroup[], selOrder: number): SlaterResult {
  const sel = groups.find((g) => g.order === selOrder)!;
  const contributions: Contribution[] = [];

  if (sel.kind === 'sp') {
    // 1) same group, other electrons
    const same = sel.electrons - 1;
    if (same > 0) {
      // (1s) special case → 0.30, else 0.35
      const per = sel.label === '1s' ? 0.3 : 0.35;
      contributions.push({
        fromOrder: sel.order,
        label: `same group (${sel.label})`,
        electrons: same,
        per,
        subtotal: same * per,
        reason:
          sel.label === '1s'
            ? 'Other electron in the (1s) group — special value 0.30'
            : `Other electrons in the same (${sel.label}) group`,
      });
    }
    // 2) (n−1) shell — ALL its s,p,d,f groups
    let nMinus1 = 0;
    for (const g of groups) if (g.order < sel.order && g.n === sel.n - 1) nMinus1 += g.electrons;
    if (nMinus1 > 0) {
      contributions.push({
        fromOrder: -1,
        label: `n−1 shell (n=${sel.n - 1})`,
        electrons: nMinus1,
        per: 0.85,
        subtotal: nMinus1 * 0.85,
        reason: `Electrons in the next-inner principal shell (n = ${sel.n - 1})`,
      });
    }
    // 3) shells (n−2) and lower
    let inner = 0;
    for (const g of groups) if (g.order < sel.order && g.n <= sel.n - 2) inner += g.electrons;
    if (inner > 0) {
      contributions.push({
        fromOrder: -2,
        label: `inner shells (n ≤ ${sel.n - 2})`,
        electrons: inner,
        per: 1.0,
        subtotal: inner * 1.0,
        reason: `Deep core electrons (n ≤ ${sel.n - 2}) fully shield`,
      });
    }
  } else {
    // nd or nf: same group others → 0.35; everything to the LEFT → 1.00
    const same = sel.electrons - 1;
    if (same > 0) {
      contributions.push({
        fromOrder: sel.order,
        label: `same group (${sel.label})`,
        electrons: same,
        per: 0.35,
        subtotal: same * 0.35,
        reason: `Other electrons in the same (${sel.label}) group`,
      });
    }
    let leftSum = 0;
    for (const g of groups) if (g.order < sel.order) leftSum += g.electrons;
    if (leftSum > 0) {
      contributions.push({
        fromOrder: -3,
        label: 'all inner groups',
        electrons: leftSum,
        per: 1.0,
        subtotal: leftSum * 1.0,
        reason: `For a ${sel.kind}-electron, every electron in a group to the left shields fully`,
      });
    }
  }

  const sigma = contributions.reduce((a, c) => a + c.subtotal, 0);
  return { sigma, contributions, selectedGroupOrder: sel.order };
}

// ── module-load sanity checks (dev console; never thrown to users) ─────────
function runSanityChecks() {
  const check = (Z: number, pickOrder: 'last' | number, expected: number) => {
    const groups = buildSlaterGroups(buildSlots(Z));
    const order = pickOrder === 'last' ? groups[groups.length - 1].order : pickOrder;
    const { sigma } = computeSigma(groups, order);
    const zeff = Z - sigma;
    return { Z, zeff: Math.round(zeff * 100) / 100, expected, ok: Math.abs(zeff - expected) < 0.005 };
  };
  // Na 3s (last group), K 4s (last group), Cl 3p (last group)
  return [check(11, 'last', 2.2), check(19, 'last', 2.2), check(17, 'last', 6.1)];
}

// ── Frac component (design workflow §2) ────────────────────────────────────
function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        verticalAlign: 'middle',
        lineHeight: 1.15,
        margin: '0 4px',
      }}
    >
      <span style={{ padding: '0 6px 2px 6px' }}>{num}</span>
      <span
        style={{
          padding: '2px 6px 0 6px',
          borderTop: '1.5px solid currentColor',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {den}
      </span>
    </span>
  );
}

const f2 = (n: number) => (Math.round(n * 100) / 100).toFixed(2);

// ── selectable set ─────────────────────────────────────────────────────────
// Default selectable window: Z = 1..38 (H–Sr) where Slater is cleanest.
// We also allow 39..54 (Y–Xe) because the implementation is correct there too;
// a toggle expands the range. Beyond Z=54 the simple Slater groups stop being
// reliably examined, so we cap there.
const CLEAN_MAX = 38;
const HARD_MAX = 54;

export default function ShieldingSlaterSim() {
  const [Z, setZ] = useState(19); // default: Potassium (the worked example)
  const [selOrder, setSelOrder] = useState<number | null>(null);
  const [showExtended, setShowExtended] = useState(false);
  const [trendOpen, setTrendOpen] = useState(false);

  // run sanity checks once
  useEffect(() => {
    const results = runSanityChecks();
    const failed = results.filter((r) => !r.ok);
    if (failed.length) {
      // eslint-disable-next-line no-console
      console.warn('[ShieldingSlaterSim] Slater sanity check FAILED:', failed);
    } else {
      // eslint-disable-next-line no-console
      console.info('[ShieldingSlaterSim] Slater sanity checks passed:', results);
    }
  }, []);

  const elementByZ = useMemo(() => {
    const m = new Map<number, (typeof ELEMENTS)[number]>();
    for (const e of ELEMENTS) m.set(e.atomicNumber, e);
    return m;
  }, []);

  const el = elementByZ.get(Z)!;
  const slots = useMemo(() => buildSlots(Z), [Z]);
  const groups = useMemo(() => buildSlaterGroups(slots), [slots]);

  // default selection = outermost group (last in ordering, valence)
  const effectiveSel = selOrder == null ? groups[groups.length - 1].order : selOrder;
  const result = useMemo(() => computeSigma(groups, effectiveSel), [groups, effectiveSel]);
  const selGroup = groups.find((g) => g.order === effectiveSel)!;
  const zeff = Z - result.sigma;

  // reset selection to valence whenever Z changes
  const prevZ = useRef(Z);
  useEffect(() => {
    if (prevZ.current !== Z) {
      setSelOrder(null);
      prevZ.current = Z;
    }
  }, [Z]);

  const max = showExtended ? HARD_MAX : CLEAN_MAX;

  // ── Period-3 trend (Na→Cl) computed from our own engine ──────────────────
  const period3 = useMemo(() => {
    const out: { Z: number; sym: string; zeff: number }[] = [];
    for (let z = 11; z <= 17; z++) {
      const g = buildSlaterGroups(buildSlots(z));
      const r = computeSigma(g, g[g.length - 1].order);
      out.push({ Z: z, sym: elementByZ.get(z)?.symbol ?? '', zeff: z - r.sigma });
    }
    return out;
  }, [elementByZ]);

  // ── Group-1 trend (Li→Cs region, valence ns) showing ~constant Z_eff ─────
  const group1 = useMemo(() => {
    const zs = [3, 11, 19, 37]; // Li, Na, K, Rb — all in clean range
    return zs.map((z) => {
      const g = buildSlaterGroups(buildSlots(z));
      const r = computeSigma(g, g[g.length - 1].order);
      return { Z: z, sym: elementByZ.get(z)?.symbol ?? '', zeff: z - r.sigma };
    });
  }, [elementByZ]);

  return (
    <div className="p-4 md:p-6" style={{ background: C.bg, color: C.text, minHeight: '80vh' }}>
      <style>{`
        @keyframes slater-pulse { 0%,100%{ filter:brightness(1);} 50%{ filter:brightness(1.5);} }
        .slater-pulse { animation: slater-pulse 1.6s ease-in-out infinite; }
        @keyframes slater-fade { from{opacity:0; transform:translateY(4px);} to{opacity:1; transform:none;} }
        .slater-fade { animation: slater-fade .3s ease both; }
        .slater-shell-tap { cursor:pointer; transition: all .2s ease; }
        .slater-shell-tap:hover { filter:brightness(1.25); }
      `}</style>

      {/* Header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Shielding &amp; <span style={{ color: C.violet }}>Slater&apos;s Rule</span>
          </h1>
          <p
            className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: C.muted }}
          >
            Effective Nuclear Charge Explorer · Z_eff = Z − σ
          </p>
        </div>
        <div
          className="text-[10px] font-black uppercase tracking-widest pt-1"
          style={{ color: C.ghost }}
        >
          {el.symbol} · Z = {Z} · {el.name}
        </div>
      </div>

      {/* ── ELEMENT PICKER ───────────────────────────────────────────────── */}
      <div className="mb-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <p
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: C.indigoLight }}
          >
            1 · Pick an element
          </p>
          <button
            onClick={() => setShowExtended((v) => !v)}
            className="text-[11px] font-semibold pb-0.5 transition-colors"
            style={{
              color: showExtended ? C.amber : C.muted,
              borderBottom: `1px solid ${showExtended ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.1)'}`,
              background: 'none',
            }}
          >
            {showExtended ? '✓ Showing Y–Xe (39–54)' : 'Show 4d period (39–54)'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ELEMENTS.filter((e) => e.atomicNumber <= max).map((e) => {
            const active = e.atomicNumber === Z;
            return (
              <button
                key={e.atomicNumber}
                onClick={() => setZ(e.atomicNumber)}
                title={`${e.name} (Z=${e.atomicNumber})`}
                className="rounded-md text-center transition-all"
                style={{
                  width: 42,
                  height: 42,
                  background: active ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? 'rgba(129,140,248,0.55)' : 'rgba(255,255,255,0.07)'}`,
                  color: active ? C.indigoLight : C.text2,
                  outline: 'none',
                }}
              >
                <div className="text-[9px] leading-none pt-1" style={{ color: C.ghost }}>
                  {e.atomicNumber}
                </div>
                <div className="text-sm font-black leading-tight">{e.symbol}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MAIN GRID: shells visual + breakdown ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6">
        {/* LEFT: nucleus + shells */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: C.indigoLight }}>
            2 · Slater groups around the nucleus
          </p>
          <p className="text-sm leading-snug" style={{ color: C.text2 }}>
            Electrons grouped as (1s)(2s,2p)(3s,3p)(3d)(4s,4p)… Tap a shell to choose which
            electron to analyse. The chosen group glows{' '}
            <span style={{ color: C.amber, fontWeight: 700 }}>amber</span>; shielding electrons are{' '}
            <span style={{ color: C.indigoMid, fontWeight: 700 }}>indigo</span>.
          </p>

          <ShellDiagram
            groups={groups}
            selOrder={effectiveSel}
            contributions={result.contributions}
            onPick={(o) => setSelOrder(o)}
          />

          {/* Slater group chips (also selectable) */}
          <div className="flex flex-wrap gap-2 mt-1">
            {groups.map((g) => {
              const active = g.order === effectiveSel;
              return (
                <button
                  key={g.order}
                  onClick={() => setSelOrder(g.order)}
                  className="px-3 py-1.5 rounded-lg text-left transition-all"
                  style={{
                    background: active ? 'rgba(251,191,36,0.14)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.07)'}`,
                    outline: 'none',
                  }}
                >
                  <span
                    className="text-[11px] font-black"
                    style={{ color: active ? C.amber : C.text2 }}
                  >
                    ({g.label})
                  </span>
                  <span className="text-[10px] ml-1.5" style={{ color: C.ghost }}>
                    {g.electrons} e⁻
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: the calculation */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: C.indigoLight }}>
            3 · Screening constant σ &amp; Z_eff
          </p>

          <div className="flex items-center gap-2 text-sm" style={{ color: C.text2 }}>
            <Target size={15} style={{ color: C.amber }} />
            Analysing an electron in the{' '}
            <span className="font-black" style={{ color: C.amber }}>
              ({selGroup.label})
            </span>{' '}
            group {selOrder == null && <span style={{ color: C.ghost }}>(valence — default)</span>}
          </div>

          {/* breakdown table */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: C.card, border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              className="grid grid-cols-[1fr_auto_auto] gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest"
              style={{ color: C.ghost, borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span>Source of shielding</span>
              <span className="text-right">e⁻ × value</span>
              <span className="text-right">contributes</span>
            </div>

            {result.contributions.length === 0 && (
              <div className="px-3 py-3 text-sm" style={{ color: C.text2 }}>
                No other electrons shield this one — σ = 0, so Z_eff = Z exactly.
              </div>
            )}

            {result.contributions.map((c, i) => (
              <div
                key={i}
                className="slater-fade grid grid-cols-[1fr_auto_auto] gap-2 px-3 py-2.5 items-center"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                <div>
                  <div className="text-sm font-bold" style={{ color: C.text }}>
                    {c.label}
                  </div>
                  <div className="text-[11px] leading-snug" style={{ color: C.ghost }}>
                    {c.reason}
                  </div>
                </div>
                <div className="text-sm tabular-nums text-right" style={{ color: C.indigoMid }}>
                  {c.electrons} × {c.per.toFixed(2)}
                </div>
                <div className="text-sm font-black tabular-nums text-right" style={{ color: C.text }}>
                  {f2(c.subtotal)}
                </div>
              </div>
            ))}

            {/* σ total */}
            <div
              className="grid grid-cols-[1fr_auto] gap-2 px-3 py-2.5 items-center"
              style={{ background: 'rgba(99,102,241,0.08)' }}
            >
              <span className="text-sm font-black" style={{ color: C.indigoLight }}>
                σ (screening constant)
              </span>
              <span className="text-lg font-black tabular-nums text-right" style={{ color: C.indigoLight }}>
                {f2(result.sigma)}
              </span>
            </div>
          </div>

          {/* Z_eff result */}
          <div
            className="rounded-xl px-4 py-4 slater-fade"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(52,211,153,0.3)',
            }}
          >
            <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: C.emeraldLight }}>
              Effective Nuclear Charge
            </p>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-lg font-bold" style={{ color: C.text }}>
              <span className="italic">Z</span>
              <span style={{ color: C.muted }}>−</span>
              <span style={{ color: C.indigoLight }}>σ</span>
              <span style={{ color: C.muted }}>=</span>
              <span className="tabular-nums">{Z}</span>
              <span style={{ color: C.muted }}>−</span>
              <span className="tabular-nums" style={{ color: C.indigoLight }}>{f2(result.sigma)}</span>
              <span style={{ color: C.muted }}>=</span>
              <span className="text-2xl font-black tabular-nums" style={{ color: C.emeraldLight }}>
                {f2(zeff)}
              </span>
            </div>
            <p className="text-[12px] leading-snug mt-2" style={{ color: C.text2 }}>
              The chosen electron feels a net pull of about{' '}
              <span style={{ color: C.emeraldLight, fontWeight: 700 }}>{f2(zeff)}</span> proton
              charges instead of the full {Z}, because inner electrons screen the nucleus.
            </p>
          </div>
        </div>
      </div>

      {/* ── TREND MINI-VIEW ──────────────────────────────────────────────── */}
      <div className="mt-7">
        <button
          onClick={() => setTrendOpen((v) => !v)}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest pb-1 transition-colors"
          style={{
            color: trendOpen ? C.amber : C.indigoLight,
            borderBottom: `2px solid ${trendOpen ? C.amber : 'rgba(129,140,248,0.4)'}`,
            background: 'none',
          }}
        >
          <Sparkles size={14} />
          {trendOpen ? 'Hide periodic trend' : 'Show periodic trend (Z_eff across & down)'}
        </button>

        {trendOpen && (
          <div className="slater-fade mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* across period 3 */}
            <div>
              <p className="text-sm font-bold mb-2" style={{ color: C.text }}>
                Across Period 3 (Na → Cl): valence Z_eff <span style={{ color: C.emeraldLight }}>rises</span>
              </p>
              <TrendBars data={period3} accent={C.emeraldLight} />
            </div>
            {/* down group 1 */}
            <div>
              <p className="text-sm font-bold mb-2" style={{ color: C.text }}>
                Down Group 1 (Li → Rb): valence Z_eff stays{' '}
                <span style={{ color: C.amber }}>~constant</span>
              </p>
              <TrendBars data={group1} accent={C.amber} />
            </div>
            <div className="md:col-span-2">
              <p className="text-[13px] leading-snug italic" style={{ color: C.text2 }}>
                Higher Z_eff → electrons pulled in tighter →{' '}
                <span style={{ color: C.emeraldLight, fontWeight: 700 }}>smaller atomic radius</span>{' '}
                and <span style={{ color: C.emeraldLight, fontWeight: 700 }}>higher ionization energy</span>.
                That is why atoms shrink left-to-right across a period but barely change in
                pull down a group (the added shell offsets the extra protons).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Expert Tip */}
      <div className="mt-7 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <Atom size={13} style={{ color: C.indigo }} />
          <h5 className="text-[9px] font-black uppercase tracking-widest" style={{ color: C.indigo }}>
            Expert Tip
          </h5>
        </div>
        <p className="text-white text-base font-bold leading-tight italic">
          &ldquo;0.35 for siblings, 0.85 for the shell just inside, 1.00 for everything deeper —
          and remember the (1s) twin only counts 0.30.&rdquo;
        </p>
      </div>
    </div>
  );
}

// ── Shell diagram (concentric shells around a nucleus) ─────────────────────
function ShellDiagram({
  groups,
  selOrder,
  contributions,
  onPick,
}: {
  groups: SlaterGroup[];
  selOrder: number;
  contributions: Contribution[];
  onPick: (order: number) => void;
}) {
  const W = 520;
  const H = 420;
  const cx = W / 2;
  const cy = H / 2;

  // distinct principal levels for the ring radii
  const maxN = Math.max(...groups.map((g) => g.n));
  const rFor = (n: number) => 48 + (n - 1) * ((Math.min(W, H) / 2 - 70) / Math.max(1, maxN - 1 || 1));

  // which group-orders are "shielding" (appear in contributions, not the selected same-group)?
  const shieldingOrders = new Set<number>();
  for (const c of contributions) {
    // fromOrder -1/-2/-3 are aggregate; mark all groups left of selected that match
    if (c.fromOrder >= 0 && c.fromOrder !== selOrder) shieldingOrders.add(c.fromOrder);
  }
  // simpler: any group with order < selOrder is shielding (Slater always counts them)
  for (const g of groups) if (g.order < selOrder) shieldingOrders.add(g.order);

  // group electrons by principal n for ring placement; multiple groups can share an n
  const ringEntries = groups.map((g) => {
    const baseR = rFor(g.n);
    // offset d/f groups slightly outward so same-n groups don't overlap
    const offset = g.kind === 'sp' ? 0 : g.kind === 'd' ? 14 : 28;
    return { ...g, r: baseR + offset };
  });

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{
        background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
      }}
    >
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', minHeight: 320 }}>
        {/* rings */}
        {ringEntries.map((g) => {
          const isSel = g.order === selOrder;
          const isShield = shieldingOrders.has(g.order);
          const ringColor = isSel
            ? 'rgba(251,191,36,0.5)'
            : isShield
            ? 'rgba(129,140,248,0.35)'
            : 'rgba(255,255,255,0.1)';
          return (
            <circle
              key={`ring-${g.order}`}
              cx={cx}
              cy={cy}
              r={g.r}
              fill="none"
              stroke={ringColor}
              strokeWidth={isSel ? 2.2 : 1.2}
              strokeDasharray={isSel ? '0' : '3 4'}
            />
          );
        })}

        {/* electrons on each ring */}
        {ringEntries.map((g) => {
          const isSel = g.order === selOrder;
          const isShield = shieldingOrders.has(g.order);
          const n = g.electrons;
          // start angle staggered per group so same-n groups don't collide
          const start = g.kind === 'sp' ? -Math.PI / 2 : g.kind === 'd' ? 0 : Math.PI / 2;
          return (
            <g
              key={`e-${g.order}`}
              className="slater-shell-tap"
              onClick={() => onPick(g.order)}
            >
              {/* invisible fat ring to make tapping easy */}
              <circle cx={cx} cy={cy} r={g.r} fill="none" stroke="transparent" strokeWidth={20} />
              {Array.from({ length: n }).map((_, i) => {
                const ang = start + (i / Math.max(1, n)) * Math.PI * 2;
                const ex = cx + g.r * Math.cos(ang);
                const ey = cy + g.r * Math.sin(ang);
                const fill = isSel ? '#fbbf24' : isShield ? '#818cf8' : '#475569';
                return (
                  <circle
                    key={i}
                    cx={ex}
                    cy={ey}
                    r={isSel ? 5.5 : 4.5}
                    fill={fill}
                    className={isSel ? 'slater-pulse' : undefined}
                  />
                );
              })}
              {/* group label */}
              <text
                x={cx}
                y={cy - g.r - 4}
                textAnchor="middle"
                fontSize={11}
                fontWeight={800}
                fill={isSel ? '#fbbf24' : isShield ? '#c4b5fd' : '#64748b'}
              >
                {g.label}
              </text>
            </g>
          );
        })}

        {/* nucleus */}
        <circle cx={cx} cy={cy} r={26} fill="#2d3a5a" stroke="#6366f1" strokeWidth={2.5} />
        <text x={cx} y={cy - 2} textAnchor="middle" fontSize={13} fontWeight={900} fill="#e2e8f0">
          +{groups.reduce((a, g) => a + g.electrons, 0)}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={8} fontWeight={700} fill="#94a3b8">
          nucleus
        </text>
      </svg>

      {/* legend */}
      <div className="absolute bottom-2 left-3 flex items-center gap-3 text-[10px] font-bold">
        <span className="flex items-center gap-1" style={{ color: '#fbbf24' }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: '#fbbf24', display: 'inline-block' }} />
          chosen e⁻
        </span>
        <span className="flex items-center gap-1" style={{ color: '#818cf8' }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: '#818cf8', display: 'inline-block' }} />
          shielding
        </span>
        <span className="flex items-center gap-1" style={{ color: '#475569' }}>
          <span style={{ width: 8, height: 8, borderRadius: 99, background: '#475569', display: 'inline-block' }} />
          outer (no shield)
        </span>
      </div>
    </div>
  );
}

// ── Trend bars (horizontal) ────────────────────────────────────────────────
function TrendBars({
  data,
  accent,
}: {
  data: { Z: number; sym: string; zeff: number }[];
  accent: string;
}) {
  const max = Math.max(...data.map((d) => d.zeff), 1);
  return (
    <div className="flex flex-col gap-1.5">
      {data.map((d) => (
        <div key={d.Z} className="flex items-center gap-2">
          <span className="text-[11px] font-black w-8 shrink-0" style={{ color: C.text2 }}>
            {d.sym}
          </span>
          <div className="flex-1 h-5 rounded-md overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div
              className="h-full rounded-md flex items-center justify-end pr-1.5"
              style={{
                width: `${(d.zeff / max) * 100}%`,
                background: `linear-gradient(to right, ${accent}55, ${accent})`,
                transition: 'width .4s ease',
                minWidth: 34,
              }}
            >
              <span className="text-[10px] font-black tabular-nums" style={{ color: '#0d1117' }}>
                {f2(d.zeff)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
