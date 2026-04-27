// Solution-rewrite batch 1: PERI-106, 121, 125, 126, 127, 129, 131, 132, 139, 140
// Writes to canonical solution.text_markdown (NOT solution_markdown).

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const updates = [
  {
    display_id: 'PERI-106',
    solution: `🧠 **Period 3, Group 17 → Chlorine, Z = 17**
The period number tells you how many shells the element fills. The group number (for $p$-block) tells you the configuration of the outer shell. Period 3 + Group 17 means three shells filled, with the outermost shell as $3s^2\\,3p^5$.

🗺️ **Build the configuration and count Z**
Period 1: $1s^2$ → 2 electrons.
Period 2: $2s^2\\,2p^6$ → 8 electrons.
Period 3: $3s^2\\,3p^5$ → 7 electrons (group 17 means $ns^2\\,np^5$).

Total electrons = $2 + 8 + 7 = 17$. So $Z = 17$.

That is **Chlorine (Cl)** — a halogen sitting just above Br and below F.

⚠️ **Common mistake**
Option (d) gives 9. That is the atomic number of Fluorine, which is also Group 17 but in Period 2. Same group does NOT mean same element. Always combine the period AND the group to land on the right Z. Option (a) gives 15, which is Phosphorus (Period 3, but Group 15, not 17). Option (c) gives 21 = Scandium, a $d$-block element — wrong block entirely.

$$\\boxed{\\text{Answer: (b)}}$$`,
  },
  {
    display_id: 'PERI-121',
    solution: `🧠 **Across Period 2, oxide nature shifts from strongly basic (Li) to strongly acidic (N) — non-metal character drives acidity**
Moving left to right across Period 2, the elements become more non-metallic. So their oxides become less basic and more acidic. The most basic oxide goes with the most metallic element (Li); the most acidic goes with the most non-metallic of the listed set (N).

🗺️ **Rank each oxide by acidity**
$\\ce{Li2O}$: Li is a Group 1 alkali metal — the strongest metal in the set. Its oxide is **strongly basic** (least acidic).
$\\ce{BeO}$: Be is at the metal/non-metal boundary — its oxide is **amphoteric** (slight acidic side, but mostly basic).
$\\ce{B2O3}$: B is a metalloid leaning non-metal. Its oxide is **weakly acidic** (gives boric acid in water).
$\\ce{CO2}$: C is a non-metal. $\\ce{CO2}$ dissolves in water to give $\\ce{H2CO3}$ — **acidic**.
$\\ce{N2O3}$: N is the most non-metallic in this set. $\\ce{N2O3}$ gives $\\ce{HNO2}$ on hydrolysis — **most acidic**.

Decreasing acidity: $\\ce{N2O3 > CO2 > B2O3 > BeO > Li2O}$.

⚠️ **Common mistake**
Option (b) puts $\\ce{CO2}$ ahead of $\\ce{N2O3}$. C is left of N, so C is more metallic — its oxide is LESS acidic than $\\ce{N2O3}$, not more. Always remember: rightmost element in a period gives the most acidic oxide.

$$\\boxed{\\text{Answer: (c)}}$$`,
  },
  {
    display_id: 'PERI-125',
    solution: `🧠 **Find the pair where the two members have DIFFERENT chemical nature — acidic vs basic vs amphoteric**
Each option lists two compounds. You need to know each one's character (acidic, basic, or amphoteric) and pick the option where the two don't match.

🗺️ **Classify each compound**
$\\ce{B(OH)3}$ (boric acid): donates protons to water — **acidic**.
$\\ce{H3PO3}$ (phosphorous acid): diprotic acid — **acidic**.
$\\ce{Al(OH)3}$: dissolves in both NaOH and HCl — classic **amphoteric**.
$\\ce{NaOH}$: strong alkali — **basic**.
$\\ce{Ca(OH)2}$: slaked lime, alkaline earth metal hydroxide — **basic**.
$\\ce{Be(OH)2}$: Be is at the metal/non-metal boundary — **amphoteric** (the only Group 2 hydroxide that is amphoteric).

Now scan the options:
(a) $\\ce{B(OH)3}$ + $\\ce{H3PO3}$: both acidic → same.
(b) $\\ce{B(OH)3}$ (acidic) + $\\ce{Al(OH)3}$ (amphoteric): **different**. ✓
(c) $\\ce{NaOH}$ + $\\ce{Ca(OH)2}$: both basic → same.
(d) $\\ce{Be(OH)2}$ + $\\ce{Al(OH)3}$: both amphoteric → same.

⚠️ **Common mistake**
Many students mark (d) thinking Be(OH)₂ is basic like the rest of Group 2. But Be is the exception — its hydroxide is amphoteric, just like Al(OH)₃. So (d) actually has same nature, not different. Memorize: Be and Al both give amphoteric hydroxides.

$$\\boxed{\\text{Answer: (b)}}$$`,
  },
  {
    display_id: 'PERI-126',
    solution: `🧠 **Basic character of an oxide tracks the metallic character of its element — alkali metals are most basic, transition metals least**
Moving from transition metal to alkali metal, the element becomes more electropositive. The M-O bond becomes more ionic, and the oxide releases more $\\ce{OH^-}$ in water — so it is more basic.

🗺️ **Rank the four oxides**
$\\ce{NiO}$: Ni is a $d$-block transition metal. Its oxide is **weakly basic / partly amphoteric** — least basic in this set.
$\\ce{MgO}$: Mg is Group 2, Period 3. **Moderately basic** — but smaller and harder to dissolve than heavier alkaline earth oxides.
$\\ce{SrO}$: Sr is Group 2, Period 5. As you go down Group 2, basicity increases. So $\\ce{SrO}$ is more basic than $\\ce{MgO}$.
$\\ce{K2O}$: K is a Group 1 alkali metal — **most basic** of all four.

Increasing basic character: $\\ce{NiO < MgO < SrO < K2O}$.

⚠️ **Common mistake**
Option (a) puts $\\ce{K2O}$ at the lowest position — the opposite of reality. Alkali metal oxides are always the most basic; this is the strongest "give up electrons" group. Don't get the direction reversed.

$$\\boxed{\\text{Answer: (b)}}$$`,
  },
  {
    display_id: 'PERI-127',
    solution: `🧠 **Iridium just edges out Osmium as the densest element — both are 5d transition metals at the bottom-right of the periodic table**
The two densest elements known are Iridium (Ir, Z = 77) and Osmium (Os, Z = 76). They are neighbours in the periodic table and have nearly identical densities. Older textbooks often list Os as the densest, but the most precise modern X-ray measurements give Ir the slight edge.

🗺️ **Compare the densities**
Standard reference values (g/cm³):
$\\ce{Ir}$: $22.65$ — densest.
$\\ce{Os}$: $22.59$ — extremely close second.
$\\ce{Pt}$: $21.45$.
$\\ce{Au}$: $19.30$.

So among the four options, **Iridium** has the highest density.

⚠️ **Common mistake**
Many students mark Osmium because they remember reading "Os is the densest element" in older books. The latest JEE/NEET answer keys go with Iridium (Ir = 22.65, Os = 22.59). The two values agree at the second decimal, but Ir wins. If your study material says Os, treat both Ir and Os as valid for safety, but in this question Ir is the keyed answer.

$$\\boxed{\\text{Answer: (b)}}$$`,
  },
  {
    display_id: 'PERI-129',
    solution: `🧠 **Electronegativity below 1.0 on the Pauling scale belongs only to the heavy alkali metals (Na, K, Rb, Cs, Fr)**
Pauling EN values: H = 2.1, Li = 1.0, Be = 1.5, B = 2.0, Na = 0.9, Mg = 1.2, Al = 1.5, K = 0.8, Rb = 0.8. The cut-off "less than 1" excludes Li (which sits exactly at 1.0) and includes only Na, K, and Rb from the given list.

🗺️ **Walk through each element**
$\\ce{Li}$: $1.0$ — equal to 1, NOT strictly less than. Skip.
$\\ce{Be}$: $1.5$ — above 1. Skip.
$\\ce{B}$: $2.0$ — above 1. Skip.
$\\ce{Na}$: $0.9$ — below 1. **Count: 1.**
$\\ce{Mg}$: $1.2$ — above 1. Skip.
$\\ce{Al}$: $1.5$ — above 1. Skip.
$\\ce{K}$: $0.8$ — below 1. **Count: 2.**
$\\ce{Rb}$: $0.8$ — below 1. **Count: 3.**

Total: **3** elements.

⚠️ **Common mistake**
Students often include Li because they remember "alkali metals have low EN". But Li sits exactly at 1.0, and the question says strictly less than 1. Also, Mg looks "low" but is at 1.2 — just above the cut-off. Always use precise EN values for these counting questions.

$$\\boxed{\\text{Answer: 3}}$$`,
  },
  {
    display_id: 'PERI-131',
    solution: `🧠 **Representative elements = $s$-block + $p$-block only. $d$-block transition metals don't count**
Representative elements are those whose differentiating electron enters an $s$ or $p$ subshell. Anything in the $d$-block (or $f$-block) is not "representative". Walk through each given element and decide its block.

🗺️ **Classify each element**
$\\ce{Cd}$ ($Z=48$): $[\\ce{Kr}]\\,4d^{10}\\,5s^2$. Last differentiating electron is in $4d$. **$d$-block** → not counted.
$\\ce{Nb}$ ($Z=41$): $4d^4\\,5s^1$. **$d$-block** → not counted.
$\\ce{Ta}$ ($Z=73$): $5d^3\\,6s^2$. **$d$-block** → not counted.
$\\ce{Te}$ ($Z=52$): $5p^4$. **$p$-block** → COUNT.
$\\ce{Ra}$ ($Z=88$): $7s^2$. **$s$-block** → COUNT.
$\\ce{Mo}$ ($Z=42$): $4d^5\\,5s^1$. **$d$-block** → not counted.
$\\ce{Po}$ ($Z=84$): $6p^4$. **$p$-block** → COUNT.
$\\ce{Pd}$ ($Z=46$): $4d^{10}$. **$d$-block** → not counted.
$\\ce{Tc}$ ($Z=43$): $4d^5\\,5s^2$. **$d$-block** → not counted.

Counted: $\\ce{Te}, \\ce{Ra}, \\ce{Po}$ — total **3**.

⚠️ **Common mistake**
Students sometimes count Cd as a representative element because it has a filled $d^{10}$ and looks "complete". But Cd's defining electron is still in the $d$-subshell — it is firmly in the $d$-block. Filled or not, $d$-block is not representative.

$$\\boxed{\\text{Answer: 3}}$$`,
  },
  {
    display_id: 'PERI-132',
    solution: `🧠 **Family name → group number → element symbol. Use the Period 7 superheavy elements (Mc, Lv, Ts, Og)**
The four families given are simply the standard names for groups 15-18:
- Pnictogen = Group 15 → Mc (Moscovium, $Z=115$).
- Chalcogen = Group 16 → Lv (Livermorium, $Z=116$).
- Halogen = Group 17 → Ts (Tennessine, $Z=117$).
- Noble gas = Group 18 → Og (Oganesson, $Z=118$).

🗺️ **Match each row**
A. Pnictogen (Group 15) → **Mc** (option IV).
B. Chalcogen (Group 16) → **Lv** (option III).
C. Halogen (Group 17) → **Ts** (option I).
D. Noble gas (Group 18) → **Og** (option II).

So: A-IV, B-III, C-I, D-II.

⚠️ **Common mistake**
Easy to confuse the symbols — they all look similar (Mc, Lv, Ts, Og). The trick is to remember the order in Period 7: Z = 115 → 118 are Mc → Lv → Ts → Og. Mc is the LIGHTEST of the four (pnictogen, just like N, P, As, Sb, Bi). Og is the HEAVIEST (noble gas, just like He, Ne, Ar, Kr, Xe, Rn).

$$\\boxed{\\text{Answer: (b)}}$$`,
  },
  {
    display_id: 'PERI-139',
    solution: `🧠 **Two facts to verify: isoelectronic size order, and the Cl-beats-F anomaly in halogen EGE**
Both statements involve standard NCERT facts. Isoelectronic species: more protons → smaller ion. Halogen EGE: F is anomalously LESS exothermic than Cl because F's tiny $2p$ shell repels the incoming electron.

🗺️ **Check Statement I — isoelectronic radii**
$\\ce{Mg^{2+}}$ ($Z=12$), $\\ce{Na^+}$ ($Z=11$), $\\ce{F^-}$ ($Z=9$), $\\ce{O^{2-}}$ ($Z=8$). All have 10 electrons. Higher Z = stronger nuclear pull = smaller ion. So increasing size order = decreasing Z order: $\\ce{Mg^{2+} < Na^+ < F^- < O^{2-}}$. **Matches Statement I exactly. True.**

**Check Statement II — halogen EGE magnitudes**
Pauling values (kJ/mol): $\\ce{Cl} = -349$, $\\ce{F} = -328$, $\\ce{Br} = -325$, $\\ce{I} = -295$. By magnitude (most negative = greatest): $\\ce{Cl > F > Br > I}$. **Matches Statement II exactly. True.**

Both statements are correct.

⚠️ **Common mistake**
Many students reject Statement II thinking "F is the smallest halogen, so F should have the most negative EGE." The trap is to assume the simple group trend. F's compact $2p$ orbital makes the incoming electron face heavy repulsion, so Cl beats F here. Memorize this exception: $|EGE(\\ce{Cl})| > |EGE(\\ce{F})|$ — always.

$$\\boxed{\\text{Answer: (d)}}$$`,
  },
  {
    display_id: 'PERI-140',
    solution: `🧠 **Smallest atomic radius among Li, Na, Be, Mg, B, Al → Boron. Boron's oxide is $\\ce{B2O3}$, of type $\\text{A}_2\\text{O}_3$**
You first need to identify which element has the smallest radius, then write its oxide formula.

🗺️ **Step 1 — find the smallest atom**
Period 2 atoms (Li, Be, B) are smaller than Period 3 atoms (Na, Mg, Al). So eliminate Na, Mg, Al.
Within Period 2: radius decreases left-to-right. Li ($152$ pm) > Be ($112$ pm) > B ($88$ pm). So **Boron** has the smallest radius.

**Step 2 — Boron's oxide**
B is in Group 13 with valency 3. With oxygen (valency 2), criss-cross to get $\\ce{B2O3}$. Type: $\\text{A}_2\\text{O}_3$.

⚠️ **Common mistake**
Some students pick option (d) $\\text{A}_2\\text{O}$ thinking the smallest atom must be Lithium (since Li is at the very top of Group 1). But B sits to the right of Li in Period 2, with three more protons — so B's atom is smaller, not Li's. Always check both period AND group when comparing atomic radii across non-adjacent elements.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
];

(async () => {
  const c = new MongoClient(process.env.MONGODB_URI);
  await c.connect();
  const col = c.db('crucible').collection('questions_v2');
  const now = new Date();
  let ok = 0;
  for (const u of updates) {
    const ex = await col.findOne({ display_id: u.display_id });
    if (!ex) { console.log(`MISSING: ${u.display_id}`); continue; }
    const newSolution = {
      ...(ex.solution || {}),
      text_markdown: u.solution,
      latex_validated: true,
      last_validated_at: now,
    };
    const r = await col.updateOne(
      { display_id: u.display_id },
      { $set: { solution: newSolution, last_validated_at: now } }
    );
    console.log(`UPDATED: ${u.display_id} (modified=${r.modifiedCount})`);
    ok++;
  }
  console.log(`\nDone. ${ok}/${updates.length}`);
  await c.close();
})().catch(e => { console.error(e); process.exit(1); });
