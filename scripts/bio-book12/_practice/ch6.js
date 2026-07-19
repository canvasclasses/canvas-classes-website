module.exports = {
  slug: 'ch6-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 10 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: 'b4b00b06-8e06-49e0-b226-02cc3964a3db',
      type: 'image',
      order: 0,
      src: '',
      alt: 'The story of evolution — a branching tree of life from ancient fossils to modern species',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'A hand-drawn coloured illustration on a deep-charcoal dark background, muted earthy palette (ochre, olive, dusty teal, faded brick-red), no glow, no neon, no 3D. A wide left-to-right "tree of life" panorama for a Class 12 Biology evolution chapter. On the far left, layered rock strata holding fossils; rising out of them a branching evolutionary tree. Along the branches, drawn as simple labelled sketches: the horse lineage shrinking-then-growing with fewer toes (Eohippus to Equus), Darwin\'s finches with differently shaped beaks, Archaeopteryx between a small dinosaur and a bird, Australian marsupials, and a walking sequence of human ancestors from a stooped ape-like form to an upright modern human carrying a tool. Textbook-diagram feel, clean labels in a neat hand, calm and scholarly, landscape desktop-friendly composition.',
    },
    {
      id: 'ff547f3d-ff70-438a-8432-2d1bb37b27db',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are all **10 NCERT exercises** for *Evolution*, pulled out of the textbook's running order and regrouped into **5 revision themes**: how natural selection acts, what a species really is, adaptive radiation, reading the fossil record, and the story of our own species.\n\nSeveral of these are *find-out-for-yourself* activities. For those, there is no single fixed answer — so each solution shows you **what to look for, what a good answer contains, and the biology it is teaching**, all kept strictly to NCERT. Try each question first, then open the worked solution. If you got it wrong, the solution is written so you learn the whole idea from it.",
    },
    {
      id: 'd74e9b27-4e5e-42ae-9de5-808f5ea020d1',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 6.1–6.10',
      intro:
        'All ten end-of-chapter questions, regrouped by idea. Each has a one-line answer for a quick self-check and a full worked solution.',
      sections: [
        {
          id: '866e1a93-6d57-4f61-914f-ded5bec13130',
          title: 'Natural selection in action',
          blurb: 'Darwin\'s idea, but happening fast enough to watch.',
          items: [
            {
              kind: 'numerical',
              id: 'eb69978c-2700-4630-bbf2-bfb359956e78',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.1',
              prompt:
                'Explain antibiotic resistance observed in bacteria in light of Darwinian selection theory.',
              answer:
                'A few bacteria already carry a resistance gene by chance mutation; the antibiotic kills the rest, so the resistant ones survive, reproduce, and take over the population — natural selection in action.',
              solution:
                "In any large bacterial population there is **variation**. By chance mutation, a few bacteria already carry a gene that lets them survive a particular antibiotic. Notice the order: this variation is present **before** the antibiotic is ever used — the antibiotic does not create resistance, it only reveals it.\n\nNow apply the antibiotic. It kills the sensitive (ordinary) bacteria but the few resistant ones survive. Because bacteria divide very fast, these survivors reproduce and pass the resistance gene to their offspring. Within a few generations the **whole population is resistant**.\n\nThis is exactly Darwin's natural selection:\n- the antibiotic is the **selection pressure**,\n- resistance is the **advantageous trait**,\n- the resistant type has higher **fitness** (fitness = reproductive success — it leaves more surviving offspring),\n- so the population's make-up shifts towards the better-adapted variant.\n\nAntibiotic resistance is a favourite example because it lets us **observe** natural selection over months, not millions of years — 'survival of the fittest' acting in real time.",
            },
          ],
        },
        {
          id: 'd7ee6c84-2b57-4f73-b07d-b196865064d9',
          title: 'What exactly is a species?',
          blurb: 'Pinning down the most-used, hardest-to-define word in biology.',
          items: [
            {
              kind: 'numerical',
              id: '72b893c6-2fc3-4d4d-bfd8-bfee17f9cdcc',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.3',
              prompt: 'Attempt giving a clear definition of the term species.',
              answer:
                'A species is a group of organisms that can interbreed freely in nature and produce fertile offspring, and that is reproductively isolated from other such groups.',
              solution:
                "The standard **biological species concept**:\n\n> A *species* is a group of individuals (populations) whose members can **interbreed among themselves** in nature and produce **fertile, viable offspring**, but which are **reproductively isolated** from other such groups.\n\nUnpack the three load-bearing words:\n\n1. **Interbreed** — actual or potential mating happens within the group in natural conditions.\n2. **Fertile offspring** — the young must themselves be able to reproduce. A horse × donkey gives a **mule**, but the mule is sterile — so horse and donkey are counted as *different* species even though they can mate.\n3. **Reproductively isolated** — barriers keep one species' gene pool separate from another's.\n\nThe concept is powerful but **not perfect**: it cannot be applied to organisms that reproduce only asexually, nor to fossils (we can't test if they interbred). In those cases biologists fall back on **morphological similarity** — grouping by shared body features — as the practical criterion. That is why 'species' is easy to use but genuinely hard to define with one clean line.",
            },
          ],
        },
        {
          id: 'ce3193e2-c57b-48de-9485-05bc978a089d',
          title: 'Adaptive radiation',
          blurb: 'One ancestor, many habitats — and why humans are the exception.',
          items: [
            {
              kind: 'numerical',
              id: '7e71b8f5-8b05-478e-a2c3-7ca78e9dc790',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.8',
              prompt: 'Describe one example of adaptive radiation.',
              answer:
                "Darwin's finches of the Galapagos: one ancestral seed-eating finch radiated into many species with beaks shaped for different foods.",
              solution:
                "**Adaptive radiation** is the evolution of many different species from a single ancestor, starting at one point and *radiating out* to fill the different habitats of a geographical area.\n\n**Darwin's finches (Galapagos Islands)** are the classic example. Darwin found many varieties of small black birds on the islands. He worked out that there had originally been **one seed-eating ancestral stock** of finches that reached the islands. From that single ancestor, many types evolved, each suited to a **different diet and habitat** — some stayed seed-eaters, others became insect-eaters, and their **beaks** changed shape to match the new food. All of this variety traces back to one starting point — that spreading-out from a common ancestor is adaptive radiation.\n\nAnother NCERT example is the **Australian marsupials** — a whole range of marsupials, each different, evolved from a single common marsupial ancestor. (When such radiations in different, isolated areas produce animals that end up *looking* alike because they face similar environments — e.g. the placental wolf and the marsupial Tasmanian wolf — that resemblance is called **convergent evolution**.)",
            },
            {
              kind: 'numerical',
              id: 'c40c0006-94fb-4e48-a51d-7dd08c2d46ae',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.9',
              prompt: 'Can we call human evolution as adaptive radiation?',
              answer:
                'No. Human evolution is a gradual, largely single-line descent (one lineage changing over time), not many species radiating from one ancestor into different habitats.',
              solution:
                "**No — human evolution is not adaptive radiation.**\n\nRemember what adaptive radiation means: **many** different species evolve from **one** common ancestor, each adapting to a **different** habitat or niche in the same area, giving a *branching, spreading* pattern (Darwin's finches, Australian marsupials).\n\nHuman evolution looks different. It is essentially a **gradual change along one main line** over time — from ancestors such as *Australopithecus* through *Homo habilis*, *Homo erectus* and *Homo neanderthalensis* to *Homo sapiens*. What changed was a **progression within a single lineage** (brain size grew, posture became upright, tool use and culture appeared) — not a fanning-out into many co-existing species each occupying a different habitat.\n\nSo human evolution is better described as **gradual / phyletic evolution** (one lineage transforming over time), not adaptive radiation.",
            },
          ],
        },
        {
          id: '3eb4a107-22d8-48b2-bcef-13f9a64eed14',
          title: 'Fossils & tracing lineages',
          blurb: 'Reading descent-with-modification straight from the rocks.',
          items: [
            {
              kind: 'numerical',
              id: '71ad3fb3-c4e0-49ac-8d1a-6f688f9d3ac9',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.2',
              prompt:
                'Find out from newspapers and popular science articles any new fossil discoveries or controversies about evolution.',
              answer:
                'An activity — there is no single fixed answer. Collect and note real reports of new fossils (e.g. new hominin finds, feathered-dinosaur fossils) and evolution debates, with source and date.',
              solution:
                "This is a **find-out-for-yourself** activity, so there is no one fixed answer — the point is to connect the textbook to **real, current science**. Keep a small clippings/notes file, and for each item record *what*, *where*, *how old*, and *the source and date*.\n\n**New fossil discoveries — look for things like:**\n- new **hominin (early human) fossils** — e.g. *Australopithecus*, *Homo naledi*, *Ardipithecus*;\n- **feathered-dinosaur** fossils that link dinosaurs to birds;\n- **transitional (\"missing-link\") fossils** that show one group grading into another.\nFor each, note what it tells us about **descent with modification**.\n\n**Controversies — be careful to separate two very different things:**\n- The **public/social** debate between evolution and non-scientific alternatives such as special creation. Within science, the evidence for evolution (fossil, molecular, embryological, and biogeographic) is not in dispute.\n- The genuine **scientific** debates, which are about the *mechanism and pace* of evolution — for example **gradualism vs punctuated equilibrium** — not about *whether* evolution happened.\n\nA good submission is a short annotated list of real articles, each with your one-line note on the biology.",
            },
            {
              kind: 'numerical',
              id: 'e364beb3-aa8b-403f-ab10-30aa031bbae0',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.6',
              prompt:
                'List 10 modern-day animals and using the internet resources link it to a corresponding ancient fossil. Name both.',
              answer:
                'An activity — pair each living animal with a named fossil ancestor/relative (e.g. horse Equus ↔ Eohippus; birds ↔ Archaeopteryx; whale ↔ Ambulocetus).',
              solution:
                "This is a research activity. The teaching point is that **today's animals have fossil ancestors or relatives**, and comparing the two shows **descent with modification**. Give a *living animal* and a *named fossil* for each, from a reliable source. One NCERT-consistent set of ten pairs:\n\n| # | Modern animal | Ancient fossil (ancestor / relative) |\n|---|---|---|\n| 1 | Horse (*Equus*) | *Eohippus* (*Hyracotherium*) |\n| 2 | Elephant (*Elephas / Loxodonta*) | *Moeritherium* |\n| 3 | Modern birds | *Archaeopteryx* (reptile–bird link) |\n| 4 | Human (*Homo sapiens*) | *Homo erectus* / *Australopithecus* |\n| 5 | Lobe-finned fish | *Coelacanth* (*Latimeria*, a \"living fossil\") |\n| 6 | Whale | *Ambulocetus* / *Pakicetus* (walking-whale fossils) |\n| 7 | Camel | *Protylopus* |\n| 8 | Crocodile | ancient archosaur / crocodilian fossils |\n| 9 | Modern reptiles | *Dimetrodon* / early therapsid fossils |\n| 10 | Horseshoe crab (*Limulus*) | near-identical ancient horseshoe-crab fossils |\n\nYour own list may differ — what matters is that **every entry names a living animal and a real fossil relative**, and you note where you found it.",
            },
            {
              kind: 'numerical',
              id: '68f036c0-0e7c-47ac-a397-eb9916ac3402',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.7',
              prompt: 'Practise drawing various animals and plants.',
              answer:
                'A skill-building activity — draw and label whole organisms and their limbs/leaves so you can spot homologous vs analogous structures.',
              solution:
                "This is a **practical activity**, not a written answer — but it has a clear biological purpose, so draw with that purpose in mind.\n\nBy carefully drawing different animals and plants and **labelling their parts**, you train your eye to notice the similarities and differences that are the raw material of evolution:\n\n- **Homologous organs** — same basic build, different job, common ancestry. Draw the forelimb of a human, a whale, a bat and a cheetah side by side and label the bones: **humerus – radius/ulna – carpals – metacarpals – digits**. Same underlying plan, reshaped for grasping, swimming, flying, running. This shows **divergent evolution**.\n- **Analogous organs** — different build, same job, no shared ancestry. Draw a butterfly's wing next to a bird's wing: both fly, but they are built completely differently. This shows **convergent evolution**.\n- In plants, compare a **thorn and a tendril** (both from the same position) or different **leaf shapes**.\n\nKeep a sketchbook: draw the whole organism first, then its limb/leaf alongside, and label everything.",
            },
            {
              kind: 'numerical',
              id: '9d014c90-c2cf-4209-94dc-dfc0748806fd',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.10',
              prompt:
                'Using various resources such as your school Library or the internet and discussions with your teacher, trace the evolutionary stages of any one animal, say horse.',
              answer:
                'Horse line: Eohippus → Mesohippus → Merychippus → Pliohippus → Equus, showing increasing body size, fewer toes (four → one hoof), longer legs, and taller grinding teeth.',
              solution:
                "The **horse** is the best-documented fossil lineage — NCERT uses it as the standard example of evolution read from the fossil record. Trace the stages **in order**:\n\n1. **Eohippus (Hyracotherium)** — small, roughly fox-sized; **four** functional toes on the forefoot; browsed on soft leaves.\n2. **Mesohippus** — larger; **three** toes, side toes reduced.\n3. **Merychippus** — pony-sized; still three toes but weight now carried on the enlarged **middle** toe; teeth becoming high-crowned for grazing grass.\n4. **Pliohippus** — larger; effectively **one** toe, side toes vestigial.\n5. **Equus** (the modern horse) — large; a **single hoofed** toe on each foot; long limbs; high-crowned grinding teeth.\n\n**The clear trends across the series:**\n- **Body size** increased.\n- **Number of toes** reduced from four to one, the middle toe strengthening into a **hoof**.\n- **Legs** lengthened — for fast running on open grassland.\n- **Teeth** became longer and high-crowned as the diet shifted from **soft leaves to tough grass**.\n\nThis orderly, step-by-step fossil series is strong evidence for **evolution by descent with modification**.",
            },
          ],
        },
        {
          id: '2b1f7e03-ec6e-4b51-bbe8-8666cb07ff44',
          title: 'The human story',
          blurb: 'What changed as our ancestors became us — and how special we really are.',
          items: [
            {
              kind: 'numerical',
              id: 'f4a9af19-36cd-47bf-88bd-44777f3378e5',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.4',
              prompt:
                'Try to trace the various components of human evolution (hint: brain size and function, skeletal structure, dietary preference, etc.)',
              answer:
                'Across Australopithecus → Homo habilis → Homo erectus → Homo neanderthalensis → Homo sapiens: brain size rose, the skeleton became upright and bipedal, and diet shifted from plant food towards a meat-eating, tool-using, fire-cooking omnivore.',
              solution:
                "Trace the main **components (features)** as they changed through our ancestors:\n\n**Brain size & function** — steadily increased:\n- *Australopithecus* ≈ 400–500 cc;\n- *Homo habilis* ≈ 650–800 cc — the \"handy man\", the first to make tools;\n- *Homo erectus* ≈ 900 cc;\n- *Homo neanderthalensis* ≈ 1400 cc;\n- modern *Homo sapiens* ≈ 1350–1450 cc.\nWith bigger brains came **tool-making, use of fire, language and culture**.\n\n**Skeletal structure / posture** — a shift to **upright, bipedal** walking. Standing erect on two legs freed the hands; the skeleton changed to support it — S-shaped spine, bowl-shaped pelvis, arched foot, and the *foramen magnum* moved forward under the skull. Heavy brow ridges and jaws became lighter over time.\n\n**Dietary preference** — early ancestors (*Australopithecus*) ate mainly **fruits and plants**; *Homo habilis* probably did not eat much meat (NCERT), but *Homo erectus* **probably ate meat**. Later humans **hunted**, and with **fire** they **cooked** food. Diet moved from largely herbivorous to omnivorous.\n\n**Sequence (NCERT):** *Dryopithecus / Ramapithecus* (ape-like) → *Australopithecus* → *Homo habilis* → *Homo erectus* → *Homo neanderthalensis* → *Homo sapiens*. Modern humans arose in **Africa**; pre-historic cave art is about **18,000 years** old, and agriculture began about **10,000 years** ago.",
            },
            {
              kind: 'numerical',
              id: '27a5639a-a252-41fe-a32f-6c06d9c6416a',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.5',
              prompt:
                'Find out through internet and popular science articles whether animals other than man has self-consciousness.',
              answer:
                'An activity — evidence (the mirror/mark test) suggests a few highly intelligent animals — great apes, dolphins, elephants, magpies — show signs of self-awareness, though humans have it most clearly.',
              solution:
                "This is a **research activity**, so record what you find **with sources**. The topic is *self-consciousness* — being aware of oneself as an individual.\n\nThe usual scientific test is the **mirror test (mark test):** an animal is quietly marked on its body and shown a mirror. If it uses the reflection to **touch the mark on itself** (not on the mirror), that is taken as evidence it **recognises itself** — a sign of self-awareness.\n\nAnimals reported to pass, or partly pass, this test include:\n- **great apes** — chimpanzees, orangutans, gorillas, bonobos;\n- **dolphins**;\n- **elephants**;\n- some birds, notably the **magpie**.\n\nMany other animals show no such sign.\n\nSo the honest, NCERT-consistent conclusion: **humans have the clearest and most developed self-consciousness**, but a few highly intelligent animals show signs of self-awareness too — and the question is still **debated** among scientists. A good submission cites the specific articles/experiments you read.",
            },
          ],
        },
      ],
    },
  ],
};
