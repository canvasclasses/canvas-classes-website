# BNML — Math Solution Flags

_Last updated: 2026-05-19 09:25_

## 🔴 Blocking — no solution written

- **BNML-040** — Question references a figure ("the missing value in the following figure"), but the question_text.markdown contains no figure data, no Pascal-triangle layout, and no numeric values. Cannot solve without the missing image/diagram. Needs ingestion of the figure or a transcription of the figure values.

## 🟡 Needs verification — solution written, uncertain

- **BNML-028** — Derivation gives 15/4 = 3.75; stored answer 4 matches the NTA-accepted integer rounding. Confirm acceptable rounding policy.
- **BNML-100** — Derivation gives x = 10 (option d). Stored answer was (c) 10^3. The 4th term equals 200 at x = 10 (verified by direct substitution: T4 = 20 * (10^{1/4})^3 * (10^{1/12})^3 = 20 * 10^{3/4} * 10^{1/4} = 20 * 10 = 200). Answer override (c) → (d) applied.
- **BNML-183** — Stored answer (d) "both 14 and 34" is incorrect. Direct modular computation shows expression ≡ 3 mod 7, hence not divisible by 7 or 14. Group as (25^190 - 8^190) - (19^190 - 2^190): each pair has difference 17 → divisible by 17 and by 2 → divisible by 34. But the 19^190 - 2^190 piece is divisible by 7 (since 19 + 2 = 21 = 3·7 and 190 is even), while 25^190 - 8^190 is not (25 + 8 = 33, 25 - 8 = 17; no factor of 7). So overall expression not divisible by 7. Answer override (d) → (c) applied.

## ⚪ Soft quality — audit notes

_(none)_

---

## OCR / question-text fixes applied during ingestion

- **BNML-001** — `\frac{(x+1)}{(x - x^{1/2})}` → `\frac{(x-1)}{(x - x^{1/2})}`. Original OCR had both fraction numerators as `x+1`, but the cube/square-difference identity only makes sense (and gives the JEE-key answer 210) with the second numerator as `x-1`. This is the canonical JEE Main 2025 April Shift 1 form.
- **BNML-002** — `2^{1/2}` → `2^{1/3}`. Sum of rational terms in `(1 + 2^{1/2} + 3^{1/2})^6` is 1296, not 612. With `2^{1/3}` instead, the multinomial enumeration gives exactly 612, matching the stored answer.
- **BNML-114** — `4^{2022}` → `4^{2023}`. Stored fractional answer 4/15 requires odd exponent; `4^{2022}` is even and gives 1/15. Original JEE Main 2023 April form is `4^{2023}`.
