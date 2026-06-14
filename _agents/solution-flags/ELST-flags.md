# ELST — Physics Solution Flags

_Last updated: 2026-06-13 13:13_

## 🔴 Blocking — no solution written

- **ELST-228** — solution present but stored correct_option is null
- **ELST-229** — solution present but stored correct_option is null
- **ELST-230** — solution present but stored correct_option is null
- **ELST-231** — solution present but stored correct_option is null
- **ELST-232** — solution present but stored correct_option is null
- **ELST-233** — solution present but stored correct_option is null
- **ELST-234** — solution present but stored correct_option is null
- **ELST-235** — solution present but stored correct_option is null
- **ELST-238** — solution present but stored correct_option is null
- **ELST-239** — solution present but stored correct_option is null
- **ELST-240** — solution present but stored correct_option is null
- **ELST-241** — solution present but stored correct_option is null
- **ELST-244** — solution present but stored correct_option is null
- **ELST-245** — solution present but stored correct_option is null
- **ELST-247** — solution present but stored correct_option is null
- **ELST-249** — solution present but stored correct_option is null
- **ELST-250** — solution present but stored correct_option is null
- **ELST-251** — solution present but stored correct_option is null
- **ELST-253** — solution present but stored correct_option is null

## 🟡 Needs verification — solution written, uncertain

- **ELST-099** — Key answer x=2 corresponds to radiated power 8 W (x = sqrt(P_rad/2)). If the stated 10% efficiency is applied to an 8 W bulb (P_rad = 0.8 W), x would be sqrt(0.4) ≈ 0.63. Treated the 8 W as the radiated power per the answer key; flag for answer-key verification of the efficiency interpretation.
- **ELST-162** — Stored key was (b), which is the opposite-sign (capacitor) result (zero outside, sigma/eps0 between). The figure shows BOTH sheets as +sigma, so the field is zero BETWEEN and sigma/eps0 OUTSIDE pointing opposite ways = option (d) (the standard JEE Main 2020 answer). Overrode (b) -> (d); flag for answer-key correction.
- **ELST-180** — Stored key was 3. Derivation: uniform sheet field -> constant acceleration from rest -> v = at -> p = mat -> lambda = h/(mat) ~ 1/t -> d(lambda)/dt ~ 1/t^2 -> n = 2. This matches the standard JEE Main 2020 answer (2). Overrode 3 -> 2; flag for answer-key correction.
- **ELST-197** — Problem states mass "4 ug" (4e-9 kg), but the key answer (c) 2e3 m/s requires m = 4e-6 kg (4 mg). The energy drop is 8 J; with 4 ug, v ~ 6.3e4 m/s (no matching option). Treated mass as 4 mg per the answer key; flag the ug/mg unit typo in the question.

## ⚪ Soft quality — audit notes

- **ELST-081** — audit: forbidden phrase: "anchor"
- **ELST-210** — audit: forbidden phrase: "anchor"
- **ELST-211** — audit: forbidden phrase: "anchor"
