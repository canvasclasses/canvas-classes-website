'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-18-overview',
  title: 'Neural Control and Coordination',
  subtitle: 'Your body runs on electricity carried by living wires. This is how a neuron fires, how one neuron passes its message to the next across a synapse, and how the brain — the command centre — is built.',
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['neural-control-and-coordination'],
  glossary: [],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A dark, glowing network of neurons with a faint spark of an impulse travelling along an axon',
      caption: '', width: 'full', aspect_ratio: '21:9',
      generation_prompt: "Ultra-wide cinematic banner (21:9 ratio). An atmospheric impression of a network of neurons glowing in a dark void — branching dendrites and long axons suggested as delicate luminous threads, with a faint spark of an electrical impulse travelling along one of them, without becoming a literal labelled diagram. The image conveys thought and signalling moving through living tissue. Deep, atmospheric lighting, dark naturalistic background throughout (#0a0a0a base tones), one cool blue-white glow. Painterly, atmospheric illustration style, no text, no labels, no diagram elements.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "- Divide the human neural system into CNS and PNS, and the PNS into somatic and autonomic (sympathetic vs parasympathetic)\n- Read the structure of a neuron — cell body, dendrites, axon, myelin sheath and nodes of Ranvier — and the three types by shape\n- Understand the resting potential and how a stimulus generates and conducts an action potential along an axon (the sodium-potassium pump, Na⁺ influx, depolarisation)\n- Explain how an impulse crosses a synapse — electrical vs chemical synapses and the role of neurotransmitters\n- Map the human brain — forebrain (cerebrum, thalamus, hypothalamus, limbic system), midbrain, and hindbrain (pons, cerebellum, medulla)",
    },
  ],
};
