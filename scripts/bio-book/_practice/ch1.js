'use strict';
// Class 11 Biology — Ch.1 The Living World — "Practice — NCERT Exercises" page.
// All 10 verbatim NCERT exercises (source: scripts/bio-book/_ncert_pdfs/kebo101.txt,
// EXERCISES section), regrouped into 3 revision themes. Every fact in the
// solutions traces to this chapter's own already-published lesson pages (dumped
// and read in full before writing) or to the NCERT source text itself.
// IDs are hardcoded static strings (generated once), NOT dynamic uuid() calls —
// see the 2026-07-30 lesson in CONTRACT.md on why that matters for idempotency.
module.exports = {
  slug: 'ch1-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 10 NCERT textbook exercises for the chapter, grouped into 3 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: '621d7277-055b-43e0-99df-7419d7fbfc60',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A taxonomic ladder rising from a single species at the base through genus, family, order, class, phylum, to kingdom at the top, with a lion, tiger and leopard shown converging at the genus rung',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Scientific textbook illustration, wide landscape banner, flat 2D educational diagram on a dark background (#0a0a0a near-black). A vertical ladder of seven rungs rising from bottom to top, each rung a horizontal bar, unlabelled. At the bottom rung, three small simplified big-cat silhouettes (a lion, a tiger, a leopard) sit close together. One rung up, the three silhouettes have merged into a single shared node, showing them converging into one broader group. The ladder continues upward through progressively wider, more abstract bars toward the top. Clean white outlines, muted natural ochre and sage tones, biologically accurate schematic proportions, no photorealism, no cartoon, matches standard biology textbook illustration conventions. No text, no labels, no leader lines, no pointer lines of any kind anywhere in the image.",
    },
    {
      id: 'a29402b0-bf7d-4d3b-a2f8-8a2813450e37',
      type: 'text',
      order: 1,
      markdown: "You've read the chapter — now drill it. Below are **all 10 NCERT exercises** for *The Living World*, pulled out of the textbook's running order and re-sorted into three revision themes: why we classify and name organisms at all, the exact rules of binomial nomenclature, and the taxonomic hierarchy itself.\n\nTry to answer each one in your head (or on paper) before you open the solution. The worked answer is written to *teach* the whole idea, not just tick the box — so even a question you get right is worth reading through.",
    },
    {
      id: '006eb67d-bf76-4ec9-b7c8-8edc4d49dec6',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 1.1–1.10',
      intro: 'Every end-of-chapter exercise, regrouped into three revision themes. Each carries a one-line answer for a quick self-check and a full worked solution.',
      sections: [
        {
          id: 's1-why-classify',
          title: 'Why We Classify and Name Organisms',
          blurb: 'The whole reason taxonomy exists — from cataloguing 1.7–1.8 million species down to sorting the people you meet.',
          items: [
            {
              kind: 'numerical',
              id: 'aad95cd6-c692-447c-ab10-d1edccee614e',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.1',
              prompt: 'Why are living organisms classified?',
              answer: 'Because with 1.7–1.8 million known species (and counting), no one could study, compare, or even talk about life without sorting it into manageable, comparable groups.',
              solution: "Go back to the opening number of this chapter: somewhere between **1.7 and 1.8 million species** have been formally described so far, and that count keeps growing. No single person could ever study, remember, or meaningfully compare that many organisms one at a time.\n\n**Classification is simply the process of sorting organisms into convenient groups based on characters you can actually observe** — this chapter's own definition. It takes an unmanageable diversity and turns it into something searchable: once you know an organism's genus, you already know a great deal about which other organisms it's close to and which it isn't, without having to study every single species from scratch.\n\nIt also solves a communication problem. Two biologists anywhere in the world, looking at two different features of the same broad group, need a shared structure to even discuss what they're seeing. Classification is that shared structure — the same reason nomenclature (Q1.5–1.7) exists alongside it.",
            },
            {
              kind: 'numerical',
              id: '18082c4c-3449-4487-b3c0-fed79ed252cd',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.2',
              prompt: 'Why are the classification systems changing every now and then?',
              answer: "Because the criteria used to sort organisms change as scientific understanding deepens — new evidence (cell structure, biochemistry, genetics) keeps revealing that old groupings based on surface similarity were misleading.",
              solution: "This chapter itself doesn't walk through the history, but the reason follows directly from what classification *is*: sorting organisms by the characters you can observe. What changes over time isn't the organisms — it's **which characters science is able to observe and how reliable those characters turn out to be**.\n\nEarly classification could only use what was visible to the eye — shape, size, habit. As tools improved (the microscope, biochemical tests, and eventually DNA sequencing), biologists found that organisms that *looked* similar were sometimes only distantly related, and organisms that looked very different were sometimes close relatives. Each time a more reliable criterion becomes available, the groupings get redrawn to match it more accurately.\n\nYou'll see this happen concretely in the very next chapter: the old two-kingdom system (Plants vs Animals) had to be abandoned once biologists could properly examine cell structure and nutrition, and replaced with Whittaker's five-kingdom system. That's classification changing in real time, for exactly this reason.",
            },
            {
              kind: 'numerical',
              id: 'a369f614-73aa-46de-8b07-696dbe06a567',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.3',
              prompt: 'What different criteria would you choose to classify people that you meet often?',
              answer: "Any consistent, observable shared character works — e.g. by where I know them from (family, school, neighbourhood), by shared interest, or by how often I interact with them — the same logic biological classification uses, just applied to people.",
              solution: "This is a genuinely open question — NCERT wants you to notice that classification isn't a special biological trick, it's something you already do constantly with people, and the exercise is meant to make that obvious.\n\nA few honest, workable criteria: **by relationship/context** (family, classmates, neighbours, teachers), **by shared interest or activity** (people I know through cricket, through music, through a hobby group), or **by frequency of contact** (people I see daily, weekly, rarely). Any of these works because each one groups people by a real, observable, shared character — exactly the definition this chapter gives for biological classification.\n\nThe point worth carrying forward: just like species and genus in biology, some of these groupings will be narrow and specific (my study group) and some broad and general (everyone at my school) — a hierarchy, the same shape as the taxonomic ladder you're about to learn.",
            },
            {
              kind: 'numerical',
              id: 'd93d706b-12e2-4821-b5a9-05515e71e034',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.4',
              prompt: 'What do we learn from identification of individuals and populations?',
              answer: "Identification tells you exactly which organism (or which population) you're looking at — the essential first step before you can name it, classify it, compare it, or draw any conclusion about biodiversity.",
              solution: "This chapter defines **identification** as correctly describing an organism so you know exactly which one you're talking about — and it's explicit that you can't name something correctly if you can't first pin down what it actually is. Identification is the foundation everything else in taxonomy stands on.\n\nAt the level of a **single individual**, identification tells you precisely which species (or lower rank) you're dealing with — essential before any name, comparison, or classification can be applied correctly.\n\nAt the level of a **population**, correct identification tells you which species are actually present in a habitat, in what numbers, and how that compares to other places or other times — this is exactly how biodiversity is measured and tracked. Without reliable identification at the population level, the '1.7–1.8 million species' figure this chapter opens with couldn't even be counted, let alone monitored for change.",
            },
          ],
        },
        {
          id: 's2-nomenclature',
          title: 'Naming Rules — Binomial Nomenclature',
          blurb: "The one rule NCERT's own exercise tests directly: writing a scientific name correctly.",
          items: [
            {
              kind: 'numerical',
              id: '26a1e3f1-70b1-4f67-bebb-1f958ea32caa',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.5',
              prompt: 'Given below is the scientific name of Mango. Identify the correctly written name.\nMangifera Indica\nMangifera indica',
              answer: '"Mangifera indica" is correct — the genus is capitalised, the specific epithet is lowercase.',
              solution: "**\"Mangifera indica\" is the correct one.** This is exactly the \"classic formatting trap\" this chapter's own exam-tip callout warns about — NCERT asks this precise question, and the answer is always the version with the lowercase specific epithet.\n\nRun it against the chapter's own four non-negotiable rules: names are written in Latin and italicised; the **first word is the genus** and starts with a **capital letter**; the **second word is the specific epithet** and always starts **lowercase**, even if it looks like it should be capitalised. \"Mangifera Indica\" breaks rule four by capitalising the epithet — an instant wrong answer on any exam, no matter how small the difference looks.",
            },
          ],
        },
        {
          id: 's3-hierarchy',
          title: 'The Taxonomic Hierarchy',
          blurb: 'Taxon, the seven ranks, and reading the ladder in both directions.',
          items: [
            {
              kind: 'numerical',
              id: '17cf83b0-fa64-4203-a640-0466dca3fabc',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.6',
              prompt: 'Define a taxon. Give some examples of taxa at different hierarchical levels.',
              answer: 'A taxon is any single category in the taxonomic hierarchy. Examples across levels: Homo sapiens (species), Homo (genus), Hominidae (family), Primata (order), Mammalia (class), Chordata (phylum), Animalia (kingdom).',
              solution: "A **taxon** (plural: **taxa**) is any single category in the taxonomic hierarchy — this chapter states it plainly: \"'Mammalia' is a taxon, so is 'Panthera'.\" A taxon can sit at any rank; what makes it a taxon is simply that it's one named unit in the ladder.\n\nExamples at each of the seven ranks, using this chapter's own Table 1.1 (Man) and hierarchy list:\n\n| Rank | Taxon (example) |\n|---|---|\n| Species | *Homo sapiens* |\n| Genus | *Homo* |\n| Family | Hominidae |\n| Order | Primata |\n| Class | Mammalia |\n| Phylum | Chordata |\n| Kingdom | Animalia |\n\nEvery single entry in that table — species up to kingdom — is its own taxon. \"Taxon\" is the general word for any one of them; \"taxonomic hierarchy\" is the word for the whole ladder together.",
            },
            {
              kind: 'numerical',
              id: 'bbfc29e4-935d-4657-8ae4-3e1fe32ea0e0',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.7',
              prompt: 'Can you identify the correct sequence of taxonomical categories?\n(a) Species → Order → Phylum → Kingdom\n(b) Genus → Species → Order → Kingdom\n(c) Species → Genus → Order → Phylum',
              answer: '(a) and (c) are both genuinely ascending sequences (they skip ranks, but never go backward). (b) is wrong — it puts Genus before Species, reversing the true order.',
              solution: "The real taxonomic ladder, bottom to top, is: **Species → Genus → Family → Order → Class → Phylum/Division → Kingdom**. A sequence can legitimately skip ranks and still be \"correct\" — what makes a sequence wrong is going **backward**, placing a broader rank before a narrower one.\n\nCheck each option against that rule:\n\n- **(a) Species → Order → Phylum → Kingdom** — skips Genus, Family, and Class, but every step still moves from narrower to broader. **Correct direction.**\n- **(b) Genus → Species → Order → Kingdom** — Species is actually *below* Genus on the ladder, so putting Genus first reverses the first step. **Wrong** — this is the one to flag.\n- **(c) Species → Genus → Order → Phylum** — skips Family and Class, but again every step moves narrower to broader. **Correct direction.**\n\nSo (a) and (c) are both legitimate (if incomplete) ascending sequences; (b) is the one that actually breaks the hierarchy, because it starts by going the wrong way.",
            },
            {
              kind: 'numerical',
              id: 'f11dd7b2-02d6-4997-8421-418bf46eee60',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.8',
              prompt: 'Try to collect all the currently accepted meanings for the word ‘species’. Discuss with your teacher the meaning of species in case of higher plants and animals on one hand, and bacteria on the other hand.',
              answer: "For higher plants and animals, a species is usually defined by shared fundamental characters plus the ability to interbreed within the group. Bacteria don't reproduce sexually, so that definition doesn't apply — bacterial species are instead drawn from morphological, biochemical, and genetic similarity.",
              solution: "This chapter's own definition of species is a starting point: **\"a group of individual organisms with fundamental similarities\"** — *Mangifera indica*, *Solanum tuberosum*, and *Panthera leo* are each named as distinct species by their clear morphological differences.\n\nFor **higher plants and animals**, biologists commonly sharpen this further using the *biological species concept*: a species is a group of individuals that share fundamental characters and can interbreed with each other in nature to produce fertile offspring, while being reproductively isolated from other such groups. This works well because sexual reproduction gives a clean, testable boundary.\n\nFor **bacteria**, that definition breaks down — bacteria don't reproduce sexually, so \"can they interbreed\" isn't a meaningful test. Bacterial species are instead defined using **morphology** (shape — bacillus, coccus, vibrio, spirillum), **biochemical properties** (metabolic tests, staining reactions), and increasingly **genetic/DNA sequence similarity**. So the *word* \"species\" stays the same, but what actually defines the boundary between one species and the next genuinely differs between organisms that reproduce sexually and those that don't — which is exactly why NCERT asks you to discuss it rather than just define it once.",
            },
            {
              kind: 'numerical',
              id: 'd42742c9-cc2e-4b5e-b7a6-1bac182fc472',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.9',
              prompt: 'Define and understand the following terms:\n(i) Phylum (ii) Class (iii) Family (iv) Order (v) Genus',
              answer: 'Genus groups related species; Family groups related genera; Order groups related families; Class groups related orders; Phylum groups related classes (Division, for plants).',
              solution: "Read these bottom-to-top, since each rank is defined as a group of the rank just below it — this chapter builds them in exactly that order:\n\n**(v) Genus** — a group of related species that share more in common with each other than with species from any other genus. Example: *Panthera* holds the lion, tiger, and leopard together, separate from *Felis* (the house cat's genus).\n\n**(iii) Family** — a group of related genera, sharing fewer similarities than genus-mates do. Example: Felidae holds both *Panthera* and *Felis*; dogs sit in a separate family, Canidae.\n\n**(iv) Order** — an assemblage of families with only a few shared characters. Example: Carnivora holds both Felidae and Canidae together.\n\n**(ii) Class** — a group of related orders. Example: Mammalia holds order Carnivora and order Primata (monkeys, gorillas, gibbons) together.\n\n**(i) Phylum** (for animals — **Division** is the equivalent word for plants) — every class built around a shared deep body plan belongs to one phylum. Example: Chordata holds every class from fish to mammals, unified by a notochord and a dorsal hollow nerve cord.\n\nNotice the shape of the pattern: each rank going up is defined purely as \"a group of the rank below it, sharing progressively fewer characters\" — which is also why this chapter warns that relationships get harder to work out the higher you climb.",
            },
            {
              kind: 'numerical',
              id: 'ad84feb0-e39a-4f8b-a8bd-af6a1904c0f4',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.10',
              prompt: 'Illustrate the taxonomical hierarchy with suitable examples of a plant and an animal.',
              answer: 'Man (animal): Homo sapiens → Homo → Hominidae → Primata → Mammalia → Chordata → Animalia. Mango (plant): Mangifera indica → Mangifera → Anacardiaceae → Sapindales → Dicotyledonae → Angiospermae → Plantae.',
              solution: "Use this chapter's own Table 1.1, which already gives a complete plant example and a complete animal example, walked from Species up to Kingdom.\n\n**Animal — Man:**\n\n| Rank | Category |\n|---|---|\n| Species | *Homo sapiens* |\n| Genus | *Homo* |\n| Family | Hominidae |\n| Order | Primata |\n| Class | Mammalia |\n| Phylum | Chordata |\n| Kingdom | Animalia |\n\n**Plant — Mango:**\n\n| Rank | Category |\n|---|---|\n| Species | *Mangifera indica* |\n| Genus | *Mangifera* |\n| Family | Anacardiaceae |\n| Order | Sapindales |\n| Class | Dicotyledonae |\n| Division | Angiospermae |\n| Kingdom | Plantae |\n\nNotice the one real difference between the two columns: the animal table says **Phylum** (Chordata) while the plant table says **Division** (Angiospermae) at that exact same rung — this chapter is explicit that Phylum and Division are the *same rank*, just different words depending on whether you're classifying an animal or a plant.",
            },
          ],
        },
      ],
    },
  ],
};
