// Class 11 Chemistry — Live Book Ch.13 "Practical Organic Chemistry" — Practice page.
// NCERT Unit 8 "Organic Chemistry — Some Basic Principles and Techniques", exercises
// 8.18–8.35 ONLY (the purification / qualitative-analysis / quantitative-analysis subset
// that matches what Ch.13 actually teaches — 8.1–8.17 and 8.36–8.40 are GOC topics that
// belong to the not-yet-built Ch.10 "GOC"). Source: _exercises/unit8_ch13_subset.txt.
// No official NCERT answer key exists for this unit — every answer below is derived and
// verified from scratch against the chapter's own content.
// Built per _practice/CONTRACT.md. Standalone module — nothing inserted into any DB.

module.exports = {
  slug: 'ch13-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 18 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: '20ee16f0-197d-4b20-8524-3c19c0b748c9',
      type: 'image',
      order: 0,
      src: '',
      alt: 'Practice — Practical Organic Chemistry: every NCERT exercise, by theme.',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'A hand-drawn coloured illustration on a deep-charcoal (#121316) near-black background, muted earthy palette ' +
        '(ochre, terracotta, teal, sage green, indigo, cream), no glow / neon / orange-haze / 3D-render look. A tidy ' +
        'organic-chemistry lab bench drawn as a "revision board" scene: on the left, a round-bottom flask connected to a ' +
        'condenser in a simple distillation set-up with a thermometer and a receiver flask catching drops; in the middle, ' +
        'a crystallising dish with a few chunky crystal shapes settling out, and beside it a strip of chromatography paper ' +
        'clipped above a small jar, showing two or three separated coloured spots travelling up the paper; on the right, a ' +
        'small test tube over a tiny flame (a flame/fusion test) with a wisp of smoke, next to a labelled sodium-fusion ' +
        'extract test tube. Neat hand-lettered chalk-style labels near each apparatus (no dense text blocks). Warm, ' +
        'textbook-illustration feel, landscape orientation, calm and uncluttered composition.',
    },
    {
      id: '5dd91980-419b-4c42-b284-49fdf26e3e68',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are all **18 NCERT textbook exercises (8.18–8.35)** that match " +
        'what this chapter actually covers — purification techniques, qualitative analysis, and quantitative estimation. ' +
        "They're regrouped from the textbook's running order into **4 revision themes** so you can practise one idea at a " +
        'time. Start with whichever theme you found hardest; tap a question to reveal the full worked solution.',
    },
    {
      id: '53a9407e-8ac2-4d65-9bbb-0940e0fd0bb6',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 8.18–8.35',
      intro:
        'No official NCERT answer key exists for this unit — every solution below is worked out from scratch and checked ' +
        "against the chapter's own content, not copied from anywhere.",
      sections: [
        // ---------- Section 1: Purification techniques & separation methods ----------
        {
          id: 's1-purification-techniques',
          title: 'Purification techniques & separation methods',
          blurb:
            'Crystallisation, distillation (simple, reduced-pressure, steam), chromatography and sublimation — the principle behind each, and which one to reach for.',
          items: [
            {
              kind: 'numerical',
              id: 'efaeb79e-9687-45e7-9121-8e2641d582f6',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.18',
              prompt:
                'Give a brief description of the principles of the following techniques taking an example in each case.\n(a) Crystallisation (b) Distillation (c) Chromatography',
              answer:
                'Crystallisation — solubility differs with temperature; Distillation — boiling points differ; Chromatography — adsorption/partition between the components and a stationary phase differs.',
              solution:
                '**(a) Crystallisation.** The principle is that different substances have different solubilities in a given solvent, and that solubility changes with temperature. You dissolve the impure solid in a solvent it is sparingly soluble in when cold but freely soluble in when hot, filter the hot solution to remove insoluble impurities, and then let it cool slowly. As the solution cools, it becomes supersaturated with respect to the main compound, which separates out as pure crystals, while the soluble impurities stay dissolved in the mother liquor (because they are present in much smaller amounts and never reach their own saturation point). *Example:* purifying impure sugar — it is dissolved in hot water, filtered, and cooled to get white crystals of pure sugar, leaving coloured impurities in solution.\n\n**(b) Distillation.** The principle is that liquids with different boiling points vaporise at different temperatures. The mixture is heated; the more volatile (lower-boiling) liquid vaporises first, and the vapour is led through a condenser where it cools back into liquid and is collected separately from the residue. *Example:* separating a mixture of chloroform (b.p. 334 K) and aniline (b.p. 457 K) — chloroform distils over first, leaving aniline behind.\n\n**(c) Chromatography.** The principle is differential adsorption or partition — different components of a mixture get adsorbed to different extents on an adsorbent (stationary phase) as a solvent (mobile phase) carries them past it, so they separate and travel different distances. *Example:* separating the coloured pigments in plant leaf extract on a column of alumina, or separating a mixture of dyes on chromatography paper — each pigment shows up as a distinct coloured band or spot.',
            },
            {
              kind: 'numerical',
              id: 'd65c2452-bf2f-4953-a65c-61ff57339e21',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.19',
              prompt:
                'Describe the method, which can be used to separate two compounds with different solubilities in a solvent S.',
              answer: 'Fractional crystallisation — dissolve in hot S, then cool slowly and let the less soluble compound crystallise out first.',
              solution:
                'This is **fractional crystallisation**. Dissolve the mixture in a minimum quantity of hot solvent S so both compounds go fully into solution. Filter the hot solution to remove any insoluble matter, then cool it slowly. Because the two compounds have different solubilities in S, the one that is *less soluble* reaches its saturation point first and starts crystallising out of solution while the more soluble compound is still fully dissolved. Filter off this first crop of crystals — that is the less-soluble compound in fairly pure form. Concentrate the remaining mother liquor by evaporating off some solvent and cool it again; the more soluble compound now crystallises out in its own crop. Repeating this cooling–filtering cycle a few times (recrystallising each crop again in fresh solvent) sharpens the separation, because at every step the compound that is *not* supposed to crystallise stays behind in the liquid.',
            },
            {
              kind: 'numerical',
              id: '0f3470f1-d0a7-477a-bb34-794189f93bb2',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.20',
              prompt: 'What is the difference between distillation, distillation under reduced pressure and steam distillation?',
              answer:
                'Simple distillation: normal pressure, for liquids stable at their boiling point. Reduced-pressure distillation: lowers boiling point for heat-sensitive liquids. Steam distillation: uses steam to distil steam-volatile, water-immiscible liquids below their own boiling point.',
              solution:
                '**Simple distillation** is used for a liquid that boils without decomposing and contains only non-volatile impurities, or for separating two miscible liquids whose boiling points are far apart (roughly 25 K or more). It is carried out at ordinary atmospheric pressure — the liquid is heated to its normal boiling point, and the vapour is condensed and collected.\n\n**Distillation under reduced pressure** is used for liquids that decompose at or near their normal boiling point. Since a liquid boils when its vapour pressure equals the surrounding pressure, lowering the external pressure (using a vacuum pump) lets the liquid boil — and therefore distil over — at a much lower temperature than its normal boiling point, so it distils without decomposing. This is how glycerol is purified from spent-lye, well below its normal (and destructive) boiling point.\n\n**Steam distillation** is used for substances that are steam-volatile — they have appreciable vapour pressure at the temperature of boiling water — and are practically immiscible with water. When steam is passed through the heated mixture, the total vapour pressure is the *sum* of the vapour pressures of water and of the organic liquid, so the mixture boils (and the organic liquid distils over, carried along with the steam) at a temperature below 373 K — below either component\'s own boiling point. This is how aniline is separated from a reaction mixture containing tarry, non-volatile impurities, at a much lower temperature than aniline\'s own boiling point (457 K).\n\nThe common thread: all three condense a vapour back to liquid to collect a pure fraction; they differ only in *how* the vaporisation is made possible — heat alone, heat plus lowered pressure, or heat plus the added partial pressure of steam.',
            },
            {
              kind: 'numerical',
              id: 'd5319b64-c1b0-473d-ae1c-38704632b3d7',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.24',
              prompt: 'Explain the principle of paper chromatography.',
              answer: 'Partition chromatography — the mobile solvent and the water held on the paper act as two immiscible phases the components partition between as they move up the paper.',
              solution:
                'Paper chromatography works on the principle of **partition** (not adsorption like column chromatography on alumina). A strip of special chromatography paper contains cellulose fibres that hold a thin film of water trapped within them — this trapped water is the *stationary phase*. The lower end of the paper is dipped in a suitable solvent (the *mobile phase*), which rises up the paper by capillary action. As the solvent front moves up, each component of the mixture spotted near the bottom continuously distributes itself — partitions — between the stationary water phase held on the paper and the moving solvent phase, exactly like a solute partitioning between two immiscible liquids. A component that is more soluble in (has more affinity for) the mobile solvent moves up faster and travels a greater distance; a component that prefers the stationary water phase moves up more slowly and stays closer to the starting spot. Because different components have different relative solubilities in the two phases, they end up separated as distinct spots at different heights on the paper once the solvent front has run a fixed distance — this separation is characterised for each compound by its $R_f$ value (ratio of distance moved by the compound to distance moved by the solvent front).',
            },
            {
              kind: 'numerical',
              id: 'be49c9a4-edb4-487c-9e98-38b064424cf3',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.27',
              prompt: 'Name a suitable technique of separation of the components from a mixture of calcium sulphate and camphor.',
              answer: 'Sublimation.',
              solution:
                'The suitable technique is **sublimation**. Camphor is a sublimable solid — on gentle heating it passes directly from the solid state to vapour without going through a liquid state, and the vapour re-solidifies as pure camphor on a cold surface placed above it. Calcium sulphate is a non-volatile, non-sublimable inorganic salt, so it is left behind unaffected as a residue. Heating the mixture gently in a china dish covered with a perforated filter paper and an inverted funnel therefore lets pure camphor collect on the cold funnel surface while calcium sulphate stays behind as the residue — cleanly separating the two.',
            },
            {
              kind: 'numerical',
              id: 'c386aaa9-49cc-480f-a2e6-1f2b3cd1aa97',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.28',
              prompt: 'Explain, why an organic liquid vaporises at a temperature below its boiling point in its steam distillation?',
              answer:
                'Because in steam distillation the liquid boils when the SUM of its own vapour pressure and steam\'s vapour pressure equals atmospheric pressure — so it does not need its own vapour pressure to reach atmospheric pressure alone.',
              solution:
                "A pure liquid normally boils, and starts vaporising freely, only at the temperature where its own vapour pressure becomes equal to the atmospheric pressure. In steam distillation, the organic liquid is not alone — it is in contact with steam, and the mixture as a whole boils when the *combined* vapour pressure of the liquid and the steam together equals the atmospheric pressure: $p_{total} = p_{liquid} + p_{water} = p_{atm}$. Because water is already contributing a large share of that total vapour pressure, the organic liquid's own vapour pressure only has to make up the remainder — it doesn't need to rise all the way to atmospheric pressure by itself. So the mixture (and hence the organic liquid within it) begins vaporising at a temperature well below the liquid's normal boiling point, and always below 373 K, since $p_{water}$ alone cannot exceed atmospheric pressure until 373 K. That is why aniline (normal b.p. 457 K) distils over with steam at a temperature just below 373 K.",
            },
          ],
        },
        // ---------- Section 2: Qualitative analysis — Lassaigne's test chemistry ----------
        {
          id: 's2-qualitative-analysis',
          title: "Qualitative analysis — Lassaigne's test chemistry",
          blurb:
            "Why sodium fusion is needed, the chemistry behind the N/S/halogen tests, and the reasoning behind each reagent choice in Lassaigne's test.",
          items: [
            {
              kind: 'numerical',
              id: '614e34d4-0ae6-4053-876d-1c574421adae',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.21',
              prompt: "Discuss the chemistry of Lassaigne's test.",
              answer:
                "Fusing the organic compound with sodium metal converts covalently-bound N, S, halogens into ionic NaCN, Na2S, NaX, which are then tested for as free ions in the sodium extract.",
              solution:
                "Nitrogen, sulphur, halogens and phosphorus are normally present in an organic compound in **covalent** form, bonded to carbon — and covalently bound atoms don't give the usual ionic tests. Lassaigne's test converts them into water-soluble **ionic** compounds by fusing (strongly heating) the organic compound with metallic sodium. If the compound contains N and S together, the fusion mainly produces sodium thiocyanate: $\\ce{Na + C + N + S ->[\\Delta] NaSCN}$. If N is present alone, it forms sodium cyanide: $\\ce{Na + C + N ->[\\Delta] NaCN}$. Sulphur alone forms sodium sulphide, $\\ce{2Na + S -> Na2S}$, and any halogen present forms the sodium halide, $\\ce{Na + X -> NaX}$ (X = Cl, Br, I). The fused mass is plunged into distilled water and boiled, giving the **sodium fusion extract**, which now contains these ions in solution ready for testing:\n- **Nitrogen** is detected by boiling the extract with $\\ce{FeSO4}$, then acidifying with dilute $\\ce{H2SO4}$: the $\\ce{CN-}$ present first forms sodium ferrocyanide, $\\ce{Fe(CN)2 + 4NaCN -> Na4[Fe(CN)6]}$, which then reacts with the $\\ce{Fe^3+}$ (formed by partial air-oxidation of $\\ce{Fe^2+}$) to give **Prussian blue**, $\\ce{Fe4[Fe(CN)6]3}$.\n- **Sulphur** is detected as a violet colour with sodium nitroprusside ($\\ce{Na2S + Na2[Fe(CN)5NO] -> Na4[Fe(CN)5NOS]}$, violet), or as a black precipitate of lead sulphide with lead acetate.\n- **Halogens** are detected by acidifying the extract with dilute $\\ce{HNO3}$ (to destroy any $\\ce{CN-}$/$\\ce{S^2-}$ first) and then adding $\\ce{AgNO3}$: $\\ce{NaX + AgNO3 -> AgX v + NaNO3}$ — white AgCl (soluble in $\\ce{NH4OH}$), pale-yellow AgBr (partly soluble), or yellow AgI (insoluble).\n- **Phosphorus** is detected by boiling the compound with sodium peroxide, which oxidises the phosphorus to phosphate; adding ammonium molybdate and $\\ce{HNO3}$ then gives a canary-yellow precipitate of ammonium phosphomolybdate.\nThe whole scheme rests on this one idea: convert the covalently bound heteroatom into a free ion by fusing with reactive sodium metal, then run standard ionic tests on the extract.",
            },
            {
              kind: 'numerical',
              id: 'd744c9a1-f137-4bd3-9b69-42d3ab4978f2',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.25',
              prompt: 'Why is nitric acid added to sodium extract before adding silver nitrate for testing halogens?',
              answer:
                'Because the extract also contains NaCN and Na2S, which would themselves give precipitates with AgNO3 and give a false-positive test — HNO3 destroys them first.',
              solution:
                "The sodium fusion extract of a compound containing N, S and a halogen contains not just the sodium halide but also sodium cyanide ($\\ce{NaCN}$) and sodium sulphide ($\\ce{Na2S}$), formed during the same fusion. Both of these also react with silver nitrate and give precipitates of their own — $\\ce{AgCN}$ (white) and $\\ce{Ag2S}$ (black) — which would interfere with the halogen test and could easily be mistaken for a halide precipitate, giving a false-positive result. Boiling the extract with dilute $\\ce{HNO3}$ before adding $\\ce{AgNO3}$ decomposes both $\\ce{CN-}$ and $\\ce{S^2-}$: the cyanide is driven off as $\\ce{HCN}$ gas and the sulphide as $\\ce{H2S}$ gas (both volatile and lost from the boiling solution), while the halide ion is unaffected by the acid and stays in solution. Only then does adding $\\ce{AgNO3}$ give a precipitate that can be trusted as coming from the halogen alone — its colour (white/AgCl, pale-yellow/AgBr, yellow/AgI) and solubility in ammonia then reliably identifies which halogen is present.",
            },
            {
              kind: 'numerical',
              id: '559c46d4-584b-43cc-9459-899b99ead2da',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.26',
              prompt: 'Explain the reason for the fusion of an organic compound with metallic sodium for testing nitrogen, sulphur and halogens.',
              answer:
                'N, S and halogens are covalently bonded in the compound and give no ionic test as such — fusion with sodium converts them to ionic sodium salts (NaCN, Na2S, NaX) that are water-soluble and testable.',
              solution:
                "In the organic compound, nitrogen, sulphur and the halogen are all held by **covalent bonds** to carbon (and, in the case of nitrogen and sulphur, sometimes to each other too). Covalently bound atoms are locked into the molecule and are not free ions, so they cannot be detected by the usual precipitation/colour tests, which rely on the species being present as a free ion in solution. Sodium metal is a strong reducing agent, and at fusion temperature it breaks these covalent bonds and combines with the heteroatoms to form simple, water-soluble ionic sodium salts — sodium cyanide (from C and N, or with S present, sodium thiocyanate), sodium sulphide (from S), and sodium halide (from the halogen). Once these ions are freed into aqueous solution as the **sodium fusion extract**, standard ionic tests (Prussian-blue test for $\\ce{CN-}$, nitroprusside/lead-acetate test for $\\ce{S^2-}$, and the $\\ce{AgNO3}$ test for halide) can be applied directly. Fusion with sodium is therefore the essential first step that converts an otherwise 'invisible' covalently bound atom into a detectable free ion.",
            },
            {
              kind: 'numerical',
              id: '2972ab09-b4c9-4b88-b77f-04ed378af4ad',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.29',
              prompt: 'Will CCl4 give white precipitate of AgCl on heating it with silver nitrate? Give reason for your answer.',
              answer: 'No — CCl4 has no ionisable chlorine; the C–Cl bonds are covalent and are not broken by simply heating with AgNO3.',
              solution:
                "**No, it will not.** The chlorine atoms in $\\ce{CCl4}$ (carbon tetrachloride) are bonded to carbon by strong **covalent** bonds — there is no free chloride ion, $\\ce{Cl-}$, present in the compound for silver nitrate to react with. Silver nitrate gives a white precipitate of $\\ce{AgCl}$ only when free $\\ce{Cl-}$ ions are available in solution to combine with $\\ce{Ag+}$. Simply heating $\\ce{CCl4}$ with aqueous $\\ce{AgNO3}$ does not have enough energy or the right conditions to break these strong covalent C–Cl bonds and liberate chloride ions — so no precipitate forms. This is exactly why Lassaigne's test doesn't test the compound directly with $\\ce{AgNO3}$: it must first be fused with sodium metal, which does break the covalent C–Cl bond and converts the chlorine into ionic $\\ce{NaCl}$, only after which the $\\ce{AgNO3}$ test works and gives the white precipitate of $\\ce{AgCl}$.",
            },
            {
              kind: 'numerical',
              id: '5adf6117-dfda-4714-bca0-19496981b762',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.31',
              prompt: 'Why is it necessary to use acetic acid and not sulphuric acid for acidification of sodium extract for testing sulphur by lead acetate test?',
              answer:
                'Because H2SO4 would form insoluble white PbSO4 with the lead acetate reagent, masking or being confused with the actual black PbS test for sulphur.',
              solution:
                "The lead acetate test for sulphur works by adding lead acetate solution to the acidified sodium fusion extract — if sulphide ($\\ce{S^2-}$) is present, it gives a **black precipitate of lead sulphide**: $\\ce{Pb(CH3COO)2 + Na2S -> PbS v (black) + 2CH3COONa}$. The extract must be acidified first (to decompose any residual $\\ce{NaCN}$ or other interfering species), but the acid chosen matters. If dilute **sulphuric acid** were used instead of acetic acid, the sulphate ion it introduces would react with the lead acetate reagent itself to form **lead sulphate, $\\ce{PbSO4}$**, which is also a white/pale precipitate — $\\ce{Pb(CH3COO)2 + H2SO4 -> PbSO4 v + 2CH3COOH}$. This unwanted precipitate would form regardless of whether sulphur is actually present in the compound, masking or confusing the real black-PbS result, and could even be mistaken for a genuine positive/negative test. **Acetic acid** (a weak acid) is used instead because it acidifies the extract just enough to destroy the interfering ions without introducing any ion (like sulphate) that would itself react with lead acetate — so the black precipitate seen afterwards can be trusted as coming only from sulphide, i.e. only from sulphur genuinely present in the compound.",
            },
          ],
        },
        // ---------- Section 3: Quantitative estimation — carbon, hydrogen & nitrogen ----------
        {
          id: 's3-quant-c-h-n',
          title: 'Quantitative estimation of carbon, hydrogen & nitrogen',
          blurb: 'Combustion analysis for C and H, and the Dumas vs Kjeldahl methods for nitrogen — including two worked numericals.',
          items: [
            {
              kind: 'numerical',
              id: 'd08acb6a-1031-4fbb-8465-57e9ad561ed8',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.22',
              prompt:
                'Differentiate between the principle of estimation of nitrogen in an organic compound by (i) Dumas method and (ii) Kjeldahl\'s method.',
              answer:
                "Dumas: the compound's nitrogen is converted to N2 gas by combustion with CuO, and its volume is measured directly. Kjeldahl: the compound's nitrogen is converted to NH3 by heating with H2SO4, and the ammonia is estimated by titration.",
              solution:
                "Both methods find the percentage of nitrogen in an organic compound, but they convert the nitrogen into a completely different measurable form.\n\n**(i) Dumas method.** The compound is heated with copper oxide ($\\ce{CuO}$) in an atmosphere of $\\ce{CO2}$. This combustion oxidises the carbon and hydrogen in the compound to $\\ce{CO2}$ and $\\ce{H2O}$, and the nitrogen present is converted directly into free **nitrogen gas**, $\\ce{N2}$ (any oxides of nitrogen formed are reduced back to $\\ce{N2}$ by passing the gases over a hot copper spiral). The gaseous mixture is then passed into a graduated tube standing over concentrated KOH solution, which absorbs the $\\ce{CO2}$ completely, leaving pure $\\ce{N2}$ gas whose volume is read off directly. The percentage of nitrogen is calculated from this measured volume of $\\ce{N2}$ (converted to STP) as a fraction of the mass of compound taken. The principle here is **direct volumetric measurement of the nitrogen gas liberated**.\n\n**(ii) Kjeldahl's method.** The compound is heated with concentrated sulphuric acid, which converts the organic nitrogen into **ammonium sulphate**, $\\ce{(NH4)2SO4}$. This solution is then heated with excess sodium hydroxide, which liberates the ammonia as gas: $\\ce{(NH4)2SO4 + 2NaOH -> Na2SO4 + 2NH3 ^ + 2H2O}$. The liberated $\\ce{NH3}$ is passed into and absorbed by a known volume of a standard acid (usually $\\ce{H2SO4}$) of known strength. The amount of acid that actually reacted with the ammonia is found by back-titrating the unreacted acid left over with standard NaOH. The principle here is **acid–base titration** — the nitrogen content is calculated from the known volume/strength of standard acid consumed by the ammonia evolved.\n\nThe key difference: Dumas measures nitrogen's own gas volume directly; Kjeldahl converts nitrogen into ammonia and measures it indirectly through titration. (One practical consequence: Kjeldahl's method cannot be used for compounds where nitrogen is present as a ring nitrogen, e.g. pyridine, or as a nitro/azo group, because these do not release their nitrogen as ammonia under the reaction conditions — Dumas method works for all nitrogen-containing compounds.)",
            },
            {
              kind: 'numerical',
              id: '6b16e477-d5f9-4677-b965-dce09517dc98',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.30',
              prompt: 'Why is a solution of potassium hydroxide used to absorb carbon dioxide evolved during the estimation of carbon present in an organic compound?',
              answer: 'KOH is a strong base that absorbs acidic CO2 completely and quantitatively as K2CO3, so all the CO2 formed is captured and its mass gives a reliable measure of the carbon content.',
              solution:
                'In the Liebig method for estimating carbon and hydrogen, a known mass of the organic compound is burnt completely in a stream of oxygen over $\\ce{CuO}$, converting all its carbon to carbon dioxide and all its hydrogen to water vapour. To find out how much carbon was present, the $\\ce{CO2}$ gas produced needs to be captured **completely** and weighed. $\\ce{CO2}$ is an acidic oxide, and potassium hydroxide is a strong base — it absorbs $\\ce{CO2}$ readily and quantitatively (i.e. essentially all of it, with none escaping unabsorbed) by the reaction $\\ce{2KOH + CO2 -> K2CO3 + H2O}$. Because this absorption is both complete and reproducible, the increase in mass of the KOH tube (through which the combustion gases are passed after the water has already been absorbed separately in a $\\ce{CaCl2}$ or $\\ce{Mg(ClO4)2}$ tube) gives directly and reliably the mass of $\\ce{CO2}$ produced, from which the mass — and hence percentage — of carbon in the original sample is calculated. A weaker or less complete absorbent would let some $\\ce{CO2}$ pass through unabsorbed, giving a falsely low result.',
            },
            {
              kind: 'numerical',
              id: 'c706e93a-97f6-4b91-8b6c-d23c6c1ef496',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.32',
              prompt:
                'An organic compound contains 69% carbon and 4.8% hydrogen, the remainder being oxygen. Calculate the masses of carbon dioxide and water produced when 0.20 g of this substance is subjected to complete combustion.',
              answer: 'Mass of CO2 ≈ 0.506 g; mass of H2O ≈ 0.0864 g.',
              solution:
                "This is a Liebig combustion problem worked backwards — we're given the % composition and asked for the masses of $\\ce{CO2}$ and $\\ce{H2O}$ a fixed sample would produce, using the same mass-ratio logic the chapter uses to *find* % composition from combustion data.\n\n**Step 1 — mass of carbon and hydrogen in the 0.20 g sample.**\nMass of C $= 69\\% \\times 0.20\\ \\text{g} = 0.138$ g.\nMass of H $= 4.8\\% \\times 0.20\\ \\text{g} = 0.0096$ g.\n\n**Step 2 — mass of CO2 from the mass of carbon.**\nEvery mole of carbon (12 g) that burns produces one mole of $\\ce{CO2}$ (44 g), so the mass ratio is $44/12$:\n$$\\text{mass of } \\ce{CO2} = 0.138 \\times \\dfrac{44}{12} = 0.138 \\times 3.667 = 0.506\\ \\text{g (to 3 s.f.)}$$\n\n**Step 3 — mass of H2O from the mass of hydrogen.**\nEvery 2 g of hydrogen atoms (H2, molar mass 2) that burns gives 1 mole of $\\ce{H2O}$ (18 g), so the mass ratio is $18/2 = 9$:\n$$\\text{mass of } \\ce{H2O} = 0.0096 \\times \\dfrac{18}{2} = 0.0096 \\times 9 = 0.0864\\ \\text{g}$$\n\n**Answer:** the combustion of 0.20 g of this compound produces about **0.506 g of $\\ce{CO2}$** and about **0.0864 g of $\\ce{H2O}$**. (As a check, note oxygen makes up the remaining $100 - 69 - 4.8 = 26.2\\%$ of the compound — it isn't needed for this calculation, but it must add up, and it does.)",
            },
            {
              kind: 'numerical',
              id: '3ab5e12d-78c1-43e9-94cc-6b71d4128638',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.33',
              prompt:
                "A sample of 0.50 g of an organic compound was treated according to Kjeldahl's method. The ammonia evolved was absorbed in 50 mL of 0.5 M H2SO4. The residual acid required 60 mL of 0.5 M solution of NaOH for neutralisation. Find the percentage composition of nitrogen in the compound.",
              answer: '% N = 56%',
              solution:
                "**Step 1 — total acid taken to absorb the ammonia.**\nMoles of $\\ce{H2SO4}$ taken $= 0.050\\ \\text{L} \\times 0.5\\ \\text{mol/L} = 0.025$ mol.\n\n**Step 2 — acid left unreacted (found from the NaOH back-titration).**\nMoles of NaOH used $= 0.060\\ \\text{L} \\times 0.5\\ \\text{mol/L} = 0.030$ mol.\nSince $\\ce{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}$, moles of $\\ce{H2SO4}$ neutralised by this NaOH $= \\dfrac{0.030}{2} = 0.015$ mol.\n\n**Step 3 — acid that actually reacted with the ammonia.**\nMoles of $\\ce{H2SO4}$ used by $\\ce{NH3}$ $= 0.025 - 0.015 = 0.010$ mol.\n\n**Step 4 — moles of ammonia (and hence nitrogen) evolved.**\nSince $\\ce{2NH3 + H2SO4 -> (NH4)2SO4}$, each mole of $\\ce{H2SO4}$ reacts with 2 moles of $\\ce{NH3}$:\nmoles of $\\ce{NH3} = 2 \\times 0.010 = 0.020$ mol $=$ moles of N.\n\n**Step 5 — mass and percentage of nitrogen.**\nMass of N $= 0.020\\ \\text{mol} \\times 14\\ \\text{g/mol} = 0.28$ g.\n$$\\%\\ \\ce{N} = \\dfrac{0.28}{0.50} \\times 100 = 56\\%$$\n\n**Answer: the compound contains 56% nitrogen by mass.**",
            },
          ],
        },
        // ---------- Section 4: Quantitative estimation — halogens, sulphur & phosphorus ----------
        {
          id: 's4-quant-halogens-s-p',
          title: 'Quantitative estimation of halogens, sulphur & phosphorus',
          blurb: "Carius method principle, and two worked numericals — % chlorine from AgCl and % sulphur from BaSO4.",
          items: [
            {
              kind: 'numerical',
              id: '9313c335-261b-45f9-bb5f-6b51ac375d29',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.23',
              prompt: 'Discuss the principle of estimation of halogens, sulphur and phosphorus present in an organic compound.',
              answer:
                "Carius method: heat the compound with fuming HNO3 and AgNO3 (for halogens) or with a bromine/oxidising mixture (for S and P) inside a sealed tube, then weigh the precipitate formed (AgX, BaSO4, or Mg2P2O7) to back-calculate the element's mass.",
              solution:
                "Halogens, sulphur and phosphorus are all estimated by essentially the same idea — the **Carius method**: a known mass of the organic compound is heated strongly with fuming nitric acid, in a sealed hard-glass (Carius) tube, in the presence of a reagent that traps the element as an insoluble, weighable compound.\n\n**Halogens.** The compound is heated with fuming $\\ce{HNO3}$ in the presence of silver nitrate. Oxidation by the nitric acid converts the organically bound halogen into halide ion, which immediately precipitates as **silver halide**: $\\ce{AgX}$ (X = Cl, Br, I). This precipitate is filtered, washed, dried and weighed. From the mass of $\\ce{AgX}$ obtained, the mass — and hence percentage — of the halogen present is calculated using the known mass ratio of X to $\\ce{AgX}$ (i.e. the fraction of $\\ce{AgX}$'s molar mass that is due to the halogen).\n\n**Sulphur.** The compound is heated with fuming $\\ce{HNO3}$ (sometimes with a small amount of bromine, an oxidant, to ensure full oxidation), which oxidises the sulphur to sulphate. Adding barium chloride solution to the resulting solution precipitates the sulphate as **barium sulphate**, $\\ce{BaSO4}$, which is filtered, dried and weighed. The mass of sulphur is back-calculated from the mass of $\\ce{BaSO4}$ using the mass ratio of S to $\\ce{BaSO4}$.\n\n**Phosphorus.** The compound is oxidised (heated with fuming $\\ce{HNO3}$) so that the phosphorus is converted to phosphoric acid, i.e. present as phosphate ion in solution. This is precipitated either as ammonium phosphomolybdate (by adding ammonia and ammonium molybdate solution) or, for a gravimetric estimate, as **magnesium ammonium phosphate**, which on ignition converts to magnesium pyrophosphate, $\\ce{Mg2P2O7}$, which is weighed. The mass of phosphorus is back-calculated from the mass of this weighed precipitate using its known composition.\n\nIn every case the principle is the same three-step logic: (1) destroy the organic framework and oxidise the element into a specific ionic form, (2) precipitate that ion as an insoluble, stoichiometrically well-defined compound, and (3) weigh the precipitate and use its known mass-ratio to the element to calculate how much of that element was in the original sample.",
            },
            {
              kind: 'numerical',
              id: 'c524c204-dba9-4ca1-8fb8-a3d039e68fa7',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.34',
              prompt: '0.3780 g of an organic chloro compound gave 0.5740 g of silver chloride in Carius estimation. Calculate the percentage of chlorine present in the compound.',
              answer: '% Cl ≈ 37.57%',
              solution:
                "**Step 1 — mass ratio of Cl in AgCl.**\nMolar mass of $\\ce{AgCl} = 108 + 35.5 = 143.5$ g/mol. Chlorine's share of that mass is $\\dfrac{35.5}{143.5}$.\n\n**Step 2 — mass of chlorine in the AgCl obtained.**\n$$\\text{mass of Cl} = 0.5740\\ \\text{g} \\times \\dfrac{35.5}{143.5} = 0.5740 \\times 0.2474 = 0.1420\\ \\text{g}$$\n\n**Step 3 — percentage of chlorine in the original sample.**\n$$\\%\\ \\ce{Cl} = \\dfrac{0.1420}{0.3780} \\times 100 = 37.57\\%$$\n\n**Answer: the compound contains about 37.57% chlorine by mass.**",
            },
            {
              kind: 'numerical',
              id: '726529f7-00a8-48c6-ad7b-7e50a3f7e52a',
              source: 'ncert_exercise',
              source_label: 'NCERT 8.35',
              prompt: 'In the estimation of sulphur by Carius method, 0.468 g of an organic sulphur compound afforded 0.668 g of barium sulphate. Find out the percentage of sulphur in the given compound.',
              answer: '% S ≈ 19.60%',
              solution:
                "**Step 1 — mass ratio of S in BaSO4.**\nMolar mass of $\\ce{BaSO4} = 137 + 32 + 4(16) = 233$ g/mol. Sulphur's share of that mass is $\\dfrac{32}{233}$.\n\n**Step 2 — mass of sulphur in the BaSO4 obtained.**\n$$\\text{mass of S} = 0.668\\ \\text{g} \\times \\dfrac{32}{233} = 0.668 \\times 0.1373 = 0.09174\\ \\text{g}$$\n\n**Step 3 — percentage of sulphur in the original sample.**\n$$\\%\\ \\ce{S} = \\dfrac{0.09174}{0.468} \\times 100 = 19.60\\%$$\n\n**Answer: the compound contains about 19.60% sulphur by mass.**",
            },
          ],
        },
      ],
    },
  ],
};
