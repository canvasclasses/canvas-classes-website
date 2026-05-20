# VCAL — Math Solution Flags

_Last updated: 2026-05-20 12:54_

## 🔴 Blocking — no solution written

_(none)_

## 🟡 Needs verification — solution written, uncertain

- **VCAL-105** — Stored answer was (c) 2; verified independently with both position-vector cross product and specific coordinates that ratio Area(PQR)/Area(ABC) = 3. Overriding to (b).
- **VCAL-106** — Stored answer was 8; verified twice that vec(a)·vec(b) = -7 - lambda^2 = -8 with lambda^2=1. JEE convention may report |vec(a)·vec(b)| = 8 but the mathematical value is -8. Overriding.
- **VCAL-126** — Question appears underdetermined as stated. $\vec{a}\times(\vec{b}+\vec{c})=\vec{0}$ gives $\vec{c}=k\vec{a}-\vec{b}$ for arbitrary $k$, so $\vec{c}\cdot\vec{a}=14k-2$ has no unique value. To get stored answer 29 we would need $k=5/6$, but no such constraint is in the question text. A condition (e.g., $\vec{b}\cdot\vec{c}$ or $|\vec{c}|$ value) is likely missing from the question text. Recommend a hand-check of the source PDF and either adding the missing condition or correcting the answer. Skipping solution write.
- **VCAL-145** — Question text uses $\vec{OP}$ but $P$ is not defined elsewhere; presumably $\vec{OP}$ should be $\vec{OC}$ (the point that divides $AB$ in ratio $\lambda:1$). With that reading, derivation gives $-10\lambda^2 + 8\lambda = 0$, so $\lambda = 4/5$ — not an integer (and stored answer is empty). The original JEE 2020 Sep Shift II question likely has $C$ in place of $P$ or different coefficients. Skipping solution write; needs source-PDF verification.

## ⚪ Soft quality — audit notes

_(none)_
