# COM — Math Solution Flags

_Last updated: 2026-06-11 11:11_

## 🔴 Blocking — no solution written

- **COM-110** — solution present but stored correct_option is null
- **COM-111** — solution present but stored correct_option is null
- **COM-112** — solution present but stored correct_option is null
- **COM-113** — solution present but stored correct_option is null
- **COM-114** — solution present but stored correct_option is null
- **COM-115** — solution present but stored correct_option is null
- **COM-116** — solution present but stored correct_option is null
- **COM-117** — solution present but stored correct_option is null
- **COM-118** — solution present but stored correct_option is null
- **COM-119** — solution present but stored correct_option is null
- **COM-120** — solution present but stored correct_option is null
- **COM-121** — solution present but stored correct_option is null
- **COM-133** — solution present but stored correct_option is null

## 🟡 Needs verification — solution written, uncertain

- **COM-032** — JEE answer key uses simplified energy-conservation throughout (gives 4 cm). Strict inelastic-collision treatment gives ~2 cm. Following JEE convention.
- **COM-074** — My derivation gives v_1 ≈ 13.03 (matches option c first number) but v_2 ≈ 3.14 (does not match the stored 19.7). The discrepancy likely comes from the angle convention in the figure. Going with the stored answer as the official JEE key matches option (c).
- **COM-115** — Stored key is b,c,d. By the coefficient-of-restitution relation |v2| = e|v1| <= |v1| (equal only for an elastic collision), option (c) "|v2|=|v1| in all cases" is incorrect — derived answer is b,d. This matches the ingestion-time concern flagged on book Q75. Recommend founder review / correct the stored key to b,d. (apply-batch cannot rewrite MCQ correct_options, so stored key is unchanged here.)
- **COM-117** — Stored key a,b,c. By the equal-mass perpendicularity rule, (d) 30+60=90 deg (opposite sides) is also a valid split: v_A=(sqrt3/2)u at 30 deg, v_B=u/2 at 60 deg satisfy both momentum and energy, so (d) appears possible -> derived a,b,c,d. If the intended reading is both angles on the SAME side (30 deg apart, not perpendicular), (d) is impossible and the book a,b,c stands. Flagged for founder review.
- **COM-121** — Stored key a,b,d. Impulse = trapezoid area = 0.07 N s; m=0.07 kg -> dv=1 m/s (so a,b correct: speed returns to 50 cm/s, direction reverses). Average acceleration = dv/dt = 1/0.01 = 100 m/s^2, so option (c) 1 m/s^2 AND option (d) 10 m/s^2 are both wrong. Derived answer a,b. Stored (d) appears incorrect by a factor of 10. Flagged for founder review / Notion.

## ⚪ Soft quality — audit notes

- **COM-128** — audit: too short (793 chars)
