'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — Arc B CLOSER, Page 14.
 * "Dipole Moment — Is the Molecule Polar?" (bond dipole, molecular dipole = vector
 * sum, symmetry cancellation, the NH₃/NF₃ classic, lone-pair contribution, % ionic
 * character, the CH₃F/CH₃Cl exception, like-dissolves-like + charged-comb PYQ).
 * This page CLOSES Arc B (shape & polarity) and previews Arc C (VBT & MOT).
 * Appends at page_number 14 in ch4 page_ids. published:false — founder reviews +
 * generates the 2 pending images, then publishes.
 * Voice: BOND-exemplars.md (§B dipole values, §C CH₃F/CH₃Cl + lone-pair traps,
 * §D12 charged comb, §D13 NH₃/NF₃ same-logic) + teacher-voice-profile.md.
 * Grounded in NCERT Class 11 Ch.4 (Bond Parameters → Dipole Moment) + standard JEE.
 * Run: node scripts/insert_bond_p14_dipole-moment.js   (DO NOT auto-run — founder reviews)
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 14;
const NEW_SLUG = 'dipole-moment-polarity';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A charged comb bending a thin stream of water while a stream of a non-polar liquid falls straight down',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). Two thin liquid streams fall side by side from above. On the left, a charged plastic comb held near the stream bends the falling water visibly toward it, the stream curving. On the right, an identical comb held near a second stream has no effect — that stream falls perfectly straight. A subtle glow distinguishes the bent (polar) stream from the straight (non-polar) one. The visual idea: some molecules feel an electric field, others ignore it. Clean scientific illustration style, cool blue accents on the water, neutral on the other. Dark background (#0a0a0a or near-black). No text.' },

    // 1 — fun_fact hook (charged comb)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'The Comb That Bends Water',
      markdown: "Rub a plastic comb on your hair and hold it next to a thin stream of running water — the stream visibly **bends toward the comb**. Now try the exact same thing with a stream of \\ce{CCl4} (carbon tetrachloride): nothing happens, it falls dead straight. Same comb, same charge — so why does water feel the pull and \\ce{CCl4} doesn't? Both molecules contain polar bonds. The answer is hiding in their **shape**." },

    // 2 — core concept text (bond dipole vector; molecular dipole = vector sum)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "When two atoms of *different* electronegativity share a bond, the shared electrons sit closer to the greedier atom. That atom becomes slightly negative ($\\delta-$) and its partner slightly positive ($\\delta+$). This tiny separation of charge across one bond is a **bond dipole**.\n\n" +
      "We measure it with the **dipole moment**, $\\mu$ — defined as the charge times the distance between the charges:\n\n" +
      "$\\mu = q \\times d$\n\n" +
      "Its unit is the **debye (D)**. Crucially, a dipole moment is a **vector**: it has a direction. By convention the arrow points **from the positive end toward the more electronegative (negative) atom**.\n\n" +
      "A molecule, though, has *many* bonds. Its overall **molecular dipole moment is the vector sum of all the bond dipoles** (plus, as we'll see, any lone-pair contribution). And here is the whole game: vectors can **add up** or **cancel out**. If they cancel, the molecule is **non-polar** even though every individual bond is polar — that is exactly why \\ce{CCl4} ignored the comb." },

    // 3 — heading: bond dipole vs molecular dipole
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Bond Dipole vs Molecular Dipole',
      objective: 'Tell apart the polarity of a single bond from the net polarity of the whole molecule.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Keep these two ideas separate — most mistakes come from blurring them.\n\n" +
      "A **bond dipole** depends only on the two atoms in that one bond. The bigger the electronegativity difference, the bigger the bond dipole. \\ce{H-F} has a large bond dipole; \\ce{C-H} has a tiny one.\n\n" +
      "A **molecular dipole** is what you'd actually measure for the whole molecule, and it depends on **both** the bond dipoles **and the shape** that arranges them in space. A molecule can be stuffed with strongly polar bonds and still have $\\mu = 0$ — if the geometry points those bond-dipole arrows symmetrically outward so they cancel.\n\n" +
      "So the question \"is this molecule polar?\" is never answered by the bonds alone. You must draw the shape first (everything you learned about VSEPR on the last pages), then add the bond-dipole vectors." },

    // 4 — heading: symmetry cancels
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Symmetry Cancels — When Polar Bonds Add to Zero',
      objective: 'Predict a zero dipole moment straight from a symmetric shape, without any arithmetic.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Some shapes are so symmetric that identical bond dipoles pulling outward exactly balance — like a tug-of-war with equal teams on every side. The net pull is zero.\n\n" +
      "- **\\ce{CO2}** — linear, \\ce{O=C=O}. Two equal \\ce{C=O} dipoles point in *opposite* directions along a straight line and cancel. $\\mu = 0$.\n" +
      "- **\\ce{BF3}** — trigonal planar, three \\ce{B-F} dipoles at 120° spaced evenly around boron. They sum to zero. $\\mu = 0$.\n" +
      "- **\\ce{CCl4}** — tetrahedral, four \\ce{C-Cl} dipoles pointing to the corners of a tetrahedron. Perfectly balanced. $\\mu = 0$. (This is our comb mystery solved.)\n" +
      "- **\\ce{SF6}** — octahedral, six \\ce{S-F} dipoles in opposed pairs. $\\mu = 0$.\n\n" +
      "Now break the symmetry and the cancellation fails:\n\n" +
      "- **\\ce{H2O}** — *bent* (104.5°), not linear. The two \\ce{O-H} dipoles do **not** point opposite; they add to a strong net dipole. $\\mu = 1.85\\,\\text{D}$.\n" +
      "- **\\ce{NH3}** — *pyramidal*, not planar. The three \\ce{N-H} dipoles tilt the same way and add up. $\\mu = 1.47\\,\\text{D}$.\n\n" +
      "**The rule to carry forever:** a symmetric arrangement of *identical* bonds → dipoles cancel → non-polar. The moment the shape is bent, pyramidal, or otherwise lopsided, expect a non-zero dipole." },

    // 5 — image: vector addition (CO2 cancel vs H2O add)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '4:3',
      alt: 'Bond-dipole vectors of CO2 cancelling along a line versus H2O adding into a net downward dipole',
      caption: '📸 Same kind of polar bonds — shape decides whether they cancel or add',
      generation_prompt: 'Side-by-side molecular dipole comparison diagram. Left panel: a linear carbon dioxide molecule O=C=O drawn horizontally; two equal bond-dipole arrows on the C=O bonds pointing outward in exactly opposite directions along the axis, with a label showing they cancel to a net dipole of zero. Right panel: a bent water molecule H-O-H at about 104.5 degrees; two O-H bond-dipole arrows pointing toward the oxygen, plus a bold resultant arrow showing the net molecular dipole pointing downward through the oxygen, labelled 1.85 D. Show the vector-addition idea clearly with the small bond arrows and one big resultant arrow. Label: CO2 (net dipole = 0), H2O (net dipole 1.85 D), bond dipole, resultant. Dark background (#0a0a0a or near-black), orange accent labels and arrows, clean technical illustration style.' },

    // 6 — heading: NH3 vs NF3 & lone pairs
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The NH₃ vs NF₃ Classic — Where Lone Pairs Decide',
      objective: 'Explain why NF₃ has a tiny dipole and NH₃ a large one, using lone-pair direction.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Here is the single most-loved dipole question in JEE chemistry. Both \\ce{NH3} and \\ce{NF3} are pyramidal, both have a lone pair on nitrogen — so you'd expect similar dipoles. The reality is dramatic:\n\n" +
      "- \\ce{NH3}: $\\mu = 1.47\\,\\text{D}$ (large)\n" +
      "- \\ce{NF3}: $\\mu = 0.23\\,\\text{D}$ (almost nothing)\n\n" +
      "Why? Because the **lone pair on nitrogen is itself a dipole** — it points *away* from the nucleus, out the top of the pyramid. Now follow the directions:\n\n" +
      "**In \\ce{NH3}:** nitrogen is more electronegative than hydrogen, so each \\ce{N-H} bond dipole points *toward* the nitrogen (upward, toward the lone pair). The lone-pair dipole points the **same way**. Bond dipoles and lone pair **add up** → big net dipole.\n\n" +
      "**In \\ce{NF3}:** fluorine is more electronegative than nitrogen, so each \\ce{N-F} bond dipole points *away* from nitrogen (downward, toward the fluorines) — **opposite** to the lone-pair dipole, which still points up. The two pull against each other and **nearly cancel** → tiny net dipole.\n\n" +
      "Same molecule shape, same lone pair — the bond dipoles simply got *flipped* by which atom is greedier. That flip is the whole answer." },

    // 7 — text: lone-pair contribution detail (hybrid-orbital rule)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "One subtlety that separates the toppers: a lone pair only contributes to the dipole if it lives in a **hybrid orbital** (like the sp³ lone pair on nitrogen in \\ce{NH3}), because a hybrid orbital is lopsided — it sticks out to one side, so it has a direction.\n\n" +
      "A lone pair in a **pure s orbital** is spherical — perfectly symmetric, no direction, **no contribution**. A lone pair in a **pure p orbital** has two equal lobes pointing opposite ways — they cancel, again **no contribution**.\n\n" +
      "So when you see a question hinging on a lone pair's effect on dipole, the real check is: *is that lone pair in a hybrid orbital?* If yes, it tilts the dipole; if it's pure-s or pure-p, ignore it." },

    // 8 — reasoning_prompt (mid-page — predict polar/non-polar from shape)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 2,
      prompt: "\\ce{BF3} is trigonal planar and has a dipole moment of zero, yet \\ce{SO2} is bent and has a clear non-zero dipole. Both are made of one central atom bonded to very electronegative atoms. Why is \\ce{BF3} non-polar but \\ce{SO2} polar?",
      options: [
        "The \\ce{B-F} bond is non-polar while the \\ce{S-O} bond is polar, so only \\ce{SO2} has any dipole at all",
        "\\ce{BF3} is flat and symmetric, so its three equal bond dipoles cancel; \\ce{SO2} is bent, so its two bond dipoles (plus the lone pair on sulfur) do not cancel and add to a net dipole",
        "Boron is more electronegative than sulfur, so \\ce{BF3} has no charge separation",
        "\\ce{SO2} has more atoms than \\ce{BF3}, and more atoms always means a larger dipole moment"
      ],
      correct_index: 1,
      reveal: "Both molecules have strongly polar bonds — that is never the deciding factor. It comes down to shape. In trigonal-planar \\ce{BF3} the three \\ce{B-F} dipoles sit at 120° and pull symmetrically outward, so they cancel exactly: $\\mu = 0$. \\ce{SO2} is bent (a lone pair on sulfur pushes the two \\ce{S=O} bonds down to ~119°), so its bond dipoles point the same general direction and add — \\ce{SO2} is polar ($\\mu \\approx 1.6\\,\\text{D}$). Draw the shape first, then add the vectors: that single habit answers every \"is it polar?\" question." },

    // 9 — heading: percent ionic character
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Percent Ionic Character — How Ionic Is a "Covalent" Bond?',
      objective: 'Use the measured and the ideal dipole moment to find what fraction of a bond is ionic.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "No bond is purely covalent or purely ionic — every polar covalent bond has *some* ionic character, and the dipole moment lets us put a number on it.\n\n" +
      "Imagine the bond were **100% ionic** — a whole electron fully transferred. Then the charge $q$ would be one full electronic charge ($e$), separated by the bond length $d$, giving an *ideal* dipole moment $\\mu_{\\text{ionic}} = e \\times d$. The bond is never that extreme, so the **observed** dipole moment is always smaller. The ratio tells us how ionic the bond really is:\n\n" +
      "$\\text{Percent ionic character} = \\dfrac{\\mu_{\\text{observed}}}{\\mu_{\\text{ionic (100\\%)}}} \\times 100$\n\n" +
      "For \\ce{HCl}, the observed dipole is about $1.03\\,\\text{D}$, while a fully ionic \\ce{H+Cl-} at the same bond length would give about $6.1\\,\\text{D}$. So \\ce{HCl} is roughly $\\dfrac{1.03}{6.1} \\times 100 \\approx 17\\%$ ionic — mostly covalent, but with a real ionic streak. That 17% is a number worth remembering." },

    // 10 — worked example 1: identify zero-dipole molecules (tap_to_reveal)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Counting the Non-Polar Molecules',
      problem: "From the following set, identify which molecules have **zero** dipole moment: \\ce{CO2}, \\ce{H2O}, \\ce{BF3}, \\ce{NH3}, \\ce{CCl4}, \\ce{CHCl3}.",
      solution: "Draw the shape of each, then check whether the bond dipoles cancel by symmetry.\n\n" +
        "**\\ce{CO2}** — linear, two opposite \\ce{C=O} dipoles cancel → **zero**.\n\n" +
        "**\\ce{H2O}** — bent, dipoles add → non-zero.\n\n" +
        "**\\ce{BF3}** — trigonal planar, three symmetric dipoles cancel → **zero**.\n\n" +
        "**\\ce{NH3}** — pyramidal, dipoles + lone pair add → non-zero.\n\n" +
        "**\\ce{CCl4}** — tetrahedral, four identical \\ce{C-Cl} dipoles cancel → **zero**.\n\n" +
        "**\\ce{CHCl3}** — tetrahedral but **not** symmetric: one bond is \\ce{C-H}, three are \\ce{C-Cl}. The four dipoles are no longer identical, so they do **not** cancel → non-zero.\n\n" +
        "**Answer:** three molecules have zero dipole — \\ce{CO2}, \\ce{BF3}, and \\ce{CCl4}. The trap is \\ce{CHCl3}: it *looks* tetrahedral like \\ce{CCl4}, but replacing one Cl with H breaks the symmetry, so it stays polar." },

    // 11 — worked example 2: percent ionic character calc (tap_to_reveal)
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Percent Ionic Character',
      problem: "The \\ce{HF} bond has a length of $0.917\\,\\text{Å}$ and an observed dipole moment of $1.91\\,\\text{D}$. Estimate the percent ionic character of the \\ce{H-F} bond. (Use: a 100% ionic bond of length $1\\,\\text{Å}$ gives $\\mu = 4.8\\,\\text{D}$.)",
      solution: "First find the dipole moment a **fully ionic** \\ce{H+F-} would have at this bond length.\n\n" +
        "**Ideal (100% ionic) dipole:**\n\n" +
        "$\\mu_{\\text{ionic}} = 4.8 \\times 0.917 = 4.40\\,\\text{D}$\n\n" +
        "(because $1\\,\\text{Å}$ of full-charge separation = $4.8\\,\\text{D}$, so $0.917\\,\\text{Å}$ scales it down)\n\n" +
        "**Now take the ratio of observed to ideal:**\n\n" +
        "$\\text{Percent ionic} = \\dfrac{1.91}{4.40} \\times 100$\n\n" +
        "$= 43\\%$\n\n" +
        "**Answer:** the \\ce{H-F} bond is about **43% ionic** — far more ionic than \\ce{HCl} (~17%), which makes sense because fluorine is the most electronegative atom and pulls the shared pair hardest." },

    // 12 — table: molecule → shape → μ → polar?
    { id: uuidv4(), order: n(), type: 'table', caption: 'Shape decides polarity — symmetric shapes cancel to zero',
      headers: ['Molecule', 'Shape', 'μ (D)', 'Polar?'],
      rows: [
        ['CO₂', 'Linear', '0', 'Non-polar'],
        ['BF₃', 'Trigonal planar', '0', 'Non-polar'],
        ['CCl₄', 'Tetrahedral', '0', 'Non-polar'],
        ['H₂O', 'Bent', '1.85', 'Polar'],
        ['NH₃', 'Pyramidal', '1.47', 'Polar'],
        ['NF₃', 'Pyramidal', '0.23', 'Weakly polar'],
      ] },

    // 13 — heading: the CH3F vs CH3Cl exception
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The CH₃F vs CH₃Cl Trap — When the Reflex Fails',
      objective: 'Resist the "more electronegative = bigger dipole" reflex by remembering μ = q × d.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Here's a question that catches even strong students. Which has the larger dipole moment — \\ce{CH3F} or \\ce{CH3Cl}?\n\n" +
      "**The reflex:** fluorine is more electronegative than chlorine, so the \\ce{C-F} bond is more polar, so \\ce{CH3F} *must* have the bigger dipole. It feels obvious.\n\n" +
      "**The reality:** experimentally, \\ce{CH3Cl} ($1.87\\,\\text{D}$) edges out \\ce{CH3F} ($1.85\\,\\text{D}$). The reflex is wrong.\n\n" +
      "Why? Go back to the definition: $\\mu = q \\times d$. Dipole moment depends on charge separation **and the distance over which it's separated**. Fluorine gives a bigger $q$ (greater charge), but chlorine is a much bigger atom, so the \\ce{C-Cl} bond is *longer* — a bigger $d$. The extra bond length in \\ce{CH3Cl} more than makes up for the smaller charge, so it ends up with the slightly larger dipole.\n\n" +
      "This is an **NCERT-listed exception** — write it down and practise it once, or you won't recall it under exam pressure. The lesson is general: never judge a dipole on electronegativity alone; the *distance* term is doing quiet work." },

    // 14 — image: NH3 vs NF3 dipole directions + CH3F/CH3Cl idea
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '4:3',
      alt: 'NH3 with bond dipoles and lone pair adding upward versus NF3 with bond dipoles opposing the lone pair',
      caption: '📸 In NH₃ the lone pair and bonds pull the same way; in NF₃ they fight',
      generation_prompt: 'Comparison diagram of two pyramidal molecules. Left: ammonia NH3 drawn as a pyramid with nitrogen at the apex and three hydrogens at the base; three N-H bond-dipole arrows point up toward the nitrogen, and a lone-pair dipole arrow also points up out of the top of the nitrogen — show them all reinforcing into a large net dipole arrow pointing up, labelled 1.47 D. Right: nitrogen trifluoride NF3 drawn as the same pyramid with nitrogen at apex and three fluorines at the base; three N-F bond-dipole arrows point down toward the fluorines, while the lone-pair dipole still points up out of the top — show them opposing, leaving only a tiny net dipole arrow, labelled 0.23 D. Make the direction of every arrow unmistakable. Label: NH3 (dipoles add, 1.47 D), NF3 (dipoles oppose, 0.23 D), lone pair, bond dipole, net dipole. Dark background (#0a0a0a or near-black), orange accent labels and arrows, clean technical illustration style.' },

    // 15 — text: polarity consequences (like dissolves like + charged comb logic)
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Polarity isn't just a number on a page — it decides how molecules *behave*.\n\n" +
      "**\"Like dissolves like.\"** Polar substances dissolve in polar solvents; non-polar in non-polar. Salt and sugar dissolve in water (polar); they won't dissolve in petrol (non-polar). Oil refuses to mix with water for the same reason — opposite polarities don't welcome each other.\n\n" +
      "**The charged comb, finally explained.** A charged comb sets up an electric field. A **polar substance is attracted to a polar field** — water's molecules have a permanent dipole, so the field tugs on them and the stream bends. \\ce{CCl4} has zero net dipole, so the field has nothing to grab, and its stream falls straight. That's the entire logic behind the famous IIT question: identify which liquids would deflect near a charged rod, and the answer is simply *the polar ones*." },

    // 16 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The One Rule + The Three Values',
      markdown: "**Symmetry → bond dipoles cancel → non-polar.** Draw the shape first, then add the bond-dipole vectors. Symmetric (linear, trigonal planar, tetrahedral, octahedral with identical atoms) → $\\mu = 0$. Bent or pyramidal → expect a dipole.\n\n" +
        "And **memorise these three values** — they show up again and again: \\ce{H2O} $= 1.85\\,\\text{D}$, \\ce{NH3} $= 1.47\\,\\text{D}$, \\ce{NF3} $= 0.23\\,\\text{D}$. Write them down and practise once, or they slip away by exam day." },

    // 17 — exam_tip
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "**Four dipole questions the exams ask on repeat:**\n\n" +
        "**\\ce{NH3} > \\ce{NF3}:** in \\ce{NH3} the lone-pair dipole and \\ce{N-H} bond dipoles point the same way and add; in \\ce{NF3} the \\ce{N-F} dipoles oppose the lone pair and nearly cancel. Classic comparison — know the *direction* argument, not just the values.\n\n" +
        "**\\ce{CH3Cl} > \\ce{CH3F}:** the reflex (F more electronegative) fails because $\\mu = q \\times d$ and the \\ce{C-Cl} bond is longer (bigger $d$). NCERT-listed exception.\n\n" +
        "**Zero-dipole counting:** \"How many of these molecules are non-polar?\" — answered by spotting the symmetric shapes (\\ce{CO2}, \\ce{BF3}, \\ce{CCl4}, \\ce{SF6}). Watch the trap: \\ce{CHCl3} looks like \\ce{CCl4} but is polar.\n\n" +
        "**Percent ionic character:** $\\dfrac{\\mu_{\\text{observed}}}{\\mu_{\\text{100\\% ionic}}} \\times 100$. \\ce{HCl} $\\approx 17\\%$, \\ce{HF} $\\approx 43\\%$ — ionic character rises with electronegativity difference." },

    // 18 — inline_quiz (LAST block, §3.6.1)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 1,
          question: 'Carbon tetrachloride (\\ce{CCl4}) has four polar \\ce{C-Cl} bonds, yet its net dipole moment is zero. What is the reason?',
          options: [
            'The \\ce{C-Cl} bonds are actually non-polar because carbon and chlorine have equal electronegativity',
            'Its tetrahedral shape is symmetric, so the four equal bond dipoles point to the corners and cancel exactly',
            'Chlorine atoms are too heavy to set up any charge separation',
            'The lone pairs on the chlorine atoms cancel the bond dipoles one by one'
          ],
          correct_index: 1,
          explanation: 'Each \\ce{C-Cl} bond is genuinely polar, but in a symmetric tetrahedron the four identical bond-dipole vectors sum to zero. It is the shape, not the absence of bond polarity, that makes \\ce{CCl4} non-polar — which is why a charged comb cannot deflect it.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Both \\ce{NH3} and \\ce{NF3} are pyramidal with a lone pair on nitrogen, yet \\ce{NH3} (1.47 D) has a much larger dipole than \\ce{NF3} (0.23 D). Why?',
          options: [
            'Hydrogen is more electronegative than fluorine, giving \\ce{NH3} more polar bonds',
            'In \\ce{NH3} the bond dipoles and the lone-pair dipole point the same way and add, while in \\ce{NF3} the \\ce{N-F} dipoles oppose the lone-pair dipole and nearly cancel',
            '\\ce{NF3} is planar, so its bond dipoles cancel completely',
            '\\ce{NH3} contains more atoms, and more atoms always raise the dipole moment'
          ],
          correct_index: 1,
          explanation: 'In \\ce{NH3}, N is more electronegative than H, so the \\ce{N-H} dipoles point toward N — the same direction as the lone-pair dipole — and they add. In \\ce{NF3}, F is more electronegative than N, so the \\ce{N-F} dipoles point away from N, opposing the lone pair, and they almost cancel. Both molecules are pyramidal, so shape is not the difference — the direction of the bond dipoles is.' },
        { id: uuidv4(), difficulty_level: 3,
          question: 'Experimentally, \\ce{CH3Cl} (1.87 D) has a slightly larger dipole moment than \\ce{CH3F} (1.85 D), even though fluorine is more electronegative than chlorine. What explains this?',
          options: [
            'The \\ce{C-F} bond is actually less polar than the \\ce{C-Cl} bond because chlorine pulls electrons harder',
            'Since $\\mu = q \\times d$, the longer \\ce{C-Cl} bond (larger $d$) outweighs fluorine\'s larger charge separation (larger $q$)',
            '\\ce{CH3Cl} is bent while \\ce{CH3F} is linear, so only \\ce{CH3Cl} has a net dipole',
            'Chlorine has more lone pairs than fluorine, and each lone pair adds to the dipole moment'
          ],
          correct_index: 1,
          explanation: 'Dipole moment is charge times distance. Fluorine creates a larger charge ($q$), but chlorine is a bigger atom, so the \\ce{C-Cl} bond is noticeably longer ($d$). The extra bond length more than compensates for the smaller charge, giving \\ce{CH3Cl} the marginally larger dipole. This is the NCERT-listed exception that defeats the "more electronegative wins" reflex.' },
      ] },

    // 19 — bridge: CLOSE Arc B, preview Arc C
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*And that closes the story of **shape and polarity**. Across this arc you learned to predict a molecule's geometry with VSEPR, read its bond angles, and now decide whether it is polar from the way its bond dipoles add or cancel. Master the structure and every question — shape, hybridisation, dipole, lone pairs — falls out of it.*\n\n" +
      "*But one question has been quietly waiting: we kept saying atoms \"share\" electrons to bond — yet **what is a shared pair, really?** A drawn line, a dot pair, a vector — these are pictures, not the physics. Next we go under the hood with the two deeper models that explain bonding from the orbitals up: **Valence Bond Theory** and **Molecular Orbital Theory**. That is Arc C, and it's where chemical bonding gets genuinely beautiful.*" },
  ];
}

bw.withDb(async (db) => {
  const pages = db.collection('book_pages');
  const books = db.collection('books');
  const book = await books.findOne({ slug: BOOK_SLUG });
  if (!book) throw new Error('book not found');

  if (await pages.findOne({ book_id: book._id, slug: NEW_SLUG })) {
    console.log(`⚠  ${NEW_SLUG} already exists — skipping (idempotent).`);
    return;
  }

  const blocks = buildBlocks();
  const newId = uuidv4();
  const now = new Date();
  const doc = {
    _id: newId, book_id: book._id, chapter_number: CH, page_number: PAGE_NUMBER,
    slug: NEW_SLUG, title: 'Dipole Moment — Is the Molecule Polar?',
    subtitle: 'Bond dipoles are vectors — their sum decides whether the whole molecule is polar.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'dipole-moment', 'molecular-polarity', 'percent-ionic-character'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    page_type: 'lesson', created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted "${doc.title}" — ch${CH} page ${PAGE_NUMBER}, ${blocks.length} blocks, published:false`);

  // Wire into chapter 4 page_ids (append at end — this page closes Arc B).
  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 4 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.push(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ appended page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 14 (dipole moment & polarity, closes Arc B)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
