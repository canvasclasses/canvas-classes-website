# CURR — Physics Solution Flags

_Last updated: 2026-06-13 13:37_

## 🔴 Blocking — no solution written

- **CURR-334** — solution present but stored correct_option is null
- **CURR-335** — solution present but stored correct_option is null
- **CURR-336** — solution present but stored correct_option is null
- **CURR-337** — solution present but stored correct_option is null
- **CURR-338** — solution present but stored correct_option is null
- **CURR-341** — solution present but stored correct_option is null
- **CURR-342** — solution present but stored correct_option is null
- **CURR-343** — solution present but stored correct_option is null
- **CURR-344** — solution present but stored correct_option is null
- **CURR-345** — solution present but stored correct_option is null
- **CURR-346** — solution present but stored correct_option is null
- **CURR-348** — solution present but stored correct_option is null
- **CURR-349** — solution present but stored correct_option is null
- **CURR-350** — solution present but stored correct_option is null
- **CURR-352** — solution present but stored correct_option is null
- **CURR-353** — solution present but stored correct_option is null
- **CURR-354** — solution present but stored correct_option is null
- **CURR-355** — solution present but stored correct_option is null
- **CURR-356** — solution present but stored correct_option is null
- **CURR-357** — solution present but stored correct_option is null
- **CURR-360** — solution present but stored correct_option is null
- **CURR-361** — solution present but stored correct_option is null
- **CURR-362** — solution present but stored correct_option is null
- **CURR-363** — solution present but stored correct_option is null
- **CURR-364** — solution present but stored correct_option is null
- **CURR-365** — solution present but stored correct_option is null
- **CURR-366** — solution present but stored correct_option is null
- **CURR-367** — solution present but stored correct_option is null
- **CURR-368** — solution present but stored correct_option is null
- **CURR-370** — solution present but stored correct_option is null
- **CURR-373** — solution present but stored correct_option is null
- **CURR-374** — solution present but stored correct_option is null
- **CURR-375** — solution present but stored correct_option is null
- **CURR-378** — solution present but stored correct_option is null
- **CURR-379** — solution present but stored correct_option is null
- **CURR-380** — solution present but stored correct_option is null

## 🟡 Needs verification — solution written, uncertain

- **CURR-123** — Stored answer was 10; re-derived current ratio I_parallel/I_series = n exactly (since each resistor R=10Ω equals internal r=10Ω). A 20x increase requires n=20, not 10. Overwrote to 20 (matches official JEE Main 2021 key).
- **CURR-157** — Stored answer was empty. Re-derived I_1 by full nodal analysis (V_T=3 V, V_M=3 V, V_B=1 V) giving I_1 = 1.5 A; result is independent of both cell polarities (proved via mesh elimination). NOTE: answer_type is 'Integer' but the true JEE value is 1.5 A (JEE Main 30 Jan 2023) — stored as 1.5.
- **CURR-364** — Q79: book key marks all four (a,b,c,d). Standard energy accounting for a charging cell gives chemical-storage rate = εi and heat rate = i²r (total input εi+i²r), so option (b)'s 'stores chemical energy at εi − i²r' is internally inconsistent with option (a)'s 'absorbs εi'. (c) V=ε+ir and (d) internal heat are unambiguous. Flagged for founder review — NOT overridden (kept book key); possible book looseness in the (a)/(b) wording.

## ⚪ Soft quality — audit notes

_(none)_
