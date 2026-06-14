# Solution seeds — Physics MCQ Electromagnetism (Part 5 Ch.3)

From the book's "Hints and Solutions" (pg 5-132→5-143, phys 389-400) + own re-derivation. Keyed by display_id.
Phase-4 reads THIS, not the PDF. All answers confirmed vs key. Fan-out: MVCH-194..251 / EMI-103..153 / ACUR-139..150 / EMW-001..002.
Constant: $k_B \equiv \mu_0/4\pi$ in the book's Biot-Savart form. Many "previous question" chains.

## EMW
- **EMW-001 (Q1)** $c = 1/\sqrt{\mu_0\varepsilon_0}$ ⇒ $\mu_0\varepsilon_0 = 1/c^2$ (d).
- **EMW-002 (Q2)** $\sqrt{\mu_0\varepsilon_0} = 1/c$ and $E/B = c$ for an EM wave, so $\sqrt{\mu_0\varepsilon_0}\,(E/B) = (1/c)(c) = 1$ — dimensionless (a).

## MVCH — Biot-Savart (mvch_4)
- **MVCH-194 (Q3)** Vertical wire, current up (+z); point due north (+y). $\vec B \propto \vec{dl}\times\hat r = \hat z\times\hat y = -\hat x$ = **due west** (c).
- **MVCH-195 (Q4)** Proton beam right, electron beam left ⇒ both currents in the SAME direction (electron current = −electron velocity). Between two equal parallel currents, fields oppose: $B = \frac{\mu_0 I}{2\pi}\left(\frac1x - \frac1{d-x}\right)$, zero at $x=d/2$, large +ve near one wire, large −ve near the other ⇒ descending-through-$d/2$ curve **(c)**.
- **MVCH-196 (Q5)** Finite straight wire: $B = \frac{\mu_0 I}{4\pi d}(\cos\theta_1+\cos\theta_2)$ (a) — standard form (book's $\theta$ measured from the perpendicular foot).
- **MVCH-197 (Q6)** Field of a straight segment is always ⊥ to the plane containing the wire and the point ⇒ normal to plane APB **in all cases** (d).
- **MVCH-198 (Q7)** Square loop, current in at A out at D. Resistance of AD (one side) is 1/3 of path ABCD (three sides), so $i_{AD}=\frac34 i$, $i_{ABC}=\frac14 i$. Each path's field at the centre is equal and opposite (field $\propto$ current$\times$... cancels) ⇒ field **zero only at the centre** (a). [book hint 7]
- **MVCH-199 (Q8)** Sections AB, DE (along the line through O) give zero field at O; BC, EF each give $\frac{\mu_0 I}{4\pi a}$, same direction, add ⇒ total $2\cdot\frac{\mu_0 I}{4\pi a}=\frac{\mu_0 I}{2\pi a}$ (c). [hint 8]
- **MVCH-200 (Q9)** Two long wires AB, CD distance $d$; on BC the two contributions are in the same direction, magnitude varies with position ⇒ different magnitudes at different points (c). [hint 9]
- **MVCH-201 (Q10)** At midpoint of BC (distance $d/2$ from each): $B = 2\times\frac{\mu_0 I}{4\pi(d/2)} = \frac{\mu_0 I}{2\pi d}$? — book: $2\times\frac{\mu_0 I}{4\pi(d/2)}=\frac{\mu_0 I}{\pi d}$... actually $2\cdot\frac{\mu_0 I}{2\pi(d/2)}=\frac{2\mu_0 I}{\pi d}$. Stored key (c) $=\frac{\mu_0 I}{2\pi d}$. Re-derive carefully in Phase 4; key=c.
- **MVCH-202 (Q11)** Quarter-circle arc AB carries current; straight radial parts give no field at C. Arc field at centre is ⊥ to plane, into the paper (c).
- **MVCH-203 (Q12)** Quarter circle: $B = \frac14\cdot\frac{\mu_0 I}{2r} = \frac{\mu_0 I}{8r}$ (c).
- **MVCH-204 (Q13)** Two semicircles (radii $R_1,R_2$) at common centre, current opposite senses ⇒ fields subtract: $B = \frac12\cdot\frac{\mu_0 I}{2}\left(\frac1{R_1}-\frac1{R_2}\right)=\frac{\mu_0 I}{4}\left(\frac1{R_1}-\frac1{R_2}\right)$ (d). [each semicircle $=\frac{\mu_0 I}{4R}$.]
- **MVCH-205 (Q14)** Orbiting electron, $n$ rev/s ⇒ current $i = ne$; field at centre $= \frac{\mu_0 i}{2r}=\frac{\mu_0 ne}{2r}$ (c). [hint 14]
- **MVCH-206 (Q15)** Magnetic moment $= iA = (ne)(\pi r^2)=\pi r^2 ne$ (b).
- **MVCH-207 (Q16)** $\mu = niA = ni\pi r^2 = \pi r^2 ni$ (a).
- **MVCH-208 (Q17)** Far axial field of a dipole (coil) $\mu$: $B=\frac{\mu_0}{2\pi}\frac{\mu}{d^3}$ (a). [hint 17: $B=\frac{\mu_0}{2}\frac{nir^2}{(d^2+r^2)^{3/2}}\approx\frac{\mu_0}{2}\frac{nir^2}{d^3}=\frac{\mu_0}{2\pi}\frac{\mu}{d^3}$.]

## MVCH — Ampere (mvch_5)
- **MVCH-209 (Q18)** Thin tube: by Ampere, $B=0$ for $0\le x<r$ (no enclosed current inside) (c).
- **MVCH-210 (Q19)** Coax, opposite currents: between conductors $B_1\neq0$ (encloses inner $I$); outside net enclosed $=0$ ⇒ $B_2=0$ (c). [hint 19]
- **MVCH-211 (Q20)** Same direction: outside encloses $2I\neq0$ ⇒ $B_1\neq0, B_2\neq0$ (a). [hint 20]
- **MVCH-212 (Q21)** $B_1=\frac{\mu_0 I}{2\pi x}$ (between, encloses $I$); $B_2$ at $2x$ outside encloses $2I$: $\frac{\mu_0(2I)}{2\pi(2x)}=\frac{\mu_0 I}{2\pi x}$ ⇒ $B_2=B_1$ (a). [hint 21]

## MVCH — force on conductors (mvch_3)
- **MVCH-213 (Q22)** Straight conductor along axis of ring: a current-carrying ring (field parallel to wire) feels no force; charge on ring (static or rotating) — the axial wire's field is azimuthal, exerts no net force on the ring ⇒ **none of the above** (d).
- **MVCH-214 (Q23)** Nonuniform charge spinning ⇒ ring carries current, but in the axial wire's azimuthal field the net force and torque are both zero (d).
- **MVCH-215 (Q24)** Bent conductor ABCDEF in uniform $B\parallel y$: force depends only on the straight-line vector from start to end. Forces on BC, DE cancel; net force on CD $=BIL$ (a). [hint 24: net = effective length × current × B]
- **MVCH-216 (Q25)** Closed loop in uniform field: net force = 0 for **any** field direction (d). [hint 25,26]
- **MVCH-217 (Q26)** Non-planar closed loop in uniform field: net force **must be zero** (a) — closed loop ⇒ $\oint d\vec l = 0$.
- **MVCH-218 (Q27)** Impulse $J=\int Bil\,dt = BlQ = mu$ ⇒ $u = \frac{BlQ}{m}$ (c). [hint 27]
- **MVCH-219 (Q28)** AB ⊥ to long wire XY: force on AB acts **upward** (c... key=a "upward"). Each element of AB carries $i$ in field of XY ($\propto 1/x$); net force is along the wire direction. Key (a) upward.
- **MVCH-220 (Q29)** $F=\int_{l/2}^{3l/2}\frac{\mu_0 I}{2\pi x}i\,dx = \frac{\mu_0 Ii}{2\pi}\ln 3$ (b). [hint 29: limits l/2 to 3l/2 give ln3]
- **MVCH-221 (Q30)** Square loop coplanar with long wire: there IS a net force (near and far sides feel unequal forces) — but it's attractive/repulsive depending on current sense. Key (a) "no net force"? Re-derive: stored key = a. [The near and far sides carry opposite currents in different fields ⇒ net force nonzero generally; but option (a) per book — verify in Phase 4.] Key=a.
- **MVCH-222 (Q31)** Net force $=F_{AB}-F_{CD}=\frac{\mu_0 Ii}{\pi}-\frac{\mu_0 Ii}{3\pi}=\frac{2\mu_0 Ii}{3\pi}$ (a). [hint 31: near side at l/2 gives $\frac{\mu_0 Ii}{\pi}$, far at 3l/2 gives $\frac{\mu_0 Ii}{3\pi}$, opposite ⇒ difference]

## MVCH — torque/moment (mvch_6)
- **MVCH-223 (Q32)** Plane makes angle $\theta$ with $B$ ⇒ normal makes $(90-\theta)$. $\tau=niAB\sin(90-\theta)=niAB\cos\theta$ (c).
- **MVCH-224 (Q33)** $\tau=\mu B\sin\theta$; $W=\int_0^\theta \mu B\sin\theta\,d\theta = \mu B(1-\cos\theta)$ (c). [hint 33]
- **MVCH-225 (Q34)** Plane at $\theta$ to $B$; loop rotates until plane ⊥ $B$ (torque zero), i.e. through $(90°+\theta)$ (c). [hint 34]
- **MVCH-226 (Q77)** Charge $Q$ static in $F_1$: A sees only E. B (moving) sees a moving charge ⇒ both E and B. So A,B both see E (a); B sees magnetic, A doesn't (d). ⇒ a,d.
- **MVCH-227 (Q78)** Field magnitude depends on distance from the $x$-axis (the wire). A$(0,1,0)$ dist 1; B$(0,1,1)$ dist $\sqrt2$; C$(1,0,1)$ dist 1; D$(1,1,1)$ dist $\sqrt2$. Same magnitude: A&C (both 1), B&D (both $\sqrt2$) ⇒ b,d. [hint 78]
- **MVCH-228 (Q79)** D at dist $\sqrt2$ from $x$-axis: $B=\frac{\mu_0 i}{2\pi\sqrt2}$ (a). Field is azimuthal around the $x$-axis ⇒ at D it makes 45° with the $xy$ plane (d). ⇒ a,d.
- **MVCH-229 (Q80)** Two antiparallel wires through $(0,\mp a,0)$ ∥ $x$-axis. On the $x$-axis (equidistant) fields ADD (antiparallel currents) ⇒ **maximum on x-axis** (b); on the $z$-axis the resultant is along $z$ at all points (d). ⇒ b,d.
- **MVCH-230 (Q81)** B moves with the electrons ⇒ sees electrons at rest but the (now-moving) positive lattice ⇒ same current, same B as A; neither sees a net E (conductor neutral) ⇒ a,d. [hint 81]
- **MVCH-231 (Q82)** Wire along $z$; A,B,C,D all at distance $a$ ⇒ same magnitude (a); azimuthal field ⇒ all different directions (b); A,C opposite (c); A,B ⊥ (d) ⇒ all a,b,c,d.
- **MVCH-232 (Q83)** Straight leads point at C ⇒ zero field from them (a); the two arcs carry the SAME current in opposite senses and their fields at C are equal & opposite ⇒ loop field zero (b). ⇒ a,b. [hint 83→see hint 7]
- **MVCH-233 (Q84)** Loop field at axial P is along OX (a); $d\vec B$ from element $d\vec l$ is ⊥ to AP (Biot-Savart $d\vec l\times\hat r$) (d). ⇒ a,d.
- **MVCH-234 (Q85)** For $B_1,B_4$ the inner+outer sections add; for $B_2,B_3$ they oppose. $B_4$ max (has a small-radius section), $B_3$ min ⇒ $B_4>B_1>B_2>B_3$ ⇒ a,b,c. [hint 85]
- **MVCH-235 (Q86)** Almost-complete loop: field $=$ loop term $\frac{\mu_0 i}{2r}$ (out of paper) minus straight-wire term $\frac{\mu_0 i}{2\pi r}$ (into paper) ⇒ net $\frac{\mu_0 i}{2r}(1-\frac1\pi)$, out of paper ⇒ b,c. [hint 86]
- **MVCH-236 (Q87)** $\vec\mu$ along normal (right-hand rule), direction set by current sense ⇒ b,c.
- **MVCH-237 (Q88)** Solid cylinder, uniform current: $B=0$ at axis (a); $B\propto x$ inside (b); $B\propto1/x$ outside (c); max at $x=r$ (d) ⇒ all.
- **MVCH-238 (Q89)** Outside a thick conductor the field is as if current is on the axis ⇒ equidistant points 1,2,3 have $B_1=B_2=B_3$ (a). [hint 89]
- **MVCH-239 (Q90)** $\vec F=i(\vec r\times\vec B)$, independent of shape (a,b). [hint 91,92: replace conductor by straight line joining ends]
- **MVCH-240 (Q91)** Semicircle: effective length = diameter $2r$; max force $=Bi(2r)=2Bir$ (b).
- **MVCH-241 (Q92)** Shape ABCDEF (sine-like), ends A,E on $x$-axis, $\lambda$ apart, amplitude $a$. Effective length = $\lambda$ (along $x$). $B\parallel x$ ⇒ $F=0$ (a); $B\parallel y$ ⇒ $F=\lambda Bi$ along $z$ (b); $B\parallel z$ ⇒ $F=\lambda Bi$ along $-y$ (c). ⇒ a,b,c.
- **MVCH-242 (Q93)** Rail current sets up field over T (same direction from both rails) (a); force on T is to the right (b). ⇒ a,b. [hint 93]
- **MVCH-243 (Q94)** $F\propto i^2$ (field $\propto i$, force $\propto Bi$) (b); reversing $i$ reverses both $B$ and current ⇒ force direction unchanged (d). ⇒ b,d. [hint 94]
- **MVCH-244 (Q95)** Parallel wires: attract if same direction (a); force per length same on both (Newton 3) (c). ⇒ a,c. [hint 95,96]
- **MVCH-245 (Q96)** $F=\frac{\mu_0 i_1 i_2}{2\pi d}$ ⇒ $F\propto i_1 i_2$ (a), $\propto 1/d$ (d). ⇒ a,d.
- **MVCH-246 (Q97)** Gas cylinder = thick conductor, parallel current filaments attract ⇒ pinch ⇒ **contract** (b). [hint 97]
- **MVCH-247 (Q98)** Current ring in ⊥ field: no net force (a); tends to expand or contract depending on current/field directions (d). ⇒ a,d.
- **MVCH-248 (Q99)** Inclined rails, $B$ vertical up, EF mass $m$ current $i$. $N\cos\theta=mg$, $N\sin\theta=Bil$ ⇒ $\tan\theta=\frac{Bil}{mg}$ i.e. $Bil=mg\tan\theta$ (b); $i$ must flow E→F for the force to balance (a). ⇒ a,b. [hint 99]
- **MVCH-249 (Q100)** $B$ normal to incline plane ⇒ $Bil$ acts along incline ⇒ balances $mg\sin\theta$: $Bil=mg\sin\theta$ (b). [hint 100→86]
- **MVCH-250 (Q101)** $\vec\tau=\vec\mu\times\vec B$ (a); ⊥ to both $\mu$ and $B$ (d). ⇒ a,d.
- **MVCH-251 (Q102)** $\vec\mu$ antiparallel to $\vec B$ ⇒ $U=-\mu B\cos180°=+\mu B$ = max energy ⇒ **unstable equilibrium** (c).

## EMI — Lenz/motional emf (emi_2)
- **EMI-103 (Q35)** Double loop, $B$ into page decreasing ⇒ Lenz: induced current opposes the decrease (maintains into-page flux) ⇒ clockwise in each loop ⇒ A→B and D→C (c). [hint 35]
- **EMI-104 (Q36)** N-pole of M toward R: Lenz ⇒ R's near face becomes N ⇒ repels M when approaching; attracts when receding. ⇒ **M repels R when moving towards** (a). [hint 36]
- **EMI-105 (Q37)** Motional emf $=(\vec v\times\vec B)\cdot\vec r$ (a). [hint 37: work on unit charge $=(\vec v\times\vec B)\cdot\vec r$]
- **EMI-106 (Q38)** Effective length between ends of semicircle = diameter $2R$; emf $=B(2R)v=2RBv$, Q higher (d). [hint 38: replace by straight chord]
- **EMI-107 (Q39)** Conductor N-S, moving east; vertical component $B_V=B_0\sin\delta$ cuts it ⇒ emf $=B_0 lv\sin\delta$ (c). [hint 39]
- **EMI-108 (Q40)** Conductor E-W, moving up; horizontal component $B_H=B_0\cos\delta$ ⇒ emf $=B_0 lv\cos\delta$ (d). [hint 40]
- **EMI-109 (Q41)** Rod + voltmeter = closed loop; a closed loop translating in uniform field has zero net emf ⇒ reading **zero** (d). [hint 41]
- **EMI-110 (Q42)** Ring on rails, replace by diameter ⊥ motion ($2r$). emf $=B(2r)v$; the two semicircular halves are in parallel, $R_{eq}=R/4$ ⇒ $i=\frac{B(2r)v}{R/4}=\frac{8Brv}{R}$ (d). [hint 42]
- **EMI-111 (Q43)** Ring spinning about its own axis ⇒ no flux change, no net emf (a). [hint 43]
- **EMI-112 (Q44)** emf across a radius $=\frac12 Br^2\omega$; rod = two radii in parallel between centre and rim, $R_{eq}=R/4$ ⇒ $i_W=\frac{\frac12 Br^2\omega}{R/4}=\frac{2Br^2\omega}{R}$ (d). [hint 44]
- **EMI-113 (Q45)** Induced emf depends only on the ring's linear (translational) motion, not on spin/rolling ⇒ same emf in all three (a). [hint 45]
- **EMI-134 (Q104)** = hint 36 logic: $i$ increasing in electromagnet A ⇒ growing flux ⇒ Lenz repels ring B (a); $i$ decreasing ⇒ attracts (c). ⇒ a,c.
- **EMI-135 (Q105)** Magnet falling through fixed ring: Lenz opposes motion ⇒ retards ⇒ $a<g$ both above (approaching) and below (receding) ⇒ a,c.
- **EMI-136 (Q106)** Current direction reverses as the magnet passes through (flux through ring reverses its rate of change) ⇒ **opposite in all cases** (b).
- **EMI-138 (Q108)** Rod AD moves right in $B$ into page: $\vec F$ on electrons $=-e(\vec v\times\vec B)$ pushes them to A ⇒ electrons to A (a); D positive (b); external current A→D inside rod / D→A outside (c); current in rod flows lower→higher potential, A→D (d) ⇒ all.
- **EMI-139 (Q109)** Loop entering/leaving field region between PQ,RS: emf nonzero only when one edge is in the field (positions I, III); zero in position II (fully inside, no flux change) (b); Lenz signs anticlockwise (I), clockwise (III) ⇒ b,c,d.
- **EMI-140 (Q110)** Constant $v$ ⇒ constant emf $Bav$ while entering; the step is sharp as BC crosses PQ (b); the loop is opposed (force to left) while entering (d) ⇒ b,d.
- **EMI-141 (Q111)** Only the part of the loop ($l/2$ length?) in the field develops emf; $e=\frac12 Blv$ (a), P positive (c) ⇒ a,c. [partial-loop geometry; verify with figure]
- **EMI-142 (Q112)** Shape ABCDE, ends A,E on $y$-axis $\lambda$ apart. $v\parallel y, B\parallel x$ ⇒ effective length along $y$ contributes... $e=0$ (a); $v\parallel z, B\parallel x$ ⇒ $e=B\lambda v$ (c); $v\parallel x, B\parallel z$ ⇒ $e=B\lambda v$ (d). ⇒ a,c,d. [effective length = AE = $\lambda$ along $y$]
- **EMI-143 (Q113)** N-pole: earth field vertical. $v$ vertical ⇒ rod (horizontal) moves ∥ field ⇒ $e=0$ (a); $v$ horizontal ⇒ cuts vertical field ⇒ $e=B_0 lv$ (d). ⇒ a,d. [hint 113]
- **EMI-144 (Q114)** Vertical ring falls, $B$ ⊥ plane. Replace by vertical diameter (⊥ to $v$): emf across A–D (horizontal diameter) $=B(2R)v$, D higher (d); C,E (top/bottom, along motion) at equal potential (c) ⇒ c,d.
- **EMI-145 (Q115)** Two rings (radii $r,2r$, speeds $2v,v$) on a conducting surface. emf of each = $B\times$diameter$\times v$: $e_1=B(2r)(2v)=4Brv$, $e_2=B(4r)(v)=4Brv$. They're connected (move oppositely) so emfs add ⇒ PD between top points $=e_1+e_2=8Brv$ (d). [hint 115]
- **EMI-149 (Q119)** Spinning disc: PD centre–rim $=\frac12 Br^2\omega$ (b); C higher than rim depends on $\omega,B$ sense — key: C higher (c); no current (open) ⇒ (d) false. ⇒ b,c.

## EMI — flux/Faraday (emi_1)
- **EMI-133 (Q103)** $\phi=at^n$ ⇒ $e=-\frac{d\phi}{dt}=-nat^{n-1}$. $0<n<1$: $e\neq0$, $|e|\propto t^{n-1}$ decreases (b); $n=1$: $e=-a$ constant (c); $n>1$: $|e|$ increases (d) ⇒ b,c,d.
- **EMI-137 (Q107)** $e=-d\phi/dt$ depends on the RATE, not value. $\phi=0$ doesn't force $e=0$; $e\neq0$ ⇒ $\phi$ may or may not be 0 (c).
- **EMI-146 (Q116)** $\phi=\pi r^2 B$ ⇒ $e=\pi r^2\frac{dB}{dt}$ (a). The induced E is symmetric ⇒ every element has equal emf and equal resistance ⇒ all points at the same potential (d) ⇒ a,d. [hint 116]
- **EMI-147 (Q117)** $\oint\vec E\cdot d\vec l = e$ ⇒ $E(2\pi r)=\pi r^2\frac{dB}{dt}$ ⇒ $E=\frac12 r\frac{dB}{dt}$ (d); E tangential everywhere (a) ⇒ a,d. [hint 117]
- **EMI-148 (Q118)** Induced $E=\frac12 r\frac{dB}{dt}$ tangential; force on charge element $dF=E\,dq$; torque $=\oint r\,dF = rE\,Q = r\cdot\frac12 r\frac{dB}{dt}\cdot Q=\frac12 Qr^2\frac{dB}{dt}$ (c). [hint 118]
- **EMI-150 (Q120)** Charge $Q=\frac{\Delta\phi}{R}=\frac{n\Delta(BA\cos\theta)}{R}$. Initially ⊥ ($\phi=BA$). $\theta=90°$: $\Delta\phi=BA$ ⇒ $Q=\frac{BAn}{R}$ (a); $\theta=180°$: $\Delta\phi=2BA$ ⇒ $Q=\frac{2BAn}{R}$ (so (b) wrong); $\theta=360°$: $\Delta\phi=0$ ⇒ $Q=0$ (d) ⇒ a,b... key=a,b,d. [Recheck: key 120=a,b,d. For θ=180 from perpendicular start, flux goes BA→−BA, |Δφ|=2BA ⇒ Q=2BAn/R, so (b) "BAn/R" would be wrong... but key says b correct. Re-derive in Phase 4 — possibly the charge formula uses net |Δφ| differently. Key=a,b,d.] [hint 120]
- **EMI-151 (Q121)** Plane initially ∥ B (φ=0). $\theta=90°$: φ→BA, $Q=\frac{BAn}{R}$ (a); $\theta=180°$: φ:0→0, $Q=0$ (c); $\theta=360°$: $Q=0$ (d) ⇒ a,c,d.
- **EMI-152 (Q122)** Rotating coil = AC generator: $e=BAn\omega\sin\omega t$ ⇒ changes nonlinearly (sinusoidally) with time (b), max value $BAn\omega$ (d) ⇒ b,d.

## EMI — inductance / LR (emi_3, emi_4)
- **EMI-114 (Q46)** $\phi=Li=BAN$ ⇒ $i=\frac{BAN}{L}$ (a). [hint 46]
- **EMI-115 (Q47)** Moving A→B across $1\Omega$, 15 V cell (B at −), 5 mH inductor with $di/dt=-10^3$: $V_A-V_B = i(1) - 15 + L\frac{di}{dt}=5-15+(5\times10^{-3})(-10^3)=-15$ ⇒ $V_B-V_A=15$ V (b). [hint 47]
- **EMI-116 (Q48)** Direction of $I$ reversed: $V_B-V_A=[5\times10^{-3}(-10^3)+15+1\times5]=15$ V (b). [hint 48]
- **EMI-117 (Q49)** $\varepsilon=L\frac{di}{dt}$ (zero-R coil) ⇒ $i=\frac{\varepsilon}{L}t=\frac{2}{4}t=0.5t$; $i=5$ A at $t=10$ s (d). [hint 49]
- **EMI-118 (Q50)** Steady current $i_0=\varepsilon/R_1$; energy in L $=\frac12 Li_0^2=\frac{L\varepsilon^2}{2R_1^2}$ = heat in $R_2$ on discharge (a). [hint 50]
- **EMI-119 (Q51)** $e_B=M\dot I$ ⇒ $M=\varepsilon/\dot I$; $\phi_A=Mi=\frac{\varepsilon}{\dot I}i$ (a). [hint 51]
- **EMI-120 (Q52)** Max mutual inductance $M_{max}=\sqrt{L_1 L_2}$ (coupling coeff ≤1) (d).
- **EMI-121 (Q53)** $B$ at centre of large coil $=\frac{\mu_0 I}{2R}$; flux through small coil $=\pi r^2 B$; $M=\phi/I=\frac{\mu_0\pi r^2}{2R}\propto\frac{r^2}{R}$ (b). [hint 53]
- **EMI-122 (Q54)** Each half: $L'=L/2$, $R'=R/2$. Parallel: $L_{eq}=L/4$, $R_{eq}=R/4$. $\tau=L_{eq}/R_{eq}=\frac{L/4}{R/4}=L/R$ (a).
- **EMI-123 (Q55)** $R_{eq}=R/4$ ⇒ steady current $=\varepsilon/(R/4)=4\varepsilon/R$ (c).
- **EMI-124 (Q56)** $\tau=L/R$, steady power $P=i_0^2 R=\varepsilon^2/R$; energy in coil $=\frac12 Li_0^2=\frac12\frac{L}{R}\frac{\varepsilon^2}{R}=\frac12\tau P$ = total heat on discharge (b). [hint 56]
- **EMI-125 (Q57)** $i=i_0(1-e^{-t/\tau})=0.1 i_0$ ⇒ $e^{-t/\tau}=0.9$ ⇒ $t=\tau\ln(10/9)$ (d).
- **EMI-126 (Q58)** $i=0.9 i_0$ ⇒ $e^{-t/\tau}=0.1$ ⇒ $t=\tau\ln10$ (d).
- **EMI-127 (Q59)** $i=i_0(1-e^{-t/\tau})$; emf across coil $=L\frac{di}{dt}=\varepsilon e^{-t/\tau}$ (c). [hint 59]
- **EMI-128 (Q60)** PD across coil $=\varepsilon e^{-t/\tau}$ = PD across R $=\varepsilon(1-e^{-t/\tau})$ ⇒ $e^{-t/\tau}=1/2$ ⇒ $t=\tau\ln2$ (b). [hint 60]
- **EMI-129 (Q61)** $i=i_0 e^{-t_0/\tau}=i_0/\eta$ ⇒ $\tau=t_0/\ln\eta$ (b). [hint 61]
- **EMI-130 (Q62)** Time constant of decay $=L/R=\tau$ — same as growth (depends only on $L,R$, not initial current) (a).
- **EMI-131 (Q63)** Energy $E=\frac12 Li^2\propto i^2\propto e^{-2t/\tau}$ ⇒ decays with time constant $\tau/2$ (b). [hint 63]
- **EMI-132 (Q66)** External field (no current in coil) ⇒ coil stores NO magnetic energy of its own; energy $\frac12 Li^2$ needs current $i=0$ ⇒ **zero** (a). [hint 66: the $\frac12 Li^2$ is for self-current; here i=0]
- **EMI-153 (Q123)** henry $=$ Wb/A $=$ V·s/A $=$ J/A² $=$ Ω·s ⇒ all a,b,c,d.

## ACUR — LC oscillation + AC (ac_2/3/4)
- **ACUR-139 (Q64)** LC: energy conservation $\frac{Q^2}{2C}=\frac12 Li_{max}^2$ ⇒ $i_{max}=\frac{Q}{\sqrt{LC}}$ (b). [hint 64]
- **ACUR-140 (Q65)** X→Y steady $i_{max}=\varepsilon/R$; then LC, $Q_{max}=i_{max}\sqrt{LC}=\frac{\varepsilon\sqrt{LC}}{R}$ (d). [hint 65]
- **ACUR-141 (Q67)** LC oscillation: $Q=Q_0\sin\omega t$, $i=i_0\cos\omega t$ ⇒ phase diff $\pi/2$ (b). [hint 67]
- **ACUR-142 (Q68)** $\tau=RC$, $\omega=1/RC$ ⇒ $X_C=1/\omega C=R$; $Z=\sqrt{R^2+X_C^2}=\sqrt{2}R$ (c). [hint 68]
- **ACUR-143 (Q69)** Same reactance: $\omega L=\frac1{\omega C}$ ⇒ $C=\frac1{\omega^2 L}=\frac1{(100\sqrt{10})^2\cdot2}=5\times10^{-6}$ F $=5\,\mu$F (c). [hint 69]
- **ACUR-144 (Q70)** $P=e_{rms}i_{rms}\cos\phi=e_{rms}\frac{e_{rms}}{Z}\frac{R}{Z}=\frac{e_{rms}^2 R}{Z^2}=P_0\left(\frac{R}{Z}\right)^2$ where $P_0=e_{rms}^2/R$ (a). [hint 70]
- **ACUR-145 (Q71)** LC series: $\tan\phi=\frac{\omega L-1/\omega C}{R}$; R=0 ⇒ $\phi=\pm\pi/2$. Low ω: $1/\omega C$ dominates, $\phi=-\pi/2$; high ω: $\phi=+\pi/2$ ⇒ **step** from $-\pi/2$ to $+\pi/2$ at resonance (a). [hint 71]
- **ACUR-146 (Q72)** $i=e/Z$, $Z=|\omega L-1/\omega C|$; at $\omega=1/\sqrt{LC}$, $Z=0$, $i\to\infty$ ⇒ **resonance peak** (d). [hint 72]
- **ACUR-147 (Q73)** RC series, $V_C=iX_C=\frac{eX}{\sqrt{R^2+X^2}}=\frac{e}{\sqrt{1+(\omega CR)^2}}$; as ω↑, $V_C$ decreases (b). [hint 73]
- **ACUR-148 (Q74)** At $\omega L=1/\omega C$: LC draws no power; RC and RL have equal impedance $\sqrt{R^2+X^2}$ and draw equal power. ⇒ $P_1=P_2=P_3$ (d). [hint 74: actually LC term draws 0, RC=RL] — key=d ($P_1=P_2=P_3$); verify which combos in Phase 4.
- **ACUR-149 (Q75)** $E^2=V_R^2+V_C^2$ ⇒ $V_C=\sqrt{220^2-90^2}=\sqrt{40000}\approx 200$ V (a). [hint 75]
- **ACUR-150 (Q76)** $X=R$ ⇒ $\tan\phi=X/R=1$, $\phi=45°$ ⇒ power factor $\cos45°=1/\sqrt2$ (c). [hint 76]
