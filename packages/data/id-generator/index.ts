import 'server-only';
import { QuestionV2 } from '../models/Question.v2';

const CHAPTER_PREFIX_MAP: Record<string, string> = {
  // ── Chemistry (Class 11) ──
  ch11_atom: 'ATOM', ch11_bonding: 'BOND', ch11_chem_eq: 'CEQ', ch11_goc: 'GOC',
  ch11_hydrocarbon: 'HC', ch11_ionic_eq: 'IEQ', ch11_mole: 'MOLE', ch11_pblock: 'PB11',
  ch11_periodic: 'PERI', ch11_prac_org: 'POC', ch11_redox: 'RDX', ch11_thermo: 'THERMO',
  // ── Chemistry (Class 12) ──
  ch12_alcohols: 'ALCO', ch12_amines: 'AMIN', ch12_biomolecules: 'BIO',
  ch12_carbonyl: 'ALDO', ch12_coord: 'CORD', ch12_dblock: 'DNF', ch12_electrochem: 'EC',
  ch12_haloalkanes: 'HALO', ch12_kinetics: 'CK', ch12_pblock: 'PB12',
  ch12_salt: 'SALT', ch12_solutions: 'SOL',
  // ── Physics (Class 11) ──
  ph11_math_phy: 'MIP', ph11_units: 'UNIT', ph11_kinematics1d: 'K1D', ph11_kinematics2d: 'K2D',
  ph11_nlm: 'NLM', ph11_wep: 'WEP', ph11_com_mom: 'COM', ph11_rotation: 'ROT',
  ph11_gravitation: 'GRAV', ph11_solids: 'SOLD', ph11_fluids: 'FLUI',
  ph11_shm: 'SHM', ph11_waves: 'WAVE',
  ph11_thermal_props: 'THPR', ph11_thermo: 'TDYN', ph11_ktg: 'KTG',
  // ── Physics (Class 12) ──
  ph12_electrostatics: 'ELST', ph12_capacitance: 'CAPC', ph12_current: 'CURR',
  ph12_mag_matter: 'MAGM', ph12_moving_charges: 'MVCH',
  ph12_emi: 'EMI', ph12_ac: 'ACUR', ph12_ray_optics: 'ROPY',
  ph12_wave_optics: 'WVOP',
  ph12_dual_nature: 'DUAL', ph12_atoms: 'ATPH', ph12_nuclei: 'NUCL',
  ph12_em_waves: 'EMW', ph12_semiconductors: 'SEMI',
  ph12_communication: 'COMM', ph12_exp_phy: 'EXPP',
  // ── Mathematics ──
  ma_basic_math: 'BOMA', ma_quadratic: 'QUAD', ma_complex: 'CMPL',
  ma_sequence: 'SQSR', ma_pnc: 'PMCM', ma_binomial: 'BNML',
  ma_reasoning: 'MRES', ma_statistics: 'STAT', ma_matrices: 'MTRX',
  ma_determinants: 'DTRM', ma_probability: 'PROB', ma_sets_rel: 'STRL',
  ma_functions: 'FUNC', ma_limits: 'LIMS', ma_continuity_diff: 'CTDF',
  ma_differentiation: 'DIFF', ma_aod: 'AODV', ma_indef_int: 'ININ',
  ma_def_int: 'DFIN', ma_auc: 'AUC', ma_diff_eq: 'DFEQ',
  ma_straight_lines: 'STLN', ma_circle: 'CRCL', ma_parabola: 'PRBL',
  ma_ellipse: 'ELPS', ma_hyperbola: 'HYPB', ma_trig_ratios: 'TRRI',
  ma_trig_eq: 'TREQ', ma_itf: 'ITF', ma_height_dist: 'HTDT',
  ma_triangle_prop: 'PRTR', ma_vector_algebra: 'VCAL', ma_3d_geom: 'TDGM',
};

export function getDisplayIdPrefix(chapterId: string): string {
  return CHAPTER_PREFIX_MAP[chapterId]
    ?? chapterId.split('_').pop()!.toUpperCase().substring(0, 4);
}

async function nextSequenceForPrefix(prefix: string): Promise<string> {
  const lastQ = await QuestionV2.findOne(
    { display_id: { $regex: `^${prefix}-\\d+$` } },
    { display_id: 1 },
  ).sort({ display_id: -1 }).lean();

  const maxSeq = lastQ
    ? parseInt(((lastQ as Record<string, unknown>).display_id as string).split('-')[1], 10)
    : 0;
  return `${prefix}-${String(maxSeq + 1).padStart(3, '0')}`;
}

export interface DisplayIdGenerationResult {
  display_id: string;
  prefix: string;
}

export async function generateDisplayId(chapterId: string): Promise<DisplayIdGenerationResult> {
  const prefix = getDisplayIdPrefix(chapterId);
  const display_id = await nextSequenceForPrefix(prefix);
  return { display_id, prefix };
}

export async function regenerateDisplayId(prefix: string): Promise<string> {
  return nextSequenceForPrefix(prefix);
}
