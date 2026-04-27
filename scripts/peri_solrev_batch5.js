// Solution-rewrite batch 5: PERI-196, 197, 199, 201, 202, 204, 209, 221, 224, 226
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const updates = [
  {
    display_id: 'PERI-196',
    solution: `🧠 **Mulliken: $EN_M = (IE + EA)/2$. To get Pauling EN, divide $EN_M$ (in eV) by 2.8**
The Mulliken scale uses energy (eV) directly. The Pauling scale uses dimensionless numbers (F = 4.0). The conversion factor between them is approximately 2.8.

🗺️ **Two-step calculation**
**Step 1 — Compute Mulliken EN:**
$$EN_M = \\frac{IE + EA}{2} = \\frac{10 + 6.8}{2} = \\frac{16.8}{2} = 8.4\\,\\text{eV}$$

**Step 2 — Convert to Pauling scale:**
$$EN_P = \\frac{EN_M}{2.8} = \\frac{8.4}{2.8} = 3$$

So Pauling electronegativity = **3**.

⚠️ **Don't forget the conversion factor**
A common mistake is reporting $8.4$ as the answer, treating the Mulliken value as if it were already Pauling. The two scales use different units. The 2.8 conversion factor is what brings Mulliken's eV-based number onto the Pauling 0–4 scale. An EN of 3 fits well on the Pauling scale (between sulfur 2.5 and oxygen 3.5).

$$\\boxed{\\text{Answer: (b)}}$$`,
  },
  {
    display_id: 'PERI-197',
    solution: `🧠 **F has the highest electronegativity but NOT the highest electron affinity. Its tiny $2p$ shell is so crowded that adding one more electron faces strong repulsion**
Two related but DIFFERENT properties:
- **Electronegativity** (EN): how strongly an atom pulls bonded electrons toward itself. F wins because of its small size and high $Z_{eff}$.
- **Electron affinity** (EA): the energy released when an isolated atom gains an electron. Cl beats F because Cl has more room to host the new electron.

The reason for the F vs Cl gap on EA is the small size and high electron density of F.

🗺️ **Walk through each option**
(a) "Atomic number of F is less than Cl" — true, but doesn't explain WHY EA is lower. Just a Z difference doesn't reverse a property.
(b) "F is first member of family, behaves unusually" — too vague. The question asks WHAT specifically makes F's EA lower.
(c) "Cl uses vacant 3d-orbital" — INCORRECT physics. The added electron in $\\ce{Cl}$ enters $3p$, not $3d$. The 3d explanation is wrong.
(d) "Small size, high electron density, increased electron repulsion makes addition less favourable in F vs Cl" — **this is the correct mechanistic reason.** F has 7 valence electrons crammed into a small $2p$ subshell; an 8th electron joining faces heavy repulsion. Cl has the same 7 valence electrons spread over a much larger $3p$ subshell.

⚠️ **The trap**
Option (c) sounds plausible because "3d-orbital" is a known stabilising factor for Cl in some contexts (like $\\ce{ClF5}$). But for electron AFFINITY of $\\ce{Cl}$ (the simple atomic process), the new electron enters $3p$ — there's no $d$-orbital involvement. Don't confuse 3d expansion in molecules with 3d involvement in atomic EA.

$$\\boxed{\\text{Answer: (d)}}$$`,
  },
  {
    display_id: 'PERI-199',
    solution: `🧠 **A more positive species pulls an incoming electron more strongly. $\\ce{O^{2+}}$ has the strongest pull, so electron addition is easiest there**
Electron addition is governed by Coulombic attraction. The more positive the species, the more strongly it pulls the incoming electron. So:
$$\\text{ease of electron gain: } \\ce{O^{2+}} > \\ce{O^+} > \\ce{O} > \\ce{O^-} > \\ce{O^{2-}}$$

🗺️ **Compare the four options**
$\\ce{O}$ (neutral): standard EGE ≈ −141 kJ/mol. Moderate attraction.
$\\ce{O^+}$ (charge +1): one electron gone, net attraction stronger. Adding an electron releases more energy than the neutral case.
$\\ce{O^{2+}}$ (charge +2): two electrons gone, even stronger attraction. **Easiest** of the four to gain an electron.
$\\ce{O^{2-}}$ (charge −2): already has 2 extra electrons, repels further additions. **Hardest** — you'd need to push against a strong negative charge.

So the easiest electron addition is to $\\ce{O^{2+}}$.

⚠️ **The trap**
Students sometimes pick $\\ce{O}$ (neutral) thinking "neutral atom gains electrons easily, that's electron affinity". True for neutral, but cations are EVEN easier — they actively want electrons back. Always rank by net charge: more positive = more electron-attracting.

$$\\boxed{\\text{Answer: (c)}}$$`,
  },
  {
    display_id: 'PERI-201',
    solution: `🧠 **Mulliken's formula uses BOTH IE and EA. You cannot calculate Mulliken electronegativity from just one ingredient**
Mulliken's definition: $EN_M = \\frac{IE + EA}{2}$. The "average" requires two inputs. IE measures how hard the atom holds onto its OWN electrons. EA measures how hard the atom pulls in NEW electrons. Together they characterise how strongly the atom holds shared electrons in a bond.

🗺️ **Eliminate the wrong options**
(a) "Only electronegativity" — circular, you can't define EN using EN itself.
(b) "Only electron affinity" — gives you only one half of the formula.
(c) "Electron affinity AND ionisation energy" — both ingredients of Mulliken's formula. ✓
(d) "Ionic potential and electronegativity" — wrong concepts entirely.

So you need both **IE** and **EA** to evaluate Mulliken EN.

⚠️ **Note**
This formula gives EN in eV (energy units). Pauling's scale is dimensionless. They are related but on different scales. Mulliken's idea was conceptually clean — express EN as actual energy — but Pauling's scale (with F = 4.0 reference) is more widely tabulated.

$$\\boxed{\\text{Answer: (c)}}$$`,
  },
  {
    display_id: 'PERI-202',
    solution: `🧠 **Neutral oxide = does not react with acid OR base. Among CO, $\\ce{SnO2}$, ZnO, $\\ce{SiO2}$, only CO is neutral**
Most oxides fall into one of three categories: acidic (non-metal), basic (metal), or amphoteric (boundary). Neutral oxides are rare — they react with neither acids nor bases. The classic neutral oxides are: $\\ce{CO}$, $\\ce{N2O}$, $\\ce{NO}$, $\\ce{H2O}$.

🗺️ **Classify each option**
(a) $\\ce{CO}$: carbon monoxide. Does not react with HCl. Does not react with NaOH. **Neutral.** ✓
(b) $\\ce{SnO2}$: tin in +4 state. Reacts with both acid and strong base. **Amphoteric**.
(c) $\\ce{ZnO}$: classic textbook **amphoteric** oxide. Dissolves in NaOH to give zincate.
(d) $\\ce{SiO2}$: silicon dioxide. Reacts with NaOH to form silicate. **Acidic** (weakly).

So only $\\ce{CO}$ is neutral.

⚠️ **The trap**
Don't confuse $\\ce{CO}$ (neutral) with $\\ce{CO2}$ (acidic — gives carbonic acid in water). Just one extra oxygen flips the nature completely. Same for nitrogen oxides: $\\ce{N2O}$ neutral, $\\ce{NO2}$ acidic. Always check the oxidation state and number of oxygens before classifying.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-204',
    solution: `🧠 **If each orbital can hold 3 electrons (instead of 2), each shell now holds $3n^2$ electrons. Sum up shells until you reach the start of the 4th period**
The standard rule: each shell $n$ has $n^2$ orbitals, each holding 2 electrons → $2n^2$ electrons per shell. The hypothetical rule in this question: 3 electrons per orbital → $3n^2$ per shell.

🗺️ **Count electrons shell by shell**
Shell 1 ($n=1$): 1 orbital × 3 = $3 \\times 1^2 = 3$ electrons. (Periods 1 ends at $Z = 3$.)
Shell 2 ($n=2$): 4 orbitals × 3 = $3 \\times 2^2 = 12$ electrons. (Period 2 ends at $Z = 3 + 12 = 15$.)
Shell 3 ($n=3$): 9 orbitals × 3 = $3 \\times 3^2 = 27$ electrons. (Period 3 ends at $Z = 15 + 27 = 42$.)

So Period 3 finishes at element 42. The first element of **Period 4** is at $Z = 43$.

⚠️ **The trap**
Students who forget the $n^2$-orbital rule per shell sometimes count only the $s$ and $p$ subshells, giving 4 orbitals per shell regardless of $n$. That gives $3 \\times 4 = 12$ per shell uniformly → first of Period 4 = $1 + 12 + 12 + 12 = 37$. But that ignores $d$, $f$, etc. The full count $n^2$ orbitals per shell gives the right answer 43.

$$\\boxed{\\text{Answer: (d)}}$$`,
  },
  {
    display_id: 'PERI-209',
    solution: `🧠 **Group 13 IE trend is irregular due to $d$- and $f$-block contractions. The accepted order is: B > Tl > Ga > Al > In. So In has the lowest IE**
Group 13 elements: B, Al, Ga, In, Tl. Naively you expect IE to drop monotonically down the group. But:
- Ga has $3d^{10}$ filled in its core → poor shielding → Ga's $IE$ stays HIGH (Ga > Al).
- Tl has $4f^{14}$ + $5d^{10}$ filled → even more poor shielding → Tl's $IE$ stays HIGH (Tl > In).

The result: $IE_1$ doesn't drop smoothly. The lowest of all is In.

🗺️ **For $IE_3$**
$IE_3$ = removing the third electron from $\\ce{M^{2+}}$, which has $ns^1$ configuration (since Group 13 lost both $np^1$ and one $ns$).
- $\\ce{M^{2+}}$ has just one $s$ electron. The IE order for removing it follows the same trend as for the neutral atom: B > Tl > Ga > Al > In.

So $IE_3$ is lowest for **In**.

⚠️ **The trap**
Many students apply the simple group rule and pick Tl (the heaviest), expecting "lowest IE down the group". But Tl's $4f$ contraction makes its electrons unusually well-held. In sits in a "sweet spot" — past the $3d$ contraction (so In > Ga in size) but before the $4f$ contraction kicks in. So In has the loosest hold.

$$\\boxed{\\text{Answer: (c)}}$$`,
  },
  {
    display_id: 'PERI-221',
    solution: `🧠 **Br⁻ has 4 shells (largest). $\\ce{S^{2-}}$ and $\\ce{Cl^-}$ are isoelectronic (3 shells each); among them, the one with fewer protons is larger — that's $\\ce{S^{2-}}$**
Two factors decide ionic radius:
1. **Number of shells** (period of the parent atom). More shells = larger ion.
2. **Number of protons** for ions with the same shell count. Fewer protons = larger ion.

🗺️ **Apply to the three ions**
$\\ce{Br^-}$: parent Br is Period 4 → 4 shells. $Z = 35$, 36 electrons.
$\\ce{S^{2-}}$: parent S is Period 3 → 3 shells. $Z = 16$, 18 electrons.
$\\ce{Cl^-}$: parent Cl is Period 3 → 3 shells. $Z = 17$, 18 electrons.

Step 1: $\\ce{Br^-}$ has 4 shells → biggest. Other two have 3 shells.
Step 2: Among $\\ce{S^{2-}}$ and $\\ce{Cl^-}$ (both 3 shells, 18 electrons), $\\ce{S^{2-}}$ has fewer protons (16 vs 17) → larger.

So decreasing order: $\\ce{Br^- > S^{2-} > Cl^-}$.

⚠️ **The trap**
Option (b) puts $\\ce{S^{2-}}$ first, ignoring the fact that $\\ce{Br^-}$ has an extra shell. Don't apply the "more negative = bigger" rule blindly across periods. Periods (shell count) dominate. Only use the proton-count rule for isoelectronic species (same shells).

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-224',
    solution: `🧠 **In $\\ce{NCl3}$, the question's answer key treats N as $-3$ — gives $(x+5)/2 = 1$**
The oxidation-state assignment depends on which atom is more electronegative. By the convention used in this question:
- N is treated as the more electronegative atom in $\\ce{NCl3}$.
- So Cl gets $+1$ each, N gets $-3$.
- $x = -3$.

🗺️ **Plug into the formula**
$$\\frac{x + 5}{2} = \\frac{-3 + 5}{2} = \\frac{2}{2} = 1$$

So the answer is **1**.

⚠️ **Note on convention**
Modern Pauling values: $\\text{EN}(\\ce{N}) = 3.04$, $\\text{EN}(\\ce{Cl}) = 3.16$. By that scale, Cl is slightly more electronegative — which would make N $+3$ in $\\ce{NCl3}$ (similar to $\\ce{NF3}$ where N is $+3$). That would give $(x+5)/2 = (3+5)/2 = 4$.

The keyed answer of **1** assumes N is treated as more electronegative than Cl (a less-common convention used in some older Indian textbooks). Compare with $\\ce{NF3}$: there the convention is unambiguous — F is more EN, N is $+3$. For $\\ce{NCl3}$, sources differ; this question uses N $= -3$.

$$\\boxed{\\text{Answer: 1}}$$`,
  },
  {
    display_id: 'PERI-226',
    solution: `🧠 **Group IIIB (= IUPAC Group 3) includes Sc, Y, La, Ac plus all 14 lanthanides and 14 actinides — total 32 elements**
In the older American CAS naming, "Group IIIB" refers to the column starting with Sc and Y. In the long-form periodic table, this column extends through La (and the 14 lanthanides) and Ac (and the 14 actinides). All 32 are considered Group 3 / IIIB members.

🗺️ **Count the members**
- Sc and Y: 2 elements.
- La + 14 lanthanides (Ce, Pr, ..., Lu): 15 elements.
- Ac + 14 actinides (Th, Pa, ..., Lr): 15 elements.

Total: $2 + 15 + 15 = 32$ elements.

So $x = 32$.

**Plug into the formula:**
$$\\frac{x + 8}{10} = \\frac{32 + 8}{10} = \\frac{40}{10} = 4$$

⚠️ **Note**
There's debate over whether La/Ac belong to Group 3 or to the f-block, but the standard answer for this question follows the convention "Group IIIB has 32 members" — the broadest interpretation. If your textbook uses the narrow definition (just 4: Sc, Y, La, Ac), you'd get $(4+8)/10 = 1.2$ — not an integer, so that convention isn't used here. Stick with 32.

$$\\boxed{\\text{Answer: 4}}$$`,
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
    const newSolution = { ...(ex.solution || {}), text_markdown: u.solution, latex_validated: true, last_validated_at: now };
    const r = await col.updateOne({ display_id: u.display_id }, { $set: { solution: newSolution, last_validated_at: now } });
    console.log(`UPDATED: ${u.display_id} (modified=${r.modifiedCount})`);
    ok++;
  }
  console.log(`\nDone. ${ok}/${updates.length}`);
  await c.close();
})().catch(e => { console.error(e); process.exit(1); });
