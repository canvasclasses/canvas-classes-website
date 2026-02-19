const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_periodic';

function mkSCQ(id, diff, text, opts, cid, sol, tag) {
  return {
    _id: uuidv4(), display_id: id, type: 'SCQ',
    question_text: { markdown: text, latex_validated: false },
    options: [
      { id: 'a', text: opts[0], is_correct: cid === 'a' },
      { id: 'b', text: opts[1], is_correct: cid === 'b' },
      { id: 'c', text: opts[2], is_correct: cid === 'c' },
      { id: 'd', text: opts[3], is_correct: cid === 'd' },
    ],
    answer: { correct_option: cid },
    solution: { text_markdown: sol, latex_validated: false },
    metadata: {
      difficulty: diff, chapter_id: CHAPTER_ID,
      tags: [{ tag_id: tag, weight: 1.0 }],
      exam_source: 'Other', is_pyq: false, is_top_pyq: false,
    },
    status: 'published', version: 1, quality_score: 85,
    needs_review: false, created_by: 'admin', updated_by: 'admin',
    created_at: new Date(), updated_at: new Date(), deleted_at: null,
  };
}

const questions = [

// Q12 — Identify X and Y using IE₁ and IE₂ values
mkSCQ('PERI-113', 'Medium',
`Identify the elements X and Y using the IE values given below:

| | $ \\mathrm{IE_1} $ (kJ/mol) | $ \\mathrm{IE_2} $ (kJ/mol) |
|---|---|---|
| X | 495 | 4563 |
| Y | 731 | 1450 |`,
[
  '$ \\mathrm{X = Na,\\; Y = Mg} $',
  '$ \\mathrm{X = Mg,\\; Y = F} $',
  '$ \\mathrm{X = Mg,\\; Y = Na} $',
  '$ \\mathrm{X = F,\\; Y = Mg} $',
],
'a',
`**Step 1: Analyse element X**

X has IE₁ = 495 kJ/mol (very low) and IE₂ = 4563 kJ/mol (very high).

The enormous jump from IE₁ to IE₂ indicates that after removing 1 electron, the next electron must be removed from a **noble gas core** (very stable inner shell). This is characteristic of a **Group 1 element** (alkali metal).

IE₁ = 495 kJ/mol matches **Sodium (Na)** ✓

**Step 2: Analyse element Y**

Y has IE₁ = 731 kJ/mol and IE₂ = 1450 kJ/mol.

The ratio IE₂/IE₁ ≈ 2 — no dramatic jump, meaning both electrons are removed from the same outer shell. This is characteristic of a **Group 2 element** (alkaline earth metal).

IE₁ = 731 kJ/mol matches **Magnesium (Mg)** ✓

**Step 3: Conclusion**

$$\\mathrm{X = Na,\\quad Y = Mg}$$

**Final Answer: Option (a)**`,
'tag_periodic_3'),

// Q13 — Isoelectronic ions, lowest IE
mkSCQ('PERI-114', 'Medium',
`Which of the following isoelectronic ions has lowest IE?`,
[
  '$ \\mathrm{Cl^-} $',
  '$ \\mathrm{Ca^{2+}} $',
  '$ \\mathrm{K^+} $',
  '$ \\mathrm{S^{2-}} $',
],
'd',
`**Step 1: Identify the isoelectronic series**

All four ions have 18 electrons (isoelectronic with Ar):
- $ \\mathrm{S^{2-}} $: Z = 16, 18 electrons
- $ \\mathrm{Cl^-} $: Z = 17, 18 electrons
- $ \\mathrm{K^+} $: Z = 19, 18 electrons
- $ \\mathrm{Ca^{2+}} $: Z = 20, 18 electrons

**Step 2: IE of isoelectronic species**

For isoelectronic ions, **lower nuclear charge → weaker hold on electrons → lower IE**.

The ion with the **lowest nuclear charge** will have the lowest IE.

| Ion | Z | IE trend |
|---|---|---|
| $ \\mathrm{S^{2-}} $ | 16 | Lowest Z → Lowest IE |
| $ \\mathrm{Cl^-} $ | 17 | ↑ |
| $ \\mathrm{K^+} $ | 19 | ↑ |
| $ \\mathrm{Ca^{2+}} $ | 20 | Highest Z → Highest IE |

**Step 3: Conclusion**

$ \\mathrm{S^{2-}} $ has the lowest nuclear charge (Z=16) among these isoelectronic ions → **lowest IE**.

**Final Answer: Option (d)**`,
'tag_periodic_3'),

// Q14 — Boron has lower IE₁ than Be
mkSCQ('PERI-115', 'Medium',
`Boron has lower $ \\mathrm{IE_1} $ than Be. This is because:`,
[
  'of stable configuration of B from which $ e^- $ has to be removed',
  'p-orbitals are larger and strongly attracted towards nucleus',
  '2s orbital is closer to the nucleus than 2p orbital',
  '2p orbital has higher stability than 2s orbital',
],
'c',
`**Step 1: Electronic configurations**

- Be: $ 1s^2\\,2s^2 $ — outermost electron is in 2s
- B: $ 1s^2\\,2s^2\\,2p^1 $ — outermost electron is in 2p

**Step 2: Why 2p electron is easier to remove**

The **2s orbital penetrates closer to the nucleus** than the 2p orbital. This means:
- 2s electrons experience a **higher effective nuclear charge** (less shielded)
- 2p electrons are **more shielded** by the 2s electrons and are farther from the nucleus
- Therefore, the 2p electron in B is **easier to remove** than the 2s electron in Be

**Step 3: Conclusion**

$$\\mathrm{IE_1(B)} < \\mathrm{IE_1(Be)}$$

because the 2s orbital is **closer to the nucleus** than the 2p orbital, making the 2s electron in Be harder to remove.

**Final Answer: Option (c)**`,
'tag_periodic_3'),

// Q15 — Ionic mobility of alkali metal ions in aq. solution max for
mkSCQ('PERI-116', 'Easy',
`Ionic mobility of alkali metal ions in aqueous solution is maximum for`,
[
  '$ \\mathrm{K^+} $',
  '$ \\mathrm{Rb^+} $',
  '$ \\mathrm{Li^+} $',
  '$ \\mathrm{Na^+} $',
],
'b',
`**Step 1: Ionic mobility in aqueous solution**

Ionic mobility depends on the **effective size of the hydrated ion** in solution, not the bare ionic size.

**Step 2: Hydration and ionic size**

Smaller ions have a **higher charge density** → they attract more water molecules → they form a **larger hydration shell** → they move more slowly in solution.

| Ion | Bare ionic radius | Hydrated radius | Mobility |
|---|---|---|---|
| $ \\mathrm{Li^+} $ | Smallest | Largest hydrated | Lowest |
| $ \\mathrm{Na^+} $ | Small | Large hydrated | Low |
| $ \\mathrm{K^+} $ | Medium | Smaller hydrated | Higher |
| $ \\mathrm{Rb^+} $ | Largest | Smallest hydrated | **Highest** |

**Step 3: Conclusion**

$ \\mathrm{Rb^+} $ has the largest bare ionic radius → smallest hydrated radius → **maximum ionic mobility** in aqueous solution.

**Final Answer: Option (b) — Rb⁺**`,
'tag_periodic_2'),

// Q16 — Halogen that gets reduced most easily
mkSCQ('PERI-117', 'Easy',
`The halogen that gets reduced most easily is`,
[
  '$ \\mathrm{F_2} $',
  '$ \\mathrm{Cl_2} $',
  '$ \\mathrm{Br_2} $',
  '$ \\mathrm{I_2} $',
],
'a',
`**Step 1: Reduction of halogens**

"Getting reduced most easily" means the halogen has the **highest tendency to gain electrons** (highest oxidizing power / most positive reduction potential).

**Step 2: Trend in halogens**

Oxidizing power of halogens decreases down the group:

$$\\mathrm{F_2} > \\mathrm{Cl_2} > \\mathrm{Br_2} > \\mathrm{I_2}$$

**Step 3: Why F₂ is the strongest oxidizing agent**

- F has the highest electronegativity (4.0)
- F–F bond is weak (low bond dissociation energy)
- F⁻ is the most stable anion (smallest, highest charge density)
- Standard reduction potential: $ E^\\circ(\\mathrm{F_2/F^-}) = +2.87 $ V (highest among halogens)

**Step 4: Conclusion**

$ \\mathrm{F_2} $ gets **reduced most easily** (is the strongest oxidizing agent).

**Final Answer: Option (a)**`,
'tag_periodic_4'),

// Q17 — Sudden large jump between IE₂ and IE₃ → electronic config
mkSCQ('PERI-118', 'Medium',
`A sudden large jump between the $ \\mathrm{IE_2} $ and $ \\mathrm{IE_3} $ of an element would be associated with the electronic configuration`,
[
  '$ 1s^2\\,2s^2\\,2p^6\\,3s^2 $',
  '$ 1s^2\\,2s^2\\,2p^6\\,3s^1 $',
  '$ 1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^1 $',
  '$ 1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^2 $',
],
'a',
`**Step 1: Interpret the large jump**

A large jump between IE₂ and IE₃ means:
- The 1st and 2nd electrons are removed relatively easily (from the outermost shell)
- The 3rd electron requires much more energy (it is being removed from an inner, more stable shell)

This indicates the element has **2 valence electrons** → **Group 2 element**.

**Step 2: Match with configurations**

| Option | Valence electrons | Group |
|---|---|---|
| (a) $ 1s^2\\,2s^2\\,2p^6\\,3s^2 $ | 2 (in 3s) | Group 2 ✓ |
| (b) $ 1s^2\\,2s^2\\,2p^6\\,3s^1 $ | 1 (in 3s) | Group 1 |
| (c) $ 1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^1 $ | 3 | Group 13 |
| (d) $ 1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^2 $ | 4 | Group 14 |

**Step 3: Conclusion**

Option (a) has 2 valence electrons in 3s. After removing both 3s electrons (IE₁ and IE₂), the 3rd electron must come from the 2p subshell (inner shell) → **large jump between IE₂ and IE₃**.

This is **Magnesium (Mg)**, Z = 12.

**Final Answer: Option (a)**`,
'tag_periodic_3'),

// Q18 — Electronic config of 4 elements, select incorrect statement
mkSCQ('PERI-119', 'Hard',
`The electronic configurations of 4 elements are:\n\n① $ [\\mathrm{Xe}]\\,5s^1 $\n② $ [\\mathrm{Xe}]\\,4f^{14}\\,5d^1\\,6s^2 $\n③ $ [\\mathrm{Ar}]\\,4s^2\\,4p^5 $\n④ $ [\\mathrm{Ar}]\\,3d^7\\,4s^2 $\n\nSelect the **incorrect** statement about these elements`,
[
  '① is a strong reducing agent',
  '② is a d-block element',
  '③ has a high magnitude of $ \\Delta H_{\\mathrm{eg}} $',
  '④ exhibits variable oxidation states',
],
'b',
`**Step 1: Identify each element**

- **①** $ [\\mathrm{Xe}]\\,5s^1 $ → **Cs** (Z=55), Group 1 alkali metal
- **②** $ [\\mathrm{Xe}]\\,4f^{14}\\,5d^1\\,6s^2 $ → **Lu** (Lutetium, Z=71), last lanthanoid
- **③** $ [\\mathrm{Ar}]\\,4s^2\\,4p^5 $ → **Br** (Bromine, Z=35), Group 17 halogen
- **④** $ [\\mathrm{Ar}]\\,3d^7\\,4s^2 $ → **Co** (Cobalt, Z=27), d-block transition metal

**Step 2: Evaluate each statement**

**(a) ① is a strong reducing agent** — Cs is an alkali metal with very low IE → readily loses electrons → **strong reducing agent** ✓ (Correct statement)

**(b) ② is a d-block element** — Lu has configuration $ [\\mathrm{Xe}]\\,4f^{14}\\,5d^1\\,6s^2 $. The **last electron enters the 4f subshell** (in the lanthanoid series), so Lu is an **f-block element** (lanthanoid), NOT a d-block element. ✗ **(Incorrect statement)**

**(c) ③ has high magnitude of $ \\Delta H_{\\mathrm{eg}} $** — Br is a halogen; halogens have high electron gain enthalpy (highly negative $ \\Delta H_{\\mathrm{eg}} $) ✓ (Correct statement)

**(d) ④ exhibits variable oxidation states** — Co (d-block) shows +2, +3 oxidation states ✓ (Correct statement)

**Final Answer: Option (b) — ② is incorrectly called a d-block element; it is an f-block element**`,
'tag_periodic_6'),

// Q19 — O²⁻ formation unfavorable due to e⁻ repulsion
mkSCQ('PERI-120', 'Hard',
`$ \\mathrm{O(g) + e^- \\to O^-(g)} $; $ \\Delta H^\\circ = -141 $ kJ mol$ ^{-1} $\n\n$ \\mathrm{O^-(g) + e^- \\to O^{2-}(g)} $; $ \\Delta H^\\circ = +780 $ kJ mol$ ^{-1} $\n\nThus the process of formation of $ \\mathrm{O^{2-}(g)} $ is unfavorable even though $ \\mathrm{O^{2-}} $ is isoelectronic with neon. It is due to the fact that`,
[
  'Oxygen is more electronegative',
  'Addition of $ e^- $ in oxygen results in larger size of the ion',
  '$ e^- $ repulsion outweighs the stability gained by achieving noble gas configuration',
  '$ \\mathrm{O^-} $ ion has comparatively smaller size than oxygen atom',
],
'c',
`**Step 1: Analyse the two steps**

- **Step 1:** $ \\mathrm{O + e^- \\to O^-} $; $ \\Delta H = -141 $ kJ/mol (exothermic — favorable)
- **Step 2:** $ \\mathrm{O^- + e^- \\to O^{2-}} $; $ \\Delta H = +780 $ kJ/mol (endothermic — unfavorable)

**Step 2: Why is the second step unfavorable?**

The $ \\mathrm{O^-} $ ion already has a negative charge. Adding another electron means:
- The incoming electron must enter an already **negatively charged ion**
- The **electron-electron repulsion** between the existing 9 electrons and the incoming electron is very large
- This repulsion **outweighs** the stability gained by achieving the noble gas (Ne) configuration

**Step 3: Evaluate options**

- **(a)** Electronegativity is a property of neutral atoms, not relevant here.
- **(b)** Size increase is a consequence, not the cause of unfavorability.
- **(c) ✓** Electron repulsion in the already negatively charged O⁻ outweighs the stability of noble gas configuration — this is the correct reason.
- **(d)** O⁻ is actually larger than O atom (adding electrons increases size).

**Final Answer: Option (c)**`,
'tag_periodic_4'),

// Q20 — Decreasing acidic nature of oxides
mkSCQ('PERI-121', 'Hard',
`Which of the following sequences correctly represents the decreasing acidic nature of oxides?`,
[
  '$ \\mathrm{Li_2O > BeO > CO_2 > N_2O_3 > B_2O_3} $',
  '$ \\mathrm{CO_2 > N_2O_3 > B_2O_3 > Li_2O > BeO} $',
  '$ \\mathrm{N_2O_3 > CO_2 > B_2O_3 > BeO > Li_2O} $',
  '$ \\mathrm{CO_2 > BeO > Li_2O > B_2O_3 > N_2O_3} $',
],
'c',
`**Step 1: Nature of oxides across Period 2**

Across Period 2 (left to right), the nature of oxides changes from **basic → amphoteric → acidic**:

| Element | Oxide | Nature |
|---|---|---|
| Li | $ \\mathrm{Li_2O} $ | Strongly basic |
| Be | $ \\mathrm{BeO} $ | Amphoteric |
| B | $ \\mathrm{B_2O_3} $ | Weakly acidic |
| C | $ \\mathrm{CO_2} $ | Acidic |
| N | $ \\mathrm{N_2O_3} $ | More acidic |

**Step 2: Order of acidic character**

As we move from Li → N across Period 2, non-metallic character increases → oxides become more acidic:

$$\\mathrm{N_2O_3 > CO_2 > B_2O_3 > BeO > Li_2O}$$

(Decreasing acidic nature = increasing basic nature from left to right in this sequence)

**Step 3: Verify**

- N₂O₃ is the most acidic (non-metal oxide, high oxidation state)
- Li₂O is the most basic (alkali metal oxide)
- BeO is amphoteric (less acidic than B₂O₃)

**Final Answer: Option (c)**`,
'tag_periodic_5'),

// Q (Image 7) — Incorrect statement about 1st IE
mkSCQ('PERI-122', 'Hard',
`The incorrect statement is`,
[
  'the 1st IE of K is less than that of Na and Li',
  'Xe doesn\'t have the lowest 1st IE in its group',
  'the 1st IE of element with Z = 37 is lower than that of the element with Z = 38',
  'the 1st IE of Ga is higher than that of the d-block element with Z = 30',
],
'd',
`**Step 1: Evaluate each statement**

**(a) IE₁(K) < IE₁(Na) < IE₁(Li)**

IE₁ decreases down Group 1 (Li → Na → K) as atomic size increases. So IE₁(K) < IE₁(Na) < IE₁(Li). ✓ **Correct statement**

**(b) Xe doesn't have the lowest 1st IE in its group**

Noble gases Group 18: He, Ne, Ar, Kr, Xe, Rn. IE₁ generally decreases down the group, so Rn has the lowest IE₁ in Group 18, not Xe. ✓ **Correct statement**

**(c) IE₁(Z=37) < IE₁(Z=38)**

Z=37 is Rb (Group 1), Z=38 is Sr (Group 2). IE₁ increases across a period, so IE₁(Rb) < IE₁(Sr). ✓ **Correct statement**

**(d) IE₁(Ga) > IE₁(Zn)**

Z=30 is Zn ($ [\\mathrm{Ar}]\\,3d^{10}\\,4s^2 $), Z=31 is Ga ($ [\\mathrm{Ar}]\\,3d^{10}\\,4s^2\\,4p^1 $).

- Zn has a completely filled $ 3d^{10}\\,4s^2 $ configuration — extra stability
- Ga's outermost electron is in 4p, which is higher in energy and more shielded
- Therefore IE₁(Ga) < IE₁(Zn) ✗

The statement says IE₁(Ga) > IE₁(d-block element with Z=30), which is **incorrect**.

**Final Answer: Option (d)**`,
'tag_periodic_3'),

// Q (Image 7) — Pairs with nearly same electron gain enthalpy
mkSCQ('PERI-123', 'Medium',
`In which of the following pairs, electron gain enthalpies of constituent elements are nearly the same or identical?\n\nA: Rb & Cs\nB: Na & K\nC: Ar & Kr\nD: I & At\n\nChoose the correct answer:`,
[
  'A and B only',
  'B and C only',
  'A and C only',
  'C and D only',
],
'c',
`**Step 1: Recall electron gain enthalpy trends**

Electron gain enthalpy (EGE) generally becomes less negative down a group (less tendency to gain electrons). However, there are notable exceptions.

**Step 2: Evaluate each pair**

**Pair A: Rb & Cs**

Both are large alkali metals in Period 5 and 6. Their EGE values are very small and nearly identical (both ≈ −47 kJ/mol). ✓

**Pair B: Na & K**

Na (Period 3) and K (Period 4) have different sizes and EGE values. Na: −53 kJ/mol, K: −48 kJ/mol. Not identical. ✗

**Pair C: Ar & Kr**

Noble gases have very low (nearly zero or slightly positive) EGE values since they have completely filled shells. Ar and Kr both have EGE ≈ 0 (or very slightly positive). ✓

**Pair D: I & At**

I has EGE = −295 kJ/mol; At has a much lower magnitude. Not nearly the same. ✗

**Step 3: Conclusion**

Pairs A and C have nearly identical electron gain enthalpies.

**Final Answer: Option (c)**`,
'tag_periodic_4'),

// Q (Image 7) — Correct order of atomic radii: Ce, Eu, Ho, N
mkSCQ('PERI-124', 'Hard',
`The correct order of atomic radii is:`,
[
  '$ \\mathrm{Ce > Eu > Ho > N} $',
  '$ \\mathrm{N > Ce > Eu > Ho} $',
  '$ \\mathrm{Ho > N > Eu > Ce} $',
  '$ \\mathrm{Eu > Ce > Ho > N} $',
],
'd',
`**Step 1: Identify the elements**

- N (Nitrogen): Z=7, Period 2, non-metal, very small atom (~65 pm)
- Ce (Cerium): Z=58, lanthanoid, large atom (~185 pm)
- Eu (Europium): Z=63, lanthanoid, large atom (~185 pm, anomalously large due to half-filled 4f⁷)
- Ho (Holmium): Z=67, lanthanoid, smaller due to lanthanoid contraction (~176 pm)

**Step 2: Lanthanoid contraction**

Across the lanthanoid series, ionic/atomic radii decrease due to poor shielding by 4f electrons. However, **Eu** is an exception — it has a half-filled $ 4f^7 $ configuration, which gives it an anomalously **larger** atomic radius (similar to Sm and Gd region, but Eu specifically has a larger radius due to its divalent metallic state in the solid).

**Step 3: Order**

$$r(\\mathrm{Eu}) > r(\\mathrm{Ce}) > r(\\mathrm{Ho}) > r(\\mathrm{N})$$

- Eu > Ce: Eu has anomalously large radius due to half-filled 4f⁷
- Ce > Ho: lanthanoid contraction makes Ho smaller than Ce
- Ho >> N: all lanthanoids are much larger than Period 2 non-metals

**Final Answer: Option (d)**`,
'tag_periodic_2'),

// Q (Image 7) — Set with compounds of different nature
mkSCQ('PERI-125', 'Medium',
`The set in which compounds have different nature is:`,
[
  '$ \\mathrm{B(OH)_3} $ and $ \\mathrm{H_3PO_3} $',
  '$ \\mathrm{B(OH)_3} $ and $ \\mathrm{Al(OH)_3} $',
  '$ \\mathrm{NaOH} $ and $ \\mathrm{Ca(OH)_2} $',
  '$ \\mathrm{Be(OH)_2} $ and $ \\mathrm{Al(OH)_3} $',
],
'b',
`**Step 1: Determine the nature of each compound**

**(a) B(OH)₃ and H₃PO₃**
- $ \\mathrm{B(OH)_3} $ (Boric acid): **acidic** (Lewis acid)
- $ \\mathrm{H_3PO_3} $ (Phosphorous acid): **acidic**
- Same nature ✓

**(b) B(OH)₃ and Al(OH)₃**
- $ \\mathrm{B(OH)_3} $: **acidic** (acts as Lewis acid, accepts OH⁻)
- $ \\mathrm{Al(OH)_3} $: **amphoteric** (reacts with both acids and bases)
- **Different nature** ✗ → This is the answer

**(c) NaOH and Ca(OH)₂**
- NaOH: **basic** (strong base)
- Ca(OH)₂: **basic** (moderate base)
- Same nature ✓

**(d) Be(OH)₂ and Al(OH)₃**
- $ \\mathrm{Be(OH)_2} $: **amphoteric**
- $ \\mathrm{Al(OH)_3} $: **amphoteric**
- Same nature ✓

**Step 2: Conclusion**

In option (b), B(OH)₃ is acidic while Al(OH)₃ is amphoteric — they have **different natures**.

**Final Answer: Option (b)**`,
'tag_periodic_5'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
