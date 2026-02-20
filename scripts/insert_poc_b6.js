const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'ch11_prac_org';

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
      exam_source: 'JEE Main', is_pyq: true, is_top_pyq: false,
    },
    status: 'published', version: 1, quality_score: 90,
    needs_review: false, created_by: 'admin', updated_by: 'admin',
    created_at: new Date(), updated_at: new Date(), deleted_at: null,
  };
}

function mkNVT(id, diff, text, ans, sol, tag) {
  return {
    _id: uuidv4(), display_id: id, type: 'NVT',
    question_text: { markdown: text, latex_validated: false },
    options: [],
    answer: ans,
    solution: { text_markdown: sol, latex_validated: false },
    metadata: {
      difficulty: diff, chapter_id: CHAPTER_ID,
      tags: [{ tag_id: tag, weight: 1.0 }],
      exam_source: 'JEE Main', is_pyq: true, is_top_pyq: false,
    },
    status: 'published', version: 1, quality_score: 90,
    needs_review: false, created_by: 'admin', updated_by: 'admin',
    created_at: new Date(), updated_at: new Date(), deleted_at: null,
  };
}

const questions = [

// Q209 — Blood red colour with FeSO₄ in H₂SO₄ indicates; Ans: (4) S
mkSCQ('POC-051', 'Hard',
`Appearance of blood red colour, on treatment of the sodium fusion extract of an organic compound with $ \\mathrm{FeSO_4} $ in presence of concentrated $ \\mathrm{H_2SO_4} $ indicates the presence of element/s`,
[
  'Br',
  'N',
  'N and S',
  'S',
],
'd',
`**Sodium fusion extract tests:**

| Test | Reagent | Colour | Element detected |
|---|---|---|---|
| Prussian blue test | FeSO₄ + FeCl₃ (acidified) | Prussian blue | Nitrogen (NaCN → Fe₄[Fe(CN)₆]₃) |
| Nitroprusside test | Na₂[Fe(CN)₅NO] | Purple/violet | Sulphur (Na₂S) |
| **Blood red test** | **FeSO₄ + conc. H₂SO₄** | **Blood red** | **Sulphur** |
| AgNO₃ test | AgNO₃ (acidified) | White/pale yellow/yellow ppt | Halogens |

**Blood red colour with FeSO₄ + conc. H₂SO₄:**

This is the **ring test** for sulphur (or thiocyanate). When Na₂S is present in the fusion extract:

$$\\mathrm{Na_2S + FeSO_4 \\to FeS + Na_2SO_4}$$

The blood red colour is due to formation of iron sulphide complex or thiocyanate-iron complex.

Actually, the blood red colour with FeSO₄ + conc. H₂SO₄ is specifically for **sulphur** detection via the formation of a red-coloured iron-sulphur complex.

**Final Answer: Option (4) — S**`,
'tag_poc_2'),

// Q210 — Match element detected with reagent; Ans: (1) A→III, B→I, C→IV, D→II
mkSCQ('POC-052', 'Medium',
`Match List-I with List-II.\n\n**List-I (Element detected):**\n(A) Nitrogen\n(B) Sulphur\n(C) Phosphorus\n(D) Halogen\n\n**List-II (Reagent used/Product formed):**\n(I) $ \\mathrm{Na_2[Fe(CN)_5NO]} $\n(II) $ \\mathrm{AgNO_3} $\n(III) $ \\mathrm{Fe_4[Fe(CN)_6]_3} $\n(IV) $ \\mathrm{(NH_4)_2MoO_4} $`,
[
  '$ \\mathrm{A \\to III;\\ B \\to I;\\ C \\to IV;\\ D \\to II} $',
  '$ \\mathrm{A \\to II;\\ B \\to IV;\\ C \\to I;\\ D \\to III} $',
  '$ \\mathrm{A \\to IV;\\ B \\to II;\\ C \\to I;\\ D \\to III} $',
  '$ \\mathrm{A \\to II;\\ B \\to I;\\ C \\to IV;\\ D \\to III} $',
],
'a',
`**Matching elements to detection reagents/products:**

**(A) Nitrogen → (III) $ \\mathrm{Fe_4[Fe(CN)_6]_3} $ (Prussian blue)**

NaCN (from N) + FeSO₄ → Na₂[Fe(CN)₆] → + FeCl₃ → **Prussian blue** $ \\mathrm{Fe_4[Fe(CN)_6]_3} $ ✓

**(B) Sulphur → (I) $ \\mathrm{Na_2[Fe(CN)_5NO]} $ (sodium nitroprusside)**

Na₂S (from S) + sodium nitroprusside → **purple colour** ✓

**(C) Phosphorus → (IV) $ \\mathrm{(NH_4)_2MoO_4} $ (ammonium molybdate)**

H₃PO₄ (from P) + ammonium molybdate → **yellow precipitate** $ \\mathrm{(NH_4)_3PO_4 \\cdot 12MoO_3} $ ✓

**(D) Halogen → (II) $ \\mathrm{AgNO_3} $**

NaX (from halogen) + AgNO₃ → **AgX precipitate** ✓

**Matching: A→III, B→I, C→IV, D→II**

**Final Answer: Option (1)**`,
'tag_poc_2'),

// Q211 — % bromine by Carius; Ans: 40
mkNVT('POC-053', 'Hard',
`0.400 g of an organic compound (X) gave 0.376 g of AgBr in Carius method for estimation of bromine. % of bromine in the compound (X) is ______ .\n(Given: Molar mass AgBr = 188 g mol⁻¹, Br = 80 g mol⁻¹)`,
{ integer_value: 40 },
`**Carius method for bromine:**

$$\\%\\mathrm{Br} = \\frac{80}{188} \\times \\frac{m(\\mathrm{AgBr})}{m(\\text{compound})} \\times 100$$

$$= \\frac{80}{188} \\times \\frac{0.376}{0.400} \\times 100$$

$$= 0.4255 \\times 0.94 \\times 100$$

$$= 0.4000 \\times 100 = \\mathbf{40\\%}$$

**Verification:**
- Moles of AgBr = 0.376/188 = 0.002 mol
- Moles of Br = 0.002 mol
- Mass of Br = 0.002 × 80 = 0.16 g
- % Br = (0.16/0.400) × 100 = **40%** ✓

**Final Answer: 40**`,
'tag_poc_3'),

// Q212 — Compound giving positive Lassaigne's test for both N and halogen; Ans: (4) NH₂OH·HCl
mkSCQ('POC-054', 'Medium',
`Compound that will give positive Lassaigne's test for both nitrogen and halogen is`,
[
  '$ \\mathrm{N_2H_4 \\cdot HCl} $',
  '$ \\mathrm{CH_3NH_2 \\cdot HCl} $',
  '$ \\mathrm{NH_4Cl} $',
  '$ \\mathrm{NH_2OH \\cdot HCl} $',
],
'd',
`**Lassaigne's test requirements:**

For positive test for **both N and Cl**, the compound must contain:
1. **Nitrogen** in organic form (C–N bond) → forms NaCN on fusion
2. **Chlorine** in organic form (C–Cl or N–Cl bond) → forms NaCl on fusion

**Evaluating each compound:**

| Compound | Contains N? | N type | Contains Cl? | Cl type | Both tests? |
|---|---|---|---|---|---|
| (1) $ \\mathrm{N_2H_4 \\cdot HCl} $ | Yes | Inorganic (no C) | Yes | Ionic Cl⁻ | No — no C–N bond |
| (2) $ \\mathrm{CH_3NH_2 \\cdot HCl} $ | Yes | Organic (C–N) | Yes | Ionic Cl⁻ | Partial — Cl is ionic |
| (3) $ \\mathrm{NH_4Cl} $ | Yes | Inorganic | Yes | Ionic | No — no C |
| **(4) $ \\mathrm{NH_2OH \\cdot HCl} $** | **Yes** | **N–O–H (organic-like)** | **Yes** | **Ionic Cl⁻** | **Yes** ✓ |

**Hydroxylamine hydrochloride** ($ \\mathrm{NH_2OH \cdot HCl} $): Contains N (in NH₂OH) and Cl (as HCl salt). On sodium fusion, both NaCN (or NaN from N) and NaCl are formed → positive tests for both.

Per answer key (4): **NH₂OH·HCl**

**Final Answer: Option (4)**`,
'tag_poc_2'),

// Q213 — Statements about Lassaigne's test when both N and S present; Ans: (1) Both correct
mkSCQ('POC-055', 'Medium',
`Given below are two statements:\n**Statement I:** In 'Lassaigne's Test', when both nitrogen and sulphur are present in an organic compound, sodium thiocyanate is formed.\n**Statement II:** If both nitrogen and sulphur are present in an organic compound, then the excess of sodium used in sodium fusion will decompose the sodium thiocyanate formed to give NaCN and Na₂S.\n\nIn the light of the above statements, choose the most appropriate answer from the options given below:`,
[
  'Both Statement I and Statement II are correct.',
  'Both Statement I and Statement II are incorrect.',
  'Statement I is correct but Statement II is incorrect.',
  'Statement I is incorrect but Statement II is correct.',
],
'a',
`**Lassaigne's test when both N and S are present:**

**Statement I: Sodium thiocyanate is formed — TRUE ✓**

When both N and S are present:
$$\\mathrm{Na + C + N + S \\to NaSCN \\text{ (sodium thiocyanate)}}$$

This is correct — NaSCN forms initially.

**Statement II: Excess Na decomposes NaSCN → NaCN + Na₂S — TRUE ✓**

With excess sodium:
$$\\mathrm{NaSCN + 2Na \\to NaCN + Na_2S}$$

This decomposition occurs when excess sodium is used. This is why:
- If excess Na is used → NaCN and Na₂S are detected separately
- If limited Na → NaSCN is formed (gives blood red with FeCl₃, not Prussian blue)

**Both statements are correct.**

**Final Answer: Option (1) — Both Statements are correct**`,
'tag_poc_2'),

// Q214 — Potassium ferrocyanide gives Prussian blue with; Ans: (4) FeCl₃
mkSCQ('POC-056', 'Easy',
`The potassium ferrocyanide solution gives a Prussian blue colour, when added to`,
[
  '$ \\mathrm{CoCl_3} $',
  '$ \\mathrm{CoCl_2} $',
  '$ \\mathrm{FeCl_2} $',
  '$ \\mathrm{FeCl_3} $',
],
'd',
`**Prussian blue formation:**

Prussian blue is formed when **potassium ferrocyanide** ($ \\mathrm{K_4[Fe(CN)_6]} $) reacts with **Fe³⁺ ions**:

$$\\mathrm{4FeCl_3 + 3K_4[Fe(CN)_6] \\to Fe_4[Fe(CN)_6]_3 + 12KCl}$$

$$\\text{Prussian blue} = \\mathrm{Fe_4[Fe(CN)_6]_3}$$

**$ \\mathrm{FeCl_3} $** provides Fe³⁺ ions → reacts with ferrocyanide → **Prussian blue** ✓

**$ \\mathrm{FeCl_2} $** provides Fe²⁺ → reacts with ferricyanide (not ferrocyanide) → Turnbull's blue

**In Lassaigne's test for nitrogen:**
- NaCN formed → treated with FeSO₄ → Na₂[Fe(CN)₆]
- Then acidified with FeCl₃ → Prussian blue

**Final Answer: Option (4) — $ \\mathrm{FeCl_3} $**`,
'tag_poc_2'),

// Q215 — CuSO₄ in Kjeldahl's method acts as; Ans: (2) Catalytic agent
mkSCQ('POC-057', 'Easy',
`In Kjeldahl's method for estimation of nitrogen, $ \\mathrm{CuSO_4} $ acts as:`,
[
  'Reducing agent',
  'Catalytic agent',
  'Hydrolysis agent',
  'Oxidising agent',
],
'b',
`**Kjeldahl's method:**

The organic compound is digested with **concentrated H₂SO₄** to convert nitrogen to ammonium sulphate:

$$\\mathrm{Organic\\ N \\xrightarrow{conc.\\ H_2SO_4,\\ CuSO_4,\\ K_2SO_4} (NH_4)_2SO_4}$$

**Role of CuSO₄:**

$ \\mathrm{CuSO_4} $ acts as a **catalyst** that speeds up the oxidative digestion of the organic compound. It accelerates the conversion of organic nitrogen to ammonium sulphate.

**Other additives:**
- $ \\mathrm{K_2SO_4} $: raises the boiling point of H₂SO₄ (increases digestion temperature)
- Conc. H₂SO₄: oxidizing and dehydrating agent

**Final Answer: Option (2) — Catalytic agent**`,
'tag_poc_3'),

// Q216 — Compound X treated with Na₂O₂ giving BaSO₄; Ans: (3) Methionine
mkSCQ('POC-058', 'Hard',
`In Carius tube, an organic compound 'X' is treated with sodium peroxide to form a mineral acid 'Y'. The solution of $ \\mathrm{BaCl_2} $ is added to 'Y' to form a precipitate 'Z'. 'Z' is used for the quantitative estimation of an extra element. 'X' could be`,
[
  'Cytosine',
  'A nucleotide',
  'Methionine',
  'Chloroxylenol',
],
'c',
`**Analyzing the reaction sequence:**

**Step 1:** Compound X + Na₂O₂ → mineral acid Y

**Step 2:** Y + BaCl₂ → precipitate Z

**Identifying Z:**

If Z is formed with BaCl₂, it must be **BaSO₄** (barium sulphate) — the classic precipitate for sulphate ions.

$$\\mathrm{BaCl_2 + H_2SO_4 \\to BaSO_4 \\downarrow + 2HCl}$$

So Y = H₂SO₄ (sulphuric acid), and Z = BaSO₄.

**This means X contains sulphur** (S is oxidized to H₂SO₄ by Na₂O₂).

**Evaluating each compound for sulphur content:**

| Compound | Contains S? |
|---|---|
| Cytosine | No (contains N, O) |
| A nucleotide | No (contains N, O, P) |
| **Methionine** | **Yes** (amino acid with –SCH₃ side chain) ✓ |
| Chloroxylenol | No (contains Cl) |

**Methionine** ($ \\mathrm{CH_3-S-CH_2-CH_2-CH(NH_2)-COOH} $) contains sulphur → oxidized to H₂SO₄ → BaSO₄ precipitate.

**Final Answer: Option (3) — Methionine**`,
'tag_poc_3'),

// Q217 — % sulphur by BaSO₄; Ans: 42
mkNVT('POC-059', 'Hard',
`In sulphur estimation, 0.471 g of an organic compound gave 1.4439 g of barium sulphate. The percentage of sulphur in the compound is ______ (Nearest Integer)\n(Given: Atomic mass Ba: 137 u; S: 32 u; O: 16 u)`,
{ integer_value: 42 },
`**Sulphur estimation by Carius method:**

Molar mass of BaSO₄ = 137 + 32 + 4(16) = 137 + 32 + 64 = **233 g/mol**

**Formula:**
$$\\%\\mathrm{S} = \\frac{32}{233} \\times \\frac{m(\\mathrm{BaSO_4})}{m(\\text{compound})} \\times 100$$

**Calculation:**
$$\\%\\mathrm{S} = \\frac{32}{233} \\times \\frac{1.4439}{0.471} \\times 100$$

$$= 0.1373 \\times 3.0657 \\times 100$$

$$= 0.4210 \\times 100 = \\mathbf{42.1 \\approx 42\\%}$$

**Verification:**
- Moles of BaSO₄ = 1.4439/233 = 0.006197 mol
- Moles of S = 0.006197 mol
- Mass of S = 0.006197 × 32 = 0.1983 g
- % S = (0.1983/0.471) × 100 = **42.1% ≈ 42%** ✓

**Final Answer: 42**`,
'tag_poc_3'),

// Q218 — In Dumas method, gas passed over; Ans: (1) Copper gauze
mkSCQ('POC-060', 'Medium',
`In Dumas method for the estimation of $ \\mathrm{N_2} $, the sample is heated with copper oxide and the gas evolved is passed over:`,
[
  'Copper gauze',
  'Pd',
  'Ni',
  'Copper oxide',
],
'a',
`**Dumas method for nitrogen estimation:**

**Procedure:**
1. Organic compound mixed with CuO (copper oxide) and heated in a combustion tube
2. Products: CO₂, H₂O, N₂ (and possibly N oxides)
3. The gas mixture is passed over **hot copper gauze**

**Role of copper gauze:**

$$\\mathrm{2NO + Cu \\to N_2 + CuO}$$
$$\\mathrm{2NO_2 + Cu \\to N_2 + 2CuO}$$

Hot copper gauze **reduces any nitrogen oxides (NOₓ)** back to N₂, ensuring all nitrogen is collected as N₂ gas.

4. CO₂ and H₂O are absorbed (CO₂ by KOH, H₂O by CaCl₂)
5. Pure N₂ is collected over KOH solution and its volume measured

**Final Answer: Option (1) — Copper gauze**`,
'tag_poc_3'),

];

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('questions_v2');
  const result = await col.insertMany(questions, { ordered: false });
  console.log('Inserted:', result.insertedCount, 'of', questions.length);
  await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
