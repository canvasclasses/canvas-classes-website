# STLN — Math Solution Flags

_Last updated: 2026-05-18 13:14_

## 🔴 Blocking — no solution written

- **STLN-006** — BC equation `x + py = 21a` with centroid `P(2, a)` uniquely yields `a=3, p=11, B=(-3,6), C=(8,5)`, so `BC² = 122`. None of the four options (32, 48, 64, 128) match. The RHS of the BC equation is almost certainly OCR-corrupted in the source. Manual review of the original PYQ PDF needed before a solution can be authored. _(detected: 2026-05-18, solution-rewriter pass)_
- **STLN-036** — Question text reads "point P(a, θ)" but θ is also the rotation-angle variable later in the problem. As written, P has two unknown coordinates and the problem is under-determined. Almost certainly an OCR error where "0" became "θ" — with P = (a, 0), the math works out cleanly to α = 30°, a = √3+1, and 3a²tan²α − 2√3 = 4 (matching option (a)). Need confirmation that the original PYQ has P on the x-axis before authoring a solution.
- **STLN-052** — Question text says "orthocentre lies on a circle with centre (1, 1/3)" but does not specify the radius. Without the radius, the constraint is meaningless — any orthocentre lies on infinitely many circles centred at any given point. The original JEE Main July 2022 problem specifies radius 2/3, almost certainly dropped during ingestion. Need confirmation of the missing radius before authoring a solution.
- **STLN-092** — Question asks "absolute value of the product of all possible values of a". Independent derivation: angle-at-origin condition gives a ∈ {-6/7, 14/3}, product = -4. So |product| = 4. None of the four options (6, 8, 2, -4) equals 4. The stored answer (d) = -4 matches the raw product, not its absolute value — suggesting either (i) the question text "absolute value of" is a typo / extra phrase, or (ii) option (d) was meant to be "4" not "-4". Cannot resolve without source PDF.

## 🟡 Needs verification — solution written, uncertain

_(none)_

## ⚪ Soft quality — audit notes

- **STLN-002** — audit: uses numbered "Step N" enumeration
- **STLN-003** — audit: uses numbered "Step N" enumeration
- **STLN-061** — audit: uses numbered "Step N" enumeration
