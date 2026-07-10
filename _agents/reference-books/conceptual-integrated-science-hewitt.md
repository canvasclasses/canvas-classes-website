# Reference Map — Conceptual Integrated Science (Hewitt, Lyons, Suchocki, Yeh), 2nd ed.

> Per-book map for the Reference-First protocol. See [REFERENCE_LIBRARY.md](REFERENCE_LIBRARY.md) for the rule.
> **Primary use: the conceptual reference for the Class 9 Science Live Book (`class9-science`)** — and the go-to source for *concept-first, analogy-driven, plain-English* explanations across all of our foundational (class 9–10) physics, chemistry, biology, and earth-science pages. Pairs with NCERT (NCERT = syllabus + India context; Hewitt = pedagogy, analogies, cross-disciplinary hooks).

## Metadata
- **Title:** Conceptual Integrated Science, **2nd Edition** (now with MasteringPhysics)
- **Authors:** Paul G. Hewitt (the "Conceptual Physics" author), Suzanne A. Lyons, John A. Suchocki, Jennifer Yeh · **Publisher:** Pearson/Addison-Wesley
- **Level:** Introductory, **non-science-major / general reader** — i.e. it explains physics, chemistry, earth science, astronomy, and biology assuming *no* prior science. This reading level is an excellent fit for Class 9–10; **simpler and more analogy-driven than Mittal** (which is JEE-level). Use Hewitt for foundations, Mittal for JEE depth.
- **Design philosophy:** *"concepts over computation… equations as guides to thinking so the reader can connect ideas across the sciences."* The whole book is built to show how **one idea threads across all five sciences** — which makes it tailor-made for our *integrated* Class 9 Science book.
- **Scope:** 5 Parts, 29 chapters, ~890 book pages + 6 appendices. Physics (1–8), Chemistry (9–14), Biology (15–21), Earth Science (22–27), Astronomy (28–29).
- **Location:** `/Users/CanvasClasses/iCloud Drive (Archive)/Kindle Converter/Conceptual Integrated Science by Paul G. Hewitt, Suzanne A Lyons, John A. Suchocki, Jennifer Yeh (z-lib.org).pdf` (**1012 PDF pages, 107 MB**; iCloud — may be offloaded, see library caveat).
- **⚠️ PDF too large for the Read tool's text extraction (>100 MB cap).** Read it via `pdftotext`:
  `pdftotext -f <PDFpage> -l <PDFpage> "<path>" -` (poppler is installed). Do NOT try `Read` on this PDF — it errors.
- **PDF ↔ book-page offset: `PDF page = book page + 29`** (verified at book p.10→PDF 39, p.13→PDF 42, p.337→PDF 366; stable across the whole book). Brief/Detailed Contents are on PDF pp. 7–22.

---

## Coverage map — which Hewitt chapter serves which of OUR Class 9 Science chapters

Our book `class9-science` (book_id `69fbc73e-8f2c-4cf2-a678-c9fd41a1e706`), 13 chapters:

| Our Ch | Our title | Hewitt chapter(s) — book pages |
|---|---|---|
| 1 | Exploration: Entering the World of Secondary Science | **Ch 1 About Science** — scientific method (1.3–1.5), facts/theories/laws (1.6), limits of science (1.7), science vs art/religion (1.8), what "integrated science" means (1.11). pp. 1–17 |
| 2 | Cell: The Building Block of Life | **Ch 15 The Basic Unit of Life—The Cell** — characteristics of life (15.1), prokaryotic vs eukaryotic (15.2), tour of a eukaryotic cell (15.3), membrane + transport (15.4–15.5). pp. 410–433 |
| 3 | Tissues in Action | **Ch 19.1 Organization of the Human Body** + Ch 15 (cells→tissues); Hewitt has no standalone "tissues" chapter — use NCERT for the tissue taxonomy, Hewitt for the body-organization framing. pp. 549, 410+ |
| 4 | Describing Motion Around Us | **Ch 2 Describing Motion** — speed/velocity (2.9, p.32), acceleration (2.10, p.35), free fall (2.10 + Ch 5), **"Hang Time" IS 2B (p.37)**. Graphs + kinematic equations → **Appendix B "Linear and Rotational Motion."** |
| 5 | Exploring Mixtures and their Separation | **Ch 12.6–12.8** (most materials are mixtures, describing solutions, solubility) + **Ch 11** Investigating Matter (phase changes 11.3, physical/chemical properties & changes 11.4–11.5). pp. 320–335, 277–283 |
| 6 | How Forces Affect Motion | **Ch 3 Newton's Laws** (1st/2nd/3rd laws, forces & interactions, vectors) + Ch 2.4–2.8 (net force, equilibrium, friction) + **Ch 5 Gravity**. pp. 44–68, 24–31, 95–113 |
| 7 | Work, Energy, and Simple Machines | **Ch 4 Momentum and Energy** — energy (4.5), power (4.6), PE/KE (4.7–4.8), work–energy theorem (4.9), conservation (4.10), **machines (4.11)**. pp. 76–90 |
| 8 | Journey Inside the Atom | **Ch 9 Atoms and the Periodic Table** (elements, protons/neutrons, electron waves, noble-gas shell model) + **Ch 10** nucleus & radioactivity. pp. 214–242 |
| 9 | Atomic Foundations of Matter | **Ch 11 Investigating Matter** (submicroscopic view, elements→compounds, naming) + Ch 9 + Ch 12 bonds. pp. 272–296 |
| 10 | Sound Waves: Characteristics and Applications | **Ch 8 Waves—Sound and Light** — vibrations & waves (8.1–8.2), transverse/longitudinal (8.3), nature of sound (8.4), **"Sensing Pitch" IS 8A**, resonance (8.5), Doppler (8.13). pp. 178–185, 203 |
| 11 | Reproduction: How Life Continues | **Ch 15.7** (how cells reproduce) + **Ch 16.6** (meiosis & genetic diversity) + **Ch 19.8** (reproduction & development). pp. 427, 459, 570 |
| 12 | Patterns in Life: Diversity and Classification | **Ch 18 Diversity of Life on Earth** — classifying life (18.1), three domains (18.2), bacteria/archaea/protists/plants/fungi/animals (18.3–18.8). pp. 516–544 |
| 13 | Earth as a System: Energy, Matter, and Life | **Ch 21 Ecology** (materials cycling 21.6, energy flow in ecosystems 21.6–21.7) + **Ch 22** (Earth's layers) + **Ch 27A Climate Change**. pp. 608–642, 644–651, 801 |

> Beyond Class 9: because it is conceptual-level, Hewitt is also the best *foundation/intuition* source for the **opening chapters of our Crucible class-11 subjects** (nature of science, motion, energy, atoms, bonding, cell) — use it for the "why does this matter / picture it" layer, then Mittal/NCERT for rigor.

---

## How to LOCATE ANY TOPIC (the index this doc exists to provide)

1. Find the topic in the **section map below** → note its **book page**.
2. **PDF page = book page + 29.**
3. Read it: `pdftotext -f <PDF> -l <PDF> "<path>" -` (go ±1 page for spillover).

Page numbers below are **book** pages. IS = *Integrated Science* cross-disciplinary box (its parenthetical lists the sciences it links). A handful of IS-box letters carry minor two-column extraction noise — trust the page number over the letter.

### PART ONE — Physics (pp. 18–211 body; Part opener p.17)
- **1 About Science (p.1):** 1.1 Brief History of Advances · 1.2 Mathematics & Conceptual Integrated Science · 1.3 Scientific Method · 1.4 Scientific Hypothesis · 1.5 Scientific Experiment · 1.6 Facts, Theories, Laws · 1.7 Science Has Limitations · 1.8 Science, Art, Religion · 1.9 Technology · 1.10 The Natural Sciences · 1.11 Integrated Science · IS 1A (Chem+Bio) Sea Butterflies
- **2 Describing Motion (p.18):** 2.1 Aristotle on Motion · 2.2 Galileo's Inertia · 2.3 Mass—Measure of Inertia · 2.4 Net Force · 2.5 Equilibrium Rule · 2.6 Support Force · 2.7 Equilibrium of Moving Things · 2.8 Friction · IS 2A Friction Is Universal (p.31) · **2.9 Speed & Velocity (p.32)** · **2.10 Acceleration (p.35)** · **IS 2B (Bio) Hang Time (p.37)**
- **3 Newton's Laws of Motion (p.44):** 3.1 First Law · 3.2 Second Law · 3.3 Forces & Interactions · 3.4 Third Law · 3.5 Vectors (p.60) · 3.6 Summary of the Three Laws · IS (Bio) Animal Locomotion
- **4 Momentum and Energy (p.69):** 4.1 Momentum · 4.2 Impulse · 4.3 Impulse–Momentum · IS 4A (Bio) Impulse–Momentum in Sports · 4.4 Conservation of Momentum · 4.5 Energy · 4.6 Power · 4.7 Potential Energy · 4.8 Kinetic Energy · 4.9 Work–Energy Theorem · 4.10 Conservation of Energy · IS 4B (Bio+Chem) Glucose: Energy for Life · 4.11 Machines (p.86)
- **5 Gravity (p.95):** 5.1 Falling Apple · 5.2 Falling Moon · 5.3 Universal Gravitation · 5.4 Inverse-Square Law · 5.5 The Constant G · IS 5A (Bio) Your Biological Gravity Detector · 5.6 Weight & Weightlessness · IS 5B (Bio) Center of Gravity of People · 5.7 Centripetal Force Simulates Gravity · 5.8 Projectile Motion · 5.9 Altitude & Range · 5.10 Air Drag on Projectiles · 5.11 Satellites · 5.12 Elliptical Orbits · IS 5C (Astro) Escape Speed
- **6 Heat (p.121):** 6.1 Kinetic Theory of Matter · 6.2 Temperature · 6.3 Absolute Zero · 6.4 What Is Heat? · 6.5 Laws of Thermodynamics · 6.6 Entropy · Specific Heat Capacity (p.129) · IS 6B (Earth) Specific Heat & Earth's Climate · 6.7 Thermal Expansion · 6.8 Conduction · 6.9 Convection · 6.10 Radiation
- **7 Electricity and Magnetism (p.147):** 7.1 Electrical Force & Charge · 7.2 Coulomb's Law · 7.3 Electric Field · 7.4 Electric Potential · 7.5 Conductors & Insulators · 7.6 Voltage Sources · 7.7 Electric Current · 7.8 Resistance · 7.9 Ohm's Law · IS 7A (Bio) Electric Shock · 7.10 Circuits · 7.11 Electric Power · 7.12 Magnetic Force · 7.13 Magnetic Fields · IS 7B (Bio+Earth) Earth's Magnetic Field & organisms · 7.14 Magnetic Forces on Moving Charges · 7.15 Electromagnetic Induction
- **8 Waves—Sound and Light (p.178):** 8.1 Vibrations & Waves · 8.2 Wave Motion · 8.3 Transverse & Longitudinal · 8.4 Nature of Sound · IS 8A (Bio) Sensing Pitch · 8.5 Resonance · 8.6 Nature of Light · 8.7 Reflection · 8.8 Transparent & Opaque · 8.9 Color · IS 8B (Bio) Mixing Colored Lights · 8.10 Refraction · 8.11 Diffraction · 8.12 Interference · 8.13 Doppler Effect · IS 8C (Astro) Doppler & Expanding Universe · 8.14 Wave–Particle Duality

### PART TWO — Chemistry (Part opener p.213)
- **9 Atoms and the Periodic Table (p.214):** IS 9A (Phys) Atoms Are Ancient & Empty · 9.1 The Elements · 9.2 Protons & Neutrons · 9.3 The Periodic Table · 9.6 Electron Waves · 9.7 Noble Gas Shell Model · Physical & Conceptual Models
- **10 The Atomic Nucleus and Radioactivity (p.243):** 10.1 Radioactivity · IS 10A (Bio) Radiation Dosage · 10.2 Strong Nuclear Force · 10.3 Half-Life & Transmutation · IS 10B (Bio+Earth) Radiometric Dating · 10.4 Nuclear Fission · 10.5 Mass–Energy Equivalence · IS 10C (Astro) Nuclear Fusion
- **11 Investigating Matter (p.272):** 11.1 Chemistry: The Central Science · 11.2 Submicroscopic View of Matter · 11.3 Phase Changes · 11.4 Physical & Chemical Properties · 11.5 Determining Physical & Chemical Changes · 11.6 Elements to Compounds · 11.7 Naming Compounds · IS 11A (Phys+Bio) Nanotechnology
- **12 Chemical Bonds and Mixtures (p.297):** 12.1 Electron-Dot Structures · 12.2 Ionic Bond · …(covalent/metallic/polarity)… · 12.6 Molecular Attractions (p.315) · IS 12B (Bio+Earth) Most Materials Are Mixtures · 12.7 Describing Solutions · 12.8 Solubility
- **13 Chemical Reactions (p.336):** 13.1 Chemical Equations · 13.2 Energy & Chemical Reactions · 13.3 Reaction Rates · IS 13A (Earth+Bio) Catalysts · 13.4 Acids Donate Protons; Bases Accept · 13.5 Acidic/Basic/Neutral Solutions · IS 13B (Earth) Acid Rain & Ocean Acidification · 13.6 Losing & Gaining Electrons · IS 13C (Phys) Batteries & Fuel Cells · 13.7 Corrosion & Combustion
- **14 Organic Compounds (p.376):** 14.1 Hydrocarbons · 14.2 Unsaturated Hydrocarbons · 14.3 Functional Groups · 14.4 Alcohols/Phenols/Ethers · 14.5 Amines & Alkaloids · 14.6 Carbonyl Compounds · IS 14A (Bio) Drug Action · 14.7 Polymers

### PART THREE — Biology (Part opener p.409)
- **15 The Basic Unit of Life—The Cell (p.410):** 15.1 Characteristics of Life · Macromolecules Needed for Life · Cell Types: Prokaryotic & Eukaryotic · IS 15B (Phys) The Microscope · 15.3 Tour of a Eukaryotic Cell · 15.4 Cell Membrane · 15.5 Transport Into/Out of Cells · 15.6 Cell Communication · 15.7 How Cells Reproduce · 15.8 How Cells Use Energy · IS 15C (Chem) ATP & Reactions in Cells · 15.9 Photosynthesis · 15.10 Cellular Respiration & Fermentation
- **16 Genetics (p.445):** 16.1 What Is a Gene? · 16.2 Chromosomes · IS 16A (Chem) Structure of DNA · 16.3 DNA Replication · 16.4 How Proteins Are Built · 16.5 Genetic Mutations · IS 16B (Phys) How Radioactivity Causes Mutations · 16.6 Meiosis & Genetic Diversity · 16.7 Mendelian Genetics · 16.8 Beyond Mendelian Genetics · 16.9 Human Genome · 16.10 Cancer · IS 16C (Earth) Environmental Causes of Cancer · 16.11 Transgenic Organisms & Cloning · 16.12 DNA Technology
- **17 The Evolution of Life (p.482):** 17.1 Origin of Life · IS 17A (Astro) Did Life Originate on Mars? · 17.2 Early Life on Earth · 17.3 Darwin & The Origin of Species · 17.4 How Natural Selection Works · 17.5 Adaptation · IS 17B (Phys) Staying Warm & Keeping Cool · 17.6 Evolution & Genetics · 17.7 How Species Form · 17.8 Evidence of Evolution · IS 17C (Earth) Fossils · 17.9 The Evolution of Humans
- **18 Diversity of Life on Earth (p.516):** 18.1 Classifying Life · 18.2 Three Domains of Life · 18.3 Bacteria · 18.4 Archaea · 18.5 Protists · 18.6 Plants · IS 18A (Phys+Chem) Moving Water up a Tree · 18.7 Fungi · 18.8 Animals · IS 18B (Earth+Chem) Coral Bleaching · IS 18C (Phys) How Birds Fly · 18.9 Viruses & Prions
- **19 Human Biology I—Control & Development (p.548):** 19.1 Organization of the Human Body · 19.2 Homeostasis · 19.3 The Brain · 19.4 Nervous System · 19.5 How Neurons Work · IS 19A (Phys) Action Potential Speed · IS 19B (Chem) Endorphins · 19.6 The Senses · 19.7 Hormones · 19.8 Reproduction & Development · 19.9 Skeleton & Muscles
- **20 Human Biology II—Care & Maintenance (p.580):** 20.1 Integration of Body Systems · 20.2 Circulatory System · IS 20A (Chem) Hemoglobin · 20.3 Respiration · 20.4 Digestion · 20.5 Nutrition, Exercise, Health · IS 20B (Phys+Chem) Low-Carb vs Low-Cal Diets · 20.6 Excretion & Water Balance · 20.7 Defense Systems
- **21 Ecology (p.608):** 21.1 Organisms & Their Environments · 21.2 Population Ecology · 21.3 Human Population Growth · 21.4 Species Interactions · 21.5 Kinds of Ecosystems · IS 21A (Earth) Materials Cycling · 21.6 Energy Flow in Ecosystems · IS 21B (Phys+Chem) Energy Leaks When Organisms Eat · 21.7 Change in an Ecosystem

### PART FOUR — Earth Science (Part opener p.643)
- **22 Plate Tectonics (p.644):** 22.1 Earth Science Is Integrated · 22.2 Compositional Layers · 22.3 Structural Layers · 22.4 Continental Drift · 22.5 Seafloor Spreading · 22.6 Theory of Plate Tectonics · 22.7 What Drives the Plates? · Plate Boundaries · IS (Bio) Life in the Trenches
- **23 Rocks and Minerals (p.672):** 23.1 What Is a Mineral? · 23.2 Mineral Properties · 23.3 Types of Minerals · IS 23A (Chem) Silicate Tetrahedron · 23.4 How Minerals Form · 23.5 What Is Rock? · 23.6 Igneous · 23.7 Sedimentary · IS 23B Coal · 23.8 Metamorphic · 23.9 The Rock Cycle · IS 23C (Bio+Astro) Earth's History in Its Rocks
- **24 Earth's Surface—Land and Water (p.702):** 24.1 Survey of Earth · 24.2 Folds & Faults · 24.3 Mountains · 24.4 Plains & Plateaus · 24.5 Earth's Waters · 24.6 The Ocean · Composition of Ocean Water · 24.7 Fresh Water · 24.8 Glaciers
- **25 Surface Processes (p.729):** Weathering · IS 25B (Bio) Soil · 25.2 Impact of Running Water · 25.3 Glaciers—Earth's Bulldozers · 25.4 Mass Movement · 25.5 Groundwater/Caves · 25.6 Wave Effects · 25.7 Wind
- **26 Weather (p.755):** 26.1 Atmospheric Pressure · Flow of the Atmosphere—Wind · IS 26C (Bio) Wind Chill · Local & Global Wind Patterns · IS 26D (Phys) Coriolis Effect · 26.7 Ocean Currents · 26.8 Water in the Atmosphere · 26.9 Air Masses, Fronts, Cyclones
- **27 Environmental Geology (p.787):** 27.1 Earthquakes · 27.2 Tsunami · 27.3 Volcanoes · 27.4 Hurricanes · IS 27A Climate Change (p.801)

### PART FIVE — Astronomy (Part opener p.819)
- **28 The Solar System (p.820):** 28.1 Solar System & Its Formation · 28.2 The Sun · 28.3 Inner Planets · 28.4 Outer Planets · IS 28A (Bio) What Makes a Planet Suitable for Life? · 28.5 Earth's Moon · 28.6 Failed Planet Formation
- **29 The Universe (p.854):** 29.1 Observing the Night Sky · …(stars, galaxies, cosmology)…

### Back matter
- **Appendix A** On Measurement & Unit Conversion · **Appendix B** Linear & Rotational Motion (← *our kinematic-graphs & equations live here, not in Ch 2*) · **Appendix C** More on Vectors · **Appendix D** Exponential Growth & Doubling Time · **Appendix E** Physics of Fluids · **Appendix F** Chemical Equilibrium · Odd-Numbered Solutions (S-1) · Glossary (G-1) · Index.

---

## Style & voice guide — what makes Hewitt's pedagogy "brilliant" (borrow these)

These are the reusable moves. Re-express in **our** teacher voice (FORMAT-v2 / `teacher-voice-profile.md`); never copy prose verbatim (copyrighted).

1. **Concept before computation.** Hewitt builds the *picture and the why* first; the formula arrives as a summary of the idea, "a guide to thinking," not the starting point. Mirrors our plain-English mandate exactly.
2. **The cross-disciplinary "Integrated Science" box.** Every chapter ends foundational ideas into a one-page application in *another* science — e.g. acceleration → **biology (Hang Time)**, friction → earthquakes, sound → hearing/pitch, water cohesion → how trees lift water. **This is the single most valuable feature for our *integrated* Class 9 Science book.** Each box = a self-contained, surprising, memorable page.
3. **"EXPLAIN THIS" provocative opener.** Each section opens with a short, almost paradoxical question — *"How can a plant get water by losing water?"*, *"Why is the word* change *important in describing acceleration?"*, *"Under what circumstance can you drive at constant speed while your velocity changes?"* A ready-made template for our `curiosity_prompt` block.
4. **"CHECK YOURSELF / CHECK YOUR ANSWER" — interleaved formative checks.** Mini-questions *mid-section*, immediately answered, with a famous metacognitive nudge: *"Are you reading this before you've thought about the answer? Think first — you'll learn more and enjoy it more."* Suggests we **interleave** our `inline_quiz`/`reasoning_prompt` blocks through a page rather than stacking them at the end.
5. **Myth-busting, bet-winning facts.** *"The 'hang time' of even the best jumpers is almost always less than 1 s… you can win bets on this!"* Counter-intuitive, provable, shareable — great for engagement and for the Content Radar (YouTube/Shorts hooks).
6. **Everyday concrete anchors.** Speedometer + odometer for instantaneous vs average speed; gas-pedal/brake/steering-wheel as "three controls that change velocity"; a falling boulder with an imaginary speedometer reading +10 m/s each second. Pictures first, symbols second.
7. **Numbered comparison tables.** "Approximate speeds in different units" (bowling ball → sprinter → cheetah → batted baseball) puts abstract numbers on a human scale — we already do this (Mumbai local → F1 → fighter jet); Hewitt is a rich well of more.
8. **Unit insight as an "aha."** He dwells on *why* a second appears twice in m/s² — acceleration is the change, per second, of a per-second quantity. Worth foregrounding, not burying.

## Pedagogical features inventory (per chapter, to mine)
- **Learning Objective** in the margin of each section (one-line "be able to…").
- **EXPLAIN THIS** section-opening question.
- **Integrated Science (IS) boxes** — the cross-disciplinary applications (mapped above).
- **CHECK YOURSELF / CHECK YOUR ANSWER** interleaved self-tests.
- **Unifying Concept icons** — margin cross-references that point to where the same concept (e.g. gravitational force) appears elsewhere in the book; a model for our internal `[[links]]`/cross-page references.
- **Figures with thought-experiment captions** (e.g. "sketch in the missing speedometer needle").
- **Summary of Terms** (glossary per chapter) + end-of-chapter question tiers + **Readiness Assurance Test (RAT)** multiple-choice set — a ready scaffold for our quiz banks.

---

_Created 2026-06-24. Section pages are book pages; **PDF = book + 29**. Read via `pdftotext` (Read tool can't open this 107 MB PDF)._
