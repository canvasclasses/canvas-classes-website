'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-3-overview',
  title: 'Plant Kingdom',
  subtitle: 'From pond scum to hundred-metre kelp and giant redwoods — one climbing story of how plants left the water, grew a plumbing system, and finally wrapped their seeds in fruit.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['plant-kingdom'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dark evolutionary climb from green algae in water, through mosses and ferns, up to a cone-bearing conifer and a flowering tree',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). A single continuous dusk landscape reading left to right as a climb from water onto land: on the far left, green filamentous algae and a Volvox colony drifting in shallow water; rising onto a mossy wet rock with small liverworts and mosses; then a fern unfurling its frond on a shaded bank; then a tall conifer bearing cones; and on the far right a single flowering tree in soft bloom. The ground rises gently from water to dry land across the frame. Deep dusk light, one warm glow on the horizon behind the flowering tree, dark naturalistic background (#0a0a0a base). Painterly, atmospheric, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Explain what the plant kingdom now includes (and why cyanobacteria and fungi were thrown out of it)\n- Describe algae and their three classes by pigment, stored food and cell wall — the way Table 3.1 lays them out\n- Trace the climb onto land: bryophytes → pteridophytes → gymnosperms → angiosperms, and what each group solved\n- Explain gametophyte vs sporophyte, and read which one dominates in each group — a favourite NEET trap\n- Tell homosporous from heterosporous, naked seeds from enclosed seeds, and dicots from monocots",
    },
  ],
};
