# EC — Chemistry Solution Flags

_Last updated: 2026-05-21 17:12_

## 🔴 Blocking — no solution written

- **EC-004** — validation failed: uses forbidden $$ display math
- **EC-005** — validation failed: uses forbidden $$ display math
- **EC-006** — validation failed: uses forbidden $$ display math
- **EC-007** — validation failed: uses forbidden $$ display math
- **EC-008** — validation failed: uses forbidden $$ display math
- **EC-009** — validation failed: uses forbidden $$ display math
- **EC-029** — Question text has unrecoverable typo in resistivity exponent. As stated (ρ = 5 × 10⁻³ Ω·cm, C = 0.8 M, Λm in units of × 10⁻³ S·cm²/mol), the derivation gives κ = 200 S/cm and Λm = 250,000 S·cm²/mol = 2.5 × 10⁸ × 10⁻³ — far from the stored answer 25. To match the stored answer 25 × 10⁻³ S·cm²/mol, the resistivity would need to be 5 × 10⁴ Ω·cm (not 5 × 10⁻³). Cannot solve as-stated; flagging for source-paper verification before writing the solution.
- **EC-033** — validation failed: uses numbered "Step N" enumeration (workflow: prose only)
- **EC-035** — validation failed: missing 🗺️ heading (Working It Out)
- **EC-057** — validation failed: missing 🗺️ heading (Working It Out)
- **EC-102** — validation failed: missing 🗺️ heading (Working It Out)
- **EC-104** — validation failed: uses numbered "Step N" enumeration (workflow: prose only)
- **EC-109** — validation failed: uses numbered "Step N" enumeration (workflow: prose only)
- **EC-146** — validation failed: missing 🗺️ heading (Working It Out)
- **EC-162** — validation failed: missing 🗺️ heading (Working It Out)
- **EC-165** — JEE Advanced 2005 subjective/multi-part question. Has placeholder "Option A/B/C/D" instead of real MCQ options. Original question requires computing (i) ΔG° of AgCl precipitation, (ii) cell representation, (iii) E°_cell, (iv) log Ksp, then (Part B) computing log([Zn²⁺]/[Ag⁺]²) and moles of Ag formed. Not suitable for the current Crucible MCQ/Integer answer format; requires conversion to numerical-value type or split into multiple questions. Skipping solution write until question text is reformatted.
- **EC-166** — JEE Advanced 2004 subjective question. Has placeholder "Option A/B/C/D" instead of real MCQ options. Original question asks for equilibrium constant K of Cu²⁺ + In²⁺ ⇌ Cu⁺ + In³⁺ — should be a numerical value. Not suitable for current MCQ format; requires conversion to numerical-value answer type. Skipping solution write.
- **EC-167** — JEE Advanced 2003 subjective two-part question. Has placeholder "Option A/B/C/D". Part (a) asks for justification of pH change with temperature (descriptive answer); part (b) asks for concentration. Not suitable for MCQ format; should be split into a numerical-value question for part (b) or marked as descriptive. Skipping solution write.
- **EC-168** — JEE Advanced 2001 multi-part subjective question. Placeholder options. Asks for (i) cell reaction (descriptive), (ii) ΔH° and ΔS° (two numerical values), (iii) solubility of AgCl (numerical). Each sub-part requires separate numerical/descriptive answer. Should be reformatted as three separate numerical-value questions. Skipping.
- **EC-169** — JEE Advanced 2000 descriptive question. Placeholder options. Asks to predict direction of current flow and whether current increases/decreases with time — a qualitative/conceptual answer, not MCQ. Should be reformatted as a conceptual question or split into multiple selectable claims. Skipping.
- **EC-182** — JEE Advanced 2006 subjective/numerical question with placeholder Option A-D. Asks for specific conductance value (numerical) — requires conversion to numerical-value answer type instead of MCQ format. Skipping solution write.
- **EC-183** — JEE Advanced 2000 subjective question with placeholder Option A-D. Asks for initial CuSO4 concentration (numerical) — requires conversion to numerical-value answer type. Skipping solution write.
- **EC-186** — validation failed: missing 🗺️ heading (Working It Out); uses numbered "Step N" enumeration (workflow: prose only)
- **EC-202** — validation failed: missing 🗺️ heading (Working It Out)
- **EC-209** — validation failed: missing 🗺️ heading (Working It Out)
- **EC-226** — validation failed: missing 🗺️ heading (Working It Out)
- **EC-231** — validation failed: uses numbered "Step N" enumeration (workflow: prose only)
- **EC-233** — validation failed: missing 🗺️ heading (Working It Out)
- **EC-153** — solution present but stored correct_option is null
- **EC-160** — solution present but stored correct_option is null
- **EC-161** — solution present but stored correct_option is null
- **EC-175** — solution present but stored correct_option is null

## 🟡 Needs verification — solution written, uncertain

- **EC-021** — Stored answer empty; derived 0.25 mol O₂ × 22.7 L/mol = 5.68 L → 6 L (nearest integer).
- **EC-030** — Stored answer was (d); overwritten to (b). Both statements contradict NCERT: KI (strong electrolyte) increases slowly with dilution, not steeply, so Statement I is false; H₂CO₃ (weak electrolyte) increases steeply with dilution, not slowly, so Statement II is also false. Correct answer is (b).
- **EC-052** — log K ≈ 338.4 using 0.0591; would round to 339 using 0.059 exactly. Stored answer 338 matches the 0.0591 convention. Within rounding tolerance.
- **EC-073** — Stored answer was +7 (likely magnitude). Derivation gives [Cu²⁺] = 10⁻⁷ M, so x = -7 per the literal "10^x M" notation. Overwriting to -7.
- **EC-083** — Stored answer empty. Derived E = 1.23 - 0.059×5 = 0.935 V; assuming the question wants the value in × 10⁻³ V format, integer = 935. JEE Main 2020 Jan Shift-I. Original question may have been MCQ format with options like "0.935 V" — please verify against the source paper.
- **EC-088** — Question states F = 96500 but stored answer -412.8 corresponds to F = 96000. Using F = 96500 gives -414.95 kJ/mol. Either way, option (a) is the closest match. Minor numerical inconsistency in the question.
- **EC-096** — Question wording ambiguous — "divalent cation and anion" could mean both divalent (giving 57+73=130, option c) OR salt is M₂X type with monovalent cation + divalent anion (giving 2(57)+73=187, option a). Stored answer 187 matches the latter interpretation; the values 57 and 73 are consistent with monovalent-ion conductivities. Keeping (a).
- **EC-099** — Stored answer was (c), but standard Ostwald-law derivation gives (b). Cross-checked algebraically: starting from Ka(1-α) = α²C and substituting α = Λm/Λm°, the rearranged form is Λm²C - Ka(Λm°)² + Ka·Λm·Λm° = 0, which matches option (b). Option (c) has opposite signs on the Ka terms and is inconsistent with Ostwald law. Overwrote (c) → (b).
- **EC-110** — All four statements appear to be at least partially defensible as "true." Going with stored (a) as the labeled false statement. Possible reason: official key may consider "ionic mobility" as having a more nuanced T-dependence than statement implies. Worth source verification.
- **EC-121** — Overwrote stored 10 to 2. Direct derivation: E°_cell = -0.13 - (-0.14) = 0.01 V, log K = 2×0.01/0.06 = 0.333, K = 2.15 → 2 (nearest integer). For stored K=10, need E°_cell ≈ 0.03 V — possible typo in question E° values relative to original JEE source.
- **EC-122** — Overwrote stored (c) to (a). Sanity check with real values: x=0.80, y=-0.44, z=-0.036. Option (a) gives 0.028 V (matches literature E°_cell for Fe²⁺+Ag⁺→Fe³⁺+Ag, ~0.03 V). Option (c) gives 0.836 V (the wrong reaction).
- **EC-125** — Overwrote stored 1344 to 917. Direct Nernst derivation at pH=3, [Cr2O7²⁻]=0.01, [Cr³⁺]=0.1: log Q = 42, E = 1.33 - 0.059×42/6 = 1.33 - 0.413 = 0.917 V. Stored 1344 mV > E° = 1330 mV would require pH near 0, inconsistent with the given pH=3. Source paper verification recommended.
- **EC-127** — Question wording ambiguous: "ratio of molar conductivity Λ1/Λ2" but uses symbol Λ (without m subscript). Strict molar conductivity gives ratio = 1 (x=1000); specific conductivity ratio gives 0.5 (x=500). Stored 500 matches the specific-conductivity interpretation. Keeping stored.
- **EC-129** — Stored answer field was empty. Set correct_option to (b) based on options[].is_correct flag. Graph analysis (without image inspection) consistent with typical conductometric titration of mixed strong+weak acid.
- **EC-130** — Stored answer field was empty. Set correct_option to (a) based on options[].is_correct flag. Derivation: E°(CO₂/CH₃OH) = E°(O₂/H₂O) − E°_cell = 1.229 − 1.21 = 0.019 V = 19 mV, exactly matching option (a).
- **EC-141** — Database had inconsistent flags: options[].is_correct = (a), stored.correct_option = (d). My chemistry derivation gives (b): Statement I is correct (Ag>Hg>Cu E° ordering matches deposition sequence), Statement II is incorrect (cathode evolves H2, not O2). Set to (b) per derivation.
- **EC-148** — Stored answer empty. Direct derivation: E°_cell = 1.23 - (-0.44) = 1.67 V, n=2, ΔG° = -322 kJ. Matches option (b).
- **EC-149** — Stored answer empty. Going with options[].is_correct = (c). Interpretation: "internal supply" = inside the external power source/battery. Inside source, electrons flow from cathode-side (- terminal) to anode-side (+ terminal). IIT-JEE 2003.
- **EC-150** — Stored answer empty. Filled in (a) per options[].is_correct flag. MnO4- (E°=1.51V) would oxidise Cl- (E°=1.40V) in HCl, giving false high reading for Fe²⁺ titration. So MnO4- is NOT suitable in HCl. IIT-JEE 2002.
- **EC-151** — Stored answer empty. Filled in (c) per options[].is_correct flag and chemistry: KNO3 is preferred for salt bridges because K+ and NO3- have nearly equal mobilities, preventing junction potentials. IIT-JEE 2001.
- **EC-152** — Stored answer empty. Filled in (a) per options[].is_correct flag. Salt bridge ions (K+, NO3-) are inert spectators in galvanic cells. IIT-JEE 2014.
- **EC-153** — Multi-correct JEE Advanced question. Three options correct: (a) V and Hg, (b) Hg and Fe, (d) Fe and V. DB single-answer storage cannot capture this fully. Not setting answer.correct_option. IIT-JEE 2009.
- **EC-154** — Stored 0 was wrong. JEE Advanced 2022 answer is 0.77 V. Set to 77 (assuming × 10⁻² V format) but the original numerical answer is 0.77 V. Source paper verification recommended.
- **EC-155** — Stored answer empty. ΔG = -nFE_cell = -2F(1.1 - 2.303RT/2F) = 2.303RT - 2.2F. Matches option (c). IIT-JEE 2017.
- **EC-156** — Stored answer empty. Filled in (d). 0.092 = 0.151 - 0.0295x; x = 2. IIT-JEE 2016.
- **EC-157** — Stored answer empty. Filled in (d). log Q = 7, n=4, E_cell = 1.67 - 0.059×7/4 = 1.57 V. IIT-JEE 2011.
- **EC-158** — Stored answer empty. Filled in (b). E°_cell = 0.32 V, log K = 0.32/0.0295. IIT-JEE 2004.
- **EC-159** — Stored answer empty. Filled in (b). E°_cell = 0.33 - 0.44 = -0.11 V, so the reverse reaction is spontaneous. IIT-JEE 2000.
- **EC-160** — Multi-correct JEE Advanced question. Three options correct: (B) concentration cell entropy-driven, (C) racemization ΔS>0, (D) chelate effect ΔS>0. Statement (A) is wrong (n=2 gives ΔS=2R, not R). DB single-answer storage cannot capture multi-correct. Not setting answer.correct_option. IIT-JEE 2022.
- **EC-161** — Multi-correct JEE Advanced question. Three options correct: (a) Cd-Ni, (b) Cd-Fe, (c) Ni-Pb. Pair (d) Ni-Fe is NOT correct. DB single-answer storage cannot capture multi-correct. Not setting answer.correct_option. JEE Advanced 2021.
- **EC-164** — Stored empty. JEE Advanced 2018 official answer is -11.62 J/K/mol (the actual numerical value). Set integer to -12 (nearest integer rounding from -11.62). May need verification for exact storage convention.
- **EC-162** — Question has likely typo: E°(Cr²⁺/Cr) given as +0.91 but should be -0.91 V (literature). For R match: my derivation gives -0.36 V but match 1 is -0.18 V (factor of 2 discrepancy, possibly per-atom convention). Going with stored official option (d). IIT-JEE 2013.
- **EC-171** — Stored empty. Filled in (b). Sodium stearate above CMC shows sharp drop in Λm. JEE Advanced 2019.
- **EC-172** — Stored empty. Filled in (d). Cl- replaced by NO3- (similar mobility, flat); then excess AgNO3 raises conductance. JEE Advanced 2011.
- **EC-173** — Stored empty. Filled in (b). t = (0.02 mol × 96500 C/mol) / 0.01 A = 1.93×10⁵ s. JEE Advanced 2008.
- **EC-174** — Stored empty. Filled in (b). K+ > Na+ > Li+ in aqueous mobility due to hydrated radius effect. IIT-JEE 2001.
- **EC-175** — Multi-correct JEE Advanced question. Correct: (a) and (c). DB single-answer storage cannot capture both. Not setting answer.correct_option. JEE Advanced 2024.
- **EC-176** — Stored empty. Filled in (c). JEE Advanced 2024 graph-matching question.
- **EC-177** — Stored empty. Filled in (a). JEE Advanced 2013.
- **EC-178** — Stored 7 retained. Full derivation requires reading graph for Λ°(Z_m X_n) which wasn't analysed here. Algebraic constraints + graph give m+n+p = 7 per JEE Advanced 2022 official key.
- **EC-179** — Stored empty. ΔG° = +100 kJ, ln K = -10, P_H2O = 0.01 bar, P_H2 = 0.01·e^(-10), ln(P_H2) = -2ln(10) - 10 = -14.6. Set integer to -15 (nearest); JEE Advanced 2018 official is -14.6 numerical-value.
- **EC-184** — Stored empty. JEE Advanced 2020 official answer is 13.32 K. Set integer to 13 (nearest).
- **EC-215** — Stored (a) accepted. The exact extrapolation from 0.2 M (12.4×10⁻⁴) to 0.02 M is approximate; the value 124×10⁻⁴ assumes Λm rises by factor 10 with 10× dilution, which is rough for typical strong electrolytes. Question may have implicit assumptions.
- **EC-220** — Stored (a). Question specifies only [Ag⁺] = 0.1 M; my derivation using [Cr³⁺] = 1 M (standard) gives ΔG ≈ -417 kJ, off from stored -422.83. The stored answer likely uses [Cr³⁺] = 0.01 M (giving Q = 10, E_cell = 1.46 V, ΔG = -422.8 kJ). Going with stored.
- **EC-229** — Question states E°_cell = 10.5 V (typo). Correct value is 1.05 V (= 0.80 - (-0.25) for Ag-Ni standard cell). Using 1.05 V gives 0.9615 V, matching option (b).

## ⚪ Soft quality — audit notes

- **EC-027** — Q-text fix requested but "from" string not found
- **EC-130** — Q-text fix requested but "from" string not found
- **EC-152** — Q-text fix requested but "from" string not found
- **EC-175** — Q-text fix requested but "from" string not found
