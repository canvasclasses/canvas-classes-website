# Class 12 Physics Live Book — Electromagnetism Block (Ch.1–5) — Plan

**Status:** 🟢 **BUILT end-to-end 2026-07-30 — 89 pages across 5 chapters, all unpublished.** Text, worked examples, reasoning prompts, quizzes, per-chapter practice banks, AND a full "Practice — NCERT Exercises" pass (142 of 148 real NCERT textbook exercises, transcribed verbatim and fully solved) are complete and QA-verified (Zod + hygiene + KaTeX, 0 findings across all 89 pages). Outstanding: the image art pass (~90 slots carry prompts but no `src`), the 10 reserved simulation slots in §6, and 7 figure-dependent NCERT exercises that couldn't be solved without the printed diagram (§8).

**Standardised status header**
- **Owner:** agent-maintained, founder-directed
- **Book:** NEW — `class12-physics` (subject `physics`, grade 12, board `ncert`). Sibling of `class11-physics`.
- **Scope of this plan:** the first five chapters of the Crucible Class-12 physics taxonomy, in taxonomy order — **Electrostatics → Capacitance → Current Electricity → Magnetic Properties of Matter → Magnetic Effects of Current** (`sequence_order` 117–121). Ch.6 onward (EMI, AC, optics, modern) are out of scope here.
- **Sources:** see §2. Founder-supplied *Understanding Physics — Electricity and Magnetism* (DC Pandey / Arihant) is the pedagogy + depth spine; **NCERT Exemplar Physics Class 12** is the only source that may carry a student-visible badge.
- **Next action:** build chapters in order; browser-QA each one.
- **Blocked on:** nothing.

---

## 1. Chapter sequence — Crucible taxonomy is the spine

The founder's instruction is explicit: **the chapter sequence follows the Crucible Physics taxonomy**, not the source book's order and not NCERT's. Taken verbatim from `packages/data/taxonomy/taxonomyData_from_csv.ts`:

| # | `crucible_chapter_id` | Title (byte-identical, §18) | Primary topic tags to cover |
|---|---|---|---|
| 1 | `ph12_electrostatics` | **Electrostatics** | Coulomb's law & force on charges · electric field (point + continuous) · electric dipole (field, torque, energy) · electric flux & Gauss's law · applications of Gauss's law (sphere, cylinder, sheet) |
| 2 | `ph12_capacitance` | **Capacitance** | electric potential & p.d. · equipotential surfaces & PE of charges · conductors in an electrostatic field & shielding · capacitors (parallel-plate, spherical, cylindrical) · series & parallel · dielectrics & energy stored |
| 3 | `ph12_current` | **Current Electricity** | Ohm's law, resistance & resistivity · Kirchhoff's laws · Wheatstone bridge & potentiometer · cell EMF, internal resistance & combinations · power dissipation & heating effect |
| 4 | `ph12_mag_matter` | **Magnetic Properties of Matter** | magnetic dipole moment & bar magnet · Earth's magnetism (declination, inclination) · magnetisation, susceptibility & permeability · dia-, para- and ferromagnetism |
| 5 | `ph12_moving_charges` | **Magnetic Effects of Current** | Lorentz force · motion of charges in a magnetic field (cyclotron, helix) · force on current-carrying conductors · Biot–Savart law (wire, loop, arc) · Ampère's circuital law (solenoid, toroid) · torque on a current loop & moving-coil galvanometer |

### Two consequences of following the taxonomy, both deliberate

1. **Electric potential lives in Ch.2 "Capacitance", not in Ch.1 "Electrostatics."** The taxonomy puts `tag_capc_1` (Electric Potential & Potential Difference) and `tag_capc_2` (Equipotential Surfaces & PE of Charges) under Capacitance. Both source books put potential inside their electrostatics chapter. **Taxonomy wins** — and it is in fact the standard coaching split (Electrostatics-1 = force/field/Gauss, Electrostatics-2 = potential/capacitance). Ch.1 therefore ends at Gauss + conductors, and Ch.2 opens with electrostatic potential energy. Ch.1's last page bridges explicitly into it so the seam is invisible to a reader.
2. **Magnetic Properties of Matter (Ch.4) comes *before* Magnetic Effects of Current (Ch.5).** This is unusual — every source book teaches moving charges first and matter last. The taxonomy's order is what a student sees in Crucible, so the book follows it, and Ch.4 is written to be **self-contained on the bar-magnet/field-line/Earth's-field picture** without needing Biot–Savart first. The one genuine dependency — "a current loop *is* a magnetic dipole", which needs `I A` — is handled by stating the equivalence in Ch.4 as a forward promise (a `note` callout: *you will derive this in the next chapter*) and then **closing the loop in Ch.5** on the torque-on-a-loop page. Flagged here because it is the single riskiest sequencing call in this plan; if the founder prefers, swapping 4↔5 is a one-command chapter renumber.

---

## 2. Sources and how each may be used

| Source | Location | Role | Student-visible attribution |
|---|---|---|---|
| *Understanding Physics — Electricity and Magnetism*, DC Pandey (Arihant) | founder-supplied PDF | **Primary pedagogy spine.** Sequencing, depth calibration, worked-example archetypes, the "Extra Points to Remember" JEE insights, problem patterns. | **NEVER named.** Per the standing platform rule (`feedback_no_third_party_book_attribution`), no student-facing badge for any book except NCERT / Exemplar / CBSE PYQ / JEE-Main PYQ. Items adapted from it use `source: 'mcq'` (no badge). |
| **NCERT Exemplar Physics Class 12** (`leep101`–`leep105`) | `~/iCloud Drive (Archive)/Documents/chemistry/ncert books/class 11 & 12/PHYSICS - NCERT Exemplar 12th/` | Authentic practice items + several excellent conceptual probes. Ch.1→Electrostatics, Ch.2→Capacitance, Ch.3→Current Electricity, Ch.4→Magnetic Effects of Current, Ch.5→Magnetic Properties of Matter. | `source: 'ncert_exemplar'` — permitted and used. |

**Gap on record:** we do **not** have the NCERT Class 12 Physics *textbook* PDF (only the Exemplar). The Class 11 physics book used NCERT's own text as its structural spine; here the spine is the Crucible taxonomy instead, which is what the founder asked for. If the NCERT textbook PDFs are added later, a fidelity pass over these five chapters is worth doing — mainly to check we haven't drifted above NCERT's register or skipped an NCERT-only worked example.

**Rule 0 applies throughout:** every number, constant, exercise and worked result is transcribed from a source, never generated from memory. Prose is always re-expressed in our own voice — never copied.

---

## 3. Page-count budget and the shape of a page

Per §15.8 a page is **one sub-topic, ≤ ~18 blocks**. Budget below is the target; the real count is whatever topic containment (§4D) produces.

| Ch | Title | Planned | **Built** (content + opener) |
|---|---|---|---|
| 1 | Electrostatics | 15 | **18 + 1 = 19** |
| 2 | Capacitance | 16 | **17 + 1 = 18** |
| 3 | Current Electricity | 16 | **16 + 1 = 17** |
| 4 | Magnetic Properties of Matter | 11 | **10 + 1 = 11** |
| 5 | Magnetic Effects of Current | 16 | **16 + 1 = 17** |
| | **Total** | **74 + 5** | **77 + 5 = 82** |

Ch.1 came in three pages over plan because topic containment (§4D / §15.8) forced two splits during authoring: the conductor material became *What a Conductor Does to a Field* + *Cavities and Shielding*, and the flux/Gauss/applications material needed three pages rather than two. Ch.4 merged the planned separate diamagnetism and paramagnetism pages into one — the comparison between them **is** the lesson, so splitting them weakened it.

**Every content page carries** (§4A + §15): a `curiosity_prompt` or `fun_fact` hook → core text → `heading[2]` blocks each with an `objective` → at least one **mid-page** check (`reasoning_prompt` / micro `inline_quiz`) per major concept → worked examples (`worked_example`, or `step_solver` where the *method* is the lesson) → an anchor formula as a highlighted `latex_block` → a `real_world` card where the concept has a genuine story → a closing `inline_quiz` → a one-line **bridge** to the next page. Load-bearing terms go in `glossary`. Every page has ≥1 image block (`src: ''` + a dark-background `generation_prompt` per the standing image rule).

**Simulations: deliberately not built in this pass.** Founder instruction — sims come after the chapters exist. Pages are designed so a sim can be dropped in later at a marked slot (§6) without restructuring. No `simulation` block is authored now (an unbuilt `simulation_id` would render as a dead block).

**Practice:** each chapter ends with a **Practice & Mastery** page carrying a `practice_bank` of ~30–40 items in labelled sections, mixing `mcq` and `numerical` kinds, sourced from the Exemplar (badged) and adapted from the primary spine (unbadged). Answer positions are spread by the deterministic `spread()` hash (see §5) — the answer-position defect has recurred three times on this platform and is not left to chance.

---

## 4. Per-chapter page maps

### Ch.1 — Electrostatics (15 pages)

| # | Page | Core content | Tag |
|---|---|---|---|
| 1 | Charge — the property behind it all | Charge as an intrinsic property; two kinds; conservation; **quantisation** `q = ±ne`; charge is a scalar; the coulomb is enormous | — |
| 2 | How a Body Gets Charged | Friction, contact, induction; why a charged comb attracts *neutral* paper; earthing | — |
| 3 | Coulomb's Law | Statement, vector form, `1/4πε₀ = 9×10⁹`, ε₀; force is a two-body pair; conservative | `tag_elst_1` |
| 4 | Superposition — More Than Two Charges | Vector addition of forces; the equilateral-triangle / square archetypes; Lami's theorem for 3-force equilibrium | `tag_elst_1` |
| 5 | Charges in a Medium, and Equilibrium Problems | Dielectric constant K, force ÷ K; the suspended-balls-in-liquid archetype; null points | `tag_elst_1` |
| 6 | The Electric Field | Why a *field* at all (action-at-a-distance); `E = F/q₀` with the limit; `E` of a point charge; force on ±q | `tag_elst_2` |
| 7 | Electric Field Lines | Rules (start/end, never cross, density = strength); reading a field-line picture; the null point | `tag_elst_2` |
| 8 | Fields from Continuous Charge | λ, σ, ρ; the ring on its axis (full derivation + the `x ≫ R` and `x = R/√2` results); the infinite line and sheet quoted forward to Gauss | `tag_elst_2` |
| 9 | Motion of a Charge in a Uniform Field | `a = qE/m`; the projectile analogy; deflection in a parallel-plate region (the CRT/inkjet setup) | `tag_elst_2` |
| 10 | The Electric Dipole | Definition, `p = 2aq`, direction −q→+q; why dipoles matter (polar molecules) | `tag_elst_3` |
| 11 | Field of a Dipole — Axis and Bisector | `E_axis = 2kp/r³`, `E_⊥ = kp/r³`, the factor-of-2, directions (parallel vs antiparallel to **p**); the general-point result quoted | `tag_elst_3` |
| 12 | A Dipole in a Uniform Field | Net force zero, `τ = p × E`, `U = −p·E`, stable vs unstable equilibrium, work done rotating it | `tag_elst_3` |
| 13 | Electric Flux | Flux as "field lines through a surface"; `φ = ∫E·dS`; sign of flux; flux through a cube/one face | `tag_elst_4` |
| 14 | Gauss's Law | Statement `φ_net = q_in/ε₀`; only *enclosed* charge counts (but **E** on the surface is due to *all* charges) — the #1 misconception; when it is *useful* vs merely true; choosing a Gaussian surface | `tag_elst_4` |
| 15 | Gauss in Action — Sheet, Wire, Sphere, Shell | `σ/2ε₀`, `λ/2πε₀r`, shell (inside 0, outside as a point charge), solid sphere (`kQr/R³` inside), and **conductor properties** (E = 0 inside, charge on the surface, field ⊥ surface = `σ/ε₀`, cavity shielding) | `tag_elst_5` |
| 16 | Practice & Mastery | `practice_bank`, ~36 items | — |

### Ch.2 — Capacitance (16 pages)

| # | Page | Core content | Tag |
|---|---|---|---|
| 1 | Work, Energy and Charge | Electrostatic force is conservative → potential energy exists; `U = kq₁q₂/r` with sign; PE of a system of charges (pairwise sum) | `tag_capc_2` |
| 2 | Electric Potential | `V = U/q₀`; potential of a point charge; superposition of a scalar (the reason potential is easier than field); volt | `tag_capc_1` |
| 3 | Potential Difference and Work | `W = q(V_A − V_B)`; the electron-volt; moving a charge with no acceleration | `tag_capc_1` |
| 4 | Field from Potential, Potential from Field | `E = −dV/dr`, the gradient; `V = −∫E·dr`; why **E** points "downhill" in V; a graph-reading page | `tag_capc_1` |
| 5 | Equipotential Surfaces | Definition; always ⊥ to **E**; no work along one; shapes for a point charge / uniform field / dipole; why two can never intersect | `tag_capc_2` |
| 6 | Potential Energy of a System | Assembling 2, 3 and 4 charges; work done by an external agent vs by the field; a dipole's PE revisited | `tag_capc_2` |
| 7 | Conductors in an Electrostatic Field | E = 0 inside, whole conductor is one equipotential, charge resides on the surface, sharper curvature → larger σ; **electrostatic shielding** and the Faraday cage | `tag_capc_3` |
| 8 | Capacitance | The idea (`Q ∝ V`), `C = Q/V`, the farad and why it is huge; isolated-sphere capacitance | `tag_capc_4` |
| 9 | The Parallel-Plate Capacitor | `C = ε₀A/d` derived from Gauss; the field between plates; edge effects named and set aside | `tag_capc_4` |
| 10 | Spherical and Cylindrical Capacitors | Both derivations; the `b → ∞` limit recovering the isolated sphere | `tag_capc_4` |
| 11 | Capacitors in Series and Parallel | Both results derived from *what is conserved* (charge vs voltage), not memorised; equivalent capacitance; which one shares charge equally | `tag_capc_5` |
| 12 | Reading a Capacitor Network | Symmetry, redrawing, the "same-potential nodes" trick, wheatstone-like balanced bridge of capacitors | `tag_capc_5` |
| 13 | Energy Stored in a Capacitor | `U = ½QV = ½CV² = Q²/2C`; the ½ (why it is not `QV`); energy lost when two capacitors are connected | `tag_capc_6` |
| 14 | Energy Density and the Field | `u = ½ε₀E²` — energy lives in the field; the force between plates | `tag_capc_6` |
| 15 | Dielectrics | Polarisation, induced field, dielectric constant K; `C = Kε₀A/d`; battery-connected vs battery-disconnected (the classic table of what changes); partial filling; dielectric strength | `tag_capc_6` |
| 16 | Charging and Discharging (C-R) | `q = q₀(1 − e^{−t/τ})`, `τ = CR`, the discharge curve, the meaning of the time constant, steady state = capacitor is an open branch | `tag_capc_4` |
| 17 | Practice & Mastery | `practice_bank`, ~38 items | — |

### Ch.3 — Current Electricity (16 pages)

| # | Page | Core content | Tag |
|---|---|---|---|
| 1 | What "Current" Actually Is | `I = dq/dt`; current is a scalar but has a direction convention; conventional vs electron flow; current density **J** as the true vector | `tag_curr_1` |
| 2 | Drift Velocity | Free electrons, random thermal motion vs the tiny drift; `v_d = eEτ/m`; `I = neAv_d`; why the bulb lights instantly though `v_d` ≈ mm/s | `tag_curr_1` |
| 3 | Ohm's Law and Resistance | `V = IR`; microscopic form `J = σE`; ohmic vs non-ohmic (the V–I graph gallery) | `tag_curr_1` |
| 4 | Resistivity | `R = ρl/A`; ρ as a material property; stretching a wire (`R ∝ l²`, `R ∝ 1/A²`) — the classic trap | `tag_curr_1` |
| 5 | Temperature and Resistance | `ρ = ρ₀(1 + αΔT)`; metals vs semiconductors vs alloys; why manganin/constantan exist; superconductivity named | `tag_curr_1` |
| 6 | Cells, EMF and Internal Resistance | EMF vs terminal voltage; `V = ε − Ir`; charging (`V = ε + Ir`); the short-circuit current; maximum power transfer | `tag_curr_4` |
| 7 | Resistors in Series and Parallel | Derived from what is shared; equivalent resistance; the "parallel is always less than the smallest" sanity check | `tag_curr_1` |
| 8 | Reading a Circuit You Have Not Seen Before | Node labelling, redrawing, short-circuited elements, symmetry (perpendicular-axis / equipotential folding) — the "invisible middle step" page | `tag_curr_2` |
| 9 | Kirchhoff's Laws | KCL as charge conservation, KVL as energy conservation; sign conventions done slowly; solving a 2-loop network | `tag_curr_2` |
| 10 | Grouping of Cells | Series, parallel and mixed grouping; the condition for maximum current (`nr = mR`) | `tag_curr_4` |
| 11 | Heating Effect and Power | `P = VI = I²R = V²/R`; which form to use when; joule heating, fuse, bulb-rating problems (series vs parallel brightness) | `tag_curr_5` |
| 12 | The Wheatstone Bridge | Balance condition `P/Q = R/S` derived; why the galvanometer branch can be ignored at balance; the bridge as a *null* method | `tag_curr_3` |
| 13 | The Meter Bridge | The practical Wheatstone; balancing length; end corrections; sources of error | `tag_curr_3` |
| 14 | The Potentiometer | Why it measures EMF and a voltmeter cannot; potential gradient; comparing two EMFs; measuring internal resistance; sensitivity | `tag_curr_3` |
| 15 | Ammeters, Voltmeters and the Galvanometer | Shunt (`S = GI_g/(I − I_g)`), series multiplier; ideal vs real meters; why an ammeter goes in series and a voltmeter in parallel | `tag_curr_3` |
| 16 | Practice & Mastery | `practice_bank`, ~38 items | — |

### Ch.4 — Magnetic Properties of Matter (11 pages)

| # | Page | Core content | Tag |
|---|---|---|---|
| 1 | Magnets, Poles and Field Lines | Poles always come in pairs; field-line rules (closed loops, outside N→S, inside S→N); no magnetic monopole; the "cut a magnet" result | `tag_magm_1` |
| 2 | The Magnetic Dipole Moment | **M** as the magnetic analogue of **p**; `M = m·2l` for a bar magnet; **forward promise:** a current loop has `M = IA` (derived in Ch.5) | `tag_magm_1` |
| 3 | Field of a Bar Magnet | Axial `B = μ₀2M/4πd³` and equatorial `B = μ₀M/4πd³`; the exact parallel with the electric dipole set out side by side | `tag_magm_1` |
| 4 | A Magnet in a Uniform Field | `τ = M × B`, `U = −M·B`, stable/unstable orientation, oscillation period `T = 2π√(I/MB)` (vibration magnetometer) | `tag_magm_1` |
| 5 | Earth as a Magnet | The dipole picture, geographic vs magnetic poles; **declination**, **dip/inclination**, horizontal component `B_H`; `tan δ = B_V/B_H` | `tag_magm_2` |
| 6 | Neutral Points and Tangent Law | Combining Earth's field with a bar magnet's; neutral points for N-pointing-north vs south; `B = B_H tan θ` | `tag_magm_2` |
| 7 | Magnetising Field, Magnetisation and the Three H's | **H**, **M**, **B** and `B = μ₀(H + M)`; susceptibility `χ = M/H`; permeability `μ = μ₀(1 + χ)`; relative permeability | `tag_magm_3` |
| 8 | Diamagnetism | Induced-moment origin (Lenz's law at the atomic scale); χ small and negative; repelled, moves to weak field; superconductor as a perfect diamagnet | `tag_magm_4` |
| 9 | Paramagnetism | Permanent atomic moments randomised by heat; χ small and positive; **Curie's law** `χ ∝ 1/T`; weak attraction | `tag_magm_4` |
| 10 | Ferromagnetism, Domains and Hysteresis | Domains; χ huge and positive; Curie temperature; the **hysteresis loop**, retentivity and coercivity; choosing a material (soft iron for a transformer core, steel for a permanent magnet) | `tag_magm_4` |
| 11 | Practice & Mastery | `practice_bank`, ~30 items | — |

### Ch.5 — Magnetic Effects of Current (16 pages)

| # | Page | Core content | Tag |
|---|---|---|---|
| 1 | A Moving Charge Feels a Force | `F = q(v × B)`; the three-way perpendicularity; magnitude `qvB sin θ`; the tesla; **magnetic force does no work** | `tag_mvch_1` |
| 2 | Getting the Direction Right | Right-hand rule / cross-product mechanics; the sign of q; worked direction drills; common sign slips | `tag_mvch_1` |
| 3 | The Lorentz Force and the Velocity Selector | `F = q(E + v × B)`; crossed fields, `v = E/B`; the mass spectrometer idea | `tag_mvch_1` |
| 4 | Circular Motion in a Magnetic Field | `r = mv/qB`, `T = 2πm/qB` — period independent of speed; `r ∝ √(2mK)/qB` | `tag_mvch_2` |
| 5 | Helical Paths | Velocity resolved ∥ and ⊥ to **B**; pitch `= v∥T`; when the path is a straight line, a circle, a helix | `tag_mvch_2` |
| 6 | The Cyclotron | Principle, resonance condition `f = qB/2πm`, maximum energy `q²B²R²/2m`, and its limitation (relativistic mass) | `tag_mvch_2` |
| 7 | Force on a Current-Carrying Wire | `F = I(L × B)`; the straight-wire case; the result that only the **end-to-end vector** matters for a curved wire; net force on a closed loop in a uniform field is zero | `tag_mvch_3` |
| 8 | Force Between Two Parallel Wires | `F/l = μ₀I₁I₂/2πd`; parallel currents attract, antiparallel repel; **the definition of the ampere** | `tag_mvch_3` |
| 9 | The Biot–Savart Law | `dB = (μ₀/4π)(I dl × r̂)/r²`; the electrostatic analogy and the two differences (vector source, cross product); μ₀ | `tag_mvch_4` |
| 10 | Field of a Straight Wire | The finite-wire result `(μ₀I/4πd)(sin θ₁ + sin θ₂)` and the infinite limit `μ₀I/2πd`; semi-infinite; direction by the right-hand grip rule | `tag_mvch_4` |
| 11 | Field of a Loop and an Arc | Centre of a loop `μ₀I/2R`; arc `μ₀Iθ/4πR`; on the axis `μ₀IR²/2(R²+x²)^{3/2}`; combinations of arcs and straight segments | `tag_mvch_4` |
| 12 | Ampère's Circuital Law | `∮B·dl = μ₀I_enc`; the magnetic twin of Gauss's law — same "symmetry makes it useful" logic; a thick wire inside and out | `tag_mvch_5` |
| 13 | The Solenoid and the Toroid | `B = μ₀nI` inside a long solenoid (and `μ₀nI/2` at the end), `B = μ₀NI/2πr` in a toroid, zero outside both | `tag_mvch_5` |
| 14 | A Current Loop Is a Magnetic Dipole | `M = NIA`; `τ = M × B`, `U = −M·B` — **the promise from Ch.4, now paid**; the loop's axial field as a dipole field | `tag_mvch_6` |
| 15 | The Moving-Coil Galvanometer | Radial field → `θ ∝ I`; current and voltage sensitivity; converting it to an ammeter (shunt) and a voltmeter (multiplier) | `tag_mvch_6` |
| 16 | Practice & Mastery | `practice_bank`, ~36 items | — |

---

## 5. Cross-cutting authoring rules for this book

- **Voice:** §5.V / §12 — the founder's teacher voice, plain English for a tier-2/3 reader, short sentences, re-explain rather than translate. No literary vocabulary. Second person.
- **LaTeX:** `$ ... $` only (never `$$`), space either side of each `$`, `\frac` not `\dfrac`, Greek always inside math. Four backslashes in JS string literals where needed.
- **White-text scale (§17.3.1):** authoring implication — write body copy as body copy and let the renderers own the opacity; never inline a brightness override.
- **Answer-position spread:** every MCQ factory routes through the deterministic `spread()` hash from `_book_ch1.js` (Class 11 physics). Explanations must therefore reference option **content**, never position ("the first option…"). A hygiene script greps for positional wording.
- **Assertion–Reason items are `mcqFixed`** — their option order is a fixed rubric and must not be rotated.
- **Source badges:** only `ncert_exemplar` (real Exemplar items) and `mcq` (everything else, no badge). Never a third-party book name.
- **Everything ships `published: false`.** Nothing reaches a student until the founder reviews it in the admin books editor.
- **All writes are additive + idempotent**, matched by slug, through the `book-writer` gateway conventions (§0.6). No page is ever hard-deleted.

---

## 6. Simulation slots — reserved, not built

Not built in this pass (founder instruction). Recorded here so the later sim program has a target list, and so page structure already has a natural home for each:

| Ch · page | Sim slot | Why it earns its keep |
|---|---|---|
| 1 · p7 Field lines | field-line plotter | drag charges, watch lines redraw; the null point becomes visible |
| 1 · p12 Dipole in a field | dipole torque bench | rotate **p**, watch τ and U trace out sin/cos |
| 1 · p14 Gauss's law | Gaussian-surface picker | move charges in/out of a surface, watch flux jump — kills the "E on the surface is only from inside" error |
| 2 · p15 Dielectrics | capacitor bench | battery connected vs disconnected, slab sliding in, live Q/V/E/U readouts |
| 2 · p16 C-R | charge/discharge scope | τ as a *shape*, not a number |
| 3 · p8 Reading a circuit | circuit redraw studio | the topological redraw — the invisible middle step |
| 3 · p14 Potentiometer | potentiometer bench | slide the jockey, find the null |
| 4 · p10 Hysteresis | hysteresis loop tracer | drive H up and down, watch B lag |
| 5 · p5 Helical paths | charged-particle chamber | set v∥ and v⊥, watch circle → helix → line |
| 5 · p11 Loop and arc | Biot–Savart builder | assemble a wire from arcs + segments, sum the contributions |

---

## 7. Build order and definition of done — all complete

1. ✅ Scaffold the book + all five chapters (Crucible-verbatim titles + `crucible_chapter_id`).
2. ✅ Build chapters **1 → 5** in taxonomy order, each ending with its Practice & Mastery page.
3. ✅ `node scripts/lib/validate-taxonomy-link.js class12-physics` — 0 errors.
4. ✅ Browser QA (`admin-isolated` on :3099) — every block type verified rendering; 0 KaTeX errors, 0 unrendered `$`, no horizontal page scroll at desktop or mobile, tables scroll rather than clip.
5. ✅ `LIVE_BOOKS_STATE.md` refreshed + dated changelog line; `PROJECTS.md` cockpit row added.

### The QA toolkit built alongside (reusable for any book)

| Script | What it gates |
|---|---|
| `scripts/physics12-book/_validate.mts` | Zod-validates every page's blocks against `ContentBlocksArraySchema` |
| `scripts/physics12-book/_hygiene.js` | Answer-position spread (§4F rule 4), length-tells (rule 5), positional wording in explanations, and the §15 structure floors — image, closing quiz, mid-page check, glossary, `heading[2]` objectives, ≤18 blocks |
| `scripts/physics12-book/_latex_check.js` | Renders **every** LaTeX expression through the real KaTeX with the reader's own options; flags odd-`$` lines and banned `$$` |

Run all three before calling any chapter of this book done. The hygiene script's length-tell check has a 14-visible-character floor, because on very short maths options a one-character difference otherwise trips the 1.3× ratio.

## 8. What is still outstanding

- **~90 image slots** carry an authored dark-background `generation_prompt` but `src: ''`. The art pass is a separate job; note the founder's 2026-07-29 decision that **technical figures are hand-authored SVG, not AI-generated** — AI generators get angles, proportions and axis labels wrong, and in a physics chapter the correctness of the figure *is* the teaching. AI generation is for atmospheric art only (chapter-opener heroes, `real_world` cards).
- **The 10 simulation slots** in §6.
- **Nothing is published.** Every page and chapter is `published: false` / `is_published: false`, awaiting founder review in the admin books editor.
- **The Ch.4 ↔ Ch.5 order** (matter before moving charges) is taxonomy-driven and unusual. Ch.4 is written to stand alone, but if the founder would rather teach moving charges first, swapping them is a chapter renumber plus rewriting two forward-promise callouts.
- **7 NCERT exercises skipped — all figure-dependent, never guessed at (2026-07-30):** Ch.1 Ex 1.14 (particle-track figure), Ex 1.26 (field-line curve figures); Ch.2 Ex 2.22 (electric-quadrupole charge array — more than one standard arrangement exists, guessing risks the wrong setup), Ex 2.25 (capacitor-network diagram); Ch.3 Ex 3.9 (circuit-network diagram) and Ex 3.20(c) only (parts a/b included); Ch.5 Ex 4.24 (named loop-orientation diagrams). If the founder supplies the actual NCERT page images for these, they can be added later — the skip is noted in-page via a `callout` so it reads as a deliberate gap, not a silent drop.
- **Ex 3.21 (Ch.3, infinite resistor-ladder network) is a genuine open question**, not just a skip. The topology of NCERT's actual Fig 3.32 wasn't available, so the builder solved the standard "each stage = one series + one parallel resistor" self-similar ladder (giving $ R = \frac{1+\sqrt5}{2} \approx 1.62\,\Omega $). Some published solution sets for this exact problem use a different stage topology and reach $ R = 1+\sqrt3\,\Omega $ instead. Both are legitimate readings of "an infinite network of 1Ω resistors" without seeing the figure — this is the one NCERT-exercise answer in the whole book that should be checked against the actual printed figure before a student relies on it.
