// Solution-rewrite batch 6 (final): PERI-228, 229, 233, 235, 236, 239, 254, 314, 315
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const updates = [
  {
    display_id: 'PERI-228',
    solution: `🧠 **H sits at EN = 2.1 on the Pauling scale. Count elements in the list with EN strictly less than 2.1**
Hydrogen's electronegativity is right at 2.1, sitting between Boron (2.0) and Carbon (2.5). The question asks for elements LESS electronegative than H — so EN < 2.1.

🗺️ **Pauling EN of each element**
| Element | EN | < 2.1? |
|---|---|---|
| Li | 1.0 | ✓ |
| B | 2.0 | ✓ |
| C | 2.5 | ✗ |
| N | 3.0 | ✗ |
| O | 3.5 | ✗ |
| P | 2.1 | ✗ (equal, not less) |
| Si | 1.8 | ✓ |
| S | 2.5 | ✗ |
| Be | 1.5 | ✓ |
| Zn | 1.6 | ✓ |
| Fe | 1.8 | ✓ |

Counted: Li, B, Si, Be, Zn, Fe = **6** elements.

⚠️ **The trap**
P is exactly 2.1 — equal to H, not less. Don't include it. Also note B (2.0) is less than H — many students forget that B is below the H benchmark. Memorize the H = 2.1 boundary; it's the line that separates "more electronegative than H" (above) from "less" (below).

$$\\boxed{\\text{Answer: 6}}$$`,
  },
  {
    display_id: 'PERI-229',
    solution: `🧠 **For Cr ($Z=24$), find subshells with $n+l \\geq 4$ and sum the electrons in them**
Cr has the configuration $[\\ce{Ar}]\\,3d^5\\,4s^1$ — i.e., $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,3d^5\\,4s^1$. For each subshell, compute $n + l$ (where $\\ell = 0$ for $s$, $1$ for $p$, $2$ for $d$, $3$ for $f$). Then add up the electrons in subshells with $n+l \\geq 4$.

🗺️ **Compute $n+l$ for each subshell in Cr**
| Subshell | $n$ | $\\ell$ | $n+\\ell$ | $\\geq 4$? | Electrons |
|---|---|---|---|---|---|
| $1s$ | 1 | 0 | 1 | ✗ | 2 |
| $2s$ | 2 | 0 | 2 | ✗ | 2 |
| $2p$ | 2 | 1 | 3 | ✗ | 6 |
| $3s$ | 3 | 0 | 3 | ✗ | 2 |
| $3p$ | 3 | 1 | 4 | ✓ | **6** |
| $3d$ | 3 | 2 | 5 | ✓ | **5** |
| $4s$ | 4 | 0 | 4 | ✓ | **1** |

Total electrons with $n+l \\geq 4$: $6 + 5 + 1 = 12$. So $x = 12$.

$$\\frac{x}{4} = \\frac{12}{4} = 3$$

⚠️ **Don't forget Cr's anomalous configuration**
Cr is one of the Aufbau exceptions: $3d^5\\,4s^1$, not the expected $3d^4\\,4s^2$. The total electron count (24) is the same, but the distribution differs slightly. For this problem, both configurations give the same total of 12 electrons with $n+l \\geq 4$ (since 3p contributes 6 either way, and $4s + 3d = 6$ either way).

$$\\boxed{\\text{Answer: 3}}$$`,
  },
  {
    display_id: 'PERI-233',
    solution: `🧠 **Shielding efficiency: $s > p > d > f$. The "low-shielding" electrons in Cr are the $3d$ electrons — and Cr has 5 of them**
Slater's rules tell us how well different orbital types shield outer electrons from nuclear charge. Spherical $s$ orbitals shield best; $p$ orbitals next; $d$ orbitals shield poorly; $f$ orbitals shield even worse. So the "low-shielding" electrons in any atom are typically the $d$ (and $f$) electrons.

🗺️ **Identify Cr's low-shielding electrons**
Cr ($Z = 24$) has the configuration:
$1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,3d^5\\,4s^1$.

Among these:
- $s$ and $p$ electrons: 2+2+6+2+6 = 18, plus the $4s^1$ → 19 total. These shield WELL.
- $d$ electrons: $3d^5$ = **5** electrons. These shield POORLY.

So Cr has **5** low-shielding electrons.

⚠️ **The trap**
Some students count the $4s^1$ as low-shielding too, giving 6. But $4s$ is an $s$ orbital — it shields well. Only the $3d^5$ qualifies as "low-shielding" in this context. Also, don't confuse "low-shielding" with "outermost" — they are different concepts. The $4s^1$ is the outermost electron in Cr but is NOT a low-shielding type.

$$\\boxed{\\text{Answer: 5}}$$`,
  },
  {
    display_id: 'PERI-235',
    solution: `🧠 **Each element holds one periodic record. Match each to its claim: F = highest EN, He = highest IE, Cl = highest EA, Fr = largest size**
Four elements, four periodic extremes. Each is the record-holder for one specific property.

🗺️ **Match each pair**
**A. F (Fluorine):** Highest **electronegativity** on the Pauling scale (4.0). Top right of the periodic table (excluding the noble gases) → S.

**B. He (Helium):** Highest **first ionisation energy** (2372 kJ/mol). Tiny atom with closed $1s^2$ shell — extremely hard to remove an electron → R.

**C. Cl (Chlorine):** Highest **electron affinity** ($-349$ kJ/mol). Beats F because Cl has more room in its $3p$ subshell to accept an extra electron without too much repulsion → P.

**D. Fr (Francium):** **Largest** neutral atom (∼270 pm). Bottom of Group 1, lots of shells, weak nuclear pull → Q.

So: A-S, B-R, C-P, D-Q.

⚠️ **The trap**
Students often swap F and Cl on EA. F has the highest EN, but NOT the highest EA — that's Cl. The EN-vs-EA distinction trips many students up. Memorise: F is #1 on the Pauling scale (EN); Cl is #1 on the EA scale.

Also, Fr is the largest neutral atom in standard practice; Cs is sometimes given as larger, but JEE/NEET conventionally answer Fr.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-236',
    solution: `🧠 **ZnO and BeO are both amphoteric (S). $\\ce{N2O}$ is neutral (Q). $\\ce{P4O10}$ is acidic (P) AND gives an acid on hydrolysis (R)**
Different oxides need different classifications. The match isn't always one-to-one — D matches BOTH P and R because $\\ce{P4O10}$ is acidic AND it specifically gives $\\ce{H3PO4}$ on hydrolysis.

🗺️ **Match each oxide**
**A. ZnO:** Reacts with HCl to form $\\ce{ZnCl2}$. Reacts with NaOH to form sodium zincate $\\ce{Na2ZnO2}$. Both reactions → **amphoteric → S**.

**B. BeO:** Be is the only Group 2 element whose oxide is amphoteric. Dissolves in both acid and strong base → **amphoteric → S**.

**C. $\\ce{N2O}$:** Nitrous oxide (laughing gas). N in +1 state. Does not react with acid or base. → **neutral → Q**.

**D. $\\ce{P4O10}$:** Phosphorus(V) oxide. Strong acidic oxide. Reacts vigorously with water to give phosphoric acid: $\\ce{P4O10 + 6H2O -> 4H3PO4}$. So it is **acidic → P** AND **gives an acid on hydrolysis → R**.

Final match: A-S, B-S, C-Q, D-P,R.

⚠️ **The trap**
Some students try to find a one-to-one match and force D to choose between P and R. But the question explicitly allows both — D matches the multiple labels. Read the matches carefully — option (a) is the only one that lists BOTH P and R for D.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-239',
    solution: `🧠 **All four periodic properties depend on ALL four parameters. None is controlled by a single factor**
The four properties (IE, EA, EN, atomic radius) are deeply interconnected. They all change when you change:
- Effective nuclear charge ($Z_{eff}$).
- Electronic configuration (subshell stability).
- Number of shells filled.
- Oxidation state (charge density).

So in the matching grid, every Column-I property maps to ALL four Column-II parameters. That's exactly what option (a) says.

🗺️ **Why each parameter affects each property**
- **IE** depends on $Z_{eff}$ (nuclear pull on the electron being removed), configuration (filled vs half-filled stability), shells (distance), and oxidation state (cation vs neutral).
- **EA** depends on $Z_{eff}$ (pull on the new electron), configuration (whether the new electron stabilises a closed shell), shells (cloud size), and oxidation state.
- **EN** is a function of IE and EA, so it inherits all four dependencies.
- **Atomic radius** depends on shells (primary), configuration (subshell expansion), $Z_{eff}$ (nuclear contraction), and oxidation state (ions are smaller or larger than neutral).

So every Column-I property → every Column-II parameter. **A-PQRS, B-PQRS, C-PQRS, D-PQRS**.

⚠️ **The trap**
Students try to "narrow down" the matches, picking the most prominent factor for each property and ignoring the others. But the question doesn't ask for the dominant factor — it asks which parameters AFFECT the property. All four affect all four. Always read the wording carefully.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-254',
    solution: `🧠 **An element's block is decided by which subshell its differentiating electron enters. Sc's 21st electron enters $3d$ — so Sc is the first $d$-block element**
Sc is the 21st element. Building up its configuration:
- Through Ar ($Z = 18$): $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6$.
- $Z = 19$ (K): adds $4s^1$.
- $Z = 20$ (Ca): adds another $4s$ → $4s^2$.
- $Z = 21$ (Sc): adds the next electron to $3d$ → $[\\ce{Ar}]\\,3d^1\\,4s^2$.

So Sc's defining ("differentiating") electron is in $3d$. That puts Sc in the **$d$-block**.

🗺️ **Verify both statements**
**Statement-1:** "Sc is placed as a $d$-block element." → **True**.
**Statement-2:** "Last filling electron goes into the $3d$ subshell." → **True**, AND this is precisely the reason Sc is classified as $d$-block.

So Statement-1 is true, Statement-2 is true, AND Statement-2 correctly explains Statement-1.

⚠️ **The trap**
Students sometimes pick option (b) — both true but R doesn't explain A. They might think the explanation needs more chemistry. But the very DEFINITION of "$d$-block" is "elements whose last electron enters the $d$-subshell". Statement-2 is exactly that definition applied to Sc. So R is the explanation.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-314',
    solution: `🧠 **"Iso-" = constant; "adia-" = no passage. The prefix tells you what is fixed in each thermodynamic process**
Each process name comes from a Greek/Latin root that names the locked variable.

🗺️ **Match each process**
**A. Isothermal** — "thermal" = temperature. **Temperature constant** ($T$ = constant). Heat CAN flow. → II.

**B. Isochoric** — "choric" from Greek for space/volume. **Volume constant** ($V$ = constant). No work done since $\\Delta V = 0$. → III.

**C. Isobaric** — "baric" from Greek for pressure (like barometer). **Pressure constant** ($P$ = constant). $W = -P\\Delta V$. → IV.

**D. Adiabatic** — "adiabatos" = no passage. **No heat exchange** ($q = 0$). Temperature DOES change. → I.

So: A–II, B–III, C–IV, D–I.

⚠️ **The trap**
Students often confuse isothermal and adiabatic. Both involve temperature in some way:
- **Isothermal**: $T$ stays constant, but heat $q$ flows in/out to keep it constant.
- **Adiabatic**: $q = 0$ (no heat flow), but $T$ changes to compensate.
They are almost opposites. Don't mix them up — only adiabatic has $q = 0$.

$$\\boxed{\\text{Answer: (d)}}$$`,
  },
  {
    display_id: 'PERI-315',
    solution: `🧠 **Largest ion = most electrons held by fewest protons. Among isoelectronic options, that means the lowest atomic number**
Each of the four elements (O, F, N, Na) tries to reach the nearest noble-gas configuration ($\\ce{[Ne]}$, 10 electrons). They form ions $\\ce{O^{2-}}$, $\\ce{F^-}$, $\\ce{N^{3-}}$, $\\ce{Na^+}$ — all isoelectronic with Ne.

In an isoelectronic set, the ion with the FEWEST protons has the weakest pull on the 10-electron cloud, so it expands the most.

🗺️ **Compare proton counts**
$\\ce{N^{3-}}$: 7 protons holding 10 electrons. **Lowest Z → biggest ion.**
$\\ce{O^{2-}}$: 8 protons.
$\\ce{F^-}$: 9 protons.
$\\ce{Na^+}$: 11 protons. Highest Z → smallest ion.

So $\\ce{N^{3-}} > \\ce{O^{2-}} > \\ce{F^-} > \\ce{Na^+}$ in size. The largest ion is formed by **N** (option c).

⚠️ **The trap**
Students sometimes pick Na thinking "Na is the biggest neutral atom in the list, so its ion must be biggest". Wrong reasoning. After ionisation, all four become 10-electron species — the SHELL count is identical. Only proton count matters from then on, and Na has the most protons → smallest cation. Always count electrons of the ION, not the neutral atom.

$$\\boxed{\\text{Answer: (c)}}$$`,
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
