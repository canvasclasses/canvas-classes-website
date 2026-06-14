# NCERT Index — Structure of Atom (ATOM)

> **What this is.** A navigable, *citable* index of the exact NCERT text for this chapter, built so a
> solution-writer or Live-Books page-writer can (a) ground content in NCERT's own wording and
> (b) cite the precise source — *"this is built on NCERT Class 11, Unit 2, §2.6.6, p.64"* — which
> builds credibility, since a large share of JEE/NEET chemistry questions are designed around an
> NCERT line. This operationalizes the founder's **NCERT doctrine** (teacher-voice-profile.md §1.7:
> *"read NCERT like chemistry, not like history — every line hides a question"*).
>
> **Source.** NCERT Class 11 Chemistry, Part I, **Unit 2 "Structure of Atom"** (Reprint 2026-27).
> Local PDF: `_agents/ncert/_source/chemistry/kech102.pdf` (gitignored; re-fetch with
> `curl -L -o kech102.pdf https://ncert.nic.in/textbook/pdf/kech102.pdf`).
> **Page mapping:** printed page = PDF page + 28 (PDF p1 = printed p29).
>
> **Crucible chapter:** `ch11_atom` · display-id prefix **ATOM** · companion voice bank:
> `_agents/voice/ATOM-exemplars.md`.
>
> **How to cite in a solution/page.** Lead with **"As per NCERT"** + the section and printed page,
> e.g. *"As per NCERT (Cl-11 Ch.2, §2.4, p.47), …"*. The `§` + page below are exact. When you need
> the *exact wording* beyond what's quoted here, open the local PDF at that page — this index points
> you to it.
>
> **How to use (agents).** Before writing ATOM solutions/pages: skim the concept map, jump to the
> relevant `§`, lift the verbatim line if the question is NCERT-derived, and add the citation. Pair
> with `ATOM-exemplars.md` for *voice*; this file is *content + provenance*.

---

## Concept map (jump table)

| Concept | Section | p. |
|---|---|---|
| Cathode rays / discovery of electron | §2.1.1 | 30 |
| e/mₑ ratio (Thomson) | §2.1.2 | 31 |
| Charge on electron (Millikan oil drop) | §2.1.3 | 31 |
| Protons (canal rays), neutrons (Chadwick) | §2.1.4 | 32 |
| Fundamental particle data (Table 2.1) | — | 33 |
| Thomson "plum pudding" model | §2.2.1 | 33 |
| Rutherford α-scattering & nuclear model | §2.2.2 | 34–35 |
| Atomic number Z, mass number A | §2.2.3 | 35 |
| Isobars & isotopes (protium/deuterium/tritium) | §2.2.4 | 35 |
| Drawbacks of Rutherford model (stability) | §2.2.5 | 36 |
| EM radiation, c = νλ, wavenumber | §2.3.1 | 37–39 |
| Planck's quantum theory, E = hν, black body | §2.3.2 | 39–41 |
| Photoelectric effect, work function, KE = h(ν−ν₀) | §2.3.2 | 41–42 |
| Dual behaviour of EM radiation | §2.3.2 | 42 |
| Atomic / line spectra; H spectrum; Rydberg; series | §2.3.3 | 44–45 |
| Bohr model: postulates, rₙ, Eₙ, hydrogen-like ions | §2.4 | 46–48 |
| Spectral-line explanation (transitions, ΔE) | §2.4.1 | 48 |
| Limitations of Bohr model | §2.4.2 | 49 |
| de Broglie λ = h/mv (dual nature of matter) | §2.5.1 | 49–50 |
| Heisenberg uncertainty principle | §2.5.2 | 50–52 |
| Quantum mechanical model; orbital; \|ψ\|² | §2.6 | 52–54 |
| Quantum numbers n, l, mₗ, mₛ | §2.6.1 | 54–56 |
| Shapes of orbitals; nodes (radial/angular) | §2.6.2 | 57–59 |
| Orbital energies; (n+l) rule; shielding; Z_eff | §2.6.3 | 59–61 |
| Aufbau, Pauli, Hund | §2.6.4 | 61–63 |
| Electronic configuration; core/valence | §2.6.5 | 63–64 |
| Half/fully-filled stability; Cr/Cu; exchange energy | §2.6.6 | 64–65 |
| Worked Problems 2.1–2.18 | (inline below) | 36–57 |

---

## §2.1 Discovery of Sub-atomic Particles · p.30

**Verbatim (citable):**
> "Like charges repel each other and unlike charges attract each other."

Insight into atomic structure came from experiments on **electrical discharge through gases**.

### §2.1.1 Discovery of Electron · p.30
- 1830 **Faraday** — electrolysis → particulate nature of electricity.
- Mid-1850s — **cathode ray discharge tubes** (low pressure, high voltage).
- Cathode-ray results (i–v): rays go cathode→anode; travel straight without field; deflect like **negatively charged particles** in electric/magnetic fields → **electrons**; characteristics are **independent of electrode material and gas**.

> "Thus, we can conclude that electrons are basic constituent of all the atoms."

**Question hooks:** "independent of gas/electrode material" (why electron is universal); the i–v list is a classic statement-matching MCQ source.

### §2.1.2 Charge-to-Mass Ratio of Electron · p.31
- **Thomson, 1897.** Measured e/mₑ via balanced electric + magnetic deflection.
- **e/mₑ = 1.758820 × 10¹¹ C kg⁻¹** (eq 2.1). Deflection depends on (i) charge magnitude, (ii) particle mass, (iii) field strength.

### §2.1.3 Charge on the Electron · p.31
- **Millikan oil-drop experiment (1906–14).** Charge on electron = **−1.6 × 10⁻¹⁹ C**; accepted value **−1.602176 × 10⁻¹⁹ C**.
- Combined with e/mₑ → **mₑ = 9.1094 × 10⁻³¹ kg** (eq 2.2).
- Key Millikan finding (verbatim): "the magnitude of electrical charge, q, on the droplets is always an integral multiple of the electrical charge, e, that is, **q = n·e**, where n = 1, 2, 3…" → **quantization of charge**.

### §2.1.4 Discovery of Protons and Neutrons · p.32
- **Canal rays** (modified discharge tube) → positively charged particles; mass depends on gas; charge/mass varies; some carry multiples of fundamental charge; behaviour opposite to cathode rays.
- Lightest positive ion from **hydrogen → proton** (characterised 1919).
- **Chadwick (1932)** — bombarded beryllium with α-particles → **neutrons** (neutral, mass slightly > proton).

**Question hooks:** "mass of positive particle depends on the gas" (vs electron, which doesn't); discoverer–particle–year matching (Thomson/Millikan/Goldstein/Chadwick).

---

## Table 2.1 — Properties of Fundamental Particles · p.33 (VERBATIM — high-value)

| Name | Symbol | Absolute charge / C | Relative charge | Mass / kg | Mass / u | Approx. mass / u |
|---|---|---|---|---|---|---|
| Electron | e | −1.602176×10⁻¹⁹ | −1 | 9.109382×10⁻³¹ | 0.00054 | 0 |
| Proton | p | +1.602176×10⁻¹⁹ | +1 | 1.6726216×10⁻²⁷ | 1.00727 | 1 |
| Neutron | n | 0 | 0 | 1.674927×10⁻²⁷ | 1.00867 | 1 |

**Question hooks:** exact masses (electron ≈ 1/1837 of proton; neutron slightly heavier than proton — 1.00867 vs 1.00727 u).

---

## §2.2 Atomic Models · p.32

### §2.2.1 Thomson Model · p.33
- **Thomson, 1898.** Sphere (radius ≈ 10⁻¹⁰ m), **positive charge uniformly distributed**, electrons embedded — "**plum pudding, raisin pudding or watermelon**."
- Verbatim: "An important feature of this model is that the **mass of the atom is assumed to be uniformly distributed over the atom**." Explained neutrality; failed later experiments. Thomson — Nobel 1906.

### §2.2.2 Rutherford's Nuclear Model · p.34–35
- **α-particle scattering** (Geiger & Marsden): gold foil (~100 nm), ZnS screen.
- Observations (verbatim): "(i) most of the α–particles passed through… undeflected. (ii) a small fraction… deflected by small angles. (iii) **a very few α–particles (∼1 in 20,000) bounced back**, that is, were deflected by **nearly 180°**."
- Conclusions: most space **empty**; positive charge concentrated in a tiny **nucleus**; **atom radius ≈ 10⁻¹⁰ m, nucleus ≈ 10⁻¹⁵ m**. Analogy (verbatim): "if a **cricket ball represents a nucleus, then the radius of atom would be about 5 km**."
- Nuclear model: dense positive nucleus; electrons revolve in **orbits** (solar-system analogy); held by electrostatic attraction.

### §2.2.3 Atomic Number and Mass Number · p.35
- **Z = number of protons = number of electrons (neutral atom)** (eq 2.3).
- **Mass number A = number of protons (Z) + number of neutrons (n)** (eq 2.4). Protons + neutrons = **nucleons**.

### §2.2.4 Isobars and Isotopes · p.35
- Notation: ₂ᴬX (A = superscript top-left, Z = subscript bottom-left).
- **Isobars** — same mass number, different atomic number (e.g. ¹⁴₆C and ¹⁴₇N).
- **Isotopes** — same atomic number, different mass number (differ by neutron count).
- H isotopes: **protium ¹₁H (99.985%)**, **deuterium ²₁D (0.015%)**, **tritium ³₁T** (trace).
- Verbatim: "**chemical properties of atoms are controlled by the number of electrons**… all the isotopes of a given element show same chemical behaviour."

**Question hooks:** isobar/isotope/isotone/isoelectronic discrimination; "neutrons have little effect on chemical properties."

### §2.2.5 Drawbacks of Rutherford Model · p.36
- Accelerating electron (Maxwell) must radiate → spiral into nucleus in **~10⁻⁸ s** → predicts **instability** (but atoms are stable).
- Also silent on **distribution and energies** of electrons.

---

## §2.3 Developments Leading to Bohr's Model · p.37

Two key inputs: (i) **dual character of EM radiation**, (ii) **atomic spectra**.

### §2.3.1 Wave Nature of EM Radiation · p.37–39
- Maxwell (1870): oscillating charges → **electromagnetic waves**; need no medium; E and B fields **mutually perpendicular** and ⊥ to propagation.
- **EM spectrum** (Fig 2.7): radio 10⁶ Hz, microwave 10¹⁰, IR 10¹³, visible ~10¹⁵, UV 10¹⁶…
- **c = νλ** (eq 2.5); **c = 3.0 × 10⁸ m s⁻¹** (precisely 2.997925 × 10⁸).
- **Wavenumber ν̄** = number of wavelengths per unit length; units m⁻¹ (commonly **cm⁻¹**, not SI). ν̄ = 1/λ.
- Visible range: violet **400 nm (7.5×10¹⁴ Hz)** → red **750 nm (4.0×10¹⁴ Hz)**.

### §2.3.2 Particle Nature: Planck's Quantum Theory · p.39–42
- Classical physics failed on: **black-body radiation**, **photoelectric effect**, heat capacity of solids, **H line spectra**.
- **Planck (1900): quantum** = smallest quantity of energy emitted/absorbed. **E = hν** (eq 2.6); **h = 6.626 × 10⁻³⁴ J s**. Allowed energies E = 0, hν, 2hν, …nhν (staircase analogy).
- **Photoelectric effect (Hertz 1887; Einstein 1905):** electrons ejected with **no time lag**; number ∝ **intensity**; KE ∝ **frequency**, not intensity; **threshold frequency ν₀** below which no emission.
- **Work function W₀ = hν₀.** Einstein equation (eq 2.7): **KE = ½mₑv² = h(ν − ν₀) = hν − W₀**.
- **Table 2.2 — Work functions W₀/eV** (p.42): Li 2.42, Na 2.3, K 2.25, Mg 3.7, Cu 4.8, Ag 4.3. (K threshold ν₀ = 5.0×10¹⁴ Hz.)
- **Dual behaviour of EM radiation** — light shows particle nature on interaction (photoelectric, black body), wave nature on propagation (interference, diffraction).

### §2.3.3 Atomic Spectra · p.44–45
- White light through prism → **continuous spectrum**; atoms in gas phase emit only at **specific wavelengths** → **line/atomic spectra**.
- **Each element has a unique line emission spectrum** ("like fingerprints"). Emission vs absorption spectrum (photographic negatives).
- **Line spectrum of hydrogen:** Balmer (1885), visible lines (eq 2.8, n = 3,4,5…). Rydberg general form (eq 2.9).
- **Rydberg constant for hydrogen = 109,677 cm⁻¹.**
- **Table 2.3 — Spectral series:** Lyman (n₁=1, UV), Balmer (n₁=2, visible), Paschen (n₁=3, IR), Brackett (n₁=4, IR), Pfund (n₁=5, IR).

**Question hooks:** which series is visible (Balmer); region of each series; "unique fingerprint" statement; ν̄ vs ν vs λ unit traps.

---

## §2.4 Bohr's Model for Hydrogen Atom · p.46–48

**Postulates (verbatim-key):**
- (i) Electron moves in **circular orbits of fixed radius and energy** — "stationary states" / allowed energy states.
- (ii) Energy doesn't change with time in an orbit; changes only on **transition** (absorb going up, emit coming down) — **not continuous**.
- (iii) **Bohr's frequency rule:** ν = (E₂ − E₁)/h (eq 2.10).
- (iv) **Angular momentum is quantised:** **mₑvr = n·(h/2π), n = 1,2,3…** (eq 2.11).

**Quantitative results:**
- **Radius: rₙ = n²·a₀, a₀ = 52.9 pm** (eq 2.12). Bohr (1st) orbit = 52.9 pm.
- **Energy: Eₙ = −R_H·(1/n²), R_H = 2.18 × 10⁻¹⁸ J** (eq 2.13). **E₁ = −2.18×10⁻¹⁸ J** (ground state); E₂ = −0.545×10⁻¹⁸ J.
- Negative sign ⇒ bound electron is lower in energy than free electron (E_∞ = 0); most negative (n=1) = most stable = ground state.
- **Hydrogen-like ions** (He⁺, Li²⁺, Be³⁺): **Eₙ = −2.18×10⁻¹⁸·(Z²/n²) J** (eq 2.14); **rₙ = 52.9·(n²/Z) pm** (eq 2.15). Velocity ∝ Z, ∝ 1/n.

### §2.4.1 Explanation of Line Spectrum of H · p.48
- ΔE = E_f − E_i (eq 2.16). Combined (eq 2.17): **ΔE = 2.18×10⁻¹⁸ (1/n_i² − 1/n_f²) J**.
- ν = 3.29×10¹⁵ (1/n_i² − 1/n_f²) Hz (eq 2.19); ν̄ = **1.09677×10⁷ (1/n_i² − 1/n_f²) m⁻¹** (eq 2.21).
- Absorption: n_f > n_i (energy absorbed). Emission: n_i > n_f (energy released).

### §2.4.2 Limitations of Bohr's Model · p.49
- Fails on **fine structure** (doublets), **multi-electron atoms** (even He), **Zeeman** (magnetic) & **Stark** (electric) splitting; can't explain **bonding/molecules**. Ignores wave nature + violates uncertainty principle.

**Question hooks:** rₙ ∝ n²/Z and Eₙ ∝ Z²/n² (hydrogen-like scaling is heavy JEE fodder); a₀ = 52.9 pm; R_H = 2.18×10⁻¹⁸ J vs 1.09677×10⁷ m⁻¹ (energy vs wavenumber form — classic unit trap); which effects Bohr fails to explain.

---

## §2.5 Towards the Quantum Mechanical Model · p.49

### §2.5.1 Dual Behaviour of Matter (de Broglie) · p.49–50
- **de Broglie (1924): λ = h/mv = h/p** (eq 2.22). Every moving object has wave character; detectable only for small masses (electrons). Confirmed by **electron diffraction** (electron microscope).

### §2.5.2 Heisenberg's Uncertainty Principle · p.50–52
- **Heisenberg (1927)** (verbatim): "it is **impossible to determine simultaneously, the exact position and exact momentum (or velocity) of an electron**."
- **Δx · Δpₓ ≥ h/4π**, i.e. **Δx · Δvₓ ≥ h/(4π·mₑ)** (eq 2.23).
- Significance: rules out **definite trajectories/paths** of electrons → forces a **probability** description. Effect significant only for microscopic objects (negligible for macroscopic).
- Reason Bohr fails: a defined orbit needs exact position AND velocity simultaneously — forbidden by uncertainty.

**Question hooks:** λ = h/mv calculations (ball vs electron contrast, Problems 2.12–2.13); Δx·Δp = h/4π form; "uncertainty negligible for macroscopic bodies."

---

## §2.6 Quantum Mechanical Model of Atom · p.52–54

- **Schrödinger (1926):** Ĥψ = Eψ; solution gives energy levels + **wave functions ψ** (= **atomic orbitals** for one-electron species).
- **ψ has no physical meaning; |ψ|² = probability density** (Max Born), always positive.
- Five important features (p.54): energy is **quantized**; quantization from wave nature; position+velocity not simultaneously knowable; **an atomic orbital is the wave function ψ**; **an orbital cannot contain more than two electrons**; |ψ|² gives most-probable region.
- **Orbit vs orbital** (boxed, p.56): an *orbit* (Bohr) is a defined circular path (no real meaning per uncertainty); an *orbital* is a one-electron wave function ψ characterised by (n, l, mₗ).

### §2.6.1 Orbitals and Quantum Numbers · p.54–56
- **Principal quantum number n** = 1,2,3… → shell (K,L,M,N); determines size & largely energy; number of orbitals = **n²**.
- **Azimuthal quantum number l** = 0 to (n−1) → subshell shape; notation l=0,1,2,3 → **s,p,d,f**. Number of subshells in shell = n.
- **Magnetic quantum number mₗ** = −l … 0 … +l → **(2l+1)** values = orientations (s:1, p:3, d:5, f:7).
- **Spin quantum number mₛ** = +½ or −½ (Uhlenbeck & Goudsmit, 1925). An orbital holds **max 2 electrons with opposite spins**.
- Number of orbitals per subshell: s 1, p 3, d 5, f 7, g 9, h 11.

### §2.6.2 Shapes of Atomic Orbitals · p.57–59
- s orbitals **spherical**; size 4s>3s>2s>1s. p orbitals **two lobes** (2pₓ,2p_y,2p_z), nodal plane through nucleus; d orbitals five (d_xy,d_yz,d_xz,d_x²−y²,d_z²), n≥3.
- Boundary surface encloses ~**90%** probability (never 100%).
- **Nodes (VERBATIM-key):** radial (radial) nodes = **n − l − 1**; **angular nodes = l**; **total nodes = n − 1**. (ns orbital has n−1 nodes.)

### §2.6.3 Energies of Orbitals · p.59–61
- **Hydrogen:** energy depends **only on n** → 2s = 2p degenerate (eq 2.23 ordering: 1s<2s=2p<3s=3p=3d…).
- **Multi-electron:** energy depends on **n AND l** (s<p<d<f within a shell) due to **mutual electron repulsion**, **shielding/screening**, and **effective nuclear charge Z_eff**.
- **(n+l) rule (VERBATIM):** "the lower the value of (n + l) for an orbital, the lower is its energy. If two orbitals have the same value of (n + l), the orbital with **lower value of n** will have the lower energy." (Table 2.5.) Examples: 4s<3d, 6s<5d, 4f<6p.

### §2.6.4 Filling of Orbitals · p.61–63
- **Aufbau Principle (VERBATIM):** "In the ground state of the atoms, the orbitals are filled in order of their increasing energies." Order: **1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p, 5s, 4d, 5p, 6s, 4f, 5d, 6p, 7s…**
- **Pauli Exclusion Principle (VERBATIM):** "No two electrons in an atom can have the same set of four quantum numbers." / "Only two electrons may exist in the same orbital and these electrons must have opposite spin." → **max electrons per shell = 2n²**.
- **Hund's Rule of Maximum Multiplicity (VERBATIM):** "pairing of electrons in the orbitals belonging to the same subshell (p, d or f) does not take place until each orbital belonging to that subshell has got one electron each i.e., it is singly occupied." (Pairing starts at 4th p, 6th d, 8th f electron.)

### §2.6.5 Electronic Configuration of Atoms · p.63–64
- Two notations: **sᵃpᵇdᶜ** and **orbital diagram** (boxes + arrows; the diagram shows all four quantum numbers).
- Core electrons (filled inner shells, e.g. [Ne]) vs **valence electrons** (highest n). K, Ca fill **4s before 3d** (4s lower energy).

### §2.6.6 Stability of Completely Filled & Half-Filled Subshells · p.64–65
- Anomaly (VERBATIM-key): Cr and Cu take **3d⁵4s¹** and **3d¹⁰4s¹** (not 3d⁴4s²/3d⁹4s²) — "**fully filled orbitals and half-filled orbitals have extra stability (lower energy)**." Stable configs: p³, p⁶, d⁵, d¹⁰, f⁷, f¹⁴.
- **Causes (boxed):** (1) **symmetrical distribution** of electrons (smaller shielding, stronger nuclear attraction); (2) **Exchange energy** — stabilization from same-spin electrons in degenerate orbitals exchanging positions; maximum exchanges (hence max stability) at half-/fully-filled. Exchange energy is the basis of Hund's rule.

**Question hooks:** Cr/Cu (and Mo, Ag, Au, Pd) anomalous configs; "exchange energy" as the *real* reason (not just "symmetry"); (n+l) ordering exceptions; counting unpaired electrons.

---

## Worked Problems (the question-derivation source) · p.36–57

NCERT's solved Problems are frequently the *seed* of Crucible/PYQ questions — cite them when a stem mirrors one.

| # | p. | What it does |
|---|---|---|
| 2.1 | 36 | Protons/neutrons/electrons in ⁸⁰₃₅Br (n = A−Z = 45). |
| 2.2 | 36 | Assign symbol from e/p/n counts → S²⁻ (anion charge = excess electrons). |
| 2.3 | 39 | λ from frequency (1368 kHz radio) = 219.3 m. |
| 2.4 | 39 | Visible λ (400/750 nm) → frequency (Hz). |
| 2.5 | 39 | Wavenumber & frequency of 5800 Å yellow light. |
| 2.6 | 42 | Energy of one **mole** of photons (ν=5×10¹⁴) = 199.51 kJ mol⁻¹. |
| 2.7 | 42 | Number of photons/s from a 100 W, 400 nm bulb = 2.012×10²⁰. |
| 2.8 | 43 | Photoelectric: min energy to remove e⁻ from Na; max λ (517 nm, green). |
| 2.9 | 43 | KE of ejected electron, ν₀=7×10¹⁴, ν=1×10¹⁵ → 1.988×10⁻¹⁹ J. |
| 2.10 | 49 | Frequency/λ of photon, n=5→2 (Balmer, visible) → 6.91×10¹⁴ Hz. |
| 2.11 | 49 | Energy & radius of He⁺ first orbit (Z=2) → −8.72×10⁻¹⁸ J, 0.02645 nm. |
| 2.12 | 50 | de Broglie λ of a 0.1 kg ball at 10 m/s = 6.626×10⁻³⁴ m (undetectable). |
| 2.13 | 50 | de Broglie λ of electron from its KE → 896.7 nm. |
| 2.14 | 50 | Mass of a photon, λ=3.6 Å → 6.135×10⁻²⁹ kg. |
| 2.15 | 51 | Uncertainty in velocity, Δx=0.1 Å (Heisenberg). |
| 2.16 | 51 | Uncertainty in position of a golf ball (negligible). |
| 2.17 | 57 | Total orbitals for n=3 → 9 (= n²). |
| 2.18 | 57 | Name orbitals from (n,l): 2p, 4s, 5f, 3d. |

---

## Exercises (NEET/JEE source pool) · p.69+

End-of-chapter exercises (2.1 onward) are heavily reused in coaching material. When a Crucible stem matches one, cite *"NCERT Cl-11 Ch.2, Exercise 2.N."* (First few: 2.1 electrons weighing 1 g / mole of electrons; 2.2 electrons in methane, neutrons in ¹⁴C, protons in NH₃; 2.3 protons/neutrons in given nuclei.)

---

*Built 2026-06-13. First file of the NCERT corpus (see `_agents/ncert/NCERT_INDEX.md`). Update only if NCERT revises the chapter; the diff-loop signal is when a founder edit reveals a needed line not yet captured here.*
