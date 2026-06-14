# Side-by-side: current DB solution vs voice rewrite — 5 ATOM questions

> Founder decision doc, 2026-06-12. Nothing applied to the DB yet.
> Each question: **[CURRENT — in DB]** then **[REWRITE — teacher voice]**.
> Voice rules: `teacher-voice-profile.md` §2 + `ATOM-exemplars.md`.

---

# 1 · ATOM-024 (NVT, ans 4) — orbitals with n=4, mₗ=0
*Coverage note: this is the twin of your DPP-3 question — the rewrite reuses your dabba-counting + "answer = n" + electrons-vs-orbitals moves.*

## [CURRENT — in DB]

🧠 **The Zero-Point Count**
The magnetic quantum number $m_l=0$ represents the "central" orbital of any subshell. We need to find how many such $0$-values exist within all the subshells allowed for $n=4$.

🗺️ **Scanning the Subshells**
For $n=4$, we have:
- $l=0$ (4s): Contains $m_l=0$ (1 orbital).
- $l=1$ (4p): Contains $m_l=-1, 0, +1$. (1 orbital has $m_l=0$).
- $l=2$ (4d): Contains $m_l=-2, -1, 0, +1, +2$. (1 orbital has $m_l=0$).
- $l=3$ (4f): Contains $m_l=-3 \dots 0 \dots +3$. (1 orbital has $m_l=0$).
Total count = $1+1+1+1 = 4$ orbitals.

⚡ **The One-per-Subshell Rule**
Every single subshell ($s, p, d, f...$) has exactly **one** orbital where $m_l=0$. Since shell $n$ has $n$ subshells, the total number of orbitals with $m_l=0$ will always be equal to the principal quantum number $n$. For $n=4$, the answer is just $4$.

⚠️ **Common Traps**
Wait—did the question ask for electrons or orbitals? If it said electrons, you'd need to multiply by 2 (giving 8). Since it asks for "orbitals," we stay at 4. Reading the "unit" of the question is half the battle.

$\boxed{\text{Answer: 4}}$

## [REWRITE — teacher voice]

**🧠 Count the Boxes, Not the Formulas**

A 30-second question — don't let the quantum-number dress scare you. You know that for $n = 4$ there are four subshells: $4s$, $4p$, $4d$, $4f$. Each subshell is a row of boxes (orbitals), and in every row exactly one box carries $m_l = 0$. So the whole question is: how many rows are there?

**🗺️ Working It Out**

Go subshell by subshell and pick the $m_l = 0$ box from each:

- $4s$ ($l=0$): only one box — it is the $m_l = 0$ box. Count 1.
- $4p$ ($l=1$): boxes $-1, 0, +1$ — one of the three qualifies. Count 1.
- $4d$ ($l=2$): boxes $-2$ to $+2$ — again exactly one zero. Count 1.
- $4f$ ($l=3$): boxes $-3$ to $+3$ — one zero. Count 1.

Total $= 1+1+1+1 = 4$ orbitals.

**⚡ The Smart Move**

Every subshell — $s, p, d, f$, any of them — has exactly one $m_l = 0$ box, and shell $n$ has $n$ subshells. So the answer to "how many orbitals with $m_l = 0$" is always just $n$ itself. For $n = 4$, write 4 and move on. No counting needed once you see this.

**⚠️ Where Students Get Stuck**

Read what is being counted. You will want to say — sir, electrons or orbitals? If the question asked *electrons* with $m_l = 0$, you would double it (two spins per box) and get 8. It asks orbitals, so the answer stays 4. Half the marks in this family of questions are lost to that one word.

An easy question — pure counting, no calculation at all.

$\boxed{\text{Answer: 4}}$

---

# 2 · ATOM-079 (NVT, ans 300) — work function → max wavelength

## [CURRENT — in DB]

🧠 **The Threshold Limit**
Longest wavelength = Minimum Energy. This is the transition point for the Photoelectric effect.

🗺️ **The Inversion Math**
1. **Equation**: $\lambda = \frac{hc}{W_0}$.
2. **Substitution**: $\lambda = \frac{(6.63 \times 10^{-34}) \cdot (3 \times 10^8)}{6.63 \times 10^{-19}}$.
3. **Result**: $3 \times 10^{-7} \text{ m} = \mathbf{300 \text{ nm}}$.

⚡ **The 6.63 Cancellation**
Notice that $6.63$ in $h$ and $6.63$ in $W_0$ cancel perfectly. The problem is just about powers of ten.

⚠️ **Common Traps**
Don't miscount the zeros when converting from meters to nanometers.

$\boxed{\text{Answer: 300}}$

## [REWRITE — teacher voice]

**🧠 Maximum Wavelength Means Minimum Energy**

This should take you 20 seconds once you see the link. The work function is how tightly the metal holds its electrons — the photon must pay at least that much. "Maximum wavelength" always translates to "minimum energy", because $E = hc/\lambda$ runs opposite ways. So the boundary case is: photon energy exactly equal to the work function.

**🗺️ Working It Out**

$\frac{hc}{\lambda_{max}} = W_0$, so $\lambda_{max} = \frac{hc}{W_0} = \frac{6.63\times10^{-34} \times 3\times10^8}{6.63\times10^{-19}}$

Look at the numbers before touching the calculator: $6.63$ cancels with $6.63$. What is left is pure powers of ten:

$\lambda_{max} = 3 \times 10^{-34+8+19} = 3\times10^{-7}\,\text{m} = 300\,\text{nm}$

**⚡ The Smart Move**

When the question gives energies in eV instead of joules, don't multiply $h \times c$ every time — remember one value: $hc = 1240$ eV·nm. Here $W_0 = 4.14$ eV, and $1240/4.14 \approx 300$ nm — same answer, no powers of ten at all. One constant, whole chapter covered.

**⚠️ Where Students Get Stuck**

The powers of ten in the metre → nanometre step. $3\times10^{-7}$ m is $300$ nm, not $30$ or $3000$ — count the shift to $10^{-9}$ carefully. And note the examiner was kind here: the matching $6.63$'s are a signal that the question wants thinking, not arithmetic.

An easy question — the whole game is reading "maximum wavelength" correctly.

$\boxed{\text{Answer: 300}}$

---

# 3 · ATOM-233 (MTC, ans c) — Bohr ratios match-the-column
*Coverage note: the rewrite also **fixes wrong reasoning** in part C — the current solution justifies "0" via radial nodes; the correct concept is orbital angular momentum $\sqrt{l(l+1)}\,h/2\pi$ with $l=0$.*

## [CURRENT — in DB]

🧠 **The Virial & Bohr Proportions**
This matrix test checks your understanding of energy ratios and quantum scaling laws. Each entry relates back to the fundamental Bohr equations.

🗺️ **Column-I Verfication**
- **A. $V_n / K_n$**: From the Virial Theorem for Coulombic potential, Potential Energy is always twice the negative of Kinetic Energy ($ V = -2K $). Thus, $ V/K = -2 $. **(Matches r)**.
- **B. Radius ($ r $) $\propto E^x$**: We know $ r \propto n^2 $ and $ E \propto 1/n^2 $. Therefore, $ r \propto 1/E \implies r \propto E^{-1} $. So $ x = -1 $. **(Matches q)**.
- **C. Lowest Orbit Nodes**: In the $ n=1 $ (lowest) orbit of a Hydrogen-like species:
  Radial nodes = $ n-l-1 = 1-0-1 = 0 $. **(Matches p)**.
- **D. $1/r_n \propto Z^y$**: $ r_n = a_0 n^2 / Z $. Therefore, $ 1/r = Z / (a_0 n^2) $. This makes $ 1/r \propto Z^1 $, so $ y = 1 $. **(Matches s)**.
Correct match set: **A-r, B-q, C-p, D-s**.

⚡ **The -2 Ratio**
A quick way to remember energy ratios: $ KE : Total : PE $ is $ 1 : -1 : -2 $.
If you memorize this string, you can solve any ratio question in the chapter instantly.

⚠️ **Z vs n**
Stay sharp on D! $r$ is inversely proportional to $Z$, so $1/r$ is directly proportional ($Z^{+1}$).

$\boxed{\text{Answer: (c)}}$

## [REWRITE — teacher voice]

**🧠 One Chant Settles Half This Table**

Forty seconds, if you remember one line: in any Bohr orbit, $KE : TE : PE = 1 : -1 : -2$. That single ratio answers A instantly, and B follows from the two scalings you already know — $r \propto n^2$ and $E \propto 1/n^2$. Only C needs real care; we will come to it.

**🗺️ Working It Out**

**A.** From the chant, $V_n/K_n = -2/1 = -2$ → matches **r**.

**B.** $r \propto n^2$ and $|E| \propto 1/n^2$, so $r \propto 1/E$, meaning $x = -1$ → matches **q**.

**C.** The lowest orbit is $1s$: $l = 0$, so orbital angular momentum $= \sqrt{l(l+1)}\,\frac{h}{2\pi} = 0$ → matches **p**. One honest note: the question says "according to Bohr's theory", but Bohr's own postulate gives $L = h/2\pi$ in the first orbit — not zero. Since $h/2\pi$ is nowhere in Column-II, the examiner clearly means the quantum-mechanical value. Match 0, but know the difference — both versions are asked in exams.

**D.** $r_n = \frac{a_0 n^2}{Z}$, so $\frac{1}{r_n} \propto Z^1$, $y = 1$ → matches **s**.

Set: A-r, B-q, C-p, D-s.

**⚡ The Smart Move**

Memorise the chant $KE : TE : PE = 1 : -1 : -2$ — it is the highest-leverage line in this chapter. Any ratio the examiner builds from these three energies ($V/K$, $E/V$, $K/E$...) is read straight off it, zero derivation.

**⚠️ Where Students Get Stuck**

Two places. First, the classic: the question asks potential energy and you reach for the total-energy value — remember PE is double the total in magnitude. Second, part C: you will want to say — sir, Bohr says $nh/2\pi$, so it can't be zero! Correct instinct, wrong battlefield: with 0 sitting in the options and $h/2\pi$ absent, the examiner wants the quantum-mechanical $\sqrt{l(l+1)}$ version. Read the options to decode what is being asked.

Not difficult — but C makes it a thinking question, not a recall question.

$\boxed{\text{Answer: (c)}}$

---

# 4 · ATOM-021 (AR, ans b) — photoelectric assertion-reason

## [CURRENT — in DB]

🧠 **Timing vs. Energy Threshold**
The photoelectric effect is iconic for two things: its lack of time delay and its frequency threshold. We need to check if the logic link between these two in the A&R format is scientifically sound.

🗺️ **The Einstein Audit**
- **Assertion A**: Photoelectric emission is indeed "instantaneous" (time delay $< 10^{-9} \text{ s}$) provided the frequency is above threshold. This highlights the particle nature of light. **Correct.**
- **Reason R**: The statement claims a photon of **any** energy transfers energy to the electron. While technically energy transfer *attempts* happen, the effective "ejection" or the systematic shift described in the context of the effect *requires* the energy to be greater than the work function ($\phi$). The phrase "any energy" is misleading and incorrect in the context of causing the effect described in A. **Incorrect.**

⚡ **The "Any" Red Flag**
In physics Assertion-Reasoning, words like "any," "always," or "all" are major red flags. Photoelectric work is strictly a "pay-wall" system. If you don't meet the threshold energy, the business of ejection never starts.

⚠️ **Common Traps**
Wait! Reasoning says "transfer of energy... takes place." In some books, this is considered true because collisions happen, but in JEE competitive context, this reason is marked incorrect because it ignores the threshold frequency requirement which is the backbone of the "beam strikes $\to$ ejects" logic in A.

$\boxed{\text{Answer: (b)}}$

## [REWRITE — teacher voice]

**🧠 Check A and R Separately — the Word "Any" Decides This One**

An assertion-reason question is really two true/false checks and then a link check — 40 seconds is enough. A is about timing: electrons come out *as soon as* light above the threshold frequency lands. R makes a much bigger claim — that a photon of *any* energy transfers its energy to the electron. Test each on its own merit.

**🗺️ Working It Out**

**Assertion A:** correct. Photoelectric emission has no waiting period — the delay is below $10^{-9}$ s. One photon hits, one electron leaves, immediately. This instant response is exactly what the wave theory could not explain and the photon picture could.

**Reason R:** here the metal is strict about payment. The electron needs the full price — the work function — from a *single* photon. A photon below threshold does not do the job at all; the electron cannot collect small amounts from several weak photons and save up. So "photon of *any* energy transfers energy to the electron" is wrong — below threshold, there is no photoelectric transfer, the light simply does not eject anything.

A correct, R incorrect.

**⚡ The Smart Move**

In assertion-reason questions, circle the absolute words first — *any, always, all, every, never*. One absolute word can sink an otherwise reasonable-sounding statement, and examiners place it there deliberately. R died on the word "any".

**⚠️ Where Students Get Stuck**

You will want to say — sir, energy transfer to hota hi hai, collision mein kuch to milega? That is the trap. In the photoelectric effect the photon is absorbed completely or not usefully at all — it is one full packet or nothing. Below threshold, increasing the *intensity* (more photons) also does nothing, because no single packet carries the full price.

An easy question once you test the statements separately — the whole game is one word.

$\boxed{\text{Answer: (b)}}$

---

# 5 · ATOM-016 (NVT, ans 8) — de Broglie wavelength in the 4th orbit

## [CURRENT — in DB]

🧠 **Bohr meets de Broglie**
Louis de Broglie's wave-particle duality explains Bohr's quantization beautifully: the circumference of an orbit must be a whole number of wavelengths. $2\pi r_n = n \lambda$.

🗺️ **The Orbital Radius Bridge**
1. **Orbit Radius**: In Bohr's model, the radius of the $n^\text{th}$ orbit is given by $r_n = n^2 a_0$.
   For $n=4$: $r_4 = 4^2 a_0 = 16 a_0$.
2. **Finding the Wavelength**:
   Using the wave condition $2 \pi r_4 = 4 \lambda$:
   $\lambda = \frac{2 \pi (16 a_0)}{4} = \frac{32 \pi a_0}{4} = 8 \pi a_0$.
The question asks for the value in front of $\pi a_0$, which is $8$.

⚡ **The "n squared" Secret**
Notice what happened when we combined the formulas:
$\lambda = \frac{2 \pi r_n}{n} = \frac{2 \pi n^2 a_0}{n} = 2n \pi a_0$.
So for any $n$, the wavelength is just $2n \pi a_0$. For $n=4$, it's $2(4) = 8$. This trick works for any hydrogenic system!

⚠️ **Common Traps**
Don't confuse $n^2$ with $n$! The radius grows as $n^2$, but the wavelength grows as $n$. Students often forget the $n^2$ part of the radius and end up with $2\pi a_0$.

$\boxed{\text{Answer: 8}}$

## [REWRITE — teacher voice]

**🧠 The Orbit Holds Exactly n Full Waves**

A 30-second question if you carry the right picture. De Broglie's whole idea was this: the electron's wave must close on itself, so the circumference of the $n^{th}$ orbit holds exactly $n$ complete wavelengths — $2\pi r_n = n\lambda$. You already know $r_n = n^2 a_0$. Put the two together; that is the entire question.

**🗺️ Working It Out**

For $n = 4$: $r_4 = 16\,a_0$.

$2\pi r_4 = 4\lambda \;\Rightarrow\; \lambda = \frac{2\pi \times 16\,a_0}{4} = 8\pi a_0$

The blank asks for the number in front of $\pi a_0$: that is 8.

**⚡ The Smart Move**

Combine the two formulas once and keep the result forever:
$\lambda = \frac{2\pi r_n}{n} = \frac{2\pi n^2 a_0}{n} = 2n\,\pi a_0$
So the de Broglie wavelength in the $n^{th}$ Bohr orbit is just $2n$ times $\pi a_0$ — for $n=4$, write $8$ directly. The radius grows as $n^2$, but one $n$ cancels against the wave count, leaving a clean $n$.

**⚠️ Where Students Get Stuck**

The $n^2$-versus-$n$ slip, both ways. You will want to say — sir, radius is $n^2$, so wavelength should also jump as $n^2$? No — one $n$ cancels, wavelength grows only as $n$. And the reverse slip: forgetting the $n^2$ in the radius entirely and landing on $2\pi a_0$. Write $r_n = n^2 a_0$ first, every time, then divide.

An easy question — one combination, one cancellation, done.

$\boxed{\text{Answer: 8}}$
