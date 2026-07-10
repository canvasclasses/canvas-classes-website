'use strict';
/**
 * Class 11 Chemistry — Ch.4 Chemical Bonding — MOT applied, Page 18.
 * "MOT in Action — Bond Order, Magnetism & Why He₂ Doesn't Exist".
 * Fills molecular orbitals; the σ2p/π2p energy-order swap at N₂; bond order
 * (formula + the published 8–14 / 15–20 shortcut); paramagnetism (O₂ the star);
 * the walk H₂→F₂; ions O₂⁺/O₂⁻/O₂²⁻ and NO/NO⁺; isoelectronic same-BO set
 * (CO, NO⁺, CN⁻, N₂); heteronuclear CO & CN⁻ (HOMO/LUMO, why CO binds metals
 * through carbon); equal-BO tiebreak (fewer antibonding = more stable).
 *
 * Grounded in Mittal §20.2–20.5 (H₂; breaking bonds; "nothing like He₂"; 2s & 2p;
 * bond order; bond strength; periodic trend; heteronuclear CN⁻/CO) + NCERT Class 11
 * Ch.4 + standard JEE treatment. Every electron count / bond order verified against
 * Mittal's Table 20.2.5 and the chapter answer key — none fabricated.
 *
 * Voice: BOND-exemplars.md (He₂ "main aise hi khush tha"; N₂ two refusals;
 * O₂ "le jao yaar inko"; NO→NO⁺ "panauti gayi"; published BO shortcut;
 * isoelectronic; sp-mixing swap; nodal planes; HOMO/LUMO/SOMO; equal-BO tiebreak)
 * + teacher-voice-profile.md.
 *
 * Chapter 4 already has earlier pages; this appends at page_number 18.
 * published:false — founder reviews + generates the pending image, then publishes.
 * Run: node scripts/insert_bond_p18_mot-applied.js
 */
const bw = require('./lib/book-writer');
const { v4: uuidv4 } = require('uuid');

const BOOK_SLUG = 'ncert-simplified';
const CH = 4;
const PAGE_NUMBER = 18;
const NEW_SLUG = 'mot-bond-order-magnetism';

function buildBlocks() {
  let o = 0; const n = () => o++;
  return [
    // 0 — hero banner (16:5)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '', aspect_ratio: '16:5',
      alt: 'A molecular-orbital energy ladder with electrons filling rungs, an O2 molecule with two glowing unpaired electrons, clinging to a magnet',
      caption: '',
      generation_prompt: 'Ultra-wide cinematic banner (16:5). A vertical molecular-orbital energy-level ladder on the left, electrons (small glowing dots, some paired arrows up-down, two of them single and unpaired) filling the rungs from the bottom up. On the right, a luminous O2 diatomic molecule with two highlighted unpaired electrons, faintly clinging to the pole of a horseshoe magnet — suggesting magnetism. A sense of "counting electrons to predict a real property." Clean technical illustration style. Dark background (#0a0a0a or near-black), orange accent labels. No text.' },

    // 1 — fun_fact hook (liquid oxygen sticks to a magnet)
    { id: uuidv4(), order: n(), type: 'callout', variant: 'fun_fact', title: 'Oxygen Sticks to a Magnet',
      markdown: "Pour pale-blue **liquid oxygen** between the poles of a strong magnet and it does something water never would: it **clings there**, bridging the gap, refusing to fall. Oxygen is *magnetic*. The old dot-and-cross picture of $\\ce{O2}$ — a tidy double bond with every electron neatly paired — flatly cannot explain this; a fully paired molecule would be pushed *away* by a magnet, not pulled in. Molecular Orbital Theory predicts the magnetism **exactly**, and it does so just by counting electrons into the right boxes. That one experiment is why MOT exists." },

    // 2 — core concept text: filling MOs
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "On the last page you saw *where* molecular orbitals come from: two atomic orbitals overlap and split into a low-energy **bonding** orbital ($\\sigma$, $\\pi$) and a high-energy **antibonding** one ($\\sigma^*$, $\\pi^*$). Now we put the electrons in and read off real properties.\n\n" +
      "The rule is the same one you used for atoms. **Fill the molecular orbitals from the lowest energy upward, two electrons per orbital, pairing up only after every orbital at that level has one electron** (Aufbau, Pauli, Hund — unchanged). Count the molecule's total electrons, drop them in, and the diagram tells you the bond strength *and* the magnetism.\n\n" +
      "There is exactly **one** twist you must respect, and it is the single most-tested point in this whole topic." },

    // 3 — heading: the energy-order swap
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'The Energy-Order Swap at N₂',
      objective: 'Know which orbital sits lower — π2p or σ2p — and exactly where the order flips, so you fill every diatomic correctly.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "For the second-period diatomics there are **two** filling orders, and you must pick the right one:\n\n" +
      "**Up to and including $\\ce{N2}$** (lighter atoms — $\\ce{Li2}$, $\\ce{Be2}$, $\\ce{B2}$, $\\ce{C2}$, $\\ce{N2}$): the two $\\pi 2p$ orbitals lie **below** $\\sigma 2p$.\n\n" +
      "**From $\\ce{O2}$ onward** ($\\ce{O2}$, $\\ce{F2}$, $\\ce{Ne2}$): the normal order returns — $\\sigma 2p$ lies **below** the $\\pi 2p$ orbitals.\n\n" +
      "**Why the flip?** In the lighter atoms the $2s$ and $2p$ energies are close together, so the $2s$ and $2p_z$ orbitals (same symmetry) interfere with — \"mix\" with — each other and push the $\\sigma 2p$ *up*, above the $\\pi$. By oxygen the $2s$ has dropped well below $2p$, the mixing fades, and $\\sigma 2p$ settles back below $\\pi 2p$. You do not need the maths — you need the rule: **$\\pi 2p$ below $\\sigma 2p$ up to $\\ce{N2}$; then they swap.** That is the only thing that changes; everything else about filling is identical." },

    // 4 — heading: bond order + the published shortcut
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Bond Order — and a Shortcut That Is Actually Published',
      objective: 'Compute bond order from the formula, then check it in seconds with the electron-count shortcut.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "A **bond** is a pair of electrons in a bonding orbital; an electron in an antibonding orbital is an **anti-bond** that cancels one. So the net number of bonds is:\n\n" +
      "$\\text{Bond order} = \\tfrac{1}{2}\\,(\\,N_b - N_a\\,)$\n\n" +
      "where $ N_b $ = electrons in bonding orbitals and $ N_a $ = electrons in antibonding orbitals. A bond order of 1 is a single bond, 2 a double, 3 a triple — and **fractional values (½, 1.5, 2.5) are perfectly real**; the molecule does not care that we can only draw whole lines.\n\n" +
      "**The shortcut (count the total electrons $ n $):** for period-2 diatomics it turns out that\n\n" +
      "- if $ n $ is between **8 and 14**: bond order $= \\dfrac{n - 8}{2}$\n" +
      "- if $ n $ is between **15 and 20**: bond order $= \\dfrac{20 - n}{2}$\n\n" +
      "This is not a hack someone made up — it is a published relationship that falls straight out of the filling order. Check it against $\\ce{N2}$ ($ n=14 \\Rightarrow (14-8)/2 = 3 $) and $\\ce{O2}$ ($ n=16 \\Rightarrow (20-16)/2 = 2 $). It will save you from drawing the full diagram under exam pressure — but draw it at least once per species while you are learning, so you trust the number." },

    // 5 — heading: magnetism, O2 the star
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Magnetism — Why O₂ Is the Showpiece',
      objective: 'Read paramagnetic vs diamagnetic straight off the diagram by counting unpaired electrons.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The diagram gives you magnetism for free:\n\n" +
      "- **One or more unpaired electrons → paramagnetic** (attracted into a magnetic field — the liquid-oxygen trick).\n" +
      "- **All electrons paired → diamagnetic** (weakly pushed out of the field).\n\n" +
      "Now $\\ce{O2}$, with 16 electrons. Using the post-$\\ce{N2}$ order, the last four electrons go: two into $\\sigma 2p$ (paired), four into the $\\pi 2p$ pair (paired) — and then **two electrons left over must go into the two $\\pi^* 2p$ orbitals, one in each, by Hund's rule.** Those **two unpaired $\\pi^*$ electrons** are the whole story: they make $\\ce{O2}$ **paramagnetic**, exactly as the magnet shows. The Lewis structure, with its tidy paired double bond, simply has nowhere to hide two unpaired electrons — which is why VSEPR and dot-structures fail here and MOT wins." },

    // 6 — image: O2 MO energy-level diagram (the centrepiece)
    { id: uuidv4(), order: n(), type: 'image', width: 'full', src: '',
      alt: 'Molecular orbital energy-level diagram of O2 showing two singly-occupied pi-star antibonding orbitals, giving bond order 2 and paramagnetism',
      caption: '📸 O₂: two unpaired electrons sitting alone in the π* level — bond order 2, and paramagnetic',
      generation_prompt: 'Molecular orbital energy-level diagram for the oxygen molecule O2. Centre column of molecular orbitals between the two oxygen atomic-orbital columns (left and right). From bottom to top label the MOs: sigma2s (filled, paired arrows), sigma-star2s (filled), then sigma2p (filled, since O2 uses the post-N2 order with sigma below pi), then a degenerate pair pi2p (both filled, paired), then a degenerate pair pi-star2p containing TWO electrons shown as two SINGLE up-arrows, ONE in each of the two pi-star orbitals (the unpaired electrons — highlight these in a bright accent), then an empty sigma-star2p at the very top. Annotate: "2 unpaired electrons -> paramagnetic" and "Bond order = 2". Use up/down arrows for paired electrons, single up-arrows for unpaired. Dark background (#0a0a0a or near-black), orange accent labels, clean technical illustration style.' },

    // 7 — heading: walking the diatomics
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Walking the Diatomics: H₂ → He₂ → N₂ → O₂ → F₂',
      objective: 'Fill five key molecules end to end and watch bond order and magnetism fall out each time.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "Let us count, out loud, from smallest to largest.\n\n" +
      "**$\\ce{H2}$ (2 e⁻):** both electrons go into $\\sigma 1s$. $N_b = 2$, $N_a = 0$ → **bond order 1**, all paired → **diamagnetic**. A single bond, just as Lewis says.\n\n" +
      "**$\\ce{He2}$ (4 e⁻):** $\\sigma 1s$ fills (2), and the next 2 are *forced* into $\\sigma^* 1s$. $N_b = 2$, $N_a = 2$ → **bond order 0**. No net bond, so **$\\ce{He2}$ does not exist.** Hear it in helium's own voice: *\"I was perfectly happy on my own. Joining you didn't lower my energy — the antibonding electrons pushed it back UP.\"* The antibonding orbital destabilises a touch *more* than the bonding orbital stabilises, so two filled He atoms gain nothing by pairing. That asymmetry — antibonding hurts more than bonding helps — is a rule you will reuse below.\n\n" +
      "**$\\ce{N2}$ (14 e⁻, $\\pi$ below $\\sigma$):** $(\\sigma 2s)^2(\\sigma^* 2s)^2(\\pi 2p)^4(\\sigma 2p)^2$. $N_b = 8$, $N_a = 2$ → **bond order 3**, everything paired → **diamagnetic**. This triple bond is one of the strongest in all of chemistry, and it explains why $\\ce{N2}$ is so unreactive — **two refusals**: it *won't give* an electron, because its highest filled orbital ($\\sigma 2p$) is deep and stable; and it *won't take* one, because the next empty orbital is an antibonding $\\pi^*$, and no molecule wants an electron there. Closed on both sides.\n\n" +
      "**$\\ce{O2}$ (16 e⁻, $\\sigma$ below $\\pi$):** as above — **bond order 2**, **two unpaired $\\pi^*$ electrons → paramagnetic.** The star of the page.\n\n" +
      "**$\\ce{F2}$ (18 e⁻):** the two $\\pi^* 2p$ orbitals now fill *completely* (4 electrons). $N_b = 8$, $N_a = 6$ → **bond order 1**, all paired → **diamagnetic**. A single bond, exactly the Lewis $\\ce{F-F}$." },

    // 8 — table: the master count
    { id: uuidv4(), order: n(), type: 'table', caption: 'Count the electrons → bonding − antibonding → bond order and magnetism',
      headers: ['Species', 'Total e⁻', 'Bonding e⁻', 'Antibonding e⁻', 'Bond order', 'Unpaired e⁻', 'Magnetism'],
      rows: [
        ['$\\ce{H2}$', '2', '2', '0', '1', '0', 'Diamagnetic'],
        ['$\\ce{He2}$', '4', '2', '2', '0', '0', '— (does not exist)'],
        ['$\\ce{N2}$', '14', '8', '2', '3', '0', 'Diamagnetic'],
        ['$\\ce{O2}$', '16', '8', '4', '2', '2', 'Paramagnetic'],
        ['$\\ce{F2}$', '18', '8', '6', '1', '0', 'Diamagnetic'],
        ['$\\ce{O2^+}$', '15', '8', '3', '2.5', '1', 'Paramagnetic'],
        ['$\\ce{NO}$', '15', '8', '3', '2.5', '1', 'Paramagnetic'],
        ['$\\ce{CO}$', '14', '8', '2', '3', '0', 'Diamagnetic'],
      ] },

    // 9 — heading: ions and isoelectronic species
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Add or Remove Electrons: The O₂ Ions, and NO → NO⁺',
      objective: 'Predict how bond order and magnetism shift when you charge a molecule up or down.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "The power of MOT is that you can *edit* the electron count and read the consequence.\n\n" +
      "Start from $\\ce{O2}$ (16 e⁻, two electrons sitting in the antibonding $\\pi^*$). Those $\\pi^*$ electrons are weak, energy-raising passengers — in oxygen's own words, *\"take these away, they're useless.\"* So:\n\n" +
      "- **$\\ce{O2^+}$** (remove one $\\pi^*$ electron, 15 e⁻): antibonding drops → **bond order 2.5**, shorter, *stronger* bond. This is exactly why $\\ce{O2}$ gives up an electron fairly easily — it is *glad* to lose an antibonding passenger.\n" +
      "- **$\\ce{O2^-}$** (superoxide, add one $\\pi^*$ electron, 17 e⁻): **bond order 1.5**, one unpaired → still **paramagnetic**.\n" +
      "- **$\\ce{O2^{2-}}$** (peroxide, fill $\\pi^*$ completely, 18 e⁻): **bond order 1**, all paired → **diamagnetic**.\n\n" +
      "So the bond-strength ladder is $\\ce{O2^+} > \\ce{O2} > \\ce{O2^-} > \\ce{O2^{2-}}$ (2.5 > 2 > 1.5 > 1), and bond *length* runs the opposite way.\n\n" +
      "Now the prettiest case. **$\\ce{NO}$** has 15 electrons — one lone, unpaired electron in $\\pi^*$ (bond order 2.5, paramagnetic). Remove it to make **$\\ce{NO^+}$** (14 e⁻): that single antibonding electron — the *bad-luck charm* — is gone, the bond order rises to **3**, and the molecule becomes far more stable and diamagnetic. The cation is *more* tightly bonded than the neutral molecule, which feels backwards until you see it is just one antibonding electron leaving." },

    // 10 — reasoning_prompt (mid-page, after the ion editing)
    { id: uuidv4(), order: n(), type: 'reasoning_prompt', reasoning_type: 'logical', difficulty_level: 3,
      prompt: "When $\\ce{O2}$ loses one electron to become $\\ce{O2^+}$, what happens to its bond order, and is $\\ce{O2^+}$ paramagnetic or diamagnetic?",
      options: [
        "Bond order rises to 2.5, and $\\ce{O2^+}$ is paramagnetic — it still has one unpaired electron in $\\pi^*$",
        "Bond order falls to 1.5, and $\\ce{O2^+}$ is diamagnetic — losing an electron always pairs the rest up",
        "Bond order stays at 2, and $\\ce{O2^+}$ is diamagnetic — removing one electron cannot change the bond order",
        "Bond order rises to 3, and $\\ce{O2^+}$ is diamagnetic — it becomes just like $\\ce{N2}$"
      ],
      correct_index: 0,
      reveal: "The electron removed comes from an **antibonding** $\\pi^*$ orbital. Taking away an antibonding electron *raises* the net bonding: bond order goes from $\\tfrac{1}{2}(8-4)=2$ to $\\tfrac{1}{2}(8-3)=2.5$. $\\ce{O2}$ had two unpaired $\\pi^*$ electrons; removing one leaves **one** still unpaired, so $\\ce{O2^+}$ is still **paramagnetic** (just less so). It does not reach bond order 3 — that would need to remove *both* $\\pi^*$ electrons." },

    // 11 — heading: isoelectronic + heteronuclear CO, CN-
    { id: uuidv4(), order: n(), type: 'heading', level: 2, text: 'Isoelectronic Twins, and Why CO Grabs Metals by the Carbon',
      objective: 'Use the electron count to read off bond order for CO, CN⁻ and NO⁺ at a glance, and locate their HOMO/LUMO.' },
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "**Isoelectronic species — same number of electrons — share the same bond order.** Count to 14 and you have a whole family: $\\ce{N2}$, $\\ce{CO}$, $\\ce{NO^+}$ and $\\ce{CN^-}$ all carry **14 electrons**, all fill the orbitals identically, and so all have **bond order 3** and are all **diamagnetic**. (One level down, $\\ce{F2}$ and $\\ce{O2^{2-}}$ both have 18 electrons and both have bond order 1.) You never re-derive these — you recognise the electron count.\n\n" +
      "$\\ce{CO}$ and $\\ce{CN^-}$ are **heteronuclear** (two *different* atoms), so the energy ladder tilts — the orbitals lean toward the more electronegative atom (oxygen, nitrogen). The orbital names stay the same, and the bond order is still read by the formula, but the *occupancy is lopsided*. The key feature for later chemistry: in $\\ce{CO}$, the **HOMO** (highest filled orbital, the $\\sigma$ holding the lone pair) is concentrated on the **carbon** end, while the **LUMO** (lowest empty orbital, a $\\pi^*$) is also accessible from carbon. So when $\\ce{CO}$ binds to a metal, it does so **through its carbon atom** — the carbon offers its lone pair to the metal, and the metal pushes electron density back into $\\ce{CO}$'s empty $\\pi^*$. That carbon-first bonding is the foundation of every metal carbonyl you will meet in inorganic chemistry. (Vocabulary worth fixing: **HOMO** = highest occupied orbital, **LUMO** = lowest empty one, **SOMO** = a singly-occupied one, like the lone $\\pi^*$ electron in $\\ce{NO}$.)\n\n" +
      "**One more rule for ties.** If two species end up with the *same* bond order, the more stable one is the one with **fewer antibonding electrons** — because, as helium taught us, antibonding hurts more than bonding helps." },

    // 12 — worked_example #1: O2 bond order & magnetism
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — Bond Order & Magnetism of O₂',
      problem: "Using molecular orbital theory, find the bond order of $\\ce{O2}$ and state whether it is paramagnetic or diamagnetic. Then do the same for the superoxide ion $\\ce{O2^-}$.",
      solution: "**$\\ce{O2}$ — count the 16 electrons (use the post-$\\ce{N2}$ order, $\\sigma 2p$ below $\\pi 2p$):**\n\n" +
        "$(\\sigma 2s)^2(\\sigma^* 2s)^2(\\sigma 2p)^2(\\pi 2p)^4(\\pi^* 2p)^2$\n\n" +
        "Bonding electrons $ N_b = 2 + 2 + 4 = 8 $\n\n" +
        "Antibonding electrons $ N_a = 2 + 2 = 4 $\n\n" +
        "Bond order $ = \\tfrac{1}{2}(8 - 4) = 2 $\n\n" +
        "The last two electrons sit **one each** in the two $\\pi^* 2p$ orbitals (Hund) → **2 unpaired electrons → paramagnetic.**\n\n" +
        "*Check with the shortcut:* $ n = 16 $, so $ (20-16)/2 = 2 $. ✓\n\n" +
        "**$\\ce{O2^-}$ — add one electron (17 total):**\n\n" +
        "The extra electron goes into $\\pi^* 2p$, so now $ N_a = 5 $.\n\n" +
        "Bond order $ = \\tfrac{1}{2}(8 - 5) = 1.5 $\n\n" +
        "One $\\pi^*$ orbital is now doubly filled, the other singly → **1 unpaired electron → still paramagnetic.**\n\n" +
        "**Answer:** $\\ce{O2}$: bond order **2**, paramagnetic. $\\ce{O2^-}$: bond order **1.5**, paramagnetic. Adding an antibonding electron *weakened* the bond — exactly as expected." },

    // 13 — worked_example #2: CN- / CO via isoelectronic shortcut
    { id: uuidv4(), order: n(), type: 'worked_example', variant: 'solved_example', reveal_mode: 'tap_to_reveal',
      label: 'Solved Example — CN⁻ and CO Without Drawing a Diagram',
      problem: "Find the bond order and magnetism of the cyanide ion $\\ce{CN^-}$ and of carbon monoxide $\\ce{CO}$. (Hint: look at the electron count before you reach for the diagram.)",
      solution: "**$\\ce{CN^-}$ — count the electrons:** carbon (6) + nitrogen (7) + 1 for the negative charge $ = 14 $.\n\n" +
        "**$\\ce{CO}$ — count the electrons:** carbon (6) + oxygen (8) $ = 14 $.\n\n" +
        "Both have **14 electrons** — the same as $\\ce{N2}$. **Isoelectronic species share a bond order**, so without drawing anything:\n\n" +
        "Bond order of $\\ce{CN^-}$ = bond order of $\\ce{CO}$ = bond order of $\\ce{N2}$ = **3**.\n\n" +
        "*Check with the shortcut:* $ n = 14 $, so $ (14-8)/2 = 3 $. ✓\n\n" +
        "With 14 electrons every orbital up to the filled $\\sigma 2p$ is doubly occupied and the $\\pi^*$ level is empty → **no unpaired electrons → both are diamagnetic.**\n\n" +
        "**Answer:** $\\ce{CN^-}$ and $\\ce{CO}$ each have bond order **3** and are **diamagnetic** — triple-bonded twins of $\\ce{N2}$. (And recall: $\\ce{CO}$'s filled $\\sigma$ lone pair sits on carbon, which is why it bonds to metals through the carbon end.)" },

    // 14 — remember callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'remember', title: 'The Three Things to Carry Out of This Page',
      markdown: "**1. Bond order $ = \\tfrac{1}{2}(N_b - N_a) $.** Shortcut: $ n = 8\\text{–}14 \\Rightarrow (n-8)/2 $; $ n = 15\\text{–}20 \\Rightarrow (20-n)/2 $.\n\n" +
        "**2. Unpaired electrons → paramagnetic; all paired → diamagnetic.** $\\ce{O2}$ has 2 unpaired $\\pi^*$ electrons, so it is paramagnetic — the magnet proves MOT right.\n\n" +
        "**3. The energy order swaps at $\\ce{N2}$:** $\\pi 2p$ is **below** $\\sigma 2p$ up to and including $\\ce{N2}$; from $\\ce{O2}$ onward $\\sigma 2p$ is below $\\pi 2p$. Fill the wrong order and every count after it is wrong." },

    // 15 — exam_tip callout
    { id: uuidv4(), order: n(), type: 'callout', variant: 'exam_tip', title: 'JEE / NEET Exam Insight',
      markdown: "Examiners hit the same four buttons every year:\n\n" +
        "**The energy-order swap.** The classic distractor is a species filled in the *wrong* order. Always ask first: is it up to $\\ce{N2}$ ($\\pi$ below $\\sigma$) or $\\ce{O2}$ onward ($\\sigma$ below $\\pi$)?\n\n" +
        "**Isoelectronic = same bond order.** $\\ce{N2}$, $\\ce{CO}$, $\\ce{NO^+}$, $\\ce{CN^-}$ all have bond order 3. Spotting the shared electron count is the whole question.\n\n" +
        "**The $\\ce{O2}$ family ordering.** Remember bond order $\\ce{O2^+} > \\ce{O2} > \\ce{O2^-} > \\ce{O2^{2-}}$ (2.5 > 2 > 1.5 > 1); bond length is the reverse. $\\ce{O2^{2-}}$ (peroxide) is the only one of the four that is diamagnetic.\n\n" +
        "**Counting unpaired electrons.** \"Which is paramagnetic?\" → count unpaired electrons; $\\ce{O2}$, $\\ce{O2^+}$, $\\ce{O2^-}$, $\\ce{NO}$, $\\ce{B2}$ are para, while $\\ce{N2}$, $\\ce{F2}$, $\\ce{CO}$, $\\ce{CN^-}$, $\\ce{NO^+}$, $\\ce{O2^{2-}}$ are diamagnetic." },

    // 16 — inline_quiz (last block, §3.6.1)
    { id: uuidv4(), order: n(), type: 'inline_quiz', pass_threshold: 0.67,
      questions: [
        { id: uuidv4(), difficulty_level: 2,
          question: 'Why is molecular oxygen, $\\ce{O2}$, paramagnetic while the Lewis double-bond structure cannot explain it?',
          options: [
            'It has two unpaired electrons, one in each of its two $\\pi^* 2p$ antibonding orbitals',
            'It has a bond order of exactly 2, and any molecule with an even bond order is paramagnetic',
            'Its two oxygen atoms repel each other, creating a magnetic field along the bond',
            'All of its electrons are paired, but they spin fast enough to act like tiny magnets'
          ],
          correct_index: 0,
          explanation: 'Filling $\\ce{O2}$\'s 16 electrons leaves two electrons that must occupy the two degenerate $\\pi^* 2p$ orbitals singly (Hund). Those two unpaired electrons make it paramagnetic. A Lewis structure pairs everything into a neat double bond, so it has nowhere to put the unpaired electrons — that is exactly why MOT is needed. Bond order being even has nothing to do with magnetism.' },
        { id: uuidv4(), difficulty_level: 2,
          question: 'Which set of species all have a bond order of 3?',
          options: [
            '$\\ce{O2}$, $\\ce{F2}$ and $\\ce{O2^{2-}}$',
            '$\\ce{N2}$, $\\ce{CO}$, $\\ce{NO^+}$ and $\\ce{CN^-}$',
            '$\\ce{O2^+}$, $\\ce{NO}$ and $\\ce{O2^-}$',
            '$\\ce{H2}$, $\\ce{Li2}$ and $\\ce{He2^+}$'
          ],
          correct_index: 1,
          explanation: '$\\ce{N2}$, $\\ce{CO}$, $\\ce{NO^+}$ and $\\ce{CN^-}$ each have 14 electrons, so they are isoelectronic and all have bond order 3. $\\ce{O2}/\\ce{F2}/\\ce{O2^{2-}}$ have bond orders 2/1/1; $\\ce{O2^+}/\\ce{NO}/\\ce{O2^-}$ are 2.5/2.5/1.5; $\\ce{H2}/\\ce{Li2}/\\ce{He2^+}$ are 1/1/0.5.' },
        { id: uuidv4(), difficulty_level: 3,
          question: 'Going from $\\ce{NO}$ to $\\ce{NO^+}$, what happens and why?',
          options: [
            'Bond order drops from 3 to 2.5 because an electron is added to a bonding orbital',
            'Bond order stays at 2.5 because the removed electron was a non-bonding lone pair',
            'Bond order rises from 2.5 to 3 because the electron removed came from an antibonding $\\pi^*$ orbital',
            'Bond order rises from 2 to 3 because removing any electron always strengthens a bond'
          ],
          correct_index: 2,
          explanation: '$\\ce{NO}$ (15 e⁻) carries one electron in an antibonding $\\pi^*$ orbital, giving bond order $\\tfrac{1}{2}(8-3)=2.5$. Removing that single antibonding electron to form $\\ce{NO^+}$ (14 e⁻) leaves $\\tfrac{1}{2}(8-2)=3$ — the cation is more strongly bonded. Removing an electron only strengthens the bond when it comes from an antibonding orbital, not in general.' },
      ] },

    // 17 — bridge to next page
    { id: uuidv4(), order: n(), type: 'text', markdown:
      "*You can now take any small diatomic, count its electrons, and predict its bond order, bond strength and magnetism — the things you can actually measure. So far every bond we have built joins a handful of atoms. Next we turn to a bond shared by a near-infinite sea of atoms at once — **metallic bonding and band theory** — where those same molecular orbitals smear into continuous bands and explain why metals conduct, shine, and bend.*" },
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
    slug: NEW_SLUG, title: 'MOT in Action — Bond Order, Magnetism & Why He₂ Doesn\'t Exist',
    subtitle: 'Fill the molecular orbitals, count bonding minus antibonding, and read off bond order and magnetism — including why O₂ sticks to a magnet.',
    blocks,
    hinglish_blocks: [], tags: ['chemical-bonding', 'molecular-orbital-theory', 'bond-order', 'paramagnetism', 'mot'],
    published: false,
    reading_time_min: bw.computeReadingTime(blocks),
    content_types: bw.computeContentTypes(blocks),
    page_type: 'lesson', created_at: now, updated_at: now,
    deleted_at: null, deleted_by: null, deletion_reason: null,
  };
  await pages.insertOne(doc);
  console.log(`✓ inserted "${doc.title}" — ch${CH} page ${PAGE_NUMBER}, ${blocks.length} blocks, published:false`);

  // Wire into chapter 4 page_ids (append).
  const ch = book.chapters.find((c) => c.number === CH);
  if (!ch) throw new Error('chapter 4 not found in book.chapters');
  ch.page_ids = ch.page_ids || [];
  if (!ch.page_ids.includes(newId)) ch.page_ids.push(newId);
  await books.updateOne({ _id: book._id, 'chapters.number': CH }, { $set: { 'chapters.$.page_ids': ch.page_ids } });
  console.log(`✓ appended page_id into chapter ${CH} page_ids (now ${ch.page_ids.length})`);

  await bw.snapshotVersion(db, doc, 'baseline — new bonding page 18 (MOT applied: bond order, magnetism, real diatomics)', 'agent');
  console.log('✓ baseline version snapshot taken');
}).catch((e) => { console.error('❌', e.message); process.exit(1); });
