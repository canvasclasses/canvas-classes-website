// Solution-rewrite batch 2: PERI-141, 142, 149, 151, 153, 154, 156, 157, 160, 161
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const updates = [
  {
    display_id: 'PERI-141',
    solution: `🧠 **Apatite is a calcium phosphate mineral — its main element is Phosphorus. So you need $IE_1$ of P**
The apatite family includes minerals like fluorapatite ($\\ce{Ca5(PO4)3F}$), chlorapatite, and hydroxyapatite. They are all calcium phosphate minerals — phosphorus is the key element. Question wants $IE_1$ of phosphorus, then match it to one of the four numerical options.

🗺️ **Identify the value**
Group 15 first ionisation enthalpies (kJ/mol):
$\\ce{N}$ (Period 2): $1402$.
$\\ce{P}$ (Period 3): $1012$.
$\\ce{As}$ (Period 4): $947$.
$\\ce{Sb}$ (Period 5): $834$.

So $IE_1(\\ce{P}) = 1012\\,kJ/mol$. That matches option (a).

⚠️ **Common mistake**
Option (b) gives 1402 — which is N's IE. Students who don't know that apatite is a phosphate mineral might think the question is about Nitrogen. Apatite contains $\\ce{PO4^{3-}}$, not nitrate. Tooth enamel and bones are made of hydroxyapatite — phosphate. Lock this in: apatite ↔ phosphorus.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-142',
    solution: `🧠 **Lowest IE = most metallic = bottom-left of the periodic table. Among the given Z values, that is Fr ($Z = 87$)**
Ionisation enthalpy decreases down a group (more shells, weaker pull) and decreases right-to-left across a period. The very bottom-left of the table is occupied by Group 1 alkali metals — and the heaviest of these (Fr) has the lowest $IE_1$ of all elements.

🗺️ **Identify each element**
$Z = 32$: Germanium (Ge) — $p$-block metalloid, Group 14, Period 4. $IE_1 \\approx 762\\,kJ/mol$.
$Z = 35$: Bromine (Br) — halogen, Group 17. High IE. $IE_1 \\approx 1140\\,kJ/mol$.
$Z = 19$: Potassium (K) — Group 1, Period 4. $IE_1 \\approx 419\\,kJ/mol$.
$Z = 87$: Francium (Fr) — Group 1, Period 7. $IE_1 \\approx 380\\,kJ/mol$ (lowest of all naturally occurring elements).

Among these, **Fr** has the lowest $IE_1$.

⚠️ **The trap**
Many students pick K because it is a known alkali metal with a low IE. K is close (419), but Fr is even lower (380). When the choice is between two alkali metals, the heavier one always wins for low IE.

$$\\boxed{\\text{Answer: (c)}}$$`,
  },
  {
    display_id: 'PERI-149',
    solution: `🧠 **Maximum unpaired electrons → look for the largest half-filled $d$ subshell. Fe²⁺ has $3d^6$ → 4 unpaired by Hund's rule**
For transition metal cations, the unpaired electrons live in the $d$ subshell. Fill the $d$ orbitals one electron at a time (Hund's rule) before pairing up. Whichever ion has the most singly-occupied $d$ orbitals wins.

🗺️ **Count unpaired electrons in each ion**
$\\ce{Mg^{2+}}$: $[\\ce{Ne}]$. Filled core. **0 unpaired.**
$\\ce{Ti^{3+}}$: $[\\ce{Ar}]\\,3d^1$. One $d$ electron. **1 unpaired.**
$\\ce{V^{3+}}$: $[\\ce{Ar}]\\,3d^2$. Two $d$ electrons in two different orbitals. **2 unpaired.**
$\\ce{Fe^{2+}}$: $[\\ce{Ar}]\\,3d^6$. Hund: fill all 5 $d$-orbitals singly first ($\\uparrow\\,\\uparrow\\,\\uparrow\\,\\uparrow\\,\\uparrow$), then pair the 6th electron with the first one ($\\uparrow\\downarrow$). Final: $\\uparrow\\downarrow\\,\\uparrow\\,\\uparrow\\,\\uparrow\\,\\uparrow$. **4 unpaired.**

Maximum = $\\ce{Fe^{2+}}$ with 4 unpaired electrons.

⚠️ **Common mistake**
Some students think $\\ce{V^{3+}}$ ($3d^2$) might tie with $\\ce{Fe^{2+}}$ because $d^2$ also has all unpaired. But $d^2$ has only 2 unpaired electrons, not 4. The trick is to find the ion whose $d$-count crosses 5 (so all five orbitals are at least half-full) — $d^5$ gives 5 unpaired (the max), then $d^6$ drops to 4, $d^7$ to 3, and so on. $\\ce{Fe^{2+}}$ at $d^6$ is the closest to the half-filled $d^5$ peak in this list.

$$\\boxed{\\text{Answer: (d)}}$$`,
  },
  {
    display_id: 'PERI-151',
    solution: `🧠 **All four are isoelectronic (10 electrons each) — the one with the most protons is smallest**
$\\ce{N^{3-}}$, $\\ce{O^{2-}}$, $\\ce{F^-}$, $\\ce{Na^+}$ all have the configuration $1s^2\\,2s^2\\,2p^6$. So electron count and orbital arrangement are identical. Size depends only on how many protons are pulling on the same 10-electron cloud.

🗺️ **Compare nuclear charges**
$\\ce{N^{3-}}$: $Z = 7$ — weakest pull, biggest ion.
$\\ce{O^{2-}}$: $Z = 8$.
$\\ce{F^-}$: $Z = 9$.
$\\ce{Na^+}$: $Z = 11$ — strongest pull, smallest ion.

Increasing size: $\\ce{Na^+ < F^- < O^{2-} < N^{3-}}$. So **$\\ce{Na^+}$ is the smallest**.

⚠️ **Common mistake**
Students often pick $\\ce{F^-}$ thinking "F is the smallest neutral atom in the set, so $\\ce{F^-}$ should also be smallest". But all four are isoelectronic — the comparison ignores neutral-atom positions and depends only on Z. With Z = 11, $\\ce{Na^+}$ wins. The cation–anion label doesn't matter; only proton count does.

$$\\boxed{\\text{Answer: (d)}}$$`,
  },
  {
    display_id: 'PERI-153',
    solution: `🧠 **Electronegativity rises left-to-right in a period and rises bottom-to-top in a group. Period 2 > Period 3 in the same group**
Pauling EN values (approximate):
- Period 2: C = 2.55, N = 3.04.
- Period 3: Si = 1.90, P = 2.19.

So Period 2 atoms (C, N) sit higher in EN than their Period 3 counterparts (Si, P). Within each row, the right-hand element wins.

🗺️ **Rank the four**
$\\ce{Si}$: Period 3, Group 14 — lowest at 1.90.
$\\ce{P}$: Period 3, Group 15 — next at 2.19.
$\\ce{C}$: Period 2, Group 14 — higher at 2.55.
$\\ce{N}$: Period 2, Group 15 — highest at 3.04.

Increasing order: $\\ce{Si < P < C < N}$.

⚠️ **Common mistake**
Option (a) puts $\\ce{C, N, Si, P}$ in order — that mixes the periods. The crucial step is to remember that any Period 2 element beats any Period 3 element of the same group in EN. So Si and P (Period 3) come BEFORE C and N (Period 2) in the increasing ranking. Don't list strictly by atomic number.

$$\\boxed{\\text{Answer: (c)}}$$`,
  },
  {
    display_id: 'PERI-154',
    solution: `🧠 **F's covalent radius (0.72 Å) and Ne's van der Waals radius (1.60 Å) are measured in completely different ways — that's why Ne LOOKS bigger than F**
Atomic radius means different things for different atoms:
- Non-metals that bond covalently → **covalent radius** = half the bond distance in a $\\ce{X-X}$ bond.
- Noble gases that don't bond → **van der Waals radius** = half the distance of closest approach between two non-bonded atoms.

Van der Waals radii are always ~1.5-2× larger than covalent radii of nearby atoms.

🗺️ **Apply to F and Ne**
$\\ce{F}$ (Period 2, Group 17): forms $\\ce{F-F}$ bonds. Covalent radius = $0.72\\,\\text{Å}$.
$\\ce{Ne}$ (Period 2, Group 18): noble gas, no bonds. Only van der Waals radius is measurable: $1.60\\,\\text{Å}$.

Both values listed in option (a) match the standard tabulated numbers.

⚠️ **The trap**
Students apply the period trend "size decreases left-to-right" and conclude Ne should be smaller than F. That trend assumes a consistent type of radius — but Ne has no covalent radius to give. You're literally comparing apples (covalent F) with oranges (vdW Ne). Always note WHICH radius is being measured before applying any trend.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-156',
    solution: `🧠 **Hydration energy depends on charge density (charge ÷ radius). High charge OR small size = high hydration energy**
Hydration energy is the energy released when a gaseous ion grabs water molecules around itself. The greater the charge density, the harder the ion attracts water dipoles. So:
- Higher charge → higher hydration energy.
- Smaller radius → higher hydration energy.

$\\ce{Mg^{2+}}$ has charge +2 and a small Period 3 radius (72 pm).

🗺️ **Compare each option to $\\ce{Mg^{2+}}$**
$\\ce{Al^{3+}}$ (charge +3, radius 54 pm): both higher charge AND smaller. **Al³⁺ > Mg²⁺.** So $\\ce{Mg^{2+}}$ is NOT bigger than $\\ce{Al^{3+}}$ — eliminate (a).
$\\ce{Na^+}$ (charge +1, radius 102 pm): lower charge AND larger. **Na⁺ < Mg²⁺.** So $\\ce{Mg^{2+}}$ IS bigger than $\\ce{Na^+}$. ✓
$\\ce{Be^{2+}}$ (charge +2, radius 45 pm): same charge but smaller. **Be²⁺ > Mg²⁺.** Eliminate (c).
(d) is the same ion compared to itself — meaningless.

So $\\ce{Mg^{2+}}$'s hydration energy is larger than only $\\ce{Na^+}$.

⚠️ **Common mistake**
Some students assume that all alkaline earth ions have the highest hydration energies because they have +2 charge. But within Group 2, $\\ce{Be^{2+}}$ beats $\\ce{Mg^{2+}}$ because Be²⁺ is much smaller. And $\\ce{Al^{3+}}$ beats both. Always combine the charge AND the size.

$$\\boxed{\\text{Answer: (b)}}$$`,
  },
  {
    display_id: 'PERI-157',
    solution: `🧠 **Across Period 2, IE generally rises — but Nitrogen jumps higher because of half-filled $2p^3$ stability**
The general trend $IE_1$ rises from B → C → N → O → F. But N has a half-filled $2p^3$ configuration with extra exchange-energy stability. So N's IE is HIGHER than O's, breaking the smooth rise.

🗺️ **Rank the four**
B ($2p^1$): one lone $2p$ electron — easiest to remove. $IE_1 = 801$ kJ/mol.
C ($2p^2$): two unpaired $2p$ electrons. $IE_1 = 1086$ kJ/mol.
N ($2p^3$): half-filled $2p^3$, extra stability. $IE_1 = 1402$ kJ/mol — **highest in this set**.
O ($2p^4$): one paired electron with repulsion. $IE_1 = 1314$ kJ/mol — drops below N.

Order: $\\ce{B < C < O < N}$. Highest is **N (nitrogen)**.

⚠️ **The trap**
Students who haven't learned the N-O anomaly will pick (d) Oxygen, thinking IE rises smoothly across the period. The half-filled $2p^3$ stability of N is the must-know exception. Always check for this anomaly when ranking Period 2 IE values.

$$\\boxed{\\text{Answer: (c)}}$$`,
  },
  {
    display_id: 'PERI-160',
    solution: `🧠 **$\\ce{Be^-}$ is the least stable — adding an electron forces it into a higher-energy 2p orbital and disrupts the stable $2s^2$ closed subshell**
For each ion, ask: does the configuration end up at a stable point (filled or half-filled subshell) or at an awkward intermediate? $\\ce{Be^-}$ moves from a beautifully filled $2s^2$ into an unstable $2s^2\\,2p^1$ — for no reward.

🗺️ **Check each ion's configuration**
$\\ce{Li^+}$: removes Li's lone $2s^1$ → $1s^2$ (helium core). Highly stable. ✓
$\\ce{Be^-}$: adds an electron to Be ($1s^2\\,2s^2$) → $1s^2\\,2s^2\\,2p^1$. The new electron sits in a higher-energy orbital with no special stability gained. **LEAST stable.**
$\\ce{B^-}$: adds an electron to B ($1s^2\\,2s^2\\,2p^1$) → $1s^2\\,2s^2\\,2p^2$. Reasonable — gives a $p^2$ configuration, not specially unstable.
$\\ce{C^-}$: adds an electron to C ($2p^2$) → $2p^3$. Half-filled $2p$ — stable!

So order of stability (most → least): $\\ce{Li^+} > \\ce{C^-} > \\ce{B^-} > \\ce{Be^-}$.

⚠️ **The trap**
Many students assume cations are always more stable than anions. Not always — context matters. Here $\\ce{Li^+}$ (cation) and $\\ce{C^-}$ (anion) are BOTH stable because of their resulting configurations. The least-stable species is the one whose configuration is unfavourable, regardless of charge. $\\ce{Be^-}$ disrupts a closed shell — that's the killer.

$$\\boxed{\\text{Answer: (b)}}$$`,
  },
  {
    display_id: 'PERI-161',
    solution: `🧠 **Amphoteric oxides react with BOTH acids and bases. Memorise the standard list: ZnO, $\\ce{Al2O3}$, BeO, PbO, $\\ce{PbO2}$, SnO, $\\ce{SnO2}$, $\\ce{Cr2O3}$**
The question asks for options where ALL FOUR oxides are amphoteric. So even one non-amphoteric oxide kills an option.

🗺️ **Eliminate the wrong options**
(a) $\\ce{NO, B2O3, PbO, SnO2}$:
- $\\ce{NO}$ is **neutral** (laughing-gas-like). ✗
- $\\ce{B2O3}$ is **acidic** (gives boric acid). ✗
Two non-amphoteric in this set. Eliminate.

(b) $\\ce{Cr2O3, CrO, SnO, PbO}$:
- $\\ce{CrO}$ is **basic** (Cr in +2 state behaves like a metal oxide). ✗
Eliminate.

(c) $\\ce{Cr2O3, BeO, SnO, SnO2}$:
- $\\ce{Cr2O3}$: amphoteric ✓
- $\\ce{BeO}$: amphoteric ✓
- $\\ce{SnO}$: amphoteric ✓
- $\\ce{SnO2}$: amphoteric ✓
**All amphoteric. Correct.**

(d) $\\ce{ZnO, Al2O3, PbO, PbO2}$:
- $\\ce{ZnO}$: amphoteric ✓
- $\\ce{Al2O3}$: amphoteric ✓
- $\\ce{PbO}$: amphoteric ✓
- $\\ce{PbO2}$: amphoteric ✓
**All amphoteric. Correct.**

So both (c) and (d) are correct.

⚠️ **The trap**
$\\ce{CrO}$ in option (b) catches students. While $\\ce{Cr2O3}$ (Cr in +3) IS amphoteric, $\\ce{CrO}$ (Cr in +2) is basic. Same element, different oxidation state, different oxide nature. Always check the oxidation state before classifying.

$$\\boxed{\\text{Answer: (c), (d)}}$$`,
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
