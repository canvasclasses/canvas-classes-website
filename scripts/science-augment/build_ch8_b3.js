'use strict';
/**
 * Ch8 "Journey Inside the Atom" — AUGMENT batch 3: pages 96–99.
 * atomic-mass-unit, indian-scientists-atomic-science, journey-inside-the-atom (recap),
 * frontier-understanding-atom. p98/p99 have no existing quiz → a fresh quiz is appended.
 * Grounded in iesc108.pdf. published stays false.
 *   node scripts/science-augment/build_ch8_b3.js [--dry]
 */
const { img, cur, reason, q, applyAug } = require('./_lib');
const DIAG = (alt, prompt) => img(alt, prompt, '4:3');

applyAug([
  // ── p96 atomic-mass-unit ────────────────────────────────────────────────────
  {
    slug: 'atomic-mass-unit',
    subtitle: 'Why chlorine\'s mass is listed as 35.5 — when no single chlorine atom weighs that',
    hook: cur(
      'Open any chemistry book and chlorine\'s mass is listed as 35.5 — and that is strange, because no single chlorine atom actually weighs 35.5. Atoms come in whole units; you cannot have half a particle. So where does this in-between number come from, and what does it really stand for?',
      'Chlorine atoms come in two different weights, and not in equal numbers.',
      'Chlorine exists as two isotopes — chlorine-35 (about 75%) and chlorine-37 (about 25%). The 35.5 u listed is the weighted average atomic mass, counting each isotope by how common it is. No single atom weighs 35.5 u; it is the average across all of them. (Atoms are far too tiny to weigh in grams, so we use the unified atomic mass unit, u.)'
    ),
    hero: img(
      'A large crowd of chlorine atoms, most of one weight and a smaller share heavier, averaging to a single value',
      'Ultra-wide cinematic banner (16:5 ratio). A crowd of glowing chlorine atoms drifting across the frame — about three-quarters of one size and one-quarter slightly larger/heavier — with a faint balance or average line suggesting their combined average. Conveys a weighted average mass. Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'A worked weighted-average calculation for chlorine using its two isotopes and their abundances',
      'Educational diagram of a weighted average. Clean technical illustration on a dark background (#0a0a0a or near-black). Show chlorine-35 at 75% and chlorine-37 at 25%, then the calculation (35 x 0.75) + (37 x 0.25) = 26.25 + 9.25 = 35.5 u. Keep numbers large and clear. Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('quantitative',
      'Bromine has two isotopes that occur in almost equal amounts: bromine-79 (about 50%) and bromine-81 (about 50%). Roughly what is its average atomic mass?',
      [
        'About 80',
        'About 79',
        'About 81',
        'About 160',
      ],
      0,
      'With a near 50–50 split, the average sits midway between 79 and 81, which is about 80. "About 160" is the trap — that would be adding the two masses instead of averaging them.',
      3),
    quiz: [
      q('The masses of atoms are measured using the —',
        ['unified atomic mass unit (u)', 'kilogram', 'gram', 'newton'], 0,
        'Atoms are weighed in unified atomic mass units (u) because they are far too tiny for grams or kilograms. "Newton" is the trap — that is a unit of force, not mass.',
        1),
      q('Why is the unified atomic mass unit (u) used for atoms instead of the kilogram?',
        [
          'Atoms are far too tiny to weigh sensibly in kilograms',
          'The kilogram cannot measure anything smaller than a gram',
          'Atoms are actually too heavy for the kilogram',
          'The unit u measures the size of an atom, not its mass',
        ], 0,
        'A single atom\'s mass in kilograms would be an absurdly small decimal, so a tiny unit (u) is used instead. "Too heavy for the kilogram" is the opposite of the truth — atoms are unimaginably light.',
        2),
      q('Chlorine\'s average atomic mass is 35.5 u, yet no single chlorine atom weighs 35.5 u. Why?',
        [
          'It is a weighted average of its two isotopes (chlorine-35 and chlorine-37), counted by how common each is',
          'Half of all chlorine atoms are broken in two',
          'Chlorine atoms slowly lose mass over time',
          '35.5 is simply a rounding error in old textbooks',
        ], 0,
        'The 35.5 comes from averaging the two isotopes by their abundance, not from any one atom. "Atoms lose mass over time" is the trap — atomic masses are fixed; the half-value is purely an average.',
        3),
    ],
  },

  // ── p97 indian-scientists-atomic-science ────────────────────────────────────
  {
    slug: 'indian-scientists-atomic-science',
    subtitle: 'From a sage\'s parmanu to nuclear reactors — how India came full circle on the atom',
    hook: cur(
      'Our journey inside the atom began in India, with an ancient sage imagining the parmanu using nothing but reasoning. Thousands of years later, India came full circle — building reactors that actually split atoms to generate electricity. The scientist who led that leap had a bold dream for a newly independent country. Who turned the ancient idea of the atom into modern Indian science?',
      'He is remembered as the father of India\'s nuclear programme.',
      'Homi Jehangir Bhabha, the father of India\'s nuclear programme, founded key institutions such as the Tata Institute of Fundamental Research (TIFR) and the Bhabha Atomic Research Centre (BARC) in Mumbai. BARC carries out advanced atomic research — including neutron-scattering experiments with reactors like Dhruva — for peaceful uses such as electricity, agriculture, and medicine.'
    ),
    hero: img(
      'A thoughtful Indian scientist before a modern atomic research centre, with a faint nucleus motif linking past and present',
      'Ultra-wide cinematic banner (16:5 ratio). The silhouette of a distinguished Indian scientist on the left looking toward a modern atomic research facility on the right, with a faint glowing nucleus and a subtle ancient-script motif tying the two together. Conveys India\'s atomic journey from ancient idea to modern science. Warm rim light against a deep dark background, painterly cinematic Indian-illustration style. No text overlay.'
    ),
    reason: reason('logical',
      'How does India\'s modern atomic research at centres like BARC connect to the ancient idea of the parmanu?',
      [
        'Both explore the same question — what matter is made of — one through reasoning, the other through experiment and technology',
        'Both used exactly the same equipment, centuries apart',
        'The parmanu idea was only proven correct after BARC was built',
        'There is no real connection; the two are about different things',
      ],
      0,
      'The parmanu and modern nuclear science are two answers to one ancient question about the nature of matter — reasoning then, experiment now. "Same equipment" is the trap — Kanad had no equipment at all; the link is the shared question, not the tools.',
      2),
    quiz: [
      q('Who is remembered as the "father of India\'s nuclear programme"?',
        ['Homi Jehangir Bhabha', 'Acharya Kanad', 'C. V. Raman', 'James Chadwick'], 0,
        'Homi Jehangir Bhabha founded TIFR and BARC and led India\'s nuclear programme. "Acharya Kanad" is the trap — he proposed the ancient parmanu idea, but did not build India\'s modern nuclear science.',
        1),
      q('What kind of work is carried out at the Bhabha Atomic Research Centre (BARC)?',
        [
          'Advanced atomic and nuclear research for peaceful uses such as electricity and medicine',
          'Only the manufacture of school laboratory equipment',
          'The study of ancient Sanskrit texts about matter',
          'Weather forecasting for Indian agriculture',
        ], 0,
        'BARC runs reactors and experiments for peaceful applications like power, medicine, and agriculture. The "ancient texts" option is the trap — it confuses the modern research centre with the philosophy that first inspired atomic ideas.',
        2),
      q('Why is it fair to say India\'s connection with atomic science stretches from ancient times to today?',
        [
          'The question "what is matter made of?" was first reasoned by Kanad and is now studied with reactors at centres like BARC',
          'The same scientists have worked on it continuously for 2,000 years',
          'India built the very first atomic model in the world',
          'Ancient texts already described protons and neutrons exactly',
        ], 0,
        'It is the same fundamental question, carried from ancient reasoning to modern experiment. "Ancient texts described protons and neutrons" is the trap — the old idea was philosophical, not the detailed modern picture.',
        3),
    ],
  },

  // ── p98 journey-inside-the-atom (recap — no existing quiz) ───────────────────
  {
    slug: 'journey-inside-the-atom',
    subtitle: 'Five pictures of the atom in a hundred years — and why being replaced is how science wins',
    hook: cur(
      'In just over a hundred years, the picture of the atom was redrawn five times — from a tiny solid ball, to a watermelon, to a planetary system, to fixed shells, to a fuzzy cloud. Each scientist was brilliant, and yet each model was "wrong" enough to be replaced by the next. Does that mean science keeps failing — or is being replaced exactly how science succeeds?',
      'Each new model explained something the one before it could not.',
      'Every model was the best explanation for the evidence available at the time, and each was improved when new evidence appeared: Dalton → Thomson → Rutherford → Bohr → the modern cloud model. Being revised is not failure — it is how science steadily gets closer to the truth.'
    ),
    hero: img(
      'A sweeping timeline of atomic models from a solid ball to a fuzzy electron cloud, glowing left to right',
      'Ultra-wide cinematic banner (16:5 ratio). A left-to-right procession of atomic models, each glowing: a solid ball (Dalton), a watermelon-like sphere (Thomson), a planetary atom (Rutherford), shells around a nucleus (Bohr), and a fuzzy electron cloud (modern), with a faint arrow of progress. Conveys the evolving understanding of the atom. Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'A labelled timeline of the atomic models from Dalton to the modern quantum model',
      'Educational timeline diagram of atomic models. Clean technical illustration on a dark background (#0a0a0a or near-black). Five small model icons in a row connected by arrows, labelled: Dalton (solid ball), Thomson (positive sphere with electrons), Rutherford (nuclear/planetary), Bohr (fixed shells), Modern (electron cloud). Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Each atomic model was, in time, replaced by a better one. What does this best show about how science works?',
      [
        'Science improves by updating its models when new evidence appears — replacement is a sign of progress',
        'Science keeps failing, since none of its models last',
        'Only the most recent scientist ever gets anything right',
        'Once a model is replaced, the earlier scientists were simply foolish',
      ],
      0,
      'Models are replaced because new evidence allows a better explanation — that is progress, not failure. "Earlier scientists were foolish" is the trap: each built the best model possible from the evidence they had, which is why their work still mattered.',
      3),
    quiz: [
      q('Which is the correct order in which the atomic models were proposed?',
        [
          'Dalton → Thomson → Rutherford → Bohr',
          'Bohr → Rutherford → Thomson → Dalton',
          'Thomson → Dalton → Bohr → Rutherford',
          'Rutherford → Dalton → Thomson → Bohr',
        ], 0,
        'The models came in the order Dalton, Thomson, Rutherford, Bohr (then modern). The fully reversed list is the trap — it runs the history backwards.',
        1),
      q('Each new atomic model was accepted mainly because it —',
        [
          'explained something the earlier model could not',
          'was proposed by a more famous scientist',
          'used bigger and more expensive equipment',
          'was simpler and easier to draw',
        ], 0,
        'A model won acceptance by explaining evidence the previous one failed on. "More famous scientist" is the trap — acceptance came from better explanation, not the proposer\'s fame.',
        2),
      q('Today\'s cloud model of the atom may itself be improved one day. What does this tell us about scientific knowledge?',
        [
          'Scientific models are our best current explanation and can change as we learn more',
          'Science can never be trusted at all',
          'The atom will never be understood by anyone',
          'The older atomic models were completely useless',
        ], 0,
        'Knowledge is provisional — strong, but open to improvement with new evidence. "Science can never be trusted" is the trap: that a model can improve is a strength of science, not a reason to dismiss it.',
        3),
    ],
  },

  // ── p99 frontier-understanding-atom (frontier — no existing quiz) ────────────
  {
    slug: 'frontier-understanding-atom',
    subtitle: 'We can photograph a single atom — so why can we still never say exactly where its electron is?',
    hook: cur(
      'Today\'s microscopes are so powerful that we can take pictures of individual atoms sitting on a surface. You would think that means we finally "see" everything inside. And yet, for the electron, scientists say something strange: we can never know exactly where it is — only where it is *likely* to be. How can we photograph an atom but not pin down its own electron?',
      'In the modern model, electrons are not on fixed paths — they spread out as a "cloud" of likelihood.',
      'Powerful instruments like scanning tunnelling microscopes can image atoms, but the electron does not sit on a neat Bohr orbit. It exists as an "electron cloud" — a region where it is most likely to be found. We can map probabilities, not exact positions. The journey inside the atom is still not over.'
    ),
    hero: img(
      'A glowing fuzzy electron cloud around a bright nucleus, half-resolved like a frontier still being explored',
      'Ultra-wide cinematic banner (16:5 ratio). A bright central nucleus surrounded by a soft, glowing, fuzzy electron cloud rather than sharp orbits, with part of the image resolving into a grid of atoms (as if seen by an advanced microscope). Conveys a frontier still being explored. Cool blue-violet rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Bohr\'s fixed orbits compared side by side with the modern electron-cloud model',
      'Educational comparison diagram. Clean technical illustration on a dark background (#0a0a0a or near-black). Left: Bohr model — a nucleus with electrons on sharp fixed circular orbits, labelled "Fixed orbits (Bohr)". Right: modern model — the same nucleus surrounded by a soft fuzzy cloud, labelled "Electron cloud (modern)". Dark background, orange accent labels and thin leader lines, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Bohr drew electrons on fixed circular paths, but the modern model replaces these with "clouds". Why was this change made?',
      [
        'Experiments showed electrons do not follow exact fixed paths; we can only say where they are most likely to be',
        'Fixed circular orbits were simply too hard for students to draw',
        'Scientists decided clouds look more attractive in textbooks',
        'The nucleus was found to be negative, so the orbits had to change',
      ],
      0,
      'New evidence showed electron positions can only be given as likelihoods, not exact orbits — so the cloud model replaced fixed paths. "Too hard to draw" is the trap: models change because of evidence, not because one is easier to sketch.',
      3),
    quiz: [
      q('In the modern model of the atom, electrons are best described as —',
        [
          'a cloud showing where they are most likely to be found',
          'fixed dots travelling on exact circular orbits',
          'particles embedded in a solid positive sphere',
          'sitting completely still inside the nucleus',
        ], 0,
        'The modern picture is a probability cloud around the nucleus. "Fixed dots on circular orbits" is the trap — that is Bohr\'s older model, which the cloud model replaced.',
        1),
      q('Powerful microscopes such as scanning tunnelling microscopes (STMs) let scientists —',
        [
          'see individual atoms arranged on a surface',
          'see exactly where each electron is at every moment',
          'watch protons split apart inside the nucleus',
          'weigh single atoms directly in grams',
        ], 0,
        'STMs can reveal individual atoms on a surface. "See exactly where each electron is" is the trap — even with these tools, an electron\'s exact position cannot be pinned down, only its likely region.',
        2),
      q('Scientists say the story of the atom is "not over". What does this best mean?',
        [
          'New tools and discoveries may still change our understanding of the atom',
          'Everything about the atom is already fully known',
          'The atom is not real and was made up',
          'Scientists will soon go back to using Bohr\'s model',
        ], 0,
        'There is still more to learn, and future evidence may refine the picture. "Everything is already known" is the trap — the whole history of atomic models shows understanding keeps growing.',
        3),
    ],
  },
], 8).catch((e) => { console.error(e); process.exit(1); });
