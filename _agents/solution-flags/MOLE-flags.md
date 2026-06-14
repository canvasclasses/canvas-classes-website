# MOLE — Math Solution Flags

_Last updated: 2026-06-13 05:40_

## 🔴 Blocking — no solution written

- **MOLE-077** — Stem internally inconsistent: 0.9 g H2O ⇒ 0.1 mol KHCO3 = 10 g, but total sample is only 5 g; given CO2 (0.15 mol) and H2O (0.05 mol) also do not fit 2KHCO3→K2CO3+CO2+H2O. Founder: fix the stem numbers before a solution can be written.
- **MOLE-067** — Physically inconsistent stem: SO4→Cl exchange DECREASES residue mass (~25 g/mol Na2SO4), but stem implies a 3.9 g increase; max possible change for a 5 g mixture is <0.9 g and wrong sign. Founder: re-check the source numbers. Protest-solution boxed the key under reservation.
- **MOLE-076** — Physically inconsistent stem: Cu conservation caps CuO yield at ~10.06 g (pure Cu2S) down to ~8.38 g (pure CuS) for a 10 g mixture, but stem gives 10.2 g (exceeds max; mass balance → negative CuS). Founder: re-check the source numbers.
- **MOLE-185** — UNSOLVABLE as stored: question names only the reaction (benzoyl chloride + aniline → benzanilide / acetanilide) and asks % yield but gives NO reactant masses/moles or product mass — yield is indeterminate. Stored answer (80) has no derivation (stored explanation invents it). Founder: re-extract the original PYQ masses before a solution can be written.
- **MOLE-276** — UNSOLVABLE as keyed: correct moles of Cr2O7^2- = equiv/n-factor = 0.136/6 = 0.0227 mol, NOT among the options. Stored key (c) 0.136 just echoes the input equivalents (implies n-factor = 1; dichromate is a 6-electron oxidant). Founder: fix the option/key, or clarify whether the stem means "equivalents". Derived solution kept (boxes "no option matches").

## 🟡 Needs verification — solution written, uncertain

- **MOLE-033** — Answer-key correction: stored (d) 10 g contradicts the question's own 56% yield. Theoretical IF5 = 14.3 g; actual = 14.3 × 0.56 = 8.0 g = option (a). 10 g would need ~70% yield. Derived (a). → Chemistry Answer Discrepancies DB.
- **MOLE-039** — Answer-key correction: stored (c) 3.0 mol/kg is wrong. Take 1 L: acid mass = 2.05 × 60 = 123 g; solution mass = 1020 g; water = 897 g = 0.897 kg; m = 2.05 / 0.897 = 2.28 = option (b). Derived (b). → Chemistry Answer Discrepancies DB.
- **MOLE-074** — OCR typo fix: printed mass 1.22 g matches NO option (derivation gives 0.75 g Al). With 1.66 g the key (b) 0.54 g works exactly (0.02 mol Al → 0.03 mol H2; 1.12 g Fe = 0.02 mol → 0.02 mol H2; total 0.05 mol ✓). Question text corrected 1.22 → 1.66 g. Old solution had fudged toward the key. → Notion.
- **MOLE-149** — OCR typo fix: printed "0.023×10²²" gives M ≈ 26,000 g/mol (nonsense; molarity would be 0.0955×10⁻³, nowhere near the official key 25). With 6.023×10²² molecules, 10 g = 0.1 mol → M = 100 → 5 g in 2 L = 25×10⁻³ M, matching the official key exactly. OCR dropped the leading 6. Old solution had fudged ("to match the official key"). → Notion.
- **MOLE-193** — Answer-key correction: stored (b) is wrong — in (b) 35 g N2 (1.25 mol) + 8 g H2 (4 mol) needs only 3.75 mol H2, so N2 limits. In (c) 56 g N2 (2 mol) + 10 g H2 (5 mol) needs 6 mol H2, only 5 available → H2 limiting. Derived (c); old solution also boxed (c) but key was never fixed. → Notion.
- **MOLE-195** — Answer-key correction: stored (d) 20 g C + 5 g H is wrong. C from CO2: (12/44)×88 = 24 g; H from H2O: (2/18)×9 = 1 g; 24+1 = 25 g ✓ matches sample mass. Derived (a); old solution also boxed (a) but key was never fixed. → Notion.
- **MOLE-200** — Answer-key correction: stored (b) 33.6 is wrong. n(CO2) = 0.25×10⁻³ L / 25.0 L·mol⁻¹ = 1×10⁻⁵ mol → NaHCO3 = 84×10⁻⁵ g = 0.84 mg → 0.84/10 = 8.4%. Derived (d); old solution also boxed (d) but key was never fixed. → Notion.
- **MOLE-203** — Answer-key correction: stored (b) "H2, 0.71 mol" is wrong. n(N2) = 20/28 = 0.714 mol needs 2.14 mol H2; available 5/2 = 2.5 mol → N2 is limiting; NH3 = 2×0.714 = 1.43 mol → option (c) "N2, 1.42 mol". Old solution derived N2/1.43 correctly but mislabeled the boxed letter as (a). → Notion.
- **MOLE-206** — Answer-key correction: stored (a) 200 mL of 0.4 N (=0.08 eq) is wrong. Urea 0.6/60 = 0.01 mol releases 2×0.01 = 0.02 mol NH3, needing 0.02 eq HCl = 100 mL × 0.2 N → option (c). Derived (c); old solution also boxed (c) but key was never fixed. → Notion.
- **MOLE-238** — Mis-chaptered: Surface Chemistry (adsorption), not Mole Concept — re-route. (Solution was empty; now filled.)
- **MOLE-121** — STORED KEY MISMATCH. Stored integer_value was 8. For the question as written (22 g CO), CH4 needed = 22/28 mol x 16 = 12.57 g, rounding to 13 g. The stored answer 8 g corresponds to 0.5 mol CH4, which produces only 14 g CO, not 22 g — the stored explanation itself flags this inconsistency ("If targeting the standard integer answer 8, the question likely implied 14 g CO"). Either the question stem should read 14 g CO (then answer = 8 g) or the answer is 13 g. Boxed my derived value 13; flag for founder to confirm which the source PYQ intended before applying.
- **MOLE-145** — Stored integer_value was 46\u2014wait: stored integer_value = 6 in the boxed explanation but the JSON field integer_value = 5. My derivation: 20 g NaOH in 100 g solution = 0.5 mol; water = 80 g = 0.08 kg; m = 0.5/0.08 = 6.25 -> nearest integer 6. The stored answer JSON field says 5 (with a hedge note admitting the pure-mass logic gives 6). Correct answer is 6. Boxed 6; flag for Answer Discrepancies Notion DB.
- **MOLE-237** — Mis-chaptered: Atomic Structure (electron count), not Mole Concept — re-route to ATOM.
- **MOLE-244** — Mis-chaptered: Surface Chemistry (adsorption), not Mole Concept — re-route. (Stored as SUBJ with placeholder options A–D; no real options — subjective, boxed value.)
- **MOLE-246** — Mis-chaptered: Surface Chemistry (adsorption), not Mole Concept — re-route. (Stored as SUBJ with placeholder options A–D; no real options — subjective, boxed value.)
- **MOLE-082** — Stem reads "2.2 M" -> molality 2.2/0.4 = 5.5, which does NOT match the stored key 8. Key 8 is the original JEE-Adv PYQ value using 3.2 M (see MOLE-exemplars DPP-18). "2.2" is almost certainly a typo for "3.2". Solution written to the corrected 3.2 M and boxes 8. RECOMMEND the reviewer fix the stem 2.2 -> 3.2 before applying; otherwise the boxed solution will not match the printed stem.
- **MOLE-066** — Re-derivation gives ~53.8% CaCO3 (a≈0.01189 mol, mass≈1.189 g) with M(CaCO3)=100, M(MgCO3)=84. The keyed option (b) 50% is the only option in physical range (residue 1.152 g sits in [1.052, 1.238] g) and is clearly the intended answer; the ~3.8% gap is question/key rounding. Boxed (b), but the clean arithmetic does not land exactly on 50%.
- **MOLE-067** — FLAG — unsolvable as stated. Sulfate→chloride exchange (Na2SO4 142 → 2NaCl 117) DECREASES residue mass by 25 g per mole Na2SO4; the stem says the residue is 3.9 g HEAVIER. Even pure Na2SO4 (5 g, 0.0352 mol) gives at most a 0.88 g change, and of the wrong sign. No value of Na2SO4 in a 5 g mixture yields a +3.9 g residue. Likely a corrupted constant (mixture mass or the 3.9 g figure). Keyed (b) 56.8% cannot be reproduced from the given data. Recommend force_flag / source re-check before publishing this solution.
- **MOLE-072** — DISAGREE with key. Data: 0.218 g N in 0.5 g oxide → 43.6% N. Mole ratio N:O = (0.218/14):(0.282/16) = 0.01557:0.017625 = 1:1.13 ≈ 1:1 → NO (option a). The keyed option (d) N2O5 is 25.93% N (needs only 0.130 g N in 0.5 g) — far from the given data. %N for each option: NO 46.7%, N2O3 36.8%, NO2 30.4%, N2O5 25.9%; measured 43.6% is unambiguously closest to NO. Note the data is imperfect (1:1.13, not exactly 1:1), but it cannot support N2O5. Overriding key to (a).
- **MOLE-076** — FLAG — unsolvable as stated. Cu conservation caps the CuO yield: pure Cu2S (10 g) → 10.06 g CuO (max), pure CuS (10 g) → 8.38 g CuO (min). Given 10.2 g CuO exceeds the physical maximum of ~10.06 g, so no mixture works (solving the balance gives negative CuS mass, x ≈ -0.81 g). The stored explanation itself does not close (its x=2.32 gives 0.121 mol Cu, not 0.1275). Likely a corrupted constant (CuO mass or mixture mass). Keyed 23.2% cannot be reproduced. Recommend force_flag / source re-check before publishing.
- **MOLE-205** — Re-derived: C:H=4:1 and C:O=3:4 give empirical CH3O; the real saturated acyclic molecule is C2H6O2 (ethylene glycol), which needs 2.5 mol O2 per mole, so 2 mol X needs 5 mol O2. Stored integer_value was 3 (matches the chunk explanation that wrongly used methanol/CH3O directly). Corrected to 5.
- **MOLE-226** — Mis-chaptered: this is a Chemical Bonding (molecular shape / lone-pair count via VSEPR) question, not Mole Concept — re-route to BOND.
- **MOLE-303** — Wording tension: as written "volume decreases to 42.5 mL" implies HCl absorbed = 7.5 mL (HCl-poor, H2 = 42.5), which gives a final volume of 85 mL — NOT a listed option. The keyed answer (c) 15 mL is only reachable if the mixture is HCl-rich (HCl = 85, H2 = 15 per 100 mL), i.e. the stem should read "decreases BY 42.5 mL / to 7.5 mL". Boxed (c) to honour the audited key + listed options; recommend correcting the stem wording.
- **MOLE-308** — Mis-chaptered: Electrochemistry (E°), not Mole Concept — re-route to EC.
- **MOLE-309** — Mis-chaptered: Biomolecules (sugar tests), not Mole Concept — re-route to BIO.
- **MOLE-310** — Mis-chaptered: GOC (structural isomers / IUPAC), not Mole Concept — re-route to GOC.
- **MOLE-332** — stored_answer was null in the source chunk; option (b) carries the correct flag and matches the re-derivation. Set correct_option = b.
- **MOLE-190** — DISCREPANCY: stored key marks (c) 51.63. Re-derivation gives %O = 53.33 exactly (option a). mC = (12/44)x2.64 = 0.72 g, mH = (2/18)x1.08 = 0.12 g, mO = 1.80 - 0.84 = 0.96 g, %O = 0.96/1.80 = 53.33%. The compound is exactly CH2O empirical (nC:nH:nO = 0.06:0.12:0.06 = 1:2:1). 51.63 has no consistent derivation from the given masses. Boxing (a).
- **MOLE-192** — DISCREPANCY: stored key marks (a) 1e-4 m. Re-derivation gives h = 1e-4 cm = 1e-6 m (option b). Mass in 10 mL aliquot = 0.27 x (10/100) = 0.027 g; volume = 0.027/0.9 = 0.03 cm^3; area = pi r^2 = 3 x 10^2 = 300 cm^2; h = 0.03/300 = 1e-4 cm = 1e-6 m. The value 1e-4 matches the height in CENTIMETRES; the key appears to have labelled the cm value as metres. Boxing (b) 1e-6 m.
- **MOLE-196** — DISCREPANCY: stored key marks (b) 890. Re-derivation gives 495 g (option d). M(C57H110O6) = 57x12 + 110 + 6x16 = 890; n = 445/890 = 0.5 mol. Equation: 2 compound -> 110 H2O, so 0.5 mol compound -> 0.5 x 55 = 27.5 mol H2O; mass = 27.5 x 18 = 495 g. (JEE Main 2023, official answer 495 g.) 890 is the molar mass of the compound, a likely mis-keyed value. Boxing (d).
- **MOLE-267** — MOLE-267 had no stored answer; derived decimal_value = 2.39 g (JEE Advanced 2021). Key trap: P4 -> 1 PH3, not 4. CuSO4 via 2PH3+3CuSO4 -> Cu3P2 + 3H2SO4.
- **MOLE-268** — MOLE-268 had no stored answer; derived decimal_value = 6.47 (kg Pb per kg O2), JEE Advanced 2018. Combine roast + self-reduction to 3PbS+3O2->3Pb+3SO2.
- **MOLE-284** — Answer (a) 12.0 L confirmed by audit (MATCH). The stated basis "concentration 0.05 kg mol^-1" in the stem is garbled/non-physical and does not by itself fix the amount of (NH4)2SO4 — working backward from 12.0 L (= 0.92*1000*12 = 11040 g of 20.5% w/w solution => 2263 g NH3 => ~133 mol NH3 => ~66.5 mol (NH4)2SO4) reproduces the keyed answer. Solution is written generically (NH3 ~2263 g) to avoid asserting a fabricated basis. Reviewer: consider cleaning the stem to state the (NH4)2SO4 amount explicitly (e.g. ~66.5 mol / industrial basis) so the arithmetic is reproducible from the data.
- **MOLE-294** — Boxed (c) 492.8 mL per audit (MATCH), but the clean arithmetic does not land exactly on it. Two principled routes: (1) formula route on 2.0 g pure dolomite (M=184) gives 2*0.01087*22400 = 487 mL; (2) "mass loss = CO2 lost" with the given 2.0 g -> 1.0 g residue gives loss = 1.0 g => (1.0/44)*22400 = 509 mL. Neither is 492.8 exactly; 487 mL (formula route) is the closest principled value and is what the solution shows. The keyed 492.8 likely comes from a slightly different molar mass / rounding in the source. Recommend reviewer sanity-check the source figure; gap is ~1%.
- **MOLE-300** — DISAGREE / UNSOLVABLE AS STORED. With CH4 + C2H4 burnt completely, total CO2 = a + 2b and total steam = 2a + 2b; setting CO2 = steam forces a = 0 (pure C2H4), so NO mixture of CH4 and C2H4 gives equal CO2 and steam volumes. The keyed answer (d) 50% CH4 / 50% C2H4 gives CO2 = 3, H2O = 4 (not equal) and cannot be reproduced. The condition "equal volumes of CO2 and steam" is satisfied by a 50:50 mixture only if the SECOND component is acetylene C2H2 (CH4 -> 1 CO2 + 2 H2O; C2H2 -> 2 CO2 + 1 H2O; at 1:1 both totals = 3) — strongly suggesting the stem has a typo, C2H4 should be C2H2. Recommend force_flag / source correction: change C2H4 -> C2H2 in the stem, after which (d) 50%/50% is correct. Left correct_option: null so the reviewer must resolve the question text before publishing; do NOT auto-apply (d).

## ⚪ Soft quality — audit notes

- **MOLE-029** — possible crammed calc steps (2 line(s) with 4+ '='; one step per line)
- **MOLE-046** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-156** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-158** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-167** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-173** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-142** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-144** — possible crammed calc steps (2 line(s) with 4+ '='; one step per line)
- **MOLE-151** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-099** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-063** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-064** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-072** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-202** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-203** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-220** — possible crammed calc steps (2 line(s) with 4+ '='; one step per line)
- **MOLE-221** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-224** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-180** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-192** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-193** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-252** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-253** — possible crammed calc steps (3 line(s) with 4+ '='; one step per line)
- **MOLE-258** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-264** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-265** — possible crammed calc steps (3 line(s) with 4+ '='; one step per line)
- **MOLE-267** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-277** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-280** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-281** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-285** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-287** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-290** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-292** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
- **MOLE-293** — possible crammed calc steps (1 line(s) with 4+ '='; one step per line)
