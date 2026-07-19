'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-9-overview',
  title: 'Biotechnology: Principles and Processes',
  subtitle: "Curd, bread and wine were biotechnology long before the word existed. This chapter is how we scaled that idea up — cutting, pasting and copying DNA to make organisms build exactly the products we want.",
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['biotechnology-principles-and-processes'],
  glossary: [
    { term: 'biotechnology', definition: 'The use of live organisms, cells, or enzymes from organisms to make products and run processes that are useful to humans.' },
    { term: 'genetic engineering', definition: 'The set of techniques used to alter the chemistry of genetic material (DNA and RNA) and introduce it into a host, changing that host\'s traits.' },
    { term: 'recombinant DNA', definition: 'A new DNA molecule made in the lab by joining pieces of DNA from different sources.' },
    { term: 'bioprocess engineering', definition: 'Keeping a chemical-engineering process free of unwanted microbes so that only the desired cell grows in large amounts, for making products like antibiotics, vaccines and enzymes.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A warm dusk scene layering a bubbling pot of curd and rising bread beside gleaming steel fermentation vessels, life quietly at work throughout',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single continuous dusk scene reading left to right from the humble to the industrial, without hard borders: on the far left an earthen pot of setting curd and a loaf of bread rising in soft warm kitchen light, blending through wooden vats of fermenting wine in the middle, and finally into tall gleaming stainless-steel fermentation vessels and pipework of a modern facility on the far right, softly lit. Faint suggestions of tiny microbes and rising bubbles drift through the whole frame like quiet motes of light, implying invisible living workers at every stage. Deep dusk lighting throughout, a single warm horizon glow tying the humble kitchen and the industrial plant into one story. Painterly illustration style, atmospheric, dark background overall (#0a0a0a base tones), no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact', title: 'You Already Grew Up With Biotechnology',
      markdown: "Setting curd from milk. Letting bread dough rise. Fermenting grapes into wine. Every one of these is a **microbe-mediated process** — a living organism quietly doing chemistry for you. In the broadest sense, that already counts as biotechnology. What changed in the twentieth century is that we stopped just borrowing whatever microbes happened to do, and learned to **redesign** them — so an organism makes exactly the product we ask for, on a factory scale.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "**Biotechnology** deals with techniques of using **live organisms — or enzymes taken from organisms — to make products and processes useful to humans.** By that wide definition, making curd, bread or wine has always been biotechnology. But today the word is used in a more restricted sense: it usually means processes that use **genetically modified organisms** to do the job on a much larger scale. It also stretches to cover things like *in vitro* fertilisation (the 'test-tube' baby), synthesising a gene and putting it to work, building a DNA vaccine, or correcting a defective gene.\n\nThe European Federation of Biotechnology captures both the old and the new in one line — biotechnology is *'the integration of natural science and organisms, cells, parts thereof, and molecular analogues for products and services'*.",
    },
    {
      id: uuid(), type: 'text', order: 3,
      markdown: "Two core techniques gave birth to modern biotechnology. The first is **genetic engineering** — altering the chemistry of genetic material (DNA and RNA) and putting it into a host to change that host's traits. The second is **bioprocess engineering** — keeping the whole growth environment sterile so that only the one microbe or cell you want multiplies, in the large quantities needed to manufacture antibiotics, vaccines and enzymes.\n\nThis chapter builds the subject in three moves. First, the **principles** behind it — why an alien piece of DNA needs an 'origin of replication' to survive in a new host, and the story of the very first recombinant DNA. Next, the **tools of recombinant DNA technology** — the restriction enzymes that cut DNA, the ligases that paste it, the vectors that carry it, and the host cells that copy it. Finally, the **processes** — the actual step-by-step of isolating DNA, cutting it, amplifying a gene by PCR, getting it into a host, and harvesting the product in a bioreactor.",
    },
    {
      id: uuid(), type: 'callout', order: 4, variant: 'remember', title: 'What This Chapter Covers',
      markdown: "- **9.1 Principles of Biotechnology** — the two core techniques (genetic engineering + bioprocess engineering), why alien DNA must join an origin of replication to multiply, and the first artificial recombinant DNA made by Cohen and Boyer.\n- **9.2 Tools of Recombinant DNA Technology** — restriction enzymes ('molecular scissors'), gel electrophoresis, cloning vectors and their features, and the competent host that takes up the DNA.\n- **9.3 Processes of Recombinant DNA Technology** — isolating and cutting DNA, amplifying the gene of interest by PCR, inserting recombinant DNA into the host, obtaining the gene product, and downstream processing in a bioreactor.",
    },
  ],
};
