export type GroupType = 'neutral' | 'edg' | 'ewg';
export type Position = 'ortho' | 'meta' | 'para';

export interface Group {
  id: string;
  sym: string;
  label: string;
  color: string;
  delta: { o: number; m: number; p: number };
  type: GroupType;
  effect: string;
  sigma: { o: number; m: number; p: number };
}

export const BASE_PKA = 10.0; // phenol reference

export const GROUPS: Group[] = [
  {
    id: 'H', sym: 'H', label: 'H (none)', color: '#7a7a8a',
    delta: { o: 0, m: 0, p: 0 }, type: 'neutral',
    effect: 'No substituent. Reference compound: phenol (pKₐ 10.0).',
    sigma: { o: 0, m: 0, p: 0 }
  },
  {
    id: 'OH', sym: 'OH', label: '–OH (hydroxyl)', color: '#6a9e7a',
    delta: { o: -0.5, m: -0.2, p: -0.7 }, type: 'edg',
    effect: 'Strong EDG via resonance (+M). Destabilises phenoxide anion → less acidic than phenol at para.',
    sigma: { o: -.13, m: .12, p: -.37 }
  },
  {
    id: 'OMe', sym: 'OCH₃', label: '–OCH₃ (methoxy)', color: '#6a9e7a',
    delta: { o: -0.4, m: -0.1, p: -0.6 }, type: 'edg',
    effect: 'EDG by resonance (+M). Para effect stronger than meta due to resonance delocalization.',
    sigma: { o: .12, m: .12, p: -.27 }
  },
  {
    id: 'Me', sym: 'CH₃', label: '–CH₃ (methyl)', color: '#7a8e9a',
    delta: { o: -0.2, m: -0.1, p: -0.2 }, type: 'edg',
    effect: 'Weak EDG by hyperconjugation (+I). Slightly destabilises the phenoxide anion.',
    sigma: { o: -.13, m: -.07, p: -.17 }
  },
  {
    id: 'F', sym: 'F', label: '–F (fluoro)', color: '#7aaa8a',
    delta: { o: 0.5, m: 0.3, p: 0.4 }, type: 'ewg',
    effect: '−I (strong) and +M (moderate). Net EWG at ortho/meta; weaker at para due to +M competing.',
    sigma: { o: .18, m: .34, p: .06 }
  },
  {
    id: 'Cl', sym: 'Cl', label: '–Cl (chloro)', color: '#8aaa7a',
    delta: { o: 0.7, m: 0.4, p: 0.6 }, type: 'ewg',
    effect: '−I dominant over +M. EWG. Stabilises phenoxide via induction, especially ortho.',
    sigma: { o: .23, m: .37, p: .23 }
  },
  {
    id: 'Br', sym: 'Br', label: '–Br (bromo)', color: '#9aaa6a',
    delta: { o: 0.8, m: 0.5, p: 0.6 }, type: 'ewg',
    effect: 'Similar to Cl. −I effect stabilises negative charge on phenoxide oxygen.',
    sigma: { o: .22, m: .39, p: .23 }
  },
  {
    id: 'NO2', sym: 'NO₂', label: '–NO₂ (nitro)', color: '#c07870',
    delta: { o: 2.8, m: 1.7, p: 2.5 }, type: 'ewg',
    effect: 'Strongest common EWG. Massive stabilisation of phenoxide by resonance at ortho/para. JEE favourite.',
    sigma: { o: .92, m: .71, p: .78 }
  },
  {
    id: 'CN', sym: 'CN', label: '–CN (cyano)', color: '#9080c0',
    delta: { o: 2.2, m: 1.5, p: 2.0 }, type: 'ewg',
    effect: 'Strong EWG by −I and −M. Second only to NO₂ in acidifying phenols.',
    sigma: { o: .56, m: .56, p: .66 }
  },
  {
    id: 'COOH', sym: 'COOH', label: '–COOH (carboxyl)', color: '#b08060',
    delta: { o: 1.8, m: 1.0, p: 1.2 }, type: 'ewg',
    effect: 'EWG by −I and −M. Stabilises phenoxide, increasing acidity significantly.',
    sigma: { o: .43, m: .37, p: .45 }
  },
  {
    id: 'CHO', sym: 'CHO', label: '–CHO (aldehyde)', color: '#a08870',
    delta: { o: 1.6, m: 1.0, p: 1.5 }, type: 'ewg',
    effect: 'EWG by −M and −I. Strong stabilisation of anion by resonance at para.',
    sigma: { o: .56, m: .35, p: .42 }
  },
  {
    id: 'NH2', sym: 'NH₂', label: '–NH₂ (amino)', color: '#6a88b0',
    delta: { o: -0.8, m: -0.3, p: -1.0 }, type: 'edg',
    effect: 'Strongest EDG by +M resonance. Greatly destabilises phenoxide → much less acidic. Para = maximum effect.',
    sigma: { o: -.16, m: -.16, p: -.66 }
  },
  {
    id: 'NMe2', sym: 'N(CH₃)₂', label: '–NMe₂ (dimethylamino)', color: '#5a78a0',
    delta: { o: -0.9, m: -0.3, p: -1.1 }, type: 'edg',
    effect: 'Stronger +M donor than NH₂. Most powerful EDG. Para position nearly neutralises phenol acidity.',
    sigma: { o: .10, m: -.10, p: -.83 }
  },
  {
    id: 'SO3H', sym: 'SO₃H', label: '–SO₃H (sulfo)', color: '#b07850',
    delta: { o: 1.5, m: 1.2, p: 1.3 }, type: 'ewg',
    effect: 'Strong EWG by −I. Stabilises phenoxide anion through inductive withdrawal.',
    sigma: { o: .55, m: .52, p: .50 }
  },
  {
    id: 'CF3', sym: 'CF₃', label: '–CF₃ (trifluoromethyl)', color: '#a09080',
    delta: { o: 1.4, m: 1.2, p: 1.5 }, type: 'ewg',
    effect: 'Very strong −I EWG (three F atoms). No resonance component. Strong through-bond induction.',
    sigma: { o: .40, m: .43, p: .54 }
  },
  {
    id: 'tBu', sym: 'C(CH₃)₃', label: '–tBu (tert-butyl)', color: '#7a8a7a',
    delta: { o: -0.2, m: -0.1, p: -0.2 }, type: 'edg',
    effect: 'Weak EDG by +I (hyperconjugation). Bulky — ortho effect includes steric component too.',
    sigma: { o: -.14, m: -.10, p: -.20 }
  },
];

export interface SimSlot {
  group: string;
  pos: Position;
}

export const DEFAULT_SLOTS: SimSlot[] = [
  { group: 'NO2', pos: 'para' },
  { group: 'OH', pos: 'para' },
  { group: 'NH2', pos: 'para' },
  { group: 'H', pos: 'para' },
];

export const SLOT_COLORS = ['#818cf8', '#f59e0b', '#34d399', '#f472b6'];
export const SLOT_BG = ['rgba(129,140,248,0.12)', 'rgba(245,158,11,0.12)', 'rgba(52,211,153,0.12)', 'rgba(244,114,182,0.12)'];
export const SLOT_BORDER = ['rgba(129,140,248,0.3)', 'rgba(245,158,11,0.3)', 'rgba(52,211,153,0.3)', 'rgba(244,114,182,0.3)'];

export function simPka(slot: SimSlot): number {
  const g = GROUPS.find(x => x.id === slot.group);
  if (!g) return BASE_PKA;
  const key = slot.pos[0] as 'o' | 'm' | 'p';
  return +(BASE_PKA - g.delta[key]).toFixed(2);
}

export function simLabel(slot: SimSlot): string {
  const g = GROUPS.find(x => x.id === slot.group);
  if (!g || slot.group === 'H') return 'Phenol';
  const match = g.label.match(/\(([^)]+)\)/);
  if (match) {
    let prefix = match[1];
    prefix = prefix.replace('hydroxyl', 'hydroxy').replace('carboxyl', 'carboxy');
    return `${slot.pos[0]}-${prefix.charAt(0).toUpperCase() + prefix.slice(1)}phenol`;
  }
  return `${g.sym}-(${slot.pos})`;
}
