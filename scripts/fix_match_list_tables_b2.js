require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

const FIXES = {

'CORD-023': `Match List-I with List-II:

(a) $[\\mathrm{Co(NH_3)_6}][\\mathrm{Cr(CN)_6}]$, (b) $[\\mathrm{Co(NH_3)_3(NO_2)_3}]$, (c) $[\\mathrm{Cr(H_2O)_6}]\\mathrm{Cl_3}$, (d) cis-$[\\mathrm{CrCl_2(ox)_2}]^{3-}$

with (i) Linkage, (ii) Solvate, (iii) Coordination, (iv) Optical isomerism

| List-I (Complex) | List-II (Type of isomerism) |
|------------------|-----------------------------|
| (a) $[\\mathrm{Co(NH_3)_6}][\\mathrm{Cr(CN)_6}]$ | (iii) Coordination isomerism |
| (b) $[\\mathrm{Co(NH_3)_3(NO_2)_3}]$ | (i) Linkage isomerism |
| (c) $[\\mathrm{Cr(H_2O)_6}]\\mathrm{Cl_3}$ | (ii) Solvate isomerism |
| (d) cis-$[\\mathrm{CrCl_2(ox)_2}]^{3-}$ | (iv) Optical isomerism |`,

'CORD-090': `Match List-I with List-II:

(A) $[\\mathrm{Cr(NH_3)_6}]^{3+}$ (B) $[\\mathrm{NiCl_4}]^{2-}$ (C) $[\\mathrm{CoF_6}]^{3-}$ (D) $[\\mathrm{Ni(CN)_4}]^{2-}$

(I) 4.90 BM (II) 3.87 BM (III) 0.0 BM (IV) 2.83 BM

| List-I (Complex) | List-II (Magnetic moment) |
|------------------|--------------------------|
| (A) $[\\mathrm{Cr(NH_3)_6}]^{3+}$ | (II) 3.87 BM |
| (B) $[\\mathrm{NiCl_4}]^{2-}$ | (IV) 2.83 BM |
| (C) $[\\mathrm{CoF_6}]^{3-}$ | (I) 4.90 BM |
| (D) $[\\mathrm{Ni(CN)_4}]^{2-}$ | (III) 0.0 BM |`,

'CORD-093': `Match List I with List II:

(A) $\\mathrm{K_2[Ni(CN)_4]}$ (B) $\\mathrm{[Ni(CO)_4]}$ (C) $\\mathrm{[Co(NH_3)_6]Cl_3}$ (D) $\\mathrm{Na_3[CoF_6]}$

with (I) $sp^3$ (II) $sp^3d^2$ (III) $dsp^2$ (IV) $d^2sp^3$

| List-I (Complex) | List-II (Hybridisation) |
|------------------|------------------------|
| (A) $\\mathrm{K_2[Ni(CN)_4]}$ | (III) $dsp^2$ |
| (B) $\\mathrm{[Ni(CO)_4]}$ | (I) $sp^3$ |
| (C) $\\mathrm{[Co(NH_3)_6]Cl_3}$ | (IV) $d^2sp^3$ |
| (D) $\\mathrm{Na_3[CoF_6]}$ | (II) $sp^3d^2$ |`,

'CORD-104': `Match List-I with List-II:

(A) $[\\mathrm{Cr(CN)_6}]^{3-}$ (B) $[\\mathrm{Fe(H_2O)_6}]^{2+}$ (C) $[\\mathrm{Co(NH_3)_6}]^{3+}$ (D) $[\\mathrm{Ni(NH_3)_6}]^{2+}$

Number of unpaired electrons: (I) 0 (II) 3 (III) 2 (IV) 4

| List-I (Complex) | List-II (Unpaired electrons) |
|------------------|------------------------------|
| (A) $[\\mathrm{Cr(CN)_6}]^{3-}$ | (II) 3 |
| (B) $[\\mathrm{Fe(H_2O)_6}]^{2+}$ | (IV) 4 |
| (C) $[\\mathrm{Co(NH_3)_6}]^{3+}$ | (I) 0 |
| (D) $[\\mathrm{Ni(NH_3)_6}]^{2+}$ | (III) 2 |`,

'CORD-119': `Match List-I with List-II:

(A) $\\mathrm{Ni(CO)_4}$ (B) $[\\mathrm{Ni(CN)_4}]^{2-}$ (C) $[\\mathrm{Co(CN)_6}]^{3-}$ (D) $[\\mathrm{CoF_6}]^{3-}$

with (I) $sp^3$ (II) $sp^3d^2$ (III) $d^2sp^3$ (IV) $dsp^2$

| List-I (Complex) | List-II (Hybridisation) |
|------------------|------------------------|
| (A) $\\mathrm{Ni(CO)_4}$ | (I) $sp^3$ |
| (B) $[\\mathrm{Ni(CN)_4}]^{2-}$ | (IV) $dsp^2$ |
| (C) $[\\mathrm{Co(CN)_6}]^{3-}$ | (III) $d^2sp^3$ |
| (D) $[\\mathrm{CoF_6}]^{3-}$ | (II) $sp^3d^2$ |`,

'CORD-145': `Match List-I with List-II (tetrahedral crystal field d-electron configurations):

(A) $\\mathrm{TiCl_4}$ (B) $[\\mathrm{FeO_4}]^{2-}$ (C) $[\\mathrm{FeCl_4}]^{-}$ (D) $[\\mathrm{CoCl_4}]^{2-}$

with (I) $e^2, t_2^0$ (II) $e^4, t_2^3$ (III) $e^0, t_2^0$ (IV) $e^2, t_2^3$

| List-I (Complex) | List-II (d-electron config) |
|------------------|-----------------------------|
| (A) $\\mathrm{TiCl_4}$ ($d^0$) | (III) $e^0, t_2^0$ |
| (B) $[\\mathrm{FeO_4}]^{2-}$ ($d^2$) | (I) $e^2, t_2^0$ |
| (C) $[\\mathrm{FeCl_4}]^{-}$ ($d^5$) | (IV) $e^2, t_2^3$ |
| (D) $[\\mathrm{CoCl_4}]^{2-}$ ($d^7$) | (II) $e^4, t_2^3$ |`,

'CORD-147': `Match List I with List II:

(A) $[\\mathrm{Cr(H_2O)_6}]^{3+}$ (B) $[\\mathrm{Fe(H_2O)_6}]^{3+}$ (C) $[\\mathrm{Ni(H_2O)_6}]^{2+}$ (D) $[\\mathrm{V(H_2O)_6}]^{3+}$

with (I) $t_{2g}^2 e_g^0$ (II) $t_{2g}^3 e_g^0$ (III) $t_{2g}^3 e_g^2$ (IV) $t_{2g}^6 e_g^2$

| List-I (Complex) | List-II ($t_{2g}/e_g$ config) |
|------------------|-------------------------------|
| (A) $[\\mathrm{Cr(H_2O)_6}]^{3+}$ ($d^3$) | (II) $t_{2g}^3 e_g^0$ |
| (B) $[\\mathrm{Fe(H_2O)_6}]^{3+}$ ($d^5$ HS) | (III) $t_{2g}^3 e_g^2$ |
| (C) $[\\mathrm{Ni(H_2O)_6}]^{2+}$ ($d^8$) | (IV) $t_{2g}^6 e_g^2$ |
| (D) $[\\mathrm{V(H_2O)_6}]^{3+}$ ($d^2$) | (I) $t_{2g}^2 e_g^0$ |`,

'CORD-152': `Match List-I with List-II (CFSE values in units of $\\Delta_0$):

(A) $[\\mathrm{Ti(H_2O)_6}]^{2+}$ (B) $[\\mathrm{V(H_2O)_6}]^{2+}$ (C) $[\\mathrm{Mn(H_2O)_6}]^{3+}$ (D) $[\\mathrm{Fe(H_2O)_6}]^{3+}$

with (I) $-1.2$ (II) $-0.6$ (III) $0$ (IV) $-0.8$

| List-I (Complex) | List-II (CFSE / $\\Delta_0$) |
|------------------|------------------------------|
| (A) $[\\mathrm{Ti(H_2O)_6}]^{2+}$ ($d^2$) | (IV) $-0.8$ |
| (B) $[\\mathrm{V(H_2O)_6}]^{2+}$ ($d^3$) | (I) $-1.2$ |
| (C) $[\\mathrm{Mn(H_2O)_6}]^{3+}$ ($d^4$ HS) | (II) $-0.6$ |
| (D) $[\\mathrm{Fe(H_2O)_6}]^{3+}$ ($d^5$ HS) | (III) $0$ |`,

'CORD-153': `Match List I with List II (Colour):

(A) $\\mathrm{Mg(NH_4)PO_4}$ (B) $\\mathrm{K_3[Co(NO_2)_6]}$ (C) $\\mathrm{MnO(OH)_2}$ (D) $\\mathrm{Fe_4[Fe(CN)_6]_3}$

with (I) brown (II) white (III) yellow (IV) blue

| List-I (Compound) | List-II (Colour) |
|-------------------|-----------------|
| (A) $\\mathrm{Mg(NH_4)PO_4}$ | (II) white |
| (B) $\\mathrm{K_3[Co(NO_2)_6]}$ | (III) yellow |
| (C) $\\mathrm{MnO(OH)_2}$ | (I) brown |
| (D) $\\mathrm{Fe_4[Fe(CN)_6]_3}$ | (IV) blue |`,

'CORD-155': `Match List I with List II (CFSE in units of $\\Delta_0$):

(A) $[\\mathrm{Cu(NH_3)_6}]^{2+}$ (B) $[\\mathrm{Ti(H_2O)_6}]^{3+}$ (C) $[\\mathrm{Fe(CN)_6}]^{3-}$ (D) $[\\mathrm{NiF_6}]^{4-}$

with (I) $-0.6$ (II) $-2.0$ (III) $-1.2$ (IV) $-0.4$

| List-I (Complex) | List-II (CFSE / $\\Delta_0$) |
|------------------|------------------------------|
| (A) $[\\mathrm{Cu(NH_3)_6}]^{2+}$ ($d^9$) | (IV) $-0.4$ |
| (B) $[\\mathrm{Ti(H_2O)_6}]^{3+}$ ($d^1$) | (I) $-0.6$ |
| (C) $[\\mathrm{Fe(CN)_6}]^{3-}$ ($d^5$ LS) | (II) $-2.0$ |
| (D) $[\\mathrm{NiF_6}]^{4-}$ ($d^8$) | (III) $-1.2$ |`,

'CORD-159': `Match List I with List II (wavelength of light absorbed in nm):

(A) $[\\mathrm{CoCl(NH_3)_5}]^{2+}$ (B) $[\\mathrm{Co(NH_3)_6}]^{3+}$ (C) $[\\mathrm{Co(CN)_6}]^{3-}$ (D) $[\\mathrm{Cu(H_2O)_4}]^{2+}$

with (I) 310 (II) 475 (III) 535 (IV) 600

| List-I (Complex) | List-II (λ absorbed, nm) |
|------------------|--------------------------|
| (A) $[\\mathrm{CoCl(NH_3)_5}]^{2+}$ | (III) 535 |
| (B) $[\\mathrm{Co(NH_3)_6}]^{3+}$ | (II) 475 |
| (C) $[\\mathrm{Co(CN)_6}]^{3-}$ | (I) 310 |
| (D) $[\\mathrm{Cu(H_2O)_4}]^{2+}$ | (IV) 600 |`,

'GOC-072': `Match List I (Mechanism steps) with List II (Effects):

**List I:**
(A) Lone pair donation into adjacent π system (+M effect)
(B) Attack by electrophile on π electrons (+E effect)
(C) Withdrawal of electrons through σ bonds (–I effect)
(D) Withdrawal of electrons from ring via π system (–R/–M effect)

**List II:**
(I) –E effect
(II) –R effect
(III) +E effect
(IV) +R effect

| List-I (Description) | List-II (Effect) |
|-----------------------|-----------------|
| (A) Lone pair donation into adjacent π system | (IV) +R effect |
| (B) Attack by electrophile on π electrons | (III) +E effect |
| (C) Withdrawal of electrons through σ bonds | (I) –E effect |
| (D) Withdrawal of electrons from ring via π system | (II) –R effect |`,

'POC-010': `Match List-I with List-II:

**List-I (Mixture):**
(A) Chloroform & Aniline
(B) Benzoic acid & Naphthalene
(C) Water & Aniline
(D) Naphthalene & Sodium chloride

**List-II (Purification Process):**
(I) Steam distillation
(II) Sublimation
(III) Distillation
(IV) Crystallisation

| List-I (Mixture) | List-II (Purification Process) |
|------------------|-------------------------------|
| (A) Chloroform & Aniline | (III) Distillation |
| (B) Benzoic acid & Naphthalene | (IV) Crystallisation |
| (C) Water & Aniline | (I) Steam distillation |
| (D) Naphthalene & Sodium chloride | (II) Sublimation |`,

'POC-040': `Match List I with List II:

**LIST I (Technique):**
(A) Distillation
(B) Fractional distillation
(C) Steam distillation
(D) Distillation under reduced pressure

**LIST II (Application):**
(I) Separation of glycerol from spent-lye
(II) Aniline-Water mixture
(III) Separation of crude oil fractions
(IV) Chloroform-Aniline

| List-I (Technique) | List-II (Application) |
|--------------------|-----------------------|
| (A) Distillation | (IV) Chloroform-Aniline |
| (B) Fractional distillation | (III) Separation of crude oil fractions |
| (C) Steam distillation | (II) Aniline-Water mixture |
| (D) Distillation under reduced pressure | (I) Separation of glycerol from spent-lye |`,

'POC-052': `Match List-I with List-II.

**List-I (Element detected):**
(A) Nitrogen
(B) Sulphur
(C) Phosphorus
(D) Halogen

**List-II (Reagent used/Product formed):**
(I) $\\mathrm{Na_2[Fe(CN)_5NO]}$
(II) $\\mathrm{AgNO_3}$
(III) $\\mathrm{Fe_4[Fe(CN)_6]_3}$
(IV) $\\mathrm{(NH_4)_2MoO_4}$

| List-I (Element) | List-II (Reagent/Product) |
|------------------|--------------------------|
| (A) Nitrogen | (III) $\\mathrm{Fe_4[Fe(CN)_6]_3}$ (Prussian blue) |
| (B) Sulphur | (I) $\\mathrm{Na_2[Fe(CN)_5NO]}$ (purple colour) |
| (C) Phosphorus | (IV) $\\mathrm{(NH_4)_2MoO_4}$ (yellow ppt) |
| (D) Halogen | (II) $\\mathrm{AgNO_3}$ (white/pale yellow ppt) |`,

'POC-067': `Match List I with List II:

**List I (Mixture):**
(A) $\\mathrm{CHCl_3 + C_6H_5NH_2}$ (chloroform + aniline)
(B) $\\mathrm{C_6H_{14} + C_5H_{12}}$ (hexane + pentane)
(C) $\\mathrm{C_6H_5NH_2 + H_2O}$ (aniline + water)
(D) Organic compound in $\\mathrm{H_2O}$

**List II (Separation Technique):**
(I) Steam distillation
(II) Differential extraction
(III) Distillation
(IV) Fractional distillation

| List-I (Mixture) | List-II (Technique) |
|------------------|---------------------|
| (A) $\\mathrm{CHCl_3 + C_6H_5NH_2}$ | (III) Distillation |
| (B) $\\mathrm{C_6H_{14} + C_5H_{12}}$ | (IV) Fractional distillation |
| (C) $\\mathrm{C_6H_5NH_2 + H_2O}$ | (I) Steam distillation |
| (D) Organic compound in $\\mathrm{H_2O}$ | (II) Differential extraction |`,

};

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db;
  const ids = Object.keys(FIXES);
  const docs = await db.collection('questions_v2')
    .find({ display_id: { $in: ids } }, { projection: { _id: 1, display_id: 1 } })
    .toArray();

  let updated = 0;
  for (const doc of docs) {
    const newQ = FIXES[doc.display_id];
    if (!newQ) continue;
    await db.collection('questions_v2').updateOne(
      { _id: doc._id },
      { $set: { 'question_text.markdown': newQ } }
    );
    console.log('FIXED:', doc.display_id);
    updated++;
  }
  console.log(`\nDone. Updated ${updated}/${ids.length} questions.`);
  mongoose.disconnect();
});
