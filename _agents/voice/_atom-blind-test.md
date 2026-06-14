# Blind test — 3 ATOM solutions rewritten in the teacher's voice

> For founder review, 2026-06-12. NOT applied to the DB. Written per
> `teacher-voice-profile.md` §2 (written register) + `ATOM-exemplars.md`.
> Judge one thing: does the opening/closing sound like you at the board?

---

## 1. ATOM-024 (NVT, answer 4) — twin of your DPP-3 question

**Q:** The maximum number of orbitals which can be identified with $n = 4$ and $m_l = 0$ is ______.

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

## 2. ATOM-079 (NVT, answer 300) — work function → maximum wavelength

**Q:** If the work function of a metal is $6.63\times10^{-19}$ J, the maximum wavelength of the photon required to remove a photoelectron is ______ nm. [$h=6.63\times10^{-34}$ Js, $c=3\times10^8$ m/s]

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

## 3. ATOM-233 (MTC, answer c) — Bohr energy ratios match-the-column
*(Also fixes the current solution's part-C reasoning: it justified 0 via radial nodes — wrong concept; the 0 comes from orbital angular momentum with l = 0.)*

**Q:** Match: A. $V_n/K_n$ · B. $r_n \propto E_n^x$, x? · C. Angular momentum in lowest orbit · D. $1/r_n \propto Z^y$, y? — with {0, −1, −2, 1}.

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
