require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Manual per-question solution fixes: bare ion/config notation → LaTeX
const FIXES = {
  'PERI-003': s => s
    .replace(/\bNaCl\b/g, '$\\mathrm{NaCl}$')
    .replace(/\bSO3\b/g, '$\\mathrm{SO_3}$')
    .replace(/\bCO2\b/g, '$\\mathrm{CO_2}$')
    .replace(/\bNa2O\b/g, '$\\mathrm{Na_2O}$')
    .replace(/\bCaO\b/g, '$\\mathrm{CaO}$'),

  'PERI-004': s => s
    .replace(/\[Rn\] 5f14 6d9 7s2/g, '$[\\mathrm{Rn}]\\,5f^{14}\\,6d^{9}\\,7s^{2}$')
    .replace(/\b9 d \+ 2 s\b/g, '$9d + 2s$'),

  'PERI-005': s => s
    .replace(/\[Kr\] 5s1/g, '$[\\mathrm{Kr}]\\,5s^{1}$')
    .replace(/\[Xe\] 4f14 5d9 6s1/g, '$[\\mathrm{Xe}]\\,4f^{14}\\,5d^{9}\\,6s^{1}$')
    .replace(/\[Kr\] 4d10 5s2 5p4/g, '$[\\mathrm{Kr}]\\,4d^{10}\\,5s^{2}\\,5p^{4}$')
    .replace(/\[Xe\] 4f9 6s2/g, '$[\\mathrm{Xe}]\\,4f^{9}\\,6s^{2}$'),

  'PERI-011': s => s
    .replace(/\[Ne\] 3s2 3p3/g, '$[\\mathrm{Ne}]\\,3s^{2}\\,3p^{3}$')
    .replace(/\bPCl3\b/g, '$\\mathrm{PCl_3}$'),

  'PERI-021': s => s
    .replace(/\bNa2O\b/g, '$\\mathrm{Na_2O}$')
    .replace(/\bK2O\b/g, '$\\mathrm{K_2O}$')
    .replace(/\bCl2O7\b/g, '$\\mathrm{Cl_2O_7}$'),

  'PERI-023': s => s
    .replace(/\bns2 np4\b/g, '$ns^{2}\\,np^{4}$'),

  'PERI-027': s => s
    .replace(/Ca2\+\(Z=20\)/g, '$\\mathrm{Ca^{2+}}$(Z=20)')
    .replace(/K\+\(Z=19\)/g, '$\\mathrm{K^{+}}$(Z=19)')
    .replace(/Cl-\(Z=17\)/g, '$\\mathrm{Cl^{-}}$(Z=17)')
    .replace(/S2-\(Z=16\)/g, '$\\mathrm{S^{2-}}$(Z=16)')
    .replace(/\bCa2\+\b/g, '$\\mathrm{Ca^{2+}}$')
    .replace(/\bK\+\b/g, '$\\mathrm{K^{+}}$')
    .replace(/\bCl-\b/g, '$\\mathrm{Cl^{-}}$')
    .replace(/\bS2-\b/g, '$\\mathrm{S^{2-}}$'),

  'PERI-028': s => s
    .replace(/Mg2\+\(Z=12\)/g, '$\\mathrm{Mg^{2+}}$(Z=12)')
    .replace(/Na\+\(Z=11\)/g, '$\\mathrm{Na^{+}}$(Z=11)')
    .replace(/F-\(Z=9\)/g, '$\\mathrm{F^{-}}$(Z=9)')
    .replace(/O2-\(Z=8\)/g, '$\\mathrm{O^{2-}}$(Z=8)')
    .replace(/N3-\(Z=7\)/g, '$\\mathrm{N^{3-}}$(Z=7)')
    .replace(/\bMg2\+\b/g, '$\\mathrm{Mg^{2+}}$')
    .replace(/\bNa\+\b/g, '$\\mathrm{Na^{+}}$')
    .replace(/\bF-\b/g, '$\\mathrm{F^{-}}$')
    .replace(/\bO2-\b/g, '$\\mathrm{O^{2-}}$')
    .replace(/\bN3-\b/g, '$\\mathrm{N^{3-}}$'),

  'PERI-029': s => s
    .replace(/P3-\(Z=15\)/g, '$\\mathrm{P^{3-}}$(Z=15)')
    .replace(/S2-\(Z=16\)/g, '$\\mathrm{S^{2-}}$(Z=16)')
    .replace(/Cl-\(Z=17\)/g, '$\\mathrm{Cl^{-}}$(Z=17)')
    .replace(/K\+\(Z=19\)/g, '$\\mathrm{K^{+}}$(Z=19)')
    .replace(/Ca2\+\(Z=20\)/g, '$\\mathrm{Ca^{2+}}$(Z=20)')
    .replace(/\bP3-\b/g, '$\\mathrm{P^{3-}}$')
    .replace(/\bS2-\b/g, '$\\mathrm{S^{2-}}$')
    .replace(/\bCl-\b/g, '$\\mathrm{Cl^{-}}$')
    .replace(/\bK\+\b/g, '$\\mathrm{K^{+}}$')
    .replace(/\bCa2\+\b/g, '$\\mathrm{Ca^{2+}}$'),

  'PERI-030': s => s
    .replace(/Al3\+\(53\)/g, '$\\mathrm{Al^{3+}}$(53 pm)')
    .replace(/Mg2\+\(72\)/g, '$\\mathrm{Mg^{2+}}$(72 pm)')
    .replace(/Na\+\(102\)/g, '$\\mathrm{Na^{+}}$(102 pm)')
    .replace(/K\+\(138\)/g, '$\\mathrm{K^{+}}$(138 pm)')
    .replace(/\bAl3\+\b/g, '$\\mathrm{Al^{3+}}$')
    .replace(/\bMg2\+\b/g, '$\\mathrm{Mg^{2+}}$')
    .replace(/\bNa\+\b/g, '$\\mathrm{Na^{+}}$')
    .replace(/\bK\+\b/g, '$\\mathrm{K^{+}}$'),

  'PERI-031': s => s
    .replace(/N3-\(Z=7\)/g, '$\\mathrm{N^{3-}}$(Z=7)')
    .replace(/O2-\(Z=8\)/g, '$\\mathrm{O^{2-}}$(Z=8)')
    .replace(/F-\(Z=9\)/g, '$\\mathrm{F^{-}}$(Z=9)')
    .replace(/\bN3-\b/g, '$\\mathrm{N^{3-}}$')
    .replace(/\bO2-\b/g, '$\\mathrm{O^{2-}}$')
    .replace(/\bF-\b/g, '$\\mathrm{F^{-}}$')
    .replace(/1\.4 A\b/g, '$1.4\\,\\text{Å}$')
    .replace(/1\.33 A\b/g, '$1.33\\,\\text{Å}$'),

  'PERI-032': s => s
    .replace(/\bNaOH\b/g, '$\\mathrm{NaOH}$')
    .replace(/\bBe\(OH\)2\b/g, '$\\mathrm{Be(OH)_2}$')
    .replace(/\bCa\(OH\)2\b/g, '$\\mathrm{Ca(OH)_2}$')
    .replace(/\bB\(OH\)3\b/g, '$\\mathrm{B(OH)_3}$')
    .replace(/\bAl\(OH\)3\b/g, '$\\mathrm{Al(OH)_3}$'),

  'PERI-034': s => s
    .replace(/\bB2O3\b/g, '$\\mathrm{B_2O_3}$')
    .replace(/\bSiO2\b/g, '$\\mathrm{SiO_2}$')
    .replace(/\bNaOH\b/g, '$\\mathrm{NaOH}$')
    .replace(/\bNa2SiO3\b/g, '$\\mathrm{Na_2SiO_3}$')
    .replace(/\bCaO\b/g, '$\\mathrm{CaO}$')
    .replace(/\bBaO\b/g, '$\\mathrm{BaO}$')
    .replace(/\bN2O\b/g, '$\\mathrm{N_2O}$'),

  'PERI-035': s => s
    .replace(/O2-\(Z=8\)/g, '$\\mathrm{O^{2-}}$(Z=8)')
    .replace(/F-\(Z=9\)/g, '$\\mathrm{F^{-}}$(Z=9)')
    .replace(/Na\+\(Z=11\)/g, '$\\mathrm{Na^{+}}$(Z=11)')
    .replace(/Mg2\+\(Z=12\)/g, '$\\mathrm{Mg^{2+}}$(Z=12)')
    .replace(/\bO2-\b/g, '$\\mathrm{O^{2-}}$')
    .replace(/\bF-\b/g, '$\\mathrm{F^{-}}$')
    .replace(/\bNa\+\b/g, '$\\mathrm{Na^{+}}$')
    .replace(/\bMg2\+\b/g, '$\\mathrm{Mg^{2+}}$'),

  'PERI-036': s => s
    .replace(/Al3\+\(Z=13\)/g, '$\\mathrm{Al^{3+}}$(Z=13)')
    .replace(/Mg2\+\(Z=12\)/g, '$\\mathrm{Mg^{2+}}$(Z=12)')
    .replace(/Na\+\(Z=11\)/g, '$\\mathrm{Na^{+}}$(Z=11)')
    .replace(/F-\(Z=9\)/g, '$\\mathrm{F^{-}}$(Z=9)')
    .replace(/O2-\(Z=8\)/g, '$\\mathrm{O^{2-}}$(Z=8)')
    .replace(/N3-\(Z=7\)/g, '$\\mathrm{N^{3-}}$(Z=7)')
    .replace(/\bAl3\+\b/g, '$\\mathrm{Al^{3+}}$')
    .replace(/\bMg2\+\b/g, '$\\mathrm{Mg^{2+}}$')
    .replace(/\bNa\+\b/g, '$\\mathrm{Na^{+}}$')
    .replace(/\bF-\b/g, '$\\mathrm{F^{-}}$')
    .replace(/\bO2-\b/g, '$\\mathrm{O^{2-}}$')
    .replace(/\bN3-\b/g, '$\\mathrm{N^{3-}}$'),

  'PERI-037': s => s
    .replace(/\bN2O3\b/g, '$\\mathrm{N_2O_3}$')
    .replace(/\bLi2O\b/g, '$\\mathrm{Li_2O}$')
    .replace(/\bAl2O3\b/g, '$\\mathrm{Al_2O_3}$'),

  'PERI-038': s => s
    .replace(/\[Rn\] 5f14 6d1 7s2/g, '$[\\mathrm{Rn}]\\,5f^{14}\\,6d^{1}\\,7s^{2}$'),

  'PERI-043': s => s
    .replace(/\bO2-\b/g, '$\\mathrm{O^{2-}}$')
    .replace(/\bF-\b/g, '$\\mathrm{F^{-}}$')
    .replace(/\bMg2\+\b/g, '$\\mathrm{Mg^{2+}}$')
    .replace(/\(O=8\)/g, '($Z_{\\mathrm{O}}=8$)')
    .replace(/\(F=9\)/g, '($Z_{\\mathrm{F}}=9$)')
    .replace(/\(Na=11\)/g, '($Z_{\\mathrm{Na}}=11$)')
    .replace(/\(Mg=12\)/g, '($Z_{\\mathrm{Mg}}=12$)'),

  'PERI-045': s => s
    .replace(/\b2s2\b/g, '$2s^{2}$')
    .replace(/\b2p3\b/g, '$2p^{3}$')
    .replace(/O->O2-/g, '$\\mathrm{O \\to O^{2-}}$'),

  'PERI-052': s => s
    .replace(/\bTl2O3\b/g, '$\\mathrm{Tl_2O_3}$')
    .replace(/\bB2O3\b/g, '$\\mathrm{B_2O_3}$'),

  'PERI-056': s => s
    .replace(/\[Ar\] 3d10 4s2 4p1/g, '$[\\mathrm{Ar}]\\,3d^{10}\\,4s^{2}\\,4p^{1}$')
    .replace(/\b3d10\b/g, '$3d^{10}$'),

  'PERI-059': s => s
    .replace(/delta_eg_H\(Te\)/g, '$\\Delta_{\\mathrm{eg}}H(\\mathrm{Te})$')
    .replace(/delta_eg_H\(Po\)/g, '$\\Delta_{\\mathrm{eg}}H(\\mathrm{Po})$'),

  'PERI-068': s => s
    .replace(/O2-\s*\(10e\)/g, '$\\mathrm{O^{2-}}$ (10e⁻)')
    .replace(/Mg2\+\s*\(10e\)/g, '$\\mathrm{Mg^{2+}}$ (10e⁻)')
    .replace(/O2-\(Z=8\)/g, '$\\mathrm{O^{2-}}$(Z=8)')
    .replace(/Mg2\+\(Z=12\)/g, '$\\mathrm{Mg^{2+}}$(Z=12)')
    .replace(/~1\.40 A/g, '$\\approx 1.40\\,\\text{Å}$')
    .replace(/~0\.72 A/g, '$\\approx 0.72\\,\\text{Å}$')
    .replace(/\bO2-\b/g, '$\\mathrm{O^{2-}}$')
    .replace(/\bMg2\+\b/g, '$\\mathrm{Mg^{2+}}$'),

  'PERI-072': s => s
    .replace(/\bB\(OH\)3\b/g, '$\\mathrm{B(OH)_3}$')
    .replace(/\bH3PO3\b/g, '$\\mathrm{H_3PO_3}$')
    .replace(/\bNaOH\b/g, '$\\mathrm{NaOH}$')
    .replace(/\bCa\(OH\)2\b/g, '$\\mathrm{Ca(OH)_2}$')
    .replace(/\bBe\(OH\)2\b/g, '$\\mathrm{Be(OH)_2}$')
    .replace(/\bAl\(OH\)3\b/g, '$\\mathrm{Al(OH)_3}$'),

  'PERI-076': s => s
    .replace(/Na\+\(Z=11,\s*1\.02 A\)/g, '$\\mathrm{Na^{+}}$(Z=11, 1.02 Å)')
    .replace(/Mg2\+\(Z=12,\s*0\.72 A\)/g, '$\\mathrm{Mg^{2+}}$(Z=12, 0.72 Å)')
    .replace(/Al3\+\(Z=13,\s*0\.54 A\)/g, '$\\mathrm{Al^{3+}}$(Z=13, 0.54 Å)')
    .replace(/\bNa\+\b/g, '$\\mathrm{Na^{+}}$')
    .replace(/\bMg2\+\b/g, '$\\mathrm{Mg^{2+}}$')
    .replace(/\bAl3\+\b/g, '$\\mathrm{Al^{3+}}$')
    .replace(/\b1\.02 A\b/g, '$1.02\\,\\text{Å}$')
    .replace(/\b0\.72 A\b/g, '$0.72\\,\\text{Å}$')
    .replace(/\b0\.54 A\b/g, '$0.54\\,\\text{Å}$'),

  'PERI-084': s => s
    .replace(/H\(g\) \+ e- -> H-\(g\)/g, '$\\mathrm{H(g) + e^{-} \\to H^{-}(g)}$')
    .replace(/\bAr \+ e-\b/g, '$\\mathrm{Ar + e^{-}}$')
    .replace(/O- \+ e- -> O2-/g, '$\\mathrm{O^{-} + e^{-} \\to O^{2-}}$')
    .replace(/Na -> Na\+ \+ e-/g, '$\\mathrm{Na \\to Na^{+} + e^{-}}$'),

  'PERI-087': s => s
    // solution already has some $ but config is split weirdly — normalize
    .replace(/\[Ar\]3d\$\^6\$\s*4s\$\^2\$/g, '$[\\mathrm{Ar}]\\,3d^{6}\\,4s^{2}$')
    .replace(/\[Ar\]3d\$\^6\$/g, '$[\\mathrm{Ar}]\\,3d^{6}$')
    .replace(/Fe2\+\s*=\s*\[Ar\]3d/g, '$\\mathrm{Fe^{2+}}$ = $[\\mathrm{Ar}]\\,3d')
    .replace(/3d\$\^6\$\s*\(one/g, '$3d^{6}$ (one'),

  'PERI-091': s => s
    .replace(/Cl-\(Z=17\)/g, '$\\mathrm{Cl^{-}}$(Z=17)')
    .replace(/Ar\(Z=18\)/g, '$\\mathrm{Ar}$(Z=18)')
    .replace(/Ca2\+\(Z=20\)/g, '$\\mathrm{Ca^{2+}}$(Z=20)')
    .replace(/\bCl-\b/g, '$\\mathrm{Cl^{-}}$')
    .replace(/\bCa2\+\b/g, '$\\mathrm{Ca^{2+}}$'),

  'PERI-096': s => s
    .replace(/O- \+ e- -> O2-/g, '$\\mathrm{O^{-} + e^{-} \\to O^{2-}}$')
    .replace(/\bO-\b/g, '$\\mathrm{O^{-}}$')
    .replace(/\bO2-\b/g, '$\\mathrm{O^{2-}}$')
    .replace(/~\+780 kJ\/mol/g, '$\\approx +780\\,\\mathrm{kJ/mol}$'),

  'PERI-100': s => s
    .replace(/\bGaAlCl4\b/g, '$\\mathrm{GaAlCl_4}$')
    .replace(/\[Ga\]3\+\[AlCl4\]-/g, '$[\\mathrm{Ga}]^{3+}[\\mathrm{AlCl_4}]^{-}$')
    .replace(/\[AlCl4\]-/g, '$[\\mathrm{AlCl_4}]^{-}$'),

  'ATOM-392': s => s, // already has good LaTeX
  'ATOM-393': s => s, // already has good LaTeX
  'ATOM-401': s => s, // already has good LaTeX

  'THERMO-014': s => s, // already has good LaTeX
  'THERMO-016': s => s, // already has good LaTeX
};

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const ids = Object.keys(FIXES);
  const docs = await db.collection('questions_v2')
    .find({ display_id: { $in: ids } }, { projection: { display_id: 1, 'solution.text_markdown': 1 } })
    .toArray();

  let updated = 0;
  for (const doc of docs) {
    const fix = FIXES[doc.display_id];
    if (!fix) continue;
    const original = doc.solution?.text_markdown || '';
    const fixed = fix(original);
    if (fixed === original) {
      console.log('SKIP (no change):', doc.display_id);
      continue;
    }
    await db.collection('questions_v2').updateOne(
      { _id: doc._id },
      { $set: { 'solution.text_markdown': fixed } }
    );
    console.log('FIXED:', doc.display_id);
    updated++;
  }
  console.log(`\nDone. Updated ${updated}/${docs.length} questions.`);
  mongoose.disconnect();
});
