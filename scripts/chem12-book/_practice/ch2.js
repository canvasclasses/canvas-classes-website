module.exports = {
  slug: 'ch2-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 18 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: '909a53b9-1640-4de7-a906-aceb2852b5b5',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A hand-drawn illustration of a galvanic cell with two beakers connected by a salt bridge, electrodes, and a voltmeter, on a dark charcoal background',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'Hand-drawn coloured illustration, deep-charcoal near-black background, muted earthy palette (ochre, terracotta, teal, sage green, indigo, cream), no glow or neon or orange-haze, no 3D-render look, flat textured brush strokes like a chemistry teacher\'s notebook sketch. Scene: two glass beakers side by side, left one in teal liquid with a zinc strip electrode, right one in cream/ochre liquid with a copper or silver strip electrode, joined by a U-shaped salt bridge drawn as a simple curved tube, a thin wire connecting the two electrodes over the top with a small circular voltmeter dial in the middle showing a needle, and a few small dotted arrows suggesting ions and electrons drifting between the beakers. A couple of clean hand-lettered small labels like "e⁻", "+", "−" scattered subtly near the wires. Wide horizontal banner composition, calm and studious mood, no text/title, no glow effects.',
    },
    {
      id: 'e12e06bb-ab16-4cd9-9c52-002c92cd6ca9',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are all 18 NCERT exercises for this unit, regrouped from the textbook's running order into four revision themes: galvanic cells, EMF and Gibbs energy; conductivity and molar conductivity; electrolysis and Faraday's laws; and feasibility checks with electrolysis products. Work through a theme at a time, try the question yourself before reading the solution, and use the one-line answer to check yourself fast. This chapter has no official NCERT answer key for these exercises, so every numerical answer here has been worked out and re-checked from scratch — that's exactly why the full working matters more than usual.",
    },
    {
      id: '252ebd6b-51a5-4812-979d-d6e49e25eb58',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 3.1–3.18',
      intro:
        "Same numbering as your textbook (Unit 3, Electrochemistry), just reorganised so related ideas sit together. Every solution is worked out in full — don't just read the final number, follow how it was reached.",
      sections: [
        {
          id: 'a8a43c87-b4be-45fb-9738-29f2da19c51c',
          title: 'Galvanic cells, EMF & Gibbs energy',
          blurb:
            'Reading and drawing cell diagrams, ranking metals by reducing power, and turning a standard cell potential into ΔrG° and an equilibrium constant.',
          items: [
            {
              kind: 'numerical',
              id: 'f32ced41-304f-4b1d-b362-a9fd1f8631d1',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.1',
              prompt:
                'Arrange the following metals in the order in which they displace each other from the solution of their salts.\n$\\ce{Al, Cu, Fe, Mg}$ and $\\ce{Zn}$.',
              answer: '$\\ce{Mg > Al > Zn > Fe > Cu}$',
              solution:
                "**A metal displaces another metal from its salt solution only if it is a stronger reducing agent** — that is, if it loses electrons more readily than the metal already in solution. The standard electrode (reduction) potentials tell you exactly this: the more negative the $E^\\circ$, the stronger the metal is as a reducing agent, and the higher up the displacement series it sits.\n\n**The standard reduction potentials for these five metals:**\n$\\ce{Mg^2+/Mg} = -2.36\\ \\text{V}$, $\\ce{Al^3+/Al} = -1.66\\ \\text{V}$, $\\ce{Zn^2+/Zn} = -0.76\\ \\text{V}$, $\\ce{Fe^2+/Fe} = -0.44\\ \\text{V}$, $\\ce{Cu^2+/Cu} = +0.34\\ \\text{V}$\n\n**Order the metals from most negative (strongest reducing agent, top of the series) to most positive (weakest reducing agent):**\n\n$\\ce{Mg > Al > Zn > Fe > Cu}$\n\nThis means $\\ce{Mg}$ can displace all four of the others from their salt solutions, $\\ce{Al}$ can displace $\\ce{Zn, Fe, Cu}$ but not $\\ce{Mg}$, and so on down the line — $\\ce{Cu}$, sitting at the bottom, cannot displace any of the other four.\n\n**Where students get stuck:** confusing 'displacing power' with 'being displaced' — the metal with the *more negative* electrode potential is the one that displaces the *other* out of solution (it gets oxidised, going into solution as the ion, while the other metal ion gets reduced and deposits out as solid metal).",
            },
            {
              kind: 'numerical',
              id: '0fda828d-810f-4451-b216-48f041da8d0a',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.2',
              prompt:
                'Given the standard electrode potentials,\n$\\ce{K+/K} = -2.93\\ \\text{V}$, $\\ce{Ag+/Ag} = 0.80\\ \\text{V}$,\n$\\ce{Hg^2+/Hg} = 0.79\\ \\text{V}$\n$\\ce{Mg^2+/Mg} = -2.37\\ \\text{V}$, $\\ce{Cr^3+/Cr} = -0.74\\ \\text{V}$\nArrange these metals in their increasing order of reducing power.',
              answer: '$\\ce{Ag < Hg < Cr < Mg < K}$',
              solution:
                "**Reducing power increases as the electrode (reduction) potential becomes more negative.** A metal with a very negative $E^\\circ$ gives up electrons very readily — that's exactly what a strong reducing agent does. So 'increasing order of reducing power' just means: list the metals from the most positive $E^\\circ$ (weakest reducing agent) up to the most negative $E^\\circ$ (strongest reducing agent).\n\n**List the given values in increasing numerical order (most positive first):**\n\n$\\ce{Ag+/Ag} = +0.80\\ \\text{V}$ (highest) $\\to$ $\\ce{Hg^2+/Hg} = +0.79\\ \\text{V}$ $\\to$ $\\ce{Cr^3+/Cr} = -0.74\\ \\text{V}$ $\\to$ $\\ce{Mg^2+/Mg} = -2.37\\ \\text{V}$ $\\to$ $\\ce{K+/K} = -2.93\\ \\text{V}$ (lowest)\n\n**So the increasing order of reducing power is:**\n\n$\\ce{Ag < Hg < Cr < Mg < K}$\n\n$\\ce{Ag}$ is the weakest reducing agent here (it would much rather stay as solid $\\ce{Ag}$ or be the ion that gets reduced), while $\\ce{K}$ is the strongest — it desperately wants to lose its electron and become $\\ce{K+}$.\n\n**Where students get stuck:** reading 'reducing power' and reflexively ordering by $E^\\circ$ from most negative to most positive (that would be *decreasing* order) — always re-read whether the question wants increasing or decreasing, and remember more negative $E^\\circ$ = stronger reducing agent, always.",
            },
            {
              kind: 'numerical',
              id: 'a3197775-dfb7-4efe-9019-8451e61c496a',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.3',
              prompt:
                'Depict the galvanic cell in which the reaction $\\ce{Zn(s) + 2Ag+(aq) -> Zn^2+(aq) + 2Ag(s)}$ takes place. Further show:\n(i) Which of the electrode is negatively charged?\n(ii) The carriers of the current in the cell.\n(iii) Individual reaction at each electrode.',
              answer:
                '$\\ce{Zn(s) | Zn^2+(aq) || Ag+(aq) | Ag(s)}$; (i) Zn electrode; (ii) ions in solution, electrons in the external wire; (iii) anode: $\\ce{Zn -> Zn^2+ + 2e-}$, cathode: $\\ce{2Ag+ + 2e- -> 2Ag}$',
              solution:
                "**First split the overall reaction into its two half-reactions** to see which species is oxidised (loses electrons, at the anode) and which is reduced (gains electrons, at the cathode).\n\n$\\ce{Zn(s) -> Zn^2+(aq) + 2e-}$ — zinc metal loses electrons, so this is **oxidation**, and it happens at the **anode**.\n\n$\\ce{2Ag+(aq) + 2e- -> 2Ag(s)}$ — silver ions gain electrons, so this is **reduction**, and it happens at the **cathode**.\n\n**Cell diagram convention: anode (oxidation) on the left, cathode (reduction) on the right, single bar for a phase boundary, double bar for the salt bridge:**\n\n$\\text{Zn(s)}\\ |\\ \\ce{Zn^2+(aq)}\\ ||\\ \\ce{Ag+(aq)}\\ |\\ \\text{Ag(s)}$\n\n**(i) Which electrode is negative?** In a galvanic cell, the anode is where electrons are *produced* (by oxidation) and then pushed out into the external circuit — so the anode is the **negative electrode**. Here that's the **zinc electrode**. (Careful: this is opposite to the convention in an electrolytic cell, where the cathode is negative — always re-derive it from which reaction is oxidation vs reduction rather than memorising 'anode = negative' blindly across cell types.)\n\n**(ii) Current carriers.** Inside the solution and the salt bridge, current is carried by the **movement of ions** — $\\ce{Zn^2+}$ and $\\ce{NO3-}$ (or whatever the salt-bridge ions are) drifting to maintain charge balance. In the external wire connecting the two electrodes, current is carried by the **flow of electrons**, moving from the zinc electrode (anode) to the silver electrode (cathode).\n\n**(iii) Individual electrode reactions:**\n\nAnode (oxidation): $\\ce{Zn(s) -> Zn^2+(aq) + 2e-}$\n\nCathode (reduction): $\\ce{2Ag+(aq) + 2e- -> 2Ag(s)}$\n\n**Where students get stuck:** mixing up which electrode is 'negative' between galvanic and electrolytic cells — in a galvanic cell the anode is negative (it's the source of electrons), while in an electrolytic cell the anode is positive (it's connected to the positive terminal of the external battery, which pulls electrons away). Always work it out from first principles for the cell type you're given.",
            },
            {
              kind: 'numerical',
              id: '507d4414-1bd5-4288-86b0-090e66e77295',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.4',
              prompt:
                'Calculate the standard cell potentials of galvanic cell in which the following reactions take place:\n(i) $\\ce{2Cr(s) + 3Cd^2+(aq) -> 2Cr^3+(aq) + 3Cd}$\n(ii) $\\ce{Fe^2+(aq) + Ag+(aq) -> Fe^3+(aq) + Ag(s)}$\nCalculate the $\\Delta_r G^\\circ$ and equilibrium constant of the reactions.',
              answer:
                '(i) $E^\\circ_{cell} = 0.34\\ \\text{V}$, $\\Delta_rG^\\circ \\approx -196.9\\ \\text{kJ/mol}$, $K \\approx 3.3\\times 10^{34}$; (ii) $E^\\circ_{cell} = 0.03\\ \\text{V}$, $\\Delta_rG^\\circ \\approx -2.9\\ \\text{kJ/mol}$, $K \\approx 3.2$',
              solution:
                "**General method for all of these: find $E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode}$ (both as reduction potentials), then $\\Delta_rG^\\circ = -nFE^\\circ_{cell}$, then get $K$ from $\\Delta_rG^\\circ = -RT\\ln K$, or equivalently $\\log K = \\dfrac{nE^\\circ_{cell}}{0.0591}$ at 298 K.**\n\n**(i) $\\ce{2Cr(s) + 3Cd^2+(aq) -> 2Cr^3+(aq) + 3Cd(s)}$**\n\nChromium is oxidised (anode): $E^\\circ(\\ce{Cr^3+/Cr}) = -0.74\\ \\text{V}$\nCadmium is reduced (cathode): $E^\\circ(\\ce{Cd^2+/Cd}) = -0.40\\ \\text{V}$\n\n$E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode} = -0.40 - (-0.74) = 0.34\\ \\text{V}$\n\n**Electrons transferred, $n$:** each $\\ce{Cr}$ loses 3 electrons, and there are 2 Cr, so $n = 6$ (matches: each $\\ce{Cd^2+}$ gains 2 electrons, and there are 3 Cd, also $n=6$).\n\n$\\Delta_rG^\\circ = -nFE^\\circ_{cell} = -(6)(96500\\ \\text{C mol}^{-1})(0.34\\ \\text{V}) = -196{,}860\\ \\text{J mol}^{-1} \\approx -196.9\\ \\text{kJ mol}^{-1}$\n\n$\\log K = \\dfrac{nE^\\circ_{cell}}{0.0591} = \\dfrac{6\\times 0.34}{0.0591} = \\dfrac{2.04}{0.0591} = 34.5$\n\n$K = 10^{34.5} \\approx 3.3\\times 10^{34}$\n\n**(ii) $\\ce{Fe^2+(aq) + Ag+(aq) -> Fe^3+(aq) + Ag(s)}$**\n\n$\\ce{Fe^2+}$ is oxidised to $\\ce{Fe^3+}$ (anode): $E^\\circ(\\ce{Fe^3+/Fe^2+}) = 0.77\\ \\text{V}$\n$\\ce{Ag+}$ is reduced (cathode): $E^\\circ(\\ce{Ag+/Ag}) = 0.80\\ \\text{V}$\n\n$E^\\circ_{cell} = 0.80 - 0.77 = 0.03\\ \\text{V}$\n\n$n = 1$ (one electron per formula unit on each side)\n\n$\\Delta_rG^\\circ = -(1)(96500)(0.03) = -2895\\ \\text{J mol}^{-1} \\approx -2.9\\ \\text{kJ mol}^{-1}$\n\n$\\log K = \\dfrac{1\\times 0.03}{0.0591} = 0.508$\n\n$K = 10^{0.508} \\approx 3.2$\n\n**Where students get stuck:** using the wrong electrode as 'anode' vs 'cathode' when the reaction is already given fully written out — always identify which species loses electrons (goes up in oxidation number) in the given equation itself, rather than assuming the metal on the left is always the anode. Also, forgetting to include $n$ (the actual number of electrons transferred in the balanced equation, not just '1' by default) in both the $\\Delta_rG^\\circ$ and $\\log K$ formulas — a very common slip in part (i), where $n=6$, not $n=1$.",
            },
            {
              kind: 'numerical',
              id: '5d343e9d-e68e-4d69-b202-24c00710d859',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.5',
              prompt:
                'Write the Nernst equation and emf of the following cells at 298 K:\n(i) $\\ce{Mg(s)| Mg^2+(0.001M) || Cu^2+(0.0001 M)| Cu(s)}$\n(ii) $\\ce{Fe(s)| Fe^2+(0.001M) || H+(1M)| H2(g)(1bar)| Pt(s)}$\n(iii) $\\ce{Sn(s)| Sn^2+(0.050 M) || H+(0.020 M)| H2(g) (1 bar)| Pt(s)}$\n(iv) $\\ce{Pt(s)| Br2(l)| Br-(0.010 M) || H+(0.030 M)| H2(g) (1 bar)| Pt(s)}$.',
              answer:
                '(i) $E_{cell} \\approx 2.67\\ \\text{V}$; (ii) $E_{cell} \\approx 0.529\\ \\text{V}$; (iii) $E_{cell} \\approx 0.078\\ \\text{V}$; (iv) $E_{cell} \\approx -1.062\\ \\text{V}$',
              solution:
                "**Every part uses the same tool: the Nernst equation** $E_{cell} = E^\\circ_{cell} - \\dfrac{0.0591}{n}\\log Q$ **at 298 K**, where $Q$ is written from the overall balanced cell reaction (products over reactants, each raised to its stoichiometric coefficient, pure solids/liquids left out, gas pressures used as-is).\n\n**(i) $\\ce{Mg(s)| Mg^2+(0.001M) || Cu^2+(0.0001 M)| Cu(s)}$**\n\nCell reaction: $\\ce{Mg(s) + Cu^2+(aq) -> Mg^2+(aq) + Cu(s)}$, $n=2$\n$E^\\circ_{cell} = E^\\circ(\\ce{Cu^2+/Cu}) - E^\\circ(\\ce{Mg^2+/Mg}) = 0.34 - (-2.36) = 2.70\\ \\text{V}$\n$Q = \\dfrac{[\\ce{Mg^2+}]}{[\\ce{Cu^2+}]} = \\dfrac{0.001}{0.0001} = 10$\n$E_{cell} = 2.70 - \\dfrac{0.0591}{2}\\log(10) = 2.70 - 0.0296 = 2.67\\ \\text{V}$\n\n**(ii) $\\ce{Fe(s)| Fe^2+(0.001M) || H+(1M)| H2(g)(1bar)| Pt(s)}$**\n\nCell reaction: $\\ce{Fe(s) + 2H+(aq) -> Fe^2+(aq) + H2(g)}$, $n=2$\n$E^\\circ_{cell} = E^\\circ(\\ce{H+/H2}) - E^\\circ(\\ce{Fe^2+/Fe}) = 0 - (-0.44) = 0.44\\ \\text{V}$\n$Q = \\dfrac{[\\ce{Fe^2+}]\\, p_{H2}}{[\\ce{H+}]^2} = \\dfrac{0.001\\times 1}{1^2} = 0.001$\n$E_{cell} = 0.44 - \\dfrac{0.0591}{2}\\log(0.001) = 0.44 - (0.02955)(-3) = 0.44 + 0.0887 = 0.529\\ \\text{V}$\n\n**(iii) $\\ce{Sn(s)| Sn^2+(0.050 M) || H+(0.020 M)| H2(g) (1 bar)| Pt(s)}$**\n\nCell reaction: $\\ce{Sn(s) + 2H+(aq) -> Sn^2+(aq) + H2(g)}$, $n=2$\n$E^\\circ_{cell} = 0 - (-0.14) = 0.14\\ \\text{V}$\n$Q = \\dfrac{[\\ce{Sn^2+}]\\, p_{H2}}{[\\ce{H+}]^2} = \\dfrac{0.050\\times 1}{(0.020)^2} = \\dfrac{0.050}{0.0004} = 125$\n$E_{cell} = 0.14 - \\dfrac{0.0591}{2}\\log(125) = 0.14 - (0.02955)(2.097) = 0.14 - 0.0620 = 0.078\\ \\text{V}$\n\n**(iv) $\\ce{Pt(s)| Br2(l)| Br-(0.010 M) || H+(0.030 M)| H2(g) (1 bar)| Pt(s)}$**\n\nHere the left side is written as the anode: oxidation is $\\ce{2Br-(aq) -> Br2(l) + 2e-}$, so the *reduction* potential we look up is $E^\\circ(\\ce{Br2/Br-}) = 1.09\\ \\text{V}$. The right side is the cathode: $\\ce{2H+(aq) + 2e- -> H2(g)}$, $E^\\circ(\\ce{H+/H2}) = 0\\ \\text{V}$.\n\nOverall reaction: $\\ce{2Br-(aq) + 2H+(aq) -> Br2(l) + H2(g)}$, $n=2$\n$E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode} = 0 - 1.09 = -1.09\\ \\text{V}$\n\n$Q = \\dfrac{[\\ce{Br-}]^2}{[\\ce{H+}]^2}$ (pure liquid $\\ce{Br2}$ and gas at 1 bar $\\ce{H2}$ are both taken as unit activity) $= \\dfrac{(0.010)^2}{(0.030)^2} = \\dfrac{0.0001}{0.0009} = 0.111$\n\n$E_{cell} = -1.09 - \\dfrac{0.0591}{2}\\log(0.111) = -1.09 - (0.02955)(-0.954) = -1.09 + 0.0282 = -1.062\\ \\text{V}$\n\nThe negative $E_{cell}$ here simply says this particular cell reaction, as written, is non-spontaneous under these conditions — that's a perfectly valid and expected outcome of the calculation, not a sign of an error.\n\n**Where students get stuck:** forgetting that pure solids and pure liquids (like $\\ce{Br2(l)}$ here, or the metal electrodes in the other parts) never appear in $Q$ — only ions in solution and gases (using their pressure) do. Also, in part (iv), not noticing which side is written as anode vs cathode from the cell-diagram convention itself, since the reaction there runs 'backwards' compared to the other three parts.",
            },
            {
              kind: 'numerical',
              id: 'f24de285-818f-436a-88a1-1484b68c07d9',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.6',
              prompt:
                'In the button cells widely used in watches and other devices the following reaction takes place:\n$\\ce{Zn(s) + Ag2O(s) + H2O(l) -> Zn^2+(aq) + 2Ag(s) + 2OH-(aq)}$\nDetermine $\\Delta_rG^\\circ$ and $E^\\circ$ for the reaction.',
              answer: '$E^\\circ_{cell} = 1.104\\ \\text{V}$, $\\Delta_rG^\\circ \\approx -213.1\\ \\text{kJ/mol}$',
              solution:
                "**Split the reaction into its two half-reactions to find each standard electrode potential, then combine and use $\\Delta_rG^\\circ = -nFE^\\circ_{cell}$.**\n\n**Anode (oxidation):** $\\ce{Zn(s) -> Zn^2+(aq) + 2e-}$, using $E^\\circ(\\ce{Zn^2+/Zn}) = -0.76\\ \\text{V}$\n\n**Cathode (reduction):** $\\ce{Ag2O(s) + H2O(l) + 2e- -> 2Ag(s) + 2OH-(aq)}$, with the standard potential for this silver-oxide couple, $E^\\circ(\\ce{Ag2O, H2O/Ag, OH-}) = 0.344\\ \\text{V}$\n\n**Combine:**\n$E^\\circ_{cell} = E^\\circ_{cathode} - E^\\circ_{anode} = 0.344 - (-0.76) = 1.104\\ \\text{V}$\n\n**Electrons transferred:** both half-reactions involve 2 electrons, so $n=2$.\n\n$\\Delta_rG^\\circ = -nFE^\\circ_{cell} = -(2)(96500\\ \\text{C mol}^{-1})(1.104\\ \\text{V}) = -213{,}072\\ \\text{J mol}^{-1} \\approx -213.1\\ \\text{kJ mol}^{-1}$\n\n**Why this cell is used in watches:** a large negative $\\Delta_rG^\\circ$ and a comfortably positive $E^\\circ$ mean this reaction proceeds essentially to completion and delivers a steady, reliable voltage for a very long time on a tiny amount of reactant — exactly what a button cell needs.\n\n**Where students get stuck:** trying to look up $\\ce{Ag2O, H2O/Ag, OH-}$ as if it were the same as the more familiar $\\ce{Ag+/Ag}$ couple ($0.80\\ \\text{V}$) — it isn't; this is a different half-reaction (silver oxide in a basic medium, not the aquated $\\ce{Ag+}$ ion), so it carries its own separate standard potential.",
            },
          ],
        },
        {
          id: 'e15f267f-4b87-453a-9275-475761545275',
          title: 'Conductivity & molar conductivity',
          blurb:
            'Defining conductivity and molar conductivity, converting cell measurements into them, and using Kohlrausch\'s law to find limiting molar conductivity and a dissociation constant.',
          items: [
            {
              kind: 'numerical',
              id: '2fa3156a-4350-4679-810b-c6d42e23c4cb',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.7',
              prompt:
                'Define conductivity and molar conductivity for the solution of an electrolyte. Discuss their variation with concentration.',
              answer:
                'Conductivity: conductance of a $1\\ \\text{cm}$ cube of solution. Molar conductivity: conductivity per mole of electrolyte. Both fall with dilution for weak electrolytes (dissociation rises); molar conductivity rises for both strong and weak electrolytes on dilution, but for different reasons.',
              solution:
                "**Conductivity ($\\kappa$)** is the conductance of a solution of the electrolyte kept between two electrodes exactly $1\\ \\text{cm}$ apart, each of area $1\\ \\text{cm}^2$ — in other words, it is the reciprocal of the resistivity of the solution, with units $\\text{S cm}^{-1}$ (or $\\text{S m}^{-1}$ in SI). It tells you how well a given *volume* of the solution conducts.\n\n**Molar conductivity ($\\Lambda_m$)** is the conductivity contributed by all the ions produced by *exactly one mole* of the electrolyte, when that solution is held between two electrodes $1\\ \\text{cm}$ apart. It's obtained from conductivity by dividing by the molar concentration:\n$\\Lambda_m = \\dfrac{\\kappa \\times 1000}{C}$ (with $\\kappa$ in $\\text{S cm}^{-1}$ and $C$ in $\\text{mol L}^{-1}$, giving $\\Lambda_m$ in $\\text{S cm}^2\\text{ mol}^{-1}$). It tells you how well *one mole's worth* of ions conducts, regardless of how concentrated the solution is.\n\n**Variation with concentration (i.e. with dilution):**\n\n- **Conductivity ($\\kappa$) always decreases on dilution**, for both strong and weak electrolytes — simply because there are fewer ions per unit volume to carry the current as you add more water.\n\n- **Molar conductivity ($\\Lambda_m$) always increases on dilution**, for both strong and weak electrolytes, but for different underlying reasons:\n  - For a **strong electrolyte** (fully dissociated at all concentrations), $\\Lambda_m$ rises only mildly on dilution — mainly because ionic interactions (inter-ionic attractions that slow the ions down) weaken as the ions get farther apart, so each ion moves a little more freely.\n  - For a **weak electrolyte** (only partially dissociated), $\\Lambda_m$ rises much more sharply on dilution, because dilution actually pushes the equilibrium towards *more* dissociation (by Le Chatelier's principle) — so the number of ions per mole of electrolyte genuinely increases, not just their mobility.\n\n**Where students get stuck:** treating $\\kappa$ and $\\Lambda_m$ as if they always move the same way with dilution — they move in *opposite* directions ($\\kappa$ down, $\\Lambda_m$ up), and mixing this up is the single most common conceptual slip in this topic.",
            },
            {
              kind: 'numerical',
              id: 'c1d7d424-6029-448d-9e33-04bb0b74546f',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.8',
              prompt: 'The conductivity of $0.20\\ \\text{M}$ solution of $\\ce{KCl}$ at 298 K is $0.0248\\ \\text{S cm}^{-1}$. Calculate its molar conductivity.',
              answer: '$\\Lambda_m = 124\\ \\text{S cm}^2\\text{ mol}^{-1}$',
              solution:
                "**Use the direct conversion formula between conductivity and molar conductivity:**\n$\\Lambda_m = \\dfrac{\\kappa \\times 1000}{C}$\n\nwhere $\\kappa = 0.0248\\ \\text{S cm}^{-1}$ and $C = 0.20\\ \\text{mol L}^{-1}$.\n\n$\\Lambda_m = \\dfrac{0.0248 \\times 1000}{0.20} = \\dfrac{24.8}{0.20} = 124\\ \\text{S cm}^2\\text{ mol}^{-1}$\n\n**Where students get stuck:** forgetting the factor of 1000 that converts litres to cubic centimetres in the denominator's implicit units — dropping it gives an answer 1000 times too small.",
            },
            {
              kind: 'numerical',
              id: '99b40671-c379-4214-9b17-480550f3083f',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.9',
              prompt:
                'The resistance of a conductivity cell containing $0.001\\text{M}$ $\\ce{KCl}$ solution at 298 K is $1500\\ \\Omega$. What is the cell constant if conductivity of $0.001\\text{M}$ $\\ce{KCl}$ solution at 298 K is $0.146 \\times 10^{-3}\\ \\text{S cm}^{-1}$.',
              answer: '$G^* = 0.219\\ \\text{cm}^{-1}$',
              solution:
                "**The cell constant relates the measured resistance of a cell to the known conductivity of the solution filling it** — it's a fixed geometric property of that particular cell (essentially $\\dfrac{\\text{distance between electrodes}}{\\text{area of electrodes}}$), and it's found here by working *backwards* from a solution of already-known conductivity.\n\n**The defining relationship:** conductivity $\\kappa$ = cell constant $G^*$ $\\times$ conductance $\\left(\\dfrac{1}{R}\\right)$, i.e. $\\kappa = G^* \\times \\dfrac{1}{R}$, so $G^* = \\kappa \\times R$.\n\n$G^* = (0.146\\times 10^{-3}\\ \\text{S cm}^{-1}) \\times (1500\\ \\Omega)$\n\n$G^* = 0.146\\times 10^{-3} \\times 1500 = 0.219\\ \\text{cm}^{-1}$\n\n**Why the units work out to $\\text{cm}^{-1}$:** conductance is measured in siemens ($\\text{S} = \\Omega^{-1}$), and conductivity in $\\text{S cm}^{-1}$, so $\\kappa \\times R$ has units $\\text{S cm}^{-1} \\times \\Omega = \\text{S cm}^{-1}\\times \\text{S}^{-1} = \\text{cm}^{-1}$ — exactly what you'd expect for a quantity built from a length divided by an area.\n\n**Where students get stuck:** confusing conductance ($1/R$, units $\\text{S}$ or $\\Omega^{-1}$) with resistance ($R$, units $\\Omega$) in the formula — the cell constant is $\\kappa \\times R$ (multiply by resistance), not $\\kappa/R$.",
            },
            {
              kind: 'numerical',
              id: '70d9f2ce-5bbe-45f1-87d6-f0afd6ad05d3',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.10',
              prompt:
                'The conductivity of sodium chloride at 298 K has been determined at different concentrations and the results are given below:\nConcentration/M: 0.001, 0.010, 0.020, 0.050, 0.100\n$10^2 \\times \\kappa/\\text{S m}^{-1}$: 1.237, 11.85, 23.15, 55.53, 106.74\nCalculate $\\Lambda_m$ for all concentrations and draw a plot between $\\Lambda_m$ and $c^{1/2}$. Find the value of $\\Lambda^\\circ_m$.',
              answer:
                '$\\Lambda_m \\approx 123.7, 118.5, 115.8, 111.1, 106.7\\ \\text{S cm}^2\\text{ mol}^{-1}$ at the five concentrations; $\\Lambda^\\circ_m \\approx 124$–$126\\ \\text{S cm}^2\\text{ mol}^{-1}$ by extrapolation to $c^{1/2}=0$',
              solution:
                "**First convert every $\\kappa$ reading from $\\text{S m}^{-1}$ into $\\text{S cm}^{-1}$** (multiply by $10^{-2}$, since $1\\ \\text{m} = 100\\ \\text{cm}$ so $1\\ \\text{S m}^{-1} = 10^{-2}\\ \\text{S cm}^{-1}$), then apply $\\Lambda_m = \\dfrac{\\kappa\\times 1000}{C}$ at each concentration.\n\n$C = 0.001\\ \\text{M}$: $\\kappa = 1.237\\times 10^{-2}\\times 10^{-2} = 1.237\\times 10^{-4}\\ \\text{S cm}^{-1}$\n$\\Lambda_m = \\dfrac{1.237\\times 10^{-4}\\times 1000}{0.001} = 123.7\\ \\text{S cm}^2\\text{ mol}^{-1}$\n\n$C=0.010\\ \\text{M}$: $\\kappa = 11.85\\times 10^{-2}\\times 10^{-2} = 1.185\\times 10^{-3}\\ \\text{S cm}^{-1}$\n$\\Lambda_m = \\dfrac{1.185\\times 10^{-3}\\times 1000}{0.010} = 118.5\\ \\text{S cm}^2\\text{ mol}^{-1}$\n\n$C=0.020\\ \\text{M}$: $\\kappa = 23.15\\times 10^{-4} = 2.315\\times 10^{-3}\\ \\text{S cm}^{-1}$\n$\\Lambda_m = \\dfrac{2.315\\times 10^{-3}\\times 1000}{0.020} = 115.8\\ \\text{S cm}^2\\text{ mol}^{-1}$\n\n$C=0.050\\ \\text{M}$: $\\kappa = 55.53\\times 10^{-4} = 5.553\\times 10^{-3}\\ \\text{S cm}^{-1}$\n$\\Lambda_m = \\dfrac{5.553\\times 10^{-3}\\times 1000}{0.050} = 111.1\\ \\text{S cm}^2\\text{ mol}^{-1}$\n\n$C=0.100\\ \\text{M}$: $\\kappa = 106.74\\times 10^{-4} = 1.0674\\times 10^{-2}\\ \\text{S cm}^{-1}$\n$\\Lambda_m = \\dfrac{1.0674\\times 10^{-2}\\times 1000}{0.100} = 106.7\\ \\text{S cm}^2\\text{ mol}^{-1}$\n\n**Plot and extrapolation.** $\\ce{NaCl}$ is a strong electrolyte, so Kohlrausch's law says $\\Lambda_m$ varies *linearly* with $\\sqrt{c}$ (not $c$ itself): $\\Lambda_m = \\Lambda^\\circ_m - A\\sqrt{c}$. Plotting the five $(\\sqrt{c}, \\Lambda_m)$ points — $(0.0316, 123.7), (0.100, 118.5), (0.141, 115.8), (0.224, 111.1), (0.316, 106.7)$ — gives a straight, downward-sloping line. Extrapolating that line back to $\\sqrt{c}=0$ (i.e. to infinite dilution, where the line meets the $\\Lambda_m$ axis) gives the limiting molar conductivity:\n\n$\\Lambda^\\circ_m \\approx 124$–$126\\ \\text{S cm}^2\\text{ mol}^{-1}$\n\n**Why you can't just read off the smallest-concentration value:** even $0.001\\ \\text{M}$ isn't 'infinitely dilute' — $\\Lambda_m$ is still climbing as $c\\to 0$, which is exactly why the *line* must be extended (extrapolated) past your actual data to reach the true $c^{1/2}=0$ intercept, rather than trusting the last measured point.\n\n**Where students get stuck:** plotting $\\Lambda_m$ against $c$ directly instead of $\\sqrt{c}$ — for a strong electrolyte the $\\Lambda_m$-vs-$c$ curve is not a straight line near $c=0$, so it can't be extrapolated reliably; only the $\\Lambda_m$-vs-$\\sqrt{c}$ plot is linear enough (per Kohlrausch's empirical law) to extrapolate with confidence.",
            },
            {
              kind: 'numerical',
              id: '8880182c-3d8a-44e9-8a29-0420f4f09246',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.11',
              prompt:
                'Conductivity of $0.00241\\text{ M}$ acetic acid is $7.896 \\times 10^{-5}\\ \\text{S cm}^{-1}$. Calculate its molar conductivity and if $\\Lambda^\\circ_m$ for acetic acid is $390.5\\ \\text{S cm}^2\\text{ mol}^{-1}$, what is its dissociation constant?',
              answer: '$\\Lambda_m \\approx 32.8\\ \\text{S cm}^2\\text{ mol}^{-1}$; $K_a \\approx 1.85\\times 10^{-5}$',
              solution:
                "**Step 1 — molar conductivity, exactly as before:**\n$\\Lambda_m = \\dfrac{\\kappa\\times 1000}{C} = \\dfrac{7.896\\times 10^{-5}\\times 1000}{0.00241} = \\dfrac{0.07896}{0.00241} = 32.77\\ \\text{S cm}^2\\text{ mol}^{-1}$\n\n**Step 2 — degree of dissociation ($\\alpha$).** For a weak electrolyte, the fraction of molecules that have actually dissociated at this concentration is the ratio of what it *is* conducting (at this dilution) to what it *would* conduct if every molecule dissociated (at infinite dilution):\n$\\alpha = \\dfrac{\\Lambda_m}{\\Lambda^\\circ_m} = \\dfrac{32.77}{390.5} = 0.0839$ (about $8.4\\%$ dissociated)\n\n**Step 3 — dissociation constant, $K_a$.** For the equilibrium $\\ce{CH3COOH <=> CH3COO- + H+}$, starting from concentration $C$ with degree of dissociation $\\alpha$:\n$K_a = \\dfrac{C\\alpha^2}{1-\\alpha}$\n\n$\\alpha^2 = (0.0839)^2 = 7.04\\times 10^{-3}$\n\n$C\\alpha^2 = 0.00241 \\times 7.04\\times 10^{-3} = 1.697\\times 10^{-5}$\n\n$1-\\alpha = 1 - 0.0839 = 0.9161$\n\n$K_a = \\dfrac{1.697\\times 10^{-5}}{0.9161} = 1.85\\times 10^{-5}$\n\n**Where students get stuck:** using $K_a = C\\alpha^2$ (dropping the $1-\\alpha$ in the denominator) — that approximation is only valid when $\\alpha$ is extremely small (well under 5%); here $\\alpha\\approx 8.4\\%$ is small but not negligible, so the full expression is the more careful and correct one to use.",
            },
          ],
        },
        {
          id: 'ff577ad0-e0bc-47ca-9d9f-cd3821c0a22d',
          title: "Electrolysis & Faraday's laws",
          blurb: "Turning moles of product (or current × time) into the charge passed, and back again, using Faraday's constant.",
          items: [
            {
              kind: 'numerical',
              id: 'f2544a40-ec2e-4303-9e41-597741aa28f4',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.12',
              prompt:
                'How much charge is required for the following reductions:\n(i) 1 mol of $\\ce{Al^3+}$ to $\\ce{Al}$.\n(ii) 1 mol of $\\ce{Cu^2+}$ to $\\ce{Cu}$.\n(iii) 1 mol of $\\ce{MnO4-}$ to $\\ce{Mn^2+}$.',
              answer: '(i) $2.895\\times 10^{5}\\ \\text{C}$ (ii) $1.93\\times 10^{5}\\ \\text{C}$ (iii) $4.825\\times 10^{5}\\ \\text{C}$',
              solution:
                "**Each reduction needs one Faraday ($F = 96500\\ \\text{C}$) per mole of electrons transferred** — so the only real work is reading off how many electrons each reduction actually needs from its half-reaction.\n\n**(i) $\\ce{Al^3+ + 3e- -> Al}$** — aluminium goes from $+3$ to $0$, needing **3 electrons** per ion.\nCharge $= 3\\times 96500 = 2.895\\times 10^{5}\\ \\text{C}$\n\n**(ii) $\\ce{Cu^2+ + 2e- -> Cu}$** — copper goes from $+2$ to $0$, needing **2 electrons**.\nCharge $= 2\\times 96500 = 1.93\\times 10^{5}\\ \\text{C}$\n\n**(iii) $\\ce{MnO4- + 8H+ + 5e- -> Mn^2+ + 4H2O}$** — manganese goes from $+7$ (in $\\ce{MnO4-}$) down to $+2$ (in $\\ce{Mn^2+}$), a drop of $5$ in oxidation number, so it needs **5 electrons**.\nCharge $= 5\\times 96500 = 4.825\\times 10^{5}\\ \\text{C}$\n\n**Where students get stuck:** in (iii), not working out the oxidation-number change carefully — $\\ce{MnO4-}$'s manganese is $+7$ (since 4 oxygens at $-2$ each contribute $-8$, and the ion's overall charge is $-1$, so $\\text{Mn} + (-8) = -1 \\Rightarrow \\text{Mn}=+7$), and $\\ce{Mn^2+}$ is simply $+2$; the difference, $5$, is the number of electrons gained — a step that's easy to skip and just guess a smaller number.",
            },
            {
              kind: 'numerical',
              id: 'ba7fc0ce-6463-42ad-8d03-6283a3660a6b',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.13',
              prompt:
                'How much electricity in terms of Faraday is required to produce\n(i) 20.0 g of $\\ce{Ca}$ from molten $\\ce{CaCl2}$.\n(ii) 40.0 g of $\\ce{Al}$ from molten $\\ce{Al2O3}$.',
              answer: '(i) $1\\ \\text{F}$ (ii) $\\approx 4.44\\ \\text{F}$',
              solution:
                "**Find the moles of metal wanted, then multiply by the number of electrons each ion needs to be reduced (from the half-reaction) to get moles of electrons — which is directly the number of Faradays.**\n\n**(i) Calcium: $\\ce{Ca^2+ + 2e- -> Ca}$, molar mass $\\ce{Ca}=40\\ \\text{g/mol}$**\n\n$\\text{moles Ca} = \\dfrac{20.0}{40} = 0.5\\ \\text{mol}$\n\nElectrons needed $= 2\\times 0.5 = 1\\ \\text{mol e}^-$\n\n**Electricity required $= 1\\ \\text{F}$**\n\n**(ii) Aluminium: $\\ce{Al^3+ + 3e- -> Al}$, molar mass $\\ce{Al}=27\\ \\text{g/mol}$**\n\n$\\text{moles Al} = \\dfrac{40.0}{27} = 1.481\\ \\text{mol}$\n\nElectrons needed $= 3\\times 1.481 = 4.444\\ \\text{mol e}^-$\n\n**Electricity required $\\approx 4.44\\ \\text{F}$**\n\n**Where students get stuck:** forgetting that different metals need a different number of electrons per ion depending on their charge — aluminium (a $+3$ ion) needs 1.5 times more Faradays per mole of metal than calcium (a $+2$ ion) for the same mole count, purely because of the extra electron each $\\ce{Al^3+}$ requires.",
            },
            {
              kind: 'numerical',
              id: 'b4ef8e35-29d0-40fc-b74d-897a62f44b2e',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.14',
              prompt: 'How much electricity is required in coulomb for the oxidation of\n(i) 1 mol of $\\ce{H2O}$ to $\\ce{O2}$.\n(ii) 1 mol of $\\ce{FeO}$ to $\\ce{Fe2O3}$.',
              answer: '(i) $1.93\\times 10^{5}\\ \\text{C}$ (ii) $9.65\\times 10^{4}\\ \\text{C}$',
              solution:
                "**Write the oxidation half-reaction for each and count electrons lost per mole of the substance being oxidised.**\n\n**(i) Oxidation of water to oxygen:**\n$\\ce{2H2O(l) -> O2(g) + 4H+(aq) + 4e-}$\n\nThis shows **2 moles of $\\ce{H2O}$ lose 4 moles of electrons** — so per **1 mole** of $\\ce{H2O}$, only **2 moles of electrons** are lost.\n\nCharge $= 2\\times 96500 = 1.93\\times 10^{5}\\ \\text{C}$\n\n**(ii) Oxidation of $\\ce{FeO}$ to $\\ce{Fe2O3}$:**\n\nIn $\\ce{FeO}$, iron is $+2$; in $\\ce{Fe2O3}$, iron is $+3$. So each iron atom is oxidised from $+2$ to $+3$, losing **1 electron per Fe atom**: $\\ce{Fe^2+ -> Fe^3+ + e-}$.\n\n$1$ mole of $\\ce{FeO}$ contains $1$ mole of Fe atoms, so it loses **1 mole of electrons** in being converted to $\\ce{Fe2O3}$.\n\nCharge $= 1\\times 96500 = 9.65\\times 10^{4}\\ \\text{C}$\n\n**Where students get stuck:** in (i), using the full 4-electron count for 1 mole of $\\ce{H2O}$ instead of scaling it down — the balanced equation needs *2 moles* of water to release 4 electrons, so 1 mole releases only 2, exactly half.",
            },
            {
              kind: 'numerical',
              id: '3e804d5d-a4e5-4bbd-a21a-369871324815',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.15',
              prompt:
                'A solution of $\\ce{Ni(NO3)2}$ is electrolysed between platinum electrodes using a current of 5 amperes for 20 minutes. What mass of $\\ce{Ni}$ is deposited at the cathode?',
              answer: '$\\approx 1.83\\ \\text{g Ni}$',
              solution:
                "**First find the total charge passed, then convert charge to moles of electrons, then use the reduction half-reaction to get moles (and finally mass) of nickel deposited.**\n\n**Step 1 — total charge.** $Q = I\\times t$. Convert time to seconds first: $t = 20\\ \\text{min}\\times 60 = 1200\\ \\text{s}$.\n$Q = 5\\ \\text{A}\\times 1200\\ \\text{s} = 6000\\ \\text{C}$\n\n**Step 2 — moles of electrons.**\n$\\text{mol } e^- = \\dfrac{Q}{F} = \\dfrac{6000}{96500} = 0.0622\\ \\text{mol}$\n\n**Step 3 — moles of Ni.** The reduction half-reaction is $\\ce{Ni^2+ + 2e- -> Ni}$, so 2 moles of electrons deposit 1 mole of Ni:\n$\\text{mol Ni} = \\dfrac{0.0622}{2} = 0.0311\\ \\text{mol}$\n\n**Step 4 — mass of Ni**, using molar mass $\\ce{Ni} = 58.7\\ \\text{g/mol}$:\n$\\text{mass} = 0.0311\\times 58.7 = 1.83\\ \\text{g}$\n\n**Where students get stuck:** forgetting to divide by 2 in Step 3 because $\\ce{Ni^2+}$ needs 2 electrons per ion, not 1 — a very easy slip when the previous few questions all happened to involve differently-charged ions, so the electron count per mole keeps changing and has to be re-checked every time.",
            },
            {
              kind: 'numerical',
              id: '4541ecf2-5bbc-4dcd-a759-91d0ce9f936b',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.16',
              prompt:
                'Three electrolytic cells A, B, C containing solutions of $\\ce{ZnSO4}$, $\\ce{AgNO3}$ and $\\ce{CuSO4}$, respectively are connected in series. A steady current of 1.5 amperes was passed through them until 1.45 g of silver deposited at the cathode of cell B. How long did the current flow? What mass of copper and zinc were deposited?',
              answer: 'time $\\approx 864\\ \\text{s}$ ($\\approx 14.4\\ \\text{min}$); Cu $\\approx 0.426\\ \\text{g}$; Zn $\\approx 0.439\\ \\text{g}$',
              solution:
                "**The key idea: cells connected in series all carry exactly the same current and therefore pass exactly the same total charge in the same time.** So once we find the charge needed to deposit the given silver, that same charge tells us the copper and zinc deposited elsewhere in the circuit.\n\n**Step 1 — moles of Ag deposited**, molar mass $\\ce{Ag}=108\\ \\text{g/mol}$:\n$\\text{mol Ag} = \\dfrac{1.45}{108} = 0.01343\\ \\text{mol}$\n\n**Step 2 — charge passed.** $\\ce{Ag+ + e- -> Ag}$ needs 1 electron per ion, so:\n$Q = 0.01343\\times 96500 = 1295.6\\ \\text{C}$\n\n**Step 3 — time.** $Q=It \\Rightarrow t = \\dfrac{Q}{I} = \\dfrac{1295.6}{1.5} = 863.7\\ \\text{s} \\approx 864\\ \\text{s} \\approx 14.4\\ \\text{min}$\n\n**Step 4 — mass of Cu deposited (cell C).** $\\ce{Cu^2+ + 2e- -> Cu}$ needs 2 electrons per ion, and the *same* charge $Q=1295.6\\ \\text{C}$ flowed through this cell too.\n$\\text{mol Cu} = \\dfrac{Q}{2F} = \\dfrac{1295.6}{2\\times 96500} = 0.00671\\ \\text{mol}$\n$\\text{mass Cu} = 0.00671\\times 63.5 = 0.426\\ \\text{g}$\n\n**Step 5 — mass of Zn deposited (cell A).** $\\ce{Zn^2+ + 2e- -> Zn}$ also needs 2 electrons per ion — same electron count as copper, so the same moles:\n$\\text{mol Zn} = 0.00671\\ \\text{mol}$\n$\\text{mass Zn} = 0.00671\\times 65.4 = 0.439\\ \\text{g}$\n\n**Where students get stuck:** assuming the *mass* deposited must be the same across all three cells since it's 'the same circuit' — it isn't; the same *charge* (and hence the same moles of electrons) flows through each cell, but each metal needs a different number of electrons per ion and has a different molar mass, so the actual masses deposited differ (here Cu and Zn happen to have the same electron count, 2 each, so their mole amounts match, but their masses still differ because their molar masses differ).",
            },
          ],
        },
        {
          id: 'fcb3c896-066f-4e76-86b9-0b8e79d37e56',
          title: 'Feasibility & electrolysis products',
          blurb: 'Using standard electrode potentials to predict whether a redox reaction actually goes, and reasoning out what forms at each electrode during electrolysis.',
          items: [
            {
              kind: 'numerical',
              id: '5437463b-88ad-47d1-aa31-cc4e69b60cee',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.17',
              prompt:
                'Using the standard electrode potentials given in Table 3.1, predict if the reaction between the following is feasible:\n(i) $\\ce{Fe^3+(aq)}$ and $\\ce{I-(aq)}$\n(ii) $\\ce{Ag+(aq)}$ and $\\ce{Cu(s)}$\n(iii) $\\ce{Fe^3+(aq)}$ and $\\ce{Br-(aq)}$\n(iv) $\\ce{Ag(s)}$ and $\\ce{Fe^3+(aq)}$\n(v) $\\ce{Br2(aq)}$ and $\\ce{Fe^2+(aq)}$.',
              answer: '(i) feasible (ii) feasible (iii) not feasible (iv) not feasible (v) feasible',
              solution:
                "**General rule: a reaction is feasible if the species being reduced has a higher (more positive) standard reduction potential than the species being oxidised** — i.e. $E^\\circ_{cell} = E^\\circ_{\\text{reduced species}} - E^\\circ_{\\text{oxidised species}} > 0$. Work out, for each pair, which one *would* be reduced and which *would* be oxidised, then compare their $E^\\circ$ values.\n\n**(i) $\\ce{Fe^3+}$ and $\\ce{I-}$:** does $\\ce{Fe^3+}$ oxidise $\\ce{I-}$ to $\\ce{I2}$ (itself being reduced to $\\ce{Fe^2+}$)?\n$E^\\circ(\\ce{Fe^3+/Fe^2+}) = 0.77\\ \\text{V}$, $E^\\circ(\\ce{I2/I-}) = 0.54\\ \\text{V}$\n$E^\\circ_{cell} = 0.77 - 0.54 = +0.23\\ \\text{V} > 0$ → **feasible.** ($\\ce{Fe^3+}$ does oxidise $\\ce{I-}$ to $\\ce{I2}$ — this is a real, well-known reaction.)\n\n**(ii) $\\ce{Ag+}$ and $\\ce{Cu}$:** does $\\ce{Ag+}$ oxidise $\\ce{Cu}$ (being itself reduced to $\\ce{Ag}$)?\n$E^\\circ(\\ce{Ag+/Ag}) = 0.80\\ \\text{V}$, $E^\\circ(\\ce{Cu^2+/Cu}) = 0.34\\ \\text{V}$\n$E^\\circ_{cell} = 0.80 - 0.34 = +0.46\\ \\text{V} > 0$ → **feasible.**\n\n**(iii) $\\ce{Fe^3+}$ and $\\ce{Br-}$:** does $\\ce{Fe^3+}$ oxidise $\\ce{Br-}$ to $\\ce{Br2}$?\n$E^\\circ(\\ce{Fe^3+/Fe^2+}) = 0.77\\ \\text{V}$, $E^\\circ(\\ce{Br2/Br-}) = 1.09\\ \\text{V}$\n$E^\\circ_{cell} = 0.77 - 1.09 = -0.32\\ \\text{V} < 0$ → **not feasible.** ($\\ce{Br-}$'s reduction potential is higher than $\\ce{Fe^3+}$'s, so $\\ce{Fe^3+}$ simply isn't a strong enough oxidiser to pull electrons off $\\ce{Br-}$.)\n\n**(iv) $\\ce{Ag}$ and $\\ce{Fe^3+}$:** does $\\ce{Fe^3+}$ oxidise $\\ce{Ag}$ metal to $\\ce{Ag+}$?\n$E^\\circ(\\ce{Fe^3+/Fe^2+}) = 0.77\\ \\text{V}$ (this is the one being reduced), $E^\\circ(\\ce{Ag+/Ag}) = 0.80\\ \\text{V}$ (Ag is being oxidised, so use its reduction potential as the value being 'overcome')\n$E^\\circ_{cell} = 0.77 - 0.80 = -0.03\\ \\text{V} < 0$ → **not feasible.** ($\\ce{Fe^3+}$ is just barely too weak an oxidiser to pull electrons off metallic silver.)\n\n**(v) $\\ce{Br2}$ and $\\ce{Fe^2+}$:** does $\\ce{Br2}$ oxidise $\\ce{Fe^2+}$ to $\\ce{Fe^3+}$ (itself reduced to $\\ce{Br-}$)?\n$E^\\circ(\\ce{Br2/Br-}) = 1.09\\ \\text{V}$, $E^\\circ(\\ce{Fe^3+/Fe^2+}) = 0.77\\ \\text{V}$\n$E^\\circ_{cell} = 1.09 - 0.77 = +0.32\\ \\text{V} > 0$ → **feasible.** (Notice this is exactly the reverse pairing of part (iii), and exactly as expected, it flips from not-feasible to feasible.)\n\n**Where students get stuck:** in (iii) vs (v) especially — mixing up which species is being reduced and which is being oxidised changes the sign of the answer completely. Always write out explicitly 'X is reduced, Y is oxidised' before subtracting, rather than subtracting the two $E^\\circ$ values in whatever order they were listed in the question.",
            },
            {
              kind: 'numerical',
              id: '4742427f-ad8c-4402-9acd-947ebae54f40',
              source: 'ncert_exercise',
              source_label: 'NCERT 3.18',
              prompt:
                'Predict the products of electrolysis in each of the following:\n(i) An aqueous solution of $\\ce{AgNO3}$ with silver electrodes.\n(ii) An aqueous solution of $\\ce{AgNO3}$ with platinum electrodes.\n(iii) A dilute solution of $\\ce{H2SO4}$ with platinum electrodes.\n(iv) An aqueous solution of $\\ce{CuCl2}$ with platinum electrodes.',
              answer:
                '(i) Ag dissolves at anode, Ag deposits at cathode (electrorefining, no gas); (ii) Ag deposits at cathode, O₂ evolved at anode; (iii) H₂ at cathode, O₂ at anode; (iv) Cu deposits at cathode, Cl₂ evolved at anode',
              solution:
                "**In each case, work out the cathode product by comparing which species is easiest to reduce, and the anode product by comparing which species is easiest to oxidise — remembering that an *active* metal electrode (one made of the same metal as the ion in solution) behaves completely differently from an *inert* electrode like platinum.**\n\n**(i) $\\ce{AgNO3(aq)}$ with silver (active) electrodes.** Because the electrodes themselves are silver, the anode doesn't oxidise water or $\\ce{NO3-}$ at all — it's far easier for the silver metal of the electrode itself to dissolve: $\\ce{Ag(s) -> Ag+(aq) + e-}$. At the cathode, that $\\ce{Ag+}$ (along with the $\\ce{Ag+}$ already in solution) is reduced back to metal: $\\ce{Ag+(aq) + e- -> Ag(s)}$. Net effect: **silver dissolves from the anode and deposits on the cathode**, with no gas evolved and the solution's $\\ce{Ag+}$ concentration essentially unchanged — this is exactly the electrorefining process used to purify silver.\n\n**(ii) $\\ce{AgNO3(aq)}$ with platinum (inert) electrodes.** At the cathode, $\\ce{Ag+}$ is reduced ($E^\\circ = 0.80\\ \\text{V}$) in preference to water ($E^\\circ(\\ce{H2O/H2}) = -0.83\\ \\text{V}$ at these conditions), so **Ag metal deposits** at the cathode. At the anode, $\\ce{NO3-}$ is very hard to oxidise, so water is oxidised instead: $\\ce{2H2O(l) -> O2(g) + 4H+(aq) + 4e-}$ — so **$\\ce{O2}$ gas is evolved** at the anode.\n\n**(iii) Dilute $\\ce{H2SO4}$ with platinum electrodes.** This is effectively the electrolysis of water, with $\\ce{H2SO4}$ present mainly to carry the current. At the cathode: $\\ce{2H+(aq) + 2e- -> H2(g)}$, so **$\\ce{H2}$ gas** is evolved. At the anode, $\\ce{SO4^2-}$ is very difficult to oxidise (it requires a much higher potential than water does), so water is oxidised instead: $\\ce{2H2O(l) -> O2(g) + 4H+(aq) + 4e-}$, giving **$\\ce{O2}$ gas**.\n\n**(iv) $\\ce{CuCl2(aq)}$ with platinum electrodes.** At the cathode, $\\ce{Cu^2+}$ is reduced in preference to water: $\\ce{Cu^2+(aq) + 2e- -> Cu(s)}$, so **Cu metal deposits**. At the anode, purely by standard potentials $\\ce{O2}$ evolution from water ($E^\\circ \\approx 1.23\\ \\text{V}$) should be easier than oxidising $\\ce{Cl-}$ to $\\ce{Cl2}$ ($E^\\circ = 1.36\\ \\text{V}$) — but in practice, oxygen evolution at a platinum surface suffers from a large **overpotential** (extra voltage needed beyond the thermodynamic minimum), which isn't the case for chlorine. Because of this, **$\\ce{Cl2}$ gas is evolved** at the anode instead of $\\ce{O2}$, especially at reasonably concentrated $\\ce{Cl-}$ concentrations, as seen in the real industrial chlor-alkali-type process.\n\n**Where students get stuck:** in (iv), predicting $\\ce{O2}$ at the anode purely by comparing textbook standard potentials and stopping there — the overpotential effect is a genuinely separate, real phenomenon (not just an exam trick) that flips the actual observed product away from what the raw $E^\\circ$ table alone would suggest. It's worth remembering as an explicit exception, not deriving it from $E^\\circ$ values alone.",
            },
          ],
        },
      ],
    },
  ],
};
