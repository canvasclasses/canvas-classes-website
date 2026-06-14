# Solution seeds — Physics MCQ (Deb Mukherji) Ch.2 "Circular, Rotational and SHM"

Source: book's "Hints and Solutions to Selected Questions" (printed pages 1-91 → 1-110), captured 2026-06-10 during the same Phase-1 reading pass as ingestion (hybrid / solution-seed-sidecar pattern, per memory `project_physics_mcq_book_ingestion`).

**Phase-4 usage:** expand each seed into the teacher-style 6-section physics solution (`physics-solution-workflow.md`) via the `scripts/math-solutions/` toolkit. **Do NOT re-open the PDF** — everything the book printed is here. Re-derive every answer independently and check against the stored key (see qmap). For the figure-dependent ones, read the founder-uploaded figure (SVG→dark-PNG) before writing the 🖼️ section.

"book solution? = NO" in the qmap ⇒ the book gave no worked solution for that one; derive from scratch in Phase 4. Seeds below are only for the ones the book solved.

Notation: `l`=length, `g`=grav accel, etc. All answers below match the book key unless flagged ⚠.

---

## NLM (circular dynamics)

**NLM-178 (Q1):** The outward "force" mv²/r (centrifugal) is NOT a real force — it's a pseudoforce that appears only in the rotating frame. Real forces on the particle = weight mg + string tension T. ⇒ **(a)**.

**NLM-179 / NLM-180 / NLM-181 (Q2,3,4) — grouped, vertical circle, DIAGRAM (circle, A top, B bottom, C centre, D side; v1@top, v2@bottom, v3@side; T1,T2,T3; mg arrows):**
At top A: mv₁²/l = T₁ + mg. Min speed ⇒ T₁=0 ⇒ **v₁=√(gl)** (NLM-179 → b).
Energy A→B (drop 2l): ½mv₂² − ½mv₁² = mg·2l ⇒ mv₂²/l = mv₁²/l + 4mg.
At bottom B: mv₂²/l = T₂ − mg ⇒ mg + 4mg = T₂ − mg ⇒ **T₂ = 6mg** (NLM-180 → d).
Energy A→D (string horizontal, drop l): ½mv₃² − ½mv₁² = mgl ⇒ mv₃²/l = mv₁²/l + 2mg = 3mg = T₃ (horizontal, tension is the only horizontal/centripetal force, weight mg is vertical/tangential).
Net force on bob at D = √((3mg)² + (mg)²) = **√10 mg** (NLM-181 → c).

**NLM-182 (Q5):** book NOT solved separately, but Q7 area shows the method. Pendulum string breaking strength = 2mg, released from rest when horizontal. At angle θ from vertical, drop = l cosθ ⇒ v² = 2gl cosθ. Tension: T − mg cosθ = mv²/l = 2mg cosθ ⇒ T = 3mg cosθ. Set T = 2mg ⇒ **cosθ = 2/3 ⇒ θ = cos⁻¹(2/3)** → c.

**NLM-183 (Q6):** book NOT solved. Rigid ROD (not string) ⇒ rod can push/pull, so at the top the minimum speed can be **zero** (rod supports weight). → a.

**NLM-184 (Q7) — DIAGRAM (rod from A top, u=0, bob swings to B at angle θ, T=0, mg, C bottom):**
Released from rest at top (u=0). Energy A→ angle θ: mg(l − l cosθ) = ½mv². ⇒ mv²/l = 2mg(1 − cosθ). Tension zero when the only centripetal force is mg cosθ: mv²/l = mg cosθ ⇒ 2mg(1−cosθ) = mg cosθ ⇒ **cosθ = 2/3** → c (T=0 at θ=cos⁻¹(2/3) from vertical).

**NLM-185 (Q8):** Let x = spring extension. Particle moves in circle of radius (l+x); spring force kx = centripetal = mω²(l+x). ⇒ mω²(l+x)=kx ⇒ **x = mω²l/(k − mω²)** → b.

**NLM-186 (Q9):** a_c = k²rt² = v²/r ⇒ v = krt. Tangential accel a_t = dv/dt = kr. Net tangential force F_t = m·a_t = mkr. Power = F_t·v (radial force ⊥ v does no work) = (mkr)(krt) = **mk²r²t** → b.

**NLM-187 (Q10) — DIAGRAM (rod from car roof at angle θ, FBD: Tcosθ up, Tsinθ horiz, mg down, a_r):**
Radial accel a_r = v²/r = (10)²/10 = 10 m/s². T cosθ = mg, T sinθ = m a_r ⇒ tanθ = a_r/g = 10/10 = 1 ⇒ **θ = 45°** → c.

**NLM-188 (Q11) — needs Q-figure (road: A in a valley/dip, B on a crest/hump, C in a valley):**
Constant speed; N depends on curvature. At a crest (centre of curvature below road): mg − N = mv²/r ⇒ N = mg − mv²/r (reduced). At a valley/dip (centre above road): N − mg = mv²/r ⇒ N = mg + mv²/r (increased). With rA < rC (A sharper dip): N_A = mg + mv²/r_A > N_C = mg + mv²/r_C > N_B. ⇒ N maximum at **A** → a.

**NLM-189 (Q12) — DIAGRAM (cylinder, particle on inner wall, N inward, v):**
Wall normal reaction N = mv²/r (provides centripetal). Friction f = μN = μmv²/r (tangential, retards). Retardation a = f/m = μv²/r **∝ v²** → d.

**NLM-190 (Q13) — needs Q-figure (quarter-circle tube AC vertical plane, A at top, C at bottom, B partway):** book NOT solved. Derive: ball released at top A. Initially low speed ⇒ gravity component pulls it against the OUTER wall? Actually standard result: near A the required centripetal force is small and gravity's radial component exceeds it ⇒ ball presses on inner wall; lower down speed grows so required centripetal force exceeds gravity's radial component ⇒ ball presses on outer wall. ⇒ **initially inner, later outer** → c. (Verify the inner/outer geometry against the founder-uploaded figure.)

**NLM-191 (Q14):** Centripetal mv²/r supplied by friction, max μmg. Car slips when mv²/r > μmg i.e. v > √(μrg) [a true], μ < v²/rg [b true], r < v²/μg [so "slip if r > v²/μg" is FALSE → c is the not-true statement]. (d) is true — see Q65 hint (tangential accel adds to friction demand, so it slips at lower speed). Answer = the not-true one = **c**.

**NLM-192 (Q15) — DIAGRAM (car wheels, O centre of curvature left, C centre of mass, N1/N2 up on inner/outer wheels, F1/F2 friction):**
O = centre of curvature, C = CM. Torques of N₁, F₁, F₂ about C are clockwise; balanced by anticlockwise torque of N₂. Since N₁, N₂ equidistant from C ⇒ **N₂ > N₁** → b.

**NLM-193 / NLM-194 (Q16,17) — grouped, DIAGRAM (banked incline, block, N, Ncosθ, Nsinθ, mg, angle θ):**
Horizontal component of N gives centripetal: N sinθ = mv²/r. Vertical: N cosθ = mg ⇒ **tanθ = v²/rg**. At exactly v no friction needed ⇒ car won't slip (NLM-193 → a). For railway: AB = d (gauge), BC = h ⇒ sinθ = h/d ⇒ θ = sin⁻¹(h/d) ⇒ **tan(sin⁻¹(h/d)) = v²/rg** (NLM-194 → b).

**NLM-195 (Q18) — DIAGRAM (cyclist leaning on incline, 90° to road) + TIP:**
TIP: "A body moving along a circular path is in accelerated motion, and is therefore NOT in equilibrium." So (d) "cyclist is in equilibrium w.r.t. ground" is the FALSE statement → **d**. (a,b,c all true for correctly banked turn.)

**NLM-196 (Q49):** L = mvr = const (gravity neglected, horizontal circle). T = mv²/r = (m/r)(L/mr)² = L²/(m²r³) = (L²/m) r⁻³ ⇒ T = A r⁻³ ⇒ **n = −3** → d.

**NLM-197 (Q54) — DIAGRAM (pendulum, angular amplitude φ, instantaneous angle θ, L, T, mg):**
Energy from amplitude φ to angle θ: ½mv² = mg(l cosθ − l cosφ) ⇒ mv²/l = 2mg(cosθ − cosφ). Tension: T − mg cosθ = mv²/l = 2mg(cosθ − cosφ) ⇒ **T = mg(3cosθ − 2cosφ)**. (a) T=mg cosθ only at the extreme θ=φ (v=0) → b TRUE (not "for all θ"). (c) T=mg ⇒ 3cosθ−2cosφ=1 ⇒ cosθ = (1/3)(2cosφ+1) → c TRUE. (d) T larger for smaller θ (more depth, more speed & cosθ) → d TRUE. Key **b,c,d**.

**NLM-198 (Q55):** No external torque on system ⇒ angular momentum and ω stay constant; T = mlω² (the centripetal force) stays constant. T is the sum of the electrostatic attraction (to the negative charge at P) and the string's elastic-strain force. As the bob emits photoelectrons it becomes less negative → MORE positive → electrostatic attraction to the negative P INCREASES ⇒ the string's elastic strain must DECREASE (so the total stays T). ⇒ "T and ω unchanged" (c) and "elastic strain decreases" (d). Key **c,d**.

**NLM-199 (Q56) — DIAGRAM (conical pendulum, θ, L, r=l sinθ, Tcosθ up, Tsinθ in, mg):**
T sinθ = mω²r = mω²l sinθ ⇒ T = mω²l. T cosθ = mg ⇒ ω² = g/(l cosθ). Period t = 2π/ω = **2π√(l cosθ/g)** (b TRUE; not 2π√(l/g)). Also T = m(4π²/t²)l ⇒ **T = 4π²ml/t²** (c TRUE). (d) bob NOT in equilibrium (net horizontal centripetal force) → false. Key **b,c**.

**NLM-200 (Q57) — DIAGRAM (vertical circle, vi=u at bottom horizontal, vf vertical at side, l):**
Energy bottom→horizontal (rise l): ½mu² − ½mv² = mgl ⇒ v² = u² − 2gl. At bottom v_i = u î (horizontal); at side v_f = ĵ√(u²−2gl) (vertical). Δv = v_f − v_i = ĵ√(u²−2gl) − u î. |Δv| = √((u²−2gl) + u²) = **√(2(u²−gl))** → d.

**NLM-201 (Q58) — needs Q-figure (vertical axis, strings AP & BP each length l, AB=l ⇒ △ABP equilateral, P rotates):**
△ABP equilateral ⇒ both strings make 60° with vertical axis. Vertical: T₁cos60° = T₂cos60° + mg ⇒ **T₁ − T₂ = 2mg** (c). Horizontal (both inward, toward axis): T₁sin60° + T₂sin60° = mω²r where r = l sin60°; (√3/2)(T₁+T₂) = mω²·l(√3/2) ⇒ **T₁ + T₂ = mω²l** (b). Solve: T₂ = ½m(ω²l − 2g). BP taut needs T₂ ≥ 0 ⇒ **ω ≥ √(2g/l)** (d). (a) T₁=T₂ false. Key **b,c,d**.

**NLM-202 (Q59) — DIAGRAM (rotating rod, element at x, dx, tension T on inner face, T+dT outer):**
[ROUTING NOTE: rotating-rod internal tension — circular dynamics of mass elements; alt home ROT.] Element dm = (m/l)dx. Net inward force on element = T − (T+dT) = −dT = (dm)ω²x = (m/l)ω²x dx. Integrate: T = −(mω²/l)(x²/2) + C. At free end x=l, T=0 ⇒ C = (mω²/l)(l²/2). ⇒ **T = (mω²/2l)(l² − x²)** → d.

**NLM-203 (Q60) — DIAGRAM (rotating tube, element at x, dx, force F and F+dF):**
[ROUTING NOTE: same family as NLM-202.] dM = (M/L)dx. dF = (dM)ω²x = (M/L)ω²x dx ⇒ F = (Mω²/2L)x² + C. At x=0, F=0 ⇒ C=0. At the far end x=L: **F = ½Mω²L** → a.

**NLM-204 (Q61) — DIAGRAM (rotating ring, small arc AB subtends 2θ at centre C, tension T tangential each end, Tsinθ components inward):**
[ROUTING NOTE: hoop tension from centripetal; alt home ROT.] For a small arc subtending angle 2θ: inward net = 2T sinθ ≈ 2Tθ. Mass of arc = (2rθ)·m (m = mass/length). Circular motion: 2Tθ = (2rθ·m) r ω² ⇒ **T = mr²ω²** → c.

**NLM-205 (Q62) — needs Q-figure (S-track ABCDE, ABC & CDE quarter circles radius r, B&D near C, magnet, F normal, starts rest at A) — same figure used by the solution:**
At C, energy from A (drop r): ½mv² = mgr ⇒ mv²/r = 2mg. Normal reaction at C: F − N = mv²/r = 2mg ⇒ N = F − 2mg; N ≥ 0 ⇒ **F ≥ 2mg** (a). Taking speeds at B and D equal to that at C: at B (centre of curvature O, below/inside) F − N = 2mg ⇒ **N = F − 2mg** (b); at D (centre O′, other side) N − F = 2mg ⇒ **N = F + 2mg** (c). The normal reaction varies and equals F at some intermediate point (d). Key **a,b,c,d**.

**NLM-206 (Q65) — DIAGRAM (a_t and a_r=v²/r perpendicular, resultant a, angle θ):**
Tangential a_t and radial a_r=v²/r are perpendicular ⇒ resultant a = √(a_t² + (v²/r)²). Only horizontal force is friction μmg = ma ⇒ μg = √(a_t² + v⁴/r²) ⇒ **μ²g² = v⁴/r² + a_t²** (c). Friction is along a, making angle tan⁻¹(a_r/a_t) = **tan⁻¹(v²/a_t r)** with motion (d). (a) μrg is only the no-tangential case; (b) wrong (adds magnitudes). Key **c,d**.

---

## COM (centre of mass)

**COM-128 (Q19):** book NOT solved (trivial). x_cm from m = (M·L)/(m+M) ⇒ **L·M/(m+M)** → c.

**COM-129 (Q20):** No external horizontal force on 'man + boat' (man↔boat forces internal). System CM, initially at rest, stays at rest w.r.t. water — **in all cases** → a.

**COM-130 (Q21):** Treat the stick as a point mass at its CM. The CM is a projectile (only gravity external) ⇒ moves on a parabola — **in all cases** → a.

**COM-131 (Q22):** System stationary in air ⇒ net external vertical force zero (buoyancy balances weight). Internal climbing forces can't move the CM ⇒ CM **remains stationary** → a (same logic as Q20).

**COM-132 (Q23):** Compartment system: passengers are external to the compartment alone, so they can exert horizontal forces on it ⇒ **C₁ (compartment CM) may move**. But for 'compartment + passengers' there's no external horizontal force ⇒ **C₂ stationary**. → c.

**COM-133 (Q69):** book NOT solved. P = CM of 4 coplanar non-collinear point masses. (a) P may or may not coincide with a mass (true). (c) P lies within/on at least one of the triangles formed by any 3 of them (true — CM is a convex combination). (b) need not be inside quadrilateral ABCD (false for non-convex ordering); (d) need not lie on a line joining two points (false). Key **a,c**.

---

## ROT (rotational motion)

**ROT-194 (Q24):** book NOT solved. For a rigid body in equilibrium (ΣF=0), the net torque is the same about every point ⇒ if it's zero about one point it's zero about **any point on the system or outside it** → d.

**ROT-195 (Q25) — DIAGRAM (metre scale, strings T1@A end, T2@other end, mg@centre 0.5m, 2mg@0.75m):**
T₁ + T₂ = 3mg. Torque about A: 0.5·mg + 0.75·2mg = 1·T₂ ⇒ T₂ = 2mg, T₁ = mg ⇒ ratio T₁:T₂ = **1:2** → a.

**ROT-196 (Q26) — DIAGRAM (two like parallel forces F1,F2, resultant F at x from F1; interchanged, F shifts by d/4):**
Resultant F at distance x from F₁: F₁x = F₂(d−x). After interchange the resultant is at x' with shift d/4: F₁(3d/4 − x) = F₂(x + d/4). Dividing the two relations and using F₁/F₂ = (d−x)/x, solve ⇒ **F₁:F₂ = 3:5** → d.

**ROT-197 (Q27):** book NOT solved (mirror of Q28). Scale weight W at 50 cm. Balance (support) at 40 cm: torque of 10g@10cm and 20g@20cm vs W@50cm. 10(40−10) + 20(40−20) = W(50−40) ⇒ 300 + 400 = 10W ⇒ **W = 70 g** → c.

**ROT-198 (Q28) — DIAGRAM (light scale, weights g@1cm, 2g@2cm, support N@l):**
N = g + 2g + … + 100g = 5050g. Torque about 0: N·l = (1·g + 2·2g + … + 100·100g) = g·Σk² = g·(100·101·201/6) = 338350g. ⇒ l = 338350/5050 = **66.0 cm** → c.

**ROT-199 (Q29):** Smooth surface ⇒ no horizontal force/torque on the block; the only forces mg and N pass through the base ⇒ no toppling torque ⇒ **will not topple for any v** → d.

**ROT-200 (Q30) — DIAGRAM (block a×a×h, C centre, N up, F friction left, mg, Motion right):**
Friction F decelerates; N shifts forward to balance F's torque about C. Topple when N reaches the leading edge: F·(h/2) > N·(a/2). With F = μmg, N = mg: μmg·h/2 > mg·a/2 ⇒ **μ > a/h** → b.

**ROT-201..205 (Q31–35) — common rotational-kinematics block. For constant α: θ = 2πn = ½(ω_i+ω_f)t = ω_i t + ½αt², ω_f = ω_i + αt, ω_f² = ω_i² + 2αθ. For variable α: α = dω/dt = ω dω/dθ.**
- **ROT-201 (Q31):** θ = ½(20π+40π)·10 = 300π ⇒ n = 300π/2π = **150** → d.
- **ROT-202 (Q32):** First 3 s: 2π·10 = ½α·3² ⇒ α = 40π/9. In 6 s: N = (1/2π)·½α·6² = (1/2π)(½)(40π/9)(36) = 40. Next 3 s = 40 − 10 = **30** → c.
- **ROT-203 (Q33):** Let Ω = ω at switch-off. (Ω/2)² = Ω² + 2α(2π·36) gives α; then 0 = (Ω/2)² + 2α(2πN) ⇒ **N = 12** → d. (The "first 36 turns drop ω to Ω/2" segment carries 3× the KE of the remaining segment ⇒ remaining turns = 36/3 = 12.)
- **ROT-204 (Q34):** α = ω dω/dθ = −cω ⇒ dω = −c dθ ⇒ ω = ω_i − cθ (linear in θ). Drop to half in n turns: c(2πn) = ω_i/2. To rest: 0 = ω_i/2 − c(2πn') ⇒ **n' = n** → b.
- **ROT-205 (Q35):** α = ω dω/dθ = −cθ ⇒ ∫ω dω = −∫cθ dθ ⇒ ½ω_i² − ½ω_f² = ½cθ² ⇒ ΔE = ½I(ω_i²−ω_f²) = ½Icθ² **∝ θ²** → a.

**ROT-206 (Q36):** Constant power P = τω ⇒ **ω ∝ 1/τ** → b. (Linear analogue P = Fv.)

**ROT-207 (Q37):** book NOT solved. Two identical rods crossing as 'X' at their common point. MoI about the perpendicular axis through the intersection = sum of each rod's MoI about that axis = 2·(ml²/12) regardless of the angle between them (each rod's MoI about an axis ⊥ to the plane through its centre is ml²/12, independent of orientation). ⇒ **independent of θ** → d.

**ROT-208 (Q38) — DIAGRAM (rod at angle θ to axis through one end; element at distance x along rod, perpendicular distance x sinθ, dx):**
dm = (m/l)dx; perpendicular distance from axis = x sinθ ⇒ dI = (m/l)dx·(x sinθ)². I = (m/l)sin²θ ∫₀^l x² dx = (m/l)sin²θ·(l³/3) = **(ml²/3) sin²θ** → c.

**ROT-209 (Q39) — DIAGRAM (annulus, elemental ring radius x, width dx, inner r outer R):**
dm = (2πx dx)·m/(π(R²−r²)). dI = dm·x². I = [2m/(R²−r²)] ∫_r^R x³ dx = [2m/(R²−r²)]·(R⁴−r⁴)/4 = **½m(R²+r²)** → d.

**ROT-210 (Q40) — DIAGRAM (disc, X,Y axes in plane, Z perpendicular):**
I_Z = ½mr² = I_X + I_Y = 2I_D (perp-axis; I_X=I_Y=I_D diameter). ⇒ I_D = ¼mr² = mk² ⇒ k = r/2 = 4/2 = **2 cm** → c.

**ROT-211 (Q41):** mk² = mr² (given k=r) = I_CM + mh² = (2/5)mr² + mh² ⇒ h² = (3/5)r² ⇒ **h = √0.6 r** → c.

**ROT-212 (Q42) — DIAGRAM (equilateral triangle of rods, B,C base, A apex, axis through A ⊥ plane, I_D median, h, 60°):**
I about an axis ⊥ to plane through corner A = I_AB + I_AC + I_BC. Two rods AB, AC have the axis at one end ⇒ ml²/3 each. Rod BC: about its own centre (perp ⊥ plane) ml²/12, plus parallel-axis md² with d = l sin60° = (√3/2)l ⇒ I_BC = ml²/12 + m(3/4)l². Sum = (2/3)ml² + ml²/12 + (3/4)ml² = ml²[2/3 + 1/12 + 3/4] = (3/2)ml². Total mass 3m ⇒ (3m)k² = (3/2)ml² ⇒ k² = l²/2 ⇒ **k = l/√2** → c.

**ROT-213 (Q43) — DIAGRAM (square plate, AB & A'B' through centre parallel to sides, CD & C'D' a perpendicular pair through centre at angle θ):**
By symmetry I_AB = I_A'B'; I_AB + I_A'B' = I_O (perp axis). Similarly I_CD + I_C'D' = I_O and I_CD = I_C'D'. ⇒ I_AB = I_CD = I_O/2, **independent of θ** ⇒ I_CD = I → a.

**ROT-214 (Q44):** book NOT solved. L conserved: I_sphere ω = const, I = (2/5)MR². Halve R ⇒ I → I/4 ⇒ ω → 4ω ⇒ period → T/4 = 24/4 = **6 h** → a.

**ROT-215 (Q45):** L = Iω conserved (free space). E = ½Iω² = L²/2I. If I decreases, E increases ⇒ the man must **expend energy to decrease I** → b.

**ROT-216 (Q46):** book NOT solved. No external force during the brief collision in gravity-free space ⇒ the rod's CM moves in a straight line and the rod **rotates about its own centre of mass** → a.

**ROT-217 (Q47) — TIP:** "In sliding without friction and in rolling without slipping, no work is done against friction." So E_A (frictionless, all PE→KE) = E_B (rolling w/o slipping, static friction does no work) = mgh; E_C (rolling WITH slipping, kinetic friction dissipates) < mgh. ⇒ **E_A = E_B > E_C** → b.

**ROT-218 (Q48):** L = mv·d where d = perpendicular distance of the line of motion from origin = constant. ⇒ L **remains constant** → b.

**ROT-219 (Q63) — TIP:** Earth: same ω everywhere, but linear (eastward) velocity = ωR cosλ, max at equator, smaller at higher latitude. Wind moving north keeps its larger eastward velocity ⇒ relative to the ground it **shifts to the east** at higher latitudes → b.

**ROT-220 (Q64):** (→ hint 63.) P and S share the earth's ω but S (larger orbital radius) has larger linear (eastward) velocity than P. (a) TRUE. Particle fired S→P keeps S's larger eastward velocity ⇒ lands **east of P** (c) TRUE. (b) won't hit P, (d) not west. Key **a,c**. [ROUTING NOTE: touches GRAV-satellites.]

**ROT-221 (Q66):** book NOT solved. Density increases A→B ⇒ more mass near B. CM (C) is closer to B than midpoint O. (a) I_A > I_B: mass concentrated near B ⇒ axis at A is far from most mass ⇒ I_A > I_B TRUE. (c) I_O > I_C: C is the CM, MoI is minimum about the CM ⇒ I_C < I_O ⇒ I_O > I_C TRUE. Key **a,c**.

**ROT-222 (Q67):** book NOT solved. Square plate: I_x = I_y (symmetry), I_z = I_x + I_y = 2I_x (perp axis) ⇒ **I_x = I_y = ½I_z** (a). Diagonal is an in-plane central axis; all in-plane central axes of a square are equal ⇒ I_D = I_x (c). Key **a,c**.

**ROT-223 (Q68):** book NOT solved. Square frame, 4 rods mass m length l, side = l. (a) x-axis (through centre, parallel to two sides): the 2 rods ∥ x contribute m(l/2)² each = ml²/4·2 = ml²/2... recompute: 2 rods along x at distance 0 give ml²/12 each (rod about its own centre-length axis ≈ 0 for thin rod along axis) — full standard result: I_x = (2/3)ml² (a TRUE). (b) I_z = I_x + I_y = (4/3)ml² (b TRUE). (c) corner ∥ z: parallel axis, I_z,corner = I_z,cm + (4m)d² with d²=(l/√2)²... = (10/3)ml² (c TRUE). (d) about one side = (5/2)ml²?? recompute in Phase 4 — book key says all four TRUE. Key **a,b,c,d**. (Re-derive each carefully in Phase 4.)

**ROT-224 (Q70):** book NOT solved. Beam balance rests at an angle with unequal weights: the two pan weights give a NONZERO net torque about pivot P (a TRUE) — equilibrium is reached because the beam's own CM lies BELOW P (c TRUE), providing the balancing restoring torque. (b false — not MoI; (d) false. Key **a,c**.

**ROT-225 (Q71):** book NOT solved. Min number of concurrent/parallel forces for equilibrium: (b) 3 non-parallel non-concurrent (true), (c) 3 parallel (true — two can't balance if not collinear), (d) 4 equal-magnitude parallel (true). (a) 2 through CM — two forces balance only if equal/opposite/collinear, generally false. Key **b,c,d**.

**ROT-226 (Q72):** book NOT solved (block on incline, optional figure). Toppling vs sliding as θ increases. Slides when tanθ = μ. Topples (about lower edge) when tanθ = a/h (base half-width a/2 over height h/2). Topple-before-slide if the topple angle < slide angle ⇒ a/h < μ i.e. **μ > a/h ⇒ topple first** (a). Slide first if **μ < a/h** (d). Key **a,d**.

**ROT-227 (Q73) — DIAGRAM (beam A-B, men at A,B, C centre, N up at A, mg down at C):**
While both hold: each man's force = mg/2. One lets go (at B): take torque about A: τ = mg·(l/2) = Iα = (ml²/3)α ⇒ α = 3g/2l. a_CM = α·(l/2) = 3g/4. Force at A: mg − N = m·a_CM = m·3g/4 ⇒ N = mg/4. So it **decreases** (mg/2 → mg/4) → c.

**ROT-228 (Q74) — DIAGRAM (rod hinged at foot A, fallen angle θ, point P at distance, C, a, mg):**
Foot fixed (hinge). Torque about A at angle θ: mg·(l/2)sinθ = (ml²/3)α ⇒ α = (3g/2l)sinθ. Point at distance r: a = rα = (3gr/2l)sinθ. (b) different points have different a (∝ r) TRUE. (c) a given point's a changes with θ TRUE. (d) max a at the tip r=l, θ=90°: a = 3g/2 = **1.5g** TRUE. (a) false (tip can exceed g). Key **b,c,d**.

**ROT-229 (Q75):** book NOT solved (→ hint 45). Spinning man changes shape: can change MoI (a), hence ω (c, since L=Iω fixed), hence rotational KE (d). CANNOT change angular momentum L (b, no external torque). Key **a,c,d**.

**ROT-230 (Q76):** (→ hint 45.) Draws weights in ⇒ I decreases ⇒ ω increases (a), KE increases (c, KE=L²/2I), must expend energy (d). Angular momentum conserved, not decreased (b false). Key **a,c,d**.

**ROT-231 (Q77) — DIAGRAM (disc I1 spinning ω1, ring I2 placed on top, m, r):**
Friction acts ⇒ (a) TRUE. No external torque on disc+ring ⇒ L conserved (b TRUE). I_disc = ½mr², I_ring = mr². ω₂ = I₁ω₁/(I₁+I₂) = (½mr²ω₁)/(½mr²+mr²) = ω₁/3 (so (c) "2/3 of initial" is FALSE). Heat = E₁−E₂; ratio = (E₁−E₂)/E₁ = 2/3 ⇒ (d) "2/3 of initial KE → heat" TRUE. Key **a,b,d**.

**ROT-232 (Q78) — DIAGRAM (two discs different radii, rims in contact):**
Friction at the rims vanishes when there's no relative slip at the contact ⇒ equal **linear (rim) velocities**, not equal angular speeds (b TRUE, a false). The two discs spin about different axes and end with oppositely-directed angular momenta ⇒ angular momentum NOT conserved (c false); KE not conserved (d TRUE). Key **b,d**.

**ROT-233 (Q79):** τ brief Δt: ΔL = τΔt (a TRUE). Δω = ΔL/I = τΔt/I (b TRUE). From rest, rotational KE = L²/2I = (τΔt)²/2I (c TRUE). (d) "ΔKE = (τΔt)²/I" wrong by factor 2 → false. Key **a,b,c**.

**ROT-234 (Q80) — DIAGRAM (sphere A: impulse J through centre; sphere B: impulse J at height h off-centre):**
J = mv for both ⇒ same speed v (a TRUE). A: no torque ⇒ pure translation, KE = ½mv². B: J off-centre ⇒ also gains rotation ⇒ greater total KE (b TRUE). KE of B depends on impact offset (d TRUE). (c) false. Key **a,b,d**.

**ROT-235 (Q81) — TIP:** Sphere sliding → rolling: friction acts backward (opposes slipping at contact), causing linear retardation (b) AND angular acceleration (c); friction stops once pure rolling (v=ωr) begins (d). (a) false — friction direction doesn't reverse. Key **b,c,d**.

**ROT-236 (Q82) — figure optional (disc A→B, force on centre, friction A–B, smooth right of B, AB=s):**
A→B: rolls without slipping under force F + friction. Right of B (smooth): no friction ⇒ no torque ⇒ ω constant, but the full force F now accelerates only translation ⇒ linear acceleration INCREASES (b TRUE). One rotation A→B (distance s = circumference) took T. Right of B, ω is constant (= ωB after acceleration phase) so one rotation takes T/2 (c TRUE; it sped up). It covers > s in the next time T (d TRUE). (a) false. Key **b,c,d**.

**ROT-237 (Q83) — TIP:** Rolling WITH slipping: part of the friction work → rotational KE, only the rest → heat. Work against friction = Fl (a TRUE). Heat < Fl (b false). W (total KE at bottom) = mgh − heat > mgh − Fl (d TRUE; c false since heat<Fl). Key **a,d**.

**ROT-238 (Q84):** Rolling without slipping, total KE = ½mv²(1 + k²/r²). Same mgh ⇒ same total KE (d TRUE). v depends only on k²/r²: smaller k/r ⇒ larger v ⇒ reaches first. Order of k²/r²: solid sphere 2/5, disc 1/2, hollow sphere 2/3, ring 1 ⇒ arrival order **S, D, H, R** (c TRUE). (a,b false). Key **c,d**.

**ROT-239 (Q85) — DIAGRAM (rolling sphere v→wall, ω, α, F at contact):**
Elastic + smooth wall ⇒ linear velocity reverses to v, magnitude v (a TRUE). Spin ω unchanged (smooth wall, no torque) ⇒ now v and ω mismatched ⇒ rolling WITH slipping; friction decelerates ω to zero then reverses it (c TRUE — rotational motion stops momentarily) until rolling without slipping resumes after some time (d TRUE). (b false initially). Key **a,c,d**.

**ROT-240 (Q86) — TIP, figure optional (sphere rolling on plank, pin N):**
Rolling without slipping at constant speed ⇒ NO friction between sphere and plank. So removing pin N changes nothing: **no change in motion of S, P stays at rest** → d.

**ROT-241 (Q87) — DIAGRAM (rolling ring, C centre speed u; points B top, A bottom, D side, E; each has linear u + tangential u):**
Each point: velocity = u (translation) + u (rotation, tangential). v_A (bottom) = 0; v_B (top) = 2u; v_D (side, perpendicular) = √2 u; general 0 ≤ v ≤ 2u (a TRUE). v = u when the two u-vectors are at 120° (CP at 60° below horizontal) ⇒ (c TRUE). (d) v=√2u when CP horizontal TRUE. (b) v=u if CP horizontal — false (that gives √2u). Key **a,c,d**.

**ROT-242 (Q88) — needs Q-figure (rolling ring, B top, D bottom contact, A left, C right) (→ hint 87):**
Speed of a point ∝ distance from the instantaneous contact point D (bottom). Upper sections move faster ⇒ more KE. Section ABC (upper/around top) has greater KE than ADC (lower) (a TRUE). Section BC (upper-right, near top) > CD (lower-right, near contact) (b TRUE). (c,d false — not equal). Key **a,b**.

**ROT-243 (Q89) — DIAGRAM (wheel, blob at top D leaves with 2v, height 2r, lands B; A contact):**
At the top the blob has horizontal velocity 2v (top of rolling wheel) and height 2r. Projectile: 2r = ½gt² ⇒ t = 2√(r/g). Horizontal range from the top = 2v·t = 4v√(r/g). The landing point B measured along the road = **AB = 4v√(r/g)** → c.

**ROT-244 (Q90) — needs Q-figure (disc D rolls on surface S, string over massive pulley P to hanging block B), TIP:**
String wound on disc ⇒ block B's speed = 2× (centre of D) speed ⇒ a_B = 2a_D (a TRUE). Disc accelerates forward ⇒ friction from D on S acts to the left (b TRUE). Massive pulley ⇒ the two string sections have UNEQUAL tension (c false). Pulley + disc carry KE ⇒ KE(D)+KE(B) < PE lost by B (d TRUE). Key **a,b,d**.

**ROT-245 (Q91) — needs Q-figure (two blocks m1>m2 over massive pulley radius r), (→ hint 90):**
Massive pulley ⇒ unequal tensions (a TRUE). Inextensible string ⇒ equal-magnitude accelerations (b TRUE). String doesn't slip ⇒ angular accel = a/r (c TRUE). Pulley inertia reduces a below the ideal Atwood value ⇒ **a < ((m1−m2)/(m1+m2))g** (d TRUE). Key **a,b,c,d**.

**ROT-246 (Q92) — figure optional (A-B rod, P strikes A with u ⊥ AB):**
All three are one system ⇒ impact (internal) doesn't change the system's CM velocity. Before: only P moves (u) ⇒ v_C = mu/3m = u/3 (a TRUE). After: still u/3 (b TRUE, momentum conserved). 'A+B' can exert force on B only along the rigid rod (i.e. along AB, ⊥ to u) ⇒ B's velocity along u stays 0 just after impact (d TRUE). 'A+P' (mass 2m) just after: momentum of A+P = mu (P's) ⇒ v_{A+P} = mu/2m = u/2 (c TRUE). Key **a,b,c,d**.

**ROT-247 (Q93):** book NOT solved (continuation of Q92). C is CM of A,B,P. A & P (2m) at one end, B (m) at the other end of rod length l ⇒ AC = (m·l)/(3m) = l/3 (a TRUE). I about C = 2m·(l/3)² + m·(2l/3)² = 2ml²/9 + 4ml²/9 = 6ml²/9 = 2ml²/3 (c TRUE). Angular momentum about C just after = (initial L of P about C) = m·u·(l/3) = mul/3 (b TRUE). ω = L/I = (mul/3)/(2ml²/3) = u/2l (d TRUE). Key **a,b,c,d**.

**ROT-248 (Q94):** book NOT solved (continuation of Q92). After impact, system translates at u/3 and rotates ω = u/2l about C. 'A+P' is at distance l/3 from C: rotational speed = ω·(l/3) = u/6, and relative to C its velocity is u/6 (a TRUE) with angular velocity u/2l clockwise (b TRUE). B at distance 2l/3: speed rel C = ω·2l/3 = u/3, opposite side ⇒ "to the left" (c TRUE), angular velocity u/2l clockwise (d TRUE). Key **a,b,c,d**. (Re-check directions against geometry in Phase 4.)

**ROT-249 (Q95) — DIAGRAM (rod hinged at top, m, C centre, impulse J at bottom, l):**
Angular momentum about the pivot = J·l (a TRUE). I about end = ml²/3 ⇒ ω = L/I = Jl/(ml²/3) = 3J/ml (b TRUE). KE = L²/2I = (Jl)²/(2·ml²/3) = 3J²/2m (c TRUE). Midpoint speed v_c = ω·(l/2) = (3J/ml)(l/2) = 3J/2m (d TRUE). Key **a,b,c,d**.

---

## SHM

**SHM-120 (Q50):** book NOT solved. v = ±ω√(A²−x²) ⇒ v²/ (ωA)² + x²/A² = 1 ⇒ **ellipse** in the v–x plane → d.

**SHM-121 (Q51):** T = 2π/ω = 2 ⇒ ω = π. From mean, x = A sin ωt. x = A/2 ⇒ sin ωt = ½ ⇒ ωt = π/6 ⇒ t = (π/6)/π = **1/6 s** → d.

**SHM-122 (Q52):** book NOT solved (spring blocks, optional figure). In equilibrium both blocks hang: extension = (m₁+m₂)g/k. When m₂ drops off, the new equilibrium of m₁ is at extension m₁g/k — block m₁ is now displaced by m₂g/k above... it oscillates as SHM about the new equilibrium with **T = 2π√(m₁/k)** (only m₁ remains) → c.

**SHM-123 (Q53):** y = 4cos²(t/2)sin(1000t) = 2(1+cos t)sin(1000t) = 2sin(1000t) + 2cos t·sin(1000t) = 2sin(1000t) + sin(1001t) + sin(999t) ⇒ **3 harmonics** → b.

**SHM-124 (Q96) — TIP, figure optional (spring-block, +Q, field E right):**
Constant force (qE) added along the SHM line: time period UNCHANGED (c TRUE) — it only shifts the mean position (to the right, where net force = 0) (d TRUE). Key **c,d**.

**SHM-125 (Q97):** The added electrostatic force changes T only if it has a component along the displacement. (a/b) charge at the point of suspension exerts a force along the string (⊥ to the bob's displacement) ⇒ no effect ⇒ **T unchanged** (b TRUE). (c/d) uniform downward field on +charge adds to effective g ⇒ g_eff↑ ⇒ T = 2π√(l/g_eff) DECREASES (d TRUE). Key **b,d**.

**SHM-126 (Q98):** Coin on horizontal SHM platform, no slip ⇒ friction is the only horizontal force, supplying ma = −mω²x ⇒ always directed toward mean O (a TRUE). |F| = mω²|x| max at the extreme (max |x|) (d TRUE; c "F=0 at extreme" false). Key **a,d**.

**SHM-127 (Q99) — DIAGRAM (coin at displacement x from mean O, friction F, N, mg):**
a = ω²x (max at extreme). Required friction F = ma = mω²x, max = mω²A; limiting friction = μN = μmg. Coin slips first at the EXTREME (where a is max) (a TRUE) when mω²A = μmg ⇒ amplitude **A = μg/ω²** (c TRUE). Key **a,c**.

**SHM-128 (Q100) — DIAGRAM (coin on vertical-SHM platform, positions I bottom & II top, N, mg, a):**
Vertical SHM. At position II (highest, a downward): mg − N = ma ⇒ N = m(g − a). Loss of contact (N=0) needs a = g = ω²x, max at the top ⇒ first at the **highest position** (a TRUE) for amplitude **A = g/ω²** (c TRUE). Key **a,c**.
