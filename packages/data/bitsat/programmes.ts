// ============================================================================
// BITSAT programme catalog — single source of truth for canonical programme
// codes used in the BITSAT predictor.
//
// `code` is the stable join key: it survives the scattered punctuation BITS
// has used over the years ("B.Pharm." vs "B. Pharm", "Electrical & Electronics"
// vs "Electrical and Electronics", …). The scraper canonicalizes every row to
// one of these codes before writing to Mongo.
// ============================================================================

export type BitsatProgrammeCode =
  | 'BE-CHE'
  | 'BE-CIV'
  | 'BE-CSE'
  | 'BE-EEE'
  | 'BE-ECE'
  | 'BE-EIE'
  | 'BE-ECMP'
  | 'BE-MECH'
  | 'BE-MANF'
  | 'BE-MNC'
  | 'BE-ENV'
  | 'MSC-BIO'
  | 'MSC-CHEM'
  | 'MSC-ECON'
  | 'MSC-MATH'
  | 'MSC-PHYS'
  | 'MSC-SEMI'
  | 'MSC-GEN'
  | 'BPHARM';

export type BitsatDegreeType = 'BE' | 'MSC' | 'BPHARM';

export interface BitsatProgrammeInfo {
  code: BitsatProgrammeCode;
  short_name: string;        // brand-able tag, e.g. "CSE", "MnC", "B.Pharm"
  display_name: string;      // full canonical name, e.g. "B.E. Computer Science"
  degree_type: BitsatDegreeType;
  duration_years: number;
  // Demand tier — useful for sorting and for the "top programmes" UI:
  //   1 = elite (CSE, MnC, ECE)
  //   2 = strong (EEE, EIE, MECH, MSC-ECON, MSC-SEMI)
  //   3 = standard (everything else)
  // These are anchored in the score gaps observed across all 9 years, not in
  // any subjective ranking. Update when the gap pattern shifts.
  demand_tier: 1 | 2 | 3;
}

export const BITSAT_PROGRAMMES: BitsatProgrammeInfo[] = [
  // B.E.
  { code: 'BE-CSE',  short_name: 'CSE',   display_name: 'B.E. Computer Science',                      degree_type: 'BE',     duration_years: 4, demand_tier: 1 },
  { code: 'BE-MNC',  short_name: 'MnC',   display_name: 'B.E. Mathematics and Computing',             degree_type: 'BE',     duration_years: 4, demand_tier: 1 },
  { code: 'BE-ECE',  short_name: 'ECE',   display_name: 'B.E. Electronics & Communication',           degree_type: 'BE',     duration_years: 4, demand_tier: 1 },
  { code: 'BE-EEE',  short_name: 'EEE',   display_name: 'B.E. Electrical & Electronics',              degree_type: 'BE',     duration_years: 4, demand_tier: 2 },
  { code: 'BE-EIE',  short_name: 'EIE',   display_name: 'B.E. Electronics & Instrumentation',         degree_type: 'BE',     duration_years: 4, demand_tier: 2 },
  { code: 'BE-MECH', short_name: 'MECH',  display_name: 'B.E. Mechanical',                            degree_type: 'BE',     duration_years: 4, demand_tier: 2 },
  { code: 'BE-CHE',  short_name: 'CHEM',  display_name: 'B.E. Chemical',                              degree_type: 'BE',     duration_years: 4, demand_tier: 3 },
  { code: 'BE-CIV',  short_name: 'CIV',   display_name: 'B.E. Civil',                                 degree_type: 'BE',     duration_years: 4, demand_tier: 3 },
  { code: 'BE-MANF', short_name: 'MANF',  display_name: 'B.E. Manufacturing',                         degree_type: 'BE',     duration_years: 4, demand_tier: 3 },
  { code: 'BE-ENV',  short_name: 'ENV',   display_name: 'B.E. Environmental and Sustainability',      degree_type: 'BE',     duration_years: 4, demand_tier: 3 },
  { code: 'BE-ECMP', short_name: 'EnC',   display_name: 'B.E. Electronics and Computer',              degree_type: 'BE',     duration_years: 4, demand_tier: 2 },

  // M.Sc. (integrated, 4 yr — students dual-degree into B.E. via on-campus thread)
  { code: 'MSC-ECON', short_name: 'Econ',  display_name: 'M.Sc. Economics',                            degree_type: 'MSC',    duration_years: 4, demand_tier: 2 },
  { code: 'MSC-MATH', short_name: 'Math',  display_name: 'M.Sc. Mathematics',                          degree_type: 'MSC',    duration_years: 4, demand_tier: 3 },
  { code: 'MSC-PHYS', short_name: 'Phys',  display_name: 'M.Sc. Physics',                              degree_type: 'MSC',    duration_years: 4, demand_tier: 3 },
  { code: 'MSC-CHEM', short_name: 'Chem',  display_name: 'M.Sc. Chemistry',                            degree_type: 'MSC',    duration_years: 4, demand_tier: 3 },
  { code: 'MSC-BIO',  short_name: 'Bio',   display_name: 'M.Sc. Biological Sciences',                  degree_type: 'MSC',    duration_years: 4, demand_tier: 3 },
  { code: 'MSC-SEMI', short_name: 'Semi',  display_name: 'M.Sc. Semiconductor and Nanoscience',        degree_type: 'MSC',    duration_years: 4, demand_tier: 2 },
  { code: 'MSC-GEN',  short_name: 'GS',    display_name: 'M.Sc. (Tech.) General Studies',              degree_type: 'MSC',    duration_years: 4, demand_tier: 3 },

  // B.Pharm.
  { code: 'BPHARM',   short_name: 'Pharm', display_name: 'B. Pharm.',                                  degree_type: 'BPHARM', duration_years: 4, demand_tier: 3 },
];

export const BITSAT_PROGRAMME_BY_CODE: Record<BitsatProgrammeCode, BitsatProgrammeInfo> =
  Object.fromEntries(BITSAT_PROGRAMMES.map((p) => [p.code, p])) as Record<
    BitsatProgrammeCode,
    BitsatProgrammeInfo
  >;
