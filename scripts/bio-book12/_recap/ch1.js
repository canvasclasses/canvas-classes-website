'use strict';
/**
 * Chapter Recap — Ch.1 Sexual Reproduction in Flowering Plants (PILOT).
 * Authored against ./CONTRACT.md. Every fact below traces to a sentence, table,
 * remember-callout, or hotspot detail already published in this chapter's own
 * lesson pages (dumped via scripts/livebook-review/_dump_chapter.js before
 * writing a word here) — Rule 0 applies to summarizing our own content too.
 */
module.exports = {
  slug: 'ch1-chapter-recap',
  title: 'Chapter Recap — Sexual Reproduction in Flowering Plants',
  subtitle: 'The whole chapter as one map, the numbers you must not blur, the swap-traps NEET tests, and a closing quiz that spans every page.',
  page_type: 'lesson',
  tags: ['recap', 'revision'],
  blocks: [
    {
      id: '5e619cdd-3114-4f45-ac18-902e71c3d40e',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A flat, diagrammatic revision-board map of the whole chapter: a flower splitting into a male line and a female line, both lines meeting at double fertilisation, then splitting again into seed and fruit, with a small side-branch for apomixis',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: 'Flat infographic-style revision board on a solid dark-charcoal background (#121316) — NOT painterly, NOT atmospheric, NOT a photo-real scene. A single clean flowchart/mindmap diagram with simple geometric icons and thin white connecting lines. Centre-left: a simple flower silhouette icon splits into two branches. Upper branch (soft muted gold): a small anther icon -> a cluster-of-dots icon (pollen) -> a single dot icon (pollen grain), labelled loosely as the "male line" by icon shape alone (no readable text needed in the image itself). Lower branch (soft muted sage green): a small ovule icon -> a seven-dot cluster icon (embryo sac) -> "female line". The two branches converge at a central starburst/spark icon (fertilisation, dusty rose colour). From that convergence point, two new branches emerge to the right: a seed icon and a fruit icon (muted brown/orange), both leading toward a small standalone side-icon off to one side representing the exception (a seed icon with a dotted/broken connecting line, muted grey, representing apomixis - seeds without fertilisation). Overall look: clean, geometric, high-contrast, textbook revision-poster style, built to be scanned quickly rather than admired. No baked-in text captions, no glow, no neon, no 3D render.',
    },
    {
      id: 'ad8040d3-dfd2-41d7-84e0-d4b5ee32d7f1',
      type: 'text',
      order: 1,
      markdown: "You've read the whole chapter. Before you check anything below, try it **without looking first** — cover the mindmap and name each branch out loud, work the numbers table from memory, then tap to check. If a self-check trips you up, that's the exact spot worth rereading — not the whole chapter.",
    },
    {
      id: 'f6121a01-c785-44d0-80ae-dd120d9f6ee0',
      type: 'heading',
      order: 2,
      text: 'The Whole Chapter, One Map',
      level: 2,
      objective: 'Recall the chapter’s full arc, branch by branch, before you tap to check any of it.',
    },
    {
      id: 'dfdcb5e0-f965-4542-add7-0bcef3a46210',
      type: 'interactive_image',
      order: 3,
      src: '',
      alt: 'A branching mindmap of the whole chapter: flower splitting into the male line (anther, microsporogenesis, pollen grain) and the female line (ovule, megasporogenesis, embryo sac), meeting at pollination and double fertilisation, then splitting into post-fertilisation events and finally apomixis as the exception',
      caption: '📌 Tap each node — recall what happens there before you read the reveal',
      generation_prompt: 'Flat infographic-style mindmap on a solid dark-charcoal background (#121316), same visual system as the hero image but wider and clearer, built specifically to host tap targets. A simple flower silhouette at the top centre. Below it, two branches spread left and right: LEFT branch (soft gold) = three stacked icons for anther, pollen-tetrad cluster, and a single pollen grain. RIGHT branch (soft sage) = three stacked icons for ovule, a dividing-cell icon, and a seven-dot cluster (embryo sac). The two branches funnel down into one convergence node (dusty rose spark icon) in the middle. Below the convergence, one branch continues downward and splits into two: a seed icon and a fruit icon (muted brown/orange). Off to the lower side, a smaller, visually separated node with a dotted connecting line represents the exception (muted grey, seed-without-flower icon). Generous empty space around each icon/node so a tap target can be centred on it. No baked-in text, no glow, no 3D, no photorealism.',
      hotspots: [
        {
          id: 'ad5193e1-ccde-4df3-9b2e-a6b5e9da9f8e',
          x: 0.5, y: 0.06,
          label: 'The flower', icon: 'circle',
          detail: 'The site of sexual reproduction. The **androecium** (whorl of stamens) is the male part; the **gynoecium** (pistil) is the female part. Sepals and petals only protect and attract — they never reproduce.',
        },
        {
          id: '0bb517ed-3b35-4be8-9eac-21070845ad78',
          x: 0.2, y: 0.28,
          label: 'Anther — four wall layers', icon: 'circle',
          detail: 'Bilobed, dithecous, tetragonal in section, with **4 microsporangia** at the corners. Outside in: epidermis → endothecium → middle layers → **tapetum** (innermost, nourishes the pollen, dense/multinucleate cytoplasm).',
        },
        {
          id: 'eb5c157e-15c1-4384-a426-9e88382c4cdf',
          x: 0.16, y: 0.46,
          label: 'Microsporogenesis', icon: 'circle',
          detail: 'Pollen mother cell (**2n**) → meiosis → microspore tetrad (**n**). **All four** microspores survive and mature into pollen grains.',
        },
        {
          id: '121c6359-a25b-4785-a588-3918552b8779',
          x: 0.2, y: 0.62,
          label: 'The pollen grain', icon: 'circle',
          detail: '2-layered wall — outer **exine** (sporopollenin, indestructible) and inner **intine** (cellulose + pectin). 2 cells inside: vegetative (food-rich) + generative (makes the 2 male gametes). Over 60% of angiosperms shed it 2-celled.',
        },
        {
          id: 'aab6b2f8-2117-4309-a946-c22570dadbd6',
          x: 0.8, y: 0.28,
          label: 'The ovule — anatropous', icon: 'circle',
          detail: 'Funicle (stalk) → hilum (junction) → integuments around the nucellus, leaving a gap — the **micropyle** — opposite the **chalaza**. Inside the nucellus sits the embryo sac.',
        },
        {
          id: '50c3fc58-8864-45f8-8813-39b15578478a',
          x: 0.84, y: 0.46,
          label: 'Megasporogenesis', icon: 'circle',
          detail: 'Megaspore mother cell (**2n**) → meiosis → 4 megaspores (**n**). Only **one survives** — the other three degenerate. This is **monosporic development**, the mirror opposite of the male side.',
        },
        {
          id: '0420854e-8a1a-4735-992d-a174241d7e41',
          x: 0.8, y: 0.62,
          label: 'The embryo sac', icon: 'circle',
          detail: '3 free-nuclear mitotic divisions (2→4→8 nuclei, no walls yet) → walls form → **7 cells, 8 nuclei**. Egg apparatus (egg + 2 synergids) at the micropylar end, 3 antipodals at the chalazal end, 1 central cell with 2 polar nuclei in the middle.',
        },
        {
          id: '4bc5dce0-e150-4473-8536-7f58d43be43a',
          x: 0.5, y: 0.78,
          label: 'Pollination & the pollen tube', icon: 'circle',
          detail: 'Autogamy (same flower) / geitonogamy (same plant, different flower — still genetically self) / xenogamy (different plant — the only genetically different one). Compatible pollen germinates on the stigma → tube grows through style → ovary → micropyle → a synergid.',
        },
        {
          id: '266fbe20-43f8-49a9-a856-091bec09b719',
          x: 0.5, y: 0.9,
          label: 'Double fertilisation', icon: 'circle',
          detail: 'One male gamete + egg → **syngamy** → zygote (**2n**). The other male gamete + 2 polar nuclei → **triple fusion** → primary endosperm nucleus (**3n**). Found only in flowering plants.',
        },
        {
          id: 'd30e12d4-a98c-4c56-8dfa-ffae6d71563e',
          x: 0.68, y: 0.97,
          label: 'Seed & fruit', icon: 'circle',
          detail: 'Endosperm forms **before** the embryo (assured nutrition). Ovule → seed; ovary → fruit. Integuments → seed coat (testa); ovary wall → pericarp.',
        },
        {
          id: 'f2ac6fa2-9ed0-40fc-8b2f-9187e94cc4ff',
          x: 0.92, y: 0.97,
          label: 'Apomixis — the exception', icon: 'circle',
          detail: 'Seeds formed with **no fertilisation at all** — a diploid egg growing directly, or (Citrus/Mango) nucellar cells dividing into embryos. Gives **polyembryony**. Breeders want it to stop hybrid seed from segregating.',
        },
      ],
    },
    {
      id: '95fcb8bd-43a1-440f-9629-8511e0e17eaf',
      type: 'heading',
      order: 4,
      text: 'The Process Spine, in Ten Steps',
      level: 2,
      objective: 'Say the whole chapter in order, out loud, before you check the list.',
    },
    {
      id: '6ffc25c7-4216-407a-bffc-7ad0fc9ca1b5',
      type: 'text',
      order: 5,
      markdown:
        "1. The flower differentiates its **androecium** (male, stamens) and **gynoecium** (female, pistil).\n" +
        "2. Inside the anther, sporogenous tissue → pollen mother cell (2n) → **meiosis** → microspore tetrad (n, all four survive).\n" +
        "3. Each microspore becomes a **pollen grain** — exine + intine wall, vegetative + generative cell inside.\n" +
        "4. Inside the ovule, the megaspore mother cell (2n) → **meiosis** → 4 megaspores (n, only one survives — monosporic).\n" +
        "5. The surviving megaspore's nucleus divides three times (free-nuclear) → walls form → the **7-celled, 8-nucleate embryo sac**.\n" +
        "6. **Pollination** moves pollen to the stigma — by wind, water, or (most commonly) animals — as autogamy, geitonogamy, or xenogamy.\n" +
        "7. The pistil screens every grain (**pollen–pistil interaction**); a compatible tube grows stigma → style → ovary → micropyle → a synergid.\n" +
        "8. **Double fertilisation**: syngamy (gamete + egg → zygote, 2n) and triple fusion (gamete + 2 polar nuclei → PEN, 3n) — both inside one embryo sac.\n" +
        "9. **Post-fertilisation**: endosperm forms first (food store), then the embryo grows; the ovule ripens into the **seed**, the ovary into the **fruit**.\n" +
        "10. The exception: **apomixis** makes seeds with no fertilisation at all, sometimes giving **polyembryony** (Citrus, Mango).",
    },
    {
      id: '89801a7a-54f4-4ad8-91d4-c3e2820e8d10',
      type: 'heading',
      order: 6,
      text: 'Numbers You Must Not Blur',
      level: 2,
      objective: 'Cover the right-hand column and say each value before you check it.',
    },
    {
      id: '9dbcbc44-3997-40f3-88b4-fb36a0b5b67c',
      type: 'table',
      order: 7,
      caption: 'The exact figures the chapter tests — pulled from this chapter’s own remember-callouts, not re-derived',
      headers: ['What', 'Exact figure'],
      rows: [
        ['Pollen mother cell (PMC) → tetrad', '2n → meiosis → 4 microspores (n) — all 4 survive'],
        ['Megaspore mother cell (MMC) → megaspores', '2n → meiosis → 4 megaspores (n) — only 1 survives, 3 degenerate'],
        ['Mature embryo sac', '7 cells, 8 nuclei (the central cell alone holds 2 polar nuclei)'],
        ['Free-nuclear mitotic divisions to reach 8 nuclei', '3 divisions (2 → 4 → 8), walls form only after the 8-nucleate stage'],
        ['Syngamy product', 'Zygote — diploid, 2n (male gamete + egg, n + n)'],
        ['Triple fusion product', 'Primary endosperm nucleus (PEN) — triploid, 3n (male gamete + 2 polar nuclei, n + n + n)'],
        ['Pollen grain size', 'About 25–50 micrometres across'],
        ['Water pollination (hydrophily)', 'Rare — about 30 genera, mostly monocots'],
        ['Pollen shed at the 2-celled stage', 'Over 60% of angiosperms'],
      ],
    },
    {
      id: '0f1965d9-c7f5-435d-a2e5-eab37036bfeb',
      type: 'reasoning_prompt',
      order: 8,
      reasoning_type: 'quantitative',
      prompt: 'A zygote and a primary endosperm nucleus form in the same embryo sac, from gametes carried by the very same pollen tube, at almost the same moment. Without looking at the table above — why is one 2n and the other 3n?',
      options: [
        'The zygote forms from a diploid egg, while the PEN forms from a haploid male gamete',
        'The egg fuses with one male gamete (n + n = 2n) — syngamy; the PEN forms by fusing three haploid nuclei, one male gamete plus two polar nuclei (n + n + n = 3n) — triple fusion',
        'The pollen tube carries one diploid gamete for the egg and one triploid gamete for the polar nuclei',
        'The PEN doubles its own chromosome number after fusion, while the zygote does not',
      ],
      reveal:
        'Syngamy is a straightforward fusion of two haploid nuclei (the male gamete and the egg), giving 2n. Triple fusion is different in kind, not just in name — it joins THREE haploid nuclei (the second male gamete plus both polar nuclei already sitting in the central cell), giving 3n. Both gametes delivered by the tube are haploid; the ploidy difference comes entirely from how many nuclei fuse, not from the gametes themselves.',
      difficulty_level: 3,
    },
    {
      id: '2b4f193e-7b33-40ec-9b32-64979d0e022b',
      type: 'heading',
      order: 9,
      text: 'The Swap Traps',
      level: 2,
      objective: 'These are the exact pairs NEET tries to make you confuse. Read across each row once, out loud.',
    },
    {
      id: '55810003-92df-4820-a78b-3e3f7dd53433',
      type: 'table',
      order: 10,
      caption: 'Every already-taught A-vs-B pair in this chapter, in one place',
      headers: ['This', 'vs. This', 'The one fact that separates them'],
      rows: [
        ['Microsporogenesis', 'Megasporogenesis', 'Micro: all 4 products survive (→ pollen). Mega: only 1 survives, 3 degenerate (monosporic).'],
        ['Autogamy', 'Geitonogamy', 'Autogamy: same flower. Geitonogamy: a different flower, but the same plant — still genetically self.'],
        ['Geitonogamy', 'Xenogamy', 'Geitonogamy: same plant (genetically self). Xenogamy: a different plant — the only kind that is genetically different.'],
        ['Monoecious (castor, maize)', 'Dioecious (papaya)', 'Monoecious prevents autogamy only (pollen can still travel to another flower on the same plant). Dioecious prevents both autogamy and geitonogamy.'],
        ['Syngamy', 'Triple fusion', 'Syngamy: gamete + egg → zygote (2n) → embryo. Triple fusion: gamete + 2 polar nuclei → PEN (3n) → endosperm.'],
        ['Albuminous seed', 'Non-albuminous seed', 'Albuminous retains endosperm at maturity (wheat, maize, castor). Non-albuminous uses it all up before maturity, storing food in the cotyledons instead (pea, groundnut).'],
        ['True fruit', 'False fruit', 'True fruit develops from the ovary alone. False fruit also involves the thalamus (apple, strawberry, cashew).'],
        ['Endothecium', 'Tapetum', 'Endothecium is one of the OUTER three anther-wall layers — protection and dehiscence. Tapetum is the INNERMOST layer — nourishes the pollen. Do not swap their jobs.'],
      ],
    },
    {
      id: '42d2164f-da9b-4fcc-a98c-b4a7a9a3f989',
      type: 'reasoning_prompt',
      order: 11,
      reasoning_type: 'logical',
      prompt: 'You are told a flower is dioecious. Without checking the table — which of the two self-pollination types, autogamy or geitonogamy, does that fact alone rule out?',
      options: [
        'Only autogamy — geitonogamy can still happen between two flowers on the same plant',
        'Only geitonogamy — autogamy can still happen within one flower',
        'Both autogamy and geitonogamy — a dioecious plant has no flowers of the other sex on it at all, so neither can occur',
        'Neither — dioecy only affects xenogamy',
      ],
      reveal:
        'Dioecious plants (like papaya) carry only one sex per plant, so there is no flower of the opposite sex anywhere on that individual — which blocks BOTH autogamy (needs both sexes in one flower) and geitonogamy (needs both sexes somewhere on the same plant). This is the one detail that separates dioecy from monoecy: a monoecious plant (castor, maize) still has both sexes on the SAME plant, so it only stops autogamy — geitonogamy is still possible there.',
      difficulty_level: 2,
    },
    {
      id: '13def5f5-0c3a-4cfc-a378-20f302e0ef7b',
      type: 'text',
      order: 12,
      markdown: "That's the whole chapter, cover to cover. One closing check before you move on — these eight questions pull from every stage, not just one page.",
    },
    {
      id: '1c547c0d-f372-46a2-bc70-cf89769ddc9b',
      type: 'inline_quiz',
      order: 13,
      pass_threshold: 0.67,
      questions: [
        {
          id: '302a7c42-2a1b-47cb-b3aa-81c9ba66e4d6',
          question: 'A microsporangium and a megasporangium both start with a mother cell undergoing meiosis to give four products. What is the key difference in outcome?',
          options: [
            'Only one megaspore survives meiosis to become functional; all four microspores survive',
            'Only one microspore survives meiosis to become functional; all four megaspores survive',
            'Both structures keep all four products, but only the megaspore’s are haploid',
            'Neither structure loses a product — they differ only in which sporangium forms them',
          ],
          correct_index: 0,
          explanation: 'Microsporogenesis gives four microspores and all four survive to become pollen grains. Megasporogenesis also gives four megaspores by meiosis, but in most flowering plants only one survives (monosporic development) — the other three degenerate. Option 2 is the reversed trap the chapter warns about; the other two invent outcomes NCERT never states.',
          difficulty_level: 2,
        },
        {
          id: '2722ab5f-48c1-4b67-91fd-a4ea0d9b02b8',
          question: 'Which wall layer of the microsporangium nourishes the developing pollen, and how can you tell from its cell structure?',
          options: [
            'The epidermis, whose thick outer cuticle is often said to store pollen’s food',
            'The endothecium — it thickens before dehiscence to feed the pollen sacs',
            'The tapetum — innermost, dense cytoplasm, often multinucleate',
            'The middle layers — they sit closest to the sporogenous tissue',
          ],
          correct_index: 2,
          explanation: 'The tapetum is the innermost of the four wall layers, and its dense cytoplasm plus frequent multinucleate cells are the visible signature of a tissue working hard to feed something — in this case, the developing pollen. The other three layers (epidermis, endothecium, middle layers) are the protective outer layers that help the anther dehisce; none of them has a nutritive role.',
          difficulty_level: 2,
        },
        {
          id: '236351ab-c2f1-440d-bf6c-a0334e33f317',
          question: 'A pollinator carries pollen from one flower to a second flower on the very same mango tree. What is this pollination called, and is the resulting offspring genetically new?',
          options: [
            'Xenogamy — yes, a pollinator was needed to move the pollen',
            'Autogamy — no, the pollen never left its own flower',
            'Hydrophily — depends on which agent carried the pollen',
            'Geitonogamy — no, same plant means genetically self pollen',
          ],
          correct_index: 3,
          explanation: 'Two flowers on one plant, with a pollinator doing the carrying, is geitonogamy — functionally cross-pollination (an agent was required) but genetically identical to self-pollination, since both flowers are the same individual. Xenogamy needs a second plant; autogamy is confined to a single flower; hydrophily just names an agent (water), not this same-plant relationship.',
          difficulty_level: 2,
        },
        {
          id: '480576aa-70c2-4280-bd2a-ca12e99b871a',
          question: 'Trace a compatible pollen tube’s path from the moment it germinates to the moment it releases its gametes. Which sequence is correct?',
          options: [
            'Stigma → ovary → style → micropyle → synergid',
            'Stigma → style → ovary → micropyle → synergid',
            'Micropyle → style → stigma → ovary → synergid',
            'Stigma → style → micropyle → ovary → synergid',
          ],
          correct_index: 1,
          explanation: 'The tube germinates on the stigma, grows down through the style to reach the ovary, enters the ovule through the micropyle (porogamy), and finally pushes into a synergid, where it bursts and releases its two male gametes. Any order that puts the ovary before the style, or the micropyle before the ovary, reverses the real anatomical path.',
          difficulty_level: 3,
        },
        {
          id: '2909b372-36c6-426d-8c07-51a931a7cae8',
          question: 'Endosperm development consistently happens BEFORE embryo development in a fertilised ovule. What does the chapter say this achieves?',
          options: [
            'Guarantees the embryo has food ready the moment it starts to grow',
            'Has no functional purpose — simply a fixed developmental sequence',
            'Requires the endosperm to turn diploid before the embryo turns triploid',
            'Lets the endosperm be fully used up before the embryo is allowed to form',
          ],
          correct_index: 0,
          explanation: 'NCERT frames the delay in the zygote’s division as an adaptation for assured nutrition — the food store is built first, so the embryo never has to grow before its supply exists. Ploidy has nothing to do with the ordering (the endosperm is triploid and the embryo diploid regardless of sequence), and the endosperm is not required to be used up before the embryo starts — in albuminous seeds it persists well past that point.',
          difficulty_level: 2,
        },
        {
          id: '115273a9-36a3-419f-848e-181d4075b189',
          question: 'A seed is described as retaining part of its endosperm all the way to maturity. Which of these is it most likely to be?',
          options: [
            'Pea or groundnut',
            'Wheat, maize, or castor',
            'Any dicot seed, without exception',
            'Any seed that develops via apomixis',
          ],
          correct_index: 1,
          explanation: 'Wheat, maize, barley and castor are the chapter’s standard albuminous (endospermic) examples — they keep part of the endosperm into the mature seed. Pea and groundnut are the non-albuminous counterexample: their embryos consume the endosperm entirely during development. Being a dicot doesn’t decide this (both pea and castor can be dicots depending on species framing used loosely here — the real determinant is whether the endosperm persists, not the plant’s class), and apomixis is a separate phenomenon about fertilisation, not about endosperm persistence.',
          difficulty_level: 2,
        },
        {
          id: '3d490c8e-3dc1-4340-99c6-036d9876a03d',
          question: 'In many Citrus and Mango varieties, a single seed often contains several embryos. Where do the extra embryos come from?',
          options: [
            'Multiple eggs in one sac are each fertilised independently',
            'The zygote splits into several genetically identical embryos, as in twinning',
            'Nucellar cells around the sac divide into embryos of their own',
            'Each of the three antipodal cells develops into its own embryo',
          ],
          correct_index: 2,
          explanation: 'This is nucellar embryony: some diploid nucellar cells surrounding the embryo sac start dividing, push into the sac, and develop into embryos in their own right — no fertilisation involved, and this is the polyembryony seen in Citrus and Mango. There is only ever one egg cell per embryo sac (no multiple independent fertilisations), the zygote does not split like a twinning event, and antipodal cells play no part in forming embryos.',
          difficulty_level: 2,
        },
        {
          id: '86baf915-b0b4-41b6-89bb-8f525dbb0626',
          question: 'Why are plant breeders actively trying to make hybrid crop varieties apomictic?',
          options: [
            'Apomictic seeds cost less, since no pollination step is needed at all',
            'Apomixis makes every seed hold several embryos, more seedlings per seed',
            'Apomictic crops resist pests better than seed-grown hybrids',
            'Hybrid traits pass on unchanged, so saved seed still stays true',
          ],
          correct_index: 3,
          explanation: 'Ordinary hybrid seed segregates when resown — the offspring lose the hybrid’s useful combination of characters, which is why fresh hybrid seed must be bought every season. If the hybrid itself were made apomictic, its seeds would form without fertilisation, so there would be no segregation and the hybrid traits would breed true — letting farmers save and resow their own seed. The other options either invent an unstated cost argument, confuse apomixis with polyembryony, or introduce a pest-resistance claim the chapter never makes.',
          difficulty_level: 3,
        },
      ],
    },
  ],
};
