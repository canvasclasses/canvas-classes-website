'use strict';
/**
 * Ch.11 pages 15-16: india-contribution-human-anatomy (retitled to India's
 * pioneers of reproductive science), frontier-heavy-metals-fertility.
 * Source: "Meet a Scientist" P. Maheshwari (p217) + Subhash Mukhopadhyay (p220),
 * ASHA box (p223), CDRI non-hormonal pill box (p224); fungi remove heavy metals
 * (p212 Bridging box); "The Quest Continues" aging puzzle (p227).
 * Page 16 is a BEYOND-NCERT frontier page (flagged in-page).
 * Run: node scripts/science-ch11/build_p15_16.js [--dry]
 */
const { img, txt, h, h3, cur, callout, cmp, table, reason, q, quiz, applyPages } = require('./_lib');

// ── PAGE 15 — India's Pioneers of Reproductive Science ────────────────────────
const p15 = {
  slug: 'india-contribution-human-anatomy',
  title: 'India\'s Pioneers of Reproductive Science',
  subtitle: 'World-first breakthroughs that came from labs and villages across India',
  blocks: [
    cur(
      'When you picture a world-first scientific breakthrough, you probably do not imagine a small lab in Kolkata or Lucknow. Yet some of the boldest firsts in reproductive science came from exactly such places in India — and at least one of those scientists was doubted and ignored in his own lifetime, only to be honoured long after he was gone. Who were they, and what did they achieve?',
      'Great science does not always come from where, or who, you expect.',
      'From plant embryos to test tube babies to a million village health workers, India\'s mark on this field is bigger than most people realise.'
    ),
    img(
      'A respectful montage of Indian reproductive science: a scientist at a microscope, a newborn from 1978, an ASHA worker in a village, and a contraceptive pill packet',
      'Wide 16:5 banner, dark background. A dignified montage in four parts: a mid-century Indian scientist studying plant material under a microscope; a healthy newborn baby (representing 1978); an ASHA health worker in a sari visiting a village home; and a simple weekly contraceptive pill packet. Warm, respectful, documentary feel, soft colours. No extra text.'
    ),
    callout('fun_fact', 'One of the World\'s Largest Health Forces',
`More than **10 lakh** women across India serve as **ASHA** health workers — one of the largest community health forces anywhere on Earth. Trained right in their own villages, they have quietly transformed maternal care, vaccination, and family planning in places that lie far from any big hospital.`),
    h('P. Maheshwari — Father of Indian Embryology', 'Meet the scientist who helped the world understand how plants reproduce.'),
    txt(
`**P. Maheshwari** is known as the **Father of Indian Embryology** — the study of how reproductive organs and embryos develop. Working with plants, he developed a way to carry out **in-vitro fertilisation in flowering plants**, joining an egg and a male gamete in a test tube to create new hybrid plants. He was also among the first to grow plant embryos on artificial nutrient media. His 1950 book, *An Introduction to the Embryology of Angiosperms*, became a classic still used by scientists around the world.`),
    h('Subhash Mukhopadhyay — India\'s First Test Tube Baby'),
    txt(
`In **1978**, in Kolkata, **Subhash Mukhopadhyay** helped bring about India\'s first test tube baby — a girl named Kanupriya Agarwal, nicknamed **Durga** — through experimental IVF work, only a couple of months after the world\'s very first. Remarkably, his achievement was doubted by many in his own time, and the recognition he deserved came only years later. His story is a reminder that bold new science is often disbelieved before it is celebrated.`),
    h('Carrying Care to Every Village'),
    txt(
`India\'s contribution is not only in famous labs. **ASHA workers** carry health knowledge into rural homes. And at the **Central Drug Research Institute (CDRI) in Lucknow**, Indian scientists developed the world\'s **first non-steroidal, non-hormonal oral contraceptive pill**. Taken just **once a week**, it avoids common side effects such as weight gain, nausea, or headaches, and is provided **free** through the National Family Planning Programme — putting a safe, convenient choice within reach of ordinary families.`),
    reason('logical',
      'The contraceptive pill developed at CDRI is taken only once a week and is non-hormonal, unlike many daily hormonal pills that can cause side effects. Why might a once-a-week, non-hormonal, free pill be especially helpful for women in remote villages?',
      [
        'It is easier to remember once a week, has fewer side effects, and costs nothing — practical where doctors are far away',
        'It works only in big cities that have large hospitals',
        'It must be taken with the help of special machines',
        'It removes the need for the person to eat any food',
      ], 0,
      'In a remote area, a daily pill is easy to forget and side effects are hard to manage when a doctor is far off. A weekly, low-side-effect, free pill is simpler to keep up with and safer to use on one\'s own — which is exactly what makes it suited to places with little medical access.',
      3),
    callout('threads_of_curiosity', 'The Pioneers We Overlook',
`It took years before Subhash Mukhopadhyay\'s breakthrough was finally accepted. That makes you wonder: how many other quiet pioneers, working in small labs or distant clinics far from the spotlight, might be doing world-changing work right now — without any of us noticing yet?`),
    quiz([
      q('P. Maheshwari is honoured as the Father of Indian —',
        ['Embryology', 'Surgery', 'Astronomy', 'Genetics'], 0,
        'Maheshwari\'s life work was embryology — how reproductive organs and embryos develop, especially in plants. He is not linked with surgery, astronomy, or genetics, which are entirely different fields.',
        1),
      q('India\'s first test tube baby, born in 1978, is connected with which scientist?',
        ['P. Maheshwari', 'Subhash Mukhopadhyay', 'Louis Pasteur', 'Charles Darwin'], 1,
        'Subhash Mukhopadhyay of Kolkata pioneered India\'s first test tube baby in 1978. Pasteur showed that life comes from pre-existing life, and Darwin is known for evolution — neither worked on IVF in India.',
        2),
      q('Why are ASHA workers especially valuable for health care in rural India?',
        [
          'They build large hospitals in every village',
          'They are trained local women who bring maternal care, vaccination, and family-planning advice to places far from hospitals',
          'They take the place of doctors entirely',
          'They work only in the big cities',
        ], 1,
        'ASHA workers are trained members of the local community who carry essential health support — maternal care, vaccines, family planning — into areas that hospitals do not easily reach. They support the health system rather than replacing doctors, and their focus is rural, not urban.',
        3),
    ]),
  ],
};

// ── PAGE 16 — Frontier: Heavy Metals and Fertility (beyond-NCERT) ──────────────
const p16 = {
  slug: 'frontier-heavy-metals-fertility',
  title: 'Frontier Questions — Pollution, Fertility, and the Ageless Cell',
  subtitle: 'Open puzzles at the edge of what science knows about how life continues',
  blocks: [
    cur(
      'Across the world, scientists keep noticing something worrying: in heavily polluted places, both wild animals and people sometimes struggle to have healthy young. Tiny traces of metals like lead and mercury, leaking from factories and waste, may be quietly interfering with reproduction itself. Could the way we treat our environment be reaching all the way into whether life can continue at all?',
      'Remember that reproduction is the one process that touches not just you, but every generation after you.',
      'This page is not exam material — it is a doorway to questions that even scientists have not fully answered yet. Step through and wonder.'
    ),
    img(
      'A polluted river beside farmland with factory waste pipes, and a hopeful inset of fungi and microbes cleaning contaminated soil',
      'Wide 16:5 banner, dark background. Left: a polluted river running past farmland, with factory pipes releasing waste and a few birds nearby, painted in a sombre tone. Right inset: a hopeful close-up of fungi and microbes growing in soil, shown gently breaking down dark pollutant specks. Thoughtful, slightly dramatic, educational illustration. No extra text.'
    ),
    callout('ready_to_go_beyond', 'Beyond Your Syllabus',
`The questions on this page go beyond the Class 9 syllabus, and they have no neat answer in any textbook yet — because scientists are still working them out. Read this to wonder and to ask, not to memorise for an exam.`),
    h('When Pollution Reaches the Cradle of Life', 'Explore why harm to reproduction is a special kind of danger.'),
    txt(
`Heavy metals such as **lead, mercury, and cadmium** can build up in water, soil, and food near industries and dumped waste. Scientists are studying how these metals may interfere with the delicate steps of reproduction — the forming of healthy gametes and the safe growth of a baby — in both animals and humans.

What makes this especially serious is that harm to reproduction does not stop with one individual. If it damages how gametes form, the effects can reach into the **next generation, and the one after that**. Pollution, in other words, may not just make a creature ill — it may quietly threaten its line of descendants.`),
    h('An Unexpected Ally: Living Cleaners'),
    txt(
`Here is a hopeful twist that connects right back to this chapter. Some **fungi** — the same kind that reproduce by scattering spores — can soak up and break down heavy metals and other pollutants from industrial waste. Scientists are now exploring whether living things like fungi, bacteria, and plants can be put to work cleaning polluted soil and water, an idea called **bioremediation**. The very biology that makes new life might also help protect it.`),
    reason('logical',
      'Suppose a factory\'s waste contains heavy metals, but proving whether they harm human fertility takes many years of careful study. Why might it still be wise to limit the pollution now, before all the studies are complete?',
      [
        'Because the harm, if it is real, could reach future generations and be hard to undo — so waiting is risky',
        'Because factories are never useful to anyone',
        'Because heavy metals always disappear on their own within days',
        'Because pollution cannot affect living things at all',
      ], 0,
      'Damage to reproduction can pass down to children and grandchildren, and such harm may be very hard to reverse once it has happened. When the possible cost is that large and that lasting, acting carefully before the proof is final can save a great deal of future suffering. This careful approach is sometimes called the precautionary principle.',
      3),
    h('The Puzzle of the Ageless Cell'),
    txt(
`Now a very different open question, taken straight from your textbook. Does a single-celled creature like an *Amoeba* or yeast ever truly "grow old"? When it reproduces, it simply divides into **two near-identical copies**. So where did the "old" one go? Did it die — or did it just become its own two children? In a strange way, such a creature may never age and die the way we do. Scientists still argue about what "ageing" and even "death" really mean for the very simplest forms of life.`),
    callout('quest_continues', 'A Question With No Settled Answer',
`When an *Amoeba* splits into two identical *Amoebae*, has the original *Amoeba* died — or is it still alive, now living on as two? For creatures that reproduce by simply copying themselves, the line between parent, child, and "growing old" becomes wonderfully blurry. What do **you** think "ageing" should mean for a single cell?`),
    quiz([
      q('Why are scientists especially concerned about pollutants that interfere with reproduction, compared with ones that only make an adult mildly sick?',
        [
          'Because they make adults feel slightly tired for a day',
          'Because harm to reproduction can be passed on to future generations',
          'Because such pollutants only ever affect plants',
          'Because they make body cells grow larger',
        ], 1,
        'Reproduction is the bridge to the next generation, so damage to it can reach children and grandchildren, not just the one individual affected. A pollutant that only makes an adult briefly unwell does not carry that same long reach into the future.',
        2),
      q('Some fungi can absorb heavy metals from industrial waste. Why might scientists find this useful?',
        [
          'It could help clean polluted soil and water',
          'It makes the heavy metals far more poisonous',
          'It turns the fungi into animals',
          'It stops all fungi from ever reproducing',
        ], 0,
        'If fungi can pull harmful metals out of the environment, they could be used to help clean contaminated soil and water — the idea behind bioremediation. The process does not make pollutants worse, and it certainly does not change what fungi are.',
        2),
      q('When an Amoeba divides into two identical Amoebae, why is it hard to say that the original "parent" has died?',
        [
          'Because the parent simply continues as the two new copies, leaving nothing clearly behind to count as dead',
          'Because Amoebae are in fact unable to reproduce',
          'Because the parent first grows very old and frail',
          'Because the two new Amoebae always merge back into one',
        ], 0,
        'In this kind of reproduction there is no leftover "body" — the parent becomes the two offspring, so it is genuinely unclear whether anything has died at all. That is exactly what makes ageing and death such puzzling ideas for single-celled life.',
        3),
    ]),
  ],
};

applyPages([p15, p16]);
