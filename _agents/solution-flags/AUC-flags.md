# AUC — Math Solution Flags

_Last updated: 2026-05-20 04:31_

## 🔴 Blocking — no solution written

- **AUC-043** — Question references areas A₁ and A₂ shown in a figure not extractable from question text. Manual figure re-ingestion required before solution can be written.

## 🟡 Needs verification — solution written, uncertain

- **AUC-042** — Re-derivation gives 17/6 (option b). Stored answer was c (19/6). Verified by two methods: piecewise integration and triangle+segment decomposition. Triangle vertices (-1,1), (1/2, 5/2), (1,1) has area 3/2; parabolic dip from chord y=1 has area 4/3; sum = 9/6 + 8/6 = 17/6.
- **AUC-085** — Re-derivation gives 59/6 (option d). Stored answer was c (53/6). Verified by direct integration: ∫₀¹(x²+3x)dx = 11/6, plus ∫₁³ 4 dx = 8 = 48/6, total = 59/6. The cap y ≤ 4 begins binding at x = 1 where x²+3x = 4. Stored answer appears to be a JEE-key transcription error.
- **AUC-086** — Re-derivation gives λ = 4(4/25)^(1/3) (option c). Stored answer was b (2(4/25)^(1/3)). Cube check: λ^(3/2) should equal 16/5, and only option c satisfies: [4(4/25)^(1/3)]^(3/2) = 4^(3/2)·(4/25)^(1/2) = 8·(2/5) = 16/5 ✓. Option b gives [2(4/25)^(1/3)]^(3/2) = 2√2·(2/5) = 4√2/5 ≠ 16/5. Stored answer is a transcription error.
- **AUC-087** — Re-derivation gives 18 (option b). Stored answer was d (16). Direct integration: ∫_{-2}^{4} (y+4-y²/2) dy = [y²/2 + 4y - y³/6]. At y=4: 8+16-64/6 = 24-32/3 = 40/3. At y=-2: 2-8+8/6 = -14/3. Difference: 40/3+14/3 = 54/3 = 18. Also via 1/6 formula: |k|/6·spread³ = (1/2)/6·216 = 18. Stored answer appears to be a transcription error.

## ⚪ Soft quality — audit notes

_(none)_
