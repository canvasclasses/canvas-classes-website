'use strict';
const { v4: uuid } = require('uuid');

/**
 * Class 12 Biology — Chapter 2: Human Reproduction
 * Page 9 — Parturition & Lactation (CLOSING page of the chapter).
 *
 * Source of truth: NCERT Class 12 Ch.2 §2.7 (lebo102.txt, lines 555–580).
 * Rule 0: every fact, name and sequence here traces to that section —
 * gestation ≈ 9 months; parturition = delivery of the foetus, induced by a
 * complex neuroendocrine mechanism; signals from the fully developed foetus +
 * placenta → mild uterine contractions (foetal ejection reflex) → oxytocin from
 * maternal pituitary → stronger contractions → further oxytocin → positive
 * feedback → expulsion of the baby, then the placenta; lactation = mammary
 * glands differentiate in pregnancy and produce milk late in pregnancy;
 * colostrum = the first-few-days milk, rich in antibodies for the newborn's
 * resistance; early breast-feeding recommended. Nothing invented.
 *
 * Exports a single page object. The orchestrator inserts it after validation.
 */

const oxytocinLoopHotspots = [
  {
    id: uuid(), x: 0.50, y: 0.12, label: 'Signals from foetus + placenta', icon: 'circle',
    detail: "The whole thing **starts here**. Near the end of the 9-month gestation, the **fully developed foetus and the placenta** send out signals. These are the trigger for everything that follows — birth is not started by the mother's will, but by the baby being ready.",
  },
  {
    id: uuid(), x: 0.85, y: 0.42, label: 'Foetal ejection reflex', icon: 'circle',
    detail: "The foetal + placental signals set off **mild uterine contractions** — this is the **foetal ejection reflex**. It is the gentle first push, and it is what kicks the loop into motion.",
  },
  {
    id: uuid(), x: 0.68, y: 0.80, label: 'Oxytocin from maternal pituitary', icon: 'circle',
    detail: "The mild contractions cause the **mother's pituitary gland to release oxytocin**. Remember the address: the hormone comes from the **maternal** pituitary, not the foetus.",
  },
  {
    id: uuid(), x: 0.32, y: 0.80, label: 'Stronger uterine contractions', icon: 'circle',
    detail: "**Oxytocin acts on the uterine muscle** and makes the contractions **stronger**. Each round of oxytocin squeezes the uterus harder than the last.",
  },
  {
    id: uuid(), x: 0.15, y: 0.42, label: 'More contractions → more oxytocin', icon: 'circle',
    detail: "The stronger contractions **stimulate still more oxytocin** — and back round the loop it goes. Because each step **increases** the next (it doesn't switch it off), this is a **positive feedback** loop: contractions and oxytocin build each other up, stronger and stronger.",
  },
  {
    id: uuid(), x: 0.50, y: 0.55, label: 'Delivery, then placenta expelled', icon: 'circle',
    detail: "The escalating contractions finally **push the baby out through the birth canal — this is parturition.** Soon after the infant is delivered, the **placenta is also expelled** from the uterus.",
  },
];

module.exports = {
  slug: 'parturition-and-lactation',
  title: 'Birth & Lactation',
  subtitle: "After nine months, how does the body actually start labour — and why is the mother's very first milk so precious? Here is the loop that pushes the baby out, and the first feed that arms it against infection.",
  page_number: 9,
  page_type: 'lesson',
  tags: ['parturition', 'lactation', 'oxytocin', 'colostrum', 'human-reproduction'],
  glossary: [
    { term: 'parturition', definition: 'The process of delivery of the foetus — childbirth. It is brought about by vigorous contraction of the uterus at the end of pregnancy.' },
    { term: 'foetal ejection reflex', definition: 'The mild uterine contractions set off by signals from the fully developed foetus and placenta. It is the first push that starts labour.' },
    { term: 'oxytocin', definition: 'A hormone released from the mother\'s (maternal) pituitary gland. It acts on the uterine muscle to cause stronger and stronger contractions during birth.' },
    { term: 'colostrum', definition: 'The milk produced in the first few days of lactation. It contains several antibodies that are essential for building the newborn\'s resistance to infection.' },
    { term: 'lactation', definition: 'The process by which the mammary glands produce milk to feed the newborn. The glands develop during pregnancy and start producing milk towards its end.' },
  ],
  blocks: [
    {
      id: uuid(), type: 'image', order: 0, src: '',
      alt: 'A warm, tender dawn banner suggesting a newborn being held close after birth',
      caption: '', width: 'full', aspect_ratio: '16:5',
      generation_prompt: "Ultra-wide cinematic banner (16:5 ratio). A tender, intimate scene bathed in soft warm light — the quiet moment just after a birth. Suggested only through mood, not explicit anatomy: a gentle warm glow, like early morning light through a window, wrapping a small bundle held close and safe. Warm amber and soft rose tones in the centre fading up into deep dusky blue-black at the edges. No text, no labels, no diagram elements, no medical detail. Deep, dark naturalistic background overall (#0a0a0a base tones), painterly and cinematic, conveying warmth, relief and the beginning of a new life.",
    },
    {
      id: uuid(), type: 'callout', order: 1, variant: 'fun_fact',
      title: "The First Milk Is Liquid Armour",
      markdown: "For the first few days after birth, a mother's breasts don't produce ordinary milk — they produce **colostrum**, a thicker, yellowish first milk. A newborn arrives with almost no defences of its own against germs. Colostrum is packed with **antibodies** that are handed straight to the baby in that first feed, giving it a ready-made shield against infection until its own immune system gets going. That is why doctors are so firm about **breast-feeding right from the start** — those first few feeds carry protection the baby cannot make for itself yet.",
    },
    {
      id: uuid(), type: 'text', order: 2,
      markdown: "You've followed the embryo through nine months of growth inside the uterus. The average length of human pregnancy — from fertilisation to birth — is about **9 months**, and this span is called the **gestation period**. Now comes the finish: the baby has to come out.\n\nAt the end of pregnancy, **vigorous contraction of the uterus** causes the **expulsion/delivery of the foetus**. This process of delivering the foetus — plain **childbirth** — is called **parturition**. It doesn't happen at random. Parturition is set off by a **complex neuroendocrine mechanism** — 'neuro' because nerves and reflexes are involved, 'endocrine' because a hormone drives it. In the next section we trace exactly how that mechanism builds itself up.",
    },
    {
      id: uuid(), type: 'heading', order: 3, level: 2,
      text: 'Parturition — The Loop That Pushes the Baby Out',
      objective: "By the end of this you can name, in order, every step from the foetal signal to the baby's delivery — and say exactly where the oxytocin comes from.",
    },
    {
      id: uuid(), type: 'text', order: 4,
      markdown: "Follow the chain link by link — this is a favourite NEET sequence, and the order matters.\n\n1. **The signal comes from the baby, not the mother.** The signals for parturition originate from the **fully developed foetus and the placenta**.\n2. **These signals induce mild uterine contractions** — the **foetal ejection reflex**. This is the gentle first push.\n3. **That reflex triggers the release of oxytocin** from the **maternal pituitary** — the mother's pituitary gland. (Lock in the address: the oxytocin is the *mother's*, not the foetus's.)\n4. **Oxytocin acts on the uterine muscle and causes stronger uterine contractions.**\n5. **Those stronger contractions stimulate still more oxytocin** to be secreted.\n\nStep 5 loops straight back into step 4. Each round makes the next round bigger — contractions and oxytocin drive each other up, so the contractions grow **stronger and stronger**. This escalating cycle finally **expels the baby out of the uterus through the birth canal** — that is parturition. And it isn't quite over at the baby: **soon after the infant is delivered, the placenta is also expelled** from the uterus.",
    },
    {
      id: uuid(), type: 'interactive_image', order: 5, src: '',
      alt: 'A circular diagram showing the positive-feedback oxytocin loop of parturition — foetal signal to foetal ejection reflex to oxytocin to stronger contractions and back',
      caption: '📸 Tap each dot to walk the oxytocin positive-feedback loop, step by step.',
      hotspots: oxytocinLoopHotspots,
      generation_prompt: "Scientific textbook illustration of the OXYTOCIN POSITIVE-FEEDBACK LOOP of human parturition, drawn as a labelled circular cycle diagram on a dark background (#0a0a0a near-black). Flat 2D educational diagram, clean white outlines and thin white curved arrows forming a clear clockwise ring, no baked-in text labels. Around the ring, place five simple icon nodes connected by bold curved arrows that all point the same way (to show a self-reinforcing cycle): TOP node = a small stylised foetus-in-uterus with the placenta, representing the signal source; UPPER-RIGHT node = a uterus giving a small gentle squeeze (mild contraction / foetal ejection reflex); LOWER-RIGHT node = a small brain with the pituitary gland highlighted releasing hormone droplets (oxytocin, tinted magenta/purple), labelled as maternal; LOWER-LEFT node = the same uterus giving a much stronger, harder squeeze (stronger contractions, drawn visibly more forceful); LEFT node = a thicker return arrow looping back up to the pituitary node to show 'more contractions cause more oxytocin'. In the CENTRE of the ring, a downward arrow breaking out of the loop leads to a small node showing the baby delivered through the birth canal with the placenta following. Use warm red tints for the uterine muscle (blood/muscle), magenta/purple for the oxytocin hormone, pink for soft tissue. The arrows getting visibly bolder around the ring should convey escalation. No photorealism, no cartoon, no mascots, matches standard biology textbook illustration conventions.",
    },
    {
      id: uuid(), type: 'heading', order: 6, level: 2,
      text: 'Lactation — Feeding the Newborn',
      objective: "By the end of this you can say when the mammary glands start making milk, what colostrum is, and why the first feed matters most.",
    },
    {
      id: uuid(), type: 'text', order: 7,
      markdown: "The mother's body prepares to feed the baby long before the baby arrives. The **mammary glands** of the female **undergo differentiation during pregnancy** and **start producing milk towards the end of pregnancy** — this whole process of milk production is called **lactation**. It is what lets the mother feed the newborn.\n\nThe milk isn't the same from day one. The milk produced during the **initial few days of lactation** is called **colostrum**. Colostrum **contains several antibodies** that are **absolutely essential to develop resistance for the new-born baby** — the infant's own immune system is barely working yet, so these borrowed antibodies stand in as its first line of defence. This is exactly why **breast-feeding during the initial period of the infant's growth is recommended by doctors** for bringing up a healthy baby.\n\nAnd with that first feed, the human story this chapter has followed — from a single fertilised cell, through the making of gametes, the monthly cycle, fertilisation, nine months of growth, birth, and now the first milk — comes full circle. **You've reached the end of Human Reproduction.**",
    },
    {
      id: uuid(), type: 'reasoning_prompt', order: 8, reasoning_type: 'logical',
      prompt: "During labour, oxytocin causes stronger uterine contractions, and those stronger contractions cause even more oxytocin to be released. Biologists call this a 'positive feedback' loop. What does 'positive feedback' mean here?",
      options: [
        'The output of the process feeds back to reduce and switch off the process, keeping contractions gentle and steady',
        'The output of the process feeds back to increase the process further, so contractions and oxytocin build each other up stronger and stronger',
        'It means the process has a beneficial (positive) outcome for the baby, which is why it is named positive feedback',
        'It means oxytocin is released at a constant fixed rate, unaffected by how strong the contractions are',
      ],
      correct_index: 1,
      reveal: "'Positive feedback' describes the *direction* of the loop, not whether the outcome is good. The result (stronger contractions) feeds back to **increase** the cause (more oxytocin), which increases the result again — the cycle amplifies itself until the baby is delivered. It is **not** self-limiting (that would be *negative* feedback, which dampens a process), it is not named for having a 'nice' outcome, and the oxytocin level is anything but constant — it keeps climbing each round.",
      difficulty_level: 2,
    },
    {
      id: uuid(), type: 'callout', order: 9, variant: 'remember',
      title: 'The Facts You Cannot Swap',
      markdown: "- **Gestation period** ≈ **9 months** (average human pregnancy).\n- **Parturition** = delivery of the foetus (childbirth), caused by **vigorous uterine contractions**, induced by a **complex neuroendocrine mechanism**.\n- **Signal source** = the **fully developed foetus + placenta** → **foetal ejection reflex** (mild contractions).\n- **Oxytocin** comes from the **MATERNAL pituitary** — it drives stronger contractions and forms a **positive feedback** loop.\n- After the baby, the **placenta is also expelled**.\n- **Lactation:** mammary glands differentiate **during pregnancy**, milk made **towards the end of pregnancy**.\n- **Colostrum** = the **first few days' milk**, rich in **antibodies** for the newborn's resistance — early breast-feeding is recommended.",
    },
    {
      id: uuid(), type: 'callout', order: 10, variant: 'exam_tip',
      title: 'NEET Exam Insight',
      markdown: "**Oxytocin's origin:** it is released from the **maternal pituitary**, not the foetus — the single most common trap on this topic.\n\n**The loop's direction:** the contraction ⇄ oxytocin cycle is **positive feedback** (each step amplifies the next). NEET likes contrasting it with negative feedback.\n\n**Signal source:** the signals for parturition come from the **foetus and placenta** — the fully developed baby effectively signals it is ready.\n\n**Colostrum:** its value is the **antibodies** it carries to the newborn (a form of readymade, passive protection). This antibody-rich first milk is a repeat one-liner.\n\n**Classic NEET question:** \"The hormone responsible for the strong uterine contractions leading to parturition, and its source?\" → **Oxytocin, from the maternal (mother's) pituitary gland.**",
    },
    {
      id: uuid(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
      questions: [
        {
          id: uuid(),
          question: "During parturition, the strong uterine contractions are driven by oxytocin. From where is this oxytocin released?",
          options: [
            "From the placenta directly into the uterine muscle",
            "From the ovaries, along with the ovarian steroid hormones",
            "From the maternal (mother's) pituitary gland",
            "From the fully developed foetus's own pituitary gland",
          ],
          correct_index: 2,
          explanation: "The foetal ejection reflex triggers release of oxytocin from the **maternal pituitary** — the mother's gland. It is not the placenta (which, with the foetus, only provides the initial *signal*), not the ovaries, and not the foetus's own pituitary — mixing up whose pituitary it is the classic error here.",
          difficulty_level: 1,
        },
        {
          id: uuid(),
          question: "Where do the signals that initiate parturition originate?",
          options: [
            "From the fully developed foetus and the placenta",
            "From the mother's hypothalamus alone",
            "From the corpus luteum in the ovary",
            "From the endometrial lining of the uterus",
          ],
          correct_index: 0,
          explanation: "NCERT is explicit: the signals for parturition originate from the **fully developed foetus and the placenta**, and these induce the mild contractions (foetal ejection reflex). The mother's hypothalamus, the corpus luteum, and the endometrium are not named as the signal source — the baby-plus-placenta is.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "The mild uterine contractions first induced by the foetal-and-placental signals are together called the:",
          options: [
            "Menstrual reflex",
            "Implantation reflex",
            "Lactation reflex",
            "Foetal ejection reflex",
          ],
          correct_index: 3,
          explanation: "These first mild uterine contractions are the **foetal ejection reflex**, which then triggers oxytocin release. The other three are not terms NCERT uses for this step — 'foetal ejection reflex' is the exact phrase to remember as the starting push of labour.",
          difficulty_level: 2,
        },
        {
          id: uuid(),
          question: "Which statement about colostrum is correct?",
          options: [
            "It is the milk of the first few days of lactation, rich in antibodies essential for the newborn's resistance",
            "It is a hormone from the mammary glands that triggers uterine contractions at birth",
            "It is the mature milk produced only several weeks after delivery, once the newborn is stronger",
            "It is the fluid that surrounds and cushions the foetus inside the uterus during pregnancy",
          ],
          correct_index: 0,
          explanation: "Colostrum is the milk produced in the **initial few days of lactation**, containing several **antibodies** essential to develop the newborn's resistance. It is not a hormone (oxytocin drives contractions), not late mature milk (colostrum is the *first* milk), and not amniotic fluid — the 'first few days, antibody-rich' description is the giveaway.",
          difficulty_level: 1,
        },
      ],
    },
  ],
};
