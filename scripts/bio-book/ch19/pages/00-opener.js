'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-19-overview',
  title: 'Chemical Coordination and Integration',
  subtitle: 'Nerves are fast but reach only where they wire. Hormones are the body\'s slower, broadcast messengers — trace chemicals in the blood that reach every cell. Meet the glands that make them and the jobs each hormone does.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['chemical-coordination-and-integration'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, glowing human silhouette with faint points of light where the endocrine glands sit, messages spreading through the blood',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). An atmospheric impression of the endocrine system in a dark void — the faint outline of a human figure with soft points of warm light glowing where the major glands sit (head, neck, chest, abdomen), and a faint suggestion of chemical messengers spreading outward through the bloodstream, without becoming a literal labelled diagram. The image conveys chemical signals broadcast quietly through the whole body. Deep, atmospheric lighting, dark naturalistic background throughout (#0a0a0a base tones), soft golden points of glow. Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Understand what makes a gland endocrine (ductless) and what a hormone is, and how the hypothalamus commands the pituitary\n- Know the pituitary's hormones (GH, TSH, ACTH, LH, FSH, PRL, MSH, oxytocin, vasopressin) and the disorders of over/under-secretion\n- Map the pineal, thyroid (T3/T4, goitre/cretinism), parathyroid (PTH, calcium), thymus, and adrenal (fight-or-flight + the corticoids) glands\n- Follow blood-sugar control by the pancreas (insulin vs glucagon, diabetes mellitus) and the gonadal hormones (androgens, estrogen, progesterone)\n- Know the hormones from the heart (ANF), kidney (erythropoietin) and gut, and how hormones act via membrane-bound vs intracellular receptors",
    },
  ],
};
