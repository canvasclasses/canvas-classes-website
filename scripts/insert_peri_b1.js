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

// Q1 — Long form of periodic table: true statement
mkSCQ('PERI-103', 'Easy',
`The statement that is true for the long form of the periodic table is`,
[
  'it reflects the sequence of filling the $ e^- $ in the order of sub-energy levels s, p, d and f',
  'it helps to predict the stable valency states of the elements',
  'it reflects trends in physical and chemical properties of the elements',
  'all of the above',
],
'c',
`**Step 1: Evaluate each option**

**Option (a):** The long form of the periodic table does reflect the filling sequence of sub-energy levels (s, p, d, f). However, this is not the *only* true statement, and option (d) "all of the above" would only be correct if all three are true.

**Option (b):** The periodic table helps predict valency states, but it does not always predict *stable* valency states reliably (e.g., transition metals have variable valency).

**Option (c):** The long form of the periodic table clearly reflects **trends in physical and chemical properties** of elements — atomic radius decreases across a period, ionization energy increases across a period, metallic character decreases across a period, etc. This is the primary and most universally correct purpose of the long form.

**Option (d):** Not all of the above are strictly correct — option (b) is partially incorrect.

**Step 2: Conclusion**

The most accurate and universally accepted statement is **(c)** — the long form reflects trends in physical and chemical properties.

**Final Answer: Option (c)**`,
'tag_periodic_1'),

// Q2 — Period number = max principal quantum number
mkSCQ('PERI-104', 'Easy',
`The period number in the long form of periodic table is equal to`,
[
  'magnetic quantum number of any element of the period',
  'atomic number of any element of the period',
  'maximum principal quantum number of any element of the period',
  'maximum azimuthal quantum number of any element of the period',
],
'c',
`**Step 1: Recall the basis of periods**

In the modern periodic table, elements are arranged in periods based on the **principal quantum number (n)** of the outermost shell (valence shell).

**Step 2: Verify with examples**

| Period | Elements | Max n (outermost shell) |
|---|---|---|
| 1 | H, He | n = 1 |
| 2 | Li to Ne | n = 2 |
| 3 | Na to Ar | n = 3 |
| 4 | K to Kr | n = 4 |

**Step 3: Conclusion**

The period number equals the **maximum principal quantum number** of any element in that period.

- Magnetic quantum number ($ m_l $) is not related to period number.
- Atomic number varies widely within a period.
- Azimuthal quantum number ($ l $) is related to subshell, not period.

**Final Answer: Option (c)**`,
'tag_periodic_1'),

// Q3 — Outer shell config (n-2)f⁷(n-1)d¹ns² for n=6
mkSCQ('PERI-105', 'Medium',
`Element with outer shell electronic configuration $ (n-2)f^7(n-1)d^1ns^2 $ for $ n = 6 $ is`,
[
  'Uranium',
  'Gadolinium',
  'Lead',
  'Niobium',
],
'b',
`**Step 1: Substitute n = 6**

$$(n-2)f^7(n-1)d^1ns^2 \\Rightarrow 4f^7\\,5d^1\\,6s^2$$

**Step 2: Identify the element**

The configuration $ 4f^7\\,5d^1\\,6s^2 $ corresponds to:

- Full configuration: $ [\\mathrm{Xe}]\\,4f^7\\,5d^1\\,6s^2 $
- This is **Gadolinium (Gd)**, $ Z = 64 $

The half-filled $ 4f^7 $ subshell gives extra stability, which is why one electron from $ 4f $ shifts to $ 5d $.

**Step 3: Eliminate other options**

- Uranium (Z=92): $ [\\mathrm{Rn}]\\,5f^3\\,6d^1\\,7s^2 $ — different configuration
- Lead (Z=82): $ [\\mathrm{Xe}]\\,4f^{14}\\,5d^{10}\\,6s^2\\,6p^2 $ — different
- Niobium (Z=41): $ [\\mathrm{Kr}]\\,4d^4\\,5s^1 $ — different

**Final Answer: Option (b) — Gadolinium**`,
'tag_periodic_6'),

// Q5 — Atomic number of element in 3rd period, 17th group
mkSCQ('PERI-106', 'Easy',
`Write the atomic number of element present in the $ 3^{\\text{rd}} $ period and $ 17^{\\text{th}} $ group of the periodic table`,
[
  '15',
  '17',
  '21',
  '9',
],
'b',
`**Step 1: Identify the element**

- Period 3 → outermost shell is $ n = 3 $
- Group 17 → halogens, with 7 valence electrons (configuration: $ ns^2\\,np^5 $)

**Step 2: Write the configuration**

$$1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^5$$

Total electrons = 2 + 2 + 6 + 2 + 5 = **17**

**Step 3: Identify the element**

Atomic number 17 = **Chlorine (Cl)**

- Period 3 ✓ (outermost shell n=3)
- Group 17 ✓ (7 valence electrons)

**Final Answer: Option (b) — 17**`,
'tag_periodic_1'),

// Q6 — Atomic radii from Na to Cl in 3rd row
mkSCQ('PERI-107', 'Easy',
`In the $ 3^{\\text{rd}} $ row of periodic table, the atomic radii from Na to Cl`,
[
  'increases continuously',
  'decreases continuously',
  'remains constant',
  'increases but not continuously',
],
'b',
`**Step 1: Trend of atomic radius across a period**

Across a period (left to right):
- Nuclear charge (Z) increases
- Number of shells remains the same
- Effective nuclear charge ($ Z_{\\text{eff}} $) increases
- Electrons are pulled closer to the nucleus

**Step 2: Apply to Period 3 (Na to Cl)**

| Element | Z | Atomic radius (pm) |
|---|---|---|
| Na | 11 | 186 |
| Mg | 12 | 160 |
| Al | 13 | 143 |
| Si | 14 | 117 |
| P | 15 | 110 |
| S | 16 | 104 |
| Cl | 17 | 99 |

The atomic radius **decreases continuously** from Na to Cl.

**Note:** Ar is a noble gas and is excluded from this comparison.

**Final Answer: Option (b)**`,
'tag_periodic_2'),

// Q7 — Largest atomic radii among O, Al, Ca, Mg
mkSCQ('PERI-108', 'Easy',
`Which of the following atoms would be expected to have the largest atomic radii?`,
[
  'Oxygen',
  'Aluminium',
  'Calcium',
  'Magnesium',
],
'c',
`**Step 1: Periodic trends for atomic radius**

- Atomic radius **increases down a group** (more shells added)
- Atomic radius **decreases across a period** (increasing nuclear charge)

**Step 2: Compare the elements**

| Element | Z | Period | Group | Atomic radius (pm) |
|---|---|---|---|---|
| O | 8 | 2 | 16 | 73 |
| Al | 13 | 3 | 13 | 143 |
| Mg | 12 | 3 | 2 | 160 |
| Ca | 20 | 4 | 2 | 197 |

**Step 3: Identify largest**

Calcium is in Period 4, Group 2 — it has the most electron shells among these elements and the lowest effective nuclear charge relative to its size.

**Final Answer: Option (c) — Calcium**`,
'tag_periodic_2'),

// Q8 — Radii order of F, F⁻, O, O²⁻
mkSCQ('PERI-109', 'Medium',
`The radii of $ \\mathrm{F} $, $ \\mathrm{F^-} $, $ \\mathrm{O} $ and $ \\mathrm{O^{2-}} $ are in the order of`,
[
  '$ \\mathrm{F^-} > \\mathrm{O^{2-}} > \\mathrm{F} > \\mathrm{O} $',
  '$ \\mathrm{O^{2-}} > \\mathrm{F^-} > \\mathrm{F} > \\mathrm{O} $',
  '$ \\mathrm{O^{2-}} > \\mathrm{F^-} > \\mathrm{O} > \\mathrm{F} $',
  '$ \\mathrm{F} > \\mathrm{O} > \\mathrm{F^-} > \\mathrm{O^{2-}} $',
],
'c',
`**Step 1: Isoelectronic comparison**

$ \\mathrm{F^-} $ and $ \\mathrm{O^{2-}} $ are isoelectronic (both have 10 electrons, $ 1s^2\\,2s^2\\,2p^6 $).

For isoelectronic species: **higher nuclear charge → smaller radius**

- $ \\mathrm{O^{2-}} $: Z = 8, 10 electrons → larger radius
- $ \\mathrm{F^-} $: Z = 9, 10 electrons → smaller radius

$$\\therefore \\mathrm{O^{2-}} > \\mathrm{F^-}$$

**Step 2: Compare neutral atoms**

- $ \\mathrm{O} $: Z = 8, 8 electrons → radius ≈ 73 pm
- $ \\mathrm{F} $: Z = 9, 9 electrons → radius ≈ 64 pm (smallest, highest Z in Period 2 halogens)

$$\\therefore \\mathrm{O} > \\mathrm{F}$$

**Step 3: Compare ions vs neutral atoms**

Adding electrons increases electron-electron repulsion → anions are always larger than neutral atoms:

$$\\mathrm{O^{2-}} > \\mathrm{F^-} > \\mathrm{O} > \\mathrm{F}$$

**Final Answer: Option (c)**`,
'tag_periodic_2'),

// Q9 — Ionic radii of Mg²⁺ and Al³⁺ given Na⁺ = 1.02 Å
mkSCQ('PERI-110', 'Medium',
`The ionic radius of $ \\mathrm{Na^+} $ ion is $ 1.02 $ Å. The ionic radii (in Å) of $ \\mathrm{Mg^{2+}} $ and $ \\mathrm{Al^{3+}} $, respectively are`,
[
  '1.05 and 0.99',
  '0.72 and 0.54',
  '0.85 and 0.99',
  '0.68 and 0.72',
],
'b',
`**Step 1: Isoelectronic series**

$ \\mathrm{Na^+} $, $ \\mathrm{Mg^{2+}} $, and $ \\mathrm{Al^{3+}} $ are all isoelectronic — each has **10 electrons** ($ 1s^2\\,2s^2\\,2p^6 $).

**Step 2: Effect of nuclear charge on isoelectronic species**

For isoelectronic ions: **higher nuclear charge → smaller ionic radius**

| Ion | Z (protons) | Electrons | Radius (Å) |
|---|---|---|---|
| $ \\mathrm{Na^+} $ | 11 | 10 | 1.02 |
| $ \\mathrm{Mg^{2+}} $ | 12 | 10 | 0.72 |
| $ \\mathrm{Al^{3+}} $ | 13 | 10 | 0.54 |

**Step 3: Conclusion**

As nuclear charge increases from Na⁺ → Mg²⁺ → Al³⁺, the same 10 electrons are pulled more strongly, reducing the ionic radius significantly.

**Final Answer: Option (b) — 0.72 Å and 0.54 Å**`,
'tag_periodic_2'),

// Q10 — Ce³⁺, La³⁺, Pm³⁺, Yb³⁺ ionic radii increasing order (lanthanoid contraction)
mkSCQ('PERI-111', 'Hard',
`$ \\mathrm{Ce^{3+}} $, $ \\mathrm{La^{3+}} $, $ \\mathrm{Pm^{3+}} $ and $ \\mathrm{Yb^{3+}} $ have ionic radii in the increasing order as`,
[
  '$ \\mathrm{La^{3+}} < \\mathrm{Ce^{3+}} < \\mathrm{Pm^{3+}} < \\mathrm{Yb^{3+}} $',
  '$ \\mathrm{Yb^{3+}} < \\mathrm{Pm^{3+}} < \\mathrm{Ce^{3+}} < \\mathrm{La^{3+}} $',
  '$ \\mathrm{La^{3+}} = \\mathrm{Ce^{3+}} < \\mathrm{Pm^{3+}} < \\mathrm{Yb^{3+}} $',
  '$ \\mathrm{Yb^{3+}} < \\mathrm{Pm^{3+}} < \\mathrm{La^{3+}} < \\mathrm{Ce^{3+}} $',
],
'b',
`**Step 1: Lanthanoid contraction**

As we move across the lanthanoid series (La → Lu), the 4f electrons are added. The 4f subshell provides **poor shielding** of the nuclear charge. Therefore:
- Effective nuclear charge increases across the series
- Ionic radius **decreases** from La³⁺ to Lu³⁺

This phenomenon is called **lanthanoid contraction**.

**Step 2: Atomic numbers and positions**

| Ion | Element | Z | Position in lanthanoids |
|---|---|---|---|
| $ \\mathrm{La^{3+}} $ | Lanthanum | 57 | 1st |
| $ \\mathrm{Ce^{3+}} $ | Cerium | 58 | 2nd |
| $ \\mathrm{Pm^{3+}} $ | Promethium | 61 | 5th |
| $ \\mathrm{Yb^{3+}} $ | Ytterbium | 70 | 14th |

**Step 3: Order of ionic radii**

Since radius decreases across the series:

$$r(\\mathrm{La^{3+}}) > r(\\mathrm{Ce^{3+}}) > r(\\mathrm{Pm^{3+}}) > r(\\mathrm{Yb^{3+}})$$

**Increasing order:**

$$\\mathrm{Yb^{3+}} < \\mathrm{Pm^{3+}} < \\mathrm{Ce^{3+}} < \\mathrm{La^{3+}}$$

**Final Answer: Option (b)**`,
'tag_periodic_2'),

// Q11 — Increasing IE order: N, P, O, S
mkSCQ('PERI-112', 'Medium',
`Arrange the elements N, P, O, S in the order of increasing IE$ _1 $`,
[
  '$ \\mathrm{P} < \\mathrm{S} < \\mathrm{O} < \\mathrm{N} $',
  '$ \\mathrm{S} < \\mathrm{P} < \\mathrm{O} < \\mathrm{N} $',
  '$ \\mathrm{S} < \\mathrm{O} < \\mathrm{P} < \\mathrm{N} $',
  '$ \\mathrm{P} < \\mathrm{S} < \\mathrm{N} < \\mathrm{O} $',
],
'b',
`**Step 1: General trend**

IE₁ increases across a period and decreases down a group.

**Step 2: Key exceptions**

- **N vs O:** N has a half-filled $ 2p^3 $ configuration (extra stability) → IE₁(N) > IE₁(O)
- **P vs S:** Similarly, P has half-filled $ 3p^3 $ → IE₁(P) > IE₁(S)

**Step 3: Compare across periods**

- Period 2 elements (N, O) have higher IE than Period 3 elements (P, S) due to smaller atomic size and greater nuclear attraction.

$$\\mathrm{IE_1}: \\mathrm{N} > \\mathrm{O} > \\mathrm{P} > \\mathrm{S}$$

**Step 4: Increasing order**

$$\\mathrm{S} < \\mathrm{P} < \\mathrm{O} < \\mathrm{N}$$

**Actual values:** S (1000) < P (1012) < O (1314) < N (1402) kJ/mol ✓

**Final Answer: Option (b)**`,
'tag_periodic_3'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
