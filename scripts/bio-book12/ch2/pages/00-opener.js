'use strict';
/**
 * Class 12 Biology — Chapter 2: Human Reproduction
 * Page 0 — Chapter opener.
 *
 * Source of truth: NCERT Class 12 Ch.2 (lebo102.txt) — the chapter intro
 * paragraph and the section list 2.1–2.7. Rule 0: every fact here traces to
 * that text; nothing invented. No inline_quiz (openers aren't lessons).
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

module.exports = {
  slug: 'chapter-2-overview',
  title: 'Human Reproduction',
  subtitle: "Every one of us started as a single fertilised cell. This chapter is the full human story — the two body systems, the making of sperm and egg, the monthly cycle, the meeting that becomes a zygote, nine months of growth, and finally birth and the first feed.",
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['human-reproduction', 'chapter-overview'],
  glossary: [
    { term: 'gonad', definition: 'A primary sex organ that makes the gametes — the testis in males (makes sperm) and the ovary in females (makes ovum).' },
    { term: 'gamete', definition: 'A sex cell — the sperm in males and the ovum (egg) in females. Two gametes fuse to start a new individual.' },
    { term: 'fertilisation', definition: 'The fusion of a sperm with an ovum. It produces a single cell called the zygote, from which the whole baby develops.' },
    { term: 'zygote', definition: 'The single cell formed the moment a sperm and an ovum fuse. It divides again and again to build the embryo.' },
  ],
  blocks: [
    {
      id: 'b7e3f1a2-9c48-4d6b-8a1f-2e7c5d0b93a4',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A soft dawn scene with warm light rising over a quiet landscape, suggesting the beginning of new life',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A quiet, tender dawn landscape — a low warm sun just breaking the horizon over a still, misty valley, the first light of a new day spreading gently across the frame. The whole mood is one of a beginning: soft warm amber and rose light at the horizon fading up into deep dusky blue at the top. No people, no anatomy, no diagrams — purely an atmospheric painterly scene of daybreak that suggests new life quietly starting. Deep, dark naturalistic background tones overall (#0a0a0a base), painterly and cinematic, no text, no labels, no diagram elements.",
    },
    {
      id: 'c1d8a460-3e72-4f19-9b5c-6a2f8d1e40b7',
      type: 'callout',
      order: 1,
      variant: 'fun_fact',
      title: 'You Began As One Cell',
      markdown: "Every person you have ever met began life the same way — as a single cell, smaller than a full stop, formed when one sperm fused with one egg. From that one cell came all the trillions of cells that make up a whole human being. Humans reproduce **sexually** and are **viviparous** — the young develop inside the mother's body and are born live, not hatched from an egg laid outside. This chapter is the complete account of how that single cell comes to exist, and what happens over the nine months that follow.",
    },
    {
      id: '4a9e2c7d-1b56-48f3-a9c0-7d3e6b1f8250',
      type: 'text',
      order: 2,
      markdown: "Why give a whole chapter to this? Because the making of a new human is one long, carefully timed chain of events, and each link depends on the one before it. NCERT lays the chain out plainly. First, the body has to build the sex cells — **sperms in males and ovum in females** — by a process called **gametogenesis**. Then the sperms have to be delivered into the female tract; this transfer is called **insemination**. Inside the tract, a sperm and the ovum fuse — **fertilisation** — and that fusion produces the **zygote**, the first cell of the new individual.\n\nThe zygote doesn't stay a single cell. It divides to form a ball of cells called a **blastocyst**, which then attaches to the wall of the uterus — a step called **implantation**. From there the embryo grows for months (**gestation**), and finally the baby is delivered (**parturition**). Every one of these events happens only **after puberty** — the body simply isn't set up for them before then.",
    },
    {
      id: 'e6f0b3a1-8d24-4c97-b1e5-9a4c2f7d6830',
      type: 'text',
      order: 3,
      markdown: "Here is the arc you're about to walk, in the order the chapter takes it. You'll start with the plumbing itself — the **male reproductive system** and then the **female reproductive system**, the organs that make and carry the gametes. Next comes **gametogenesis**, the actual making of sperm and ovum, where you'll see how a diploid parent cell is halved down to a haploid gamete. Then the **menstrual cycle**, the roughly monthly rhythm that readies one egg and prepares the uterus to receive it.\n\nAfter that the two gametes meet: **fertilisation and implantation**, where the zygote forms and settles into the uterine wall. Then **pregnancy and embryonic development**, the months of growth in which the placenta forms and organ after organ takes shape. And finally **parturition and lactation** — the birth of the baby and the mother's first milk. One important difference to carry with you from the start: in males, sperm formation continues even into old age, but in females the formation of ovum stops around the age of fifty.",
    },
    {
      id: '2f7c9d10-5a83-4e6b-8f21-3c6d0a9b74e5',
      type: 'callout',
      order: 4,
      variant: 'remember',
      title: 'The Seven Stops in This Chapter',
      markdown: "1. **The Male Reproductive System:** the testes, the accessory ducts and glands, and the external genitalia.\n2. **The Female Reproductive System:** the ovaries, oviducts, uterus, vagina, external genitalia, and the mammary glands.\n3. **Gametogenesis:** how sperms are made (spermatogenesis) and how the ovum is made (oogenesis).\n4. **Menstrual Cycle:** the roughly 28-day cycle of the female primates, from menarche to menopause.\n5. **Fertilisation and Implantation:** sperm meets ovum in the fallopian tube, the zygote forms, and the blastocyst embeds in the uterus.\n6. **Pregnancy and Embryonic Development:** the placenta, and how the foetus grows month by month across nine months.\n7. **Parturition and Lactation:** the birth of the baby, and the milk that feeds the newborn.",
    },
  ],
};
