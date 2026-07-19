'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-evidences-for-evolution',
  title: 'The Evidences for Evolution',
  subtitle: "Rocks, forelimbs, wings, molecules and a moth in a smoky English town — each one is a separate line of proof that life has changed over time, and that natural selection is still doing it today.",
  page_number: 3,
  page_type: 'lesson',
  tags: ['evolution', 'the-evidences-for-evolution', 'homologous-organs', 'analogous-organs', 'natural-selection', 'industrial-melanism'],
  glossary: [
    { term: 'fossil', definition: 'The preserved remains (usually the hard parts) of a life-form found buried in rock. Fossils in different-aged rock layers show what organisms lived at different times in Earth\'s history.' },
    { term: 'homologous organs', definition: 'Organs of different animals that share the same basic internal structure and developmental origin but do different jobs — like the forelimb bones of a whale, bat, cheetah and human. They point to a common ancestor.' },
    { term: 'analogous organs', definition: 'Organs of different animals that look and work alike but are built on completely different internal plans — like the wing of a butterfly and the wing of a bird. They do NOT share a recent common ancestor.' },
    { term: 'divergent evolution', definition: 'When one basic structure inherited from a common ancestor develops along different directions in different species to suit different needs. It produces homologous organs.' },
    { term: 'convergent evolution', definition: 'When different structures, in unrelated groups, evolve toward the same function because they face a similar environment. It produces analogous organs.' },
    { term: 'industrial melanism', definition: 'The rise of dark-coloured (melanised) forms of an organism in industrial areas because a soot-darkened background makes the dark form better camouflaged and the light form easy prey — seen in the peppered moth of England.' },
    { term: 'anthropogenic action', definition: 'Human activity acting as a selection pressure — such as our use of herbicides, pesticides and antibiotics — which selects for resistant varieties in a matter of months or years.' },
  ],
  blocks: [
    // ── hero ─────────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A layered cliff of rock strata at dusk with faint fossil shapes in the lower bands, a bird gliding overhead',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A tall cross-section of an eroded cliff at dusk, showing many horizontal bands of sedimentary rock stacked one above another like the pages of a book. In the lower, older bands, faint ghostly outlines of shells, fish and a large reptilian skeleton are just visible embedded in the stone; the upper bands are cleaner and younger. Above the cliff a single bird glides across a deep, warm-glowing evening sky. Quiet, atmospheric, geological mood — the feeling of deep time recorded in stone. Painterly, atmospheric illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements.",
    },
    // ── fun_fact: peppered moth ──────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'The Moth That Turned Black With the Soot',
      markdown: "In England in the **1850s**, before the factories came, collectors netting **peppered moths** found **more white-winged moths** resting on the trees than dark ones. By **1920**, after industrialisation had blackened the same woods with smoke and soot, the count had **flipped — now the dark-winged (melanised) moths were the common ones**. Nobody repainted the moths. What changed was the **background**: on soot-blackened bark, a white moth stands out to a hungry bird and gets eaten, while a dark moth hides. Same species, same trees, one human generation — and you can watch natural selection turn the population dark in real time.",
    },
    // ── core: what counts as evidence ────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "How do we actually *know* evolution has happened? Not from one clever experiment, but from **several separate lines of evidence that all point the same way**. That's what makes the case strong — the rocks, the skeletons, the molecules and the living moths would each have to be a coincidence for evolution to be wrong. This page walks through four of them: **fossils, comparative anatomy, molecular similarity, and natural selection you can see happening now.**",
    },
    // ── heading: fossils ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Fossils — Reading the Rock Like a Diary',
      objective: "By the end of this you can explain how the arrangement of fossils in rock layers shows that life-forms changed over time — and name this as palaeontological evidence.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Fossils are the remains of the hard parts of life-forms found in rocks.** Picture how a rock forms: sediment settles at the bottom of water, layer on layer, over enormous spans of time. So a **cross-section of the earth's crust is like a stack of pages** — the **deepest layer is the oldest**, the top layer the youngest.\n\nOrganisms that died while a particular layer was forming got buried and preserved in it. So **different-aged rock layers contain fossils of different life-forms**. Some fossils look like modern organisms; others are of creatures now completely gone — the **extinct** ones, like the **dinosaurs**.\n\nWhen you study fossils layer by layer, a pattern jumps out: **life-forms varied over time, and certain forms are found only in certain geological periods.** New kinds of life appeared at different points in Earth's history — exactly what you'd expect if life had been slowly changing. All of this together is called **palaeontological evidence**. (And the ages of those fossils aren't guessed — they're measured by **radioactive dating** of the rock.)",
    },
    // ── mid-page reasoning check (after first big concept) ───────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "A geologist digs down through undisturbed rock and finds a fossil fish in a deep layer and a fossil bird in a shallower layer above it. What is the most reliable thing this tells us?",
      options: [
        "The bird is older than the fish, because higher layers formed first",
        "The fish-bearing layer formed earlier than the bird-bearing layer, so that life-form existed earlier in time",
        "The fish and the bird must have lived at exactly the same time",
        "Fossils in deeper layers are always of extinct species and those on top are always still alive",
      ],
      correct_index: 1,
      reveal: "In undisturbed rock, **deeper layers are older** because sediment piles up from the bottom, so the fish's layer formed *before* the bird's layer — meaning that life-form existed earlier in time. Option 1 flips the rule (higher layers are younger, not older). The layers formed at different times, so the two didn't necessarily live together. And 'deep = extinct, top = alive' is false — a fossil's depth tells you its *age*, not whether its species survives today.",
      difficulty_level: 2,
    },
    // ── heading: homology vs analogy ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Same Blueprint, Different Job — Homology vs Analogy',
      objective: "By the end of this you can tell homologous organs (same structure, common ancestor, divergent evolution) from analogous organs (same function, no common ancestor, convergent evolution) and give NCERT's examples for each.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "Now compare the *bodies* of living things. Take the **forelimbs of a whale, a bat, a cheetah and a human** — four mammals doing four totally different jobs (swimming, flying, running, gripping). Yet crack them open and you find the **same set of bones in the same pattern**: humerus, radius, ulna, carpals, metacarpals and phalanges. **The same underlying structure has been pushed along different directions to meet different needs.** This is **divergent evolution**, and organs like these are **homologous**. Homology is the fingerprint of a **common ancestor** — the shared bone plan was inherited, then remodelled.\n\nHomology isn't only about bones. **Vertebrate hearts and brains** show it too. And in **plants**, the **thorn of *Bougainvillea*** and the **tendril of *Cucurbita*** are homologous — both are the same organ modified along different lines.\n\nNow flip it around. **The wing of a butterfly and the wing of a bird** both let the animal fly, but inside they are built on **completely different plans** — they are **not** anatomically similar. Here **different structures have evolved toward the same function** because the animals faced the same challenge. This is **convergent evolution**, and such organs are **analogous**. NCERT's other examples: the **eye of an octopus and the eye of a mammal**, the **flippers of penguins and dolphins**, and — a favourite trap — the **sweet potato (a modified root) and the potato (a modified stem)**, which look alike but come from different organs.\n\nThe one-line test: **homology asks 'same structure?', analogy asks 'same function?'** Same structure but different job → homologous, common ancestor, divergent. Same job but different structure → analogous, no common ancestor, convergent.",
    },
    // ── interactive image: homologous vertebrate forelimbs ───────────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'Four vertebrate forelimb skeletons side by side — whale flipper, bat wing, cheetah leg and human arm — each showing the same bones colour-matched',
      caption: '📸 Tap each dot to see the same bones — humerus, radius, ulna and the hand bones — reappear in four very different forelimbs',
      generation_prompt: "Scientific textbook illustration comparing homologous forelimbs of four mammals. Flat 2D educational diagram on a dark background (#0a0a0a near-black), four skeletons of forelimbs drawn side by side in a row, clean white outlines, biologically accurate bone proportions. From left to right: a whale's flipper (short, broad, paddle-shaped), a bat's wing (very long thin finger bones spreading a wing membrane), a cheetah's running foreleg (long slender leg), and a human arm and hand. In every one of the four limbs, the SAME set of bones is shown and each corresponding bone is filled with the same soft functional colour across all four limbs so the viewer can match them: the single upper-arm bone (humerus) in one tint, the two forearm bones (radius and ulna) in a second tint, the wrist bones (carpals) in a third, the palm bones (metacarpals) in a fourth, and the digit bones (phalanges) in a fifth. Bones tinted in soft pastel functional colours against the dark background. No baked-in text labels, no photorealism, no cartoon, no mascots, standard comparative-anatomy textbook style.",
      hotspots: [
        { id: uuid(), x: 0.14, y: 0.5, label: 'Whale flipper', icon: 'circle',
          detail: 'A limb built for **swimming** — yet it still hides a humerus, radius, ulna, carpals, metacarpals and phalanges. Same bones, remodelled into a paddle.' },
        { id: uuid(), x: 0.38, y: 0.5, label: 'Bat wing', icon: 'circle',
          detail: 'A limb built for **flying**. The finger bones are stretched enormously long to spread a wing membrane — but they are the *same* bones as in the whale and the human.' },
        { id: uuid(), x: 0.62, y: 0.5, label: 'Cheetah foreleg', icon: 'circle',
          detail: 'A limb built for **running**. Different proportions, same underlying bone plan — the mark of **divergent evolution** from a shared ancestor.' },
        { id: uuid(), x: 0.86, y: 0.5, label: 'Human arm', icon: 'circle',
          detail: 'A limb built for **gripping and manipulating**. Because all four share this bone pattern, these forelimbs are **homologous** — evidence of common ancestry.' },
      ],
    },
    // ── comparison_card: homologous vs analogous ─────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Homologous (Divergent) vs Analogous (Convergent)',
      columns: [
        {
          heading: 'Homologous organs',
          points: [
            'Same basic **structure and developmental origin**, but do **different functions**',
            'Result of **divergent evolution** — one plan pushed in different directions',
            'Indicate a **common ancestor**',
            'Animal example: **forelimbs of whale, bat, cheetah, human**; also vertebrate hearts and brains',
            'Plant example: **thorn of *Bougainvillea* and tendril of *Cucurbita***',
          ],
        },
        {
          heading: 'Analogous organs',
          points: [
            '**Different structure**, but perform the **same function**',
            'Result of **convergent evolution** — different plans meeting the same need',
            'Do **NOT** indicate a recent common ancestor (similar habitat, not shared ancestry)',
            'Examples: **wings of butterfly and bird**, **eye of octopus and mammal**, **flippers of penguins and dolphins**',
            'Plant example: **sweet potato (root) and potato (stem)**',
          ],
        },
      ],
    },
    // ── heading: natural selection observed today ────────────────────────
    {
      id: uuid(), type: 'heading', order: 10, level: 2,
      text: 'Evolution You Can Watch Right Now',
      objective: "By the end of this you can explain industrial melanism in the peppered moth and anthropogenic resistance as living proof of natural selection — and understand why fast-breeding organisms evolve fastest.",
    },
    {
      id: uuid(), type: 'text', order: 11,
      markdown: "The strongest evidence of all is the kind you don't need a fossil for — you can **watch it happen**.\n\nGo back to the **peppered moth (*Biston betularia*)** of England. Before industrialisation, the tree trunks were pale, covered in **almost-white lichen**. Against that background the **white-winged moth was camouflaged and survived**, while the dark moth stood out and was **picked off by predators**. After industrialisation, **smoke and soot darkened the trunks** (and killed the lichen — lichens won't grow in polluted air, which is why they work as **pollution indicators**). Now the tables turned: the **dark moth was hidden and survived**, the white moth was eaten. Notice the tell-tale detail — in **rural areas** where industrialisation never came, the count of dark moths **stayed low**. The population shifted whichever way the **background** favoured. This is **industrial melanism**. And crucially, **no variant was completely wiped out** — the rare form was always still there, ready if conditions changed again.\n\nThe same story runs faster in the things we try to kill. **Overusing herbicides, pesticides and antibiotics doesn't create resistance — it selects for it.** A few resistant individuals were already present; the poison removes everyone else and lets the survivors multiply. Because microbes and insects **breed in months or years, not centuries**, resistant strains — like **DDT-resistant mosquitoes** and antibiotic-resistant bacteria — appear alarmingly fast. This is **evolution by anthropogenic action** (human-driven selection).\n\nOne warning NCERT is careful to make: this does **not** mean evolution is aiming at anything. It is **not a directed, deterministic process** — it's a **stochastic (chance-based) process**, riding on chance events in nature and chance mutations in organisms. The environment simply keeps whoever happens to fit. With that living proof in hand, the next page turns to how these small shifts add up to whole new species radiating across a landscape.",
    },
    // ── reasoning_prompt: octopus eye ────────────────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 12, reasoning_type: 'logical',
      prompt: "The eye of an octopus and the eye of a human both form images and both work brilliantly, yet the two eyes are built on entirely different internal plans and the two animals do not share a recent common ancestor. What are these eyes, and what kind of evolution produced them?",
      options: [
        "Homologous organs, produced by divergent evolution — the same eye inherited and remodelled",
        "Analogous organs, produced by convergent evolution — different structures evolving for the same function",
        "Homologous organs, produced by convergent evolution — same structure, same ancestor",
        "Vestigial organs, produced by natural selection removing a once-useful structure",
      ],
      correct_index: 1,
      reveal: "The eyes share a **function** (seeing) but not a **structure or a common ancestor**, which is the exact definition of **analogous organs** made by **convergent evolution** — different plans converging on the same job. The tempting trap is 'homologous', because both are eyes and both see well; but homology needs a *shared underlying structure and common ancestry*, and the octopus and mammal eyes have neither. Options mixing 'homologous' with 'convergent' contradict themselves, and these are working eyes, not vestigial leftovers.",
      difficulty_level: 3,
    },
    // ── remember ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 13, variant: 'remember', title: 'The Facts You Cannot Swap Around',
      markdown: "- **Homologous = same STRUCTURE, different function → divergent evolution → common ancestor.** Examples: forelimbs of whale/bat/cheetah/human; vertebrate hearts & brains; thorn of *Bougainvillea* & tendril of *Cucurbita*.\n- **Analogous = same FUNCTION, different structure → convergent evolution → NO common ancestor.** Examples: wings of butterfly & bird; eye of octopus & mammal; flippers of penguin & dolphin; **sweet potato (root) & potato (stem)**.\n- **Fossils** = remains of hard parts in rock; **deeper layer = older**; the whole line is **palaeontological evidence**; ages read by **radioactive dating**.\n- **Industrial melanism** = peppered moth (*Biston betularia*): white common before industrialisation, dark common after — selection by camouflage against soot-darkened bark. **No variant is ever fully wiped out.**\n- **Anthropogenic action** = herbicide/pesticide/antibiotic resistance, DDT-resistant mosquitoes — resistance is **selected**, not created; appears in months/years. Evolution is a **stochastic** (chance) process, not a directed one.",
    },
    // ── exam_tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 14, variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**The classify-this-pair question is guaranteed.** Drill the sorting rule: *same structure, different job* → **homologous / divergent**; *same job, different structure* → **analogous / convergent**. Then memorise NCERT's exact example pairs — the exam picks them straight off this list.\n\n**The sweet-potato trap:** sweet potato (modified **root**) and potato (modified **stem**) are **analogous**, not homologous. Different organs, same storage look.\n\n**Wings of butterfly vs bird = analogous; forelimbs of vertebrates = homologous.** Do not confuse the two 'wing/limb' cases.\n\n**Peppered moth = *Biston betularia*, England, industrial melanism** — pin the name, the country, and the before/1850s-white vs after/1920-dark flip.\n\n**Classic NEET question:** \"Thorn of *Bougainvillea* and tendril of *Cucurbita* are an example of?\" → **Homologous organs (homology / divergent evolution)** — same structure modified for different functions, indicating common ancestry.",
    },
    // ── inline quiz (LAST) ───────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 15, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: 'The wings of a butterfly and the wings of a bird both allow flight but are built on completely different internal plans. These wings are best described as:',
          options: [
            'Homologous organs formed by divergent evolution',
            'Analogous organs formed by convergent evolution',
            'Vestigial organs formed by disuse',
            'Homologous organs indicating a recent common ancestor',
          ],
          correct_index: 1,
          explanation: "Same function (flight) but different structure makes them analogous, and analogy is produced by convergent evolution. The homologous options are the trap — homology needs a shared underlying structure and common ancestry, which butterfly and bird wings do not have. They are working wings, so not vestigial.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: 'The forelimb bones of a whale, a bat, a cheetah and a human follow the same humerus–radius–ulna–carpals pattern despite doing different jobs. What does this pattern demonstrate?',
          options: [
            'Convergent evolution from unrelated ancestors',
            'Analogy, because the limbs perform different functions',
            'Divergent evolution and homology, indicating a common ancestor',
            'Anthropogenic action selecting for similar bones',
          ],
          correct_index: 2,
          explanation: "Same structure carried along different functional paths is divergent evolution, and such organs are homologous — the shared bone plan points to a common ancestor. Convergent evolution and analogy describe the opposite case (same function, different structure), and bone patterns have nothing to do with anthropogenic (human-driven) selection.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'Which pair below is an example of ANALOGOUS structures?',
          options: [
            'Thorn of Bougainvillea and tendril of Cucurbita',
            'Forelimbs of a bat and a human',
            'Sweet potato (root) and potato (stem)',
            'Hearts of two different vertebrates',
          ],
          correct_index: 2,
          explanation: "Sweet potato is a modified root and potato is a modified stem — different organs that merely look and store alike, which is analogy (convergent evolution). The Bougainvillea thorn and Cucurbita tendril, the bat and human forelimbs, and vertebrate hearts are all NCERT examples of homology (same structure, common ancestry), not analogy.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: 'After industrialisation in England, dark-winged peppered moths became more common than white-winged ones in the same woods. The best explanation is that:',
          options: [
            'The soot chemically dyed the white moths black over their lifetime',
            'Soot-darkened bark camouflaged the dark moths, so predators ate more white moths and the dark form increased',
            'The white moths deliberately mutated into dark moths to survive the pollution',
            'Industrial heat forced every white moth to leave the area, wiping the variant out completely',
          ],
          correct_index: 1,
          explanation: "On soot-blackened trunks a white moth is easy for predators to spot and a dark moth is hidden, so selection favoured the dark form and its proportion rose — classic industrial melanism. The moths were not physically dyed, and mutation is not a deliberate response to need (evolution is a chance-based, undirected process). NCERT also stresses no variant is completely wiped out, so the white form was reduced, not eliminated.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
