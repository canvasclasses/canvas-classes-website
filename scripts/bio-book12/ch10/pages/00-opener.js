'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-10-overview',
  title: 'Biotechnology and Its Applications',
  subtitle: "You already know how to cut, join and clone a gene. This chapter is what all of that is FOR — cheaper insulin, pest-proof cotton, vitamin-rich rice, catching a disease before it shows, and the hard questions that come with owning life.",
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['biotechnology-and-its-applications'],
  glossary: [
    { term: 'GMO', definition: 'Genetically Modified Organism — a plant, bacterium, fungus or animal whose genes have been altered by manipulation rather than by natural breeding.' },
    { term: 'transgenic', definition: 'An organism that has had its DNA manipulated to possess and express an extra, foreign gene from another source.' },
    { term: 'gene therapy', definition: 'A set of methods that corrects a diagnosed gene defect by inserting a normal, functional gene into a person’s cells and tissues to take over from the faulty one.' },
    { term: 'biopiracy', definition: 'The use of a country’s bio-resources and traditional knowledge by companies or organisations without proper authorisation and without paying compensation to the people concerned.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dusk landscape where a wide farmed field on one side meets the soft warm glow of a laboratory and a hospital on the other, joined under one horizon',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk landscape read from left to right without hard borders: on the far left a wide, healthy farmed field of crops stretching to the horizon under a deep evening sky; the field gradually giving way, toward the centre, to the faint silhouette of a low research building whose windows glow with a soft warm amber light; and on the right that same warm light spilling from the tall windows of a quiet hospital ward, suggesting healing. A single warm horizon glow ties the farm, the lab and the hospital together as one connected scene, as if the same quiet science feeds all three. No people in focus, no text, no labels, no diagram elements. Deep dusk lighting, painterly atmospheric illustration style, dark background tones throughout (#0a0a0a base).",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "In the last chapter you learnt the tools — how to cut DNA, join it, put it into a plasmid, and grow it up. On its own that is just technique. **Biotechnology** is what happens when you point those tools at real problems and run them at industrial scale: making **biopharmaceuticals and biologicals** using genetically modified microbes, fungi, plants and animals. Its uses reach across therapeutics, diagnostics, genetically modified crops for agriculture, processed food, cleaning up pollution (bioremediation), waste treatment, and even energy production.\n\nThink of what that has already delivered. A diabetic patient who once depended on insulin scraped from slaughtered cattle and pigs — and sometimes reacted badly to it — can now use **human insulin made by bacteria**, identical to the molecule the human body makes. Cotton that fights off bollworms **without a single spray of insecticide**. Rice engineered to carry **Vitamin A** for children who don't get enough of it. A test that can spot **HIV or a cancer mutation** in the blood long before any symptom appears. This chapter is the payoff — biotechnology aimed squarely at food and health.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The chapter walks that payoff in four moves, in order. You'll learn:\n\n- **10.1 Biotechnological Applications in Agriculture** — how tissue culture and somatic hybridisation multiply plants, and how **Genetically Modified Organisms (GMOs)** like **Bt cotton** and pest-resistant plants raise yield while cutting the chemicals sprayed on our food\n- **10.2 Biotechnological Applications in Medicine** — mass-producing safe **recombinant therapeutics**: genetically engineered human insulin, **gene therapy** for an inherited enzyme defect, and molecular diagnosis using **PCR and ELISA** to catch disease early\n- **10.3 Transgenic Animals** — animals carrying an extra foreign gene, and the five reasons we make them: studying normal physiology, modelling human disease, producing useful biological products, testing vaccine safety, and chemical safety testing\n- **10.4 Ethical Issues** — why altering living organisms needs regulation (like India's **GEAC**), and the story of Basmati rice and **biopiracy**\n\nEach section answers the same quiet question in a different field: now that we can rewrite the instructions inside a living thing, what should we actually do with that power?",
    },
    {
      id: uuid(), type: 'callout', order: 3, variant: 'remember', title: 'The Four Stops on This Chapter',
      markdown: "Keep the running order in your head — Class 12 is the most heavily examined half of NEET biology, and this chapter is a favourite:\n\n1. **Applications in Agriculture** — tissue culture, GM crops, Bt cotton, pest-resistant plants\n2. **Applications in Medicine** — recombinant human insulin, gene therapy, molecular diagnosis (PCR, ELISA)\n3. **Transgenic Animals** — one extra gene, five clear reasons to add it\n4. **Ethical Issues** — regulation (GEAC), patents, and biopiracy\n\nFood first, then health, then the animals engineered to help both, then the hard questions the whole thing raises — that's the arc.",
    },
  ],
};
