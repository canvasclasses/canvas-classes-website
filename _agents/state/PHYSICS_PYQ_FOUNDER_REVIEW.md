# JEE-Advanced Physics PYQ Ingestion — Founder Review & Audit Sheet

> **Purpose:** a one-stop checklist for the founder to verify the ingested JEE-Adv Physics PYQs **question by question**, focused on everything that needs a human eye: answer-key corrections, deferred (not-ingested) questions, duplicates, and figure-dependent concept solutions.
>
> **Companion file:** [`PHYSICS_PYQ_BOOK_MAP.md`](PHYSICS_PYQ_BOOK_MAP.md) has the **complete** per-chapter Book-Q# → Crucible-ID mapping + full skip lists. THIS file is the curated "needs-attention" subset. Per-chapter rollback `deleteMany` commands live in `CRUCIBLE_STATE.md` Changelog.
>
> Source book: *JEE Adv Physics PYQ* PDFs in `~/Downloads/JEE Adv Physics PYQ/Physics Ch - N.pdf` (17 chapters).
> Founder filters applied: **2000-onward only; skip True/False + old fill-in-the-blanks; subjective→numerical where a clean answer exists; per-question taxonomy routing (a Q is moved to whatever chapter it truly belongs to, ignoring the PDF's chapter grouping).**

_Last updated: 2026-06-24._

---

## 1. STATUS SUMMARY

| Chapter | Topic | Crucible IDs | Keepers | Status |
|---|---|---|---|---|
| 1 | Units & Dimensions | (various) | 46 | ✅ done (earlier sessions) |
| 2 | Kinematics | K1D/K2D | 13 | ✅ done |
| 3 | (mixed) | (various) | 23 | ✅ done |
| 4 | (mixed) | (various) | 20 | ✅ done |
| 5 | System of Particles / Rotation | COM/ROT | 82 | ✅ done |
| 6 | Gravitation | GRAV-202…224 | 23 | ✅ done |
| 7 | Properties of Matter | SOLD-095…099, FLUI-189…233 | 50 | ✅ done |
| 8 | Heat & Thermodynamics | THPR-134…168, KTG-151…162, TDYN-193…220 | 75 | ✅ done |
| 9 | Oscillations (SHM) | SHM-147…169 | 23 | ✅ done |
| 10 | Wave Motion | WAVE-179…219 | 41 | ✅ done |
| 11 | Electric Charges & Field | ELST-276…306 | 31 | ✅ done |
| 12 | Electrostatic Potential & Capacitance | CAPC-199…226, ELST-307…312 | 34 | ✅ COMPLETE |
| 13 | Current Electricity | CURR-388…433 | 46 | ✅ COMPLETE |
| 14 | Magnetics | MVCH-295…332, EMI-164…166, MAGM-057…060 | 45 | ✅ COMPLETE |
| 15 | EMI / AC / EM Waves | EMI-167…196, ACUR-158…171, EMW-007 | 45 | ✅ COMPLETE |
| 16 | Optics | ROPY-268…330, WVOP-141…168 | 91 | ✅ COMPLETE |
| 17 | Modern Physics | DUAL-154…176, ATPH-135…167, NUCL-128…160 | 89 | ✅ COMPLETE |

**Grand total ingested: ~783 keepers — PROJECT COMPLETE (Ch1–17 all done).** (Ch1–10 = 402, Ch11 = 31, Ch12 = 34, Ch13 = 46, Ch14 = 45, Ch15 = 45, Ch16 = 91, Ch17 = 89 [incl. deferred Ch14 Q93 positronium → ATPH-167].)

### Ch17 answer-key check
**1 AK error found + corrected: Q1 → ATPH-135 (2005) — book key (d) [two photons] is wrong; the 15 eV photon ionizes the atom, ejecting a 1.4 eV ELECTRON, so the answer is (c). Online-verified vs official IIT-JEE-2005.** Also corrected a pre-insert spec typo (Q37→DUAL-168 stored (b) E^{1/2}, matching AK). All multi-correct + NVT re-derived; Q2/Q83 were the same problem printed twice (kept once). AK aligned cleanly through Q164; Q165–179 tail is all pre-2000/subjective.
### Ch17 deferred — match-the-column (MTC)
Q108 (2025 energy-vs-Z), Q155 (2023 decay processes), Q156 (2015 nuclear processes), Q157 (2013 nuclear-process match) — need full List tables before MTC ingestion.
### Ch17 GRAPH-OPTION (options ARE plots — attach images): DUAL-159, DUAL-161, NUCL-147. Stem figure-flags incl. NUCL-132 (B/A plot), ATPH-138 (Coolidge tube), DUAL-160/162/169.

---

## 🎉 PROJECT COMPLETE — all 17 JEE-Advanced Physics PYQ chapters ingested (~796 keepers)
**5 answer-key errors caught + corrected across the project:** Ch12 Q70 (→a,d), Ch13 Q12 (→d), Ch14 Q91 (→c), Ch16 Q186 (→75.6 µm), Ch17 Q1 (→c). Every suspicious multi-correct/numeric was independently re-derived and WebSearch-verified where needed.

**Match-the-column back-fill DONE (2026-06-24):** the 13 single-answer match questions are now ingested as type `MTC` (MVCH-333/334/335, EMI-197, ACUR-172/173/174, ROPY-331/332/333, ATPH-168, NUCL-161/162) — all mappings re-derived & AK-matched.

**Outstanding (NOT ordinary ingestion):**
1. **True matrix-match** (full-mapping keys, no a/b/c/d options → can't fit the 4-option schema without fabricating distractors): **Ch14 Q63, Ch15 Q73, Ch16 Q111/Q134/Q161, Ch17 Q156.** Needs a schema decision.
2. **Ch12 Q9/Q64** — deferred for a *data* inconsistency (printed values), not match-format — needs founder verification.
3. **Figure attachment** for figure-flagged questions; the GRAPH-OPTION ones (four options ARE plots) are unusable until option images are attached: EMI-175/176/184, ROPY-271/292, WVOP-144, DUAL-159/161, NUCL-147, plus the match-columns with diagram/graph List entries (ACUR-172, ROPY-332/333).

### Ch16 answer-key check
**1 AK error found + corrected: Q186 → WVOP-168 (2025 single-slit error-analysis) — book key prints 94.50 but correct Δb = 75.6 μm** (b = mλD/d = 360 µm; Δb/b = ΔD/D + Δd/d = 0.01 + 0.20 = 0.21 ⇒ 75.6 µm; online-verified vs official JEE-Advanced-2025). Stored 75.6; the override is noted inside the solution. All other multi-correct + NVT re-derived and match (Q14 Vm=3 via mirror-motion term, Q180 601.50 µm, Q117 OE=6.06, Q142 p=2 in water, etc.). Note: the page-21 AK has a phantom gap (no Q54 — it is a 1986 subjective) that initially misaligned a first-pass reading of rows 53–82; re-read carefully, all confirmed.
### Ch16 deferred — match-the-column / matrix (MTC)
Q108 (2024 sphere deviation), Q109 (2022 lens-pairs), Q110 (2014 lens combos), Q111 (2010 media-lens), Q134 (2006 optical instruments), Q161 (2009 YDSE sheets) — need full List-I/II tables + figures before MTC ingestion.
### Ch16 GRAPH-OPTION (options ARE plots — UNUSABLE until option images attached)
ROPY-271 (bent-wire image), ROPY-292 (metamaterial ray diagram), WVOP-144 (emergent wavefront). Plus many stem figure-flags across ROPY/WVOP (mirror/prism/lens/YDSE geometry).

---

## 2. ⭐ ANSWER-KEY CORRECTIONS — HIGHEST PRIORITY TO VERIFY

These are questions where I **stored a different answer than the book's printed key** because the book key was wrong, incomplete, or a typo. Each was independently re-derived; the Ch11 ones were additionally confirmed against the official JEE paper online. **Please spot-check these first.**

| Crucible ID | Book Q (yr) | Book key | **Stored answer** | Why / source |
|---|---|---|---|---|
| THPR-156 | Ch8 Q44 (2017) | (c) | **(c, d)** | option (d) is physically true ($P=\sigma AT^4$); official JEE-Adv 2017 = (c,d) |
| THPR-140 | Ch8 Q13 (2001) | (d), printed $B=2\times10^{-1}$ | **(d)** with $B=2\times10^{-2}$ | printed constant is a typo; only $2\times10^{-2}$ gives the keyed answer 0.495 kg |
| SHM-150 | Ch9 Q4 (2001) | looked (d) | **(a)** $t_1<t_2$ | SHM is fastest at centre; faint AK scan; (d) is the physically-reversed option |
| SHM-153 | Ch9 Q10 (2005) | looked (a,d) | **(a, b, d)** | option (b) provably true ($A=-B,C=2B$ ⇒ amplitude $B\sqrt2$); faint AK |
| SHM-167 | Ch9 Q43 (2005) | looked (d) | **(a)** 6/5 | suspension accel up 2 ⇒ $g_{eff}=12$ ⇒ $T_1^2/T_2^2=12/10$; faint AK |
| WAVE-194 | Ch10 Q53 (2005) | (d) | **(a)** 204.1 cm/s | $\Delta v=2f\,\delta(L_2-L_1)=2\cdot512\cdot0.2$; (d) matches no standard error calc |
| ELST-280 | Ch11 Q7 (2020) | (a) | **(b, c)** | ✅ online-verified [cracku/examside] — Coulomb force reduces in dielectric |
| ELST-281 | Ch11 Q8 (2014 MTC) | (c) | **(a)** P-3,Q-1,R-4,S-2 | ✅ online-verified [cracku/edurev] (book mis-transcribed List-I too) |
| ELST-284 | Ch11 Q19 (2014) | (a,c) | **(c)** | ✅ online-verified [esaral] — option (a) Q=4σπr₀² is wrong (correct 2πσr₀²) |
| ELST-290 | Ch11 Q27 (2012) | (a,c) | **(a, c, d)** | ✅ online-verified [examside] — (d) correct; also **year 2011→2012** |
| ELST-294 | Ch11 Q34 (2009) | (c) | **(a)** −2C/ε₀ | ✅ online-verified [infinitylearn] — enclosed charge = 3+2−7 = −2C |
| ELST-295 | Ch11 Q35 (2008) | (d) | **(b)** 3Ze/πR³ | ✅ online-verified [edurev] |
| ELST-305 | Ch11 Q45 (2020) | option-(c) value √(5/3) | **√(5/2)** [ans (b,c)] | ✅ online-verified [cracku] — book printed a typo in option (c) |
| CAPC-222 | Ch12 Q70 (2014) | (a, c, d) | **(a, d)** | ✅ online-verified [examside/official] — Q₁/Q₂ = K/2 (not 3/K), so option (c) is false |
| CURR-393 | Ch13 Q12 (2010) | (a, b, c) | **(d)** | ✅ online-verified [byjus/toppr/official] — Single-Correct Q; R∝1/P ⇒ 1/R₁₀₀>1/R₆₀>1/R₄₀. Book inverted the relation AND miskeyed it multi |
| MAGM-059 | Ch14 Q91 (2011) | (d) | **(c)** | ✅ online-verified [examside/official] — closed loops (concentric circles) are valid for both B and induced E; book marked the bar-magnet dipole pattern |

> Note Ch7 FLUI-194 (book Q26): I initially stored (a), then a HIGH-RES re-read of the AK corrected it to **(d)** — this MATCHES the book key, so it's not an override, just a scan-quality fix. Listed here only for completeness.

---

## 3. DEFERRED — NOT INGESTED (need figures/tables/clarification)

These were **not stored** because they need a complex multi-column table, a figure I couldn't transcribe reliably, or have an ambiguous value. Decide per-item whether to add manually.

| Chapter | Book Q (yr) | Type / reason it was deferred |
|---|---|---|
| 5 | Q144 | year unconfirmable from the scan |
| 8 | Q47 (2025) | plate-insertion; book AK [0.30] conflicts with standard W₀/Wₛ=3 |
| 8 | Q134, Q135, Q136 (2017) | "Column-3" matrix-match — needs 3-column table + 4 p-V diagrams |
| 8 | Q140, Q141 (2013) | entropy-paragraph matrix-match — needs List tables + TV-diagram |
| 9 | Q11 (2025) | 4-system relative-velocity matrix-match (figures) |
| 9 | Q25 (2008) | Column-I/II many-to-many grid (doesn't fit 4-option MTC schema) |
| 9 | Q29 (2019) | spring-pulley multiple-correct — figure-dependent, answer uncertain |
| 9 | Q39 (2007) | many-to-many grid match |
| 10 | Q45, Q46 (2019) | string match-columns — need List-II value tables |
| 10 | Q68 (2011) | many-to-many grid (pipe/string nature + wavelength) |
| 10 | Q71 (2000) | multi-part subjective (Torricelli drain + resonance) |
| 10 | Q73 | resonance-tube [336]; exam year unconfirmed |
| 10 | Q83, Q84 | figure-dependent beat-frequency multiple-correct |
| 10 | Q99 | year unconfirmed (likely pre-2000) |
| 12 | Q9 (2025) | grounding problem — printed charge $10^{-4}$ C inconsistent with keyed V=450 (needs $10^{-8}$ C) |
| 12 | Q64 | multi-shell capacitance match-column — needs full figure |
| 14 | Q33, Q34, Q35 (2017) | 3-column comprehension (E/B vector combinations) — column vectors hard to transcribe reliably; needs the Column-I/II/III table |
| 14 | Q63 (2007) | match-the-column (two-wire configs A–D vs effects p–s); multi-match answer A-q,r/B-p/C-q,r/D-q |
| 14 | Q93 (2025) | positronium / Bohr-atom problem (AK [11.80]) — Modern-Physics content that bled into the Ch14 PDF tail; ingest during Ch17 to avoid a duplicate |

---

## 4. DUPLICATES — book repeated a question; ingested ONCE, later copy skipped

| Skipped book Q | Already stored as | Note |
|---|---|---|
| Ch12 Q13 (2017) | ELST-297 (Ch11 Q39) | hemisphere-flux question repeated in both chapters |
| Ch12 Q16 (2011) | CAPC-205 (= Ch12 Q15) | book printed Q15 and Q16 with identical text |
| Ch12 Q49 (2014) | ELST-285 (Ch11 Q20) | spheres Q/2Q/4Q repeated in both chapters |
| Ch12 Q56 (2019) | CAPC-219 (= Ch12 Q62) | N-layer dielectric (α=1) printed twice in the same chapter |

---

## 5. FIGURE-DEPENDENT — answer is per the (verified) key, but the SOLUTION is concept-level pending a diagram upload

These have the **correct answer**, but the worked solution is written at a concept level because the question depends on a figure I can describe but not render. Once figures are uploaded, these solutions can be expanded. (Non-exhaustive — the most figure-reliant ones.)

- **Ch7:** FLUI-191/194/195/198/199/200/204/208/209/214/216/218/221/222/223/230/231, SOLD-096/097
- **Ch8:** THPR-145/150/152/154/157, KTG-158/159/162, TDYN-193/198/204/205/206/210/211/216/218/219
- **Ch9:** SHM-151/152/154/155/156/159 (phase-space, graphs, projectile, torsional)
- **Ch10:** WAVE-180/183/184/186/187/202/213/214/216/217 (and the Doppler-passage figures)
- **Ch11:** ELST-279/286/287/292/296/297/299/300/301/302/303/305/311/312 (flux/Gauss figures, dipole MTC, sheets)
- **Ch12:** CAPC-201/204/207/209/210/216/217/218/220/222/223/224/225/226, ELST-309/310/311/312
- **Ch13:** CURR-390/391/397/398/399/400/402/403/405/406/408/411/415/416/417/419/421/422/423/425/426/427/428/429/430 (resistor networks, meter-bridge/Wheatstone, RC circuits — concept-level solutions pending the diagrams)
- **Ch14:** MVCH-295/298/299/301/303/306/308/310/313/318/319/321/323/324/326/327/329/330, EMI-164, MAGM-057/059/060 (Biot-Savart configs, cylinder-cavity, graphs, trajectories, torque-on-loop, moving-loop, field patterns — concept-level solutions pending the diagrams)
- **Ch15:** EMI-174/178/179/180/181/182/183/186/187/188/189/190/196, ACUR-158/159/164/166/168/169/170/171 (loop-near-wire geometry, coupled-inductor & RC/LC circuit diagrams, transformer transmission — concept-level solutions pending the diagrams). **⚠ GRAPH-OPTION (the four options ARE plots and read "Graph (a)…(d) — see figure"; these are UNUSABLE until the option images are attached): EMI-175 (rotating-loop emf-vs-t), EMI-176 (triangle-loop emf-vs-x), EMI-184 (bar-magnet emf-vs-t).**

### Ch15 deferred — match-the-column / matrix (MTC) not yet ingested
Need the full List-I/List-II tables + figures verified before they can be stored as MTC. Founder review / figure pass should pick these up:
- **Q13** (2023, falling-rod match-the-column, key (d)), **Q72** (2025, AC-load → current-graph match, key (a)), **Q73** (2010, matrix Column-I/II DC+AC), **Q75** (2023, LCR match, key (b)), **Q81** (2024, LC match, key (a)).

### Ch15 answer-key check
All 6 multi-correct and all 9 NVT independently re-derived; **no AK errors**. Q74 (2017 series-LCR) was online-verified — book option (c) reads ω=10⁴ (false, resonance is 10⁶), so book key **(a,b)** is correct. Q65 (2017 three-phase rms) initially looked wrong on a letter-mapping slip but key **(b,c)** is correct.

---

## 6. SUBJECTIVE → NUMERICAL CONVERSIONS

Per the founder rule, some old subjective questions with a clean single-number answer were converted to numerical-value questions. Verify the conversion is faithful.

- Ch7 (various converted-to-NVT), Ch8, Ch10 **WAVE-219** (book Q95, train speed = 30), Ch11 **ELST-283** (book Q10, min velocity 5.86), Ch12 **CAPC-213** (book Q28 Apollonius, b=3).

---

## 7. HOW TO PULL A QUESTION FOR REVIEW

In MongoDB (`crucible` DB, `questions_v2` collection), fetch by `display_id`, e.g. `{ display_id: 'ELST-294' }`. The student-facing fields are `question_text.markdown`, `options[]`, `answer`, and `solution.text_markdown`. All ingested PYQs have `metadata.sourceType='PYQ'` and `metadata.examDetails.exam='JEE_Advanced'`.
