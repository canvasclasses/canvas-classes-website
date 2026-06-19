/**
 * Ionic Equilibrium (ch11_ionic_eq) flashcard deck — Class 11 Physical Chemistry.
 *
 * Authoring philosophy (see CLAUDE.md memory + insert_mole_concept.js):
 *  1. Concept / law / formula / graph / shortcut coverage.
 *  2. Conceptual-gap cards (same idea, different framing) — where students fumble.
 *  3. "What if" application cards — depth probe.
 *
 * IDs continue FLASH-PHY-XXXX sequence. Previous tail: 0529 (Mole Concept).
 * Diagram-needs are collected into a JSON file at the end, then pushed to Notion.
 */
const fs = require('fs');
const dotenv = require('dotenv'); dotenv.config({ path: '.env.local' });
const mongoose = require('mongoose');

const CHAPTER = { id: 'ch11_ionic_eq', name: 'Ionic Equilibrium', category: 'Physical Chemistry' };
const SOURCE = 'Canvas Chemistry';
const CLASS_NUM = 11;
const ID_START = 530;
const STAMP = new Date();

const cards = [];
const wishlist = [];
let idCursor = ID_START;
function add(topic, order, q, a, difficulty, tags = [], diagram = null) {
  const id = `FLASH-PHY-${String(idCursor).padStart(4, '0')}`;
  idCursor++;
  cards.push({
    flashcard_id: id,
    chapter: CHAPTER,
    topic: { name: topic, order },
    question: q.trim(),
    answer: a.trim(),
    metadata: { difficulty, tags, source: SOURCE, class_num: CLASS_NUM, created_at: STAMP, updated_at: STAMP },
    deleted_at: null,
  });
  if (diagram) wishlist.push({ flashcard_id: id, topic, ...diagram });
}

// ════════════ TOPIC 1: Acid-Base Theories & Conjugates ════════════
const T1 = 'Acid-Base Theories & Conjugate Pairs';

add(T1, 1,
  'State the **Arrhenius** definition of acid and base. What is its key limitation?',
  '- **Acid:** substance that gives $H^+$ in water.\n- **Base:** substance that gives $OH^-$ in water.\n\n**Limitation:** restricted to aqueous solutions and cannot explain bases like $NH_3$ (no $OH^-$ in its formula) or non-aqueous acid-base reactions.',
  'easy', ['theories']);

add(T1, 1,
  'State the **Brønsted-Lowry** definition.',
  '- **Acid:** proton ($H^+$) **donor**.\n- **Base:** proton **acceptor**.\n\nThis broadened acid-base behaviour beyond water — works in any solvent (or even in the gas phase).',
  'easy', ['theories']);

add(T1, 1,
  'State the **Lewis** definition. Why is it the most general?',
  '- **Acid:** electron-pair **acceptor**.\n- **Base:** electron-pair **donor**.\n\nMost general because it doesn\'t require protons at all — covers reactions like $BF_3 + NH_3$ (no $H^+$ transferred). Every Brønsted acid is a Lewis acid, but not vice versa.',
  'medium', ['theories']);

add(T1, 1,
  '**Conceptual gap:** Is $NH_3$ a Brønsted base, a Lewis base, or both? Justify in each framework.',
  '**Both.**\n- *Brønsted base:* $NH_3 + H^+ \\to NH_4^+$ — it accepts a proton.\n- *Lewis base:* It donates its lone pair on N to form the new N–H bond.\n\nBoth descriptions are correct simultaneously — they\'re different lenses on the same chemistry.',
  'medium', ['theories', 'conceptual']);

add(T1, 1,
  '**Trap card:** Is $BF_3$ a Brønsted acid?',
  '**No** — $BF_3$ has no $H^+$ to donate. It IS a **Lewis acid** (B has an empty orbital, accepts electron pair from a Lewis base like $NH_3$). This is the classic example of why Lewis theory is needed.',
  'medium', ['theories', 'conceptual']);

add(T1, 1,
  'Define **conjugate acid-base pair** with an example.',
  'When a Brønsted acid donates $H^+$, it becomes its **conjugate base** (and vice versa). They differ by exactly one $H^+$.\n\nExample: $HCl / Cl^-$, $H_2O / OH^-$, $NH_4^+ / NH_3$.\n\nGeneral rule: $\\text{Acid} \\rightleftharpoons \\text{H}^+ + \\text{Conjugate base}$.',
  'easy', ['conjugate', 'theories']);

add(T1, 1,
  '**Conceptual gap:** Stronger the acid, ____ its conjugate base. Why?',
  '**Weaker** its conjugate base.\n\nReason: A strong acid like $HCl$ "wants" to lose $H^+$ → its conjugate base $Cl^-$ has very little tendency to take $H^+$ back → effectively no basic strength.\n\nThis is why $Cl^-$, $Br^-$, $I^-$, $NO_3^-$, $ClO_4^-$ (conjugates of strong acids) are non-basic in water.',
  'medium', ['conjugate', 'conceptual']);

add(T1, 1,
  '**What if** — Water reacts with itself ( $H_2O + H_2O \\rightleftharpoons H_3O^+ + OH^-$ ). Identify the acid, base, conjugate acid, conjugate base.',
  '- One $H_2O$ donates a proton → it\'s the **acid**; its conjugate base is $OH^-$.\n- The other $H_2O$ accepts a proton → it\'s the **base**; its conjugate acid is $H_3O^+$.\n\nWater is **amphiprotic** — can act as either, depending on partner.',
  'medium', ['conjugate', 'amphiprotic']);

add(T1, 1,
  'Distinguish **strong** and **weak** electrolytes — what is the *one* difference?',
  '**Degree of dissociation ( $\\alpha$ )** in solution.\n- **Strong:** $\\alpha \\approx 1$ (essentially fully dissociated). E.g. $HCl, NaOH, KCl$.\n- **Weak:** $\\alpha \\ll 1$ (only a small fraction ionizes). E.g. $CH_3COOH, NH_4OH, HF$.',
  'easy', ['electrolytes']);

// ════════════ TOPIC 2: Ostwald's Dilution Law & α ════════════
const T2 = 'Ostwald\'s Dilution Law & Degree of Dissociation';

add(T2, 2,
  'State **Ostwald\'s Dilution Law** for a weak monoprotic acid.',
  'For weak acid $HA \\rightleftharpoons H^+ + A^-$ at concentration $C$ and degree of dissociation $\\alpha$:\n\n$K_a = \\dfrac{C \\alpha^2}{1 - \\alpha}$\n\nFor $\\alpha \\ll 1$ (typical for weak acids), this simplifies to: $K_a \\approx C \\alpha^2 \\implies \\alpha \\approx \\sqrt{K_a / C}$.',
  'medium', ['ostwald', 'formula']);

add(T2, 2,
  '**Conceptual gap:** According to Ostwald\'s Law, what happens to $\\alpha$ as the solution is **diluted**?',
  '$\\alpha$ **increases** — because $\\alpha \\propto 1/\\sqrt{C}$.\n\nDilution drives the dissociation equilibrium forward (Le Chatelier on $HA \\rightleftharpoons H^+ + A^-$): fewer particles per unit volume means the system "splits" more to restore the equilibrium.',
  'medium', ['ostwald', 'conceptual']);

add(T2, 2,
  '**Trap card:** Does Ostwald\'s Dilution Law work well for *strong* electrolytes? Why or why not?',
  '**No.** Ostwald\'s law assumes $\\alpha < 1$ and equilibrium between dissociated and undissociated forms. Strong electrolytes are essentially 100% dissociated even in concentrated solution — there\'s no "undissociated form" to be in equilibrium with, so the law breaks down. Debye-Hückel handles strong electrolytes instead.',
  'hard', ['ostwald', 'conceptual']);

add(T2, 2,
  '**What if** — A 0.01 M solution of weak acid HA has $\\alpha = 0.04$. Find its $K_a$.',
  '$K_a \\approx C \\alpha^2 = 0.01 \\times (0.04)^2 = 0.01 \\times 1.6 \\times 10^{-3} = 1.6 \\times 10^{-5}$.\n\n(Approximation valid because $\\alpha = 0.04 \\ll 1$.)',
  'medium', ['ostwald', 'application']);

add(T2, 2,
  '**Shortcut** — Express $[H^+]$ for a weak monoprotic acid of concentration $C$ and $K_a$.',
  '$[H^+] = \\sqrt{K_a \\cdot C}$\n\nDerivation: $[H^+] = C\\alpha$ and $\\alpha = \\sqrt{K_a/C}$ → $[H^+] = C \\cdot \\sqrt{K_a/C} = \\sqrt{K_a C}$.',
  'medium', ['ostwald', 'shortcut']);

// ════════════ TOPIC 3: Ionic Product of Water & pH Scale ════════════
const T3 = 'Ionic Product of Water (Kw) & pH Scale';

add(T3, 3,
  'Define the **Ionic Product of Water** ( $K_w$ ) and give its value at 25 °C.',
  '$K_w = [H^+][OH^-]$\n\nAt 25 °C: $K_w = 10^{-14}$ (mol/L)$^2$.\n\nIn pure water at 25 °C: $[H^+] = [OH^-] = 10^{-7}$ M.',
  'easy', ['kw', 'formula']);

add(T3, 3,
  '**Conceptual gap:** Is $K_w$ constant?',
  '**$K_w$ is constant at a given temperature**, but it *changes with temperature* (since auto-ionization is endothermic). At 25 °C: $10^{-14}$. At 100 °C: $\\sim 10^{-12}$.\n\nIn any *aqueous* solution at 25 °C, $[H^+][OH^-] = 10^{-14}$ — regardless of dissolved acid/base.',
  'medium', ['kw', 'conceptual']);

add(T3, 3,
  '**What if** — Water is heated to 50 °C. $K_w$ becomes larger. What is the pH of *pure* water now?',
  'Pure water always has $[H^+] = [OH^-]$. Let it be $x$. Then $K_w = x^2 \\implies x = \\sqrt{K_w}$.\n\nAt 50 °C, $K_w \\approx 5.5 \\times 10^{-14} \\implies x \\approx 2.3 \\times 10^{-7}$.\n\npH $\\approx 6.6$ — *less than 7*, **but the water is still neutral** (because $[H^+] = [OH^-]$ still).',
  'hard', ['kw', 'pH', 'conceptual'],
  { side: 'Both', priority: 'Medium', description: 'Small chart showing Kw vs temperature (rising curve) and the corresponding pH-of-pure-water vs temperature (falling). Visually anchors the idea that "pure ≠ pH 7 at every temperature."', notes: 'Counterintuitive concept; visual reinforces the key insight.' });

add(T3, 3,
  'Define **pH** mathematically. What is the range it can take?',
  '$\\text{pH} = -\\log_{10}[H^+]$\n\n**Range is not bounded** to 0–14 — that\'s just the convenient *typical* range. Strongly concentrated acids can have pH < 0 (e.g. 10 M $HCl$ has pH ≈ −1), and concentrated bases can have pH > 14.',
  'easy', ['pH']);

add(T3, 3,
  'Relation between **pH and pOH** at 25 °C.',
  '$\\text{pH} + \\text{pOH} = 14$ (at 25 °C only)\n\nThis comes directly from $K_w = 10^{-14}$ — taking $-\\log$ of both sides of $[H^+][OH^-] = K_w$.',
  'easy', ['pH', 'formula']);

add(T3, 3,
  '**Conceptual gap:** Find the pH of $10^{-8}$ M HCl. Naive answer is 8 — why is that wrong?',
  'Naive: pH $= -\\log(10^{-8}) = 8$ ... but an *acid* cannot give pH > 7!\n\n**Why naive fails:** at such low concentrations, the $H^+$ from water auto-ionization is *not negligible* compared to $H^+$ from $HCl$.\n\n**Correct:** $[H^+]_{total} = [H^+]_{HCl} + [H^+]_{water} \\approx 10^{-8} + 10^{-7} \\approx 1.1 \\times 10^{-7}$ M.\n\npH $\\approx 6.96$ — just slightly below 7, as we\'d expect for a very dilute acid.',
  'hard', ['pH', 'conceptual']);

add(T3, 3,
  '**Shortcut** — $[H^+]$ given pH, and vice versa.',
  '- $[H^+] = 10^{-\\text{pH}}$\n- $\\text{pH} = -\\log_{10}[H^+]$\n\nQuick mental math: pH 2 → $[H^+] = 0.01$ M; pH 5 → $10^{-5}$ M. Each pH unit = factor of 10 in $[H^+]$.',
  'easy', ['pH', 'shortcut']);

// ════════════ TOPIC 4: pH of Acids & Bases (Strong, Weak, Mixed) ════════════
const T4 = 'pH of Strong & Weak Acids/Bases';

add(T4, 4,
  '**Shortcut** — pH of a strong *acid* of concentration $C$ (not too dilute).',
  '$\\text{pH} = -\\log C$\n\nValid when $C \\gtrsim 10^{-6}$ M; below that, water\'s $H^+$ becomes non-negligible (see "very dilute" card).',
  'easy', ['pH', 'shortcut']);

add(T4, 4,
  '**Shortcut** — pH of a strong *base* of concentration $C$.',
  '$\\text{pOH} = -\\log C \\implies \\text{pH} = 14 - \\text{pOH}$\n\nE.g. 0.01 M NaOH: pOH = 2, pH = 12.',
  'easy', ['pH', 'shortcut']);

add(T4, 4,
  '**Shortcut** — pH of a weak monoprotic acid of concentration $C$ and ionization constant $K_a$.',
  '$\\text{pH} = \\dfrac{1}{2}(pK_a - \\log C)$\n\nDerivation: $[H^+] = \\sqrt{K_a C}$; take $-\\log$ → $\\text{pH} = \\tfrac{1}{2}(pK_a + pC) = \\tfrac{1}{2}(pK_a - \\log C)$.',
  'medium', ['pH', 'shortcut']);

add(T4, 4,
  '**Shortcut** — pH of a weak base of concentration $C$ and $K_b$.',
  '$\\text{pOH} = \\dfrac{1}{2}(pK_b - \\log C)$, then $\\text{pH} = 14 - \\text{pOH}$.\n\nSymmetric to the weak-acid case.',
  'medium', ['pH', 'shortcut']);

add(T4, 4,
  '**What if** — Calculate pH of 0.1 M $CH_3COOH$ ($K_a = 1.8 \\times 10^{-5}$).',
  '$[H^+] = \\sqrt{K_a \\cdot C} = \\sqrt{1.8 \\times 10^{-5} \\times 0.1} = \\sqrt{1.8 \\times 10^{-6}} \\approx 1.34 \\times 10^{-3}$ M.\n\npH = $-\\log(1.34 \\times 10^{-3}) \\approx 2.87$.\n\nNote: way more than $-\\log(0.1) = 1$ — because acetic acid is weak, only ~1.3% dissociated.',
  'medium', ['pH', 'application']);

add(T4, 4,
  '**Conceptual gap:** 0.1 M HCl vs 0.1 M $CH_3COOH$. Which has more $H^+$? Lower pH?',
  '$HCl$ — fully dissociated, $[H^+] = 0.1$ M → pH = 1.\n\n$CH_3COOH$ — only ~1.3% dissociates → $[H^+] \\approx 1.3 \\times 10^{-3}$ M → pH ≈ 2.87.\n\n**Same concentration ≠ same pH.** Strength matters; this is why concentration alone tells you almost nothing about acidity for weak acids.',
  'medium', ['pH', 'conceptual']);

add(T4, 4,
  '**Polyprotic acid** — Why does pH of a polyprotic acid like $H_2SO_4$ depend mainly on the *first* dissociation?',
  'For a polyprotic acid: $H_2A \\to H^+ + HA^-$ (large $K_{a1}$), $HA^- \\to H^+ + A^{2-}$ (much smaller $K_{a2}$).\n\nUsually $K_{a1} \\gg K_{a2}$ (by factor $10^4$–$10^6$). So almost all $H^+$ comes from the first step, and the second step contributes negligibly to pH. (Exception: $H_2SO_4$ — both steps strong; behaves as a near-diprotic strong acid.)',
  'hard', ['pH', 'conceptual']);

// ════════════ TOPIC 5: Common Ion Effect ════════════
const T5 = 'Common Ion Effect';

add(T5, 5,
  'Define the **Common Ion Effect**.',
  'Suppression of the dissociation of a weak electrolyte when a *strong* electrolyte sharing a *common ion* is added to its solution. Le Chatelier in action — adding more product shifts the equilibrium back toward reactant.',
  'easy', ['common-ion']);

add(T5, 5,
  '**What if** — A solution of weak acid $CH_3COOH$ has its $[H^+]$ reduced by addition of $CH_3COONa$. Which way does the equilibrium shift?',
  'Equilibrium: $CH_3COOH \\rightleftharpoons CH_3COO^- + H^+$\n\nAdding $CH_3COONa$ floods the solution with $CH_3COO^-$ → by Le Chatelier the equilibrium shifts **left**, *suppressing* the acid\'s ionization → $[H^+]$ drops → pH rises.\n\nThis is the basis for **acid buffers**.',
  'medium', ['common-ion', 'application']);

add(T5, 5,
  '**Conceptual gap:** Does adding a common ion change $K_a$ of the weak acid?',
  '**No.** $K_a$ depends only on temperature.\n\nWhat changes is **$\\alpha$** (degree of dissociation), which falls. $K_a$ has the new equilibrium concentrations plugged back in — and they happen to satisfy the *same* $K_a$.',
  'medium', ['common-ion', 'conceptual']);

add(T5, 5,
  '**What if** — You have a saturated $AgCl$ solution. You now add solid $NaCl$. What happens to (a) $Ag^+$ concentration, (b) $K_{sp}$, (c) solubility of AgCl?',
  '- (a) $[Ag^+]$ **decreases** (common ion $Cl^-$ pushes $AgCl \\rightleftharpoons Ag^+ + Cl^-$ backward).\n- (b) $K_{sp}$ **unchanged** (depends only on T).\n- (c) **Solubility decreases** (less $AgCl$ can dissolve before $K_{sp}$ is reached).\n\nThis is exploited in qualitative analysis — adding $HCl$ to suppress $AgCl$ solubility for selective precipitation.',
  'hard', ['common-ion', 'ksp', 'application']);

// ════════════ TOPIC 6: Salt Hydrolysis ════════════
const T6 = 'Salt Hydrolysis & pH of Salt Solutions';

add(T6, 6,
  'List the **four types of salts** by parent acid/base and predict the pH of each in water.',
  '| Parent acid | Parent base | Example | pH |\n|---|---|---|---|\n| Strong | Strong | NaCl | **= 7** |\n| Strong | Weak | $NH_4Cl$ | **< 7** (acidic) |\n| Weak | Strong | $CH_3COONa$ | **> 7** (basic) |\n| Weak | Weak | $CH_3COONH_4$ | depends on $K_a$ vs $K_b$ |',
  'easy', ['hydrolysis']);

add(T6, 6,
  'Why does **$NH_4Cl$** dissolve in water to give an *acidic* solution?',
  '$NH_4Cl \\to NH_4^+ + Cl^-$. The $Cl^-$ is the conjugate base of strong acid $HCl$ → essentially non-basic. But the $NH_4^+$ is the conjugate acid of weak base $NH_3$ → it hydrolyzes:\n\n$NH_4^+ + H_2O \\rightleftharpoons NH_3 + H_3O^+$\n\nProducing $H_3O^+$ → solution becomes acidic.',
  'medium', ['hydrolysis']);

add(T6, 6,
  '**Conceptual gap:** Why is **NaCl** solution neutral while **$CH_3COONa$** is basic?',
  'Both contain $Na^+$ (conjugate of strong base NaOH — non-acidic) and an anion.\n- In $NaCl$: $Cl^-$ is conjugate of strong acid HCl → non-basic → solution stays neutral.\n- In $CH_3COONa$: $CH_3COO^-$ is conjugate of *weak* acid $CH_3COOH$ → it *is* basic → it hydrolyzes ($CH_3COO^- + H_2O \\rightleftharpoons CH_3COOH + OH^-$) → solution turns basic.',
  'medium', ['hydrolysis', 'conceptual']);

add(T6, 6,
  '**Formula** — Hydrolysis constant $K_h$ of a salt in terms of $K_a$ (or $K_b$) and $K_w$.',
  '- Salt of weak acid + strong base (e.g. $CH_3COONa$): $K_h = K_w / K_a$\n- Salt of strong acid + weak base (e.g. $NH_4Cl$): $K_h = K_w / K_b$\n- Salt of weak acid + weak base: $K_h = K_w / (K_a \\cdot K_b)$\n\nDerivation: write hydrolysis equilibrium, multiply numerator and denominator by $[H^+]$ or $[OH^-]$ and recognise the standard ratios.',
  'hard', ['hydrolysis', 'formula']);

add(T6, 6,
  '**Shortcut** — pH of a salt of *weak acid + strong base* (e.g. $CH_3COONa$).',
  '$\\text{pH} = \\dfrac{1}{2}\\left(pK_w + pK_a + \\log C\\right) = 7 + \\dfrac{1}{2}(pK_a + \\log C)$',
  'medium', ['hydrolysis', 'shortcut']);

add(T6, 6,
  '**Shortcut** — pH of a salt of *strong acid + weak base* (e.g. $NH_4Cl$).',
  '$\\text{pH} = \\dfrac{1}{2}\\left(pK_w - pK_b - \\log C\\right) = 7 - \\dfrac{1}{2}(pK_b + \\log C)$',
  'medium', ['hydrolysis', 'shortcut']);

add(T6, 6,
  '**Shortcut** — pH of a salt of *weak acid + weak base* (e.g. $CH_3COONH_4$). What\'s noteworthy?',
  '$\\text{pH} = \\dfrac{1}{2}(pK_w + pK_a - pK_b)$\n\n**Noteworthy:** pH is **independent of concentration $C$**! That\'s a striking feature unique to this case. The two hydrolyses (cation and anion) partially cancel.',
  'hard', ['hydrolysis', 'shortcut', 'conceptual']);

// ════════════ TOPIC 7: Buffer Solutions ════════════
const T7 = 'Buffer Solutions';

add(T7, 7,
  'What is a **Buffer Solution**?',
  'A solution that resists changes in pH when small amounts of acid or base are added (or on moderate dilution).\n\nTwo types:\n- **Acidic buffer:** weak acid + its salt with strong base (e.g. $CH_3COOH + CH_3COONa$).\n- **Basic buffer:** weak base + its salt with strong acid (e.g. $NH_4OH + NH_4Cl$).',
  'easy', ['buffer']);

add(T7, 7,
  'State the **Henderson-Hasselbalch equation** for an *acid* buffer.',
  '$\\text{pH} = pK_a + \\log \\dfrac{[\\text{salt}]}{[\\text{acid}]}$\n\nWhen $[\\text{salt}] = [\\text{acid}]$: pH = $pK_a$ exactly. Useful starting point.',
  'medium', ['buffer', 'henderson', 'formula']);

add(T7, 7,
  'State Henderson-Hasselbalch for a *basic* buffer.',
  '$\\text{pOH} = pK_b + \\log \\dfrac{[\\text{salt}]}{[\\text{base}]}$, then $\\text{pH} = 14 - \\text{pOH}$.\n\nSame form, just with $K_b$ and pOH.',
  'medium', ['buffer', 'henderson', 'formula']);

add(T7, 7,
  '**Conceptual gap:** Explain *mechanistically* how an acetate buffer ( $CH_3COOH + CH_3COONa$ ) absorbs added $H^+$ and added $OH^-$.',
  '- **Added $H^+$:** mopped up by acetate ions: $CH_3COO^- + H^+ \\to CH_3COOH$. Strong $H^+$ converted to weak acid → small pH change.\n- **Added $OH^-$:** mopped up by acetic acid: $CH_3COOH + OH^- \\to CH_3COO^- + H_2O$. Strong $OH^-$ converted to water + acetate → small pH change.\n\nThe pair acts as a "two-way sponge" — that\'s why both components must be present.',
  'medium', ['buffer', 'conceptual'],
  { side: 'Answer', priority: 'High', description: 'Two side-by-side cartoons: (LEFT) "Add H+" — incoming H+ caught by CH3COO-, becomes CH3COOH. (RIGHT) "Add OH-" — incoming OH- caught by CH3COOH, becomes H2O + CH3COO-. Arrows showing the equilibrium shift. Makes the "two-way sponge" mental model click.', notes: 'Buffer action is the #1 conceptual stumble in this chapter — a picture nails it.' });

add(T7, 7,
  '**What if** — When is buffer pH **most resistant** to acid/base addition (i.e. maximum buffer capacity)?',
  'When $[\\text{salt}] = [\\text{acid}]$ — i.e. pH = $pK_a$.\n\nReason: equal concentrations of conjugate pair give maximum capacity to absorb either added acid OR added base. Stray too far in either direction and one component runs out first.',
  'medium', ['buffer', 'conceptual']);

add(T7, 7,
  '**Shortcut** — Useful buffer range around $pK_a$.',
  'Henderson-Hasselbalch works well when the ratio $[\\text{salt}]/[\\text{acid}]$ is between 0.1 and 10 → useful range is **$pK_a \\pm 1$**.\n\nOutside this range, the buffer becomes weak (one component is too depleted).',
  'medium', ['buffer', 'shortcut']);

add(T7, 7,
  '**What if** — A buffer is diluted 10-fold with water. What happens to pH?',
  '**Negligible change.** Because Henderson uses a *ratio* $[\\text{salt}]/[\\text{acid}]$, both concentrations are diluted by the same factor — the ratio is unchanged → pH unchanged.\n\nThis is a key buffer property and a classic exam question.',
  'medium', ['buffer', 'conceptual']);

add(T7, 7,
  'Give one practically important buffer in **blood**, and its approximate pH.',
  'Carbonic acid / bicarbonate ($H_2CO_3 / HCO_3^-$) buffer in blood plasma. Maintains blood pH at **~7.4**, with very tight tolerance — deviation > 0.4 units is medically critical (acidosis or alkalosis).',
  'easy', ['buffer', 'biology']);

// ════════════ TOPIC 8: Solubility Product (Ksp) ════════════
const T8 = 'Solubility Product (Ksp)';

add(T8, 8,
  'Define **Solubility Product** ( $K_{sp}$ ) for a sparingly soluble salt $A_x B_y$.',
  'For $A_x B_y (s) \\rightleftharpoons xA^{m+} + yB^{n-}$:\n\n$K_{sp} = [A^{m+}]^x [B^{n-}]^y$\n\nIt is the equilibrium constant for the dissolution; depends only on temperature.',
  'easy', ['ksp', 'formula']);

add(T8, 8,
  '**Shortcut** — Relate molar solubility $s$ to $K_{sp}$ for: (a) $AB$, (b) $AB_2$, (c) $A_2B_3$.',
  '- $AB$: $K_{sp} = s^2 \\implies s = \\sqrt{K_{sp}}$\n- $AB_2$: $K_{sp} = s \\cdot (2s)^2 = 4s^3 \\implies s = (K_{sp}/4)^{1/3}$\n- $A_2B_3$: $K_{sp} = (2s)^2 (3s)^3 = 108 \\, s^5 \\implies s = (K_{sp}/108)^{1/5}$',
  'medium', ['ksp', 'shortcut']);

add(T8, 8,
  '**Conceptual gap:** $K_{sp}(AgCl) = 1.8 \\times 10^{-10}$; $K_{sp}(Ag_2CrO_4) = 1.1 \\times 10^{-12}$. Which is more soluble in *pure water*? (Trap: do NOT just compare $K_{sp}$.)',
  'You must compute *molar solubility*, not just compare $K_{sp}$, because they have different formulas:\n- $AgCl$ ( $AB$ type): $s = \\sqrt{1.8 \\times 10^{-10}} \\approx 1.34 \\times 10^{-5}$ M.\n- $Ag_2CrO_4$ ( $A_2B$ type): $K_{sp} = 4s^3 \\implies s = (1.1 \\times 10^{-12}/4)^{1/3} \\approx 6.5 \\times 10^{-5}$ M.\n\n$Ag_2CrO_4$ is *more* soluble even though its $K_{sp}$ is smaller! Classic trap.',
  'hard', ['ksp', 'conceptual']);

add(T8, 8,
  '**Precipitation condition** — When does a precipitate form?',
  'Compute the **ionic product (Q)** = product of current ion concentrations raised to their stoichiometric powers.\n\n- $Q < K_{sp}$ → unsaturated, no precipitate.\n- $Q = K_{sp}$ → saturated, equilibrium.\n- $Q > K_{sp}$ → supersaturated, **precipitate forms** until $Q$ drops to $K_{sp}$.',
  'medium', ['ksp']);

add(T8, 8,
  '**What if** — Mix equal volumes of $10^{-4}$ M $Ba^{2+}$ and $10^{-4}$ M $SO_4^{2-}$. Will $BaSO_4$ ( $K_{sp} = 1.1 \\times 10^{-10}$ ) precipitate?',
  'On mixing equal volumes, each ion is *halved*: $[Ba^{2+}] = [SO_4^{2-}] = 5 \\times 10^{-5}$ M.\n\n$Q = (5 \\times 10^{-5})^2 = 2.5 \\times 10^{-9}$.\n\n$Q > K_{sp}$ ($2.5 \\times 10^{-9} > 1.1 \\times 10^{-10}$) → **yes, precipitation occurs**.',
  'medium', ['ksp', 'application']);

add(T8, 8,
  '**Conceptual gap:** Solubility of $AgCl$ in 0.1 M $NaCl$ vs in pure water. Compare without computing.',
  'Solubility in 0.1 M NaCl is **much smaller** than in pure water, because the high common-ion ($Cl^-$) concentration suppresses dissolution.\n\nQualitatively: in pure water, $s \\approx 10^{-5}$ M. In 0.1 M NaCl: $s \\approx K_{sp}/0.1 \\approx 10^{-9}$ M — drops by a factor of ~10,000. Same $K_{sp}$, vastly different solubility.',
  'medium', ['ksp', 'common-ion', 'conceptual']);

add(T8, 8,
  '**Selective precipitation** — If a solution contains two cations with very different $K_{sp}$ values for their respective salts (e.g. with $S^{2-}$), how can we separate them?',
  'Carefully control the precipitating ion concentration so that **only one** crosses its $K_{sp}$ threshold while the other stays below.\n\nClassic example (qualitative salt analysis): in acidic $H_2S$ ($[S^{2-}]$ is small), $Cu^{2+}$ ($K_{sp}$ very small) precipitates as $CuS$ but $Zn^{2+}$ ($K_{sp}$ much larger) doesn\'t. Switch to basic $H_2S$ (more $S^{2-}$) — now $Zn^{2+}$ also precipitates as $ZnS$. This is the basis of Group separation in qualitative analysis.',
  'hard', ['ksp', 'selective-precip', 'application'],
  { side: 'Answer', priority: 'High', description: 'Vertical bar chart showing log[S2-] threshold for precipitation of CuS (very low), HgS (very low), PbS (low), ZnS (higher), MnS (highest). Two horizontal lines marking [S2-] in acidic H2S vs basic H2S, intersecting different bars. Shows visually why CuS precipitates in acidic medium but ZnS only in basic.', notes: 'This concept underpins all qualitative inorganic analysis — a visual is high-leverage.' });

// ════════════ TOPIC 9: Titrations & Indicators ════════════
const T9 = 'Titration Curves & Indicators';

add(T9, 9,
  'Sketch (verbally) and describe the **strong-acid + strong-base** titration curve.',
  'pH rises slowly at first (acid dominates, pH ~1–2), then **steep vertical jump** at the equivalence point spanning ~pH 3 → 11, then levels off in basic region (pH ~12–13).\n\nEquivalence point pH = **exactly 7** (salt of strong acid + strong base — no hydrolysis).',
  'medium', ['titration'],
  { side: 'Answer', priority: 'High', description: 'pH vs volume-of-base curve: starts at ~1, climbs slowly, sharp vertical rise around equivalence point at pH 7, plateaus near 13. Mark "Equivalence point pH=7" clearly. This is the canonical titration plot.', notes: 'Titration curves are inherently graphical — text-only descriptions fail.' });

add(T9, 9,
  '**What if** — Titrating *weak acid + strong base* (e.g. $CH_3COOH$ vs $NaOH$). Where is the equivalence point pH — exactly 7, above, or below?',
  '**Above 7** (basic). At equivalence, the solution contains the salt of weak acid + strong base ($CH_3COONa$) — which hydrolyzes to give a basic solution.\n\nAlso: the curve has a *buffer region* (gentle slope) midway, centered at pH = $pK_a$. The vertical jump at equivalence is shorter than in strong-strong case.',
  'medium', ['titration', 'conceptual'],
  { side: 'Answer', priority: 'High', description: 'pH vs volume curve for weak acid + strong base: starts at ~3, gentle buffer-region plateau around pH=pKa (mark this!), then jump to equivalence at pH ~8.5 (mark "Equivalence > 7"), levels off at ~12. Comparing with strong-strong case side-by-side would be even better.', notes: 'Pairs with the strong-strong card.' });

add(T9, 9,
  '**Conceptual gap:** How do we choose an indicator for a titration?',
  'The indicator\'s color-change range (its $pK_{In} \\pm 1$) must lie **within the steep vertical jump** of the titration curve. Then a single drop of titrant flips the color sharply, marking the equivalence point.\n\nExamples:\n- Strong-acid + strong-base: pH jump spans 4–10 → phenolphthalein (pH 8–10) OR methyl orange (pH 3.1–4.4) both work.\n- Weak-acid + strong-base: jump centred near pH 8.5 → use **phenolphthalein** (matches), not methyl orange (too low).',
  'hard', ['titration', 'indicators', 'conceptual']);

add(T9, 9,
  'Working principle of **acid-base indicators** (one-line theory).',
  'An indicator is a weak acid (or weak base) whose acidic form (HIn) and basic form ($In^-$) have **different colors**. The equilibrium $HIn \\rightleftharpoons H^+ + In^-$ shifts with pH; the dominant form (and thus color) changes near $pH \\approx pK_{In}$.\n\nColor-change range: roughly $pK_{In} \\pm 1$.',
  'medium', ['indicators']);

add(T9, 9,
  'Color changes of **phenolphthalein** and **methyl orange**.',
  '- **Phenolphthalein:** colorless (acidic, pH < 8.2) → pink (basic, pH > 10). Range ~8.2–10.\n- **Methyl orange:** red (acidic, pH < 3.1) → yellow (basic, pH > 4.4). Range ~3.1–4.4.',
  'easy', ['indicators']);

// ────────── INSERT ──────────
(async () => {
  console.log(`Prepared ${cards.length} cards for ch11_ionic_eq (FLASH-PHY-${String(ID_START).padStart(4,'0')} → FLASH-PHY-${String(idCursor-1).padStart(4,'0')})`);

  const bad = cards.filter(c => /\$\$/.test(c.question) || /\$\$/.test(c.answer));
  if (bad.length) { console.error('FORBIDDEN $$', bad.map(b => b.flashcard_id)); process.exit(1); }

  await mongoose.connect(process.env.MONGODB_URI);
  const c = mongoose.connection.db.collection('flashcards');

  const ids = cards.map(c => c.flashcard_id);
  const existing = await c.find({ flashcard_id: { $in: ids } }).toArray();
  if (existing.length) { console.error('COLLISION', existing.map(e => e.flashcard_id)); process.exit(1); }

  if (process.argv.includes('--dry-run')) {
    console.log('Difficulty mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{})));
    console.log(`Wishlist entries: ${wishlist.length}`);
    await mongoose.disconnect(); return;
  }

  const res = await c.insertMany(cards, { ordered: true });
  console.log(`Inserted: ${res.insertedCount}`);
  console.log('Difficulty mix:', JSON.stringify(cards.reduce((a,c)=>{a[c.metadata.difficulty]=(a[c.metadata.difficulty]||0)+1;return a;},{})));

  // Dump wishlist for downstream Notion push
  const wlPath = `_agents/snapshots/flashcards_diagrams_wishlist_${CHAPTER.id}.json`;
  fs.writeFileSync(wlPath, JSON.stringify(wishlist, null, 2));
  console.log(`Wishlist: ${wishlist.length} entries → ${wlPath}`);

  console.log(`ROLLBACK: db.flashcards.deleteMany({ flashcard_id: { $gte: "FLASH-PHY-${String(ID_START).padStart(4,'0')}", $lte: "FLASH-PHY-${String(idCursor-1).padStart(4,'0')}" } })`);

  await mongoose.disconnect();
})().catch(e => { console.error(e); process.exit(1); });
