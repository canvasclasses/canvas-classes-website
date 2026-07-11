'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-2-overview',
  title: 'Biological Classification',
  subtitle: "Two kingdoms weren't enough to hold the living world. Meet Whittaker's five — and the odd guests (viruses, viroids, lichens) that fit in none of them.",
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['biological-classification'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A single dark scene layered from bacteria and pond microbes up to mushrooms, a fern and a deer, each in its own band of light',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). A single continuous vertical composition at dusk, divided into soft horizontal bands of life from smallest at the bottom to largest at the top: a band of tiny rod- and spiral-shaped bacteria glowing faintly, above it a band of single-celled pond microbes (a diatom, an amoeba, a paramecium in silhouette), above that a cluster of mushrooms and mould on a dark log, then a fern and mossy forest floor, and at the very top a deer silhouette against a faint warm horizon. Each band lit by its own quiet pool of light, all sharing one dark naturalistic background (#0a0a0a base). Painterly, atmospheric, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Explain why the old two-kingdom (plants vs animals) system broke down, and what five features Whittaker used instead\n- Name the five kingdoms — Monera, Protista, Fungi, Plantae, Animalia — and place any organism in the right one\n- Describe the key organisms of Monera (bacteria, cyanobacteria, mycoplasma), Protista (the five protist groups) and Fungi (the four classes)\n- Compare the four classes of Fungi and the four groups of Protozoa the way NEET asks you to\n- Explain what viruses, viroids, prions and lichens are — and why none of them sits neatly in the five kingdoms",
    },
  ],
};
