# QUAD — Math Solution Flags

_Last updated: 2026-05-18 16:08_

## 🔴 Blocking — no solution written

_(none)_

## 🟡 Needs verification — solution written, uncertain

- **QUAD-007** — JEE 2021 Feb Sh-I — problem statement says "p, q positive" but the official answer (d) has complex roots; no real positive p, q satisfy p+q=2 with p^4+q^4=272 (would need p^4+q^4 < 32). The algebra path picks pq=16 over pq=-8. Educationally we honour the official key and call out the wording slip in the warning section.
- **QUAD-010** — JEE 2020 Sep Sh-I — official answer is (c). As stored in DB, option (c) reads "B - A = (-3, 5)" which is actually correct, making no option false. The original JEE paper likely had option (c) as "B - A = [-3, 5)" (closed at -3) — that is the false statement. Recommend manually verifying the option text against the original 2020 JEE Sep paper and fixing the boundary if needed.
- **QUAD-039** — JEE 2024 Jan Sh-I — problem says "minimum possible value of lambda" with constraints lambda/2, lambda/3 not integers. Smallest integer lambda in [69, 1225) coprime to 6 is 71, but that gives irrational roots and expression ~12.59 (non-integer). For an integer-answer question, the intended reading is "smallest lambda for which both alpha and beta are positive integers", giving lambda=325 and answer=36. Please cross-check against the official JEE 2024 answer key.
- **QUAD-051** — JEE 2024 — the coefficient simplification involves multiple log-tower identities. The constant term in the stored question_text "3(3^{log_3 5})^{1/3} - 5^{(log_5 3)^{2/3}} - 1" may have minor formatting issues; the JEE-intended simplification gives constant = -3 (verified by working backward from the official answer (b)). Recommend visually rechecking the rendered question against the JEE source paper.
- **QUAD-052** — JEE Main 2021 — after cross-multiplication the resulting quartic 2x^4 - 10x^3 - 20x^2 + 160x - 7 = 0 has Vieta sum 5 but only 2 real roots (~-3.68 and ~0.04, sum ~-3.64). The stored question text may have an OCR/typo issue — the JEE-intended answer 5 only matches if all 4 roots are real, which the stored coefficients do not support. Recommend comparing the question text against the original JEE paper.
- **QUAD-077** — JEE 2022 — the stored equation log_2(9^{2alpha-4}+1) - log_2((5/2)·3^{2alpha-4}+1) = 2 reduces to u^2 - 10u - 3 = 0 with u = 3^{2alpha-4}, giving irrational alpha values that do not match the option (a) = 10 answer. The JEE-intended simplification likely yields nice integer alpha values (probably alpha = 2, 3) where some constant or sign in the question text is different. The official answer (a) 10 is preserved; recommend manual verification of the stored question text against the original JEE paper.
- **QUAD-088** — JEE 2024 — derivation gives a^2 + c^2 = 117 (with a=9, c=6, b=36/5), but 117 is not among the listed options. Closest option is (b) 113. Likely a typo in the stored question (perhaps b should be a different value) or the option list. Recommend cross-checking against the original JEE paper.
- **QUAD-091** — JEE 2019 — the stored expression (q^2 + r^2)/p^2 evaluates to 272 with q=4p, r=16p, which does not match any of the listed options. The JEE-intended answer matches the common ratio q/p = r/q = 4, suggesting the stored target expression has a typo. Recommend cross-checking against the original JEE paper.
- **QUAD-107** — JEE 2022 — same issue as QUAD-077: the stored inner equation reduces to u^2 - 10u - 3 = 0 with irrational roots, not matching the JEE-intended clean integer answer 10. The stored question text likely has a typo. Recommend cross-checking against the original JEE source paper and possibly de-duplicating with QUAD-077.
- **QUAD-110** — JEE — the stored equation e^{2x} - 11e^x - 45e^{-x} + 81/e^x = 0 reduces to e^{2x} - 11e^x + 36e^{-x} = 0 (i.e., -45 + 81 = 36 in the e^{-x} coefficient). Multiplying by e^x gives u^3 - 11u^2 + 36 = 0 with positive roots u = 2 and (9 + sqrt 153)/2. Sum of x-roots = ln(9 + sqrt 153), so P = 9 + sqrt 153 ~ 21.37, NOT an integer. The JEE-intended answer is likely 45 (a common JEE value), suggesting the stored question has a typo. Recommend verifying against the original JEE source paper.

## ⚪ Soft quality — audit notes

_(none)_
