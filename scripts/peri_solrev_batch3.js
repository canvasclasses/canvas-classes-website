// Solution-rewrite batch 3: PERI-162, 166, 168, 169, 170, 171, 174, 175, 176, 177
// Also fixes broken placeholder options on PERI-168/169/170/171.
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const updates = [
  {
    display_id: 'PERI-162',
    solution: `🧠 **$IE_1(\\ce{N}) > IE_1(\\ce{O})$ — but only by about 1 eV. They are close enough to be called "comparable"**
$IE_1(\\ce{N}) \\approx 14.6$ eV, $IE_1(\\ce{O}) \\approx 13.6$ eV. The 1 eV gap exists because of N's stable half-filled $2p^3$ — but it is a small gap on the chemistry scale (where IE values typically span 5–25 eV).

🗺️ **Evaluate each statement**
(a) "$IP(\\ce{O}) < IP(\\ce{N})$": $13.6 < 14.6$ — **True**.
(b) "$IP(\\ce{N}) > IP(\\ce{O})$": same fact, restated — **True**.
(c) "Two values are comparable": difference is only 1 eV out of ~14 — **True**.
(d) "Difference is too large": 1 eV is small in chemical-energy terms — **False**.

So three statements are correct: (a), (b), (c).

⚠️ **The trap**
Statements (a) and (b) say the same thing in different words. Some students see them as "redundant" and look for one to be false — but they are simply equivalent restatements, both true. The only false statement is (d), where "too large" overstates the case.

$$\\boxed{\\text{Answer: (a), (b), (c)}}$$`,
  },
  {
    display_id: 'PERI-166',
    solution: `🧠 **Be's filled $2s^2$ is harder to break than B's lone $2p^1$ — Statement I is true. But Statement II claims 2p < 2s in energy, which is wrong**
Statement I tests the famous Be-B IE anomaly: $IE_1(\\ce{Be}) > IE_1(\\ce{B})$ even though B has higher Z. Reason: Be removes from filled $2s^2$, B removes from lone $2p^1$.

Statement II is a basic orbital-energy fact: in a multi-electron atom, $2s$ sits BELOW $2p$ (the $2s$ orbital penetrates closer to the nucleus). Statement II says the opposite.

🗺️ **Verify Statement I**
$IE_1(\\ce{Be}) = 899\\,kJ/mol$, $IE_1(\\ce{B}) = 801\\,kJ/mol$. Yes, $\\ce{Be} > \\ce{B}$. **True**.

**Verify Statement II**
Aufbau order: $1s < 2s < 2p < 3s < ...$. So 2s is LOWER in energy than 2p — that's why electrons fill $2s$ before $2p$. The statement claims 2p is lower than 2s, which contradicts the Aufbau principle. **False**.

So Statement I true, Statement II false.

⚠️ **The trap**
The two statements LOOK related — both involve $2s$ and $2p$. Students might assume "if I is right, II must explain it". But the explanation here actually requires the OPPOSITE of Statement II: it is because $2s$ is LOWER (not higher) that the $2s$ electron is harder to remove. So II contradicts the very logic that makes I true.

$$\\boxed{\\text{Answer: (c)}}$$`,
  },
  {
    display_id: 'PERI-168',
    options: [
      { id: 'a', text: 'Inert pair effect', is_correct: true },
      { id: 'b', text: 'Lanthanide contraction', is_correct: false },
      { id: 'c', text: 'Diagonal relationship', is_correct: false },
      { id: 'd', text: 'Lattice energy', is_correct: false },
    ],
    answer: { correct_option: 'a' },
    solution: `🧠 **Heavy p-block elements lock their $ns^2$ pair in the core — this is the inert pair effect**
Going down Group 14 (C → Si → Ge → Sn → Pb), the $ns^2$ valence electrons become increasingly reluctant to bond. The reason involves poor shielding by inner $4f$ and $5d$ electrons, plus relativistic stabilisation of the $6s$ orbital. The $6s^2$ pair stays "inert", so heavy elements prefer oxidation states 2 less than the maximum.

🗺️ **Apply to Lead**
$\\ce{Pb}$ (Period 6) has $[\\ce{Xe}]\\,4f^{14}\\,5d^{10}\\,6s^2\\,6p^2$. The $6s^2$ pair is the "inert pair".
- $\\ce{Pb^{4+}}$: uses all four valence electrons (loses both $6s$ and $6p$). The $6s^2$ pair has been forced out — energetically expensive.
- $\\ce{Pb^{2+}}$: keeps the $6s^2$ intact, loses only $6p^2$. **More stable**.

So $\\ce{Pb^{4+}}$ is easily reduced to $\\ce{Pb^{2+}}$ — the +2 state retains the stable $6s^2$.

⚠️ **Don't confuse with…**
**Lanthanide contraction** explains why Hf is similar in size to Zr — that's about radii, not oxidation-state stability. **Diagonal relationship** is about Li-Mg, Be-Al, B-Si pairings — also unrelated. The inert pair effect is uniquely about the reluctance of $ns^2$ to bond in heavy p-block elements.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-169',
    options: [
      { id: 'a', text: 'More nuclear charge', is_correct: true },
      { id: 'b', text: 'Fewer electrons', is_correct: false },
      { id: 'c', text: 'Larger atomic mass', is_correct: false },
      { id: 'd', text: 'More shells', is_correct: false },
    ],
    answer: { correct_option: 'a' },
    solution: `🧠 **$\\ce{Ca^{2+}}$ and $\\ce{K^+}$ are isoelectronic — same 18 electrons. Ca's extra proton pulls them in tighter, so Ca²⁺ is smaller**
Both ions have the configuration $[\\ce{Ar}]$: $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6$ — exactly 18 electrons. So the SHELL count is identical for both. The only difference is the proton count.

🗺️ **Compare nuclear charges**
$\\ce{K^+}$: Z = 19 (potassium, lost 1 electron from neutral K).
$\\ce{Ca^{2+}}$: Z = 20 (calcium, lost 2 electrons from neutral Ca).

With one extra proton pulling on the same 18 electrons, $\\ce{Ca^{2+}}$ contracts more. Result: $\\ce{Ca^{2+}}$ ($\\approx 100$ pm) < $\\ce{K^+}$ ($\\approx 138$ pm).

⚠️ **Don't say "fewer electrons"**
Option (b) is wrong — both ions have the SAME number of electrons (18). The difference is in protons. Also, both ions have the same number of filled shells (3 each), so option (d) is wrong. The single correct reason is "more nuclear charge" on $\\ce{Ca^{2+}}$.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-170',
    options: [
      { id: 'a', text: 'Electronegativity', is_correct: true },
      { id: 'b', text: 'Electron affinity', is_correct: false },
      { id: 'c', text: 'Ionisation potential', is_correct: false },
      { id: 'd', text: 'Electropositivity', is_correct: false },
    ],
    answer: { correct_option: 'a' },
    solution: `🧠 **Mulliken's definition: electronegativity = average of IE and EA**
On the Mulliken scale:
$$EN_M = \\frac{IE + EA}{2}$$

Why average? IE measures how hard the atom holds its OWN electrons. EA measures how hard the atom pulls in NEW electrons. An atom that does both well must be "electronegative" — pulling shared electrons strongly. Mulliken combined the two into one number.

🗺️ **Why not the other options?**
- **Electron affinity** is just one of the two ingredients, not the average.
- **Ionisation potential** is the other ingredient.
- **Electropositivity** is the OPPOSITE concept (tendency to lose electrons, not pull them).

The averaging gives **electronegativity** in a different unit system from Pauling's. To convert Mulliken EN (in eV) to Pauling EN, use $EN_P = EN_M / 2.8$ approximately.

⚠️ **Note**
Pauling's scale is the more widely used one (F = 4.0, etc.), but Mulliken's is conceptually cleaner — it gives EN in actual energy units. The "average of IE and EA" definition is uniquely Mulliken's contribution.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-171',
    options: [
      { id: 'a', text: 'Electron gain enthalpy', is_correct: true },
      { id: 'b', text: 'Ionisation enthalpy', is_correct: false },
      { id: 'c', text: 'Lattice energy', is_correct: false },
      { id: 'd', text: 'Hydration enthalpy', is_correct: false },
    ],
    answer: { correct_option: 'a' },
    solution: `🧠 **Adding an electron to a neutral gaseous atom = electron gain enthalpy ($\\Delta_{eg}H$)**
The defining process: $\\ce{X(g) + e^- -> X^-(g)}$. The energy change is called electron gain enthalpy. For most atoms the value is negative (energy is released, exothermic). For atoms like Be and Ar (with stable closed/half-closed shells), the value can be positive.

🗺️ **Eliminate the other options**
- **Ionisation enthalpy** is the opposite process: $\\ce{X(g) -> X^+(g) + e^-}$. Removing an electron, not adding.
- **Lattice energy** is the energy released when gaseous ions come together to form a solid lattice (e.g., $\\ce{Na^+ + Cl^- -> NaCl}$). Not the same as electron gain.
- **Hydration enthalpy** is the energy released when an ion is surrounded by water molecules. Solvation, not electron addition.

So the answer is electron gain enthalpy.

⚠️ **Note**
"Electron affinity" is the older term for this same quantity. Modern usage prefers electron gain enthalpy because it is a standard thermodynamic quantity. They are numerically very close — not the same physical interpretation but typically interchangeable in textbook problems.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-174',
    solution: `🧠 **Question asks: in which pair is the SECOND species larger than the first? Walk through each pair.**
For each pair, decide whether the second-listed species is bigger. There is exactly one pair where this is true.

🗺️ **Check each option**
(a) $\\ce{Ti^{4+}}$ vs $\\ce{Mn^{7+}}$: $\\ce{Mn^{7+}}$ has higher charge AND fewer electrons (only 18 left vs Ti's 18 too, but Mn has more protons pulling them in). $\\ce{Mn^{7+}} < \\ce{Ti^{4+}}$. Second is smaller. ✗

(b) $\\ce{Na}$ vs $\\ce{Mg}$: same period, Mg is to the right of Na. Across a period, atomic radius shrinks. So Mg < Na. Second is smaller. ✗

(c) $\\ce{Cl^-}$ vs $\\ce{K^+}$: both isoelectronic with 18 electrons. $\\ce{Cl^-}$ has $Z=17$, $\\ce{K^+}$ has $Z=19$. Higher Z = smaller ion. So $\\ce{K^+} < \\ce{Cl^-}$. Second is smaller. ✗

(d) $\\ce{P^{5+}}$ vs $\\ce{P^{3+}}$: same element, different cations. $\\ce{P^{5+}}$ has lost 5 electrons; $\\ce{P^{3+}}$ has lost only 3. Fewer electrons removed = larger remaining cloud. So $\\ce{P^{3+}} > \\ce{P^{5+}}$. **Second is larger. ✓**

⚠️ **The trap**
For two cations of the same element, the one with the SMALLER positive charge is larger. Higher cationic charge = more electrons stripped away = greater contraction. So $\\ce{P^{5+}}$ is much smaller than $\\ce{P^{3+}}$. Don't confuse "more positive" with "bigger" — it is the opposite for ions of the same element.

$$\\boxed{\\text{Answer: (d)}}$$`,
  },
  {
    display_id: 'PERI-175',
    solution: `🧠 **Aluminium plumbate = Al³⁺ combined with the plumbate ion $\\ce{PbO3^{2-}}$. Cross-multiply the charges to get $\\ce{Al2(PbO3)3}$**
The plumbate ion is $\\ce{PbO3^{2-}}$, where Pb is in the +4 state. To balance with $\\ce{Al^{3+}}$, you need a common multiple of charges.

🗺️ **Cross-multiply method**
$\\ce{Al^{3+}}$ has charge +3. Plumbate $\\ce{PbO3^{2-}}$ has charge −2.
LCM of 3 and 2 = 6. So:
- 2 Al ions give +6 charge.
- 3 plumbate ions give −6 charge.
- Net charge: 0. ✓

Formula: $\\ce{Al2(PbO3)3}$ — option (b).

⚠️ **Don't confuse plumbate with plumbite**
- **Plumbate** = $\\ce{PbO3^{2-}}$ (Pb in +4 state). This is what the question asks about.
- **Plumbite** = $\\ce{PbO2^{2-}}$ (Pb in +2 state). Different ion.

Option (c) gives $\\ce{Al2(PbO2)3}$ — that would be aluminium plumbite, not plumbate. Always check the suffix: -ate = higher oxidation state, -ite = lower.

$$\\boxed{\\text{Answer: (b)}}$$`,
  },
  {
    display_id: 'PERI-176',
    solution: `🧠 **In $\\ce{K2MnO4}$, Mn is in the +6 state — that makes it manganate, not permanganate**
The "per-" prefix means highest oxidation state. For Mn, that's +7 (in $\\ce{MnO4^-}$). Without "per-", Mn sits in +6 (in $\\ce{MnO4^{2-}}$). Count the K's and check the oxidation state to decide.

🗺️ **Find Mn oxidation state**
In $\\ce{K2MnO4}$: 2 K's contribute +2, 4 O's contribute −8. Let Mn = $x$.
$2(+1) + x + 4(-2) = 0$
$x = 6$. So Mn is in the **+6 state**.

Mn(+6) in $\\ce{MnO4^{2-}}$ = manganate.
Mn(+7) in $\\ce{MnO4^-}$ = permanganate.

So $\\ce{K2MnO4}$ = potassium **manganate**.

⚠️ **The trap**
$\\ce{KMnO4}$ (potassium permanganate, the deep purple oxidising agent) is the famous compound. $\\ce{K2MnO4}$ has TWO K's and one less Mn-O bond's worth of oxidation power — it's the green-coloured potassium manganate. They are NOT the same compound. Always count the K atoms before naming.

(Note: option (b) uses "magnate", which is a non-standard spelling of "manganate" appearing in some Indian textbooks. The IUPAC-correct spelling is "manganate".)

$$\\boxed{\\text{Answer: (b)}}$$`,
  },
  {
    display_id: 'PERI-177',
    solution: `🧠 **$\\ce{H3PO4}$ is phosphoric acid; remove one $\\ce{H^+}$ to get $\\ce{H2PO4^-}$ = dihydrogen phosphate. With $\\ce{Na^+}$, the salt is sodium dihydrogen phosphate**
Phosphoric acid has three ionisable H's. As you remove them step by step:
- $\\ce{H3PO4}$ → $\\ce{H2PO4^-}$ (dihydrogen phosphate, "two H's left").
- $\\ce{H2PO4^-}$ → $\\ce{HPO4^{2-}}$ (hydrogen phosphate, "one H left").
- $\\ce{HPO4^{2-}}$ → $\\ce{PO4^{3-}}$ (phosphate, "no H left").

🗺️ **Identify $\\ce{NaH2PO4}$**
The anion is $\\ce{H2PO4^-}$ — two H's still attached. So the name is "sodium dihydrogen phosphate".

⚠️ **Don't mix up these closely-named species**
- **Phosphate** = $\\ce{PO4^{3-}}$ (from phosphoric acid $\\ce{H3PO4}$). P is +5.
- **Phosphite** = $\\ce{PO3^{3-}}$ (from phosphorous acid $\\ce{H3PO3}$). P is +3.
- **Phosphide** = $\\ce{P^{3-}}$ (binary anion, e.g., $\\ce{Mg3P2}$). P is −3.

Option (a) "sodium dihydrogen phosphite" would correspond to $\\ce{NaH2PO3}$ (one less O). Option (b) "phosphide" doesn't even have oxygen in it. The "-ate" suffix and the count of H's together pin down option (d).

$$\\boxed{\\text{Answer: (d)}}$$`,
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
    const setOps = { solution: newSolution, last_validated_at: now };
    if (u.options) setOps.options = u.options;
    if (u.answer) setOps.answer = u.answer;
    const r = await col.updateOne({ display_id: u.display_id }, { $set: setOps });
    console.log(`UPDATED: ${u.display_id} (modified=${r.modifiedCount}${u.options ? ' [+options]' : ''})`);
    ok++;
  }
  console.log(`\nDone. ${ok}/${updates.length}`);
  await c.close();
})().catch(e => { console.error(e); process.exit(1); });
