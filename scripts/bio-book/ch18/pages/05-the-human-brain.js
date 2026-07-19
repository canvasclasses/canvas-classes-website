'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'the-human-brain',
  title: 'The Human Brain',
  subtitle: "Every message you've traced this whole chapter — from a stimulus, up a nerve, across a synapse — ends up here: the brain, the command and control system. Learn its three parts and exactly what each one runs, the way NEET asks it.",
  page_number: 5,
  page_type: 'lesson',
  tags: ['neural-control-and-coordination', 'brain'],
  glossary: [
    { term: 'cranial meninges', definition: 'The three protective membranes covering the brain inside the skull — from outside in: dura mater, arachnoid, and pia mater.' },
    { term: 'cerebrum', definition: 'The major part of the human brain, divided by a deep cleft into left and right cerebral hemispheres and responsible for the higher functions like memory and communication.' },
    { term: 'corpus callosum', definition: 'A tract of nerve fibres that connects the two cerebral hemispheres to each other.' },
    { term: 'cerebral cortex', definition: 'The folded outer layer of cells covering the cerebral hemisphere; called grey matter because neuron cell bodies concentrated here give it a greyish colour.' },
    { term: 'thalamus', definition: 'The structure the cerebrum wraps around; a major coordinating centre for sensory and motor signalling.' },
    { term: 'hypothalamus', definition: 'The part lying at the base of the thalamus that controls body temperature and the urge for eating and drinking, and contains neurosecretory cells that secrete hypothalamic hormones.' },
    { term: 'limbic system', definition: 'The inner parts of the cerebral hemispheres together with deep structures like the amygdala and hippocampus; with the hypothalamus it regulates sexual behaviour, emotions and motivation.' },
    { term: 'brain stem', definition: 'The midbrain, pons and medulla oblongata taken together; it forms the connection between the brain and the spinal cord.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A softly glowing human brain suspended in darkness, protected by a faint impression of the surrounding skull',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single human brain, seen from the side, floats gently in near-darkness, softly lit from one side so its folds and its three major regions read as quiet ridges of light and shadow. A faint, translucent impression of the surrounding skull is suggested around it like a protective shell, without becoming a literal labelled diagram. Warm amber highlights trace the surface; the rest of the frame falls into deep shadow. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no people.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'One Organ Runs Almost Everything At Once',
      markdown: "Right now, without you deciding any of it, one organ is keeping your lungs breathing, your heart beating, your body temperature steady, and your circadian clock ticking — while *also* letting you read these words, remember them, and feel something about them. That single organ is the **brain**, the body's **command and control system**. Everything else in this chapter — the nerve, the impulse, the synapse — was just the wiring that carries messages to and from it.",
    },
    // ── 2 · Core concept — brain as command centre + meninges ─────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "The **brain** is the **central information processing organ** of the body. NCERT gives it a memorable job title: the **'command and control system'**. Look at the size of its job list. It controls **voluntary movements** and the **balance of the body**; it runs the **vital involuntary organs** (lungs, heart, kidneys, and the like); it handles **thermoregulation**, **hunger and thirst**, and the body's **circadian (24-hour) rhythms**; it directs the activities of several **endocrine glands** and shapes **human behaviour**. On top of all that, it is the site where **vision, hearing, speech, memory, intelligence, emotions and thoughts** are processed.\n\nAn organ that important needs armour. The brain is well protected by the **skull**, and inside the skull it is wrapped in three membranes together called the **cranial meninges**. From outside going in, they are: an outer layer, the **dura mater**; a very thin middle layer, the **arachnoid**; and an inner layer that actually touches the brain tissue, the **pia mater**. The whole brain is then divided into three major parts — **forebrain, midbrain and hindbrain**.",
    },
    // ── 3 · Heading — the forebrain ───────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'The Forebrain',
      objective: "By the end of this you can list the three parts of the forebrain and say which one controls body temperature and hunger, which coordinates sensory and motor signals, and what joins the two cerebral hemispheres.",
    },
    // ── 4 · Text — forebrain: cerebrum, thalamus, hypothalamus ────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "The **forebrain** is made of three parts: the **cerebrum**, the **thalamus** and the **hypothalamus**.\n\nThe **cerebrum** forms the **major part** of the human brain. A **deep cleft** divides it lengthwise into two halves — the **left and right cerebral hemispheres** — and those two hemispheres are joined by a tract of nerve fibres called the **corpus callosum**. The layer of cells covering each hemisphere is the **cerebral cortex**, thrown into prominent folds. Because neuron **cell bodies** are packed into this layer, it looks greyish, so the cortex is called the **grey matter**. The cortex holds **motor areas**, **sensory areas**, and large regions that are neither clearly sensory nor motor — the **association areas**, which handle complex work like **intersensory associations, memory and communication**. Below the cortex, the fibre tracts are wrapped in **myelin sheath**, giving an opaque white appearance — this inner region is the **white matter**.\n\nThe cerebrum wraps around the **thalamus**, a **major coordinating centre for sensory and motor signalling**. At the **base of the thalamus** sits the **hypothalamus**. It contains centres that control **body temperature** and the **urge for eating and drinking**, and it also has groups of **neurosecretory cells** that secrete **hypothalamic hormones**. Finally, the inner parts of the cerebral hemispheres plus deep structures like the **amygdala** and **hippocampus** form the **limbic system** — which, working with the hypothalamus, regulates **sexual behaviour, emotions** (excitement, pleasure, rage, fear) and **motivation**.",
    },
    // ── 5 · Interactive image — sagittal section of the brain ─────────────
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'Labelled sagittal (side) section of the human brain showing cerebrum, corpus callosum, thalamus, hypothalamus, midbrain, pons, cerebellum and medulla oblongata',
      caption: '📸 Tap each dot to explore the parts of the human brain, from the forebrain down to where it meets the spinal cord.',
      generation_prompt: "Scientific textbook illustration of a sagittal (mid-line side) section of the human brain, matching NCERT Class 11 Figure 18.4. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, no labels or text (labels are added by the app as interactive hotspots). Show the large folded cerebrum forming the top and front, the thin band of the corpus callosum arching beneath it connecting the hemispheres, the central thalamus, the hypothalamus at the base of the thalamus, the small midbrain below, the rounded pons, the deeply convoluted cerebellum at the back, and the medulla oblongata tapering downward toward the spinal cord. Soft functional tints: pink/magenta for the nervous soft tissue, subtle tonal variation to separate the folded cerebral cortex from the inner regions. No photorealism, no cartoon, no mascots, no people.",
      hotspots: [
        { id: uuid(), x: 0.34, y: 0.16, label: 'Cerebral cortex (grey matter)', detail: 'The folded outer layer of the cerebrum. Neuron **cell bodies** concentrated here give it a greyish colour, so it is called **grey matter**. It contains motor areas, sensory areas and the **association areas** for memory and communication.', icon: 'circle' },
        { id: uuid(), x: 0.40, y: 0.42, label: 'Corpus callosum', detail: 'A tract of nerve fibres that **connects the left and right cerebral hemispheres** — the deep cleft splits the cerebrum into two halves, and this band joins them.', icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.47, label: 'Thalamus', detail: 'The cerebrum wraps around it. It is a **major coordinating centre for sensory and motor signalling**.', icon: 'circle' },
        { id: uuid(), x: 0.47, y: 0.62, label: 'Hypothalamus', detail: 'Lies at the **base of the thalamus**. Controls **body temperature** and the **urge for eating and drinking**, and holds **neurosecretory cells** that secrete **hypothalamic hormones**.', icon: 'circle' },
        { id: uuid(), x: 0.60, y: 0.58, label: 'Midbrain (corpora quadrigemina)', detail: 'Sits between the thalamus/hypothalamus and the pons. A **cerebral aqueduct** runs through it, and its dorsal portion carries four round swellings called the **corpora quadrigemina**.', icon: 'circle' },
        { id: uuid(), x: 0.63, y: 0.72, label: 'Pons', detail: 'Part of the hindbrain. Made of **fibre tracts that interconnect different regions of the brain**.', icon: 'circle' },
        { id: uuid(), x: 0.80, y: 0.68, label: 'Cerebellum', detail: 'Part of the hindbrain, at the back. Its **very convoluted surface** provides extra space to pack in many more neurons.', icon: 'circle' },
        { id: uuid(), x: 0.62, y: 0.86, label: 'Medulla oblongata', detail: 'The lowest part, **connected to the spinal cord**. Its centres control **respiration, cardiovascular reflexes and gastric secretions**.', icon: 'circle' },
      ],
    },
    // ── 6 · Heading — midbrain & hindbrain ────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'The Midbrain and Hindbrain',
      objective: "By the end of this you can place the midbrain and name its four swellings, list the three parts of the hindbrain, say which one controls respiration, and define the brain stem.",
    },
    // ── 7 · Text — midbrain and hindbrain ─────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The **midbrain** sits **between** the thalamus/hypothalamus of the forebrain and the **pons** of the hindbrain. A canal called the **cerebral aqueduct** passes through it. On its **dorsal (back) portion** are **four round swellings** — the **corpora quadrigemina**.\n\nThe **hindbrain** has three parts: the **pons**, the **cerebellum** and the **medulla** (also called the **medulla oblongata**). The **pons** is made of **fibre tracts** that interconnect different regions of the brain. The **cerebellum** has a **very convoluted surface** — all those folds create extra room to pack in many more neurons. The **medulla** is **connected to the spinal cord** and contains the centres that control **respiration, cardiovascular reflexes and gastric secretions**.\n\nThere is one grouping worth memorising as a unit. Three regions — the **midbrain, pons and medulla oblongata** — together make up the **brain stem**, which forms the connection between the brain and the spinal cord.",
    },
    // ── 8 · Table — the three brain regions ───────────────────────────────
    {
      id: uuid(), type: 'table', order: 8,
      caption: 'The three major parts of the brain — their sub-parts and key functions (NCERT §18.4)',
      headers: ['Region', 'Parts it contains', 'Key functions'],
      rows: [
        ['Forebrain', 'Cerebrum, thalamus, hypothalamus', 'Cerebrum → memory, communication, motor & sensory areas; thalamus → coordinating centre for sensory & motor signalling; hypothalamus → body temperature, hunger & thirst, hypothalamic hormones'],
        ['Midbrain', 'Corpora quadrigemina (with the cerebral aqueduct passing through)', 'Lies between the forebrain and the pons; dorsal portion carries four round swellings (corpora quadrigemina)'],
        ['Hindbrain', 'Pons, cerebellum, medulla oblongata', 'Pons → fibre tracts interconnecting brain regions; cerebellum → space for many neurons; medulla → respiration, cardiovascular reflexes, gastric secretions (connects to spinal cord)'],
      ],
    },
    // ── 9 · Reasoning prompt — locate-the-function check ──────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 9, reasoning_type: 'logical',
      prompt: "A patient's centre for controlling respiration and cardiovascular reflexes is damaged. According to NCERT, which single structure has been injured?",
      options: [
        "The cerebral cortex, the grey matter of the cerebrum",
        "The hypothalamus, at the base of the thalamus",
        "The medulla oblongata of the hindbrain",
        "The corpus callosum joining the two hemispheres",
      ],
      reveal: "The medulla oblongata is correct — NCERT states plainly that the medulla contains the centres controlling respiration, cardiovascular reflexes and gastric secretions. The tempting wrong pick is the hypothalamus, because it *does* run automatic body business — but the functions it controls are body temperature and the urge for eating and drinking, not respiration or heartbeat. The cerebral cortex handles memory and communication, and the corpus callosum is only a connecting tract between the hemispheres — neither runs vital reflexes.",
      difficulty_level: 2,
    },
    // ── 10 · Remember callout ─────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Cranial meninges (outer → inner):** **dura mater** → **arachnoid** → **pia mater** (pia touches the brain).\n- **Forebrain = cerebrum + thalamus + hypothalamus.**\n- **Corpus callosum** joins the **two cerebral hemispheres**.\n- **Cerebral cortex = grey matter** (neuron cell bodies); the myelinated fibre tracts beneath = **white matter**.\n- **Hypothalamus** controls **body temperature, hunger and thirst**, and secretes **hypothalamic hormones**.\n- **Limbic system** (inner hemispheres + amygdala, hippocampus) → **emotions**, sexual behaviour, motivation.\n- **Midbrain** → **corpora quadrigemina** (four round swellings); cerebral aqueduct runs through it.\n- **Hindbrain = pons + cerebellum + medulla oblongata.**\n- **Medulla** controls **respiration, cardiovascular reflexes and gastric secretions**.\n- **Brain stem = midbrain + pons + medulla oblongata** — connects brain to spinal cord.",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Meninges order is a fixed-marks question:** dura mater (outer) → arachnoid (middle) → pia mater (inner, touching the brain). Reverse it and you lose the mark.\n\n**Match the function to the exact part, not the region.** \"Body temperature and hunger\" = **hypothalamus** (not the whole forebrain). \"Respiration and heartbeat reflexes\" = **medulla**, not the hypothalamus. \"Four round swellings\" = **corpora quadrigemina** of the **midbrain**.\n\n**Classic NEET question:** \"The centre controlling respiration is located in the ___\" → **medulla oblongata**. And its twin: \"The two cerebral hemispheres are joined by the ___\" → **corpus callosum**.",
    },
    // ── 12 · Closing synthesis (whole-chapter wrap-up) ────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "Step back and look at the whole chapter as one connected story. You started with the two great divisions of the nervous system — the **central nervous system** (brain and spinal cord) and the **peripheral nervous system** that reaches every corner of the body. You then zoomed all the way in to the single cell that does the actual work, the **neuron**, and watched a **nerve impulse** travel along it as a wave of changing charge. You saw that impulse hand itself over from one neuron to the next across a **synapse**. And on this page, you followed all of that wiring to where it leads: the **brain**, the command and control system, with its **forebrain** thinking and feeling, its **hypothalamus** and **medulla** quietly running the body's survival machinery, and its **brain stem** linking the whole thing back down to the spinal cord. Neural control is really this one loop — sense a change, carry the message inward, decide, send a message back out — repeated billions of times a second, all so the body can act as a single, coordinated whole.",
    },
    // ── 13 · Inline quiz (LAST) ───────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Inside the skull, the brain is covered by the cranial meninges. What is the correct order of these membranes from the outside going inward?",
          options: [
            "Pia mater → arachnoid → dura mater",
            "Dura mater → arachnoid → pia mater",
            "Arachnoid → dura mater → pia mater",
            "Dura mater → pia mater → arachnoid",
          ],
          correct_index: 1,
          explanation: "NCERT gives the order outer to inner as dura mater (outer), then the very thin arachnoid (middle), then pia mater (inner, the layer in contact with the brain tissue). Option 1 simply reverses this, and the others scramble the middle layer — pia mater is always the innermost, so any order that doesn't end in pia mater is wrong.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which three structures together make up the forebrain?",
          options: [
            "Pons, cerebellum and medulla oblongata",
            "Cerebrum, corpora quadrigemina and cerebellum",
            "Cerebrum, thalamus and hypothalamus",
            "Thalamus, pons and medulla oblongata",
          ],
          correct_index: 2,
          explanation: "The forebrain consists of the cerebrum, thalamus and hypothalamus. Option 1 is actually the hindbrain (pons + cerebellum + medulla). Option 2 mixes in the corpora quadrigemina, which belong to the midbrain, and the cerebellum, which is hindbrain. Option 4 pulls in hindbrain parts. Keep the three brain regions and their parts separate.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The medulla oblongata contains the centres that control which of the following?",
          options: [
            "Body temperature, hunger and the urge for drinking",
            "Memory, communication and intersensory associations",
            "Respiration, cardiovascular reflexes and gastric secretions",
            "Sexual behaviour, emotions and motivation",
          ],
          correct_index: 2,
          explanation: "NCERT states the medulla controls respiration, cardiovascular reflexes and gastric secretions. Option 1 is the hypothalamus (temperature, eating and drinking). Option 2 is the association areas of the cerebral cortex. Option 4 is the limbic system working with the hypothalamus. All four are real brain functions — the trap is placing them in the wrong structure.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which statement about the parts of the brain is correct?",
          options: [
            "The corpus callosum is the folded grey matter that forms the outer layer of the cerebrum",
            "The corpora quadrigemina are four round swellings on the dorsal portion of the midbrain",
            "The cerebellum connects to the spinal cord and controls respiration",
            "The brain stem is made up of the cerebrum, thalamus and hypothalamus",
          ],
          correct_index: 1,
          explanation: "The corpora quadrigemina are indeed the four round swellings on the dorsal portion of the midbrain. Option 1 confuses the corpus callosum (a connecting fibre tract) with the cerebral cortex (the grey matter). Option 3 hands the medulla's job — connecting to the spinal cord and controlling respiration — to the cerebellum. Option 4 describes the forebrain; the brain stem is the midbrain + pons + medulla oblongata.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
