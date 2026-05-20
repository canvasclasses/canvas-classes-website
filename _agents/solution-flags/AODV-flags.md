# AODV — Math Solution Flags

_Last updated: 2026-05-19 14:11_

## 🔴 Blocking — no solution written

- **AODV-106** — Question references a figure ("In the figure...") with specific geometric setup involving angles θ₁, θ₂, segments BE, AB, and triangles CAB, CED that cannot be unambiguously reconstructed from the question text alone. The exact configuration (which angles are at which vertices, position of D, E, etc.) determines the optimization. The stored answer is 6 (JEE Main Apr 2023 Shift II official key); please attach the figure or rewrite the problem text with explicit coordinates / vertex labels before this question can be solved cleanly.

## 🟡 Needs verification — solution written, uncertain

- **AODV-075** — Algebra yields tan^{-1}(π/4) + 7 − 9π/(4(9+π²)), not exactly option (a) 8 − 9π/(4(9+π²)). The JEE Main answer key (a) requires treating tan^{-1}(π/4) ≈ 1, which is numerically inaccurate (tan^{-1}(π/4) ≈ 0.665). Likely a JEE-Main key error or question typo (should perhaps be tan(2x) not tan^{-1}(2x)). Solution presents (a) per stored key.
- **AODV-168** — Both options (b) and (c) appear to be FALSE statements under the parity-of-n2 analysis. Both have n2 odd, meaning f<0 on (3,5) with no interior local max. The JEE Main answer key gives (c) only — possible key inconsistency. Solution presents (c) per stored key.
- **AODV-173** — Stored answer was (d); my analysis (and the standard JEE Main 2020 January Shift II key) gives (c). Overriding to (c). The polynomial $f(x) = 2x^3 - (6/5)x^5$ has $f'(x) = 6x^2(1-x^2)$, which gives $x = 1$ as local MAX and $x = -1$ as local MIN. So statement (c) ("x=1 local min and x=-1 local max") is FALSE, while (d) ("x=1 is local max") is TRUE.
- **AODV-181** — Stored answer was (d) but option (d) text contains a typo "f''(f)" which appears to be a transcription error. The correct JEE Main 2020 Sept Shift II answer is (b): "f''(x) = 0 for some x in (0,1)", which follows from applying Rolle's theorem twice. Overriding to (b).
- **AODV-182** — Option (b) is the JEE Main official answer. Technically, this asserts the tangent at $c$ has the same slope as the chord from $c$ to $1$ — a stronger condition than standard LMVT on $[c, 1]$ (which would give the slope-match at SOME point $\xi \in (c, 1)$, not at $c$ itself). For specific $f$ like $f(x) = x^2$, no such $c$ exists strictly inside $(0, 1)$. The intended JEE interpretation is "LMVT applied with $c$ being the LMVT point" — accepted in the official key.

## ⚪ Soft quality — audit notes

_(none)_
