// NCERT textbook end-of-chapter EXERCISES 8.1–8.38 — Class 12 Chemistry, Unit 8
// (The d- and f-Block Elements) from "12th - D & F block.pdf", PDF pages 26–28
// (book pages 234–236).
// Question stems transcribed verbatim from the NCERT chapter PDF.
// Every item is a tap-to-reveal numerical (`kind:'numerical'`). Item shape mirrors
// the p-Block sibling scripts/practice-pblock/ncert_pblock.js.
// Items are grouped into the 5 practice-bank sections per the build contract
// (_agents/plans/DFBLOCK_BUILD.md "Practice bank — 5 sections"):
//   s1-structure | s2-oxidation-redox | s3-properties-compounds |
//   s4-lanthanoids | s5-actinoids
// Answers written by hand from standard NCERT content. The chapter's
// "Answers to Some Intext Questions" (PDF p.28) was used as a direct cross-check
// for 8.1, 8.2, 8.3, 8.5, 8.6, 8.7, 8.9 and 8.10 (those NCERT answers match the
// corresponding exercise stems). Any answer not fully certain is flagged inline
// with a "⚠ verify" note rather than guessed.

module.exports = {
  // ──────────────────────────────────────────────────────────────────────────
  // S1 — Position, electronic configuration & general characteristics of the d-block
  // 8.1, 8.8, 8.9, 8.34, 8.35, 8.37
  // ──────────────────────────────────────────────────────────────────────────
  's1-structure': [
    {
      kind: 'numerical',
      id: 'df-ncert-8-1',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.1',
      prompt:
        'Write down the electronic configuration of:\n\n(i) $\\ce{Cr^{3+}}$\n\n(ii) $\\ce{Pm^{3+}}$\n\n(iii) $\\ce{Cu^{+}}$\n\n(iv) $\\ce{Ce^{4+}}$\n\n(v) $\\ce{Co^{2+}}$\n\n(vi) $\\ce{Lu^{2+}}$\n\n(vii) $\\ce{Mn^{2+}}$\n\n(viii) $\\ce{Th^{4+}}$',
      answer:
        '(i) $[\\text{Ar}]3d^3$; (ii) $[\\text{Xe}]4f^4$; (iii) $[\\text{Ar}]3d^{10}$; (iv) $[\\text{Xe}]4f^0$; (v) $[\\text{Ar}]3d^7$; (vi) $[\\text{Xe}]4f^{14}5d^1$; (vii) $[\\text{Ar}]3d^5$; (viii) $[\\text{Rn}]5f^0$.',
      solution:
        'Remove electrons starting from the **outermost $ns$ shell first**, then from the inner $d$ (or $f$) shell.\n\n' +
        '**(i) $\\ce{Cr^{3+}}$** (Cr = $[\\text{Ar}]3d^5 4s^1$, remove 3 e⁻): $ [\\text{Ar}]3d^3 $.\n\n' +
        '**(ii) $\\ce{Pm^{3+}}$** (Pm, Z = 61 = $[\\text{Xe}]4f^5 6s^2$, remove 3 e⁻→ lose $6s^2$ and one $4f$): $ [\\text{Xe}]4f^4 $.\n\n' +
        '**(iii) $\\ce{Cu^{+}}$** (Cu = $[\\text{Ar}]3d^{10} 4s^1$, remove 1 e⁻): $ [\\text{Ar}]3d^{10} $.\n\n' +
        '**(iv) $\\ce{Ce^{4+}}$** (Ce, Z = 58 = $[\\text{Xe}]4f^1 5d^1 6s^2$, remove 4 e⁻): $ [\\text{Xe}]4f^0 $ (noble-gas core of Xe).\n\n' +
        '**(v) $\\ce{Co^{2+}}$** (Co = $[\\text{Ar}]3d^7 4s^2$, remove 2 e⁻): $ [\\text{Ar}]3d^7 $.\n\n' +
        '**(vi) $\\ce{Lu^{2+}}$** (Lu, Z = 71 = $[\\text{Xe}]4f^{14} 5d^1 6s^2$, remove 2 e⁻→ lose $6s^2$): $ [\\text{Xe}]4f^{14} 5d^1 $.\n\n' +
        '**(vii) $\\ce{Mn^{2+}}$** (Mn = $[\\text{Ar}]3d^5 4s^2$, remove 2 e⁻): $ [\\text{Ar}]3d^5 $ (stable half-filled).\n\n' +
        '**(viii) $\\ce{Th^{4+}}$** (Th, Z = 90 = $[\\text{Rn}]6d^2 7s^2$, remove 4 e⁻): $ [\\text{Rn}]5f^0 $ (noble-gas core of Rn).',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-8',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.8',
      prompt:
        'What are the characteristics of the transition elements and why are they called transition elements? Which of the $d$-block elements may not be regarded as the transition elements?',
      solution:
        'A **transition element** is one whose atom (or one of its common ions) has a **partially filled $d$ sub-shell** ($ d^1 $ to $ d^9 $).\n\n' +
        '**Characteristic properties:** nearly all are hard, high-melting metals; they conduct heat and electricity well; they show **variable oxidation states**; they form **coloured ions** and **paramagnetic** compounds; they form many **complexes**; they act as good **catalysts**; and they form **alloys** and **interstitial compounds**.\n\n' +
        'They are called **transition** elements because they lie between the highly reactive metallic $s$-block elements and the less metallic $p$-block elements, and their properties are *transitional* between the two — they represent a change (transition) from the $s$-block to the $p$-block in each long period.\n\n' +
        '**Not regarded as transition elements:** **Zn, Cd and Hg** (Group 12). Their atoms and their common $ +2 $ ions have a **completely filled $d^{10}$** configuration in the ground state, not a partially filled $d$ sub-shell, so they do not show the typical transition-metal properties.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-9',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.9',
      prompt:
        'In what way is the electronic configuration of the transition elements different from that of the non transition elements?',
      solution:
        '**Transition elements** ($d$-block) have their **last electron entering the inner $ (n-1)d $ sub-shell**, with the general configuration $ (n-1)d^{1-10}\\,ns^{1-2} $. So they have an incompletely (or, for forming ions, partially) filled $d$ sub-shell.\n\n' +
        '**Non-transition elements** are the $s$-block ($ ns^{1-2} $) and $p$-block ($ ns^2 np^{1-6} $) elements: their last electron enters the **outermost $s$ or $p$ sub-shell**, and the penultimate $d$ shell is either empty or completely filled.\n\n' +
        'In short: transition elements have a partly filled **penultimate $d$ sub-shell**, whereas in non-transition elements the differentiating electron goes into the **outermost shell** and there is no partly filled $d$ sub-shell.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-34',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.34',
      prompt:
        'Write the electronic configurations of the elements with the atomic numbers 61, 91, 101, and 109.',
      answer:
        'Z = 61 (Pm): $[\\text{Xe}]4f^5 6s^2$; Z = 91 (Pa): $[\\text{Rn}]5f^2 6d^1 7s^2$; Z = 101 (Md): $[\\text{Rn}]5f^{13} 7s^2$; Z = 109 (Mt): $[\\text{Rn}]5f^{14} 6d^7 7s^2$.',
      solution:
        '**Z = 61 — Promethium (Pm), a lanthanoid:** $ [\\text{Xe}]4f^5 6s^2 $.\n\n' +
        '**Z = 91 — Protactinium (Pa), an actinoid:** $ [\\text{Rn}]5f^2 6d^1 7s^2 $.\n\n' +
        '**Z = 101 — Mendelevium (Md), an actinoid:** $ [\\text{Rn}]5f^{13} 7s^2 $.\n\n' +
        '**Z = 109 — Meitnerium (Mt), a $d$-block (transition) element:** $ [\\text{Rn}]5f^{14} 6d^7 7s^2 $.\n\n' +
        '*(⚠ verify: NCERT prints these per its periodic-table conventions; Pa and Mt are the standard accepted ground-state configurations. The lanthanoid/actinoid assignments — Pm in the 4f series, Pa and Md in the 5f series, Mt in the 6d series — are the load-bearing points NCERT wants.)*',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-35',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.35',
      prompt:
        'Compare the general characteristics of the first series of the transition metals with those of the second and third series metals in the respective vertical columns. Give special emphasis on the following points:\n\n(i) electronic configurations\n\n(ii) oxidation states\n\n(iii) ionisation enthalpies\n\n(iv) atomic sizes.',
      solution:
        '**(i) Electronic configurations:** All three series have the general configuration $ (n-1)d^{1-10}\\,ns^{1-2} $ (first series $ 3d $, second $ 4d $, third $ 5d $). The $ 4d $ and $ 5d $ series show more irregularities in filling than the $ 3d $ series.\n\n' +
        '**(ii) Oxidation states:** The **second and third series show higher oxidation states more readily and more stably** than the first series (e.g. Mo and W reach $ +6 $ much more easily than Cr; Tc and Re show $ +7 $ readily). The heavier elements also form fewer compounds in the very low oxidation states.\n\n' +
        '**(iii) Ionisation enthalpies:** Going **down a group**, the first ionisation enthalpy generally **increases** for the transition series (opposite to the main-group trend) because of the **lanthanoid contraction** — the third-series atoms are no larger than the second-series ones, and their electrons are more tightly held, so the $ 5d $ elements have especially high ionisation enthalpies.\n\n' +
        '**(iv) Atomic sizes:** The atoms of the **second and third series in a given group are nearly equal in size** (e.g. Zr 160 pm ≈ Hf 159 pm), even though the third-series atom is much heavier. This is the most striking consequence of the **lanthanoid contraction**, which cancels the expected size increase from the second to the third series.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-37',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.37',
      prompt:
        'Comment on the statement that elements of the first transition series possess many properties different from those of heavier transition elements.',
      solution:
        'The statement is **correct**. Although all three transition series share the same general $ (n-1)d\\,ns $ pattern, the first ($ 3d $) series differs from the heavier ($ 4d $, $ 5d $) ones in several ways:\n\n' +
        '- **Oxidation states:** the heavier elements show **higher oxidation states more readily and more stably** (e.g. Mo, W give $ +6 $; Tc, Re give $ +7 $), whereas the first-series elements favour the $ +2 $ and $ +3 $ states.\n' +
        '- **Atomic/ionic size & density:** owing to the **lanthanoid contraction**, the second- and third-series atoms in a group are nearly the same size, but both are larger and far denser than the corresponding first-series atom.\n' +
        '- **Magnetic behaviour:** first-series ions follow the **spin-only** formula closely, while the heavier elements show greater spin–orbit (orbital) contribution.\n' +
        '- **Metal–metal bonding & cluster compounds** and **complex formation** are far more common among the heavier elements.\n' +
        '- The heavier elements have **higher melting/boiling points and enthalpies of atomisation** (more $ d $ electrons available for metallic bonding).\n\n' +
        'Hence the first transition series does possess many properties distinct from those of the heavier transition elements.',
    },
  ],

  // ──────────────────────────────────────────────────────────────────────────
  // S2 — Oxidation states, redox & electrode potentials
  // 8.2, 8.3, 8.4, 8.5, 8.6, 8.13, 8.17, 8.19, 8.21, 8.22, 8.23, 8.25
  // ──────────────────────────────────────────────────────────────────────────
  's2-oxidation-redox': [
    {
      kind: 'numerical',
      id: 'df-ncert-8-2',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.2',
      prompt:
        'Why are $\\ce{Mn^{2+}}$ compounds more stable than $\\ce{Fe^{2+}}$ towards oxidation to their +3 state?',
      solution:
        'The stability is decided by the electronic configuration of the resulting $ +3 $ ion.\n\n' +
        '**$\\ce{Mn^{2+}}$** is $ [\\text{Ar}]3d^5 $ — a **stable half-filled** $ d $ sub-shell. Oxidising it to $\\ce{Mn^{3+}}$ ($ 3d^4 $) would **destroy** that extra-stable half-filled arrangement, so $\\ce{Mn^{2+}}$ strongly **resists** oxidation and is very stable.\n\n' +
        '**$\\ce{Fe^{2+}}$** is $ [\\text{Ar}]3d^6 $. Oxidising it to $\\ce{Fe^{3+}}$ ($ 3d^5 $) **produces** the stable half-filled $ d^5 $ configuration, which is energetically favourable. So $\\ce{Fe^{2+}}$ is readily oxidised to $\\ce{Fe^{3+}}$.\n\n' +
        'Because oxidation removes the stable half-filled shell in manganese but creates one in iron, $\\ce{Mn^{2+}}$ compounds are **more stable** towards oxidation to the $ +3 $ state than $\\ce{Fe^{2+}}$ compounds.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-3',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.3',
      prompt:
        'Explain briefly how +2 state becomes more and more stable in the first half of the first row transition elements with increasing atomic number?',
      solution:
        'In the **first half** of the $ 3d $ series (Sc → Mn), forming the $ +2 $ ion means removing the two $ 4s $ electrons, leaving a $ 3d^n $ ion.\n\n' +
        'As the atomic number increases across this half, the **nuclear charge increases** while the added electrons enter the same inner $ 3d $ sub-shell and shield each other poorly. The $ 3d $ electrons are therefore held **more and more tightly**, so it becomes increasingly difficult to remove a third electron (i.e. to oxidise $\\ce{M^{2+}}$ to $\\ce{M^{3+}}$).\n\n' +
        'In other words, the **third ionisation enthalpy rises** steadily across the first half, making the $ +2 $ state **progressively more stable** with increasing atomic number, reaching maximum stability at manganese ($\\ce{Mn^{2+}}$, the half-filled $ 3d^5 $).',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-4',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.4',
      prompt:
        'To what extent do the electronic configurations decide the stability of oxidation states in the first series of the transition elements? Illustrate your answer with examples.',
      solution:
        'The electronic configuration of the resulting ion **largely decides** which oxidation states are stable: configurations that are **empty ($ d^0 $), half-filled ($ d^5 $) or completely filled ($ d^{10} $)** confer extra stability.\n\n' +
        '**Examples:**\n' +
        '- **$\\ce{Mn^{2+}}$** ($ 3d^5 $, half-filled) is very stable — it resists oxidation to $\\ce{Mn^{3+}}$.\n' +
        '- **$\\ce{Fe^{3+}}$** ($ 3d^5 $, half-filled) is more stable than $\\ce{Fe^{2+}}$ ($ 3d^6 $), so $\\ce{Fe^{2+}}$ is easily oxidised.\n' +
        '- **$\\ce{Sc^{3+}}$** ($ 3d^0 $) and **$\\ce{Zn^{2+}}$** ($ 3d^{10} $) are the only stable states of those metals — they are colourless and diamagnetic.\n' +
        '- **$\\ce{Cu^{+}}$** ($ 3d^{10} $) is stable in the solid/dry state, though it disproportionates in aqueous solution.\n\n' +
        'Thus, while ligand-field and hydration/lattice energies also matter, the **stability of $ d^0 $, $ d^5 $ and $ d^{10} $ configurations** is the dominant factor in deciding the stable oxidation states of the first transition series.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-5',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.5',
      prompt:
        'What may be the stable oxidation state of the transition element with the following $d$ electron configurations in the ground state of their atoms: $3d^3$, $3d^5$, $3d^8$ and $3d^4$?',
      answer:
        '$3d^3$ → $+5$ (also $+2,+3,+4$); $3d^5$ → $+2$ and $+7$ (Mn); $3d^8$ → $+2$ (Ni); $3d^4$ → no atom has this ground state — the $+2$/$+3$ ions arise from $3d^5 4s^1$ (Cr) etc.',
      solution:
        'Here the configurations refer to the **atom\'s ground state**, and we deduce the stable oxidation state.\n\n' +
        '**$ 3d^3 $ (i.e. $ 3d^3 4s^2 $ → Vanadium):** stable oxidation state **$ +5 $** (it can lose all five $ 3d $ + $ 4s $ electrons); it also commonly shows $ +2, +3, +4 $.\n\n' +
        '**$ 3d^5 $ (i.e. $ 3d^5 4s^2 $ → Manganese):** shows the **widest range, $ +2 $ to $ +7 $**; the most stable lower state is **$ +2 $** ($ 3d^5 $ half-filled) and the highest is **$ +7 $** (e.g. in $\\ce{KMnO4}$).\n\n' +
        '**$ 3d^8 $ (i.e. $ 3d^8 4s^2 $ → Nickel):** stable oxidation state **$ +2 $** ($\\ce{Ni^{2+}}$).\n\n' +
        '**$ 3d^4 $:** **no neutral transition atom has a $ 3d^4 $ ground state** (Cr is $ 3d^5 4s^1 $, not $ 3d^4 4s^2 $, because of the stability of the half-filled $ d^5 $). A $ 3d^4 $ *ion* such as $\\ce{Cr^{2+}}$ or $\\ce{Mn^{3+}}$ exists but is unstable/strongly reactive. \n\n' +
        '*(⚠ verify: the NCERT key treats $3d^4$ as the chromium case and quotes $+2$/$+3$; the load-bearing teaching point is that no atom is ground-state $3d^4 4s^2$.)*',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-6',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.6',
      prompt:
        'Name the oxometal anions of the first series of the transition metals in which the metal exhibits the oxidation state equal to its group number.',
      answer:
        'Chromate / dichromate $\\ce{CrO4^{2-}}$, $\\ce{Cr2O7^{2-}}$ (Cr, +6 = group 6) and permanganate $\\ce{MnO4^-}$ (Mn, +7 = group 7).',
      solution:
        'The metal shows an oxidation state equal to its group number only in its **oxometal anions**, where oxygen stabilises the highest state.\n\n' +
        '- **Chromate $\\ce{CrO4^{2-}}$ and dichromate $\\ce{Cr2O7^{2-}}$:** chromium is in the **$ +6 $** state, equal to its group number (Group 6).\n' +
        '- **Permanganate $\\ce{MnO4^-}$:** manganese is in the **$ +7 $** state, equal to its group number (Group 7).\n\n' +
        'In both, oxygen — being small and highly electronegative — stabilises the highest possible oxidation state of the metal.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-13',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.13',
      prompt:
        'How is the variability in oxidation states of transition metals different from that of the non transition metals? Illustrate with examples.',
      solution:
        'In **transition metals** the various oxidation states differ by **one unit** (e.g. $\\ce{Fe^{2+}}$ and $\\ce{Fe^{3+}}$; $\\ce{Cu^{+}}$ and $\\ce{Cu^{2+}}$). This is because, after the $ ns $ electrons are used, the $ (n-1)d $ electrons can be removed one at a time (the $ ns $ and $ (n-1)d $ levels are very close in energy). Hence the states are **consecutive** (e.g. Mn: $ +2,+3,+4,+5,+6,+7 $).\n\n' +
        'In **non-transition (main-group) metals** the common oxidation states usually differ by **two units** (e.g. $\\ce{Sn^{2+}}/\\ce{Sn^{4+}}$, $\\ce{Pb^{2+}}/\\ce{Pb^{4+}}$, $\\ce{Tl^{+}}/\\ce{Tl^{3+}}$), arising from the use of either the $ p $ electrons alone or the $ s $ and $ p $ electrons together (the **inert-pair effect**), so intermediate states are skipped.\n\n' +
        'Thus transition-metal oxidation states are **numerous and consecutive (differ by 1)**, while non-transition-metal states are **few and differ by 2**.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-17',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.17',
      prompt:
        'For $\\ce{M^{2+}/M}$ and $\\ce{M^{3+}/M^{2+}}$ systems the $ E^{\\ominus} $ values for some metals are as follows:\n\n' +
        '$\\ce{Cr^{2+}/Cr}$ $ \\;-0.9\\,\\text{V} \\qquad $ $\\ce{Cr^{3+}/Cr^{2+}}$ $ \\;-0.4\\,\\text{V} $\n\n' +
        '$\\ce{Mn^{2+}/Mn}$ $ \\;-1.2\\,\\text{V} \\qquad $ $\\ce{Mn^{3+}/Mn^{2+}}$ $ \\;+1.5\\,\\text{V} $\n\n' +
        '$\\ce{Fe^{2+}/Fe}$ $ \\;-0.4\\,\\text{V} \\qquad $ $\\ce{Fe^{3+}/Fe^{2+}}$ $ \\;+0.8\\,\\text{V} $\n\n' +
        'Use this data to comment upon:\n\n(i) the stability of $\\ce{Fe^{3+}}$ in acid solution as compared to that of $\\ce{Cr^{3+}}$ or $\\ce{Mn^{3+}}$ and\n\n(ii) the ease with which iron can be oxidised as compared to a similar process for either chromium or manganese metal.',
      solution:
        '**(i) Stability of the $ +3 $ ions in acid solution.** A *more positive* $ E^{\\ominus}(\\ce{M^{3+}/M^{2+}}) $ means $\\ce{M^{3+}}$ is more easily reduced, i.e. **less stable**.\n\n' +
        '- $\\ce{Cr^{3+}/Cr^{2+}} = -0.4\\,\\text{V}$ (negative): $\\ce{Cr^{3+}}$ is **very stable** — it is hard to reduce; $\\ce{Cr^{2+}}$ is reducing.\n' +
        '- $\\ce{Mn^{3+}/Mn^{2+}} = +1.5\\,\\text{V}$ (large positive): $\\ce{Mn^{3+}}$ is **very unstable** (strongly oxidising), readily reduced to the half-filled $\\ce{Mn^{2+}}$ ($ d^5 $).\n' +
        '- $\\ce{Fe^{3+}/Fe^{2+}} = +0.8\\,\\text{V}$: $\\ce{Fe^{3+}}$ is of **intermediate** stability — more stable than $\\ce{Mn^{3+}}$ but less stable than $\\ce{Cr^{3+}}$.\n\n' +
        'So the order of stability of the $ +3 $ state is $ \\ce{Cr^{3+}} > \\ce{Fe^{3+}} > \\ce{Mn^{3+}} $.\n\n' +
        '**(ii) Ease of oxidation of the metal** is judged by $ E^{\\ominus}(\\ce{M^{2+}/M}) $; a **more negative** value means the metal is **more easily oxidised**.\n\n' +
        '$ \\ce{Mn}(-1.2) < \\ce{Cr}(-0.9) < \\ce{Fe}(-0.4) $ (in volts), so the ease of oxidation of the metal is **Mn > Cr > Fe**. Iron is the **least easily oxidised** of the three; manganese the most. (The unusually negative value for Mn reflects the extra stability gained on reaching the half-filled $\\ce{Mn^{2+}}$, $ d^5 $.)',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-19',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.19',
      prompt:
        'Compare the stability of +2 oxidation state for the elements of the first transition series.',
      solution:
        'For the first transition series, the $ +2 $ state is formed by losing the two $ 4s $ electrons, leaving a $ 3d^n $ ion. Its stability is governed mainly by the $ E^{\\ominus}(\\ce{M^{2+}/M}) $ values (and the underlying ionisation enthalpies and configuration stability).\n\n' +
        '- **General trend:** the $ +2 $ state becomes **more stable across the series** as nuclear charge increases and the $ 3d $ electrons are held more tightly (third ionisation enthalpy rises), so oxidation of $\\ce{M^{2+}}$ to $\\ce{M^{3+}}$ gets harder going to the right.\n' +
        '- **$\\ce{Mn^{2+}}$ ($ d^5 $) and $\\ce{Zn^{2+}}$ ($ d^{10} $)** are especially stable because of their half-filled and fully-filled $ d $ configurations.\n' +
        '- **$\\ce{Sc}$** essentially does not form a stable $ +2 $ ion (it prefers $ +3 $, $ d^0 $); **$\\ce{Ti^{2+}}$, $\\ce{V^{2+}}$, $\\ce{Cr^{2+}}$** are good reducing agents (less stable $ +2 $).\n\n' +
        'Apart from the configuration anomalies, the **stability of the $ +2 $ state increases from left to right** across the first transition series. (Most $ E^{\\ominus}(\\ce{M^{2+}/M}) $ values are negative, the chief exception being copper, whose positive value makes $\\ce{Cu^{2+}}$ unable to liberate $\\ce{H2}$ from acids.)',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-21',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.21',
      prompt:
        'How would you account for the following:\n\n(i) Of the $d^4$ species, $\\ce{Cr^{2+}}$ is strongly reducing while manganese(III) is strongly oxidising.\n\n(ii) Cobalt(II) is stable in aqueous solution but in the presence of complexing reagents it is easily oxidised.\n\n(iii) The $d^1$ configuration is very unstable in ions.',
      solution:
        '**(i)** Both $\\ce{Cr^{2+}}$ and $\\ce{Mn^{3+}}$ are $ d^4 $. \n' +
        '$\\ce{Cr^{2+}}$ ($ d^4 $) is **strongly reducing** because, on losing one electron, it becomes $\\ce{Cr^{3+}}$ ($ d^3 $) — a configuration with extra stability ($ t_{2g}^3 $, large negative CFSE in water). So $\\ce{Cr^{2+}}$ readily gives up an electron.\n' +
        '$\\ce{Mn^{3+}}$ ($ d^4 $) is **strongly oxidising** because, on gaining one electron, it becomes $\\ce{Mn^{2+}}$ ($ d^5 $) — the extra-stable half-filled configuration. So $\\ce{Mn^{3+}}$ readily accepts an electron.\n\n' +
        '**(ii)** In aqueous solution $\\ce{Co^{2+}}$ is stable, but many ligands ("complexing reagents") create a **strong ligand field** that greatly stabilises the $ \\ce{Co^{3+}} $ ($ d^6 $, low-spin $ t_{2g}^6 $) state. The large crystal-field stabilisation of low-spin $\\ce{Co^{3+}}$ in such complexes makes $\\ce{Co^{2+}}$ **easily oxidised** to $\\ce{Co^{3+}}$ in their presence.\n\n' +
        '**(iii)** A $ d^1 $ ion has only one $ d $ electron and no half-/fully-filled stability; it is readily oxidised (loses that electron to reach the stable $ d^0 $) or it disproportionates, so the **$ d^1 $ configuration is very unstable in ions** (e.g. $\\ce{Ti^{3+}}$ tends to be oxidised to $\\ce{Ti^{4+}}$, $ d^0 $).',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-22',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.22',
      prompt:
        "What is meant by 'disproportionation'? Give two examples of disproportionation reaction in aqueous solution.",
      solution:
        '**Disproportionation** is a reaction in which an element in **one intermediate oxidation state is simultaneously oxidised and reduced** — part of it goes to a higher state and part to a lower state.\n\n' +
        '**Example 1 — manganate disproportionates** (Mn $ +6 $ → $ +7 $ and $ +4 $):\n\n' +
        '$$\\ce{3MnO4^{2-} + 4H^+ -> 2MnO4^- + MnO2 + 2H2O}$$\n\n' +
        '**Example 2 — copper(I) disproportionates** in aqueous solution (Cu $ +1 $ → $ +2 $ and $ 0 $):\n\n' +
        '$$\\ce{2Cu^+ (aq) -> Cu^{2+}(aq) + Cu(s)}$$\n\n' +
        'In each case the same element ends up in both a higher and a lower oxidation state than it started in.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-23',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.23',
      prompt:
        'Which metal in the first series of transition metals exhibits +1 oxidation state most frequently and why?',
      answer: 'Copper (Cu).',
      solution:
        '**Copper** exhibits the $ +1 $ oxidation state most frequently in the first transition series.\n\n' +
        'On losing one electron, copper ($ [\\text{Ar}]3d^{10}4s^1 $) gives $\\ce{Cu^{+}}$ with a **completely filled, stable $ 3d^{10} $** configuration. This extra stability of the $ d^{10} $ arrangement makes the $ +1 $ state of copper relatively common (e.g. $\\ce{Cu2O}$, $\\ce{CuCl}$), even though $\\ce{Cu^{+}}$ disproportionates in aqueous solution.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-25',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.25',
      prompt:
        'Give examples and suggest reasons for the following features of the transition metal chemistry:\n\n(i) The lowest oxide of transition metal is basic, the highest is amphoteric/acidic.\n\n(ii) A transition metal exhibits highest oxidation state in oxides and fluorides.\n\n(iii) The highest oxidation state is exhibited in oxoanions of a metal.',
      solution:
        '**(i)** In the **lowest** oxide the metal is in a **low oxidation state**, so the M–O bonding is largely **ionic** and the oxide is **basic** (e.g. $\\ce{MnO}$, Mn $ +2 $, is basic). In the **highest** oxide the metal is in a **high oxidation state**; the bonding becomes more **covalent** and the oxide is **acidic/amphoteric** (e.g. $\\ce{Mn2O7}$, Mn $ +7 $, is acidic; $\\ce{CrO3}$ is acidic). As the oxidation number rises, **ionic character decreases and covalent (acidic) character increases.**\n\n' +
        '**(ii)** A transition metal shows its **highest oxidation state in combination with oxygen and fluorine** because these are the **most electronegative, small** atoms and the best at stabilising high oxidation states — O can form multiple bonds and F can pack many atoms around the metal (e.g. $\\ce{Mn2O7}$, $\\ce{CrO3}$, $\\ce{OsF6}$, $\\ce{VF5}$).\n\n' +
        '**(iii)** The **highest oxidation state appears in oxoanions** (e.g. $\\ce{MnO4^-}$ with Mn $ +7 $, $\\ce{Cr2O7^{2-}}$ with Cr $ +6 $) because oxygen, being small and highly electronegative and able to form $ p\\pi$–$d\\pi $ bonds, can surround and stabilise the metal in its very highest state — better than any other ligand.',
    },
  ],

  // ──────────────────────────────────────────────────────────────────────────
  // S3 — Magnetic, colour, catalysis, interstitial, alloys & key compounds
  // 8.11, 8.12, 8.14, 8.15, 8.16, 8.18, 8.24, 8.26, 8.36, 8.38
  // ──────────────────────────────────────────────────────────────────────────
  's3-properties-compounds': [
    {
      kind: 'numerical',
      id: 'df-ncert-8-11',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.11',
      prompt:
        'Explain giving reasons:\n\n(i) Transition metals and many of their compounds show paramagnetic behaviour.\n\n(ii) The enthalpies of atomisation of the transition metals are high.\n\n(iii) The transition metals generally form coloured compounds.\n\n(iv) Transition metals and their many compounds act as good catalyst.',
      solution:
        '**(i) Paramagnetism:** transition metals and their ions usually have **unpaired $ d $ electrons**. Each unpaired electron has a magnetic moment, so the species is attracted by a magnetic field (**paramagnetic**). The more unpaired electrons, the larger the moment ($ \\mu = \\sqrt{n(n+2)} $ BM).\n\n' +
        '**(ii) High enthalpies of atomisation:** transition metals have a large number of **unpaired $ d $ (and $ s $) electrons**, which form **strong metallic (and some covalent M–M) bonds**. Breaking these strong bonds to give free atoms needs much energy, so the enthalpy of atomisation is high (maximum near the middle of the series, where the most unpaired electrons are available).\n\n' +
        '**(iii) Coloured compounds:** in transition-metal ions the $ d $ orbitals are split by ligands into two energy levels. An electron can absorb a photon of **visible light** and jump from the lower to the higher set (**$ d$–$d $ transition**). The light not absorbed is transmitted, so the compound shows the **complementary colour**. Ions with $ d^0 $ (e.g. $\\ce{Sc^{3+}}$) or $ d^{10} $ (e.g. $\\ce{Zn^{2+}}$) have no possible $ d$–$d $ transition and are colourless.\n\n' +
        '**(iv) Good catalysts:** transition metals are good catalysts because (a) they show **variable oxidation states**, so they can readily accept and donate electrons to reactants and form unstable intermediates, and (b) they provide a large **surface area with vacant $ d $ orbitals** that adsorb reactant molecules, increasing their concentration and weakening their bonds (e.g. Fe in the Haber process, $\\ce{V2O5}$ in the Contact process).',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-12',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.12',
      prompt:
        'What are interstitial compounds? Why are such compounds well known for transition metals?',
      solution:
        '**Interstitial compounds** are compounds formed when **small atoms** such as **H, C, N or B** are trapped in the **interstitial voids (holes)** of a transition-metal crystal lattice. They are usually **non-stoichiometric** (e.g. $\\ce{TiC}$, $\\ce{Mn4N}$, $\\ce{Fe3H}$, steel/cementite $\\ce{Fe3C}$) and are **not true ionic or covalent compounds**.\n\n' +
        'They are **well known for transition metals** because transition-metal lattices have **interstitial voids of the right size** to accommodate these small atoms. The trapped atoms form bonds with the metal, giving the material new properties: such compounds are typically **very hard, have high melting points, retain metallic conductivity** and are chemically rather inert. The ability to host these small atoms is a direct consequence of the metallic structures and bonding characteristic of the transition elements.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-14',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.14',
      prompt:
        'Describe the preparation of potassium dichromate from iron chromite ore. What is the effect of increasing pH on a solution of potassium dichromate?',
      solution:
        '**Preparation of $\\ce{K2Cr2O7}$ from chromite ore $\\ce{FeCr2O4}$** — three steps:\n\n' +
        '**1.** Fuse the powdered chromite ore with sodium (or potassium) carbonate in **air** to get sodium chromate:\n' +
        '$$\\ce{4FeCr2O4 + 8Na2CO3 + 7O2 -> 8Na2CrO4 + 2Fe2O3 + 8CO2}$$\n\n' +
        '**2.** Acidify the yellow sodium chromate solution; it turns **orange** sodium dichromate:\n' +
        '$$\\ce{2Na2CrO4 + 2H+ -> Na2Cr2O7 + 2Na+ + H2O}$$\n\n' +
        '**3.** Treat the sodium dichromate with **potassium chloride**; the less-soluble potassium dichromate crystallises out:\n' +
        '$$\\ce{Na2Cr2O7 + 2KCl -> K2Cr2O7 + 2NaCl}$$\n\n' +
        '**Effect of increasing pH:** chromate and dichromate exist in equilibrium that depends on pH:\n' +
        '$$\\ce{Cr2O7^{2-} + 2OH^- <=> 2CrO4^{2-} + H2O}$$\n' +
        'Increasing the pH (adding alkali) shifts the equilibrium to the **right**, converting the **orange dichromate ($\\ce{Cr2O7^{2-}}$) into the yellow chromate ($\\ce{CrO4^{2-}}$)**. (Lowering the pH / adding acid reverses it back to dichromate.) Note: the oxidation state of chromium ($ +6 $) is the **same** in both ions.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-15',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.15',
      prompt:
        'Describe the oxidising action of potassium dichromate and write the ionic equations for its reaction with:\n\n(i) iodide\n\n(ii) iron(II) solution and\n\n(iii) $\\ce{H2S}$',
      solution:
        'In acidic solution, dichromate is a strong oxidising agent; chromium is reduced from $ +6 $ to $ +3 $:\n\n' +
        '$$\\ce{Cr2O7^{2-} + 14H+ + 6e^- -> 2Cr^{3+} + 7H2O} \\qquad E^{\\ominus} = +1.33\\,\\text{V}$$\n\n' +
        '**(i) With iodide** (oxidises $\\ce{I^-}$ to $\\ce{I2}$):\n' +
        '$$\\ce{Cr2O7^{2-} + 14H+ + 6I^- -> 2Cr^{3+} + 3I2 + 7H2O}$$\n\n' +
        '**(ii) With iron(II)** (oxidises $\\ce{Fe^{2+}}$ to $\\ce{Fe^{3+}}$):\n' +
        '$$\\ce{Cr2O7^{2-} + 14H+ + 6Fe^{2+} -> 2Cr^{3+} + 6Fe^{3+} + 7H2O}$$\n\n' +
        '**(iii) With hydrogen sulphide** (oxidises $\\ce{H2S}$ to sulphur):\n' +
        '$$\\ce{Cr2O7^{2-} + 8H+ + 3H2S -> 2Cr^{3+} + 3S + 7H2O}$$',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-16',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.16',
      prompt:
        'Describe the preparation of potassium permanganate. How does the acidified permanganate solution react with (i) iron(II) ions (ii) $\\ce{SO2}$ and (iii) oxalic acid? Write the ionic equations for the reactions.',
      solution:
        '**Preparation of $\\ce{KMnO4}$ from pyrolusite ($\\ce{MnO2}$)** — two steps:\n\n' +
        '**1.** Fuse $\\ce{MnO2}$ with $\\ce{KOH}$ in air (or with an oxidant like $\\ce{KNO3}$) to give the green potassium manganate:\n' +
        '$$\\ce{2MnO2 + 4KOH + O2 -> 2K2MnO4 + 2H2O}$$\n\n' +
        '**2.** Oxidise the manganate to permanganate — electrolytically, or by disproportionation in neutral/acidic solution:\n' +
        '$$\\ce{3MnO4^{2-} + 4H+ -> 2MnO4^- + MnO2 + 2H2O}$$\n\n' +
        'In **acidic** solution $\\ce{MnO4^-}$ is reduced to $\\ce{Mn^{2+}}$ ($ +7 \\to +2 $):\n' +
        '$$\\ce{MnO4^- + 8H+ + 5e^- -> Mn^{2+} + 4H2O} \\qquad E^{\\ominus} = +1.51\\,\\text{V}$$\n\n' +
        '**(i) With iron(II):**\n' +
        '$$\\ce{MnO4^- + 8H+ + 5Fe^{2+} -> Mn^{2+} + 5Fe^{3+} + 4H2O}$$\n\n' +
        '**(ii) With $\\ce{SO2}$:**\n' +
        '$$\\ce{2MnO4^- + 5SO2 + 2H2O -> 2Mn^{2+} + 5SO4^{2-} + 4H+}$$\n\n' +
        '**(iii) With oxalic acid** ($\\ce{C2O4^{2-}}$ oxidised to $\\ce{CO2}$):\n' +
        '$$\\ce{2MnO4^- + 5C2O4^{2-} + 16H+ -> 2Mn^{2+} + 10CO2 + 8H2O}$$',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-18',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.18',
      prompt:
        'Predict which of the following will be coloured in aqueous solution? $\\ce{Ti^{3+}}$, $\\ce{V^{3+}}$, $\\ce{Cu^{+}}$, $\\ce{Sc^{3+}}$, $\\ce{Mn^{2+}}$, $\\ce{Fe^{3+}}$ and $\\ce{Co^{2+}}$. Give reasons for each.',
      answer:
        'Coloured: $\\ce{Ti^{3+}}$, $\\ce{V^{3+}}$, $\\ce{Mn^{2+}}$, $\\ce{Fe^{3+}}$, $\\ce{Co^{2+}}$ (all have unpaired $d$ electrons). Colourless: $\\ce{Cu^{+}}$ ($d^{10}$) and $\\ce{Sc^{3+}}$ ($d^0$).',
      solution:
        'An ion is coloured only if it can undergo a **$ d$–$d $ transition**, which requires a **partially filled $ d $ sub-shell** ($ d^1 $ to $ d^9 $). Ions with $ d^0 $ or $ d^{10} $ are **colourless**.\n\n' +
        '- **$\\ce{Ti^{3+}}$** = $ 3d^1 $ → coloured (purple).\n' +
        '- **$\\ce{V^{3+}}$** = $ 3d^2 $ → coloured (green).\n' +
        '- **$\\ce{Cu^{+}}$** = $ 3d^{10} $ → **colourless** (no $ d$–$d $ transition).\n' +
        '- **$\\ce{Sc^{3+}}$** = $ 3d^0 $ → **colourless**.\n' +
        '- **$\\ce{Mn^{2+}}$** = $ 3d^5 $ → coloured (pale pink).\n' +
        '- **$\\ce{Fe^{3+}}$** = $ 3d^5 $ → coloured (yellow).\n' +
        '- **$\\ce{Co^{2+}}$** = $ 3d^7 $ → coloured (pink).',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-24',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.24',
      prompt:
        'Calculate the number of unpaired electrons in the following gaseous ions: $\\ce{Mn^{3+}}$, $\\ce{Cr^{3+}}$, $\\ce{V^{3+}}$ and $\\ce{Ti^{3+}}$. Which one of these is the most stable in aqueous solution?',
      answer:
        '$\\ce{Mn^{3+}}$ ($d^4$): 4 unpaired; $\\ce{Cr^{3+}}$ ($d^3$): 3; $\\ce{V^{3+}}$ ($d^2$): 2; $\\ce{Ti^{3+}}$ ($d^1$): 1. Most stable in aqueous solution: $\\ce{Cr^{3+}}$.',
      solution:
        'Count the unpaired $ 3d $ electrons:\n\n' +
        '- **$\\ce{Mn^{3+}}$** = $ 3d^4 $ → **4** unpaired electrons.\n' +
        '- **$\\ce{Cr^{3+}}$** = $ 3d^3 $ → **3** unpaired electrons.\n' +
        '- **$\\ce{V^{3+}}$** = $ 3d^2 $ → **2** unpaired electrons.\n' +
        '- **$\\ce{Ti^{3+}}$** = $ 3d^1 $ → **1** unpaired electron.\n\n' +
        '**Most stable in aqueous solution: $\\ce{Cr^{3+}}$** ($ 3d^3 $). Its half-filled $ t_{2g}^3 $ set gives the maximum **crystal-field stabilisation energy** in an octahedral aqueous environment, making $\\ce{Cr^{3+}}$ the most stable of the four.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-26',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.26',
      prompt:
        'Indicate the steps in the preparation of:\n\n(i) $\\ce{K2Cr2O7}$ from chromite ore.\n\n(ii) $\\ce{KMnO4}$ from pyrolusite ore.',
      solution:
        '**(i) $\\ce{K2Cr2O7}$ from chromite ore ($\\ce{FeCr2O4}$):**\n' +
        '1. Roast/fuse the ore with $\\ce{Na2CO3}$ in air → sodium chromate:\n' +
        '$$\\ce{4FeCr2O4 + 8Na2CO3 + 7O2 -> 8Na2CrO4 + 2Fe2O3 + 8CO2}$$\n' +
        '2. Acidify → sodium dichromate:\n' +
        '$$\\ce{2Na2CrO4 + 2H+ -> Na2Cr2O7 + 2Na+ + H2O}$$\n' +
        '3. Treat with KCl → potassium dichromate crystallises:\n' +
        '$$\\ce{Na2Cr2O7 + 2KCl -> K2Cr2O7 + 2NaCl}$$\n\n' +
        '**(ii) $\\ce{KMnO4}$ from pyrolusite ($\\ce{MnO2}$):**\n' +
        '1. Fuse $\\ce{MnO2}$ with $\\ce{KOH}$ in air (or with an oxidant) → green potassium manganate:\n' +
        '$$\\ce{2MnO2 + 4KOH + O2 -> 2K2MnO4 + 2H2O}$$\n' +
        '2. Oxidise the manganate to permanganate (electrolytic oxidation, or disproportionation in acid):\n' +
        '$$\\ce{3MnO4^{2-} + 4H+ -> 2MnO4^- + MnO2 + 2H2O}$$',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-36',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.36',
      prompt:
        'Write down the number of 3d electrons in each of the following ions: $\\ce{Ti^{2+}}$, $\\ce{V^{2+}}$, $\\ce{Cr^{2+}}$, $\\ce{Mn^{2+}}$, $\\ce{Fe^{2+}}$, $\\ce{Co^{2+}}$, $\\ce{Ni^{2+}}$ and $\\ce{Cu^{2+}}$. Indicate how would you expect the five 3d orbitals to be occupied for these hydrated ions (octahedral).',
      answer:
        '$\\ce{Ti^{2+}}\\,d^2$, $\\ce{V^{2+}}\\,d^3$, $\\ce{Cr^{2+}}\\,d^4$, $\\ce{Mn^{2+}}\\,d^5$, $\\ce{Fe^{2+}}\\,d^6$, $\\ce{Co^{2+}}\\,d^7$, $\\ce{Ni^{2+}}\\,d^8$, $\\ce{Cu^{2+}}\\,d^9$ — all high-spin in $\\ce{[M(H2O)6]^{2+}}$.',
      solution:
        'The number of $ 3d $ electrons in $\\ce{M^{2+}}$ is (group number of $d$-electrons in the atom $-$ 0), found by removing the two $ 4s $ electrons:\n\n' +
        '| Ion | $3d$ electrons |\n|---|---|\n| $\\ce{Ti^{2+}}$ | $d^2$ |\n| $\\ce{V^{2+}}$ | $d^3$ |\n| $\\ce{Cr^{2+}}$ | $d^4$ |\n| $\\ce{Mn^{2+}}$ | $d^5$ |\n| $\\ce{Fe^{2+}}$ | $d^6$ |\n| $\\ce{Co^{2+}}$ | $d^7$ |\n| $\\ce{Ni^{2+}}$ | $d^8$ |\n| $\\ce{Cu^{2+}}$ | $d^9$ |\n\n' +
        'Water is a **weak-field ligand**, so the hydrated octahedral ions $\\ce{[M(H2O)6]^{2+}}$ are **high-spin**: the $ d $ electrons first occupy all five orbitals (the lower $ t_{2g} $ and upper $ e_g $ sets) singly with parallel spins (Hund\'s rule) before any pairing. Thus the number of unpaired electrons is $ d^2\\!:2,\\; d^3\\!:3,\\; d^4\\!:4,\\; d^5\\!:5,\\; d^6\\!:4,\\; d^7\\!:3,\\; d^8\\!:2,\\; d^9\\!:1 $ (maximum unpaired at $ d^5 $, $\\ce{Mn^{2+}}$).',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-38',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.38',
      prompt:
        'What can be inferred from the magnetic moment values of the following complex species?\n\n' +
        '| Example | Magnetic Moment (BM) |\n|---|---|\n' +
        '| $\\ce{K4[Mn(CN)6]}$ | 2.2 |\n' +
        '| $\\ce{[Fe(H2O)6]^{2+}}$ | 5.3 |\n' +
        '| $\\ce{K2[MnCl4]}$ | 5.9 |',
      answer:
        '$\\ce{K4[Mn(CN)6]}$: ~1 unpaired e⁻ → low-spin $\\ce{Mn^{2+}}$ ($d^5$, strong CN⁻ field). $\\ce{[Fe(H2O)6]^{2+}}$: ~4 unpaired e⁻ → high-spin $\\ce{Fe^{2+}}$ ($d^6$). $\\ce{K2[MnCl4]}$: ~5 unpaired e⁻ → high-spin $\\ce{Mn^{2+}}$ ($d^5$).',
      solution:
        'Use the spin-only formula $ \\mu = \\sqrt{n(n+2)} $ BM and read off $ n $:\n\n' +
        '**$\\ce{K4[Mn(CN)6]}$ ($ \\mu = 2.2 $):** corresponds to $ n \\approx 1 $ unpaired electron. Here $\\ce{Mn^{2+}}$ is $ d^5 $, but $\\ce{CN^-}$ is a **strong-field ligand**, so the complex is **low-spin** ($ t_{2g}^5 $) with only **1 unpaired electron**.\n\n' +
        '**$\\ce{[Fe(H2O)6]^{2+}}$ ($ \\mu = 5.3 $):** corresponds to $ n \\approx 4 $ unpaired electrons. $\\ce{Fe^{2+}}$ is $ d^6 $; $\\ce{H2O}$ is a **weak-field ligand**, so it is **high-spin** with **4 unpaired electrons** ($ \\sqrt{4\\times6} = 4.9 $ BM, close to 5.3).\n\n' +
        '**$\\ce{K2[MnCl4]}$ ($ \\mu = 5.9 $):** corresponds to $ n = 5 $ unpaired electrons. $\\ce{Mn^{2+}}$ is $ d^5 $; $\\ce{Cl^-}$ is a **weak-field ligand**, so it is **high-spin** with all **5 electrons unpaired** ($ \\sqrt{5\\times7} = 5.92 $ BM).\n\n' +
        '**Inference:** the magnetic moment reveals the number of unpaired electrons, and hence whether the complex is high-spin (weak-field ligand) or low-spin (strong-field ligand).',
    },
  ],

  // ──────────────────────────────────────────────────────────────────────────
  // S4 — The lanthanoids & lanthanoid contraction
  // 8.7, 8.10, 8.27, 8.31, 8.32
  // ──────────────────────────────────────────────────────────────────────────
  's4-lanthanoids': [
    {
      kind: 'numerical',
      id: 'df-ncert-8-7',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.7',
      prompt:
        'What is lanthanoid contraction? What are the consequences of lanthanoid contraction?',
      solution:
        '**Lanthanoid contraction** is the **steady decrease in the atomic and ionic radii** of the lanthanoid elements (from La to Lu) with increasing atomic number. As the nuclear charge rises across the series, each extra electron enters the inner **$ 4f $ sub-shell**; the $ 4f $ electrons **shield the outer electrons very poorly**, so the effective nuclear charge felt by the outer electrons increases and the size contracts gradually.\n\n' +
        '**Consequences:**\n' +
        '- The **second- and third-row transition elements** of a given group have **almost identical radii** (e.g. Zr ≈ Hf, Nb ≈ Ta), so they have very similar properties and are difficult to separate.\n' +
        '- It causes a **regular gradation in properties** of the lanthanoids, which (together with their very similar chemistry) makes their **separation difficult**.\n' +
        '- The **basic strength of the hydroxides $\\ce{M(OH)3}$ decreases** from La to Lu (as size decreases, covalent character increases).\n' +
        '- It affects the formation of complexes and the densities of the third transition series (which are high).',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-10',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.10',
      prompt:
        'What are the different oxidation states exhibited by the lanthanoids?',
      solution:
        'The **most common and stable oxidation state of all lanthanoids is $ +3 $** ($\\ce{Ln^{3+}}$), which is shown by every member of the series.\n\n' +
        'In addition, a few lanthanoids show $ +2 $ or $ +4 $ states when these lead to a stable empty, half-filled or fully-filled $ 4f $ configuration:\n' +
        '- **$ +4 $:** e.g. **$\\ce{Ce^{4+}}$** ($ 4f^0 $) and $\\ce{Tb^{4+}}$ ($ 4f^7 $). $\\ce{Ce^{4+}}$ is a good oxidising agent.\n' +
        '- **$ +2 $:** e.g. **$\\ce{Eu^{2+}}$** ($ 4f^7 $) and $\\ce{Yb^{2+}}$ ($ 4f^{14} $). These are good reducing agents.\n\n' +
        'So although $ +2 $ and $ +4 $ occur occasionally (favoured by $ f^0 $, $ f^7 $, $ f^{14} $), the **predominant oxidation state is $ +3 $**.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-27',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.27',
      prompt:
        'What are alloys? Name an important alloy which contains some of the lanthanoid metals. Mention its uses.',
      solution:
        'An **alloy** is a **homogeneous solid mixture (solid solution) of two or more metals**, or of a metal with one or more other elements, having metallic properties. Transition and lanthanoid metals form alloys readily because their atoms are of similar size and can replace one another in the crystal lattice.\n\n' +
        'An important alloy containing lanthanoid metals is **mischmetal**, which consists of about **95% lanthanoid metals** (mainly cerium, with lanthanum, neodymium, etc.) and about **5% iron**, together with traces of S, C, Ca and Al.\n\n' +
        '**Uses of mischmetal:** it is used in **Mg-based alloys to produce bullets, shells and lighter flints** (as a pyrophoric "flint" that sparks), and as an additive to improve the properties of steel and other alloys.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-31',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.31',
      prompt:
        "Use Hund's rule to derive the electronic configuration of $\\ce{Ce^{3+}}$ ion, and calculate its magnetic moment on the basis of 'spin-only' formula.",
      answer:
        '$\\ce{Ce^{3+}} = [\\text{Xe}]4f^1$ (1 unpaired electron); $\\mu = \\sqrt{1(1+2)} = \\sqrt{3} \\approx 1.73$ BM.',
      solution:
        'Cerium (Z = 58) has the configuration $ [\\text{Xe}]4f^1 5d^1 6s^2 $. To form $\\ce{Ce^{3+}}$, remove **three electrons** ($ 6s^2 $ and $ 5d^1 $), leaving:\n\n' +
        '$$\\ce{Ce^{3+}} = [\\text{Xe}]4f^1$$\n\n' +
        'By Hund\'s rule this single $ 4f $ electron is **unpaired**, so $ n = 1 $.\n\n' +
        'Spin-only magnetic moment:\n' +
        '$$\\mu = \\sqrt{n(n+2)} = \\sqrt{1(1+2)} = \\sqrt{3} \\approx 1.73\\ \\text{BM}$$\n\n' +
        '*(Note: in practice the observed moment of $\\ce{Ce^{3+}}$ is higher (~2.4 BM) because, for lanthanoids, the orbital angular momentum of the $ 4f $ electron also contributes; but the spin-only value asked for here is **1.73 BM**.)*',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-32',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.32',
      prompt:
        'Name the members of the lanthanoid series which exhibit +4 oxidation states and those which exhibit +2 oxidation states. Try to correlate this type of behaviour with the electronic configurations of these elements.',
      answer:
        '+4: Ce, Pr, Tb (and Dy/Nd in some compounds) — favoured towards $4f^0$/$4f^7$. +2: Eu, Yb (and Sm/Tm) — favoured towards $4f^7$/$4f^{14}$.',
      solution:
        'These extra oxidation states appear when they lead to a **stable empty ($ f^0 $), half-filled ($ f^7 $) or completely filled ($ f^{14} $)** $ 4f $ configuration.\n\n' +
        '**Exhibit $ +4 $:** **Ce, Pr, Tb** (and Nd, Dy in a few compounds).\n' +
        '- $\\ce{Ce^{4+}}$ → $ 4f^0 $ (empty, very stable; a good oxidant).\n' +
        '- $\\ce{Tb^{4+}}$ → $ 4f^7 $ (half-filled, stable).\n\n' +
        '**Exhibit $ +2 $:** **Eu, Yb** (and Sm, Tm in a few compounds).\n' +
        '- $\\ce{Eu^{2+}}$ → $ 4f^7 $ (half-filled, stable; a good reductant).\n' +
        '- $\\ce{Yb^{2+}}$ → $ 4f^{14} $ (completely filled, stable).\n\n' +
        'In every case the favoured ion is the one whose $ 4f $ sub-shell becomes empty, half-filled or full — confirming that **electronic stability ($ f^0, f^7, f^{14} $)** controls which non-$(+3)$ states appear.\n\n' +
        '*(⚠ verify: NCERT\'s core named members are Ce/Tb for $+4$ and Eu/Yb for $+2$; Pr, Nd, Dy, Sm, Tm appear in extended lists. Quote the $f^0$/$f^7$/$f^{14}$ reasoning, which is the marking point.)*',
    },
  ],

  // ──────────────────────────────────────────────────────────────────────────
  // S5 — The actinoids & comparison with lanthanoids
  // 8.20, 8.28, 8.29, 8.30, 8.33
  // ──────────────────────────────────────────────────────────────────────────
  's5-actinoids': [
    {
      kind: 'numerical',
      id: 'df-ncert-8-20',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.20',
      prompt:
        'Compare the chemistry of actinoids with that of the lanthanoids with special reference to:\n\n(i) electronic configuration\n\n(ii) atomic and ionic sizes and\n\n(iii) oxidation state\n\n(iv) chemical reactivity.',
      solution:
        '**(i) Electronic configuration:** Lanthanoids progressively fill the **$ 4f $** sub-shell (general $ 4f^{1-14}\\,5d^{0-1}\\,6s^2 $); actinoids progressively fill the **$ 5f $** sub-shell (general $ 5f^{1-14}\\,6d^{0-1}\\,7s^2 $). The $ 5f $ orbitals are less buried (more "available") than the $ 4f $.\n\n' +
        '**(ii) Atomic and ionic sizes:** Both show a contraction with increasing atomic number — the **lanthanoid contraction** and the **actinoid contraction**. The actinoid contraction is **greater from element to element** because the $ 5f $ electrons shield even more poorly than the $ 4f $ electrons.\n\n' +
        '**(iii) Oxidation states:** Lanthanoids show a **predominant $ +3 $** state (with occasional $ +2 $, $ +4 $). Actinoids show $ +3 $ as well, but a **much greater range of oxidation states** (e.g. up to $ +7 $, as in Np, Pu), because the $ 5f $, $ 6d $ and $ 7s $ levels are close in energy.\n\n' +
        '**(iv) Chemical reactivity:** Both are **highly reactive** electropositive metals, especially when finely divided. Actinoid chemistry is **more complicated**, partly because most actinoids are **radioactive** and show many oxidation states, making them harder to study than the lanthanoids.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-28',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.28',
      prompt:
        'What are inner transition elements? Decide which of the following atomic numbers are the atomic numbers of the inner transition elements: 29, 59, 74, 95, 102, 104.',
      answer:
        'Inner transition elements = the f-block (lanthanoids + actinoids). Among the list: 59 (Pr), 95 (Am) and 102 (No) are inner transition elements.',
      solution:
        '**Inner transition elements** are the elements in which the **last electron enters the $ (n-2)f $ sub-shell** — i.e. the **$ f $-block**: the **lanthanoids** (Z = 58–71, filling $ 4f $) and the **actinoids** (Z = 90–103, filling $ 5f $).\n\n' +
        'Checking the given atomic numbers:\n' +
        '- **29 (Cu)** — $ d $-block (transition), **not** inner transition.\n' +
        '- **59 (Pr, praseodymium)** — lanthanoid → **inner transition.** ✔\n' +
        '- **74 (W)** — $ d $-block (transition), **not** inner transition.\n' +
        '- **95 (Am, americium)** — actinoid → **inner transition.** ✔\n' +
        '- **102 (No, nobelium)** — actinoid → **inner transition.** ✔\n' +
        '- **104 (Rf)** — $ d $-block (transactinide, transition), **not** inner transition.\n\n' +
        'So **59, 95 and 102** are the inner transition elements in the list.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-29',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.29',
      prompt:
        'The chemistry of the actinoid elements is not so smooth as that of the lanthanoids. Justify this statement by giving some examples from the oxidation state of these elements.',
      solution:
        'The lanthanoids show a **fairly smooth, regular chemistry** dominated by the single $ +3 $ oxidation state, with only occasional $ +2 $ or $ +4 $. The actinoids, by contrast, show a **much wider and more irregular range of oxidation states**, so their chemistry is "not so smooth".\n\n' +
        '**Examples (actinoid oxidation states):**\n' +
        '- **Uranium:** $ +3, +4, +5, +6 $.\n' +
        '- **Neptunium:** $ +3, +4, +5, +6, +7 $.\n' +
        '- **Plutonium:** $ +3, +4, +5, +6, +7 $.\n' +
        '- **Americium:** $ +2, +3, +4, +5, +6 $.\n\n' +
        'This variety arises because in the actinoids the **$ 5f $, $ 6d $ and $ 7s $ orbitals are very close in energy**, so several electrons can take part in bonding. Combined with the fact that the actinoids are **radioactive**, this makes their chemistry far less regular than that of the lanthanoids.',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-30',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.30',
      prompt:
        'Which is the last element in the series of the actinoids? Write the electronic configuration of this element. Comment on the possible oxidation state of this element.',
      answer:
        'Lawrencium, Lr (Z = 103); $[\\text{Rn}]5f^{14}6d^1 7s^2$; common oxidation state $+3$.',
      solution:
        'The **last element of the actinoid series is lawrencium (Lr), atomic number 103**.\n\n' +
        'Its electronic configuration is:\n' +
        '$$\\ce{Lr} = [\\text{Rn}]\\,5f^{14}\\,6d^1\\,7s^2$$\n\n' +
        '**Possible oxidation state:** because the $ 5f $ sub-shell is completely filled ($ 5f^{14} $) and only the $ 6d^1 7s^2 $ electrons are available for bonding, lawrencium shows the stable **$ +3 $** oxidation state (like the other heavy actinoids).\n\n' +
        '*(⚠ verify: some modern references give the Lr ground state as $[\\text{Rn}]5f^{14}7s^2 7p^1$; NCERT prints $[\\text{Rn}]5f^{14}6d^1 7s^2$, which is the answer expected here. The load-bearing points — last actinoid, Z = 103, $+3$ state — are unaffected.)*',
    },
    {
      kind: 'numerical',
      id: 'df-ncert-8-33',
      source: 'ncert_exercise',
      source_label: 'NCERT 8.33',
      prompt:
        'Compare the chemistry of the actinoids with that of lanthanoids with reference to:\n\n(i) electronic configuration\n\n(ii) oxidation states and\n\n(iii) chemical reactivity.',
      solution:
        '**(i) Electronic configuration:** In **lanthanoids** the differentiating electron enters the **$ 4f $** sub-shell (general $ 4f^{1-14}\\,5d^{0-1}\\,6s^2 $); in **actinoids** it enters the **$ 5f $** sub-shell (general $ 5f^{1-14}\\,6d^{0-1}\\,7s^2 $). The $ 5f $ orbitals extend further out and are more available for bonding than the buried $ 4f $.\n\n' +
        '**(ii) Oxidation states:** Lanthanoids are dominated by the **$ +3 $** state (occasional $ +2 $, $ +4 $). Actinoids also show $ +3 $, but exhibit a **much greater variety of oxidation states** (up to $ +7 $, e.g. in Np and Pu), because the $ 5f $, $ 6d $ and $ 7s $ levels are comparable in energy.\n\n' +
        '**(iii) Chemical reactivity:** **Both** series consist of **highly reactive, electropositive metals** (very reactive when finely divided). However, the actinoids are **radioactive** and have more complex, variable chemistry, so they are harder to handle and study than the lanthanoids; the early actinoids in particular resemble transition metals more than the lanthanoids do.',
    },
  ],
};
