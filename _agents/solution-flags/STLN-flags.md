# STLN — Math Solution Flags

_Last updated: 2026-06-13 13:17_

## 🔴 Blocking — no solution written

- **STLN-006** — Structural mismatch: this is the JEE Main 2023 Jan-31 Shift-II problem whose official answer is BC² = 122 (an integer-type question). Our DB stores it as MCQ with options (32, 48, 64, 128) — none of which equals 122. Independent derivation confirms BC² = 122 (sides AB: 2x+y=0, BC: x+py=21a, CA: x-y=3 with centroid P(2,a) → p=11, a=3, B=(-3,6), C=(8,5)). The fix is non-trivial: convert `answer_type` from MCQ to Integer, drop the bogus options, set `answer.integer_value = 122`. This is beyond what `question_text_fix` in apply-batch.js can do — requires manual operator intervention. _(detected: 2026-05-18; re-confirmed: 2026-05-20)_

## 🟡 Needs verification — solution written, uncertain

- **STLN-036** — Solved 2026-05-20 with `question_text_fix`: `P(a, θ)` → `P(a, 0)`. The original θ never reappears as a free variable (α is the rotation angle), so the fix is unambiguous: the math closes cleanly to answer (a) = 4 = stored answer. Spot-check recommended against original PYQ PDF.
- **STLN-052** — Solved 2026-05-20 **without** changing question text. The radius of the circle is determined automatically by the locus argument (orthocentre = centroid for equilateral; centroid traces a circle of radius √2/3 centred at (a/3, b/3)). Matching the given centre (1, 1/3) gives (a, b) = (3, 1), so a² - b² = 8 = stored answer. The "missing radius" concern from the previous pass was a false alarm — the radius is implicit, not needed. Spot-check recommended.
- **STLN-092** — Solved 2026-05-20 with `question_text_fix`: removed "absolute value of" so the wording is "the product of all possible values of $a$". With this, the derived product = -4 matches stored option (d). Alternative fix (changing option (d) text from -4 to 4 and keeping "absolute value of") was rejected as more invasive. Spot-check recommended.

## ⚪ Soft quality — audit notes

- **STLN-061** — audit: uses numbered "Step N" enumeration (workflow: prose only)
- **STLN-110** — audit: forbidden phrase: "anchor"
