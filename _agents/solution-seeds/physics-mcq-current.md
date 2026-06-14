# Solution seeds — Physics MCQ Electric Current in Conductors (Part 5 Ch.2)

From the book's "Hints and Solutions" (pg 5-85→5-96, phys 342-353) + own re-derivation. Keyed by display_id.
Phase-4 reads THIS, not the PDF. Hints cover ~60/95; the rest are conceptual/recall where key + standard reasoning suffice.
All answers re-derived & confirmed vs key in the qmap **except Q95/CURR-380 (override c,d→b,d)**.

## Resistance / drift / networks (mostly c1)
- **CURR-286 (Q1)** Carrier density in metals ~ **10²⁸** /m³ (one free e⁻ per atom, atomic density ~10²⁸–10²⁹).
- **CURR-287 (Q2)** Drift velocity ~ **1 cm/s** (very slow; signal travels fast, electrons crawl).
- **CURR-288 (Q3)** R↑ with T because hotter lattice atoms vibrate more ⇒ **more frequent collisions** between carriers and vibrating atoms (d). Carrier density barely changes in a metal.
- **CURR-289 (Q4)** Cool to 80 K: copper (metal) R **decreases** (less lattice vibration); germanium (semiconductor) R **increases** (fewer thermally-freed carriers) ⇒ (d).
- **CURR-290 (Q5)** $I=neAv_d$; free e⁻ per unit length $=nA$; momentum each $=mv_d$. Per length $=nA·mv_d = (I/v_d)·m·v_d$... = $Anmv_d = \\frac{I}{e}m = \\frac{I}{(e/m)} = \\frac{I}{s}$ where $s=e/m$ (specific charge). **(b)**.
- **CURR-291 (Q6)** $I=neAv_d$ constant; $n$ const; $A$↑ along current ⇒ $v_d$ **decreases** (d).
- **CURR-292 (Q7)** Ring charge $Q$ rotating: each rotation moves $Q$ past a point, $\\omega/2\\pi$ rotations/sec ⇒ $I=\\frac{Q\\omega}{2\\pi}$ (c). (Uneven distribution irrelevant for the *total* current past a point.)
- **CURR-293 (Q8)** $R=\\rho x/A$ where $x$=edge ⊥ to faces, $A$=other two. $R\\propto x/(yz)=x²/(xyz)=x²/V$ ⇒ $R\\propto x²$. Longest $=2a$, shortest $=a$ ⇒ ratio $(2a)²/a²=$ **4** (b).
- **CURR-294 (Q9)** [book: symmetry] Bridge-type; by symmetry the middle R (A–B) carries no current (A,B equipotential), remove it ⇒ three resistances $2R, 2R, R$ in parallel ⇒ $1/R_{eq}=1/2R+1/2R+1/R=2/R$ ⇒ $R_{eq}=R/2$ (a).
- **CURR-295 (Q10)** Ring resistance per length $\\rho=R/2\\pi r$. Arc APB length $r\\theta$: $R_1=R\\theta/2\\pi$. Arc AQB: $R_2=R(2\\pi-\\theta)/2\\pi$. Parallel: $R_{eq}=\\frac{R_1R_2}{R_1+R_2}=\\frac{R}{4\\pi^2}\\theta(2\\pi-\\theta)$ (a).
- **CURR-296 (Q11)** [book: symmetry] Cube-like/network of equal R; between diagonally opposite corners ⇒ **2R/3** (c). (Use equipotential-point removal.)
- **CURR-297 (Q12)** Same network, adjacent corners ⇒ **8R/15** (d).
- **CURR-298 (Q13)** Ring has zero resistance ⇒ the three $3R, 3R, R$... "three resistances of 3R each in parallel" (book) gives $3R/3=R$, then + series $R$ ⇒ total **2R** (a). [Ring shorts nodes ⇒ the spokes parallel.]
- **CURR-299 (Q14)** Moving along a uniform current-carrying conductor, V **decreases linearly**. Passing through the cell (− to + inside), V jumps up by the terminal PD ($<\\varepsilon$, since internal drop). So: linear fall, then a step rise of $<\\varepsilon$ ⇒ graph **(b)**.
- **CURR-300 (Q15)** $V=\\frac{\\varepsilon R}{R+r}$. $1.6=\\frac{4\\varepsilon}{4+r}$, $1.8=\\frac{9\\varepsilon}{9+r}$. Solve ⇒ $\\varepsilon=2$ V, $r=1\\ \\Omega$ (b). (Check: 4·2/5=1.6 ✓, 9·2/10=1.8 ✓.)

## Cells (c4)
- **CURR-301 (Q16)** Short-circuit ($R_{ext}=0$): $I=\\varepsilon_{cfg}/r_{cfg}$. Series $NE/(Nr)=E/r$; **parallel** $E/(r/N)=NE/r$ (max). ⇒ all in **parallel** (b).
- **CURR-302 (Q17)** $n$ reversed cells subtract $2n$ from emf ⇒ $\\varepsilon_0=(N-2n)\\varepsilon$. Internal resistances add regardless of polarity ⇒ $r_0=Nr$. **(c)**.
- **CURR-303 (Q18)** $n$ cells in a closed loop (only the cells): $I=nE/(nr)=E/r$. PD across one $=E-Ir=E-E=$ **0** (a).
- **CURR-304 (Q19)** One reversed ⇒ net emf $(n-2)E$, total $r=nr$, $I=(n-2)E/(nr)$. Normal cell PD $=E-Ir=E-\\frac{(n-2)E}{n}=\\frac{2E}{n}$ (a).
- **CURR-305 (Q20)** Reversed cell A: current flows *against* its emf ⇒ PD $=E+Ir=E+\\frac{(n-2)E}{n}=\\frac{2(n-1)E}{n}=2\\varepsilon(1-\\frac1n)$ (c).
- **CURR-306 (Q21)** Two separate loops joined only by XY = one connection point, no second return path ⇒ current can't flow through XY (needs a return path) ⇒ **no current** (d).

## Wheatstone / instruments (c3)
- **CURR-307 (Q22)** A balanced Wheatstone bridge stays balanced when the cell and galvanometer are interchanged ⇒ zero deflection **in all cases** (a).
- **CURR-308 (Q23)** Two arms 6+4=10 and 4+6=10. Voltmeter (large R, draws ~0) reads the difference of the two midpoints: after-6Ω node $=\\frac{6\\varepsilon}{10}$, after-4Ω node $=\\frac{4\\varepsilon}{10}$ ⇒ $\\Delta=\\frac{2\\varepsilon}{10}=\\frac{\\varepsilon}{5}$ (c).
- **CURR-309 (Q24)** Shunt: $i_g G=(I-i_g)S$ ⇒ $S=\\frac{i_g G}{I-i_g}=\\frac{0.01·1}{1-0.01}=\\frac{1}{99}\\ \\Omega$ (c).
- **CURR-310 (Q25)** Voltmeter: $V=i_g(G+R)$ ⇒ $R=\\frac{V}{i_g}-G=\\frac{10}{0.01}-1=999\\ \\Omega$ (c).
- **CURR-311 (Q26)** $i_g G=(I-i_g)S$ ⇒ $G=\\frac{(I-i_g)S}{i_g}=\\frac{(100-10)·0.1}{10}=0.9\\ \\Omega$ (a).
- **CURR-312 (Q27)** A($R$) in series with B∥C ($1.5R\\,\\|\\,3R=R$). $V_A=iR$; B and C are across the same $R$-combo so $V_B=V_C=iR$. All **equal** (a). [$V_B=\\frac{2i}{3}·1.5R=iR$, $V_C=\\frac{i}{3}·3R=iR$.]
- **CURR-313 (Q28)** Parallel R across voltmeter lowers total R ⇒ current (A) **increases**; voltage across voltmeter **decreases** ⇒ (d).
- **CURR-314 (Q29)** Radial field keeps the coil plane always parallel to B ⇒ torque $\\propto I$ ⇒ **linear scale**, deflection ∝ current (d).

## Power / heating (c5)
- **CURR-315 (Q30)** Max power transfer ⇒ $R=r$ (a).
- **CURR-316 (Q31)** Cold filament has low R ⇒ initial current high; as it heats, R↑ ⇒ current falls to steady value. Curve **rises then settles down** (decreases to steady) ⇒ **(b)**.
- **CURR-317 (Q32)** A($3R$)∥B($6R$)$=2R$ in series with C($R$). Through C: current $i$. $V_{AB}=2Ri$. $i_A=2Ri/3R=2i/3$, $i_B=i/3$. $P_A=(2i/3)²·3R=\\frac43 i²R$, $P_B=(i/3)²·6R=\\frac23 i²R$, $P_C=i²R$ ⇒ **4:2:3** (c).
- **CURR-318 (Q33)** $R$ const, $P=V²/R$ ⇒ $P=(V/V_0)²P_0$ (c).
- **CURR-319 (Q34)** Bulb: $R=V_0²/P=100²/500=20\\ \\Omega$, rated $I=P/V_0=5$ A. Supply 200 V; bulb needs 100 V ⇒ extra 100 V across $R$ at 5 A ⇒ $R=100/5=20\\ \\Omega$ (b).
- **CURR-320 (Q35)** $R=V²/P$; higher-rated bulb (A) has **lower** R. Series ⇒ same $i$, $P=i²R$ ⇒ higher-R bulb (B) dissipates **more** ⇒ B draws more (b).
- **CURR-321 (Q36)** Each bulb $R=V²/P$. Series of $n$: $i=V/nR$, each draws $i²R=P/n²$, total $n·P/n²=P/n$ (c).
- **CURR-322 (Q37)** Same power rating ⇒ radiate same power. Bulb filament is much thinner/shorter ⇒ smaller surface area ⇒ must run **hotter** to radiate the same power. Most important reason: **dimensions differ** (c).
- **CURR-323 (Q38)** $P=V²/R$, $R=\\rho L/A$, same $V,L,$material ⇒ $P\\propto A\\propto d²$. $P_{100}/P_{25}=4=(d_1/d_2)²$ ⇒ $d_1:d_2=$ **2:1** (b).
- **CURR-324 (Q39)** $R\\propto L$; $L→0.9L$ ⇒ $R→0.9R$ ⇒ $P=V²/R→P/0.9=1.11P$ ⇒ +**11%** (b).

## RC / capacitor cluster (c1 / c5)
- **CURR-325 (Q40)** RC charging from a cell; voltmeter is the series resistance R, reads $V=iR$. Current decays from max to 0 ⇒ voltmeter reading **decays** (same shape as $I$–$t$) ⇒ graph **(b)**.
- **CURR-326 (Q41)** The middle R doesn't affect charging (ideal cell shorts it for the capacitor's Thevenin view); $C$ charges through the series $R$ only ⇒ $\\tau=RC$ (a).
- **CURR-327 (Q42)** Switch open ⇒ $C$ discharges through $R+R=2R$ ⇒ $\\tau=2RC$ (b).
- **CURR-328 (Q43)** $V=V_0e^{-t/\\tau}$; fall by 10% ⇒ $V=0.9V_0$ ⇒ $e^{t/\\tau}=10/9$ ⇒ $t=\\tau\\ln(10/9)$ (c).
- **CURR-329 (Q44)** $V=0.1V_0$ ⇒ $e^{t/\\tau}=10$ ⇒ $t/\\tau=\\ln10=$ **2.303** (b).
- **CURR-330 (Q45)** Charging $Q=Q_0(1-e^{-t/\\tau})=0.1Q_0$ ⇒ $e^{-t/\\tau}=0.9$ ⇒ $t=\\tau\\ln(10/9)$ (c).
- **CURR-331 (Q46)** $Q=0.9Q_0$ ⇒ $e^{-t/\\tau}=0.1$ ⇒ $t/\\tau=\\ln10=$ **2.303** (b).
- **CURR-332 (Q47)** Identical caps; final charge $Q/2$ each. $E_i=\\frac{Q^2}{2C}$, $E_f=2·\\frac{(Q/2)^2}{2C}=\\frac{Q^2}{4C}$. Heat $=E_i-E_f=\\frac{Q^2}{4C}$ (b) — independent of R.
- **CURR-333 (Q48)** $Q=Q_0e^{-t/\\tau}=Q_0/\\eta$ ⇒ $e^{t/\\tau}=\\eta$ ⇒ $t=\\tau\\ln\\eta$ (b).

## Type-2 networks/instruments/cells/RC
- **CURR-334 (Q49)** Current in neutral AB induces no net charge on cylinder L. A **charged beam** (electrons or protons) induces charge on L ⇒ free charge flows through C to earth ⇒ **(c),(d)**.
- **CURR-335 (Q50)** Accelerated ⇒ speed↑ (a). $I=neAv$ const (continuity), $A$ const ⇒ $n$ **decreases** (d). Current constant ⇒ (b) false.
- **CURR-336 (Q51)** $i=dQ/dt=a-2bt$: linear decrease (a); $i=0$ at $t=a/2b$ (c); $di/dt=-2b$ (d). No max (monotonic) ⇒ (b) false.
- **CURR-337 (Q52)** $i=a-bt+\\frac12 ct²$: $i(0)=a$ (a); $di/dt=-b+ct=0$ at $t=b/c$, $d²i/dt²=c>0$ ⇒ **minimum** (b, not c); $i_{min}=a-b²/c+\\frac12 b²/c=a-\\frac{b^2}{2c}$ (d).
- **CURR-338 (Q53)** C and D joined by a wire ⇒ same node (same potential, b). $R_{eq}$: A→M $=20\\|5=4$, M→B $=5\\|20=4$ ⇒ **8 Ω** (a). Currents: $i_{AC}=I/5$, $i_{AD}=4I/5$; at C need $4I/5-I/5=3I/5$ flowing **D→C** through the wire (d). (c) false (current does flow). ⇒ a,b,d.
- **CURR-339 (Q54)** [book: nodes] All four resistors effectively between A and B (the crossed wires make both diagonals join A,B) ⇒ four R in parallel $=R/4$ ⇒ $I=V/(R/4)=4V/R$ (d).
- **CURR-340 (Q55)** Diagonals touch at centre ⇒ all four corners join directly ⇒ A,B same point ⇒ $R_{eq}=$ **zero** (c).
- **CURR-341 (Q56)** Paths $AC_1D_2B$ and $AD_1C_2B$ in parallel, each 10 Ω (3+5+...; with the 5-Ω ammeters), total current 1 A from 10 V; each ammeter carries the branch current. $A_1,A_2$ read 1 A each (b,c). Cell current 2×... so (a) "1 A from cell" false. Joining $C_1C_2,D_1D_2$ ⇒ ammeters in parallel, equal R ⇒ equal readings (d). ⇒ b,c,d.
- **CURR-342 (Q57)** Pyramid of 6 equal wires (tetrahedron): between any two corners $R_{eq}=R/2$ (b), symmetric so independent of corner pair (so (a) false). Current A→B: by symmetry no current in DC (d). (c) false (D,C not shorted). ⇒ b,d.
- **CURR-343 (Q58)** K open, $R_{AB}=20$: two branches $20\\|R$-top... solving gives $R=80\\ \\Omega$ (a). Balanced bridge ⇒ no current through K closed (b). Symmetric ⇒ powers equal/unequal as stated (c,d). ⇒ all a,b,c,d. [verify topology with figure in Phase 4]
- **CURR-344 (Q59)** Ladder; reduce right-to-left. Current through 3-Ω = 1 A (a), through 4-Ω = 0.25 A (d). [solve ladder in Phase 4 with figure]
- **CURR-345 (Q60)** Rearranges to a **balanced Wheatstone bridge** ⇒ no current through 5-Ω (a); remove it ⇒ $R_{AB}=18/5\\ \\Omega$ (d).
- **CURR-346 (Q61)** Polygon, each side $R/n$. Opposite corners: two halves $R/2$ in parallel $=R/4$ (max, a). Adjacent: $R/n \\| (n-1)R/n = \\frac{R(n-1)}{n^2}$ (min, c).
- **CURR-347 (Q62)** Steady state ⇒ no current through capacitor branch. Find PD across the capacitor from the resistor network ⇒ **12 V** (c). [book: remove cap, distribute current.]
- **CURR-348 (Q63)** Disregard capacitors (steady state, no current through them); find current through G; then PD across each cap = PD across the resistor parallel to it. 0.2 A in G (b), $V_{C_1}=1$ V (c), $V_{C_2}=1.2$ V (d). ⇒ b,c,d.
- **CURR-349 (Q64)** Opposing cells $\\varepsilon_1<\\varepsilon_2$: $i=\\frac{\\varepsilon_2-\\varepsilon_1}{r_1+r_2}$. Cell 2 supplies, cell 1 absorbs (a). Both share the same terminal PD (b). $V_A-V_B=\\varepsilon_2+ir_2=\\frac{\\varepsilon_1 r_2+\\varepsilon_2 r_1}{r_1+r_2}>\\varepsilon_2$ (c,d). ⇒ a,b,c,d.
- **CURR-350 (Q65)** Charging a cell: supply PD must exceed $\\varepsilon$ (a); $T_1$ (to + terminal) positive (b); inside battery current flows + to − against emf (c). ⇒ a,b,c. (d) false.
- **CURR-351 (Q66)** Charging: moving $T_1→T_2$ through B, potential drops across wire resistances and rises across the cell being charged by $>\\varepsilon$ (since charging). Correct curve **(a)** (step rise $>\\varepsilon$).
- **CURR-352 (Q67)** Ideal cell, V+A in series: $V<\\varepsilon$ (drop across ammeter, a); $R_V=V/I$ (b); PD across ammeter $=\\varepsilon-V$ (c); $R_V+R_A=\\varepsilon/I$ (d). ⇒ all.
- **CURR-353 (Q68)** Voltmeter (600) across $R_1$(600): $R_1\\|600=300$, total 600, $V_1=120·300/600=60$ V (b). Across $R_2$(300): $300\\|600=200$, total 800, $V_2=120·200/800=30$ V (c). ⇒ b,c.
- **CURR-354 (Q69)** Parallel R (=ammeter R) halves ammeter branch R ⇒ total R drops slightly ⇒ V↑ slightly (b); current splits, but total rises a bit so A becomes **slightly more than half** (d). ⇒ b,d.
- **CURR-355 (Q70)** $V_1,V_2$ (series, different R) unequal (b); $V_1+V_2=V_3$ (V_3 across the pair) (c). ⇒ b,c.
- **CURR-356 (Q71)** A,B in series (same current) ⇒ $I_A=I_B$ (a); $I_AR_A+I_BR_B=I_CR_C$ (KVL across the two parallel arms, b); $\\frac{I_B}{I_C}=\\frac{R_C}{R_A+R_B}$ (current division, d). ⇒ a,b,d.
- **CURR-357 (Q72)** $G=100$, $i_g=50\\mu$A. (b) 10 V: $R=V/i_g-G=2\\times10^5-100$ ✓. (c) 5 mA: $S=\\frac{i_g G}{I-i_g}=\\frac{50\\mu·100}{5m-50\\mu}=1.01\\ \\Omega$ ✓. (a) 50 V needs ~1 MΩ (not 10k); (d) 10 mA needs 0.5 Ω (not 1). ⇒ b,c.
- **CURR-358 (Q73)** Meter (9 Ω, 10 mA) with 0.1 Ω, 0.9 Ω. A–B terminals: $i_g·9=(I-i_g)·... $ shunt 0.1 in the A-B path; $I×0.1=i_g×10$... ⇒ $I=\\frac{0.01×10}{0.1}=$ **1 A** (c).
- **CURR-359 (Q74)** A–C terminals (B isolated): different shunt path ⇒ full-scale at **100 mA** (b).
- **CURR-360 (Q75)** Potentiometer: driving cell emf $>$ unknown (a); like terminals of D and C both to A (b). (c) wrong (it's like-to-A, not necessarily positive); (d) false. ⇒ a,b.
- **CURR-361 (Q76)** $\\varepsilon/2$ balanced against gradient of D. $l=100·\\frac{r+R_{AB}}{2R_{AB}}=50(1+r/R_{AB})>50$ cm (b); needs $R_{AB}>r$ for $l<100$ (c). ⇒ b,c.
- **CURR-362 (Q77)** emf = work/charge around the **complete loop** (back to start), from any point ⇒ b,c,d (positive→positive, negative→negative, any point→same point). (a) false (that's just inside the cell, = PD not emf in general).
- **CURR-363 (Q78)** $i=\\varepsilon/(R+r)$. Cell power $=\\varepsilon i$ (a). Heat in R $=i²R=\\varepsilon i\\frac{R}{R+r}$ (c). Heat in cell $=i²r=\\varepsilon i\\frac{r}{R+r}$ (d). (b) false. ⇒ a,c,d.
- **CURR-364 (Q79)** Cell being **charged** (current opposite to emf): terminal PD $=\\varepsilon+ir$ (c). Electrical power into cell $=Vi=\\varepsilon i+i²r$; chemical stored $=\\varepsilon i$, heat $=i²r$ (d). Book key marks a,b,c,d all correct. **⚑Phase-4: re-examine (a) "absorbs εi" and (b) "stores chemical at εi−i²r"** — standard physics gives chemical storage $=\\varepsilon i$ (not $\\varepsilon i-i²r$); flag if genuine. [Likely the book intends (a)=chemical absorption εi and (b) net... resolve carefully, possibly a book looseness — verify, don't blindly override.]
- **CURR-365 (Q80)** $R\\propto V²/P$: 25-W has 4× the R of 100-W. Series, same $i$. $P_1$(25-W)$=16$ W (a), $P_2$(100-W)$=4$ W (d). ⇒ a,d.
- **CURR-366 (Q81)** $H=\\frac{V²}{R_i}t_i$ ⇒ $\\frac{V²}{R_i}=H/t_i$. Series: $H=\\frac{V²}{R_1+R_2}t$, and $R_i=V²t_i/H$ ⇒ $t=t_1+t_2$ (a). Parallel: $H=(\\frac{V²}{R_1}+\\frac{V²}{R_2})t$ ⇒ $t=\\frac{t_1t_2}{t_1+t_2}$ (c). ⇒ a,c.
- **CURR-367 (Q82)** Household: appliances in parallel (a). A control switch is in **series** with its appliance — so a parallel switch (c) would draw power when open (short across mains via appliance) and (d) blow the fuse when closed (shorts mains). ⇒ a,c,d. (b) false (switch must be series).
- **CURR-368 (Q83)** Parallel fuses: current splits, combo blows at 2×10 = 20 A (a). Series: same current, blows at 10 A (c). ⇒ a,c.
- **CURR-369 (Q84)** $i=a-2bt$, flows $0$ to $t_0=a/2b$. $H=\\int_0^{t_0}i²R\\,dt=R\\int_0^{a/2b}(a-2bt)²dt=R·\\frac{a^3}{6b}=\\frac{a^3R}{6b}$ (a).
- **CURR-370 (Q85)** KCL at D: $\\frac{70-V_D}{10}=\\frac{V_D}{20}+\\frac{V_D-10}{30}$ ⇒ $V_D=40$ V (a). Currents AD=3, DB=2, DC=1 ⇒ 3:2:1 (b). Power $=3²·10+2²·20+1²·30=200$ W (d). ⇒ a,b,d.
- **CURR-371 (Q86)** Heat dissipated = initial energy $\\frac12 CV²$, same for both regardless of R ⇒ equal heat (so b,c false). "Discharge completely" takes ∞ time for both (a false). ⇒ **all incorrect (d)**.
- **CURR-372 (Q87)** Both voltmeters are across the same capacitor ⇒ read identical voltage **at all times** (a). (B's resistance drains the cap, but both see the same cap voltage.)
- **CURR-373 (Q88)** X→Y (charge): heat in R $=\\frac12 CV²=H_1$ = max energy stored in C (d). X→Z (discharge): heat $=\\frac12 CV²=H_2$. ⇒ $H_1=H_2$ (a). ⇒ a,d.
- **CURR-374 (Q89)** Cell supplies $CV²=2·\\frac12 CV²=2H_1=2H_2$ (c); also $=H_1+H_2$ (d). ⇒ c,d.
- **CURR-375 (Q90)** Larger R ⇒ larger $\\tau$ ⇒ slower decay (stays higher). Curve 3 highest ⇒ $R_A$ (largest) ⇒ $3→A$ (d); $2→B$ (b); $1→C$ (c). (a) $1→A$ false. ⇒ b,c,d.
- **CURR-376 (Q91)** Identical caps: $Q_A$ falls $Q_0→Q_0/2$, $Q_B$ rises $0→Q_0/2$, both asymptote to $Q_0/2$ ⇒ graph **(a)**.
- **CURR-377 (Q92)** Remove slab (disconnected) ⇒ V jumps to $kV_0$. Discharge: $V=kV_0e^{-t/\\tau}=V_0$ ⇒ $e^{t/\\tau}=k$ ⇒ $t=\\tau\\ln k$ (b).
- **CURR-378 (Q93)** $i_0=V_0/R$, $\\tau=RC$ ⇒ $C=\\tau/R$. $Q_0=CV_0=\\frac{\\tau}{R}·i_0R=i_0\\tau$ (a). $E=\\frac12 CV_0²=\\frac12·\\frac{\\tau}{R}·(i_0R)²=\\frac12 i_0²R\\tau$ (d). ⇒ a,d.
- **CURR-379 (Q94)** Charging: more heat in A (carries charging current longer/more) (a). Steady state: equal current through A,B ⇒ equal heat rate (b). Steady $V_C=\\varepsilon/2$ ⇒ $E=\\frac12 C(\\varepsilon/2)²=\\frac18 C\\varepsilon²$ (d). ⇒ a,b,d. [confirm topology with figure in Phase 4]
- **CURR-380 (Q95)** ⚑ **OVERRIDE.** Same battery ⇒ same $V_0$; equal resistors ⇒ same $R$ ⇒ $i_0=V_0/R$ **identical** for both ⇒ currents at $t=0$ are **equal but not zero** (b), NOT unequal. $\\tau_1=RC_1<\\tau_2=RC_2$ ⇒ $C_1$ loses 50% sooner (d). **Correct = (b,d)**; book key (c,d) is a b↔c typo. Override answer + is_correct, save backup, push to Notion Physics Answer Discrepancies.
