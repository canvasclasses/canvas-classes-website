// ============================================================================
// BITSAT campuses — three BITS Pilani campuses that admit through BITSAT.
//
// Static metadata (not a database collection) since the list is fixed at three
// and changes essentially never. Mirrors the role of `College` in the JoSAA
// predictor but as a constant table — no separate Mongo collection needed.
// ============================================================================

export type BitsatCampusId = 'pilani' | 'goa' | 'hyderabad';

export interface BitsatCampusInfo {
  id: BitsatCampusId;
  name: 'Pilani' | 'Goa' | 'Hyderabad';        // matches BitsatCutoff.campus
  full_name: string;
  state: string;
  city: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'Northeast';
  established: number;
  // NIRF Engineering rank. NIRF ranks "BITS Pilani" as a SINGLE institution
  // (NIRF 2025 Engineering: #11, up from #20 in 2024) and does NOT publish
  // separate ranks for the Goa and Hyderabad campuses. So only Pilani carries a
  // rank here; Goa and Hyderabad are intentionally left undefined (no badge) —
  // the earlier per-campus values (Goa #56) were not real NIRF figures.
  nirf_rank_engineering?: number;
  website: string;
  description: string;
}

export const BITSAT_CAMPUSES: BitsatCampusInfo[] = [
  {
    id: 'pilani',
    name: 'Pilani',
    full_name: 'Birla Institute of Technology and Science, Pilani — Pilani Campus',
    state: 'Rajasthan',
    city: 'Pilani',
    region: 'North',
    established: 1964,
    nirf_rank_engineering: 11,   // NIRF 2025 Engineering (institution-level)
    website: 'https://www.bits-pilani.ac.in/pilani/',
    description: 'The flagship BITS campus. CSE and MnC consistently close highest across all three campuses.',
  },
  {
    id: 'goa',
    name: 'Goa',
    full_name: 'Birla Institute of Technology and Science, Pilani — K K Birla Goa Campus',
    state: 'Goa',
    city: 'Sancoale',
    region: 'West',
    established: 2004,
    // NIRF does not rank the Goa campus separately — see the field note above.
    website: 'https://www.bits-pilani.ac.in/goa/',
    description: 'Coastal campus with the widest M.Sc. integrated programmes, including Semiconductor and Nanoscience.',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    full_name: 'Birla Institute of Technology and Science, Pilani — Hyderabad Campus',
    state: 'Telangana',
    city: 'Hyderabad',
    region: 'South',
    established: 2008,
    // Hyderabad does not consistently appear in NIRF's top 100 engineering list.
    nirf_rank_engineering: undefined,
    website: 'https://www.bits-pilani.ac.in/hyderabad/',
    description: 'Newest of the three campuses; the only campus besides Pilani that offers Civil and B.Pharm.',
  },
];

export const BITSAT_CAMPUS_BY_NAME: Record<string, BitsatCampusInfo> = Object.fromEntries(
  BITSAT_CAMPUSES.map((c) => [c.name, c]),
);

export const BITSAT_CAMPUS_BY_ID: Record<BitsatCampusId, BitsatCampusInfo> = Object.fromEntries(
  BITSAT_CAMPUSES.map((c) => [c.id, c]),
) as Record<BitsatCampusId, BitsatCampusInfo>;
