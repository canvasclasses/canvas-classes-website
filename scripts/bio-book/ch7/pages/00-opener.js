'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-7-overview',
  title: 'Structural Organisation in Animals',
  subtitle: 'One frog, every organ system — the complete case study NCERT uses to show how cells build tissues, tissues build organs, and organs build a working animal.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['structural-organisation-in-animals'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dark illustration of a frog on a wet leaf at dusk with a faint internal glow suggesting its organs beneath the skin',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). A single frog sits on a wet, moonlit leaf at the edge of still water at dusk, its smooth olive-green skin catching a faint warm light. Beneath the skin, suggested only as a soft internal glow through the body outline, is a hint of organs at work — never literal, just a quiet warmth radiating from within the frog's trunk. Around it, out-of-focus reeds and water droplets. Deep dusk lighting, one gentle warm glow low on the horizon reflected in the water, dark naturalistic background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Understand how cells build tissues, tissues build organs, and organs build organ systems — using the frog as one complete worked example\n- Know the frog's external morphology cold: skin, nictitating membrane, tympanum, limb differences, and the male-vs-female tells\n- Trace food through the frog's digestive system, and air through its two respiration modes — cutaneous in water, pulmonary on land\n- Read the frog's three-chambered heart and its two special portal circulations, plus its excretory and nervous systems\n- Follow reproduction end to end: paired testes/ovaries, external fertilisation, and the tadpole-to-frog metamorphosis",
    },
  ],
};
