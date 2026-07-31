'use strict';
/**
 * Class 11 Chemistry (ncert-simplified), Chapter 1 "Some Basic Concepts of
 * Chemistry" — a NEW, optional "Additional Practice — Beyond NCERT" page
 * (founder-requested, 2026-07-24).
 *
 * WHAT THIS IS: mixed-concept, beyond-syllabus problems (stoichiometry,
 * nomenclature technique, limiting reagent, density/molarity, and several
 * equivalent-weight/normality titration problems) sourced from the founder's
 * own reference problems, presented as `worked_example` blocks. Every solution
 * was independently re-derived and verified this session (not copied from the
 * reference's compressed "m.e./Eqn." notation) — written in full step-by-step
 * form so the TECHNIQUE is the point, matching the voice already established
 * by the 9 worked examples on the sibling 'eudiometry' page in this same
 * chapter (Step 1 / Step 2 / boxed final answer / a closing "why this
 * matters" line). LaTeX uses single `$...$` only per CLAUDE.md §4 (the
 * reference material's own $$...$$ style was NOT replicated).
 *
 * FOUNDER NOTE: this page is intentionally UNORDERED beyond "the order the
 * problems were given in" — the founder said explicitly "once we have
 * populated this page with questions, then only we will arrange the
 * questions," so no thematic grouping or quiz block yet. Page is inserted
 * `published: false` pending that arrangement pass and a founder review.
 *
 * Purely additive: a brand-new page + one new entry in the book's chapter-1
 * page_ids array. Nothing existing is touched. Idempotent (skip-if-exists by
 * slug), matching the pattern used by scripts/math11-book/_book.js.
 * Run: node scripts/insert_ch1_extra_practice_page.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CHAPTER_NUMBER = 1;
const PAGE_SLUG = 'additional-practice-beyond-ncert';

const b = (type, order, extra) => ({ id: uuidv4(), type, order, ...(extra || {}) });
const worked = (order, label, problem, solution) =>
  b('worked_example', order, { label, variant: 'solved_example', problem, solution, reveal_mode: 'tap_to_reveal' });

const blocks = [
  b('image', 0, {
    src: '', alt: 'A winding path climbing past a signpost of chemistry symbols toward a peak beyond a marked syllabus plateau, hand-drawn illustration',
    caption: '', width: 'full', aspect_ratio: '16:5',
    generation_prompt:
      'Hand-drawn illustration in muted earthy tones (ochre, terracotta, teal, sage green, indigo, cream) on a deep ' +
      'charcoal near-black background. A single winding path climbs past a small signpost carrying chemistry symbols ' +
      '(a beaker, a flask, an atom outline) up toward a higher peak beyond a lower, clearly marked plateau — suggesting ' +
      'going further than the required course. Clean, flat, textbook-illustration style, no glow, no neon, no 3D-render ' +
      'look, no readable body text.',
  }),
  b('text', 1, {
    markdown:
      'This page is **optional**. Everything here goes a little beyond what NCERT itself asks for — a few extra ' +
      'stoichiometry problems, a nomenclature drill, and several titration-style questions that mix ideas from across ' +
      'this chapter. If your target is boards only, you can skip this page entirely.\n\n' +
      'If you are preparing for JEE, or you just enjoy a harder problem, work through these the same way as the worked ' +
      'examples earlier in the chapter — try each one yourself on paper first, then tap to check your working against ' +
      'the solution.',
  }),
  worked(2,
    'Example — Volume of HNO₃ Needed to Dissolve Copper',
    'How many millilitres of pure nitric acid, $\\ce{HNO3}$ (density $1.51\\ \\text{g cm}^{-3}$), are needed to react ' +
    'completely with $2.56$ mol of Cu in the reaction below?\n\n' +
    '$\\ce{3Cu + 8HNO3 -> 3Cu(NO3)2 + 2NO + 4H2O}$',
    '**Step 1 — Read the mole ratio straight off the balanced equation.**\n\n' +
    'Every 3 mol of Cu needs 8 mol of $\\ce{HNO3}$. So:\n\n' +
    '$n(\\ce{HNO3}) = 2.56 \\times \\frac{8}{3} = 6.83\\ \\text{mol}$\n\n' +
    '**Step 2 — Convert moles of $\\ce{HNO3}$ to mass.**\n\n' +
    'Molar mass of $\\ce{HNO3} = 1 + 14 + 48 = 63\\ \\text{g/mol}$.\n\n' +
    '$m = 6.83 \\times 63 = 430\\ \\text{g}$\n\n' +
    '**Step 3 — Convert mass to volume using the density.**\n\n' +
    'The acid is *pure* — so its density gives you volume directly, no percentage-purity correction needed.\n\n' +
    '$V = \\frac{m}{\\text{density}} = \\frac{430}{1.51} = \\boxed{285\\ \\text{mL}}$\n\n' +
    "**Why this matters:** whenever a problem gives you a density and asks for a *volume*, that density is the LAST " +
    'step, not the first — get to a mass using the chemistry, then divide by density right at the end.'),
  worked(3,
    'Example — Naming Technique: Writing Formulas from Names',
    'Give the chemical formula for each of the following:\n\n' +
    '(a) potassium nitrate (b) calcium carbonate (c) cobalt(II) phosphate (d) magnesium sulfite (e) iron(III) bromide ' +
    '(f) magnesium nitride (g) aluminum selenide (h) copper(II) perchlorate (i) bromine pentafluoride ' +
    '(j) dinitrogen pentaoxide (k) strontium acetate (l) ammonium dichromate (m) copper(I) sulfide',
    '**The technique — three quick checks, in order.**\n\n' +
    "1. **Is a Roman numeral given?** That IS the cation's charge — use it directly (cobalt(II) = $\\ce{Co^{2+}}$).\n" +
    "2. **No Roman numeral, metal from Groups 1, 2, or Al?** These only ever form one charge — memorise it " +
    '($\\ce{M+}$ for Group 1, $\\ce{M^{2+}}$ for Group 2, $\\ce{Al^{3+}}$).\n' +
    '3. **Cross-multiply the charges to balance the formula.** A cation of charge $+p$ and an anion of charge $-q$ ' +
    'combine as $p$ anions to $q$ cations — e.g. $\\ce{Co^{2+}}$ with $\\ce{PO4^{3-}}$ needs 3 Co for every 2 ' +
    'phosphate, giving $\\ce{Co3(PO4)2}$.\n' +
    "4. **Covalent binary compounds** (two non-metals, like the bromine/nitrogen ones here) don't use charges at all " +
    '— the Greek prefix in the name (mono-, di-, tri-, tetra-, penta-) IS the subscript.\n\n' +
    '**Working through each:**\n\n' +
    '(a) $\\ce{KNO3}$ — $\\ce{K+}$ + $\\ce{NO3-}$, both charge 1, no crossing needed.\n\n' +
    '(b) $\\ce{CaCO3}$ — $\\ce{Ca^{2+}}$ + $\\ce{CO3^{2-}}$, charges already match.\n\n' +
    '(c) $\\ce{Co3(PO4)2}$ — crossing $\\ce{Co^{2+}}$ and $\\ce{PO4^{3-}}$ gives 3 Co, 2 phosphate.\n\n' +
    '(d) $\\ce{MgSO3}$ — $\\ce{Mg^{2+}}$ + $\\ce{SO3^{2-}}$, charges match.\n\n' +
    '(e) $\\ce{FeBr3}$ — the (III) tells you $\\ce{Fe^{3+}}$; one $\\ce{Fe^{3+}}$ needs three $\\ce{Br-}$.\n\n' +
    '(f) $\\ce{Mg3N2}$ — crossing $\\ce{Mg^{2+}}$ and $\\ce{N^{3-}}$ gives 3 Mg, 2 N.\n\n' +
    '(g) $\\ce{Al2Se3}$ — crossing $\\ce{Al^{3+}}$ and $\\ce{Se^{2-}}$ gives 2 Al, 3 Se.\n\n' +
    '(h) $\\ce{Cu(ClO4)2}$ — (II) tells you $\\ce{Cu^{2+}}$; perchlorate is $\\ce{ClO4-}$, so two of them.\n\n' +
    "(i) $\\ce{BrF5}$ — 'penta' is the giveaway; no crossing for covalent names, just read the prefix.\n\n" +
    "(j) $\\ce{N2O5}$ — 'dinitrogen' = $\\ce{N2}$, 'pentaoxide' = $\\ce{O5}$.\n\n" +
    '(k) $\\ce{Sr(C2H3O2)2}$ — acetate is $\\ce{C2H3O2-}$ (charge 1); $\\ce{Sr^{2+}}$ needs two of them.\n\n' +
    '(l) $\\ce{(NH4)2Cr2O7}$ — ammonium $\\ce{NH4+}$ (charge 1) with dichromate $\\ce{Cr2O7^{2-}}$ (charge 2) needs ' +
    'two ammonium.\n\n' +
    '(m) $\\ce{Cu2S}$ — (I) tells you $\\ce{Cu+}$; sulfide is $\\ce{S^{2-}}$, so two Cu.\n\n' +
    '**Why this matters:** almost every mistake in this drill comes from skipping check 1 (missing a stated Roman ' +
    'numeral) or forgetting that covalent (non-metal + non-metal) names use prefixes, never crossed charges.'),
  worked(4,
    'Example — Naming Technique: Reading Names from Formulas',
    'Give the chemical name for each of the following:\n\n' +
    '(a) $\\ce{NaClO3}$ (b) $\\ce{Ca3(PO4)2}$ (c) $\\ce{NaMnO4}$ (d) $\\ce{AlP}$ (e) $\\ce{ICl3}$ (f) $\\ce{PCl3}$ ' +
    '(g) $\\ce{K2CrO4}$ (h) $\\ce{Ca(CN)2}$ (i) $\\ce{MnCl2}$ (j) $\\ce{NaNO2}$ (k) $\\ce{Fe(NO3)2}$',
    '**The technique, run in reverse.**\n\n' +
    '1. **Is the metal a transition metal (or one with more than one common charge, like Fe, Cu, Mn, Co)?** You must ' +
    'work out its charge from the anion and state it as a Roman numeral.\n' +
    "2. **Is it a Group 1/2 or Al metal?** No Roman numeral needed — its charge never changes.\n" +
    '3. **Two non-metals, no metal at all?** Use Greek prefixes (mono-, di-, tri-…) read straight off the subscripts.\n' +
    "4. **To find a transition metal's charge:** the whole compound is neutral, so the metal's charge must exactly " +
    "cancel the anion's total charge.\n\n" +
    '**Working through each:**\n\n' +
    '(a) $\\ce{NaClO3}$ — sodium chlorate ($\\ce{ClO3-}$ is chlorate).\n\n' +
    '(b) $\\ce{Ca3(PO4)2}$ — calcium phosphate (Ca is Group 2, no Roman numeral needed).\n\n' +
    "(c) $\\ce{NaMnO4}$ — sodium permanganate ($\\ce{MnO4-}$ is the permanganate ion — Mn's charge here is fixed by " +
    'the ion name itself, not a separate Roman numeral).\n\n' +
    '(d) $\\ce{AlP}$ — aluminum phosphide (Al only ever forms $\\ce{Al^{3+}}$; $\\ce{P^{3-}}$ is phosphide).\n\n' +
    '(e) $\\ce{ICl3}$ — iodine trichloride (two non-metals — prefixes, not charges).\n\n' +
    '(f) $\\ce{PCl3}$ — phosphorus trichloride.\n\n' +
    '(g) $\\ce{K2CrO4}$ — potassium chromate ($\\ce{CrO4^{2-}}$ is chromate; two $\\ce{K+}$ balance it).\n\n' +
    '(h) $\\ce{Ca(CN)2}$ — calcium cyanide ($\\ce{CN-}$ is cyanide).\n\n' +
    '(i) $\\ce{MnCl2}$ — manganese(II) chloride. Two $\\ce{Cl-}$ (charge $-1$ each) means Mn must be $+2$ to stay ' +
    'neutral — that is where the Roman numeral comes from.\n\n' +
    '(j) $\\ce{NaNO2}$ — sodium nitrite ($\\ce{NO2-}$ is nitrite — one oxygen fewer than nitrate, $\\ce{NO3-}$).\n\n' +
    '(k) $\\ce{Fe(NO3)2}$ — iron(II) nitrate. Two nitrate ions (each $-1$) means Fe must be $+2$.\n\n' +
    '**Why this matters:** (c) and (i) look similar (both start with Na/Mn-adjacent formulas) but are completely ' +
    "different reads — in $\\ce{NaMnO4}$, Mn's charge is locked inside the permanganate ion's own name; in " +
    '$\\ce{MnCl2}$, Mn is a free transition-metal cation whose charge you must work out yourself. Always check ' +
    'whether the metal is bonded as part of a NAMED polyatomic ion, or standing alone.'),
  worked(5,
    'Example — Limiting Reagent: Ammonia Burning in Oxygen',
    'Ammonia reacts with oxygen to form nitrogen monoxide:\n\n' +
    '$\\ce{NH3 + O2 -> NO + H2O}$ (unbalanced)\n\n' +
    'How many moles and how many grams of NO could be formed from a mixture of $45.0$ g of $\\ce{NH3}$ and $58.0$ g ' +
    'of $\\ce{O2}$? How many grams of which reactant would remain unreacted?',
    '**Step 1 — Balance the equation first.** Nothing below means anything until this is done.\n\n' +
    '$\\ce{4NH3 + 5O2 -> 4NO + 6H2O}$\n\n' +
    'Check: 4 N both sides, 12 H both sides, 10 O both sides. Balanced.\n\n' +
    '**Step 2 — Convert both given masses to moles.**\n\n' +
    '$n(\\ce{NH3}) = \\frac{45.0}{17.0} = 2.65\\ \\text{mol}$\n\n' +
    '$n(\\ce{O2}) = \\frac{58.0}{32.0} = 1.81\\ \\text{mol}$\n\n' +
    "**Step 3 — Find the limiting reagent.** The equation needs $\\ce{O2}$ and $\\ce{NH3}$ in a $5:4$ ratio. Ask: " +
    'does the $\\ce{NH3}$ we have need *more* $\\ce{O2}$ than we actually have?\n\n' +
    '$\\ce{O2}$ needed for all the $\\ce{NH3}$: $2.65 \\times \\frac{5}{4} = 3.31\\ \\text{mol}$ — but we only have ' +
    '$1.81$ mol. **$\\ce{O2}$ is the limiting reagent** — it runs out first.\n\n' +
    '**Step 4 — Use the limiting reagent (O₂) for every downstream calculation.**\n\n' +
    '$n(\\ce{NO}) = n(\\ce{O2}) \\times \\frac{4}{5} = 1.81 \\times \\frac{4}{5} = 1.45\\ \\text{mol}$\n\n' +
    '$m(\\ce{NO}) = 1.45 \\times 30.0 = \\boxed{43.5\\ \\text{g of NO}}$\n\n' +
    "**Step 5 — Find what's left of the OTHER reactant.**\n\n" +
    '$\\ce{NH3}$ actually consumed $= n(\\ce{O2}) \\times \\frac{4}{5} = 1.81 \\times 0.8 = 1.45\\ \\text{mol}$\n\n' +
    '$\\ce{NH3}$ remaining $= 2.65 - 1.45 = 1.20\\ \\text{mol} \\implies m = 1.20 \\times 17.0 = ' +
    '\\boxed{20.4\\ \\text{g of } \\ce{NH3}\\text{ left over}}$\n\n' +
    "**Why this matters:** a limiting-reagent problem is really just 'do the stoichiometry twice' — once assuming " +
    "each reactant is the one that runs out, and see which assumption breaks (needs more of the other reactant than " +
    "you were given). Whichever one you CAN'T fully use up is the excess reactant."),
  worked(6,
    'Example — Molarity from Density and Percentage, Then Diluting It',
    'A bottle of commercial sulphuric acid (density $1.787\\ \\text{g/mL}$) is labelled as $86\\%$ by weight. What is ' +
    'the molarity of the acid? What volume of this acid has to be used to make $1$ litre of $0.2\\ \\text{M}$ ' +
    '$\\ce{H2SO4}$?',
    '**Step 1 — Find the mass of exactly 1 litre of the solution.**\n\n' +
    'Density tells you mass per volume, so:\n\n' +
    '$m_{\\text{solution}} = 1000\\ \\text{mL} \\times 1.787\\ \\text{g/mL} = 1787\\ \\text{g}$\n\n' +
    '**Step 2 — Use the 86% to find the mass of pure $\\ce{H2SO4}$ inside that litre.**\n\n' +
    '$m(\\ce{H2SO4}) = 0.86 \\times 1787 = 1537\\ \\text{g}$\n\n' +
    '**Step 3 — Convert that mass to moles, then to molarity.**\n\n' +
    'Molar mass of $\\ce{H2SO4} = 98\\ \\text{g/mol}$.\n\n' +
    '$n = \\frac{1537}{98} = 15.68\\ \\text{mol}$\n\n' +
    'Since this is the amount in exactly 1 L: $\\boxed{\\text{Molarity} = 15.68\\ \\text{M}}$\n\n' +
    '**Step 4 — Dilute it down to 0.2 M using $M_1V_1 = M_2V_2$.**\n\n' +
    'Diluting never changes the *moles* of $\\ce{H2SO4}$ — only the volume changes. So:\n\n' +
    '$15.68 \\times V_1 = 0.2 \\times 1000\\ \\text{mL}$\n\n' +
    '$V_1 = \\frac{200}{15.68} = \\boxed{12.8\\ \\text{mL of the concentrated acid}}$\n\n' +
    "**Why this matters:** 'density + percentage by weight' is always the same three-step ladder — mass of solution " +
    '(density) → mass of solute (percentage) → moles (molar mass). Once you have molarity, any dilution question is ' +
    'just $M_1V_1 = M_2V_2$, nothing new.'),
  worked(7,
    'Example — Strength of an Acid Solution, Then Neutralising a Base',
    '$100$ g of a sample of $\\ce{HCl}$ solution of relative density $1.17$ contains $33.4$ g of $\\ce{HCl}$. What ' +
    'volume of this $\\ce{HCl}$ solution will be required to neutralise exactly $5$ litres of $\\frac{N}{10}$ ' +
    '$\\ce{NaOH}$ solution?',
    '**Step 1 — Find the volume that 100 g of this solution actually occupies.**\n\n' +
    'Relative density $1.17$ means $1.17$ g of solution per mL, so:\n\n' +
    '$V = \\frac{100}{1.17} = 85.5\\ \\text{mL}$\n\n' +
    '**Step 2 — Find the normality of this HCl.** $\\ce{HCl}$ is a monobasic acid, so its equivalents equal its ' +
    'moles.\n\n' +
    '$n(\\ce{HCl}) = \\frac{33.4}{36.5} = 0.915\\ \\text{mol} = 0.915\\ \\text{equivalents}$\n\n' +
    '$\\text{Normality} = \\frac{\\text{equivalents}}{\\text{volume in L}} = \\frac{0.915}{0.0855} = ' +
    '\\boxed{10.7\\ \\text{N}}$\n\n' +
    "**Step 3 — Use 'equal equivalents neutralise each other' to find how much of this acid is needed.**\n\n" +
    'At neutralisation, milliequivalents of acid = milliequivalents of base — this is true for ANY acid–base pair, ' +
    'no matter how many H⁺ or OH⁻ each carries, which is exactly why normality is the convenient unit here.\n\n' +
    '$\\text{meq of NaOH} = 0.1\\ \\text{N} \\times 5000\\ \\text{mL} = 500$\n\n' +
    '$\\text{meq of HCl needed} = 500 \\implies 10.7 \\times V = 500$\n\n' +
    '$V = \\frac{500}{10.7} = \\boxed{46.7\\ \\text{mL}}$\n\n' +
    "**Why this matters:** normality is built specifically so that neutralisation is ALWAYS 'equivalents = " +
    "equivalents' — you never need to worry about basicity or acidity separately once you're working in normality."),
  worked(8,
    'Example — Purity of H₂O₂ from a KMnO₄ Titration',
    'A $0.4$-g sample of $\\ce{H2O2}$ reacted with $0.632$ g of $\\ce{KMnO4}$ in the presence of sulphuric acid. ' +
    'Calculate the percentage purity of the sample of $\\ce{H2O2}$.',
    '**Step 1 — Write the balanced redox equation.**\n\n' +
    '$\\ce{2KMnO4 + 3H2SO4 + 5H2O2 -> K2SO4 + 2MnSO4 + 8H2O + 5O2}$\n\n' +
    'Here $\\ce{H2O2}$ is the reducing agent (it gets oxidised all the way to $\\ce{O2}$); $\\ce{KMnO4}$ is the ' +
    'oxidising agent ($\\ce{Mn}$ drops from $+7$ to $+2$).\n\n' +
    '**Step 2 — Find moles of $\\ce{KMnO4}$ actually used.**\n\n' +
    'Molar mass of $\\ce{KMnO4} = 158\\ \\text{g/mol}$.\n\n' +
    '$n(\\ce{KMnO4}) = \\frac{0.632}{158} = 0.00400\\ \\text{mol}$\n\n' +
    '**Step 3 — Read the mole ratio off the balanced equation to get moles of $\\ce{H2O2}$ that reacted.**\n\n' +
    'The ratio is $2\\ \\ce{KMnO4} : 5\\ \\ce{H2O2}$, so:\n\n' +
    '$n(\\ce{H2O2}) = 0.00400 \\times \\frac{5}{2} = 0.0100\\ \\text{mol}$\n\n' +
    '**Step 4 — Convert to mass, then to percentage of the original 0.4 g sample.**\n\n' +
    '$m(\\ce{H2O2}) = 0.0100 \\times 34 = 0.340\\ \\text{g}$\n\n' +
    '$\\%\\ \\text{purity} = \\frac{0.340}{0.4} \\times 100 = \\boxed{85\\%}$\n\n' +
    "**Why this matters:** once you have the balanced equation, a titration question is ALWAYS 'moles of the " +
    "titrant you measured → moles of the unknown via the ratio → mass → percentage.' The equivalent-weight shortcut " +
    'some books use for this is optional; the mole-ratio route above always works and is easy to check.'),
  worked(9,
    'Example — Strength of H₂O₂ via an Iodometric Titration',
    'In a $50$-mL solution of $\\ce{H2O2}$, an excess of $\\ce{KI}$ and dilute $\\ce{H2SO4}$ were added. The ' +
    '$\\ce{I2}$ so liberated required $20$ mL of $0.1\\ \\text{N}$ $\\ce{Na2S2O3}$ for complete reaction. Calculate ' +
    'the strength of $\\ce{H2O2}$ in grams per litre.',
    '**Step 1 — Write both reactions in the chain.** This is a two-stage titration: $\\ce{H2O2}$ first liberates ' +
    'iodine, and THEN the iodine is titrated separately.\n\n' +
    '$\\ce{2KI + H2SO4 + H2O2 -> K2SO4 + 2H2O + I2}$\n\n' +
    '$\\ce{2Na2S2O3 + I2 -> Na2S4O6 + 2NaI}$\n\n' +
    '**Step 2 — Work backwards from the titrant you actually measured.**\n\n' +
    '$n(\\ce{Na2S2O3}) = 0.1\\ \\text{N} \\times 0.020\\ \\text{L} = 0.00200\\ \\text{mol}$ (normality = molarity ' +
    'here since $\\ce{Na2S2O3}$ has $n$-factor $= 1$)\n\n' +
    '**Step 3 — Convert to moles of $\\ce{I2}$ using the SECOND equation\'s ratio (2 : 1).**\n\n' +
    '$n(\\ce{I2}) = \\frac{0.00200}{2} = 0.00100\\ \\text{mol}$\n\n' +
    '**Step 4 — Convert to moles of $\\ce{H2O2}$ using the FIRST equation\'s ratio (1 : 1).**\n\n' +
    '$n(\\ce{H2O2}) = 0.00100\\ \\text{mol}$ — every mole of $\\ce{I2}$ traces back to exactly one mole of ' +
    '$\\ce{H2O2}$.\n\n' +
    '**Step 5 — Convert to a concentration in g/L.**\n\n' +
    '$m(\\ce{H2O2}) = 0.00100 \\times 34 = 0.0340\\ \\text{g}$ in the original $50$ mL.\n\n' +
    '$\\text{Strength} = \\frac{0.0340\\ \\text{g}}{0.050\\ \\text{L}} = \\boxed{0.68\\ \\text{g/L}}$\n\n' +
    "**Why this matters:** in a two-step 'liberate, then titrate' problem, walk backwards one equation at a time " +
    'from the burette reading — never try to jump straight from the titrant to the original unknown in one leap.'),
  worked(10,
    'Example — Percentage of Oxalate in a Salt, via KMnO₄ Titration',
    'Calculate the percentage amount of oxalate in a given sample of oxalate salt when $0.3$ g of salt was dissolved ' +
    'in $100$ mL, and $10$ mL of which required $8$ mL of $\\frac{N}{20}$ $\\ce{KMnO4}$ solution.',
    '**Step 1 — Write the balanced equation (acidic medium).**\n\n' +
    '$\\ce{5C2O4^2- + 2MnO4- + 16H+ -> 2Mn^2+ + 10CO2 + 8H2O}$\n\n' +
    '**Step 2 — Find moles of $\\ce{KMnO4}$ used on the small 10 mL aliquot.**\n\n' +
    'Normality $\\frac{N}{20} = 0.05\\ \\text{N}$; since $\\ce{Mn}$ drops from $+7$ to $+2$ ($n$-factor $= 5$), ' +
    'molarity $= \\frac{0.05}{5} = 0.01\\ \\text{M}$.\n\n' +
    '$n(\\ce{KMnO4}) = 0.01\\ \\text{M} \\times 0.008\\ \\text{L} = 8 \\times 10^{-5}\\ \\text{mol}$\n\n' +
    '**Step 3 — Use the $5:2$ ratio to get moles of oxalate in that same 10 mL.**\n\n' +
    '$n(\\ce{C2O4^2-}) = 8 \\times 10^{-5} \\times \\frac{5}{2} = 2 \\times 10^{-4}\\ \\text{mol}$ (in 10 mL)\n\n' +
    '**Step 4 — Scale up to the FULL 100 mL solution.** The 10 mL was just $\\frac{1}{10}$ of the whole sample, so ' +
    'multiply by 10:\n\n' +
    '$n(\\ce{C2O4^2-})_{\\text{total}} = 2 \\times 10^{-4} \\times 10 = 2 \\times 10^{-3}\\ \\text{mol}$\n\n' +
    '**Step 5 — Convert to mass, then percentage of the original 0.3 g.**\n\n' +
    'Molar mass of $\\ce{C2O4^2-} = 88\\ \\text{g/mol}$.\n\n' +
    '$m = 2 \\times 10^{-3} \\times 88 = 0.176\\ \\text{g}$\n\n' +
    '$\\% = \\frac{0.176}{0.3} \\times 100 = \\boxed{58.7\\%}$\n\n' +
    '**Why this matters:** whenever a problem titrates only a small ALIQUOT of a larger prepared solution (here 10 ' +
    'of 100 mL), you MUST scale your answer back up to the full solution before comparing it to the original sample ' +
    'mass — forgetting this scaling step is the single most common mistake in this problem type.'),
  worked(11,
    'Example — How Much AgCl Precipitates from AgNO₃ in Excess HCl',
    'How much $\\ce{AgCl}$ will be formed by adding $1.70$ g of $\\ce{AgNO3}$ to $200$ mL of $5\\ \\text{N}$ ' +
    '$\\ce{HCl}$ solution?',
    '**Step 1 — Find moles of each reactant you actually have.**\n\n' +
    '$n(\\ce{AgNO3}) = \\frac{1.70}{170} = 0.0100\\ \\text{mol}$ (molar mass $\\ce{AgNO3} = 170$)\n\n' +
    '$n(\\ce{HCl}) = \\text{Normality} \\times \\text{Volume(L)} = 5 \\times 0.200 = 1.00\\ \\text{mol}$ (HCl is ' +
    'monobasic, so normality = molarity here)\n\n' +
    '**Step 2 — Compare to the reaction\'s 1:1 ratio and spot the limiting reagent.**\n\n' +
    '$\\ce{AgNO3 + HCl -> AgCl v + HNO3}$\n\n' +
    '$1.00$ mol of $\\ce{HCl}$ is a huge excess next to just $0.0100$ mol of $\\ce{AgNO3}$ — **$\\ce{AgNO3}$ is the ' +
    'limiting reagent** and gets used up completely.\n\n' +
    "**Step 3 — The precipitate forms 1:1 with whichever reagent ran out.**\n\n" +
    '$n(\\ce{AgCl}) = n(\\ce{AgNO3}) = 0.0100\\ \\text{mol}$\n\n' +
    '**Step 4 — Convert to mass.**\n\n' +
    'Molar mass of $\\ce{AgCl} = 108 + 35.5 = 143.5\\ \\text{g/mol}$\n\n' +
    '$m(\\ce{AgCl}) = 0.0100 \\times 143.5 = \\boxed{1.435\\ \\text{g}}$\n\n' +
    "**Why this matters:** don't let the word 'normality' scare you into overcomplicating a simple 1:1 " +
    'precipitation — here it is just a unit for how many moles of $\\ce{HCl}$ are present. The real work is ' +
    'spotting that $\\ce{HCl}$ is wildly in excess, so $\\ce{AgNO3}$ alone decides the answer.'),
  worked(12,
    'Example — Splitting an Al–Zn Mixture Using the Gas They Both Release',
    'A mixture of aluminium and zinc weighing $1.67$ g was completely dissolved in acid and evolved $1.69$ litres of ' +
    'hydrogen at NTP. What was the weight of aluminium in the original mixture?',
    '**Step 1 — Notice that BOTH metals contribute to the same gas, so you must add their equivalents, not their ' +
    'moles.**\n\n' +
    '$\\ce{2Al + 6HCl -> 2AlCl3 + 3H2}$ ($n$-factor of Al $= 3$)\n\n' +
    '$\\ce{Zn + 2HCl -> ZnCl2 + H2}$ ($n$-factor of Zn $= 2$)\n\n' +
    'Since Al and Zn have DIFFERENT $n$-factors, their moles do not add up simply — but their **equivalents** always ' +
    'do, because 1 equivalent of any metal always releases exactly 1 equivalent of $\\ce{H2}$.\n\n' +
    '**Step 2 — Set up the equivalents equation.** Let $w$ = mass of Al in grams, so $(1.67-w)$ = mass of Zn.\n\n' +
    '$\\frac{w}{27/3} + \\frac{1.67-w}{65.4/2} = \\frac{1.69}{11.2}$\n\n' +
    'On the right: 1 equivalent of $\\ce{H2}$ at NTP occupies $11.2$ L — half of the familiar $22.4$ L per *mole*, ' +
    'because each mole of $\\ce{H2}$ is worth 2 equivalents.\n\n' +
    '**Step 3 — Solve for $w$.**\n\n' +
    '$\\frac{w}{9} + \\frac{1.67-w}{32.7} = 0.1509$\n\n' +
    'Multiply every term by $9 \\times 32.7 = 294.3$ to clear both denominators at once:\n\n' +
    '$32.7w + 9(1.67-w) = 44.4$\n\n' +
    '$32.7w + 15.03 - 9w = 44.4$\n\n' +
    '$23.7w = 29.37 \\implies w = \\boxed{1.24\\ \\text{g of Al}}$\n\n' +
    '**Why this matters:** whenever two different substances produce the SAME third substance, equivalents (not ' +
    'moles) are what you are allowed to add directly — that is the entire reason the equivalent-weight system exists.'),
  worked(13,
    'Example — Equivalent Weight and Molecular Weight of an Unknown Acid',
    '$7.35$ g of a dibasic acid was dissolved in water and diluted to $250$ mL. $25$ mL of this solution was ' +
    'neutralised by $15$ mL of $N$ $\\ce{NaOH}$ solution. Calculate the equivalent weight and molecular weight of ' +
    'the acid.',
    "**Step 1 — Use 'equivalents of acid = equivalents of base' on just the 25 mL portion that was actually " +
    'titrated.**\n\n' +
    '$\\text{meq of NaOH} = 1\\ \\text{N} \\times 15\\ \\text{mL} = 15$\n\n' +
    '$\\text{meq of acid in 25 mL} = 15$\n\n' +
    '**Step 2 — Scale up to the full 250 mL solution.** 25 mL is $\\frac{1}{10}$ of 250 mL, so:\n\n' +
    '$\\text{meq of acid in 250 mL} = 15 \\times 10 = 150 \\implies \\text{equivalents} = 0.150$\n\n' +
    '**Step 3 — Find the equivalent weight from the mass and the equivalents.**\n\n' +
    '$\\text{Eq. wt.} = \\frac{\\text{mass}}{\\text{equivalents}} = \\frac{7.35}{0.150} = \\boxed{49\\ ' +
    '\\text{g/equivalent}}$\n\n' +
    '**Step 4 — Use "dibasic" to get from equivalent weight to molecular weight.**\n\n' +
    "'Dibasic' means each molecule of the acid can donate **2** replaceable $\\ce{H+}$ — so:\n\n" +
    '$\\text{Mol. wt.} = \\text{Eq. wt.} \\times \\text{basicity} = 49 \\times 2 = \\boxed{98\\ \\text{g/mol}}$\n\n' +
    '**Why this matters:** equivalent weight and molecular weight are always related by a small whole-number factor ' +
    "— the basicity (for acids), acidity (for bases), or charge (for salts and redox species). Once you have " +
    "equivalent weight from a titration, always ask 'how many equivalents make up one whole molecule?' before you " +
    "are done."),
];

async function main() {
  await bw.withDb(async (db) => {
    const books = db.collection('books');
    const pages = db.collection('book_pages');
    const now = new Date();

    const book = await books.findOne({ slug: BOOK_SLUG });
    if (!book) throw new Error(`book not found: ${BOOK_SLUG}`);

    const existing = await pages.findOne({ book_id: book._id, slug: PAGE_SLUG });
    if (existing) { console.log('page already exists — skipping (idempotent):', PAGE_SLUG); return; }

    const maxPageNumber = await pages
      .find({ book_id: book._id, chapter_number: CHAPTER_NUMBER }, { projection: { page_number: 1 } })
      .sort({ page_number: -1 }).limit(1).toArray();
    const pageNumber = (maxPageNumber[0]?.page_number ?? -1) + 1;

    const doc = {
      _id: uuidv4(),
      book_id: book._id,
      chapter_number: CHAPTER_NUMBER,
      page_number: pageNumber,
      slug: PAGE_SLUG,
      title: 'Additional Practice — Beyond NCERT',
      subtitle: 'Optional mixed-concept problems — extra stoichiometry, a nomenclature drill, and several ' +
        'equivalent-weight/normality titration questions — for students who want to go beyond the NCERT syllabus. ' +
        'Full worked solutions, not just answers.',
      blocks,
      page_type: 'lesson',
      published: false,
      reading_time_min: bw.computeReadingTime(blocks),
      content_types: bw.computeContentTypes(blocks),
      tags: ['extra-practice', 'beyond-ncert', 'mixed-concepts'],
      deleted_at: null,
      created_at: now,
      updated_at: now,
    };
    await pages.insertOne(doc);
    console.log('created page', pageNumber, '·', PAGE_SLUG, '·', doc.reading_time_min, 'min ·', blocks.length, 'blocks');

    await books.updateOne(
      { _id: book._id, 'chapters.number': CHAPTER_NUMBER },
      { $push: { 'chapters.$.page_ids': doc._id }, $set: { updated_at: now } },
    );
    console.log('appended to chapter', CHAPTER_NUMBER, 'page_ids');
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
