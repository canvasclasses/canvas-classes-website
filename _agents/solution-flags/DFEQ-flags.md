# DFEQ — Math Solution Flags

_Last updated: 2026-05-20 07:54_

## 🔴 Blocking — no solution written

_(none — all resolved in retry batches)_

## 🟡 Needs verification — solution written, uncertain

- **DFEQ-091** — Derivation gives 3/β = 1 + ln(3+2√2), i.e. e^{3/β} = e(3+2√2). Stored option (a) text reads e^{3β-1} = e(3+2√2). Likely OCR issue with "3/β" vs "3β-1"; the option mark (a) is consistent with the JEE Main key.
- **DFEQ-112** — Determinant expansion gives non-elementary integral involving Si(x). Stored answer (a) follows the JEE Main key; closed-form derivation needs spot-check against original 2021 Jul Shift-II paper.
- **DFEQ-139** — Exact derivation yields 4 + ln 3 ≈ 5.099. Stored answer 5 reflects the JEE Main key. Likely intends integer rounding or there may be a subtlety in the problem statement.
- **DFEQ-179** — Straightforward derivation from the OCR-rendered DE gives k = 1/320 (so k^{-1} = 320), not 18 as stored. Stored answer follows the JEE Main key — likely the original DE or bounds differ from the OCR rendering. Spot-check against 2022 Jun Shift-II paper.
- **DFEQ-180** — Direct derivation gives α = √(2/3), so 3α² = 2. Stored answer (3α² = 1) corresponds to α = 1/√3, which would require the exponent to be arctan(cot 2x) without the √2 factor. Question text may have OCR issue with the √2 placement; spot-check against 2022 Jun Shift-I paper.
- **DFEQ-181** — Direct derivation gives y(π/4) = π/4 (option c), not π/4 + 1 (stored a). The constant from the limit condition appears to be C = 1, yielding y(π/4) = π/4. Stored answer follows the JEE key.
- **DFEQ-191** — Direct derivation gives |y| = 1, not 4. The integration over the relevant interval simplifies to 0 (the secant-cosecant pieces telescope), forcing y(√(π/3)) = -1. Stored answer (4) follows the JEE key; likely a question-text or scaling issue.
- **DFEQ-194** — Direct derivation gives domain (-2, 3e^{e^{-2/3}}-2) with α + β ≈ 1, not 4. Stored answer follows the JEE key; the domain interpretation may differ from straightforward analysis.

## ⚪ Soft quality — audit notes

_(none)_
