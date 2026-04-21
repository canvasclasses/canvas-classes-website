// ============================================
// Region mapping — Indian states → North / South / East / West / Northeast / Central.
// Single source of truth used by ingestion scripts, filters, and landing pages.
// ============================================

import type { CollegeRegion } from '@/lib/models/College';

const REGION_BY_STATE: Record<string, CollegeRegion> = {
  // North
  'Delhi': 'North',
  'Haryana': 'North',
  'Punjab': 'North',
  'Uttar Pradesh': 'North',
  'Uttarakhand': 'North',
  'Himachal Pradesh': 'North',
  'Jammu and Kashmir': 'North',
  'Jammu & Kashmir': 'North',
  'Ladakh': 'North',
  'Rajasthan': 'North',
  'Chandigarh': 'North',

  // South
  'Karnataka': 'South',
  'Tamil Nadu': 'South',
  'Kerala': 'South',
  'Andhra Pradesh': 'South',
  'Telangana': 'South',
  'Puducherry': 'South',

  // East
  'West Bengal': 'East',
  'Odisha': 'East',
  'Bihar': 'East',
  'Jharkhand': 'East',

  // West
  'Maharashtra': 'West',
  'Gujarat': 'West',
  'Goa': 'West',
  'Dadra and Nagar Haveli and Daman and Diu': 'West',

  // Central
  'Madhya Pradesh': 'Central',
  'Chhattisgarh': 'Central',

  // Northeast
  'Assam': 'Northeast',
  'Meghalaya': 'Northeast',
  'Manipur': 'Northeast',
  'Tripura': 'Northeast',
  'Nagaland': 'Northeast',
  'Arunachal Pradesh': 'Northeast',
  'Mizoram': 'Northeast',
  'Sikkim': 'Northeast',
};

export function regionForState(state: string): CollegeRegion {
  const hit = REGION_BY_STATE[state.trim()];
  if (!hit) {
    throw new Error(`Unknown state for region mapping: "${state}"`);
  }
  return hit;
}

export const ALL_REGIONS: CollegeRegion[] = ['North', 'South', 'East', 'West', 'Central', 'Northeast'];
