'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  slug: 'types-of-movement-and-muscle-types',
  title: 'Types of Movement & the Three Muscle Types',
  subtitle: "Your body moves in three completely different ways — one cell crawls, one waves tiny hairs, one pulls on bone. Sort out which is which, then meet the three muscles that do the pulling.",
  page_number: 1,
  page_type: 'lesson',
  tags: ['locomotion-and-movement', 'muscle-types'],
  glossary: [
    { term: 'movement', definition: 'A change in position of a body part or a whole cell. Cells of the human body show three main types: amoeboid, ciliary, and muscular.' },
    { term: 'amoeboid movement', definition: 'Crawling movement shown by cells like macrophages and leucocytes, brought about by pseudopodia formed from the streaming of protoplasm (as in Amoeba). Cytoskeletal microfilaments are involved.' },
    { term: 'pseudopodia', definition: 'Temporary finger-like extensions of a cell, formed by the streaming of protoplasm, that bring about amoeboid movement.' },
    { term: 'ciliary movement', definition: 'Movement produced by cilia, occurring in internal tubular organs lined by ciliated epithelium — for example, clearing dust from the trachea and moving ova through the female reproductive tract.' },
    { term: 'muscular movement', definition: 'Movement of parts like the limbs, jaws, and tongue, produced using the contractile property of muscles.' },
    { term: 'muscle', definition: 'A specialised tissue of mesodermal origin that makes up about 40–50 per cent of an adult human’s body weight. It shows excitability, contractility, extensibility, and elasticity.' },
    { term: 'skeletal muscle', definition: 'Muscle closely associated with the skeletal components of the body; striated in appearance and under voluntary control. Involved in locomotion and posture.' },
    { term: 'visceral muscle', definition: 'Smooth (non-striated) muscle in the inner walls of hollow visceral organs like the alimentary canal and reproductive tract; involuntary. Moves food and gametes along.' },
    { term: 'cardiac muscle', definition: 'The muscle of the heart, whose cells assemble in a branching pattern. Striated in appearance but involuntary — the nervous system does not directly control it.' },
  ],
  blocks: [
    // ── 0 · Hero ──────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A runner mid-stride at dawn, the pulling muscles of the leg faintly suggested beneath the skin against a dark landscape',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A single human runner caught mid-stride at dawn, seen from the side against a dim, misty landscape. The powerful muscles of the moving leg and torso are faintly suggested beneath the skin as soft warm glowing lines, hinting at contraction and pull, without becoming a literal labelled anatomy diagram. Deep shadows fill most of the frame, with subtle warm rim-light on the figure. Painterly, atmospheric illustration style, dark background throughout (#0a0a0a base tones), no text, no labels, no diagram elements, no visible faces.",
    },
    // ── 1 · Fun fact hook ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: 'You Are Moving Right Now — In Three Different Ways At Once',
      markdown: "While you sit still reading this, three completely different kinds of movement are happening inside you. In your blood, certain cells are **crawling** like an amoeba to hunt down germs. In your windpipe, millions of tiny hairs are **beating** in waves to sweep out the dust you just breathed in. And your eyes are flicking across this line because **muscles** are pulling on them. Your body knows all three tricks.",
    },
    // ── 2 · Core concept — the three movement types ──────────────────────────
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "Cells of the human body show **three main types of movement**: **amoeboid**, **ciliary**, and **muscular**. These are not just three names to memorise — they are three genuinely different mechanisms. One cell changes its own shape to crawl. Another waves hair-like structures to push things along. The third uses a special contractile tissue to pull. Let's take them one at a time, and then zoom in on the third, because that's what the rest of this chapter is about.",
    },
    // ── 3 · Heading — the three movements ────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Amoeboid, Ciliary, Muscular — Who Does What',
      objective: "By the end of this you can match each of the three movements to the cells that show it, the structure that produces it, and one real job it does in your body.",
    },
    // ── 4 · Text — the three movements explained ─────────────────────────────
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "**Amoeboid movement** is crawling. Some specialised cells in our body — **macrophages** and **leucocytes** in the blood — move exactly the way an *Amoeba* does. The cell pushes out **pseudopodia** (false feet), which are formed by the **streaming of protoplasm** inside the cell. Cytoskeletal elements called **microfilaments** are also involved in producing this movement.\n\n**Ciliary movement** is the beating of tiny hairs. It occurs in most of our **internal tubular organs**, which are lined by **ciliated epithelium**. Two jobs to remember: the coordinated beating of cilia in the **trachea** helps remove **dust particles and foreign substances** we inhale with the air, and the **passage of ova** through the female reproductive tract is also helped along by ciliary movement.\n\n**Muscular movement** moves the big parts. The movement of our **limbs, jaws, tongue**, and so on requires muscles. The **contractile property** of muscles is used for locomotion and other movements. But muscle can't do it alone — **locomotion requires a perfectly coordinated activity of the muscular, skeletal, and neural systems** working together.",
    },
    // ── 5 · Reasoning prompt — match movement to job ─────────────────────────
    {
      id: uuid(), type: 'reasoning_prompt', order: 5, reasoning_type: 'logical',
      prompt: "The cilia lining your trachea beat in a coordinated wave. Which type of movement is this, and what job is it doing here?",
      options: [
        "Ciliary movement — sweeping out inhaled dust and foreign particles from the air passage.",
        "Amoeboid movement — the tracheal cells crawl using pseudopodia to trap dust.",
        "Muscular movement — the trachea contracts to push dust back out.",
        "Ciliary movement — pushing ova along the female reproductive tract.",
      ],
      reveal: "The trachea is lined by ciliated epithelium, so this is **ciliary movement**, and NCERT gives its exact job there: clearing dust particles and foreign substances inhaled with the air. Option 4 names the right movement but the wrong location — moving ova along is ciliary movement too, but that happens in the female reproductive tract, not the trachea. Option 2 confuses this with amoeboid movement (that's macrophages and leucocytes crawling with pseudopodia), and option 3 wrongly blames muscle — the cilia do this, not a muscular contraction.",
      difficulty_level: 2,
    },
    // ── 6 · Heading — Muscle as a tissue ─────────────────────────────────────
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Muscle: One Special Tissue, Three Types',
      objective: "By the end of this you can state where muscle comes from, how much of you it makes up, its four properties, and how to tell the three muscle types apart by appearance, control, and location.",
    },
    // ── 7 · Text — muscle tissue facts ───────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "**Muscle is a specialised tissue of mesodermal origin.** That single line hides two NEET favourites — muscle is a *tissue* (not an organ), and it develops from the **mesoderm** (the middle germ layer). It is also the single biggest tissue in you by weight: about **40–50 per cent of an adult human's body weight** is muscle.\n\nEvery muscle shares **four special properties**. It has **excitability** (it can respond to a stimulus), **contractility** (it can shorten), **extensibility** (it can be stretched), and **elasticity** (it springs back to its original shape). Keep these four together — they're the toolkit every muscle uses.\n\nMuscles are classified by **location, appearance, and nature of regulation**. Sorting them by **location** gives the three types you must know cold: **(i) Skeletal, (ii) Visceral, and (iii) Cardiac.** Tap the diagram below to see where each one lives and what it looks like.",
    },
    // ── 8 · Interactive image — the three muscle types ───────────────────────
    {
      id: uuid(), type: 'interactive_image', order: 8, src: '',
      alt: 'A human figure showing the three muscle types: skeletal muscle attached to an arm bone, smooth visceral muscle in the gut wall, and branching striated cardiac muscle in the heart',
      caption: '📸 Tap each dot to explore where each muscle type sits and how to recognise it.',
      generation_prompt: "Scientific textbook illustration comparing the three types of human muscle. Flat 2D educational diagram on a dark background (#0a0a0a near-black). Clean white outlines, biologically accurate proportions, labels in white text with thin white leader lines. Centre: a simplified human body silhouette. Three call-out panels around it, each showing a muscle-tissue close-up: (1) SKELETAL — long parallel striated (striped) muscle fibres attached to an arm bone, tissue shown in pink/magenta; (2) VISCERAL / SMOOTH — spindle-shaped smooth non-striated cells forming the wall of a tube of the gut, in pink/magenta; (3) CARDIAC — striated muscle cells joined in a branching, interconnected pattern inside a small heart, in pink/magenta with red for the heart. Functional colours: pink/magenta = muscle soft tissue, red = blood/heart, brown/tan for bone-cut edges. No photorealism, no cartoon, no mascots.",
      hotspots: [
        { id: uuid(), x: 0.18, y: 0.30, label: 'Skeletal — striated & attached to bone', detail: "Closely associated with the **skeletal components** of the body. Under the microscope it has a **striped (striated)** appearance. Primarily involved in **locomotion** and changes of body posture.", icon: 'circle' },
        { id: uuid(), x: 0.18, y: 0.58, label: 'Skeletal — voluntary', detail: "Its activities are under the **voluntary control** of the nervous system, so it's also called **voluntary muscle** — you decide when to move your arm or leg.", icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.32, label: 'Visceral — smooth & in organ walls', detail: "Located in the **inner walls of hollow visceral organs** like the alimentary canal and reproductive tract. It shows **no striation** and looks **smooth (non-striated)**.", icon: 'circle' },
        { id: uuid(), x: 0.82, y: 0.60, label: 'Visceral — involuntary', detail: "Not under voluntary control, so it's **involuntary muscle**. It quietly moves **food through the digestive tract** and **gametes through the genital tract**.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.44, label: 'Cardiac — striated but branched', detail: "The muscle of the **heart**. Many cardiac cells assemble in a **branching pattern**. By appearance it is **striated**.", icon: 'circle' },
        { id: uuid(), x: 0.50, y: 0.70, label: 'Cardiac — involuntary', detail: "Despite being striated, cardiac muscle is **involuntary** — the nervous system does **not** directly control its activities. This striated-but-involuntary combination is its signature.", icon: 'circle' },
      ],
    },
    // ── 9 · Comparison card — the three muscle types ─────────────────────────
    {
      id: uuid(), type: 'comparison_card', order: 9,
      title: 'Skeletal vs Visceral vs Cardiac Muscle',
      columns: [
        { heading: 'Skeletal', points: [
          'Appearance: striated (striped)',
          'Control: voluntary',
          'Location: attached to skeletal components (bones)',
          'Job: locomotion and body posture',
        ] },
        { heading: 'Visceral', points: [
          'Appearance: smooth / non-striated',
          'Control: involuntary',
          'Location: inner walls of hollow visceral organs (alimentary canal, reproductive tract)',
          'Job: moves food and gametes along',
        ] },
        { heading: 'Cardiac', points: [
          'Appearance: striated, cells in a branching pattern',
          'Control: involuntary',
          'Location: the heart',
          'Job: the contraction of the heart',
        ] },
      ],
    },
    // ── 10 · Remember callout ─────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 10, variant: 'remember',
      title: 'Lock These In',
      markdown: "- **Three types of movement:** amoeboid (macrophages/leucocytes, via pseudopodia + microfilaments), ciliary (ciliated tubular organs — clears tracheal dust, moves ova), muscular (limbs, jaws, tongue — uses contractility).\n- **Locomotion needs three systems together:** muscular + skeletal + neural.\n- **Muscle = a tissue of mesodermal origin**, about **40–50%** of adult body weight.\n- **Four muscle properties:** excitability, contractility, extensibility, elasticity.\n- **Skeletal** → striated, **voluntary**, on bones, for locomotion/posture.\n- **Visceral** → smooth (non-striated), **involuntary**, in organ walls, moves food/gametes.\n- **Cardiac** → striated **but involuntary**, cells in a branching pattern, in the heart.",
    },
    // ── 11 · Exam tip ─────────────────────────────────────────────────────────
    {
      id: uuid(), type: 'callout', order: 11, variant: 'exam_tip',
      title: 'JEE / NEET Exam Insight',
      markdown: "**Cardiac is the trick answer.** It is **striated in appearance** but **involuntary** in control — the one muscle that breaks the neat \"striated = voluntary\" rule. NEET loves this exact clash.\n\n**Muscle origin is a one-word question:** muscle is of **mesodermal** origin. Don't second-guess it.\n\n**Classic NEET question:** \"Cardiac muscle is striated but ___.\" → **involuntary** (the nervous system does not directly control it). A close cousin: \"Muscle is a specialised tissue of ___ origin.\" → **mesodermal**, and it makes up **40–50%** of body weight.",
    },
    // ── 12 · Bridge text ─────────────────────────────────────────────────────
    {
      id: uuid(), type: 'text', order: 12,
      markdown: "You can now name all three movements, and you can tell the three muscle types apart by look, control, and location. Next, we open up the one that does the heavy lifting — the **skeletal muscle** — and see exactly how it's built, fibre by fibre.",
    },
    // ── 13 · Inline quiz (LAST) ─────────────────────────────────────────────
    {
      id: uuid(), type: 'inline_quiz', order: 13, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "Macrophages and leucocytes in the blood move by which mechanism, and what produces that movement?",
          options: [
            "Amoeboid movement, produced by pseudopodia formed from the streaming of protoplasm",
            "Ciliary movement, produced by cilia beating in a coordinated wave",
            "Muscular movement, produced by the contractile property of muscle fibres",
            "Amoeboid movement, produced by cilia lining the surface of the blood cell",
          ],
          correct_index: 0,
          explanation: "NCERT names macrophages and leucocytes as cells showing amoeboid movement, effected by pseudopodia that form from the streaming of protoplasm (as in Amoeba), with microfilaments involved. Option 4 gets the movement right but swaps in cilia — pseudopodia, not cilia, do the crawling. Options 2 and 3 are the wrong movement types altogether.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Which single statement about muscle as a tissue is correct?",
          options: [
            "It is of ectodermal origin and makes up about 70% of body weight",
            "It is of mesodermal origin and makes up about 40–50% of body weight",
            "It is of endodermal origin and shows only excitability and contractility",
            "It is of mesodermal origin and makes up about 20–30% of body weight",
          ],
          correct_index: 1,
          explanation: "Muscle is a specialised tissue of mesodermal origin, and about 40–50 per cent of an adult's body weight is muscle. Option 4 keeps the correct origin but wrongly lowers the weight fraction; options 1 and 3 change the germ layer (it is mesoderm, not ectoderm or endoderm). All muscle also shows four properties — excitability, contractility, extensibility, and elasticity — not just two.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Where is visceral muscle found, and what is its nature?",
          options: [
            "Attached to bones; striated and voluntary",
            "In the walls of the heart; striated and involuntary",
            "In the inner walls of hollow visceral organs like the alimentary canal; smooth and involuntary",
            "In the limbs and jaws; smooth and voluntary",
          ],
          correct_index: 2,
          explanation: "Visceral muscle sits in the inner walls of hollow visceral organs — the alimentary canal, reproductive tract, and so on — is smooth (non-striated), and is involuntary, moving food and gametes along. Option 1 describes skeletal muscle, option 2 describes cardiac muscle, and option 4 mixes traits that don't belong together.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Cardiac muscle stands out from the other two types because it is:",
          options: [
            "Smooth in appearance and voluntary in control",
            "Striated in appearance but involuntary in control, with cells arranged in a branching pattern",
            "Striated in appearance and voluntary in control, attached to the skeleton",
            "Smooth in appearance and involuntary, located in the alimentary canal",
          ],
          correct_index: 1,
          explanation: "Cardiac muscle is striated by appearance yet involuntary — the nervous system does not directly control it — and its cells assemble in a branching pattern. Option 3 wrongly makes it voluntary and skeletal; option 1 wrongly makes it smooth and voluntary; option 4 describes visceral (smooth) muscle. The striated-but-involuntary clash is exactly what makes cardiac muscle the classic trap.",
          difficulty_level: 3,
        },
      ],
    },
  ],
};
