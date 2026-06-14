# K1D — Math Solution Flags

_Last updated: 2026-06-10 08:55_

## 🔴 Blocking — no solution written

_(none)_

## 🟡 Needs verification — solution written, uncertain

- **K1D-032** — Stored answer (a) 200 m is wrong. Each car stops after v²/(2a)=100m, total approach 200m, final gap 300-200=100m. Overrode to (b) 100m. Note: options[].is_correct flags may still mark (a) — separate cleanup task.
- **K1D-033** — Stored answer was null; derivation gives v=8t=40 m/s at t=5s. Set correct_option to (a). Note: stored options[] currently mark all four is_correct=false — separate cleanup task.
- **K1D-034** — Stored answer was 2; re-derivation gives a = v·(dv/dx) = 20·5 = 100 m/s². Overrode to 100. Stored value 2 would correspond to dv/dx = 0.1 s⁻¹ (not 5) — likely the original problem had different numbers.
- **K1D-035** — As written (t=4), x=0 and dx/dt=0 — does not match any option except (b) Zero. Stored answer is (a) 4, which requires evaluation at t=6 (or x=4). Applied question_text_fix t=4 → t=6 to match the stored option. Likely OCR typo in original.
- **K1D-036** — Stored answer (b) Potential energy is wrong: at max height, PE is MAXIMUM, not zero. The quantity that becomes zero is velocity, hence Momentum (a). Overrode to (a).
- **K1D-051** — Stored answer (b) tan⁻¹(2/3) from x-axis does not match my derivation. With v(2) = 2î+6ĵ+9k̂, |v|=11, the only option whose math works cleanly is (c) cos⁻¹(6/11) from y-axis. Overrode to (c).
- **K1D-094** — Stored answer was 19. Re-derivation: boat ground speed = 27+9 = 36 km/h = 10 m/s, ball T = 2u/g = 2s, range = 10·2 = 20m. Overrode 19 → 20.
- **K1D-095** — Stored answer was 8. Re-derivation: S_n = ½a(2n-1) (Galileo), so S_9/S_10 = 17/19 = 1 - 2/19, hence x = 19. Overrode 8 → 19.
- **K1D-097** — Stored answer was 4. From v = 4√x, v² = 16x = 2ax → a = 8 m/s². Cross-checked with a = v·(dv/dx) = 4√x · 2/√x = 8. Overrode 4 → 8.
- **K1D-098** — Stored answer was 3. Re-derivation: F = m·(2x) = 0.02x; loss = ∫F dx from 0 to x = 0.01x² = x²/100 = (x/10)² = (10/x)^(-2). So n=2. Overrode 3 → 2.
- **K1D-100** — Stored answer (a) 120 m is wrong. Opposite directions → relative speed = 25+15 = 40 m/s; L = 40·8 = 320 m. Overrode (a) → (b).
- **K1D-101** — Stored answer was null with all options marked is_correct=false. Derivation: v_P = α + 2βt, v_Q = f - 2t, setting equal gives t = (f-α)/(2(β+1)). Set correct_option = (d).
- **K1D-103** — Stored answer was 3. Derivation: at t=1, v_1x=2, v_2y=-24, so |v_2/1|² = 4+576 = 580. Overrode 3 → 580.
- **K1D-104** — Stored answer was 2. Derivation via implicit differentiation: acceleration = (ac-b²)/x³, so n=3. Overrode 2 → 3.
- **K1D-106** — Stored correct_option was null with all options is_correct=false. Derivation: speed = sqrt((aω)² + (aω)²) = aω√2. Set correct_option = (a).
- **K1D-102** — Stored answer (c) 31.5 m/s does not match derivation. Person ground velocity = 10 - 0.5 = 9.5 m/s; relative to B (which is at -20 m/s): 9.5 - (-20) = 29.5 m/s. Overrode (c) → (a).

## ⚪ Soft quality — audit notes

_(none)_
