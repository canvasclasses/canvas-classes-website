'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'darwin-lamarck-and-natural-selection',
  title: 'How Evolution Works — Darwin, Lamarck & Natural Selection',
  subtitle: "Why more offspring are born than can ever survive, how nature quietly picks the winners, and why the famous giraffe-stretching-its-neck story is wrong.",
  page_number: 2,
  page_type: 'lesson',
  tags: ['natural-selection', 'darwinism', 'lamarckism', 'theories-of-evolution'],
  glossary: [
    { term: 'natural selection', definition: 'The mechanism of evolution Darwin proposed: individuals whose inherited characters help them survive and reproduce better in their natural conditions leave more offspring, so those characters become common in the population. Nature "selects" them.' },
    { term: 'fitness', definition: 'According to Darwin, fitness refers ultimately and only to reproductive fitness — how many surviving offspring an individual leaves behind, not how strong or fast it looks.' },
    { term: 'adaptation', definition: 'An inherited characteristic that lets an organism survive better in its environment. Adaptive ability has a genetic basis, so it can be passed on and selected for.' },
    { term: 'Lamarckism', definition: "Lamarck's idea that evolution is driven by the use and disuse of organs, and that characters acquired during an individual's lifetime are passed to its offspring. This is now rejected." },
    { term: 'common ancestry', definition: 'The idea that all existing life forms share similarities because they descend from shared ancestors that lived at different periods in the history of the earth.' },
    { term: 'branching descent', definition: "One of the two key concepts of Darwin's theory (along with natural selection): from common ancestors, life forms branch out over time into many different descendant forms." },
    { term: 'variation', definition: 'The built-in differences in characteristics found among the members of any population. No two individuals are exactly alike, and most of these variations are inherited.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A weathered sailing ship on a dark ocean at dusk, a distant volcanic island on the horizon, sea birds wheeling overhead',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A nineteenth-century three-masted wooden sailing ship (evoking H.M.S. Beagle) crossing a dark, calm ocean at dusk, lit low from the left. On the far horizon to the right, a rugged volcanic island (evoking the Galapagos) sits in silhouette with a few small birds wheeling above it. Deep near-black sky (#0a0a0a base tones) fading to a faint teal glow at the waterline, quiet and atmospheric, a sense of a long scientific voyage. Painterly, naturalistic illustration style, no text, no labels, no diagram lines.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'A Boat Ride That Rewrote Biology',
      markdown: "Charles Darwin worked out his whole theory of evolution from what he saw on **one sea voyage** — a trip round the world on a sailing ship called **H.M.S. Beagle**. Watching living forms on that journey, he noticed they share similarities with each other *and* with life forms that lived millions of years ago, many now extinct. Later, on the **Galapagos Islands**, a group of small black birds — later called **Darwin's finches** — sealed it for him. No lab, no microscope. Just careful looking, and one very long boat ride.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Before Darwin, the common belief was **special creation** — the idea that every living type was created just as it is, that the variety of life was fixed and would never change, and that the earth was only about 4000 years old. All three ideas were **strongly challenged during the nineteenth century**.\n\nWhat Darwin concluded instead was that there has been a **gradual evolution of life forms**. Over the long history of the earth, some life forms became **extinct** while new forms **arose** at different periods. And crucially, all the existing life forms **share similarities and share common ancestors** — ancestors that lived at different times in the past. This also means the earth is not thousands of years old but **billions** of years old.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Darwin: Nature Quietly Picks the Winners',
      objective: "By the end of this you can walk through the natural-selection logic — variation → struggle → survival of the fit → more progeny — in your own words, without reciting a definition.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Here is the engine of Darwin's idea, step by step.\n\n**Every population has built-in variation.** Its members differ from one another in their characteristics — no two are exactly alike.\n\nNext, **more offspring are produced than can possibly survive.** Natural resources are limited, but a population would grow explosively if every individual reproduced to the maximum. Since real population sizes stay limited, there is a constant **struggle — a competition for resources.** (Darwin was influenced here by **Thomas Malthus**, who wrote about how populations press against limited resources.)\n\nNow the key move. Some of those inherited variations make an individual **better at surviving in its natural conditions** — climate, food, physical factors. Those better-fitted individuals **outbreed the others**: they survive more, and they **leave more progeny**. Because nature is doing the choosing, Darwin called this **natural selection**, and he named it the **mechanism of evolution**.\n\nRun that forward over many generations and the make-up of the population shifts — the helpful characters become common, and **new forms appear to arise**. Darwin captured this with two words that sit at the heart of his theory: **branching descent** (life branching out from common ancestors) and **natural selection**.\n\nAnd he was not alone. **Alfred Wallace**, a naturalist working in the **Malay Archipelago**, arrived at **very similar conclusions at around the same time** — a striking case of two people reaching the same insight independently.",
    },
    {
      id: uuid(), type: 'callout', order: 5, variant: 'warning', title: 'What "Fitness" Actually Means',
      markdown: "In everyday speech, \"fit\" sounds like strong, fast, or muscular. That is **not** what Darwin meant. For Darwin, **fitness refers ultimately and only to reproductive fitness** — how many surviving offspring you leave behind. A weaker-looking animal that leaves more surviving young is *fitter*, in Darwin's sense, than a powerful one that leaves fewer. And because fitness rests on characters that are **inherited**, there must be a **genetic basis** for getting selected. **Fitness is the end result of the ability to adapt and get selected by nature.**",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 6, reasoning_type: 'logical',
      prompt: "A colony of bacteria grows on a medium. When the medium's composition is changed, only a small part of the colony survives, then multiplies and outgrows the rest within days. Why does this show natural selection so clearly in bacteria, and not so quickly in a fish?",
      options: [
        "Bacteria deliberately change themselves to suit the new medium; fish cannot",
        "Bacteria already had built-in variation, and their very short life span lets the favoured variant multiply in days rather than in millions of years",
        "The new medium creates brand-new genes in the surviving bacteria that fish are unable to make",
        "Fish do not show natural selection at all because they are too complex",
      ],
      reveal: "The colony already had **built-in variation** — some bacteria could use the new conditions, some could not. The change in medium simply let the already-present favoured variant (say, population B) survive and outgrow the rest. Because bacteria **divide fast**, this whole selection plays out in days; in a fish or fowl, whose life span is in years, the same process would take millions of years. The tempting trap is that the medium 'creates' new genes or that the bacteria change themselves on purpose — natural selection does neither. It works on variation that is **already there**, and the change is not directed by need. Fish absolutely undergo selection too; it is just far slower because of their long life span.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'heading', order: 7, level: 2,
      text: 'Lamarck: The Giraffe That Stretched — And Why It Fails',
      objective: "By the end of this you can state Lamarck's use-and-disuse idea using his own giraffe example, and explain in one line why nobody believes it any more.",
    },
    {
      id: uuid(), type: 'text', order: 8,
      markdown: "Even before Darwin, a French naturalist named **Lamarck** had already said that evolution of life forms **had occurred**. But he explained it differently. For Lamarck, evolution was driven by the **use and disuse of organs**.\n\nHis famous example is the **giraffe**. In trying to forage leaves on tall trees, giraffes had to reach higher and higher, so (Lamarck said) they **adapted by elongating their necks** during their lifetime. Then — and this is the heart of the idea — they **passed on this acquired character of the elongated neck to their succeeding generations**. Generation after generation stretched a little more, and so, slowly, giraffes came to have long necks.\n\nIt is a neat, intuitive story. And it is wrong. As NCERT puts it plainly: **nobody believes this conjecture any more.** A character an animal *acquires* by stretching during its own life is not the kind of thing that gets passed to its offspring — evolution works on **inherited** variation, not on characters gained through use during a single lifetime.",
    },
    {
      id: uuid(), type: 'comparison_card', order: 9, title: 'Lamarckism vs Darwinism',
      columns: [
        {
          heading: 'Lamarckism',
          points: [
            'Driving force: use and disuse of organs.',
            'Characters acquired by an individual during its lifetime are passed to the next generation.',
            'Giraffe example: constant stretching to reach high leaves lengthened the neck, and that longer neck was inherited.',
            'The change is directed by the need or effort of the organism.',
            'Verdict: rejected — nobody believes this conjecture any more.',
          ],
        },
        {
          heading: 'Darwinism',
          points: [
            'Driving force: natural selection acting on inherited variation.',
            'Only characters that are already heritable are passed on; acquired characters are not.',
            'Giraffe (Darwinian view): necks already varied; longer-necked individuals fed and survived better, left more progeny, so long necks became common over generations.',
            'The change is not directed by need — variation is already present, and nature selects among it.',
            'Verdict: accepted — natural selection is the mechanism of evolution.',
          ],
        },
      ],
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 10, reasoning_type: 'logical',
      prompt: "A student says: \"Giraffes stretched their necks to reach high leaves, and each generation's stretched neck was passed to the next — that's how they got long necks.\" Which correction best captures why this reasoning is Lamarckian and rejected, while the Darwinian account is accepted?",
      options: [
        "The statement is correct; this is exactly how Darwin explained the giraffe's neck",
        "The neck-stretching in one lifetime is an acquired character, and acquired characters are not inherited; Darwin instead relies on already-present heritable variation being selected",
        "The statement is wrong only because giraffes eat from the ground, not tall trees",
        "It is wrong because natural selection makes brand-new long-neck genes appear whenever they are needed",
      ],
      reveal: "The flaw is the **inheritance of an acquired character**: a neck lengthened by stretching during one giraffe's life is not passed to its offspring. That is Lamarck's use-and-disuse idea, and it is rejected. Darwin's account needs no stretching to be inherited — the giraffes' necks **already varied** (heritable variation), the longer-necked ones fed and reproduced better, so long necks spread by **natural selection** over generations. The first option wrongly credits the Lamarckian story to Darwin. The last option is the classic misread of selection: nature does **not** create new genes on demand — it selects among variation that is already present.",
      difficulty_level: 3,
    },
    {
      id: uuid(), type: 'callout', order: 11, variant: 'remember', title: 'Lock These Before the Exam',
      markdown: "- **Darwin's voyage:** he built the theory from observations on the **H.M.S. Beagle**, and **Galapagos finches** were a key example.\n- **The natural-selection logic, in order:** built-in **variation** → more offspring than can survive → **struggle / competition for resources** → the better-fitted **survive and reproduce more** → those inherited characters spread → **new forms arise**.\n- **Two key concepts of Darwinism:** **branching descent** and **natural selection**.\n- **Wallace** independently reached the **same** conclusions at the same time (Malay Archipelago).\n- **Fitness = reproductive fitness** — measured by surviving offspring, not by strength or size. It has a **genetic basis**.\n- **Lamarck:** evolution by **use and disuse** + **inheritance of acquired characters** (giraffe neck). **Rejected** — acquired characters are not inherited.\n- **Common ancestry:** all existing life forms share similarities because they share **common ancestors** from different periods of earth's history.",
    },
    {
      id: uuid(), type: 'callout', order: 12, variant: 'exam_tip', title: 'NEET Exam Insight',
      markdown: "**Fitness:** NEET loves the definition — Darwin's fitness is **reproductive fitness only** (more surviving progeny), not physical strength. Memorise the exact line: *fitness is the end result of the ability to adapt and get selected by nature.*\n\n**Two key concepts:** if asked for the two central ideas of Darwin's theory, the answer is **branching descent and natural selection** — not 'use and disuse' (that is Lamarck).\n\n**Lamarck vs Darwin swap:** the most common trap is attributing the giraffe *neck-stretching-inherited* story to Darwin, or attributing *natural selection* to Lamarck. Keep them apart: **use and disuse + acquired characters = Lamarck (rejected); natural selection on inherited variation = Darwin (accepted).**\n\n**Wallace:** a favourite one-liner — the naturalist who reached similar conclusions independently, working in the **Malay Archipelago**, is **Alfred Wallace**.\n\n**Classic NEET question:** \"According to Darwin, fitness of an organism is best measured by ______.\" → **its reproductive success (number of surviving offspring).**",
    },
    {
      id: uuid(), type: 'text', order: 13,
      markdown: "So natural selection is the quiet, undirected editor of life: it never plans ahead and never creates a character on demand — it simply favours the inherited variations that already help their owners survive and reproduce. Next we look at the hard evidence that this process has actually shaped life on earth — the fossils, the matching bones, and the moths that changed colour.",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 14, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(), question: 'On which ship did Charles Darwin make the sea voyage that led to his theory of evolution?',
          options: ['H.M.S. Beagle', 'H.M.S. Galapagos', 'H.M.S. Malay', 'H.M.S. Endeavour'],
          correct_index: 0,
          explanation: "Darwin's observations were made during a voyage round the world on the sailing ship H.M.S. Beagle. The Galapagos was an island group he visited on that voyage (not the ship), and the Malay Archipelago is where Alfred Wallace — not Darwin — worked, so those names are placed to mislead.",
          difficulty_level: 1,
        },
        {
          id: uuid(), question: 'According to Darwin, what does the "fitness" of an organism ultimately and only refer to?',
          options: [
            'Its physical strength and speed',
            'Its body size compared with rivals',
            'Its reproductive fitness — the number of surviving offspring it leaves',
            'Its ability to change its own body to suit the environment',
          ],
          correct_index: 2,
          explanation: "Darwin defined fitness as reproductive fitness only: those better fit leave more progeny and so are selected by nature. The 'strength and speed' and 'body size' options play on the everyday meaning of 'fit', which is not what Darwin meant. The last option is really Lamarck's idea of an organism changing itself, not Darwinian fitness.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Which statement correctly describes Lamarck\'s explanation of the giraffe\'s long neck — and its current standing?',
          options: [
            'Giraffes with naturally longer necks were selected by nature; the idea is accepted',
            'Giraffes stretched their necks in life and passed the acquired long neck to offspring; the idea is now rejected',
            'A sudden large mutation gave giraffes long necks in one step; the idea is accepted',
            'Giraffes migrated to tall-tree regions, changing their gene pool; the idea is now rejected',
          ],
          correct_index: 1,
          explanation: "Lamarck proposed evolution by use and disuse: giraffes lengthened their necks by reaching for high leaves and passed this acquired character to succeeding generations — a conjecture nobody believes any more. Option A is actually the Darwinian selection account, not Lamarck's; the mutation and migration options describe entirely different mechanisms that Lamarck never proposed.",
          difficulty_level: 2,
        },
        {
          id: uuid(), question: 'Alfred Wallace is significant in the history of evolution because he:',
          options: [
            'Disproved Darwin\'s theory of natural selection',
            'First proposed the inheritance of acquired characters',
            'Independently reached conclusions very similar to Darwin\'s at around the same time',
            'Calculated allele frequencies in populations',
          ],
          correct_index: 2,
          explanation: "Wallace, working in the Malay Archipelago, arrived at conclusions very similar to Darwin's at about the same time — a co-discoverer of natural selection, not an opponent of it. The inheritance of acquired characters belongs to Lamarck, and allele-frequency calculations belong to the Hardy-Weinberg principle, so both are the wrong person.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
