'use client';

import { useState, useMemo } from 'react';
import { X, AlertTriangle, ChevronDown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ElementPoint {
  atomicNumber: number;
  symbol: string;
  name: string;
  period: number;
  group: number;
  value: number | null;
  isException: boolean;
  isDBlock: boolean;
}

interface Exception {
  symbol: string;
  title: string;
  explanation: string;
  jeeTag: string;
}

interface Property {
  key: 'atomicRadius' | 'ionizationEnergy' | 'electronAffinity' | 'electronegativity' | 'density';
  label: string;
  unit: string;
  shortLabel: string;
}

// ─── Element roster ───────────────────────────────────────────────────────────

const PERIOD_ELEMENTS: ElementPoint[] = [
  // Period 2
  { atomicNumber: 3,  symbol: 'Li', name: 'Lithium',      period: 2, group: 1,  value: null, isException: false, isDBlock: false },
  { atomicNumber: 4,  symbol: 'Be', name: 'Beryllium',    period: 2, group: 2,  value: null, isException: false, isDBlock: false },
  { atomicNumber: 5,  symbol: 'B',  name: 'Boron',        period: 2, group: 13, value: null, isException: false, isDBlock: false },
  { atomicNumber: 6,  symbol: 'C',  name: 'Carbon',       period: 2, group: 14, value: null, isException: false, isDBlock: false },
  { atomicNumber: 7,  symbol: 'N',  name: 'Nitrogen',     period: 2, group: 15, value: null, isException: true,  isDBlock: false },
  { atomicNumber: 8,  symbol: 'O',  name: 'Oxygen',       period: 2, group: 16, value: null, isException: true,  isDBlock: false },
  { atomicNumber: 9,  symbol: 'F',  name: 'Fluorine',     period: 2, group: 17, value: null, isException: true,  isDBlock: false },
  { atomicNumber: 10, symbol: 'Ne', name: 'Neon',         period: 2, group: 18, value: null, isException: false, isDBlock: false },
  // Period 3
  { atomicNumber: 11, symbol: 'Na', name: 'Sodium',       period: 3, group: 1,  value: null, isException: false, isDBlock: false },
  { atomicNumber: 12, symbol: 'Mg', name: 'Magnesium',    period: 3, group: 2,  value: null, isException: false, isDBlock: false },
  { atomicNumber: 13, symbol: 'Al', name: 'Aluminium',    period: 3, group: 13, value: null, isException: false, isDBlock: false },
  { atomicNumber: 14, symbol: 'Si', name: 'Silicon',      period: 3, group: 14, value: null, isException: false, isDBlock: false },
  { atomicNumber: 15, symbol: 'P',  name: 'Phosphorus',   period: 3, group: 15, value: null, isException: true,  isDBlock: false },
  { atomicNumber: 16, symbol: 'S',  name: 'Sulfur',       period: 3, group: 16, value: null, isException: true,  isDBlock: false },
  { atomicNumber: 17, symbol: 'Cl', name: 'Chlorine',     period: 3, group: 17, value: null, isException: false, isDBlock: false },
  { atomicNumber: 18, symbol: 'Ar', name: 'Argon',        period: 3, group: 18, value: null, isException: false, isDBlock: false },
  // Period 4
  { atomicNumber: 19, symbol: 'K',  name: 'Potassium',    period: 4, group: 1,  value: null, isException: false, isDBlock: false },
  { atomicNumber: 20, symbol: 'Ca', name: 'Calcium',      period: 4, group: 2,  value: null, isException: false, isDBlock: false },
  { atomicNumber: 21, symbol: 'Sc', name: 'Scandium',     period: 4, group: 3,  value: null, isException: false, isDBlock: true  },
  { atomicNumber: 22, symbol: 'Ti', name: 'Titanium',     period: 4, group: 4,  value: null, isException: false, isDBlock: true  },
  { atomicNumber: 23, symbol: 'V',  name: 'Vanadium',     period: 4, group: 5,  value: null, isException: false, isDBlock: true  },
  { atomicNumber: 24, symbol: 'Cr', name: 'Chromium',     period: 4, group: 6,  value: null, isException: true,  isDBlock: true  },
  { atomicNumber: 25, symbol: 'Mn', name: 'Manganese',    period: 4, group: 7,  value: null, isException: false, isDBlock: true  },
  { atomicNumber: 26, symbol: 'Fe', name: 'Iron',         period: 4, group: 8,  value: null, isException: false, isDBlock: true  },
  { atomicNumber: 27, symbol: 'Co', name: 'Cobalt',       period: 4, group: 9,  value: null, isException: false, isDBlock: true  },
  { atomicNumber: 28, symbol: 'Ni', name: 'Nickel',       period: 4, group: 10, value: null, isException: false, isDBlock: true  },
  { atomicNumber: 29, symbol: 'Cu', name: 'Copper',       period: 4, group: 11, value: null, isException: true,  isDBlock: true  },
  { atomicNumber: 30, symbol: 'Zn', name: 'Zinc',         period: 4, group: 12, value: null, isException: false, isDBlock: true  },
  { atomicNumber: 31, symbol: 'Ga', name: 'Gallium',      period: 4, group: 13, value: null, isException: true,  isDBlock: false },
  { atomicNumber: 32, symbol: 'Ge', name: 'Germanium',    period: 4, group: 14, value: null, isException: false, isDBlock: false },
  { atomicNumber: 33, symbol: 'As', name: 'Arsenic',      period: 4, group: 15, value: null, isException: true,  isDBlock: false },
  { atomicNumber: 34, symbol: 'Se', name: 'Selenium',     period: 4, group: 16, value: null, isException: false, isDBlock: false },
  { atomicNumber: 35, symbol: 'Br', name: 'Bromine',      period: 4, group: 17, value: null, isException: false, isDBlock: false },
  { atomicNumber: 36, symbol: 'Kr', name: 'Krypton',      period: 4, group: 18, value: null, isException: false, isDBlock: false },
];

// ─── Property values ──────────────────────────────────────────────────────────

const PROPERTY_DATA: Record<string, Record<number, number | null>> = {
  atomicRadius: {
    3: 152, 4: 112, 5: 85,  6: 77,  7: 70,  8: 66,  9: 64,  10: 160,
    11: 186, 12: 160, 13: 143, 14: 118, 15: 110, 16: 104, 17: 99, 18: 190,
    19: 227, 20: 197, 21: 164, 22: 147, 23: 135, 24: 129, 25: 137, 26: 126,
    27: 125, 28: 125, 29: 128, 30: 137, 31: 135, 32: 122, 33: 121, 34: 117,
    35: 114, 36: 200,
  },
  ionizationEnergy: {
    3: 520,  4: 899,  5: 801,  6: 1086, 7: 1402, 8: 1314, 9: 1680, 10: 2080,
    11: 496, 12: 737, 13: 577, 14: 786, 15: 1012, 16: 1000, 17: 1256, 18: 1520,
    19: 419, 20: 590, 21: 631, 22: 656, 23: 650, 24: 653, 25: 717, 26: 762,
    27: 758, 28: 736, 29: 745, 30: 906, 31: 579, 32: 762, 33: 947, 34: 941,
    35: 1142, 36: 1351,
  },
  electronAffinity: {
    3: -60,  4: null, 5: -27, 6: -122, 7: 0,   8: -141, 9: -328, 10: 116,
    11: -53, 12: null, 13: -43, 14: -134, 15: 72, 16: -200, 17: -349, 18: 96,
    19: -48, 20: null, 21: null, 22: null, 23: -51, 24: -65, 25: null, 26: -16,
    27: -64, 28: -112, 29: -119, 30: null, 31: -29, 32: -119, 33: -78, 34: -195,
    35: -325, 36: 96,
  },
  electronegativity: {
    3: 0.98, 4: 1.57, 5: 2.04, 6: 2.55, 7: 3.04, 8: 3.44, 9: 3.98, 10: null,
    11: 0.93, 12: 1.31, 13: 1.61, 14: 1.90, 15: 2.19, 16: 2.58, 17: 3.16, 18: null,
    19: 0.82, 20: 1.00, 21: 1.36, 22: 1.54, 23: 1.63, 24: 1.66, 25: 1.55, 26: 1.83,
    27: 1.88, 28: 1.91, 29: 1.90, 30: 1.65, 31: 1.81, 32: 2.01, 33: 2.18, 34: 2.55,
    35: 2.96, 36: 3.00,
  },
  density: {
    3: 0.53, 4: 1.85, 5: 2.35, 6: 2.27, 7: 0.001, 8: 0.001, 9: 0.001, 10: 0.001,
    11: 0.97, 12: 1.74, 13: 2.70, 14: 2.34, 15: 1.82, 16: 2.07, 17: 0.003, 18: 0.002,
    19: 0.86, 20: 1.55, 21: 2.99, 22: 4.51, 23: 6.11, 24: 7.19, 25: 7.43, 26: 7.87,
    27: 8.90, 28: 8.91, 29: 8.96, 30: 7.13, 31: 5.91, 32: 5.32, 33: 5.73, 34: 4.81,
    35: 3.10, 36: 0.004,
  },
};

// ─── Exception data ───────────────────────────────────────────────────────────

const EXCEPTIONS: Record<string, Record<string, Exception>> = {
  ionizationEnergy: {
    B:  { symbol: 'B',  title: 'IE of B < Be (Period 2)',
          explanation: 'Beryllium has a completely filled 2s² subshell — extra stable. Boron\'s lone 2p¹ electron sits at higher energy and is easier to remove despite B having higher Z.',
          jeeTag: 'Fully-filled 2s² stability of Be' },
    O:  { symbol: 'O',  title: 'IE of O < N (Period 2)',
          explanation: 'Nitrogen\'s half-filled 2p³ gives it maximum exchange energy. Oxygen\'s 2p⁴ forces pairing; the repulsion between paired electrons lowers the IE. Most-tested IE exception in JEE.',
          jeeTag: 'Half-filled 2p³ stability of N' },
    Al: { symbol: 'Al', title: 'IE of Al < Mg (Period 3)',
          explanation: 'Magnesium\'s fully-filled 3s² is extra stable. Aluminium\'s lone 3p¹ electron is at higher energy and shielded by both core and 3s electrons — easier to remove.',
          jeeTag: 'Fully-filled 3s² stability of Mg' },
    S:  { symbol: 'S',  title: 'IE of S < P (Period 3)',
          explanation: 'Phosphorus has a half-filled 3p³ — extra stable. Sulfur\'s 3p⁴ forces pairing in one orbital; paired-electron repulsion lowers the IE. Mirror of the N vs O case.',
          jeeTag: 'Half-filled 3p³ stability of P' },
    Cr: { symbol: 'Cr', title: 'Cr: anomalous d-block IE',
          explanation: 'Cr adopts [Ar]3d⁵4s¹ to achieve a half-filled d subshell. The extra stability of d⁵ lowers its IE relative to the expected smooth rise across the d-block.',
          jeeTag: 'Anomalous config: [Ar]3d⁵4s¹' },
    Cu: { symbol: 'Cu', title: 'Cu: anomalous d-block IE',
          explanation: 'Cu adopts [Ar]3d¹⁰4s¹ to achieve a fully-filled d subshell. The lone 4s¹ electron is marginally easier to remove than expected.',
          jeeTag: 'Anomalous config: [Ar]3d¹⁰4s¹' },
    Ga: { symbol: 'Ga', title: 'IE of Ga ≈ Al (Period 4 anomaly)',
          explanation: 'After filling the 3d block, Ga has a much higher Zeff than expected. Poor d-electron shielding makes Ga\'s IE almost the same as Al — breaking the normal downward group trend.',
          jeeTag: 'Poor d-electron shielding at Ga' },
    As: { symbol: 'As', title: 'IE of As > Se (Period 4)',
          explanation: 'Arsenic has a half-filled 4p³ (extra stable). Selenium\'s 4p⁴ has a paired electron lowering IE. Same pattern as N>O and P>S.',
          jeeTag: 'Half-filled 4p³ stability of As' },
  },
  atomicRadius: {
    Mn: { symbol: 'Mn', title: 'Mn radius slightly > Cr',
          explanation: 'At Mn (d⁵4s²), the half-filled d subshell maximises electron-electron repulsion among the 3d electrons, causing a slight radius increase over Cr.',
          jeeTag: 'd⁵ half-filled repulsion' },
    Cu: { symbol: 'Cu', title: 'Cu radius > Ni (d-block upturn)',
          explanation: 'Zeff barely increases Ni→Cu while d-electron repulsion grows. Cu\'s lone 4s¹ sits slightly farther out than Ni\'s paired 4s².',
          jeeTag: 'Fully-filled d¹⁰ + single 4s¹' },
    Zn: { symbol: 'Zn', title: 'Zn radius > Cu',
          explanation: 'Zn (3d¹⁰4s²) has two 4s electrons pushing the outer shell farther out despite higher Z. Full d¹⁰ provides extra shielding.',
          jeeTag: 'Zn: 3d¹⁰4s² — full d shielding' },
    Ga: { symbol: 'Ga', title: 'Ga radius drops sharply from Zn',
          explanation: 'Completing the d-block raises Zeff sharply. Ga\'s poor d-electron shielding means the effective nuclear charge pulls the 4p¹ electron cloud inward much more than expected.',
          jeeTag: 'Poor d-shielding causes Ga contraction' },
    Ne: { symbol: 'Ne', title: 'Ne radius jumps (van der Waals)',
          explanation: 'Noble gases have no covalent bonds. Their radius is the van der Waals radius — intrinsically larger than covalent radii used for other elements. Not a true periodic trend break.',
          jeeTag: 'Van der Waals vs covalent radius' },
    Ar: { symbol: 'Ar', title: 'Ar radius jumps (van der Waals)',
          explanation: 'Same as Ne — Ar\'s radius is van der Waals, not covalent. This discontinuity appears at every noble gas.',
          jeeTag: 'Van der Waals vs covalent radius' },
  },
  electronAffinity: {
    N:  { symbol: 'N',  title: 'EA of N ≈ 0 (Period 2)',
          explanation: 'N has half-filled 2p³ — maximum exchange energy. Adding a 4th electron requires pairing in an occupied orbital, facing strong repulsion. N effectively refuses the extra electron.',
          jeeTag: 'Half-filled 2p³ resists electron addition' },
    F:  { symbol: 'F',  title: 'EA of F < Cl (classic anomaly)',
          explanation: 'F is the most electronegative element yet has lower EA than Cl. Its compact 2p orbitals are crowded — adding an electron causes more repulsion than in Cl\'s larger 3p orbitals.',
          jeeTag: 'Small size → high e⁻ repulsion in F' },
    P:  { symbol: 'P',  title: 'EA of P unusually low',
          explanation: 'P has half-filled 3p³. Adding an electron requires pairing, facing repulsion from existing electrons — same logic as N. EA is positive (endothermic in IUPAC sign convention).',
          jeeTag: 'Half-filled 3p³ resists electron addition' },
    Be: { symbol: 'Be', title: 'EA of Be ≈ 0',
          explanation: 'Fully-filled 2s² — adding an electron requires moving to the higher-energy 2p orbital. Highly unfavourable.',
          jeeTag: 'Fully-filled 2s² stability' },
    Mg: { symbol: 'Mg', title: 'EA of Mg ≈ 0',
          explanation: 'Fully-filled 3s². Extra electron would go into 3p — energetically unfavourable. Near-zero EA.',
          jeeTag: 'Fully-filled 3s² stability' },
  },
  electronegativity: {
    Mn: { symbol: 'Mn', title: 'Mn EN dips vs neighbours',
          explanation: 'Mn\'s half-filled d⁵ gives extra stability, slightly reducing its tendency to attract bonding electrons — causing a minor dip in Pauling EN.',
          jeeTag: 'Half-filled d⁵ at Mn' },
    Cu: { symbol: 'Cu', title: 'Cu EN slightly < Ni',
          explanation: 'Cu\'s anomalous 4s¹ configuration means a higher-energy, more diffuse outer electron — reducing its pull on bonding electrons.',
          jeeTag: 'Anomalous Cu config' },
    Ga: { symbol: 'Ga', title: 'Ga EN close to Al',
          explanation: 'Poor d-electron shielding effects partially cancel the nuclear charge increase, keeping Ga\'s EN unexpectedly similar to Al in Period 3.',
          jeeTag: 'Poor d-shielding at Ga' },
  },
  density: {
    N:  { symbol: 'N',  title: 'N, O, F, Ne: gas-phase density',
          explanation: 'These are gases at room temperature. Their density (~0.001 g/cm³) is for the gas phase — not comparable to solids like Li, Be, B, C on the same chart.',
          jeeTag: 'Gas vs solid phase comparison' },
    Cl: { symbol: 'Cl', title: 'Cl and Ar: gases in Period 3',
          explanation: 'Cl₂ and Ar are gases. Their very low density breaks the trend seen across solid elements — the comparison is cross-phase.',
          jeeTag: 'Gas vs solid — cross-phase comparison' },
    Cr: { symbol: 'Cr', title: 'Density peaks in d-block (Cr→Co)',
          explanation: 'Nuclear charge increases across the d-block while atomic radius stays roughly constant (d electrons shield poorly), so mass/volume rises steadily through Cr→Co.',
          jeeTag: 'D-block: high mass + compact radius' },
  },
};

// ─── Config ───────────────────────────────────────────────────────────────────

const PROPERTIES: Property[] = [
  { key: 'ionizationEnergy',  label: 'Ionization Energy',  shortLabel: 'IE',  unit: 'kJ/mol'  },
  { key: 'atomicRadius',      label: 'Atomic Radius',      shortLabel: 'AR',  unit: 'pm'      },
  { key: 'electronAffinity',  label: 'Electron Affinity',  shortLabel: 'EA',  unit: 'kJ/mol'  },
  { key: 'electronegativity', label: 'Electronegativity',  shortLabel: 'EN',  unit: 'Pauling' },
  { key: 'density',           label: 'Density',            shortLabel: 'ρ',   unit: 'g/cm³'   },
];

const PERIOD_CONFIG = [
  { period: 2, label: 'Period 2', color: '#818cf8', bg: 'bg-indigo-500/10', border: 'border-indigo-500/40', text: 'text-indigo-300' },
  { period: 3, label: 'Period 3', color: '#34d399', bg: 'bg-emerald-500/10', border: 'border-emerald-500/40', text: 'text-emerald-300' },
  { period: 4, label: 'Period 4', color: '#fb923c', bg: 'bg-orange-500/10', border: 'border-orange-500/40', text: 'text-orange-300' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getElementsForPeriod(period: number, propKey: string, showDBlock: boolean): ElementPoint[] {
  const data = PROPERTY_DATA[propKey] || {};
  return PERIOD_ELEMENTS
    .filter(e => e.period === period && (showDBlock || !e.isDBlock))
    .map(e => ({ ...e, value: data[e.atomicNumber] ?? null }));
}

function formatValue(v: number, propKey: string): string {
  if (propKey === 'density') return v < 0.1 ? v.toFixed(4) : v.toFixed(2);
  if (propKey === 'electronegativity') return v.toFixed(2);
  return Math.round(v).toString();
}

// ─── Exception popup ──────────────────────────────────────────────────────────

function ExceptionCard({ exc, onClose }: { exc: Exception; onClose: () => void }) {
  return (
    <div className="mt-3 p-4 rounded-xl bg-[#1a1f2e] border border-amber-500/40 shadow-xl shadow-black/40">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <AlertTriangle size={13} className="text-amber-400" />
          </span>
          <span className="text-sm font-bold text-amber-300">{exc.title}</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 flex-shrink-0">
          <X size={15} />
        </button>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed mb-3 pl-8">{exc.explanation}</p>
      <div className="ml-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">JEE Key</span>
        <span className="text-xs text-amber-200">{exc.jeeTag}</span>
      </div>
    </div>
  );
}

// ─── Chart ────────────────────────────────────────────────────────────────────

interface ChartProps {
  periods: number[];
  property: Property;
  showDBlock: boolean;
}

// Fixed SVG viewBox dimensions — same approach as TrendsComponent
const VB_W = 600;
const VB_H = 375;
const PAD_L = 10;  // left margin inside viewBox (labels float left of this)
const PAD_R = 10;
const PAD_T = 50;  // top — room for value labels above first points
const PAD_B = 50;  // bottom — room for x-axis labels
const PLOT_X0 = PAD_L + 30;
const PLOT_X1 = VB_W - PAD_R;
const PLOT_Y0 = PAD_T;
const PLOT_Y1 = VB_H - PAD_B;
const PLOT_W = PLOT_X1 - PLOT_X0;
const PLOT_H = PLOT_Y1 - PLOT_Y0;

function PeriodLineChart({ periods, property, showDBlock }: ChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ period: number; idx: number } | null>(null);
  const [openException, setOpenException] = useState<{ exc: Exception; periodIdx: number; elIdx: number } | null>(null);

  const series = useMemo(() =>
    periods.map(p => ({
      period: p,
      cfg: PERIOD_CONFIG.find(c => c.period === p)!,
      elements: getElementsForPeriod(p, property.key, showDBlock),
    })),
    [periods, property.key, showDBlock]
  );

  // Global min/max
  const allVals = useMemo(() =>
    series.flatMap(s => s.elements.map(e => e.value)).filter((v): v is number => v !== null),
    [series]
  );

  const rawMin = allVals.length ? Math.min(...allVals) : 0;
  const rawMax = allVals.length ? Math.max(...allVals) : 1;
  const useLog = property.key === 'density';

  const toNorm = (v: number): number => {
    if (useLog) {
      const lmin = Math.log10(Math.max(0.0001, rawMin > 0 ? rawMin : 0.0001));
      const lmax = Math.log10(Math.max(0.001, rawMax));
      return (Math.log10(Math.max(0.0001, v)) - lmin) / (lmax - lmin || 1);
    }
    const pad = (rawMax - rawMin) * 0.12;
    return (v - (rawMin - pad)) / ((rawMax + pad) - (rawMin - pad));
  };

  const toSvgY = (v: number) => PLOT_Y0 + (1 - toNorm(v)) * PLOT_H;

  const excData = EXCEPTIONS[property.key] || {};

  // Build x positions: evenly spread across PLOT_W based on each series' own count
  const getX = (elements: ElementPoint[], idx: number) => {
    if (elements.length <= 1) return PLOT_X0 + PLOT_W / 2;
    return PLOT_X0 + (idx / (elements.length - 1)) * PLOT_W;
  };

  // Determine if a point is a valley (value lower than both neighbours) → label below
  const isValley = (elements: ElementPoint[], idx: number): boolean => {
    const cur = elements[idx].value;
    if (cur === null) return false;
    const prev = elements.slice(0, idx).reverse().find(e => e.value !== null)?.value ?? null;
    const next = elements.slice(idx + 1).find(e => e.value !== null)?.value ?? null;
    return prev !== null && next !== null && cur < prev && cur < next;
  };

  // Grid y values (3 lines like TrendsComponent)
  const gridYs = [PLOT_Y0 + PLOT_H * 0.07, PLOT_Y0 + PLOT_H * 0.5, PLOT_Y0 + PLOT_H * 0.93];

  return (
    <>
      {/* Desktop graph */}
      <div className="hidden md:block relative h-[500px] bg-gray-900/40 rounded-xl border border-gray-700/40 p-5">
        {/* Property name top-left — same as TrendsComponent */}
        <div className="absolute top-3 left-6 text-base text-gray-200 font-bold flex items-center gap-2">
          {property.label}
          <span className="text-sm font-normal text-gray-500">({property.unit})</span>
        </div>

        {/* Period colour key top-right */}
        <div className="absolute top-3 right-6 flex gap-4">
          {series.map(({ period, cfg }) => (
            <div key={period} className="flex items-center gap-1.5">
              <svg width="20" height="4"><line x1="0" y1="2" x2="20" y2="2" stroke={cfg.color} strokeWidth="2.5" strokeLinecap="round" /></svg>
              <span className="text-xs text-gray-400">{cfg.label}</span>
            </div>
          ))}
          {Object.keys(excData).length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-xs text-gray-400">Exception</span>
            </div>
          )}
        </div>

        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-full overflow-visible">
          <defs>
            {series.map(({ period, cfg }) => (
              <linearGradient key={period} id={`grad-p${period}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#f472b6" />
                <stop offset="50%"  stopColor="#fb923c" />
                <stop offset="100%" stopColor="#a3e635" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines */}
          {gridYs.map(y => (
            <line key={y} x1={PLOT_X0} x2={PLOT_X1} y1={y} y2={y}
              stroke="#374151" strokeDasharray="2" strokeWidth="0.5" />
          ))}

          {/* D-block shaded band for Period 4 */}
          {periods.includes(4) && showDBlock && (() => {
            const s = series.find(s => s.period === 4);
            if (!s) return null;
            const dbStart = s.elements.findIndex(e => e.isDBlock);
            const dbEnd = s.elements.reduceRight((acc, e, i) => acc === -1 && e.isDBlock ? i : acc, -1);
            if (dbStart < 0) return null;
            const x0 = getX(s.elements, dbStart) - 8;
            const x1 = getX(s.elements, dbEnd) + 8;
            return (
              <g>
                <rect x={x0} y={PLOT_Y0} width={x1 - x0} height={PLOT_H}
                  fill="rgba(167,139,250,0.05)" stroke="rgba(167,139,250,0.15)"
                  strokeWidth="1" strokeDasharray="4 3" rx="4" />
                <text x={(x0 + x1) / 2} y={PLOT_Y0 - 8} textAnchor="middle"
                  fill="rgba(167,139,250,0.55)" fontSize="9" letterSpacing="1">d-block</text>
              </g>
            );
          })()}

          {/* Lines and points per period */}
          {series.map(({ period, cfg, elements }, si) => {
            const validPts = elements
              .map((e, idx) => ({ e, idx, x: getX(elements, idx), y: e.value !== null ? toSvgY(e.value) : null }))
              .filter(p => p.y !== null) as { e: ElementPoint; idx: number; x: number; y: number }[];

            const pathD = validPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

            return (
              <g key={period}>
                {/* Animated line — same as TrendsComponent */}
                {validPts.length > 1 && (
                  <motion.path
                    key={`${period}-${property.key}`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9 }}
                    d={pathD}
                    fill="none"
                    stroke={`url(#grad-p${period})`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {validPts.map(({ e, idx, x, y }) => {
                  const isHov = hoveredPoint?.period === period && hoveredPoint?.idx === idx;
                  const hasExc = excData[e.symbol] !== undefined;
                  const valley = isValley(elements, idx);
                  const valLabelY = y + (valley ? 22 : -16);
                  const isOpen = openException?.period === period && openException?.elIdx === idx; // unused in SVG but tracked

                  return (
                    <g key={e.atomicNumber}
                      onMouseEnter={() => setHoveredPoint({ period, idx })}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => {
                        if (hasExc) {
                          setOpenException(
                            openException?.exc.symbol === e.symbol
                              ? null
                              : { exc: excData[e.symbol], periodIdx: si, elIdx: idx }
                          );
                        }
                      }}
                      style={{ cursor: hasExc ? 'pointer' : 'default' }}
                    >
                      {/* Exception amber glow ring */}
                      {hasExc && (
                        <circle cx={x} cy={y} r={10}
                          fill="rgba(251,191,36,0.08)"
                          stroke="rgba(251,191,36,0.35)"
                          strokeWidth="1.5"
                          strokeDasharray="3 2" />
                      )}

                      {/* Dot — white fill, pink stroke — exactly like TrendsComponent */}
                      <circle
                        cx={x} cy={y}
                        r={isHov ? 5 : 3.5}
                        className="transition-all"
                        fill={hasExc ? '#fbbf24' : 'white'}
                        stroke={hasExc ? '#f59e0b' : '#f472b6'}
                        strokeWidth="1.5"
                      />

                      {/* Exception "!" badge */}
                      {hasExc && !isHov && (
                        <text x={x} y={y - 10} textAnchor="middle"
                          fill="#fbbf24" fontSize="9" fontWeight="bold">!</text>
                      )}

                      {/* Value label — white with dark stroke behind */}
                      {(isHov || validPts.length <= 10) && e.value !== null && (
                        <text
                          x={x} y={valLabelY}
                          textAnchor="middle"
                          fill="white"
                          fontSize="13"
                          fontWeight="500"
                          stroke="#111827"
                          strokeWidth="3"
                          strokeLinejoin="round"
                          style={{ paintOrder: 'stroke' }}
                        >
                          {formatValue(e.value, property.key)}
                        </text>
                      )}

                      {/* X-axis element symbol */}
                      <text x={x} y={PLOT_Y1 + 22} textAnchor="middle" fill="#9ca3af" fontSize="13">
                        {e.symbol}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile graph */}
      <div className="block md:hidden relative h-[460px] bg-gray-900/40 rounded-xl border border-gray-700/40 p-2">
        <div className="absolute top-3 left-4 text-sm text-gray-200 font-bold">{property.label}</div>
        <svg viewBox={`0 0 300 420`} className="w-full h-full overflow-visible">
          <defs>
            {series.map(({ period }) => (
              <linearGradient key={period} id={`grad-mob-p${period}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#f472b6" />
                <stop offset="50%"  stopColor="#fb923c" />
                <stop offset="100%" stopColor="#a3e635" />
              </linearGradient>
            ))}
          </defs>

          {[40, 210, 380].map(y => (
            <line key={y} x1="5%" x2="95%" y1={y} y2={y}
              stroke="#374151" strokeDasharray="2" strokeWidth="0.5" />
          ))}

          {series.map(({ period, elements }, si) => {
            const MX0 = 20, MX1 = 280, MY0 = 40, MY1 = 380;
            const MW = MX1 - MX0;
            const MH = MY1 - MY0;
            const getXm = (idx: number) => elements.length <= 1 ? MX0 + MW / 2 : MX0 + (idx / (elements.length - 1)) * MW;
            const toYm = (v: number) => MY0 + (1 - toNorm(v)) * MH;

            const validPts = elements
              .map((e, idx) => ({ e, idx, x: getXm(idx), y: e.value !== null ? toYm(e.value) : null }))
              .filter(p => p.y !== null) as { e: ElementPoint; idx: number; x: number; y: number }[];

            const pathD = validPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

            return (
              <g key={period}>
                {validPts.length > 1 && (
                  <motion.path
                    key={`mob-${period}-${property.key}`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9 }}
                    d={pathD}
                    fill="none"
                    stroke={`url(#grad-mob-p${period})`}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {validPts.map(({ e, idx, x, y }) => {
                  const isHov = hoveredPoint?.period === period && hoveredPoint?.idx === idx;
                  const hasExc = excData[e.symbol] !== undefined;
                  const valley = isValley(elements, idx);
                  const valLabelY = y + (valley ? 20 : -12);
                  const xLabelY = MY1 + (idx % 2 === 0 ? 16 : 26);

                  return (
                    <g key={e.atomicNumber}
                      onMouseEnter={() => setHoveredPoint({ period, idx })}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => hasExc && setOpenException(
                        openException?.exc.symbol === e.symbol ? null : { exc: excData[e.symbol], periodIdx: si, elIdx: idx }
                      )}
                      style={{ cursor: hasExc ? 'pointer' : 'default' }}
                    >
                      {hasExc && (
                        <circle cx={x} cy={y} r={8} fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.35)" strokeWidth="1.5" strokeDasharray="3 2" />
                      )}
                      <circle cx={x} cy={y} r={isHov ? 6 : 4}
                        fill={hasExc ? '#fbbf24' : 'white'}
                        stroke={hasExc ? '#f59e0b' : '#f472b6'}
                        strokeWidth="1.5" />
                      {hasExc && !isHov && (
                        <text x={x} y={y - 10} textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">!</text>
                      )}
                      {(isHov || validPts.length <= 8) && e.value !== null && (
                        <text x={x} y={valLabelY} textAnchor="middle"
                          fill="white" fontSize="11" fontWeight="600"
                          stroke="#111827" strokeWidth="3" strokeLinejoin="round"
                          style={{ paintOrder: 'stroke' }}>
                          {formatValue(e.value, property.key)}
                        </text>
                      )}
                      <text x={x} y={xLabelY} textAnchor="middle" fill="#9ca3af" fontSize="11">
                        {e.symbol}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Exception hint */}
      {Object.keys(excData).length > 0 && (
        <p className="text-center text-sm text-amber-500/70 mt-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 mr-1.5 align-middle" />
          Amber dots mark exceptions — click to read the explanation
        </p>
      )}

      {/* Inline exception card (below chart) */}
      {openException && (
        <ExceptionCard exc={openException.exc} onClose={() => setOpenException(null)} />
      )}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PeriodTrendsChart() {
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([2]);
  const [selectedProperty, setSelectedProperty] = useState<Property>(PROPERTIES[0]);
  const [showDBlock, setShowDBlock] = useState(false);
  const [propertyMenuOpen, setPropertyMenuOpen] = useState(false);

  const togglePeriod = (p: number) => {
    setSelectedPeriods(prev =>
      prev.includes(p) ? (prev.length > 1 ? prev.filter(x => x !== p) : prev) : [...prev, p]
    );
  };

  const hasPeriod4 = selectedPeriods.includes(4);

  const visibleExceptions = useMemo(() => {
    const excData = EXCEPTIONS[selectedProperty.key] || {};
    return Object.values(excData);
  }, [selectedProperty]);

  return (
    <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-5 backdrop-blur-sm">
      {/* Header — matches TrendsComponent header style */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10">
            <TrendingUp size={22} className="text-violet-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Trends Across a Period</h3>
            <p className="text-sm text-gray-400">How properties change left → right (Period 2, 3 & 4)</p>
          </div>
        </div>
        <p className="text-sm text-gray-500 italic hidden sm:block">
          Tap <span className="text-amber-400 font-medium">amber dots</span> to reveal JEE exceptions
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-end mb-5">
        {/* Period pills */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Period</p>
          <div className="flex gap-2 bg-gray-800/60 rounded-xl p-1.5">
            {PERIOD_CONFIG.map(cfg => {
              const active = selectedPeriods.includes(cfg.period);
              return (
                <button
                  key={cfg.period}
                  onClick={() => togglePeriod(cfg.period)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                  style={active ? { background: cfg.color } : {}}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Property dropdown */}
        <div className="flex-1 min-w-[220px]">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Property</p>
          <div className="relative">
            <button
              onClick={() => setPropertyMenuOpen(v => !v)}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-gray-800/60 border border-gray-700 hover:border-gray-600 text-sm font-semibold text-white transition-colors"
            >
              <span>{selectedProperty.label}</span>
              <span className="flex items-center gap-2">
                <span className="text-gray-500 font-normal text-xs">{selectedProperty.unit}</span>
                <ChevronDown size={15} className={`text-gray-400 transition-transform ${propertyMenuOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            {propertyMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-40 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl shadow-black/60">
                {PROPERTIES.map(prop => (
                  <button
                    key={prop.key}
                    onClick={() => { setSelectedProperty(prop); setPropertyMenuOpen(false); }}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm text-left transition-colors hover:bg-gray-800/60 ${
                      prop.key === selectedProperty.key ? 'bg-gray-800 text-white font-semibold' : 'text-gray-300'
                    }`}
                  >
                    <span>{prop.label}</span>
                    <span className="text-gray-500 text-xs">{prop.unit}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* D-block toggle */}
        {hasPeriod4 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Period 4 d-block</p>
            <button
              onClick={() => setShowDBlock(v => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                showDBlock
                  ? 'bg-violet-500/20 border-violet-500/40 text-violet-200'
                  : 'bg-gray-800/60 border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-200'
              }`}
            >
              {showDBlock ? 'Hide d-block' : 'Include d-block'}
            </button>
          </div>
        )}
      </div>

      {/* Chart */}
      <PeriodLineChart
        periods={selectedPeriods}
        property={selectedProperty}
        showDBlock={showDBlock && hasPeriod4}
      />

      {/* Key exceptions list — same style as TrendsComponent notes panel */}
      {visibleExceptions.length > 0 && (
        <div className="mt-6 bg-gray-800/30 rounded-xl border border-gray-700/40 p-5">
          <h4 className="text-base font-semibold text-yellow-400 flex items-center gap-2 mb-4">
            <AlertTriangle size={18} />
            Key Exceptions — {selectedProperty.label}
          </h4>
          <ul className="space-y-3">
            {visibleExceptions.map(exc => (
              <li key={exc.symbol} className="text-base text-gray-300 leading-relaxed pl-4 border-l-2 border-yellow-500/40">
                <span className="font-semibold text-amber-300">{exc.title}</span>
                <span className="text-gray-500 mx-2">·</span>
                {exc.explanation}
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-medium align-middle">
                  {exc.jeeTag}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sign-convention footnotes */}
      {selectedProperty.key === 'electronAffinity' && (
        <p className="text-sm text-gray-500 italic mt-4 border-t border-gray-700/30 pt-3">
          Sign convention: Negative = exothermic (element readily accepts the electron). Positive = endothermic. Noble gases and alkaline earth metals show near-zero or positive EA.
        </p>
      )}
      {selectedProperty.key === 'density' && (
        <p className="text-sm text-gray-500 italic mt-4 border-t border-gray-700/30 pt-3">
          Y-axis is logarithmic. Gas-phase elements (N₂, O₂, F₂, Cl₂, noble gases) have near-zero density and cannot be meaningfully compared to solids on the same scale.
        </p>
      )}
    </div>
  );
}
