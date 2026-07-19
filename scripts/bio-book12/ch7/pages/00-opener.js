'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'chapter-7-overview',
  title: 'Human Health and Disease',
  subtitle: "Health isn't just 'not being sick' — it's your body winning a fight it fights every single day. This chapter is the whole battle: the organisms that attack you, the defence system that stops most of them, and the diseases and habits that break through.",
  page_number: 0,
  page_type: 'chapter_opener',
  tags: ['human-health-and-disease'],
  glossary: [
    { term: 'health', definition: 'A state of complete physical, mental and social well-being — not simply the absence of disease or physical fitness.' },
    { term: 'pathogen', definition: 'A disease-causing organism — a bacterium, virus, fungus, protozoan or worm — that enters a host, multiplies, and interferes with the body’s normal working.' },
    { term: 'immunity', definition: 'The overall ability of the body to fight off disease-causing organisms, provided by the immune system.' },
    { term: 'disease', definition: 'A condition in which the functioning of one or more organs or body systems is adversely affected, shown by various signs and symptoms.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '', alt: 'A dusk scene of a single human figure standing calm at the centre of a dark landscape, faint threats circling at the edges held back by a soft ring of warm light',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single human figure stands calmly at the centre of a wide, dark dusk landscape, seen from a respectful distance in silhouette. Around the far edges of the frame, faint and out of focus, drift suggestions of unseen threats — a soft haze of tiny drifting motes, a distant swarm-like blur, thin wisps of shadow creeping inward from the corners — none of them clearly an insect or a germ, just a quiet sense of things pressing in from the dark. Encircling the standing figure is a soft, warm ring of light on the ground, like a boundary the surrounding shadows do not cross, suggesting a body quietly defending itself. Deep dusk lighting, painterly atmospheric illustration style, dark background tones throughout (#0a0a0a base), no text, no labels, no diagram elements, no visible faces.",
    },
    {
      id: uuid(), type: 'text', order: 1,
      markdown: "Ask most people what 'healthy' means and they'll say 'not sick.' That's only half of it. For a long time, people believed health was a balance of body 'humors' — the early Greeks like Hippocrates and the Indian Ayurveda system both taught this, and it was thought that a person with 'black bile' ran hot and caught fevers. That idea came from pure reflective thought, not experiment. It fell apart when **William Harvey** worked out how blood actually circulates, and when a simple thermometer showed that a 'black-bile' person had a perfectly normal body temperature. Later, biology went further: your mind talks to your **immune system** through the nervous and hormonal systems, and that immune system is what keeps you well — so even your mental state can shape your health.\n\nSo here is the fuller definition. **Health** is a state of complete physical, mental and social well-being — not just the absence of disease or being physically fit. When people are healthy they work better, live longer, and fewer mothers and infants die. Three things decide it: **genetic disorders** you are born with or inherit, **infections**, and your **lifestyle** — the food and water you take in, the rest and exercise you give your body, and the habits you keep or avoid.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "When one or more organs or systems stops working properly and you start showing signs and symptoms, we say you have a **disease**. Diseases fall into two broad camps. **Infectious diseases** pass easily from one person to another — they are extremely common, everyone gets them at some point, and a few, like AIDS, are fatal. **Non-infectious diseases** don't spread between people; among these, **cancer** is the biggest killer. On top of both, the abuse of drugs and alcohol quietly damages health from the inside.\n\nThis chapter walks that whole battlefield, in order. You'll learn:\n\n- **7.1 Common Diseases in Humans** — the bacteria, viruses, fungi, protozoans and worms (the **pathogens**) behind typhoid, pneumonia, the common cold, malaria, amoebiasis, ascariasis, filariasis and ringworm, and how to keep them out\n- **7.2 Immunity** — how your body defends itself, from the barriers you're born with (innate immunity) to the memory-based defence you build up (acquired immunity), plus antibodies, vaccination and allergies\n- **7.3 AIDS** — how the HIV virus disarms the very immune system you just learned about\n- **7.4 Cancer** — what happens when the body's own cells stop obeying the rules of controlled growth\n- **7.5 Drugs and Alcohol Abuse** — why these habits take hold, especially in adolescence, and what they do to the body",
    },
    {
      id: uuid(), type: 'callout', order: 3, variant: 'remember', title: 'The Five Stops on This Chapter',
      markdown: "Keep the running order in your head — NEET leans hard on Class 12 biology, and this chapter is one of its favourites:\n\n1. **Common Diseases in Humans** — pathogens and the diseases they cause\n2. **Immunity** — innate and acquired defence\n3. **AIDS** — the HIV retrovirus\n4. **Cancer** — cells that lost control\n5. **Drugs and Alcohol Abuse** — addiction, dependence and prevention\n\nDiseases and defence, then two dangerous diseases (AIDS and cancer), then the habits that harm us — that's the arc.",
    },
  ],
};
