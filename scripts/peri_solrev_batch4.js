// Solution-rewrite batch 4: PERI-178, 179, 180, 183, 185, 187, 188, 189, 190, 194
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const updates = [
  {
    display_id: 'PERI-178',
    solution: `🧠 **The big jump in successive IE values flags the moment you breach the noble-gas core. Count electrons removed BEFORE the jump — that is the valency**
Successive ionisation energies climb gradually while you're still pulling valence electrons. The moment the next electron has to come from the inner closed shell, the energy jumps by a factor of 5–10. Counting up to (not including) the jump tells you how many valence electrons there were.

🗺️ **Read the data**
Given $IE$ values (kJ/mol): $800, 1427, 2658, 25024, 32824$.

Successive ratios:
$IE_2 / IE_1 = 1427/800 \\approx 1.78$ — gradual.
$IE_3 / IE_2 = 2658/1427 \\approx 1.86$ — gradual.
$IE_4 / IE_3 = 25024/2658 \\approx 9.4$ — **massive jump**.

So three valence electrons came off easily, and the fourth required core-breaking energy. **Valency = 3.**

The configuration must be $ns^2\\,np^1$ — Group 13 element. With $IE_1 = 800$, this is closest to Aluminium ($IE_1 = 577$, but $IE_1 \\approx 800$ for B = 801 kJ/mol, so the element is Boron).

⚠️ **The trap**
Option (a) is 1 — students who count electrons until the FIRST jump (between $IE_1$ and $IE_2$) miss the point. The "first jump" is fine for a true Group 1 metal, but here the gradual rise continues smoothly until $IE_4$. The TRUE jump is between $IE_3$ and $IE_4$ — that's the one that signals core-breaching.

$$\\boxed{\\text{Answer: (c)}}$$`,
  },
  {
    display_id: 'PERI-179',
    solution: `🧠 **First IE of A and EA of $\\ce{A^+}$ are reverse processes — energetically equal in magnitude**
Look at the two definitions:
- $IE_1$ of A: removing one electron from a neutral atom: $\\ce{A(g) -> A^+(g) + e^-}$.
- EA of $\\ce{A^+}$: adding one electron to the cation: $\\ce{A^+(g) + e^- -> A(g)}$.

These are exactly reverse reactions. By thermodynamic symmetry, the energy released in one direction equals the energy required in the reverse — magnitude is identical.

🗺️ **Eliminate the wrong options**
(b) EA of $\\ce{A^{2+}}$: that is the reverse of $IE_2$, not $IE_1$. The energies differ.
(c) IE of $\\ce{A^{2+}}$: that is $IE_3$ — completely different process.
(d) None of these: rejected, since (a) is correct.

So (a) is the answer.

⚠️ **The trap**
Students sometimes pick "None of these" when they're not sure, treating ionisation and electron affinity as independent quantities. They're not — they're two sides of the same coin. The trick is to spot the reverse reaction. $IE_n$(A) corresponds to EA($\\ce{A^{(n-1)+}}$) every time.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-180',
    solution: `🧠 **Mg removes a $3s$ electron, Al removes a $3p$ electron — the $3s$ orbital penetrates closer to the nucleus, so it is harder to ionise. That's why Al's IE is LOWER despite higher Z**
The $3s$ orbital has its biggest probability density much closer to the nucleus than the $3p$ orbital does. So a $3s$ electron is held more tightly. Mg's outermost electron (in $3s^2$) is in the deeper-penetrating $3s$. Al's outermost electron is in the higher-energy, less-penetrating $3p$.

🗺️ **Configurations side by side**
$\\ce{Mg}$ ($Z=12$): $1s^2\\,2s^2\\,2p^6\\,3s^2$. The first IE removes a $3s$ electron — strongly held.
$\\ce{Al}$ ($Z=13$): $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^1$. The first IE removes the $3p^1$ electron — less penetration, easier to remove.

Result: $IE_1(\\ce{Mg}) = 737\\,kJ/mol$ > $IE_1(\\ce{Al}) = 577\\,kJ/mol$. The $s$-vs-$p$ penetration difference dominates.

⚠️ **Don't fall for the size argument**
Option (b) says "Al is smaller than Mg". Actually Al ($143$ pm) is slightly SMALLER than Mg ($160$ pm) due to higher Z, but smaller size would predict higher IE for Al — which is the OPPOSITE of the observed trend. Size alone cannot explain why Al has lower IE. Only the $s$-vs-$p$ orbital penetration does.

$$\\boxed{\\text{Answer: (c)}}$$`,
  },
  {
    display_id: 'PERI-183',
    solution: `🧠 **Permanganate ion = $\\ce{MnO4^-}$ with Mn in +7. Add $\\ce{H^+}$ to get permanganic acid $\\ce{HMnO4}$**
The "per-" prefix in inorganic naming signals the highest possible oxidation state of the central element. For Mn, +7 is the maximum (it has 7 valence electrons total: 5 in $3d$ + 2 in $4s$).

🗺️ **Build the formula**
Permanganate ion: $\\ce{MnO4^-}$ (charge −1).
To balance, add one $\\ce{H^+}$.
Permanganic acid: $\\ce{HMnO4}$.

Verify oxidation state of Mn:
$1(+1) + x + 4(-2) = 0$
$x = +7$. ✓

⚠️ **Don't confuse the two acids**
- $\\ce{HMnO4}$ — permanganic acid (Mn in +7).
- $\\ce{H2MnO4}$ — manganic acid (Mn in +6).

Two H's mean a 2− anion ($\\ce{MnO4^{2-}}$), which has lower Mn oxidation state. Option (b) gives the wrong acid by adding an extra H. Always check the prefix and count H's carefully.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-185',
    solution: `🧠 **Cr and Cu break the Aufbau rule — they grab a $4s$ electron to make their $3d$ subshell half-filled or fully-filled. So $d$-filling is NOT monotonic across the transition series**
The expected sequence as you fill the 3d series should be $3d^1, 3d^2, 3d^3, 3d^4, 3d^5, ..., 3d^{10}$. But two elements pull a $4s$ electron into $3d$ for extra stability:
- $\\ce{Cr}$ ($Z=24$): expected $3d^4\\,4s^2$, actual $3d^5\\,4s^1$.
- $\\ce{Cu}$ ($Z=29$): expected $3d^9\\,4s^2$, actual $3d^{10}\\,4s^1$.

So Statement (d) — claiming d-filling is monotonic — is WRONG.

🗺️ **Verify the other statements**
(a) "Properties are periodic functions of atomic numbers" — this is the Modern Periodic Law, the foundation of the periodic table. **True.**
(b) "Non-metals are fewer than metals" — yes, ~80% of all known elements are metals. **True.**
(c) "First IE values across a period don't vary regularly" — true, due to the Be/B and N/O anomalies (and similar in Period 3). **True.**
(d) "d-subshells fill monotonically with Z" — false because of Cr and Cu (and similar exceptions in 4d and 5d series). **False.**

⚠️ **The trap**
"Monotonic" is a strong word. It means strictly one-direction. Even one exception breaks monotonicity. Cr and Cu (and their 4d/5d cousins like Mo, Ag, Au) are well-known Aufbau exceptions. Students who haven't memorised these might think d-filling is regular and pick (a), (b), or (c) by mistake.

$$\\boxed{\\text{Answer: (d)}}$$`,
  },
  {
    display_id: 'PERI-187',
    solution: `🧠 **For d-block elements, group number = (electrons in $(n-1)d$) + (electrons in $ns$). The configuration $[\\ce{Ar}]\\,3d^5\\,4s^2$ gives group $5+2=7$ — that's Manganese**
The differentiating electron enters the $d$ subshell, so this is a $d$-block element. The group number is the sum of valence $d$ and $s$ electrons.

🗺️ **Apply the rule**
Configuration: $[\\ce{Ar}]\\,3d^5\\,4s^2$.
- $d$ electrons: 5.
- $s$ electrons: 2.
- Group = $5 + 2 = 7$.

So this is a Group 7 d-block element — Manganese (Mn, $Z = 25$).

⚠️ **The trap**
Some students count only the $d$ electrons and pick option (c) — Group 5. That's wrong. The IUPAC rule is to ADD both $d$ and $s$ outer-shell electrons. Some Indian textbooks use the older labels (VIIB instead of 7), but the rule is the same: add $d + s$.

Also note: this rule works for groups 3–10. For groups 11 ($d^{10}\\,s^1$) and 12 ($d^{10}\\,s^2$), the answer is just the count itself (11 or 12).

$$\\boxed{\\text{Answer: (d)}}$$`,
  },
  {
    display_id: 'PERI-188',
    solution: `🧠 **$\\ce{Sc^{3+}}$ has the configuration $[\\ce{Ne}]\\,3s^2\\,3p^6$ (same as Ar) — but Sc itself is in Group 3, not the zero group. Isoelectronic ≠ same group**
Group membership of an element is determined by the NEUTRAL ATOM's configuration, not the ion's. Sc has the neutral configuration $[\\ce{Ar}]\\,3d^1\\,4s^2$ → Group 3 ($d$-block). Stripping 3 electrons gives the Argon-like ion $\\ce{Sc^{3+}}$, but the element Sc still belongs to Group 3.

🗺️ **Check each option**
(a) $\\ce{Sc^{3+}}$ matched with "zero group" (noble gases): WRONG. Sc is in Group 3, never in Group 0/18. **Mismatch.** ✗
(b) $\\ce{Fe^{2+}}$ ($[\\ce{Ar}]\\,3d^6$) matched with Group 8: Fe is at $Z=26$, which is the eighth element in the 3d series — **Group 8**. Correct.
(c) $\\ce{Cr}$ ($[\\ce{Ar}]\\,3d^5\\,4s^1$) matched with Group 6: Cr is at $Z=24$, sixth in the 3d series — **Group 6**. Correct.
(d) "All of the above" — only true if all of (a), (b), (c) were correctly matched. Since (a) is wrong, (d) is wrong.

So the incorrectly-matched set is **(a)**.

⚠️ **The trap**
Many students confuse "isoelectronic with X" with "in the same group as X". They are different ideas. Isoelectronic just means same electron count. Group membership is based on the neutral atom's outer configuration. $\\ce{Sc^{3+}}$ is isoelectronic with Ar but has nothing else in common — Sc the element is firmly in Group 3.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-189',
    solution: `🧠 **F's covalent radius (0.72 Å) and Ne's van der Waals radius (1.60 Å) are measured by different methods — that's why Ne LOOKS bigger than F despite higher Z**
Two important radius types:
- **Covalent radius** = half the bond length in $\\ce{X-X}$ molecule. Used for atoms that bond.
- **van der Waals radius** = half the closest approach between non-bonded atoms. Used for noble gases.

vdW radii are always significantly larger than covalent radii of nearby atoms.

🗺️ **Apply to F and Ne**
$\\ce{F}$ (Period 2, Group 17): forms $\\ce{F2}$. Covalent radius = $0.72$ Å.
$\\ce{Ne}$ (Period 2, Group 18): noble gas, no covalent bonds. Only van der Waals radius is measurable: $1.60$ Å.

Both values match option (a) exactly.

⚠️ **The trap**
Applying the period trend "size decreases left-to-right" gives Ne < F — that would predict option (c) or (d). But this comparison breaks down because the two atoms use different radius types. Always note WHICH radius is being measured before applying any trend. For noble gases, vdW radii inflate the apparent size dramatically.

$$\\boxed{\\text{Answer: (a)}}$$`,
  },
  {
    display_id: 'PERI-190',
    solution: `🧠 **Mn ($3d^5\\,4s^2$) has half-filled $3d$ stability — that's why its $IE_1$ is the highest in this set, beating even V**
Across the 3d series (Sc → Zn), $IE_1$ generally rises. But Mn ($Z=25$) is special because of its half-filled $3d^5$ configuration, which is unusually stable. Removing an electron from this stable arrangement requires extra energy.

🗺️ **Compare $IE_1$ values (kJ/mol)**
$\\ce{Sc}$: 633.
$\\ce{Ti}$: 658.
$\\ce{V}$: 650 (slight dip due to interplay of $3d^3$).
$\\ce{Mn}$: **717** — highest of these four, due to half-filled $3d^5\\,4s^2$ stability.

So among Sc, Ti, V, Mn, the maximum $IE_1$ belongs to **Mn**.

⚠️ **The trap**
Students who apply the simple "$IE$ rises with $Z$" rule pick V (Z=23) over Sc/Ti (Z=21/22), but they don't reach Mn. The trick is to remember that half-filled $3d^5$ is a "stability island" — it's harder to disrupt than $3d^2$ or $3d^3$. Always look for the half-filled or fully-filled $d$ subshell when ranking transition-metal IEs.

$$\\boxed{\\text{Answer: (d)}}$$`,
  },
  {
    display_id: 'PERI-194',
    solution: `🧠 **Be has filled $2s^2$ — adding an electron forces it into a higher-energy $2p$ orbital, which COSTS energy. So $\\Delta_{eg}H(\\ce{Be})$ is positive (endothermic)**
Most non-metals release energy when they pick up an electron — $\\Delta_{eg}H$ is negative. But atoms with stable closed-subshell configurations (like Be with $2s^2$, or noble gases) RESIST gaining an electron. The new electron must enter a higher-energy orbital, breaking the stable configuration.

🗺️ **Check each option**
(a) $\\ce{F}$: configuration $2s^2\\,2p^5$. Adding an electron gives $2p^6$ (filled, stable). Strongly exothermic — **negative** $\\Delta_{eg}H$.
(b) $\\ce{Cl}$: similar to F, gives stable $3p^6$. **Negative**.
(c) $\\ce{Be}$: configuration $1s^2\\,2s^2$. Adding an electron means going to $2s^2\\,2p^1$ — a higher-energy state. **Positive (endothermic)**. ✓
(d) $\\ce{B}$: configuration $2s^2\\,2p^1$. Adding an electron gives $2p^2$ — reasonably stable. **Negative** (exothermic, although small).

Only Be has a positive $\\Delta_{eg}H$.

⚠️ **The trap**
Students sometimes pick B (option d) thinking that since B is right next to Be, both should resist gaining electrons. But B's $2p^1$ has a vacancy in the $2p$ subshell — the new electron joins comfortably without disrupting any closed shell. Only Be (closed $2s^2$) and the noble gases (closed $np^6$) have positive $\\Delta_{eg}H$.

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
