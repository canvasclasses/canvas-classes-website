# THERMO — Voice Exemplar Bank (Thermodynamics & Thermochemistry)

> Chapter-specific companion to `teacher-voice-profile.md`. Built 2026-06-12 from the
> Thermodynamics video set: Crash Course L1 (V7uChUeuSzc, full), L2 (AnnJaLUlnMk, full),
> L3 Thermochemistry (hQDUFSHokTQ, mined), L4 Entropy/Gibbs (6dxB49anz8o, mined),
> Isothermal & Adiabatic Work special (OdjaGJca4A0, mined), Entropy & Gibbs fundamentals
> (HTqpDc-nWB8, mined). Pre-requisite video (TADFKhfM1tE) skipped — lowest priority;
> one-shot (437RxJzwOhk) skipped per ASR reliability. Transcript quality: very good
> Devanagari ASR throughout; occasional formula garbling (e.g. "NCP डेल्टा T", dropped
> γ symbols) but rhetoric fully intact.
> Use: when writing a THERMO solution, find the matching concept family below and reuse
> HIS opening/analogy/trap — adapted to written English per profile §2.

## A. Analogy inventory (concept → his actual analogy)

| Concept | His analogy (use this, don't invent) |
|---|---|
| Reversible process | Chawal ka dana (rice grain) on a balanced pulley / piston — one grain ⇒ infinitesimal move; remove it ⇒ exact reverse. 1 kg rakha ek saath = irreversible jerk ("jhatke se hogi saari cheezein — no guarantee wahi point pe pahunchoge") |
| Why the reversible PV curve exists | Every grain-pause is an equilibrium point — "un saare points ko joda toh curve aaya." Irreversible: "beech ka koi point hi nahi aaya — aap curve kaise draw karoge?" Only initial + final known ⇒ rectangle at the final point |
| Heat capacity | Kitchen: paani vs oil, same flame, same patila — oil garam pehle. Paani absorbs more yet stays cool ⇒ good coolant: "khud zyada garam ho gaya toh phir coolant kis baat ka?" |
| C = ∞ for isothermal | The system spends every rupee of heat instantly: "heat de rahe ho, woh kharch kar de raha hai... bach hi nahi rahi heat — taaki temperature constant rahe" |
| Why CP > CV (and why gap = R) | Twin piston-cylinders, same gas: constant-P wala expansion mein kuch kharch kar deta hai, so reimburse it exactly the work of expansion ⇒ CP = CV + work. "Yeh R kya represent kar raha hai? Ideal gas ka expansion work. Nothing else." |
| ΔH bookkeeping (q = ΔU + PΔV) | 100 kJ supplied → 20 spent in expansion → 80 left for internal energy — a kharcha ledger |
| Spectator ions (why ΔH_neut is fixed) | Cricket-match audience: "aap match dekhne baithe hain — aapke hone ya na hone se koi jeetega ya harega? Definitely nahi." Reacting species are only H⁺ + OH⁻ |
| Weak acid/base neutralization < 13.7 | Out of the 13.7 released, some hissa is spent dissociating the weak acid; the bigger the gap, the weaker the species |
| Why ΔS = q/T (T in denominator) | Beggar vs rich man given a ₹2000 note — "khushi 2000 ke note mein nahi hai, difference mein hai." Also: ice-cream offered when you're stuffed vs starving. Cold system gains more entropy from the same heat |
| Entropy is a *measure*, not disorder itself | Fever: "temperature bukhaar nahi hai — woh indicator hai ki body ke andar koi samasya hai" |
| Microstates | 10 kursiyan, 10 bachche — count the seating permutations; each arrangement is one microstate |
| Entropy extensive | Class with teacher gone: 20 bachche ka halla > 10 ka |
| Entropy not a molecular property | "Ek akele particle ki entropy nahi hoti. Udham machane ke liye ek se zyada chahiye — class mein ek bachche ko chhod do, kya karega woh?" |
| Bigger container ⇒ higher S | Chhota kamra vs bada hall — "aap zyada uchhal-kood machaoge" |
| Gas mixing / disorder | "Khichdi hogi — ekdum se mixing" with zero energy exchange ⇒ energy alone can't drive spontaneity |
| Energy–entropy tug of war | "Saadhu wali zindagi bhi chahiye aur kamane bhi crores hain — contradictory statement hogi." Both want opposite things; somewhere they compromise; **temperature decides who sits in the driving seat** |
| ΔH vs ΔS spontaneity (4 cases) | Mummy–papa permission: "dono maan gaye toh koi tension hi nahi (always spontaneous)... ek maana ek nahi — ab dekhna padega chalti kiski hai, kiska palda bhari hai (temperature decides)... dono ne mana kar diya toh ab kuch bhi kar lo, woh cheez nahi aayegi (never spontaneous)" |
| Reversible = ideal, only in books | "Jaise ideal students nahi hote — roz time pe uthenge, padhai karenge. Waise ideal process reversible nahi hota. Sirf kitabon mein hota hai." Hence all real/spontaneous processes are irreversible |
| Equilibrium | "Energy minimum, entropy maximum — bas main moksh prapt wahan kar lunga" |
| ΔU vs ΔS on rev/irrev | "ΔU bhedbhav nahi karta — dono ke liye zero hoon. ΔS bhedbhav karta hai" (NCERT line, dramatized as the quantities speaking) |
| System–surroundings exchange | Ghata–munafa ledger: "jo ek ka loss hai woh doosre ka profit hai" (equilibrium ⇒ equal & opposite) |
| Unavailable energy (TΔS) | Body energy after khana: you can never spend ALL of it on work — a part is reserved for survival. ΔG = the spendable part |
| Third law "perfectly crystalline" | School prayer assembly — sab line mein, par do bachche galat dress pehen ke aa gaye: visible from afar = structural disorder. Thermal disorder → kill with T = 0 K; structural → demand a perfect crystal |
| Spontaneity gallery | Paani upar se neeche; garam chai ka cup thanda ho hi jaata hai (never the reverse — "thande se kaun mana kar raha hai usko?"); gilaas paani farsh pe gira — kuch ghante mein sookh jaata hai (endothermic yet spontaneous) |
| State-vs-path "dharm sankat" | Adiabatic: W = ΔU, but work is path function and ΔU state function — "yeh toh dharm sankat ho gaya!" Resolution: reversible and irreversible adiabatic from the same start NEVER reach the same final point — "diverge karte hain, milenge nahi uske baad kahin bhi" |

## B. Must-memorize constants & rules he dictates (use in ⚡ sections)

- **1 L·bar = 100 J** — his unit-trap killer; R = 2 cal/(mol·K) for calorie problems; "temperature ki value formula mein hamesha Kelvin mein"
- **ΔH_neut (strong–strong) = −13.7 kcal = −57.1 kJ** — fixed for any strong pair, because the real reaction is only H⁺ + OH⁻
- CV: mono 3/2 R · dia 5/2 R · tri 3R; **CP − CV = R** ("ek hi value yaad karni hai, R add kar do"); γ = 1.66 mono; **γ decreases as atomicity increases**
- The three **reversible-adiabatic-only** relations: TV^(γ−1), PV^γ, T^γP^(1−γ) = constant — "yeh formula har kisi adiabatic mein nahi lagta, sirf reversible mein"
- W_adiabatic = nCVΔT = nRΔT/(γ−1) = (P₂V₂ − P₁V₁)/(γ−1) — pick by what data is given
- ΔH = ΔU + **Δ(PV)** (not blindly PΔV); gases reacting at fixed T → ΔngRT (gas moles only)
- **Bomb calorimeter = constant V = ΔU; water calorimeter = constant P = ΔH** — examiner says "heat change at constant pressure/volume" instead of ΔH/ΔU
- ΔHf° = 0 for most stable forms: C(graphite), Br₂(l), white P, rhombic S, H₂/O₂/N₂ gas, and H⁺(aq) **by convention**; S°(H⁺, aq) = 0 also assumed
- Master entropy formula: **ΔS = nCV ln(T₂/T₁) + nR ln(V₂/V₁)** — one formula, kill terms per condition (isothermal/isochoric/isobaric); phase change: ΔS = ΔH_trans/T_trans
- Slope of adiabatic = **γ ×** slope of isothermal; T_final(irrev adiabatic) > T_final(rev adiabatic) — "proof hai, par abhi yaad rakhein"
- Spontaneity boundary: set ΔG = 0 ⇒ **T = ΔH/ΔS**, then decide which side
- The doctrine he repeats before formulas: *"Given kya hai? Unknown kya hai? Dono ko connect karne wala formula kya hai? Yeh samajh liya toh aadha question solve ho gaya."*

## C. Trap bank (concept → the reflex he dramatizes, for ⚠️ sections)

- **"Constant external pressure" = irreversible.** The question won't say irreversible — read the signal. "Jab bhi P external constant ho, woh irreversible hai. Reversible ke liye it HAS to be variable."
- **"Maximum work" disguise:** examiner never says reversible/irreversible — "calculate the maximum work of expansion" ⇒ reversible formula; maximum work of *compression* ⇒ irreversible. "Tumhe figure out karna hai."
- **ΔH = ΔU + PΔV rote:** "Normally bachche yaad karte hain ΔU + PΔV — aur woh galat hai. It is Δ of PV" — the VΔP term dies only when P is constant.
- **PV^γ on irreversible adiabatic** — the IIT Advanced classic. Insulated free expansion: q = 0 AND W = 0 ⇒ ΔU = 0 ⇒ effectively isothermal too; P₁V₁ = P₂V₂ holds, P₁V₁^γ = P₂V₂^γ does NOT ("irreversible tha, isliye yeh wali equation apply nahi ho payi").
- **Units circus:** answer in L·bar but options in kJ ("nine match kar raha tha — par units pe dhyan nahi diya: −0.9 kJ"); computed for 5 mol but asked per mole; ΔH in kJ vs ΔS in J/K inside ΔG = ΔH − TΔS ("jaldbaazi mein dhyan nahi dete — dono ko same unit mein lao").
- **ΔT = 0 ≠ isothermal:** 50° → 55° → wapas 50° gives ΔT = 0 — essential condition is dT = 0 throughout.
- **Excess-information red herrings:** isothermal reversible 1→10 L, find ΔH — "dimaag mein bahut saari cheezein aati hain: work ka formula lagayen? reversible ka?" Answer: PV constant ⇒ ΔH = 0. And the CH₄ combustion data planted in the C₃H₇NO₂ question: "kai baar extra information sirf confuse karne ke liye di jaati hai."
- **Formula scope:** P = 20/V given (non-ideal expression) and the reflex reaches for −2.303nRT log(V₂/V₁) — "woh formula derive hua tha jab PV = nRT tha. Ab expression kuch aur hai — fundamental se W = −∫P dV karna padega."
- **q_reversible in ΔS — always:** even when the actual path is irreversible, ΔS = q_rev/T. "Calculation mein kabhi bhi q irreversible nahi aata."
- **ΔS_surr formula switches:** reversible ⇒ equal-and-opposite of system; irreversible ⇒ ΔS_surr = −q_sys/T = PextΔV/T — "system ka formula same hai dono mein, surrounding ka different. Yahin bachche pareshan hote hain."
- **"Entropy of universe is always increasing" as a bare statement is WRONG** — must append "in a spontaneous process / isolated system"; for a reversible process ΔS_univ = 0.
- **Negative ΔS_sys can still be spontaneous** (iron rusting) — "kahin nahi likha ki SYSTEM ki entropy badhni chahiye. System plus surrounding mila ke universe ki badhni chahiye."
- **Neutralization in moles:** "1 mol acid ko 1 mol base neutralize kar dega — galat ho jayegi baat" (H₂SO₄ needs 2) — that's why gram equivalents define it.
- **Δng = GAS moles only**; combustion water is **liquid**, never vapour.
- **Third law word-surgery:** drop "perfectly" or "crystalline" and the statement turns false — every word carries marks.
- **Benzene bond-energy method:** "yeh tareeka hi galat hai — teen single aur teen double bond hote hi nahi benzene ke andar (bond order 1.5)" — which is exactly why theoretical − actual = resonance energy.
- **Phase-change ΔS/ΔH in one shot:** 10 °C water → −10 °C ice cannot take one formula — split into cool → freeze → cool; and watch signs: "yeh heat release ho rahi hai — isko positive mein mat le lena."

## D. Per-question exemplars — opening → key move → closing

1. **Identify the intensive quantity** — Open: 30 seconds. Key: bucket of 50° bath water → mug → spoon: temperature same; burn more substance → more heat ⇒ enthalpy extensive. Close: common-sense verdict.
2. **Not a thermodynamic property (work)** — Key: "Sir, is gilaas paani mein itna work hai — aisa kabhi bola aapne? Nahi." Work/heat live only at the boundary, during transit.
3. **Essential condition for isothermal** — Open: "yeh very beautiful question hai." Key: the 50→55→50 counterexample kills ΔT = 0; dT = 0 survives.
4. **W for 1→10 L vs constant Pext** — Key: constant Pext ⇒ irreversible ⇒ −PextΔV = −9 L·bar. Close: the −9 vs −0.9 kJ unit ambush ("aise bhi confuse kiya jaata hai").
5. **5 mol He, isothermal reversible, max work** — Key: "maximum work likhne ka koi zyada sense nahi — reversible bata hi diya, usmein maximum aana hi aana hai." Plug −2.303nRT log(V₂/V₁). Close: "calculation pe time barbaad nahi karna."
6. **Isothermal irreversible, heat in kJ/mol** — Key: ΔU = 0 ⇒ q = −W; W via −PextΔV with V = nRT/P. Close: the per-mole division most students forget ("work sahi nikaal denge, par bhool jayenge 5 mol ke liye tha").
7. **Free expansion + adiabatic** — Key: vacuum ⇒ W = 0; adiabatic ⇒ q = 0 ⇒ ΔU = 0 ⇒ ΔT = 0 — three zeros cascade.
8. **Fe + 2HCl in open beaker (W = ?)** — Open: physical picture first. Key: tiny H₂ bubble expands into the whole room ⇒ V₂ − V₁ ≈ V₂ = nRT/P; pressures cancel ⇒ W = −nRT = −600 cal (R = 2). Close: "bas, solve ho gaya."
9. **Heptane combustion, ΔH − ΔU** — Key: balance, water liquid, Δng = 7 − 11 = −4 ⇒ −4RT. Close: data type (a reaction) chose the formula.
10. **ΔH with CP = f(T)** — Open: 1 minute. Key: CP variable ⇒ integrate nCPdT, limits 300→1000. Close: the given/unknown/connector doctrine, verbatim.
11. **CP & CV graphs (which plot is wrong)** — Key: CP is *defined* at constant pressure ⇒ can't climb with P; CV staircases at phase changes (degrees of freedom jump). Close: each sudden slope = change of state.
12. **Isothermal reversible 1→10 L: ΔH?** — Open: "achchha question tha — starting mein ekdum se realize nahi hota." Key: ΔU = 0 and Δ(PV) = 0 ⇒ ΔH = 0. Close: "excessive information dena bhi ek achchha question hota hai."
13. **Non-ideal gas, ΔH in L·atm** — Key: H = U + PV is the standard definition — "isse fark nahi padta ki ideal gas thi ya nahi"; the student-voice doubt "sir, temperature change ka kya?" → "arre, woh ΔU mein hi count ho chuka hai."
14. **Graphite → diamond at 500 kbar, ΔH − ΔU** — Key: solids ⇒ no ΔngRT; P constant ⇒ PΔV with V = mass/density. Close: "units ka bada circus rahega" — kbar→Pa, cm³→m³; on-air honesty: "−100 ya +100... main not very sure, check kar lena. Haan, −100 hi hai."
15. **Molar heat capacity of water ⇌ ice** — Key: equilibrium ⇒ temperature pinned ⇒ isothermal ⇒ C = ∞; every joule melts ice instead of raising T. 30-second question.
16. **Adiabatic work depends on (P, V, or T?)** — Key: two valid formulas exist, but options force one — "dono toh option ho nahi sakte" ⇒ ΔT. Close: "simple tha yeh question."
17. **Insulated vessel, expand vs Pext = 0 (JEE Adv)** — Open: "yeh pyara question hai — theoretical hai." Key: q = 0, W = 0 ⇒ ΔU = 0 ⇒ T₁ = T₂ and P₁V₁ = P₂V₂ both true; PV^γ false (irreversible). Close: "kitna pyara question — solve kuch nahi karna, aur Advanced ka hai."
18. **2 mol compressed adiabatically vs 2 atm** — Open: "sabse pehle kya karna hai? Visualize karo." Key: piston stops when inside pressure = 2 atm ⇒ P₂ known; nCVΔT = −PextΔV, solve T₂ = 450 K ⇒ W = 500R. Close: "simple, saral — ek baar khud se solve karke dekhiye."
19. **He/H₂/CO₂/SO₃ same adiabatic expansion, max work** — Key: atomicity ↑ ⇒ γ ↓ ⇒ flatter curve ⇒ more area under it ⇒ SO₃. The chain spoken out loud, graph by graph.
20. **0.5 g carbon heats 2000 g water by 2°** — Key: q = msΔT = 4 kcal, then unitary method to 12 g (1 mol) ⇒ −96 kcal; negative because exothermic. Close: "bahut simple question tha."
21. **Heats of neutralization → acid strength order** — Open: "20 second mein solve kar lena hai." Key: distance from 13.7 = energy spent dissociating = weakness rank.
22. **Water 10 °C → ice −10 °C** — Key: three-leg journey (cool liquid → freeze at 0° → cool solid), each leg its own formula; dramatized sign-check on every release.
23. **Bomb calorimeter, 0.45 K rise** — Key: heat-capacity-of-calorimeter unitary method (2.5 kJ per K ⇒ 1.125 kJ), then per-mole combustion back-calculates 35 g. Close: "aasaan hai — samajh hi gaye honge."
24. **Ethanol combustion: bomb ΔU → ΔH** — Key: bomb = constant V = ΔU; convert with ΔngRT (2 − 3.5 = −1.5).
25. **Benzene resonance energy** — Key: theoretical bond-breaking ledger (3 C=C + 3 C–C + 6 C–H) vs actual heat of dissociation; the gap IS resonance energy — and *why* the theoretical route is legitimately wrong (bond order 1.5).
26. **PV diagram weird path, A→B same pressure** — Open: "bachche thoda sa pareshan ho jaate hain — sir yeh kaisa path hai?" Key: entropy is a state function — path irrelevant; isobaric formula; ln e = 1 ⇒ ΔS = CP. Close: "bada simple, bada pyara question — faaltu mein confuse kiya."
27. **Iron rusting: ΔS negative yet spontaneous?** — Key: exothermic ⇒ surroundings gain q/T; ΔS_univ = sys + surr > 0. Plus the side-check: "rust ko tum wapas iron mein convert kar sakte ho? Nahi — toh reversible nahi hai."
28. **ΔS_surr, isothermal expansion vs 3 atm** — Key: constant Pext ⇒ irreversible ⇒ the OTHER surroundings formula (−PextΔV/T). Close: "kab kaun sa formula lagana hai — yeh samajh gaye toh kaafi dikkat solve."
29. **H₂O(l) → H₂O(g) at 100 °C, 1 atm** — Key: decode the givens — "yeh parameters actually kya represent kar rahe hain? Normal boiling point — equilibrium phenomena" ⇒ ΔS_sys +, ΔS_surr −, equal magnitude.
30. **Two metal blocks T₁, T₂ in contact** — Open: flags the crossover ("thoda hatke hai — thoda physics ka knowledge lagta hai"). Key: same metal ⇒ T_f = (T₁+T₂)/2; add two CP ln terms. PYQ.
31. **ΔS_surr when 1 mol H₂O(l) forms** — Open: voiced doubt "data thoda kam lag raha hai?" Key: "formed" ⇒ write the formation equation yourself; ΔHf heat lands in the surroundings ⇒ +286×10³/298. Close: kJ→J trap is where "mostly galtiyan yahin hoti hain."
32. **Max entropy jump on heating** — Key: recall the S–T staircase — melting jump chhota, boiling jump bada (vapour freedom explodes) ⇒ boiling point.
33. **MgO + C feasibility temperature** — Key: ΔG = 0 ⇒ T = ΔH/ΔS; ΔS is the favourable parent here, so raise T above the boundary.
34. **X ⇌ Y, ΔG° = 120 − 3T/8** — Key: set ΔG° = 0 ⇒ T = 320; above it forward runs (y grows), below it backward. Map options against the boundary.

## E. Register notes

- **Crash-course register:** brisker than DPP sessions — "ab thoda speed pakadte hain", "isके ऊपर time waste nahi karenge", "jaldi-jaldi se summarize karte hain". Derivations get honesty-rationing: "iska proper proof hai, par abhi samay nahi — bas yeh yaad rakhein" (T_final irrev > rev), "poori derivation yaad karke fayda nahi, par पीछे ka reason pata hona chahiye."
- **Pause ritual before every question:** "Pause kar lijiye... 1 minute lagao... pehle khud se try karo" — with explicit time budgets (15 s / 30–40 s / 1 min / 1–1.5 min) that double as difficulty tags.
- **On-air honesty is constant currency:** "I am not very sure — ek baar calculate karke check kar lena"; "answer shayad B aayega — par woh important nahi hai, KAISE nikala woh important hai." Reuse this in solutions as the verification-over-answer stance.
- **The chapter's core doctrine (repeat in ⚡):** "Thermodynamics mein galti hoti hai toh yahi — figure out nahi kar paate kaun sa formula lagana hai. Once they know, it's plain math — chemistry bachi nahi usmein." And: "Always focus on approach. Approach ban gayi toh speed apne aap aa jaati hai."
- **Examiner-psychology framing is denser here than any chapter:** maximum-work disguise, constant-Pext signal, heat-at-constant-P vocabulary, planted extra data. ⚠️ sections should *name the examiner's move*, not just the error.
- **Hindi idiom flourishes unique to THERMO** (use at most one per solution, translated or as-is): "dharm sankat" (the state-vs-path paradox), "moksh" (equilibrium), "khichdi" (mixing), "udham machana" (randomness), "lendaen" (heat/work as energy transactions), "ghata–munafa" (system–surroundings ledger), "palda bhari / chalti kiski hai" (dominating factor).
- **NCERT doctrine appears as proof-anchoring:** "yeh NCERT ki statement hai — main apni marzi se nahi bol raha. NCERT ne badi shaandar cheezein likhi hain beech mein" (ΔU doesn't discriminate; heat's randomizing influence; the ΔG < 0 proof "NCERT mein hi dikhaunga kahan prove kiya hai").
- **Reassurance calibration:** thermochemistry sold as "bada aasaan aur scoring topic — equation rearrange karne se answer aa jaata hai, zyada dimaag nahi lagana"; entropy sold as the one place "jahan bachche pareshan hote hain" — and then systematically de-feared. Mirror this: easy families get a confidence line, ΔS_surr families get a "this is the one everyone fumbles" line.
- Verdict vocabulary observed: "pyara question", "bahut pyara sa confusion", "decent question", "simple, saral", "aasaan tha but different tha", "thoda hatke hai". Session sign-offs ("padhte rahiye... all the best, bye") stay out of solutions.
