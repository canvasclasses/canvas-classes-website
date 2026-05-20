# DFIN — Math Solution Flags

_Last updated: 2026-05-20 06:36_

## 🔴 Blocking — no solution written

_(none)_

## 🟡 Needs verification — solution written, uncertain

- **DFIN-025** — stored answer (d) (π−2)/4 disagrees with derivation; re-derived (π−1)/4 via King's Rule pairing — confirmed numerically (Simpson's ≈ 0.5354 vs (π−1)/4 ≈ 0.5354 vs (π−2)/4 ≈ 0.2854). Overwrote to (c).
- **DFIN-111** — NVT answer was missing in DB (stored_answer empty). Derived 3/2 = 1.5; stored as integer_value 1.5.
- **DFIN-149** — stored answer (c) 4/e^2 disagrees with derivation; re-derived e^2/16 = option (d) via Riemann sum + IBP. Numerical check at n=3 gives ~0.27, approaching 0.46 = e^2/16 as n increases, not 0.54 = 4/e^2. Overwrote to (d).
- **DFIN-169** — stored answer (a) 51 disagrees with derivation; re-derived N = 50D via IBP with v = tan^50 x/50. Overwrote to (b).
- **DFIN-177** — stored answer (d) e^2 disagrees; derivation via u = ln x then King's u → 6-u gives integrand sums to 1 over [2,4], hence integral = (1/2)·(4-2) = 1. Overwrote to (c).

## ⚪ Soft quality — audit notes

_(none)_
