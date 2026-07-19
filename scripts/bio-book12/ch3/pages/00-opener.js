'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-3-overview',
  title: 'Reproductive Health',
  subtitle: "Having a healthy body is only half of it. This chapter is about the other half — the awareness, the choices, and the care that let a society reproduce safely and by its own decision.",
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['reproductive-health'],
  glossary: [
    { term: 'reproductive health', definition: 'A total well-being in all aspects of reproduction — physical, emotional, behavioural and social — as defined by the World Health Organisation (WHO).' },
    { term: 'RCH', definition: "Reproductive and Child Health Care programmes — the government's current, wider version of the old 'family planning' programmes, working to build a reproductively healthy society." },
    { term: 'contraception', definition: 'The deliberate use of natural methods, barriers, devices, pills or surgery to prevent, delay or space a pregnancy.' },
    { term: 'ART', definition: 'Assisted reproductive technologies — special techniques such as the test-tube baby programme that help infertile couples have children.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A warm dusk community-health scene: a health worker seated with a small group of people under lamplight outside a village clinic',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A warm, dignified dusk scene outside a small rural community health centre in India: the soft glow of a hanging lamp spilling over a low veranda where a health worker sits and quietly talks with a small semicircle of people — a young couple, an older woman, a few adolescents — all shown as gentle silhouettes and warm-lit forms, none of them the sharp focal subject. Behind them the simple clinic building and a few trees fade into deep dusk. The whole frame reads as care, counselling and belonging rather than clinical detail. A single warm amber light source tying the composition together, deep naturalistic dark background tones throughout (#0a0a0a base), painterly atmospheric illustration style, no text, no labels, no diagram elements, nothing explicit — tasteful and respectful.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "You already know how the human reproductive system is built and how it works. This chapter asks a bigger question: what does it take for a whole society to be *reproductively healthy*?\n\nThe answer is wider than most people expect. **Reproductive health** doesn't just mean reproductive organs that are physically normal and working. According to the **World Health Organisation (WHO)**, it means a **total well-being in all aspects of reproduction — physical, emotional, behavioural and social**. So a reproductively healthy society is one where people not only have functionally normal organs, but also normal, respectful emotional and behavioural interactions in every sex-related matter. India, in fact, was **among the first countries in the world** to take this on as a national goal — the old 'family planning' programmes of 1951 have since grown into today's wider **Reproductive and Child Health Care (RCH) programmes**.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "From that one idea, this chapter opens into five connected topics. It starts with the **problems and the strategies** — the awareness, the sex education, the medical support and the legal checks (like the ban on sex-determination) that a healthy society needs. It then looks at why our **population** grew explosively and the **birth-control** methods used to stabilise it. Next comes **medical termination of pregnancy (MTP)** — what it is and the strict conditions under which the law allows it. Then **sexually transmitted infections (STIs)** — what they are and the simple habits that keep you free of them. And finally **infertility** — why a couple may be unable to have children, and the assisted reproductive technologies that can help them.",
    },
    {
      id: uuid(), type: 'callout', order: 3, variant: 'remember', title: 'The Five Sections Ahead',
      markdown: "1. **Reproductive Health — Problems & Strategies:** awareness, sex education, the RCH programmes and legal safeguards.\n2. **Population Stabilisation & Birth Control:** why the population exploded, and the full range of contraceptive methods.\n3. **Medical Termination of Pregnancy (MTP):** what induced abortion is, and the strict legal conditions around it.\n4. **Sexually Transmitted Infections (STIs):** the common infections, their risks, and how to stay free of them.\n5. **Infertility:** the many reasons couples stay childless, and the assisted reproductive technologies (ART) that can help.",
    },
  ],
};
