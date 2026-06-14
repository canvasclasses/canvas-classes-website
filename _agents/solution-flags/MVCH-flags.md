# MVCH — Physics Solution Flags

_Last updated: 2026-06-13 13:46_

## 🔴 Blocking — no solution written

- **MVCH-226** — solution present but stored correct_option is null
- **MVCH-227** — solution present but stored correct_option is null
- **MVCH-228** — solution present but stored correct_option is null
- **MVCH-229** — solution present but stored correct_option is null
- **MVCH-230** — solution present but stored correct_option is null
- **MVCH-231** — solution present but stored correct_option is null
- **MVCH-232** — solution present but stored correct_option is null
- **MVCH-233** — solution present but stored correct_option is null
- **MVCH-234** — solution present but stored correct_option is null
- **MVCH-235** — solution present but stored correct_option is null
- **MVCH-236** — solution present but stored correct_option is null
- **MVCH-237** — solution present but stored correct_option is null
- **MVCH-239** — solution present but stored correct_option is null
- **MVCH-241** — solution present but stored correct_option is null
- **MVCH-242** — solution present but stored correct_option is null
- **MVCH-243** — solution present but stored correct_option is null
- **MVCH-244** — solution present but stored correct_option is null
- **MVCH-245** — solution present but stored correct_option is null
- **MVCH-247** — solution present but stored correct_option is null
- **MVCH-248** — solution present but stored correct_option is null
- **MVCH-250** — solution present but stored correct_option is null
- **MVCH-268** — solution present but stored correct_option is null
- **MVCH-269** — solution present but stored correct_option is null
- **MVCH-270** — solution present but stored correct_option is null
- **MVCH-273** — solution present but stored correct_option is null
- **MVCH-274** — solution present but stored correct_option is null
- **MVCH-275** — solution present but stored correct_option is null
- **MVCH-276** — solution present but stored correct_option is null
- **MVCH-277** — solution present but stored correct_option is null
- **MVCH-278** — solution present but stored correct_option is null
- **MVCH-282** — solution present but stored correct_option is null
- **MVCH-283** — solution present but stored correct_option is null

## 🟡 Needs verification — solution written, uncertain

- **MVCH-031** — Stored/official key (c) 1.2e-4 N uses force-per-length x L_Y = 5 m. Rigorously, Newton 3rd law caps the mutual force at the overlap = shorter wire X (0.5 m), giving 1.2e-5 N = option (a). Kept (c) to match the exam key; flagged for founder review of the flawed-length convention.
- **MVCH-086** — Stored answer was 0 (an integer round of the true value). Period T = 2*pi*m/(qB) = 0.01 s exactly (the 2*pi and B = 6.28 cancel). Set to 0.01 s; please confirm the intended NVT precision/units.
- **MVCH-118** — Answer (c) is robust by elimination: statement D is false (Delta|L| = 4mav - mav = 3mav, not 2mav), and only option (c) excludes D. Note: statements A and B as transcribed read 3/2; the figure (Delta x = 2a) gives E = 3mv^2/(4qa) and power at P = 3mv^3/(4a), i.e. 3/4 coefficients. The 3/2 in the stem appears to be a transcription slip; the intended correct set is (A,B,C).
- **MVCH-148** — Stored answer (a) 10 rad/s follows from KE = mB(1 - cos60) = 40 J. A strictly rigorous reading (moment initially perpendicular to B, then rotating 60 deg to 30 deg from B) gives KE = mB cos30 = 69.3 J -> omega ~ 13.2 rad/s, which is not among the options. The (1-cos) form is the conventional/keyed solution; flagged for confirmation of the intended geometry.
- **MVCH-166** — Stored answer was (c) 9 T; overriding to (d) 1 T. A is in series and carries the full current i (giving 3 T). B, C, D are three identical solenoids in PARALLEL, so each carries i/3. Field is proportional to current, so B_C = (i/3 / i) * 3 T = 1 T. For 9 T, C would need 3x the current of A, which is impossible in a parallel split. (d) 1 T is the standard/official answer.
- **MVCH-175** — Stored answer was (a) e*mu0*n*I*R/m; overriding to (b) e*mu0*n*I*R/(2m). The electron starts ON the axis (center of the cross-section), so the maximum distance it reaches from the axis is the DIAMETER 2r of its circular path, not r. The no-hit condition is 2r <= R, giving r = R/2 and v_max = eBR/(2m) = e*mu0*n*I*R/(2m). This is the JEE Advanced 2018 official answer (b).

## ⚪ Soft quality — audit notes

_(none)_
