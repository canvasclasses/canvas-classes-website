'use strict';
/**
 * Ch10 (Sound Waves) — augment batch 2: p162–p167.
 * Grounded ONLY in iesc110.pdf. Additive (content-protection safe).
 * All Ch10 pages have no existing quiz → a fresh 3-Q quiz is appended.
 * p167 (Sir C.V. Raman) is a scientist page → hero only, NO diagram.
 */
const { img, txt, h, cur, callout, reason, q, applyAug } = require('./_lib');
const CH = 10;
const DIAG = (alt, prompt) => img(alt, prompt, '4:3');

const updates = [
  // ── p162 ───────────────────────────────────────────────────────────────────
  {
    slug: 'pitch-and-loudness',
    hook: cur(
      'A tiny referee\'s whistle and a big dhol drum. One is shrill enough to cut across a whole field; the other is a deep, chest-thumping boom. Both are "loud" — yet they sound nothing alike. What two separate things are your ears actually judging?',
      'One quality comes from how FAST the air vibrates; the other from how BIG the vibration is.',
      'Your ears judge pitch and loudness separately. Pitch (shrill vs deep) comes from frequency — fast vibration sounds high. Loudness comes from amplitude — a bigger density swing carries more energy and sounds louder.'
    ),
    hero: img(
      'A small shrill whistle next to a large drum, with a tight ripple pattern near the whistle and a big ripple near the drum',
      'Dark background (#050505). On the left a small metal referee whistle with closely-spaced ripple rings (high pitch); on the right a large Indian dhol drum with wide, tall ripple rings (loud, deep). Clean light-on-dark illustration contrasting the two, no text.'
    ),
    diagram: DIAG(
      'Two pairs of waveforms contrasting low versus high amplitude (loudness) and low versus high frequency (pitch)',
      'Labelled scientific diagram on dark background (#0B0F15). Top row: two waves of the same wavelength but different heights, labelled "Small amplitude — soft" and "Large amplitude — loud". Bottom row: two waves of the same height but different spacing, labelled "Low frequency — low pitch" and "High frequency — high pitch". Clean light line-art, crisp labels. Based on NCERT Fig 10.20.'
    ),
    reasoning: reason(
      'logical',
      'In Activity 10.6, striking the metal plate harder makes the grains on the stretched sheet jump higher. What does this show about a louder sound?',
      ['A louder sound has a larger amplitude and carries more energy', 'A louder sound has a higher frequency', 'A louder sound has a shorter wavelength', 'Loudness has nothing to do with energy'],
      0,
      'Hitting harder transfers more energy, giving a larger amplitude. The bigger displacement makes the grains jump higher — louder sound means larger amplitude and more energy.',
      3
    ),
    quiz: [
      q('The loudness of a sound depends mainly on the wave\'s',
        ['amplitude', 'frequency', 'wavelength', 'speed'],
        0,
        'Larger amplitude is heard as a louder sound; smaller amplitude is heard as softer.',
        1),
      q('A shrill, high-pitched whistle, compared with a deep rumble, has a',
        ['higher frequency', 'larger amplitude', 'longer wavelength', 'slower speed'],
        0,
        'Pitch is how we perceive frequency. High-pitched sounds have higher frequency; low-pitched sounds have lower frequency.',
        2),
      q('Why does striking a drum harder make it sound louder?',
        ['It gives the wave a larger amplitude, carrying more energy', 'It raises the frequency of the sound', 'It shortens the wavelength of the sound', 'It speeds the sound up through the air'],
        0,
        'A harder strike puts more energy into the vibration, increasing the amplitude — and larger amplitude is heard as a louder sound.',
        3),
    ],
  },
  // ── p163 ───────────────────────────────────────────────────────────────────
  {
    slug: 'audible-range',
    hook: cur(
      'A "silent" dog whistle makes no sound to you — but your dog\'s ears prick up at once from across the park. The whistle is definitely working. So why are your ears left out?',
      'Human ears can only hear vibrations within a certain band of frequencies. The whistle sits just outside it.',
      'Humans hear only from about 20 Hz to 20,000 Hz. The dog whistle vibrates above 20,000 Hz — that is ultrasonic, beyond our range but well within a dog\'s. Sounds below 20 Hz are infrasonic.'
    ),
    hero: img(
      'A dog with ears perked up alert, while a person blows a small whistle that shows no visible sound to the viewer',
      'Dark background (#050505). A person blows a small "silent" whistle on the left; on the right an alert dog with ears sharply perked, with faint ripple rings travelling only toward the dog. Clean light-on-dark illustration, no text.'
    ),
    diagram: DIAG(
      'A frequency scale split into infrasonic, audible, and ultrasonic bands',
      'Labelled scientific diagram on dark background (#0B0F15). A long horizontal frequency axis split into three coloured bands: "Infrasonic (below 20 Hz)" on the left, "Human audible range (20 Hz – 20,000 Hz)" in the middle, and "Ultrasonic (above 20 kHz)" on the right, with the 20 Hz and 20 kHz boundary marks labelled. Small icons: elephant under infrasonic, human under audible, bat/dog under ultrasonic. Clean light line-art, crisp labels.'
    ),
    reasoning: reason(
      'logical',
      'Elephants can communicate with each other across several kilometres of forest using calls people standing nearby cannot hear. What kind of sound are they most likely using?',
      ['Infrasound, with frequency below 20 Hz', 'Ultrasound, with frequency above 20 kHz', 'Sound right in the middle of the human range', 'Light signals rather than sound'],
      0,
      'Humans hear 20 Hz–20 kHz. Elephants can detect infrasound (below 20 Hz), which travels long distances and stays below human hearing.',
      3
    ),
    quiz: [
      q('What is the approximate range of frequencies a healthy human ear can hear?',
        ['20 Hz to 20,000 Hz', '0 Hz to 100 Hz', '20 kHz to 200 kHz', '1 Hz to 20 Hz'],
        0,
        'The human audible range runs from about 20 Hz to 20,000 Hz (20 kHz), and it narrows with age.',
        1),
      q('Sound with a frequency above 20 kHz, which humans cannot hear, is called',
        ['ultrasonic', 'infrasonic', 'audible', 'supersonic'],
        0,
        'Above 20 kHz is ultrasonic; below 20 Hz is infrasonic. (Supersonic refers to speed faster than sound, not a frequency.)',
        2),
      q('Which of these animals is known to detect infrasound (below 20 Hz)?',
        ['Elephants', 'Bats', 'Dolphins', 'Cats'],
        0,
        'Elephants can detect infrasound, while bats and dolphins use ultrasound. The text lists elephants for infrasound.',
        3),
    ],
  },
  // ── p164 ───────────────────────────────────────────────────────────────────
  {
    slug: 'reflection-of-sound',
    hook: cur(
      'Stand at the mouth of a deep, empty valley and shout your name. A moment later, the valley shouts it back. Nobody is hiding there — so who is answering?',
      'Sound obeys the same bounce-off rules as light. Something far away is sending it back.',
      'Your own voice is answering. Sound reflects off the distant hillside and returns to your ears a moment later — an echo. For the echo to be heard as a separate sound, the surface must be far enough that the reflection takes at least 0.1 second to return.'
    ),
    hero: img(
      'A person at the edge of a canyon shouting, with sound ripples travelling to the far cliff and bouncing back',
      'Dark background (#050505). A person stands at the rim of a deep canyon, hands cupped, shouting toward a distant cliff. Two sets of ripple arcs: one travelling out to the cliff, one returning. Clean light-on-dark illustration, no text.'
    ),
    diagram: DIAG(
      'Echo diagram: a shout travelling to a distant wall and reflecting back to the listener, with the 17 m minimum distance noted',
      'Labelled scientific diagram on dark background (#0B0F15). A figure on the left, a tall wall on the right. An arrow labelled "Sound out" goes from the figure to the wall; a second arrow labelled "Reflected sound (echo)" returns. A bracket beneath labelled "At least 17 m for a distinct echo". Clean light line-art, crisp labels.'
    ),
    reasoning: reason(
      'quantitative',
      'You can hear a clear echo from a distant cliff but not from the wall of a small room. The reason is that an echo needs the reflected sound to return at least 0.1 s later. At 340 m/s, what minimum distance does that require?',
      ['About 17 m, because the sound must travel there and back (34 m total)', 'About 34 m to the wall', 'About 3.4 m to the wall', 'Any distance works; room size makes no difference'],
      0,
      'In 0.1 s sound travels 340 × 0.1 = 34 m. That is the round trip, so the wall must be at least half of 34 m = 17 m away. A small room is far closer, so no distinct echo forms.',
      3
    ),
    quiz: [
      q('Hearing your own sound repeated after it bounces off a distant surface is called an',
        ['echo', 'amplitude', 'octave', 'overtone'],
        0,
        'An echo is sound heard again after reflecting off the hard surface of a distant object.',
        1),
      q('Taking the speed of sound as 340 m/s, what is the minimum distance to a wall for a distinct echo?',
        ['17 m', '34 m', '340 m', '3.4 m'],
        0,
        'Sound covers 34 m in 0.1 s (the round trip), so the wall must be at least 17 m away.',
        2),
      q('In a large hall, sound bounces off many surfaces and lingers on after the source stops. This persistence is called',
        ['reverberation', 'an echo', 'refraction', 'resonance'],
        0,
        'Multiple reflections that make sound persist in a large hall produce reverberation; a single clear repeat from a far surface is an echo.',
        3),
    ],
  },
  // ── p165 ───────────────────────────────────────────────────────────────────
  {
    slug: 'echolocation',
    hook: cur(
      'A bat swoops through a pitch-black cave at full speed, snatching a moth in mid-air without ever brushing a wall. It can barely see a thing. So how does it "picture" the cave?',
      'It is not using light. It makes a sound and listens for what comes back.',
      'The bat sends out short bursts of ultrasonic sound and listens for the echoes bouncing off walls and prey. From those echoes it works out where everything is. This trick is called echolocation — and humans copy it underwater with SONAR.'
    ),
    hero: img(
      'A bat in flight emitting cone-shaped ultrasonic pulses toward a small moth, with echoes returning',
      'Dark cave background (#050505). A bat in mid-flight emits fan-shaped ultrasonic pulse arcs toward a small moth ahead; fainter arcs return to the bat as echoes. Clean light-on-dark illustration, no text. Based on NCERT Fig 10.27.'
    ),
    diagram: DIAG(
      'SONAR diagram: a ship sending ultrasonic waves down to the seabed and receiving the reflected waves back',
      'Labelled scientific diagram on dark background (#0B0F15). A ship on the water surface. An arrow labelled "Ultrasonic waves sent" travels down toward a submarine/seabed; an arrow labelled "Reflected waves received" returns to the ship. A caption-style note "distance = speed × (time ÷ 2)". Clean light line-art, crisp labels. Based on NCERT Fig 10.28.'
    ),
    reasoning: reason(
      'quantitative',
      'A SONAR signal sent from a ship returns after a measured time. To find the depth, why must you use HALF the measured time?',
      ['The signal travels down to the object and back, so it covers the depth twice', 'The signal slows to half speed on the way down', 'Half the sound is absorbed by the water', 'The ship moves during the measurement'],
      0,
      'The measured time covers the full round trip — down and back up. The one-way distance (the depth) is covered in half that time, so depth = speed × (time ÷ 2).',
      3
    ),
    quiz: [
      q('Locating objects by sending out sound and sensing the reflected waves is called',
        ['echolocation', 'reverberation', 'refraction', 'resonance'],
        0,
        'Echolocation is determining the position of objects from the echoes of emitted sound, as bats and dolphins do.',
        1),
      q('SONAR, used to map the seabed and find submarines, sends out which kind of waves?',
        ['Ultrasonic waves', 'Infrasonic waves', 'Light waves', 'Radio waves only'],
        0,
        'SONAR (sound navigation and ranging) uses ultrasonic waves through water and analyses the reflected signal.',
        2),
      q('A sonar pulse returns to a ship 4 s after it is sent, with sound at 1500 m/s in water. How is the depth found?',
        ['Multiply 1500 by half of 4 s (2 s), giving 3000 m', 'Multiply 1500 by the full 4 s', 'Divide 1500 by 4 s', 'Add 1500 and 4'],
        0,
        'The 4 s is the round trip. Depth = speed × (time ÷ 2) = 1500 × 2 = 3000 m.',
        3),
    ],
  },
  // ── p166 ───────────────────────────────────────────────────────────────────
  {
    slug: 'sound-and-music',
    hook: cur(
      'Play the very same note — say "Sa" — on a bansuri (flute) and then on a sitar. Your ear instantly knows which is which, even with eyes closed. If the note is identical, what is giving each instrument away?',
      'A single pure frequency would sound the same everywhere. Real instruments add something extra on top.',
      'Each instrument adds its own mix of higher frequencies (overtones) on top of the main note. That unique blend — shaped by the instrument\'s material and construction — is called timbre, and it is what lets you tell a flute from a sitar.'
    ),
    hero: img(
      'A bansuri flute, a sitar, and a tabla arranged together as Indian musical instruments',
      'Dark background (#050505). A wooden bansuri (bamboo flute), a sitar, and a tabla set arranged in an elegant still-life. Warm light catching the wood and strings against the dark backdrop. Clean illustration, no text.'
    ),
    diagram: DIAG(
      'Two waveforms contrasting a pure tone (single smooth wave) with a musical note (complex repeating wave)',
      'Labelled scientific diagram on dark background (#0B0F15). Top: a smooth single-frequency sine wave labelled "Tone (single frequency — e.g. tuning fork)". Bottom: a more complex but still repeating wave labelled "Musical note (fundamental + overtones — e.g. sitar)". Clean light line-art, crisp labels. Based on NCERT Fig 10.25.'
    ),
    reasoning: reason(
      'analogical',
      'A flute and a tabla play the exact same note, yet sound completely different. The quality responsible for this difference is called timbre. Where does timbre come from?',
      ['The instrument\'s shape, material and construction, which set its mix of overtones', 'The loudness at which each is played', 'The single main frequency, which differs between them', 'The speed of sound near each instrument'],
      0,
      'Both play the same fundamental note, so frequency is not the difference. Timbre arises from the pattern and intensity of overtones, which depend on each instrument\'s shape, material and construction.',
      3
    ),
    quiz: [
      q('A sound of a single frequency, like that from a tuning fork or oral whistling, is called a',
        ['tone', 'noise', 'timbre', 'reverberation'],
        0,
        'A tone is a sound of a single frequency. A musical note is a combination of a fundamental and overtones.',
        1),
      q('The quality that makes a flute and a tabla playing the same note sound different is called',
        ['timbre', 'pitch', 'loudness', 'wavelength'],
        0,
        'Timbre is the quality, set by an instrument\'s shape and material, that makes its sound unique even at the same note.',
        2),
      q('An octave is the interval between two notes where one has',
        ['double the frequency of the other', 'half the amplitude of the other', 'the same frequency as the other', 'no relation in frequency'],
        0,
        'An octave is the interval between two notes whose fundamental frequencies are in the ratio 2:1 — one is double the other (for example, 200 Hz and 400 Hz).',
        3),
    ],
  },
  // ── p167 ── scientist page: hero only, NO diagram ────────────────────────────
  {
    slug: 'sir-cv-raman',
    hook: cur(
      'In 1930 an Indian physicist won the country\'s first Nobel Prize in science — for discovering something about how light behaves. The surprise twist: he was also fascinated by the rich sound of the tabla and the mridangam. Who was he?',
      'His most famous discovery is named after him and is about light, not sound — yet he studied Indian drums too.',
      'Sir C. V. Raman. He won the Nobel Prize for discovering the Raman Effect (about light), and he also made important contributions to acoustics by studying Indian percussion instruments such as the tabla and mridangam.'
    ),
    hero: img(
      'A dignified portrait of Sir C. V. Raman in a turban, beside a tabla',
      'Dark background (#050505). A respectful portrait illustration of Sir C. V. Raman, an elderly Indian physicist wearing a turban, with a tabla set beside him to hint at his acoustics work. Warm lighting on the subject against the dark backdrop. Clean, dignified illustration, no text.'
    ),
    // no diagram — scientist profile page
    reasoning: reason(
      'logical',
      'Indian drums like the tabla and mridangam have a black patch (the syaahi) at the centre of the drum head. Why did studying these interest a physicist like Raman?',
      ['The syaahi alters how the membrane vibrates, producing a rich variety of controlled tones', 'The patch simply decorates the drum and changes nothing', 'The patch makes the drum lighter to carry', 'The patch stops the drum from making any sound'],
      0,
      'The syaahi changes the vibration of the membrane, giving these drums a rich, tonally-controlled sound rarely found in other drums — exactly the kind of acoustics question Raman explored.',
      3
    ),
    quiz: [
      q('Sir C. V. Raman won India\'s first Nobel Prize in science for discovering the',
        ['Raman Effect, about the behaviour of light', 'structure of the atom', 'law of gravitation', 'speed of sound in air'],
        0,
        'Raman won the Nobel Prize for discovering the Raman Effect in light.',
        1),
      q('Besides his work on light, Raman studied the acoustics of which Indian instruments?',
        ['The tabla and mridangam', 'The sitar and veena', 'The flute and shehnai', 'The harmonium and dholak'],
        0,
        'He made important contributions to acoustics by studying Indian percussion instruments such as the tabla and mridangam.',
        2),
      q('The black patch (syaahi) at the centre of a tabla head is important because it',
        ['alters the membrane\'s vibration to produce a rich variety of sounds', 'keeps the skin from tearing', 'makes the drum waterproof', 'has no effect on the sound'],
        0,
        'The syaahi changes how the membrane vibrates, giving the tabla its rich, tonally-controlled sound.',
        3),
    ],
  },
];

applyAug(updates, CH).catch((e) => { console.error(e); process.exit(1); });
