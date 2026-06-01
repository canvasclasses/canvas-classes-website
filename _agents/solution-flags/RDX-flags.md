# RDX — Chemistry Solution Flags

_Last updated: 2026-05-23 14:25_

## 🔴 Blocking — no solution written

- **RDX-083** — solution present but stored correct_option is null
- **RDX-084** — solution present but stored correct_option is null
- **RDX-090** — solution present but stored correct_option is null
- **RDX-092** — solution present but stored integer_value is null
- **RDX-094** — solution present but stored correct_option is null

## 🟡 Needs verification — solution written, uncertain

- **RDX-090** — Multi-correct (a, b, d). Stored answer was empty {} but is_correct flags already set on options correctly.
- **RDX-092** — JEE Adv 2020 numerical answer is 0.11 M (decimal). Stored integer_value is null and remains null because the actual answer is non-integer.
- **RDX-094** — JEE Advanced 2001 subjective question. The DB has placeholder options A/B/C/D — none are correct. Answer is numerical (0.1 M H2O2). Recommend converting to Integer/Numerical answer_type with value 0.1.
- **RDX-023** — Stored correct_option was "a" (2 g) which is the monoprotic-mistake answer. is_correct flags in DB already mark (b) as true. Corrected stored answer to (b).
- **RDX-073** — Stored answer was 100 (the JEE Main 2020 official key); orthodox derivation gives 50 mL using standard n-factors (FeC2O4: n=3, K2Cr2O7: n=6). The discrepancy is well-known in the JEE coaching community.
- **RDX-077** — JEE 2021 Kjeldahl question. The boxed derivation uses the standard %N = 1.4 × NV / m formula. Note: a strict back-titration interpretation (initial acid - back-titrated NaOH) gives meq NH3 = 17.5, leading to %N > 100%, which is impossible. The published answer (63) matches the formula where meq NH3 = NaOH meq directly.
- **RDX-128** — Multi-correct: both (b) KCrO3Cl and (c) CrO5 have Cr at +6. is_correct flags in DB mark both as true.
- **RDX-129** — Multi-correct: all four options (a) HCHO, (b) CH2Cl2, (c) C6H12O6, (d) C12H22O11 have C at 0 average oxidation state. is_correct flags mark all four as true.
- **RDX-130** — Multi-correct: both (b) and (d) are not redox. is_correct flags mark both as true.
- **RDX-131** — Multi-correct: both (a) and (d) are redox. is_correct flags mark both as true.
- **RDX-132** — Multi-correct: (a), (b), (c) are all autoredox/disproportionation. is_correct flags mark all three as true.
- **RDX-133** — Multi-correct: (a) Caro acid, (b) Marshall acid, (c) oleum all have S at +6. is_correct flags mark all three as true.
- **RDX-134** — Multi-correct: (a) and (c) both show decreasing S oxidation states. is_correct flags mark both as true.

## ⚪ Soft quality — audit notes

- **RDX-082** — audit: too short (764 chars); missing 🧠 heading; missing 🗺️ heading; missing ⚡ heading; missing ⚠️ heading; missing $\boxed{...}$; uses $$ display math; uses numbered "Step N" enumeration
- **RDX-083** — audit: too short (489 chars); missing 🧠 heading; missing 🗺️ heading; missing ⚡ heading; missing ⚠️ heading; missing $\boxed{...}$
- **RDX-084** — audit: missing 🧠 heading; missing 🗺️ heading; missing ⚡ heading; missing ⚠️ heading; missing $\boxed{...}$
- **RDX-101** — audit: too short (798 chars)
- **RDX-127** — audit: too short (777 chars)
