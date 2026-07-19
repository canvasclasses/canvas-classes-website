'use strict';
/**
 * Class 12 Biology — Chapter 6: Evolution
 * Page 0 — Chapter opener.
 *
 * Source of truth: NCERT Class 12 Ch.6 (lebo106.txt) — the chapter intro
 * paragraph, section 6.1 (Origin of Life), and the section list 6.1–6.9.
 * Rule 0: every fact here traces to that text; nothing invented.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'chapter-6-overview',
  title: 'Evolution',
  subtitle: "Life on this planet has been changing for almost four billion years — from the first non-living molecules to the biodiversity around you today. This chapter is the whole story of that change, and the mechanism Darwin found running underneath it.",
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['evolution', 'natural-selection', 'chapter-overview'],
  glossary: [
    { term: 'evolution', definition: 'The gradual change in life forms on earth over millions of years — old forms going extinct and new forms arising, all descending from shared ancestors.' },
    { term: 'natural selection', definition: 'Darwin\'s mechanism of evolution: individuals better fit for an environment leave more progeny, so nature "selects" their heritable features to become common over generations.' },
    { term: 'adaptation', definition: 'An inherited feature that lets an organism survive better in an otherwise hostile environment. Because it is inherited, it has a genetic basis and can be selected for.' },
    { term: 'biodiversity', definition: 'The full variety of life forms present on earth — the outcome, at any moment, of billions of years of evolution.' },
  ],
  blocks: [
    {
      id: '8c1d5f2a-3e94-4b7a-9f6c-1a2b3c4d5e6f',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A wide dusk landscape reading like deep time — an ancient steaming ocean on one side rising through primeval forest to a starlit sky on the other',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous panorama that reads like a sweep through deep time, left to right, with no hard borders: on the far left a young, steaming primeval ocean under a thick early atmosphere, its surface catching faint volcanic glow; the middle opening into a dense, ancient fern-and-forest wilderness in deep shadow; the far right rising into a clear night sky scattered with distant stars, a single warm point of light low near the horizon tying the whole scene together. Faint, barely-visible silhouettes of life at a distance across the frame — shapes suggesting early sea creatures near the water, large reptilian and mammalian forms among the trees — none of them the focal subject, just quiet presences hinting at life filling every era. Deep dusk lighting, painterly and atmospheric, dark background tones throughout (#0a0a0a base), naturalistic, no text, no labels, no diagram elements.",
    },
    {
      id: '4a7e9b21-6c38-4d5f-8a92-7b1c3e5f9a04',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'When You Look at the Stars, You Look Into the Past',
      markdown: "On a clear night the light reaching your eyes from a distant star started its journey millions of years ago, from trillions of kilometres away. So when you look at stars, you're actually peeping into the past. That's the right frame of mind for this whole chapter. The universe is almost **13.8 billion years old**; our earth formed about **4.5 billion years back**; and life appeared roughly **four billion years ago** — 500 million years after the earth itself formed. Evolution is the story of everything that happened to life across that unimaginable stretch of time.",
    },
    {
      id: 'b2f8c4d1-9a37-4e6b-85c2-3d1f7a9e60b4',
      type: 'text',
      order: 2,
      markdown: "**Evolutionary biology** is the study of the history of life forms on earth. And the single biggest fact about that history is this: life has not stayed the same. The flora and fauna you see today are nothing like what filled the earth millions of years ago. Whole groups of organisms — the dinosaurs, for one — arose, dominated, and then vanished, while entirely new forms appeared in their place. This is **gradual evolution**: life forms slowly changing over long periods, some going extinct as others arise.\n\nMost scientists accept that it all began with **chemical evolution** — diverse organic molecules forming from simple inorganic ones — which came before the first cellular forms of life. From those first slow beginnings grew the enormous **biodiversity** of today. The person who explained *how* this branching, changing story could work was **Charles Darwin**. Watching living forms during his voyage on H.M.S. Beagle, he saw that existing organisms share similarities with each other and with life forms from millions of years ago — evidence they descend from common ancestors — and he named the mechanism driving the change: **natural selection**.",
    },
    {
      id: 'e6a3d709-2b41-4c8f-9e57-6a4b1d3c8f20',
      type: 'text',
      order: 3,
      markdown: "Here's the arc you're about to walk. It opens with the very first question — the **origin of life** itself, and how living molecules could have arisen from non-living ones on the early earth. From there it turns to the **theory of evolution**, how Darwin's idea replaced older explanations. Then comes the courtroom part: the **evidences** that prove evolution really happened — fossils, matching bones, biochemistry. You'll meet **adaptive radiation**, where one ancestor fans out into many species (Darwin's finches are the classic case), and the **mechanism** of how variation and speciation actually work. The **Hardy–Weinberg principle** puts numbers on it, showing what a *non*-evolving population would look like so you can measure change against it. The chapter closes with a **brief account of evolution** across geological time, and finally the story it saves for last — the **origin and evolution of man**.",
    },
    {
      id: '1f9c6e4b-58a2-4d37-b96e-4c2a8f150d73',
      type: 'callout',
      order: 4,
      variant: 'remember',
      title: 'The Nine Sections of This Chapter',
      markdown: "1. **Origin of Life** — the early earth, chemical evolution, and Miller's experiment.\n2. **Evolution of Life Forms — A Theory** — special creation vs Darwin's gradual evolution by natural selection.\n3. **What Are the Evidences for Evolution?** — fossils, homology and analogy, and evolution we can watch happening.\n4. **What Is Adaptive Radiation?** — one ancestral stock branching into many forms in one region.\n5. **Biological Evolution** — natural selection, fitness, and the genetic basis of being selected.\n6. **Mechanism of Evolution** — variation, mutation, and how speciation occurs.\n7. **Hardy–Weinberg Principle** — genetic equilibrium, and the five factors that disturb it.\n8. **A Brief Account of Evolution** — the march of life across geological time.\n9. **Origin and Evolution of Man** — from early primates to modern *Homo sapiens*.",
    },
  ],
};
