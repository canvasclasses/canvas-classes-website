# CAPC — Physics Solution Flags

_Last updated: 2026-06-09 08:10_

## 🔴 Blocking — no solution written

_(none)_

## 🟡 Needs verification — solution written, uncertain

- **CAPC-044** — Stored answer 16.36 μC accepted; full topology of opposed-battery circuit not fully derivable from the [FIGURE: ...] text in question_text. Flag for image verification.
- **CAPC-066** — Stored answer was (a) C' = (3+K)/(4K)·C₀ — that is the reciprocal of the correct expression. Physics check: (a) gives C' → C₀/4 as K → ∞, but a thick conducting slab must increase C, not decrease it (CAPC-061 confirms metal slab doubles C for thickness d/2; here with thickness 3d/4 it should give 4C₀). Option (c) gives C' → 4C₀ as K → ∞. Override (a) → (c).
- **CAPC-067** — Stored answer 2; my derivation gives C = ε₀A/(d-t+t/K) = 2ε₀/(0.5+0.5/3.2) = 2ε₀/0.65625 ≈ 3.048ε₀ → rounds to 3. Standard JEE Main 2021 Mar Shift-II partial-dielectric formula. Override 2 → 3.
- **CAPC-098** — Stored answer was (b) 2+√15; my derivation gives 4+√15. Verified by substitution: (1+r)² = 10r with r = 4+√15 gives 40+10√15 = 10(4+√15) ✓. With r = 2+√15: (3+√15)² = 24+6√15 ≠ 10(2+√15) = 20+10√15. Override (b) → (a).

## ⚪ Soft quality — audit notes

_(none)_
