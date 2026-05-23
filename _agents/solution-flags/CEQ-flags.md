# CEQ — Chemistry Solution Flags

_Last updated: 2026-05-22 18:10_

## 🔴 Blocking — no solution written

- **CEQ-013** — validation failed: uses numbered "Step N" enumeration (workflow: prose only)
- **CEQ-076** — Option texts are placeholders ("Option A/B/C/D") — original JEE Advanced 2004 options not preserved. Chemistry answer: ΔG ≈ +5.71 kJ/mol, reverse shift. Need to restore options before assigning correct_option.
- **CEQ-075** — solution present but stored integer_value is null

## 🟡 Needs verification — solution written, uncertain

- **CEQ-014** — Stored answer was (d) "1" — that confused K_p (=1) with x (=10). Re-derivation: with equal moles, each p_i = 1/3 atm; K_p = (1/3)²/((1/3)(1/3)) = 1, and K_p = x × 10⁻¹ ⇒ x = 10. Overwrote to (b).
- **CEQ-024** — Stored answer was 1; derivation yields α = 2%. With Kp = 2×10⁻³ and the small-α approximation, α^{3/2} = √2·Kp = 2^{3/2}·10⁻³, so α = 2·10⁻² = 2%. The previous stored solution derives the same 2% and then arbitrarily wrote "nearest integer = 1" without justification — flagging that and overwriting.
- **CEQ-025** — Stored value was 2; the prior stored solution itself derives K = 4×10⁻³³ and ends with "Answer: 4" — a data-entry mismatch. Re-derived 4×10⁻³³ from K = K₂·K₃³/K₁ = (1.6×10¹²)(10⁻³⁹)/(4×10⁵) = 4×10⁻³³.
- **CEQ-026** — Stored value was 4; the prior stored solution derived 1/(4.47×10⁷) but then wrote "≈ 4×10⁻⁸" — an arithmetic slip (the correct value is 0.224×10⁻⁷ = 2.24×10⁻⁸). Confirmed independently via log: log K_target = -½ log(2×10¹⁵) = -7.65, K_target = 10⁻⁷·⁶⁵ ≈ 2.24×10⁻⁸. So x = 2.
- **CEQ-029** — Stored value was 1; the prior stored solution itself derives Kp ≈ 1.1 atm but then reports "Answer: 1" — that drops the × 10⁻³ format and rounds 1.1 atm to the bare integer 1. The question explicitly asks for Kp in the form x × 10⁻³, so the correct value is x = 1107.
- **CEQ-030** — Stored value was 1107; the prior stored solution itself derives ΔG° ≈ -717 J/mol step-by-step and then jumps to "x ≈ 1107" without justification. Re-derived ΔG° = -RT × ln(4/3) = -8.31 × 300 × 0.2850 = -710.5 J/mol → x ≈ 711 (with the question-supplied log 1.33 = 0.1239 and ln 10 = 2.3). The 1107 value appears to be a copy-error from a different problem.
- **CEQ-031** — Stored value was 710; re-derived 125 from Kc = (0.4)²(0.2)/(1.6)² = 0.0125 = 125 × 10⁻⁴. The chapter CEQ-031 through CEQ-039 show a systematic off-by-one shift in stored answers.
- **CEQ-032** — Stored value was 125; correct answer is 50. At equilibrium, k_f[PtCl₄²⁻] = k_b[Pt(H₂O)Cl₃⁻][Cl⁻], so K_c = k_f/k_b = 4.8×10⁻⁵/2.4×10⁻³ = 0.02 = X, and 1/X = 50.
- **CEQ-033** — Stored value was 50; correct answer is 182. With equimolar start (1 M each) and Q < K = 100, shift is forward: (1+x)/(1-x) = 10 → x = 9/11 → [D] = 20/11 ≈ 1.818 M = 182 × 10⁻².
- **CEQ-034** — Stored value was 182; correct answer is 4 mol. With Kf = 10⁸ and almost all Ag⁺ complexed: complex ≈ 0.8 M, [NH₃]² = 0.8/5 = 0.16, [NH₃] = 0.4 M → free NH₃ = 0.8 mol. Total added = 2(1.6) + 0.8 = 4 mol.
- **CEQ-035** — Stored value was 4; correct answer is 6. With 0.1 mol NH4HS and 20% decomposition: 0.02 mol each NH3 & H2S, p_i = 0.02·RT/V = 0.246 atm, Kp = 0.246² = 0.0605 = 6.05 × 10⁻². Stored values appear shifted by one position in CEQ-031 through CEQ-039.
- **CEQ-036** — Stored value was 6; correct answer is 172. With p_O2 = 530 Pa = 0.530 kPa: Kp = (43)²/((45)²(0.530)) = 1849/1073.25 = 1.72 kPa⁻¹ = 172 × 10⁻².
- **CEQ-037** — Stored value was 172; correct answer is 25. With Kc = 100 and equimolar start at 1 M each: (1+2x)/(1-x) = 10 → x = 0.75 → [C] = 2.5 M = 25 × 10⁻¹. Sanity check: Kc = 2.5²/0.25² = 100 ✓.
- **CEQ-038** — Stored value was 25; correct answer is 1396. Solving x² + 1.844x - 5.532 = 0 gives x = 1.604; [PCl5]_eq = 3 - 1.604 = 1.396 mol = 1396 × 10⁻³.
- **CEQ-039** — Stored value was 1400; correct answer is 16. With solids excluded, Kp = p_O2^(1/2) = 4, so p_O2 = 16 atm.
- **CEQ-043** — Stored value was 5; correct answer is 73. With α = 0.4647 (from 1 + 2α = 1.929 mol total), Kp = 4·α³·P²/((1-α)(1+2α)²) = 0.727 atm² = 72.7 × 10⁻². The prior stored solution shows an arithmetic mismatch.
- **CEQ-046** — Stored value was 1; correct answer is 16. ΔZ = +0.5 → ΔX = ΔY = -0.25. At equilibrium: X=0.75, Y=1.25, Z=1.0. Kc = 1²/(0.75·1.25) = 1/0.9375 = 16/15, so x = 16.
- **CEQ-050** — Stored option was (b); correct is (c). For Δn_g = -2 (Haber), K_p/K_c = (RT)⁻² = 1/(24.62)² ≈ 1.65×10⁻³ with units dm⁻⁶ atm⁻² mol². Option (b) has wrong units on parts (ii) and (iii).
- **CEQ-053** — Stored option was (d) 16; correct is (b) 4. From [A]_eq = [B]_eq: a - x = 1.5a - 2x → x = 0.5a. So [A]=[B]=0.5a, [C]=a, [D]=0.5a. K = (a)²(0.5a)/((0.5a)(0.5a)²) = 0.5a³/0.125a³ = 4.
- **CEQ-057** — Stored option was (a) √(x+y); correct is (d) 2√(x+y). Total pressure = p_B + p_C + p_E = a + (a+b) + b = 2(a+b) = 2√(x+y). Sanity check: with y=0 (single dissociation A→B+C), total p = 2a = 2√x matches (d), not (a).
- **CEQ-058** — Stored value was 4; correct answer is 8. With Kc = 4 and 1 mol A in 1 L: x/(1-x) = 4 → x = 0.8 = [B]_eq → 8 × 10⁻¹ M.
- **CEQ-059** — Stored answer was null; filled in (c). Both statements describe the standard latent-heat-of-fusion behaviour at the ice/water phase boundary: T stays at 0°C until all ice melts (Statement I), because the heat absorbed goes into breaking H-bonds rather than raising KE (Statement II).
- **CEQ-072** — Multi-correct (JEE Advanced 2018). Both (a) ΔH°<0, ΔS°<0 and (c) ΔG°<0, ΔS°<0 are correct. Setting correct_option to (a) for schema compatibility; solution explains both.
- **CEQ-075** — JEE Advanced 2020 — ratio = ΔG°(1000)/ΔG°(2000) = (1000·ln 10)/(2000·ln 100) = 1/4 = 0.25. Decimal answer; question is mis-classified as Integer. JEE official answer key: 0.25. Solution body carries the answer.

## ⚪ Soft quality — audit notes

_(none)_
