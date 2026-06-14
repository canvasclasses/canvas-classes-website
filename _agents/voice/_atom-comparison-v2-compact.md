# v2 COMPACT format — current DB solution vs shortened voice rewrite (5 ATOM questions)

> Founder decision doc, 2026-06-12 (supersedes the long v1 rewrites in `_atom-comparison-5q.md`).
> Format changes per founder feedback: **no iconified section headlines** (template smell);
> flowing solution; only two plain inline labels — **Shortcut:** and **Watch out:** — plus
> the boxed answer. Openings capped at 1–2 sentences; elaborate framing is OFFLOADED TO
> FOUNDER AUDIO (flagged per question below; the flag is for the worklist, NOT student-visible).

---

# 1 · ATOM-024 — orbitals with n=4, mₗ=0 (NVT, ans 4)

## [CURRENT — in DB] (~190 words + 4 icon headings)

🧠 **The Zero-Point Count** … 🗺️ **Scanning the Subshells** … ⚡ **The One-per-Subshell Rule** … ⚠️ **Common Traps** …
*(full text in `_atom-comparison-5q.md` — omitted here to keep this doc readable)*

## [v2 COMPACT — teacher voice] (~95 words, no headings)

You know that for $n = 4$ there are four subshells — $4s$, $4p$, $4d$, $4f$ — and every subshell has exactly one orbital with $m_l = 0$. So the count is just the number of subshells:

$1 + 1 + 1 + 1 = 4$ orbitals.

**Shortcut:** the answer to "how many orbitals with $m_l = 0$" is always $n$ itself — shell $n$ has $n$ subshells, one zero-box each. For $n=4$, write 4 and move on.

**Watch out:** orbitals, not electrons. If the question asked *electrons* with $m_l = 0$, double it — 8. Half the marks in this family are lost to that one word.

$\boxed{\text{Answer: 4}}$

**🎙 audio?** No — the text carries it fully.

---

# 2 · ATOM-079 — work function → max wavelength (NVT, ans 300)

## [CURRENT — in DB] (~110 words, numbered steps + 4 icon headings)

🧠 **The Threshold Limit** … 🗺️ **The Inversion Math** (Step 1/2/3) … ⚡ **The 6.63 Cancellation** … ⚠️ …

## [v2 COMPACT — teacher voice] (~105 words, no headings)

Maximum wavelength means minimum energy — the photon pays exactly the work function, nothing extra. So $\frac{hc}{\lambda_{max}} = W_0$.

$\lambda_{max} = \frac{6.63\times10^{-34} \times 3\times10^8}{6.63\times10^{-19}}$ — the $6.63$'s cancel, only powers of ten remain:

$\lambda_{max} = 3\times10^{-7}\,\text{m} = 300\,\text{nm}$

**Shortcut:** for eV questions, remember one value — $hc = 1240$ eV·nm. Here $W_0 = 4.14$ eV, so $1240/4.14 \approx 300$ nm. One constant covers the whole chapter.

**Watch out:** the metre → nanometre step. $3\times10^{-7}$ m is 300 nm — not 30, not 3000.

$\boxed{\text{Answer: 300}}$

**🎙 audio?** No.

---

# 3 · ATOM-233 — Bohr ratios match-the-column (MTC, ans c)

## [CURRENT — in DB] (~210 words + 4 icon headings; part-C reasoning uses the WRONG concept — radial nodes instead of l=0 angular momentum)

🧠 **The Virial & Bohr Proportions** … 🗺️ **Column-I Verfication** … ⚡ **The -2 Ratio** … ⚠️ **Z vs n** …

## [v2 COMPACT — teacher voice] (~150 words, no headings, fixes part C)

One chant settles most of this table: in any Bohr orbit, $KE : TE : PE = 1 : -1 : -2$.

**A.** $V_n/K_n = -2$ → r. **B.** $r \propto n^2$ and $E \propto 1/n^2$, so $r \propto E^{-1}$, $x=-1$ → q. **D.** $r_n = a_0 n^2/Z$, so $1/r_n \propto Z^1$ → s.

**C** needs care: the lowest orbit is $1s$, $l = 0$, so orbital angular momentum $\sqrt{l(l+1)}\frac{h}{2\pi} = 0$ → p. Strictly, Bohr's own postulate gives $h/2\pi$ — but with $0$ in the options and $h/2\pi$ absent, the examiner wants the quantum-mechanical value. Know both versions.

Set: A-r, B-q, C-p, D-s.

**Shortcut:** memorise $1:-1:-2$ — any energy ratio the examiner builds is read straight off it, zero derivation.

**Watch out:** asked PE, answered TE — PE is double the total in magnitude. And in C, don't argue "Bohr says $nh/2\pi$, can't be zero" — read the options to decode what's being asked.

$\boxed{\text{Answer: (c)}}$

**🎙 audio? YES — recommended.** The Bohr-vs-QM angular momentum subtlety (why the same question has two "correct" answers depending on the model) is exactly the kind of framing that reads long but speaks in 40 seconds.

---

# 4 · ATOM-021 — photoelectric assertion-reason (AR, ans b)

## [CURRENT — in DB] (~230 words + 4 icon headings; hedgy: "While technically energy transfer *attempts* happen…")

🧠 **Timing vs. Energy Threshold** … 🗺️ **The Einstein Audit** … ⚡ **The "Any" Red Flag** … ⚠️ …

## [v2 COMPACT — teacher voice] (~130 words, no headings)

Check A and R separately — this one is decided by the word "any".

A is correct: photoelectric emission is practically instantaneous (delay under $10^{-9}$ s) once the frequency crosses threshold. R is wrong: the electron needs the full work function from a *single* photon. Below threshold there is no transfer-and-ejection — the electron cannot collect small amounts from several weak photons and save up. "Photon of *any* energy" sinks R.

**Shortcut:** in assertion-reason, circle the absolute words first — *any, always, all, every*. One absolute word usually decides the whole question. R died on "any".

**Watch out:** "sir, kuch to energy milti hi hogi?" — no. The photon works as one full packet or not at all; even higher intensity (more weak photons) ejects nothing below threshold.

$\boxed{\text{Answer: (b)}}$

**🎙 audio? YES — recommended.** The one-photon-full-payment idea (your shopkeeper analogy from the crash course) is the elaborate framing we cut from the text — 30 seconds of you telling it lands better than a paragraph.

---

# 5 · ATOM-016 — de Broglie wavelength, 4th orbit (NVT, ans 8)

## [CURRENT — in DB] (~160 words + 4 icon headings)

🧠 **Bohr meets de Broglie** … 🗺️ **The Orbital Radius Bridge** (numbered) … ⚡ **The "n squared" Secret** … ⚠️ …

## [v2 COMPACT — teacher voice] (~95 words, no headings)

The $n^{th}$ orbit holds exactly $n$ full waves: $2\pi r_n = n\lambda$, and you know $r_n = n^2 a_0$.

For $n = 4$: $r_4 = 16a_0$, so $\lambda = \frac{2\pi \times 16a_0}{4} = 8\pi a_0$. The blank asks the number in front of $\pi a_0$: 8.

**Shortcut:** combine once, keep forever — $\lambda = \frac{2\pi r_n}{n} = 2n\,\pi a_0$. Wavelength grows as $n$, not $n^2$; one $n$ cancels. For any orbit, just double the $n$.

**Watch out:** the $n^2$-vs-$n$ slip, both ways — forgetting $n^2$ in the radius (landing on $2\pi a_0$), or assuming $\lambda$ jumps as $n^2$.

$\boxed{\text{Answer: 8}}$

**🎙 audio?** No.

---

## Format v2 spec (to codify in workflows + validator on founder approval)

1. **No section headlines, no icons.** Solution flows as prose.
2. Opening: **1–2 sentences max** naming the move/anchor. If the framing genuinely needs more → cut it and flag the question for founder AUDIO (worklist, not in student text).
3. Body: compact working; skip routine arithmetic; one units/detail alarm only where it bites.
4. `**Shortcut:**` inline label — only when a genuine option-independent shortcut exists (the old ⚡ bar still applies).
5. `**Watch out:**` inline label — 1–2 lines, the ONE trap, voiced as the student's reflex where natural.
6. End with `$\boxed{...}$`. Difficulty-verdict line optional and short ("An easy one once you see the link.") — use sparingly, not on every question.
7. All §🚫 Never-Break-Character rules unchanged. Voice = moves, not tics; max one Hinglish touch.
8. Target length: trivial 60–100 words · medium 100–160 · hard whatever the chemistry needs after the audio offload.
