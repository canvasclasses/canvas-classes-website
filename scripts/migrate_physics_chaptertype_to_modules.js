// One-off taxonomy migration (2026-06-09): give physics chapters a real
// `chapterType` MODULE instead of the flat 'physics', so the Crucible chapter
// list can group them by module (Mechanics 1/2, Electromagnetism, …) exactly
// like Maths already groups by chapterType (algebra/calculus/…).
//
// Module assignments are lifted 1:1 from the dropper planner's curated
// PHYSICS_GROUP_MAP (apps/student/app/study-planner/planner-data.ts). Reconciled
// to cover all 32 physics chapters with zero gaps.
//
// Safe: only rewrites lines that are a physics `chapter` node currently typed
// 'physics'; errors out if any physics chapter has no module mapping. The admin
// taxonomy dashboard preserves chapterType (taxonomy-load parses it, save writes
// it), so this survives dashboard round-trips. Re-runnable (idempotent: a second
// run finds no 'physics' lines left and reports 0 changes).

const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '..', 'packages', 'data', 'taxonomy', 'taxonomyData_from_csv.ts');

const MODULE_OF = {
  // Mechanics 1
  ph11_math_phy: 'mechanics_1', ph11_units: 'mechanics_1', ph11_kinematics1d: 'mechanics_1',
  ph11_kinematics2d: 'mechanics_1', ph11_nlm: 'mechanics_1', ph11_wep: 'mechanics_1',
  // Mechanics 2
  ph11_com_mom: 'mechanics_2', ph11_rotation: 'mechanics_2', ph11_gravitation: 'mechanics_2',
  ph11_solids: 'mechanics_2', ph11_fluids: 'mechanics_2',
  // Thermodynamics & Waves
  ph11_shm: 'thermo_waves', ph11_waves: 'thermo_waves', ph11_thermal_props: 'thermo_waves',
  ph11_thermo: 'thermo_waves', ph11_ktg: 'thermo_waves',
  // Electromagnetism
  ph12_electrostatics: 'electromagnetism', ph12_capacitance: 'electromagnetism', ph12_current: 'electromagnetism',
  ph12_mag_matter: 'electromagnetism', ph12_moving_charges: 'electromagnetism', ph12_emi: 'electromagnetism',
  ph12_ac: 'electromagnetism', ph12_em_waves: 'electromagnetism',
  // Optics
  ph12_ray_optics: 'optics', ph12_wave_optics: 'optics',
  // Modern Physics
  ph12_dual_nature: 'modern_physics', ph12_atoms: 'modern_physics', ph12_nuclei: 'modern_physics',
  ph12_semiconductors: 'modern_physics', ph12_communication: 'modern_physics',
  // Experimental Physics
  ph12_exp_phy: 'experimental_physics',
};

const lines = fs.readFileSync(FILE, 'utf8').split('\n');
let changed = 0;
const missed = [];
const out = lines.map((line) => {
  const m = line.match(/id: '(ph1[12]_[a-z0-9_]+)'/);
  if (!m || !line.includes("type: 'chapter'")) return line;
  const id = m[1];
  const slug = MODULE_OF[id];
  if (!slug) { missed.push(id); return line; }
  if (!line.includes("chapterType: 'physics'")) return line; // already migrated / unexpected
  changed++;
  return line.replace("chapterType: 'physics'", `chapterType: '${slug}'`);
});

if (missed.length) {
  console.error('ABORT — physics chapters with no module mapping:', missed);
  process.exit(1);
}
fs.writeFileSync(FILE, out.join('\n'));
console.log(`Updated ${changed} physics chapter nodes (expected 32).`);
