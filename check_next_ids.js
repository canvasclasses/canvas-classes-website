require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI;
async function main() {
  await mongoose.connect(MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  // Chapters involved in Apr 3 Evening shift:
  // Q51: Electrochemistry (conductometry) → ch12_electrochem → ELEC
  // Q52: Ionic Equilibrium / Solutions → ch12_ionic_eq → IOCE  
  // Q53: Biomolecules (vitamins) → ch12_biomol → BIOM
  // Q54: Periodic Table (elements) → ch11_periodic → PERD
  // Q55: Structure of Atom → ch11_atom → ATOM
  // Q56: Analytical Chemistry / Mole → ch11_mole → MOLE
  // Q57: Aldehydes/Ketones → ch12_aldehyde → ALDO
  // Q58: Aromatic → ch12_aromatic... check
  // Q59: Electrochemistry → ch12_electrochem → ELEC
  // Q60: Coordination → ch12_coord → CORD
  // Q61: Mole concept → ch11_mole → MOLE
  // Q62: Mole concept → ch11_mole → MOLE
  // Q63: Biomolecules → ch12_biomol → BIOM
  // Q64: d-block → ch12_dblock → DNF
  // Q65: Organic (hyperconj) → ch12_hydrocarbons → HYDR
  // Q66: Physical equilibrium → ch11_chem_eq → CEQ
  // Q67: Amines → ch12_amines → AMIN
  // Q68: Periodic table → ch11_periodic → PERD
  // Q69: IUPAC → ch12_haloalkane or ch12_hydrocarbons
  // Q70: Chemical Kinetics → ch12_kinetics → KINE
  // Q71: Nitro compounds → ch12_amines → AMIN
  // Q72: Thermodynamics → ch11_thermo → THRM
  // Q73: Thermochemistry → ch11_thermo → THRM
  // Q74: d-block → ch12_dblock → DNF
  // Q75: Isomerism → ch12_hydrocarbons → HYDR

  const prefixes = ['ELEC','IOCE','BIOM','PERD','ATOM','MOLE','ALDO','CORD','DNF','HYDR','CEQ','AMIN','KINE','THRM','RDXN','SOLN'];
  for (const pfx of prefixes) {
    const last = await col.find({ display_id: new RegExp(`^${pfx}-`) })
      .sort({ display_id: -1 }).limit(1).toArray();
    const lastId = last[0]?.display_id || `${pfx}-000`;
    const num = parseInt(lastId.split('-')[1]) || 0;
    console.log(`${pfx}: last=${lastId}, next=${pfx}-${String(num+1).padStart(3,'0')}`);
  }
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
