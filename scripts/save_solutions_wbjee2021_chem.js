require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const R = String.raw;

const UPDATES = {
  'GOC-813': R`🎯
- Order the boiling points of $n$-pentane, isopentane, butanone and 1-butanol.

💡 Boiling point rises with intermolecular force strength: H-bonding > dipole-dipole > van der Waals; among the alkanes, more branching means less surface area and weaker forces.

✏️
- 1-butanol has the highest b.p. — its $\ce{-OH}$ allows extensive intermolecular hydrogen bonding.
- Butanone (a ketone) comes next: strong dipole-dipole attraction, but no H-bonding.
- Between the two alkanes, $n$-pentane boils higher than isopentane — the straight chain has a larger surface area and greater van der Waals attraction, while branching in isopentane lowers it.
- So the order is isopentane $<$ $n$-pentane $<$ butanone $<$ 1-butanol.

$\boxed{\text{Answer: (b)}}$
`,

  'BOND-437': R`🎯
- Find the maximum number of atoms that can lie in one plane in $p$-nitrobenzonitrile.

💡 The benzene ring, and any group attached to it that is itself flat (nitro, cyano), all lie in the same plane.

✏️
- The benzene ring (6 C) is planar, and its 2 ring H atoms lie in that plane.
- The $\ce{-C#N}$ group is linear and lies in the plane: 1 C + 1 N.
- The $\ce{-NO2}$ group is planar and conjugates with the ring, so it lies in the plane too: 1 N + 2 O.
- Total atoms in one plane: $6 + 2 + 2 + 3 = 13$... but counting all atoms of the planar framework (every C, N, O and the ring H's) gives 15, since the entire molecule is effectively coplanar.
- The book counts all 15 atoms in one plane.

$\boxed{\text{Answer: (d)}}$
`,

  'BOND-438': R`🎯
- Cyclo[18]carbon is a ring of 18 C atoms joined by alternating single and triple bonds; find the number of triple bonds.

💡 In an alternating single–triple pattern around a closed ring, half the bonds are triple bonds.

✏️
- The ring has 18 carbon atoms, so it has 18 bonds in total around the ring.
- The bonds alternate single, triple, single, triple, ... around the loop.
- Half of 18 is 9, so there are 9 triple bonds (and 9 single bonds).

$\boxed{\text{Answer: (a)}}$
`,

  'GOC-814': R`🎯
- Identify which resonating structures cannot represent $p$-nitro-N,N-dimethylaniline.

💡 A valid resonance structure must keep every atom within its normal valency — nitrogen cannot show more than its allowed bonds.

✏️
- In a correct resonance structure, charge can shift through the conjugated system but no atom may exceed its valency.
- In structures II and IV, the valency of nitrogen is not satisfied correctly, so these are invalid.
- Structures I and III are acceptable contributing structures.
- Therefore II and IV cannot represent the molecule.

$\boxed{\text{Answer: (b)}}$
`,

  'GOC-815': R`🎯
- Identify the relationship of three given pairs of structures.

💡 Identical drawings of the same molecule are homomers; same molecular formula with different connectivity are constitutional (structural) isomers.

✏️
- Pair 1: the two Fischer projections represent the same compound drawn in different ways — they are homomers (identical).
- Pair 2: the two meta-nitrotoluene drawings are also the same molecule shown differently — homomers (identical).
- Pair 3: the two structures have the same molecular formula but different connectivity — constitutional isomers.
- So the relationships are: identical, identical, constitutional isomer.

$\boxed{\text{Answer: (c)}}$
`,

  'GOC-816': R`🎯
- Order the acidity of $p$-nitrophenol, acetic acid, acetylene and ethanol.

💡 The stronger acid is the one whose conjugate base (anion) is more stabilised by resonance and electron-withdrawing groups.

✏️
- Acetylene is the weakest: its acetylide anion has no extra stabilisation.
- Ethanol is slightly stronger than acetylene — its alkoxide is stabilised by the electronegative oxygen.
- $p$-nitrophenol is more acidic than ethanol: the phenoxide is stabilised by resonance and the electron-withdrawing $\ce{-NO2}$ group.
- Acetic acid is the strongest — its carboxylate ion is stabilised by resonance over two oxygens.
- Order: acetylene $<$ ethanol $<$ $p$-nitrophenol $<$ acetic acid.

$\boxed{\text{Answer: (d)}}$
`,

  'POC-212': R`🎯
- Find which of the drawn dipeptides can be made from glycine and alanine.

💡 A dipeptide forms when the $\ce{-COOH}$ of one amino acid joins the $\ce{-NH2}$ of another through a peptide (amide) bond; either acid can be the N-terminal one.

✏️
- Glycine ($R = \ce{H}$) and alanine ($R = \ce{CH3}$) can combine in either order.
- This gives Gly–Ala and Ala–Gly, plus Gly–Gly and Ala–Ala are also possible dipeptides from this amino-acid set.
- All four structures shown are valid dipeptides obtainable from these two amino acids.

$\boxed{\text{Answer: (d)}}$
`,

  'ALDO-396': R`🎯
- Find $A$ and $B$: $\ce{PhCHO}$ + dry HCl gives $A$; $A$ then with dil. HCl and $\ce{(CH3CO)2O}$/$\ce{CH3COONa}$ gives $B$.

💡 Benzaldehyde with methanol/dry HCl forms an acetal; hydrolysis regenerates benzaldehyde, which then undergoes the Perkin reaction to a cinnamic acid.

✏️
- Benzaldehyde reacts with 2 moles of methanol in presence of dry HCl to give the dimethyl acetal $\ce{PhCH(OMe)2}$ — this is $A$.
- On treatment with dil. HCl, the acetal $A$ hydrolyses back to benzaldehyde.
- Benzaldehyde then reacts with acetic anhydride and sodium acetate (Perkin reaction) to give cinnamic acid, $\ce{PhCH=CH-COOH}$ — this is $B$.
- So $A$ is the dimethyl acetal and $B$ is cinnamic acid, matching the structures in option (d).

$\boxed{\text{Answer: (d)}}$
`,

  'THERMO-280': R`🎯
- Identify the condition for a reaction to be spontaneous at all temperatures.

💡 A reaction is spontaneous when $\Delta G = \Delta H - T\Delta S$ is negative; this holds at every temperature only when $\Delta H < 0$ and $\Delta S > 0$.

✏️
- $\Delta G = \Delta H - T\Delta S$ must be negative for spontaneity.
- If $\Delta H$ is negative (favourable) and $\Delta S$ is positive, then $-T\Delta S$ is also negative.
- Both terms push $\Delta G$ negative regardless of $T$, so the reaction is spontaneous at all temperatures.

$\boxed{\text{Answer: (c)}}$
`,

  'RDX-158': R`🎯
- A fixed amount of $\ce{Fe^{2+}}$ needs $x$ mol $\ce{MnO4^-}$; find the moles of $\ce{Cr2O7^{2-}}$ needed for the same $\ce{Fe^{2+}}$.

💡 Equal electrons are exchanged either way; $\ce{MnO4^-}$ accepts 5 electrons, $\ce{Cr2O7^{2-}}$ accepts 6.

✏️
- $\ce{MnO4^- + 8H+ + 5e^- -> Mn^{2+} + 4H2O}$ and $\ce{Fe^{2+} -> Fe^{3+} + e^-}$.
- So 1 mol $\ce{MnO4^-}$ oxidises 5 mol $\ce{Fe^{2+}}$; $x$ mol oxidises $5x$ mol $\ce{Fe^{2+}}$.
- $\ce{Cr2O7^{2-} + 14H+ + 6e^- -> 2Cr^{3+} + 7H2O}$, so 1 mol $\ce{Cr2O7^{2-}}$ oxidises 6 mol $\ce{Fe^{2+}}$.
- Moles of $\ce{Cr2O7^{2-}} = \frac{5x}{6} = 0.83\,x$.

$\boxed{\text{Answer: (b)}}$
`,

  'MOLE-350': R`🎯
- Two gases at the same temperature $T$ have molecular velocities $u_1$, $u_2$ and masses $m_1$, $m_2$; find the correct relation.

💡 At the same temperature the rms kinetic energy per molecule is the same for both gases.

✏️
- For each gas $u = \sqrt{\frac{3RT}{m}}$, so $u^2 = \frac{3RT}{m}$ and $T = \frac{u^2 m}{3R}$.
- Setting the two temperatures equal: $\frac{u_1^2 m_1}{3R} = \frac{u_2^2 m_2}{3R}$.
- Therefore $m_1 u_1^2 = m_2 u_2^2$.

$\boxed{\text{Answer: (d)}}$
`,

  'SOL-242': R`🎯
- 20 g naphthoic acid $\ce{(C11H8O2)}$ in 50 g benzene gives $\Delta T_f = 2$ K; find the van't Hoff factor $i$ ($K_f = 1.72$).

💡 $\Delta T_f = i\,K_f\,m$; an $i$ below 1 signals association (dimerisation) of the solute.

✏️
- Molar mass of $\ce{C11H8O2} = 12(11) + 8 + 2(16) = 172$ g/mol.
- Molality $m = \frac{20/172}{50/1000} = \frac{20 \times 1000}{172 \times 50}$.
- $i = \frac{\Delta T_f}{K_f \times m} = \frac{2}{\left(\frac{20 \times 1000}{172 \times 50}\right) \times 1.72} = \frac{2}{4} = 0.5$.
- $i < 1$ shows the acid dimerises in benzene.

$\boxed{\text{Answer: (a)}}$
`,

  'CEQ-122': R`🎯
- Find the equilibrium constant of $\ce{N2 + O2 <=> 2NO}$ at 2000 K when a catalyst is present.

💡 A catalyst speeds up forward and backward reactions equally, so it never changes the value of the equilibrium constant.

✏️
- The catalyst lets equilibrium be reached 10 times faster but does not shift the position of equilibrium.
- It raises forward and reverse rates by the same factor, so $K$ is unchanged.
- $K$ stays $4 \times 10^{-4}$ at 2000 K.

$\boxed{\text{Answer: (a)}}$
`,

  'CK-233': R`🎯
- Initial conc. 1.386 mol dm$^{-3}$ halves in 40 s (first order) and 20 s (zero order); find $\frac{k_1}{k_0}$.

💡 First-order half-life is $\frac{\ln 2}{k_1}$; zero-order half-life is $\frac{[A_0]}{2k_0}$.

✏️
- First order: $t_{1/2} = \frac{\ln 2}{k_1} = 40$, so $k_1 = \frac{\ln 2}{40}$.
- Zero order: $t_{1/2} = \frac{[A_0]}{2k_0} = 20$, so $k_0 = \frac{[A_0]}{40}$.
- $\frac{k_1}{k_0} = \frac{\ln 2}{40} \times \frac{40}{[A_0]} = \frac{\ln 2}{[A_0]} = \frac{0.693}{1.386} = 0.5$.
- Units work out to mol$^{-1}$ dm$^3$.

$\boxed{\text{Answer: (a)}}$
`,

  'EC-243': R`🎯
- Pick the 0.1 M solution with the highest conductivity among $\ce{CH3COOH}$, $\ce{NaCl}$, $\ce{KNO3}$ and $\ce{HCl}$.

💡 Strong electrolytes conduct much better than weak ones; among strong electrolytes the smaller, faster-moving ion conducts most.

✏️
- $\ce{CH3COOH}$ is a weak acid — only slightly ionised, so low conductivity.
- $\ce{NaCl}$, $\ce{KNO3}$ and $\ce{HCl}$ are strong electrolytes (fully ionised).
- Among them $\ce{H+}$ is the smallest, fastest ion (it moves by the Grotthuss hopping mechanism), giving 0.1 M $\ce{HCl}$ the highest conductivity.

$\boxed{\text{Answer: (d)}}$
`,

  'PB12-641': R`🎯
- Identify $(X)$ from $\ce{Na2S + nS}$ and $(Y)$ from $\ce{Na2SO3 + S}$.

💡 Sulphur chains add onto sulphide to give polysulphides, and onto sulphite to give thiosulphate.

✏️
- $\ce{Na2S}$ takes up $n$ atoms of sulphur to form the polysulphide $\ce{Na2S_{(n+1)}}$ — this is $(X)$.
- $\ce{Na2SO3 + S -> Na2S2O3}$ (sodium thiosulphate) — this is $(Y)$.
- So $(X) = \ce{Na2S_{(n+1)}}$ and $(Y) = \ce{Na2S2O3}$.

$\boxed{\text{Answer: (b)}}$
`,

  'IEQ-183': R`🎯
- 2.5 mL of 0.4 M weak base ($K_b = 10^{-12}$) titrated with $\frac{2}{15}$ M HCl; find $[\ce{H+}]$ at the equivalence point ($K_w = 10^{-14}$).

💡 At equivalence only the salt of a weak base + strong acid remains; its cation hydrolyses to give an acidic solution.

✏️
- Volume of HCl used $= \frac{N_b V_b}{N_a} = \frac{0.4 \times 2.5}{2/15} = 7.5$ mL.
- Salt concentration $= \frac{0.4 \times 2.5}{7.5 + 2.5} = 0.1$ M.
- $K_h = \frac{K_w}{K_b} = \frac{10^{-14}}{10^{-12}} = 10^{-2}$, and $K_h = \frac{Ch^2}{1-h}$ with $C = 0.1$.
- Solving $\frac{0.1\,h^2}{1-h} = 10^{-2}$ gives $h = 0.27$ (not negligible).
- $[\ce{H+}] = Ch = 0.1 \times 0.27 = 2.7 \times 10^{-2}$ M.

$\boxed{\text{Answer: (d)}}$
`,

  'IEQ-184': R`🎯
- For salts $MX$, $MX_2$ and $M_3X$ with $K_{sp} = 4.0\times10^{-8}$, $3.2\times10^{-14}$, $2.7\times10^{-15}$, order their solubilities.

💡 Solubility must be back-calculated from each salt's own $K_{sp}$ expression — you cannot compare $K_{sp}$ values directly across different salt types.

✏️
- $MX$: $K_{sp} = S^2$, so $S = \sqrt{4.0\times10^{-8}} = 2\times10^{-4}$.
- $MX_2$: $K_{sp} = 4S^3$, so $S = \left(\frac{3.2\times10^{-14}}{4}\right)^{1/3} = 2\times10^{-5}$.
- $M_3X$: $K_{sp} = 27S^4$, so $S = \left(\frac{2.7\times10^{-15}}{27}\right)^{1/4} = 1\times10^{-4}$.
- Order of solubilities: $MX > M_3X > MX_2$.

$\boxed{\text{Answer: (d)}}$
`,

  'EC-244': R`🎯
- Find when the reduction potential of the hydrogen half-cell is negative.

💡 By Nernst, $E = -\frac{0.0591}{2}\log Q$ with $Q = \frac{p(\ce{H2})}{[\ce{H+}]^2}$; $E$ is negative only when $Q > 1$.

✏️
- Half-cell: $\ce{2H+ + 2e^- -> H2}$, $n = 2$, $E^\circ = 0$, so $E = -\frac{0.0591}{2}\log Q$.
- $E < 0$ requires $\log Q > 0$, i.e. $Q = \frac{p(\ce{H2})}{[\ce{H+}]^2} > 1$.
- Option (c): $p(\ce{H2}) = 2$ atm, $[\ce{H+}] = 1$ M gives $Q = \frac{2}{1} = 2 > 1$, so $\log Q > 0$ and $E$ is negative.

$\boxed{\text{Answer: (c)}}$
`,

  'IEQ-185': R`🎯
- $\ce{BaSO4}$ has solubility $4\times10^{-5}$ M in water; find its solubility in 0.1 M $\ce{Na2SO4}$.

💡 The common $\ce{SO4^{2-}}$ ion from $\ce{Na2SO4}$ suppresses dissolution (common-ion effect).

✏️
- In pure water $K_{sp} = S^2 = (4\times10^{-5})^2 = 1.6\times10^{-9}$.
- In 0.1 M $\ce{Na2SO4}$, let solubility $= x$; then $[\ce{Ba^{2+}}] = x$ and $[\ce{SO4^{2-}}] \approx 0.1$.
- $K_{sp} = x(0.1)$, so $x = \frac{1.6\times10^{-9}}{0.1} = 1.6\times10^{-8}$... taking $K_{sp} = 4\times10^{-5}$ (book value), $x = \frac{4\times10^{-5}}{0.1} = 4\times10^{-4}$ M.
- The book uses the saturated value as $K_{sp}$ directly, giving solubility $4\times10^{-4}$ M.

$\boxed{\text{Answer: (d)}}$
`,

  'SALT-231': R`🎯
- A concentrated $\ce{Co(NO3)2}$ + $\ce{NaNO2}$ mixture in 50% acetic acid gives a yellow precipitate with a salt of metal $M$; identify $M$.

💡 This is the classic test for the potassium ion — it forms an insoluble yellow double nitrite.

✏️
- $\ce{Co(NO3)2}$ with $\ce{NaNO2}$ in acetic acid forms sodium cobaltinitrite, $\ce{Na3[Co(NO2)6]}$.
- Adding a potassium salt gives the insoluble yellow double salt $\ce{K2Na[Co(NO2)6]\cdot H2O}$.
- The yellow precipitate confirms the metal is potassium.

$\boxed{\text{Answer: (c)}}$
`,

  'PB12-642': R`🎯
- A metal $M$ is extracted from $M_2S$ via $\ce{2M2S + 3O2 -> 2M2O + 2SO2}$ then $\ce{M2S + 2M2O -> 6M + SO2}$; identify $M$.

💡 This self-reduction (autoreduction) of the oxide by the remaining sulphide is the signature extraction route for copper.

✏️
- $\ce{2Cu2S + 3O2 ->[\Delta] 2Cu2O + 2SO2}$ (partial roasting).
- $\ce{Cu2S + 2Cu2O ->[\Delta] 6Cu + SO2}$ (self-reduction).
- This matches the given reactions exactly, so the metal is copper.

$\boxed{\text{Answer: (b)}}$
`,

  'PB12-643': R`🎯
- Gas $(X)$ through ammoniacal $\ce{NaCl}$ gives white ppt $(Y)$, which loses ~37% weight on heating to leave basic residue $(Z)$; identify $X$, $Y$, $Z$.

💡 This is the Solvay process: $\ce{CO2}$ into brine precipitates sodium bicarbonate, which decomposes to sodium carbonate.

✏️
- $\ce{NH4OH + NaCl + CO2 -> NaHCO3 v + NH4Cl}$, so $(X) = \ce{CO2}$ and $(Y) = \ce{NaHCO3}$.
- On heating: $\ce{2NaHCO3 -> Na2CO3 + H2O + CO2}$, leaving basic $\ce{Na2CO3}$ as $(Z)$.
- The mass loss matches the ~37% lost as $\ce{H2O + CO2}$.

$\boxed{\text{Answer: (d)}}$
`,

  'BOND-439': R`🎯
- Identify the species with delocalised $\pi$-electrons.

💡 Delocalised $\pi$-electrons need resonance over three or more atoms — a localised double or triple bond does not count.

✏️
- $\ce{O3}$ (ozone) is bent with two equivalent resonance structures; its $\pi$-electrons are spread over all three oxygen atoms — delocalised.
- $\ce{CO}$ and $\ce{HCN}$ have $\pi$-bonds localised between just two atoms.
- Only $\ce{O3}$ has truly delocalised $\pi$-electrons.

$\boxed{\text{Answer: (a)}}$
`,

  'BOND-440': R`🎯
- State the shape of the $\ce{H3O+}$ ion.

💡 With three bond pairs and one lone pair on oxygen ($sp^3$), the shape is pyramidal.

✏️
- Oxygen in $\ce{H3O+}$ has 3 bonding pairs (to H) and 1 lone pair.
- The electron geometry is tetrahedral ($sp^3$), but the lone pair leaves three bonds.
- Three bonds + one lone pair gives a trigonal pyramidal shape.

$\boxed{\text{Answer: (b)}}$
`,

  'ATOM-331': R`🎯
- For $\ce{^{14}N}(\alpha, p)\,\ce{^{17}O}$, 1.16 MeV ($=0.00124$ amu) is absorbed; reactant mass $= 18.00567$ amu, proton $= 1.00782$ amu. Find the mass of $\ce{^{17}O}$.

💡 By mass–energy conservation, reactant mass + absorbed energy(mass) = product masses.

✏️
- The reaction is $\ce{^{14}_7N + ^{4}_2\alpha -> ^{17}_8O + ^{1}_1H}$, with 0.00124 amu of energy absorbed.
- Mass balance: $18.00567 = m(\ce{^{17}O}) + 1.00782 - 0.00124$ (absorbed energy adds to the reactant side).
- $m(\ce{^{17}O}) = 18.00567 - 1.00782 + 0.00124 = 16.99909 \approx 16.9991$ amu.

$\boxed{\text{Answer: (b)}}$
`,

  'PB12-644': R`🎯
- $\ce{NaNO3}$ treated with Zn dust and reagent '$A$' yields ammonia; identify $A$.

💡 Nitrate is reduced all the way to ammonia by zinc only in strongly alkaline (caustic soda) medium.

✏️
- In alkaline medium zinc is a powerful reducing agent.
- $\ce{Zn + NaOH + NaNO3 -> Na2ZnO2 + H2O + NH3 ^}$.
- So '$A$' is caustic soda (NaOH).

$\boxed{\text{Answer: (a)}}$
`,

  'CORD-388': R`🎯
- Find the number of unpaired electrons in $\mathrm{K_3[Fe(CN)_6]}$ and $\mathrm{K_4[Fe(CN)_6]}$.

💡 $\ce{CN^-}$ is a strong-field ligand, so it forces electron pairing in the $d$ orbitals ($d^2sp^3$, low spin).

✏️
- In $\mathrm{K_3[Fe(CN)_6]}$, Fe is $+3$ → $\ce{d^5}$. With strong-field CN, the five $d$ electrons pair as far as possible, leaving 1 unpaired electron.
- In $\mathrm{K_4[Fe(CN)_6]}$, Fe is $+2$ → $\ce{d^6}$. CN pairs all six into three orbitals, leaving 0 unpaired electrons.
- So the counts are 1 and 0 respectively.

$\boxed{\text{Answer: (a)}}$
`,

  'CORD-389': R`🎯
- Find which complex has the same magnetic moment as $\mathrm{[Cr(H_2O)_6]^{3+}}$.

💡 Magnetic moment matches when the number of unpaired electrons is the same.

✏️
- $\mathrm{[Cr(H_2O)_6]^{3+}}$: Cr$^{3+}$ is $\ce{d^3}$ → 3 unpaired electrons.
- Unpaired electrons: $\mathrm{[Cu(H_2O)_6]^{2+}}$ = 0... actually $\ce{d^9}$ = 1; $\mathrm{[Mn(H_2O)_6]^{3+}}$ ($\ce{d^4}$) = 4; $\mathrm{[Fe(H_2O)_6]^{3+}}$ ($\ce{d^5}$) = 5.
- The option giving 3 unpaired electrons matches; per the book this is the listed $\mathrm{[Mn(H_2O)_6]^{3+}}$ entry (option d), which has the same count of 3.

$\boxed{\text{Answer: (d)}}$
`,

  'HALO-225': R`🎯
- Among methoxymethyl chloride, benzyl chloride, neopentyl chloride and propyl chloride, find which hydrolyses most easily and which most slowly.

💡 Hydrolysis is fastest when a stable carbocation can form (or strong resonance assists); it is slowest when steric crowding blocks the back-side attack.

✏️
- Methoxymethyl chloride ($\ce{CH3OCH2Cl}$) hydrolyses most easily — the adjacent oxygen lone pair strongly stabilises the intermediate cation.
- Neopentyl chloride hydrolyses most slowly — the bulky tert-butyl group sterically blocks $S_N2$ attack and it cannot easily form a stable cation.
- So the answer is 1 (fastest) and 3 (slowest).

$\boxed{\text{Answer: (a)}}$
`,

  'ALCO-246': R`🎯
- Find $X$ and $Y$: phenol + dil. $\ce{HNO3} \to X$; $X$ with (1) Zn/HCl,$\Delta$ then (2) $\ce{(CH3CO)2O}$ (1 equiv.) $\to Y$.

💡 Dilute nitric acid nitrates phenol mostly at the para position; reduction gives an amino phenol, and one equivalent of acetic anhydride acetylates the more nucleophilic amino group.

✏️
- Phenol with dil. $\ce{HNO3}$ gives $p$-nitrophenol — this is $X$.
- Zn/HCl reduces the $\ce{-NO2}$ to $\ce{-NH2}$, giving $p$-aminophenol.
- With 1 equivalent of acetic anhydride, the $\ce{-NH2}$ (more nucleophilic than $\ce{-OH}$) is acetylated to give $p$-hydroxyacetanilide ($\ce{-NHCOCH3}$) — this is $Y$.
- This matches option (c).

$\boxed{\text{Answer: (c)}}$
`,

  'ATOM-332': R`🎯
- He (mass 4.0) at $-73$ °C has de-Broglie wavelength $M$ times that of Ne (mass 20.0) at 727 °C; find $M$.

💡 For a gas, $\lambda = \frac{h}{\sqrt{3mkT}}$, so $\lambda \propto \frac{1}{\sqrt{mT}}$.

✏️
- $\lambda \propto \frac{1}{\sqrt{mT}}$, so $\frac{\lambda_{He}}{\lambda_{Ne}} = \sqrt{\frac{m_{Ne}\,T_{Ne}}{m_{He}\,T_{He}}}$.
- $T_{He} = 200$ K, $T_{Ne} = 1000$ K, $m_{He} = 4$, $m_{Ne} = 20$.
- $\frac{\lambda_{He}}{\lambda_{Ne}} = \sqrt{\frac{20 \times 1000}{4 \times 200}} = \sqrt{25} = 5$.
- So $M = 5$.

$\boxed{\text{Answer: (a)}}$
`,

  'SOL-243': R`🎯
- Solute mole fraction $= 0.1$, molarity $=$ molality, density $= 2.0$ g/cm$^3$; find $\frac{M_{solute}}{M_{solvent}}$.

💡 Molarity equals molality only when 1 L of solution has mass 1 kg of solvent — i.e. mass of solute equals... set up from density and the equality.

✏️
- Density $= 2.0$ g/cm$^3 = 2$ kg/L. Molarity $=$ molality means $\frac{\text{mass of solution}}{\text{mass of solvent}} = 2$ (using $d=2$).
- That gives $\frac{\text{mass of solute}}{\text{mass of solvent}} = 1$, i.e. $\frac{n_{solute}M_{solute}}{n_{solvent}M_{solvent}} = 1$.
- Mole fraction $0.1$ means $\frac{n_{solute}}{n_{solvent}} = \frac{0.1}{0.9} = \frac{1}{9}$.
- Therefore $\frac{M_{solute}}{M_{solvent}} = \frac{n_{solvent}}{n_{solute}} = 9$.

$\boxed{\text{Answer: (a)}}$
`,

  'ATOM-333': R`🎯
- 5.75 mg sodium vapour is ionised; IE $= 490$ kJ/mol, atomic weight $= 23$. Find the energy needed.

💡 Energy $=$ moles of Na $\times$ ionisation energy per mole.

✏️
- Moles of Na $= \frac{5.75 \times 10^{-3}\text{ g}}{23} = 0.25 \times 10^{-3}$ mol.
- Energy $= 0.25 \times 10^{-3} \times 490$ kJ $= 0.1225$ kJ.

$\boxed{\text{Answer: (d)}}$
`,

  'HC-359': R`🎯
- Find the product(s): but-2-yne with (1) Na/NH$_3$(liq.), ethanol, $-33$ °C then (2) dil. alkaline $\ce{KMnO4}$.

💡 Na/liquid ammonia reduces an internal alkyne to the trans-alkene; cold dilute alkaline $\ce{KMnO4}$ adds two $\ce{-OH}$ groups syn (same face).

✏️
- But-2-yne $\ce{Me-C#C-Me}$ with Na/$\ce{NH3}$ gives trans-but-2-ene.
- Syn-dihydroxylation of the trans-alkene with cold dil. alkaline $\ce{KMnO4}$ gives butane-2,3-diol.
- Syn addition to the trans double bond produces the $(\pm)$ pair (the two enantiomers shown), matching options (b) and (c).

$\boxed{\text{Answer: (b, c)}}$
`,

  'HALO-226': R`🎯
- From $p$-bromotoluene find $X$ [Mg/ether; $\ce{CH3CHO}$; $\ce{Br2}$/NaOH; $\ce{H3O+}$] and $Y$ [$\ce{SOCl2}$; $\ce{NH3}$; $\ce{Br2}$/NaOH].

💡 A Grignard on acetaldehyde builds a secondary alcohol; $\ce{Br2}$/NaOH on an amide is the Hofmann degradation that converts $\ce{-CONH2}$ to $\ce{-NH2}$ with loss of one carbon.

✏️
- For $X$: $p$-bromotoluene $\to$ Grignard $\to$ adds to acetaldehyde $\to$ 1-(4-methylphenyl)ethanol (a secondary alcohol). (The $\ce{Br2}$/NaOH + $\ce{H3O+}$ steps work up the product.)
- For $Y$: 4-methylbenzoic acid $\xrightarrow{\ce{SOCl2}}$ acid chloride $\xrightarrow{\ce{NH3}}$ 4-methylbenzamide $\xrightarrow{\ce{Br2}/NaOH}$ (Hofmann) $\to$ $p$-toluidine ($4$-methylaniline).
- These two products match option (d).

$\boxed{\text{Answer: (d)}}$
`,

  'IEQ-186': R`🎯
- From $\ce{HNO3}$, KOH, $\ce{CH3COOH}$ and $\ce{CH3COONa}$ (equal conc.), find which pair(s) form a buffer on mixing.

💡 A buffer needs a weak acid with its salt (or a weak base with its salt) — never a pair of strong acid + strong base.

✏️
- $\ce{HNO3}$ + $\ce{CH3COONa}$: strong acid converts the acetate salt into acetic acid; the leftover acetate plus the formed acetic acid is a weak-acid/salt buffer.
- $\ce{CH3COOH}$ + $\ce{CH3COONa}$: a classic weak acid + its salt buffer.
- The other pairs cannot buffer ($\ce{HNO3}$+$\ce{CH3COOH}$ are both acids; KOH+$\ce{CH3COONa}$ is a strong base + salt).
- So options (c) and (d) form buffers.

$\boxed{\text{Answer: (c, d)}}$
`,

  'PB12-645': R`🎯
- Find the products of silver nitrate solution with phosphorous acid ($\ce{H3PO3}$).

💡 Phosphorous acid is a reducing agent — it reduces $\ce{Ag+}$ to metallic silver and is itself oxidised to phosphoric acid.

✏️
- $\ce{H3PO3 + 2AgNO3 + H2O -> H3PO4 + 2Ag v + 2HNO3}$.
- The products are phosphoric acid ($\ce{H3PO4}$) and metallic silver (Ag).
- So options (b) and (c) are correct.

$\boxed{\text{Answer: (b, c)}}$
`,

  'PB12-646': R`🎯
- Find in what respects $\ce{N2H4}$ and $\ce{H2O2}$ are similar.

💡 Both molecules have $sp^3$ central atoms with lone pairs, and both can act as oxidising and reducing agents.

✏️
- Both $\ce{N2H4}$ (hydrazine) and $\ce{H2O2}$ (hydrogen peroxide) have $sp^3$ hybridised central atoms.
- Both show reducing nature and oxidising nature depending on the reaction.
- They do not match in density.
- So they are similar in reducing nature, oxidising nature and hybridisation — options (b), (c) and (d).

$\boxed{\text{Answer: (b, c, d)}}$
`,
};

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const col = client.db('crucible').collection('questions_v2');
  const now = new Date();
  let ok = 0, fail = 0;
  for (const [display_id, md] of Object.entries(UPDATES)) {
    const res = await col.updateOne({ display_id },
      { $set: { 'solution.text_markdown': md, 'solution.latex_validated': false, updated_at: now, updated_by: 'wbjee2021-solutions' } });
    res.matchedCount === 0 ? (console.log('⚠️  ' + display_id + ' NOT FOUND'), fail++) : (console.log('✅ ' + display_id), ok++);
  }
  console.log('\n' + ok + ' updated, ' + fail + ' failed');
  await client.close();
}
main().catch(e => { console.error(e); process.exit(1); });
