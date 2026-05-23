# SOL — Chemistry Solution Flags

_Last updated: 2026-05-21 14:04_

## 🔴 Blocking — no solution written

- **SOL-001** — validation failed: uses forbidden $$ display math
- **SOL-002** — validation failed: uses forbidden $$ display math
- **SOL-004** — validation failed: uses forbidden $$ display math
- **SOL-005** — validation failed: uses forbidden $$ display math
- **SOL-007** — validation failed: uses forbidden $$ display math
- **SOL-008** — validation failed: uses forbidden $$ display math
- **SOL-009** — validation failed: uses forbidden $$ display math
- **SOL-010** — validation failed: uses forbidden $$ display math
- **SOL-049** — validation failed: uses numbered "Step N" enumeration (workflow: prose only)
- **SOL-066** — validation failed: uses numbered "Step N" enumeration (workflow: prose only)
- **SOL-122** — validation failed: uses numbered "Step N" enumeration (workflow: prose only)
- **SOL-166** — Question text appears truncated. Polymerization kinetics problem needs more data (k or t1/2 for A polymerization, or specific final amount of A remaining) to compute final vapour pressure. Options in DB are placeholders (Option A, B, C, D) without numerical values. Cannot derive answer from given text.
- **SOL-182** — Question text missing the mass of solvent. Cannot compute molality without it. Options (a)-(d) shown as placeholders without numerical values. If solvent mass assumed = 1 kg, dimerization fraction calculates to ~75%, but assumption is not stated.
- **SOL-213** — validation failed: missing ⚡ heading (The Smart Move)

## 🟡 Needs verification — solution written, uncertain

- **SOL-031** — Question text had molalities swapped (1.5 ↔ 4.5) so the given values did not match stored answer (c). Applied question_text_fix to restore the intended numbers; derivation then matches stored answer.
- **SOL-065** — Stored answer (a) = "(A) and (C)" contradicts graph: X is leftmost curve (highest VP, weakest forces), Z is rightmost (lowest VP, strongest forces). So X<Y<Z in intermolecular forces. (A) says X>Y (FALSE), (B) says X<Y (TRUE), (C) says Z<Y (FALSE). Only (B) is true → option (c). Overrode (a)→(c).
- **SOL-069** — Stored answer (d) gives p = 0.02 × 0.5 = 0.01 bar (not 1 bar) for γ. Option (c) checks out exactly: p = 500 × 0.5 = 250 bar for δ. Overrode (d)→(c) after verifying math twice.
- **SOL-151** — Stored answer (b) misassigns chloroform+acetone (forms max boiling azeotrope, not dimerization) and acetic acid+benzene (dimerizes, not max azeotrope). Option (d) gives the textbook-correct mapping.
- **SOL-156** — Stored integer 125 appears to use × 10^-1 implicit format. Plain molarity (nearest integer) is 13. Overrode 125 → 13.
- **SOL-164** — Exact answer is 0.2 bar (decimal). Nearest integer is 0. JEE Advanced numerical type accepts 0.2 directly.
- **SOL-185** — Options shown as placeholders (Option A, B, C, D) without numerical values. Computed depression = 0.229 K; selected (a) as primary placeholder since no actual option text is available.
- **SOL-215** — Stored answer (a) 115 g/mol does not match math: isotonic with 1.5% urea (M=60) gives M_subst = (5.25 × 60)/1.5 = 210 g/mol, matching option (c). Overrode (a) → (c).

## ⚪ Soft quality — audit notes

_(none)_
