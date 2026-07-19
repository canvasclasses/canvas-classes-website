'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-4-overview',
  title: 'Animal Kingdom',
  subtitle: 'One kingdom, eleven body plans — a handful of yes/no questions about symmetry, coelom, and segmentation sorts every animal on Earth, from a sponge to a blue whale.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['animal-kingdom'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dark evolutionary progression of animal body plans from a simple sponge through a jellyfish, worm, insect, fish, and bird to a mammal',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). A single continuous dusk scene reading left to right as rising complexity of animal body plans: on the far left, a simple vase-shaped sponge on a rock underwater; then a translucent jellyfish drifting just above it; then a segmented worm curled on wet sand; then a beetle-like insect with jointed legs on a leaf; then a silver fish mid-swim; then a bird in flight; and on the far right, a deer standing tall on open ground at dusk. Each creature a quiet silhouette lit by its own soft pool of light, none more important than the others, connected by one continuous dark naturalistic landscape from water to land to air. Deep dusk lighting, one warm horizon glow tying the scene together, dark background throughout (#0a0a0a base tones). Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Learn the six fundamental features — organisation level, symmetry, germ layers, coelom, segmentation, notochord — that biologists use to sort animals, before ever naming a single species\n- Walk through all eleven animal phyla in NCERT's own order, from Porifera to Chordata, with the one or two facts NEET actually asks about each\n- See how the vertebrates split further into Agnatha and Gnathostomata, then Pisces and Tetrapoda, then the six familiar classes\n- Build the comparison habit NEET rewards most: coelomate vs pseudocoelomate vs acoelomate, chordate vs non-chordate, poikilotherm vs homoiotherm\n- Finish able to place an unfamiliar animal into its phylum from a two-line description — exactly what NEET's assertion-reason questions test",
    },
  ],
};
