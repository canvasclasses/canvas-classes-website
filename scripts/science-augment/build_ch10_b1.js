'use strict';
/**
 * Ch10 (Sound Waves) — augment batch 1: p156–p161.
 * Grounded ONLY in iesc110.pdf. Additive (content-protection safe).
 * All Ch10 pages have no existing quiz → a fresh 3-Q quiz is appended.
 */
const { img, txt, h, cur, callout, reason, q, applyAug } = require('./_lib');
const CH = 10;
const DIAG = (alt, prompt) => img(alt, prompt, '4:3');

const updates = [
  // ── p156 ───────────────────────────────────────────────────────────────────
  {
    slug: 'how-is-sound-produced',
    hook: cur(
      'Two astronauts are bolted side by side on the arm of a space station, hammering the same metal panel. They can SEE the clank — but can they HEAR it the way they would on Earth?',
      'Think about what has to wobble, and what the wobble has to travel through, for a sound to reach your ear.',
      'They cannot hear it directly. Sound starts when an object vibrates — but the vibration still has to travel through something to reach the ear, and space is nearly empty. We will meet the vibrating "source" on this page and the "something" on the next.'
    ),
    hero: img(
      'A hand striking a tuning fork against a soft pad, with faint motion lines showing the prongs blurring as they vibrate',
      'Dark studio background (#050505). A hand strikes a steel tuning fork against a rubber pad; the two prongs are shown slightly blurred with soft motion arcs to suggest rapid to-and-fro vibration. Beside it, a stretched rubber band on an open cardboard box also blurred mid-pluck. Clean science-illustration style, light content on dark background, no text labels.'
    ),
    diagram: DIAG(
      'Labelled tuning fork showing the two prongs, the stem, and a rubber pad',
      'Labelled scientific diagram on dark background (#0B0F15). A U-shaped steel tuning fork drawn cleanly, with thin callout lines labelling: "Prongs" (the two arms of the U), "Stem" (the handle), and a separate "Rubber pad" block it is struck against. Light strokes, crisp sans-serif labels, textbook clarity. Matches NCERT Fig 10.4.'
    ),
    reasoning: reason(
      'logical',
      'You pluck a stretched rubber band and hear a sound. You then press a finger on the band to stop it moving. What happens to the sound, and what does that tell you?',
      ['The sound stops, showing that the vibration is what produces the sound', 'The sound continues, because the band already stored it', 'The sound gets louder as the band slows down', 'The sound changes pitch but never stops'],
      0,
      'As long as the band vibrates, sound is produced; the moment the vibration stops, so does the sound. The vibrating object is called the source of the sound.',
      2
    ),
    quiz: [
      q('In science, the vibrating object that makes a sound is given a special name. What is it called?',
        ['The source', 'The medium', 'The receiver', 'The echo'],
        0,
        'The object that produces sound by vibrating is called the source of the sound.',
        1),
      q('You pluck a stretched rubber band, then quickly hold it still so it cannot move. What happens to the sound?',
        ['It stops almost at once', 'It grows steadily louder', 'It keeps going for several minutes', 'It rises in pitch but continues'],
        0,
        'Sound lasts only while the object is vibrating. Stop the vibration and the sound stops too.',
        2),
      q('While talking, you gently rest your fingers on your throat and feel a faint buzzing. Why?',
        ['Your vocal cords are vibrating to make the sound', 'Air is leaking out through the skin', 'Your throat muscles are warming up', 'Blood is rushing past quickly'],
        0,
        'In humans, sound is produced by the vibration of the vocal cords inside the voice box (larynx); that vibration is what you feel.',
        3),
    ],
  },
  // ── p157 ───────────────────────────────────────────────────────────────────
  {
    slug: 'sound-needs-a-medium',
    hook: cur(
      'A bell is ringing inside a sealed glass jar. As a pump slowly sucks all the air out, you can still SEE the hammer striking — but the ringing fades to nothing. Then air is let back in, and the ringing returns. What just happened?',
      'The bell never stopped vibrating. So what disappeared along with the sound?',
      'The air disappeared. Sound needs a material — solid, liquid, or gas — to travel through. With the air gone, there is nothing to carry the vibration to your ear. That carrier is called the medium, and a space with no medium is a vacuum.'
    ),
    hero: img(
      'An astronaut floating in space outside a station, mouth open as if shouting, with no sound shown reaching the viewer',
      'Dark space background (#050505), Earth curving below. An astronaut in a white spacesuit floats beside a space-station truss, mouth open as if calling out, hand on the metal. Faint "no signal" emptiness around the helmet to suggest silence. Realistic but clean illustration, light subject on dark background, no text.'
    ),
    diagram: DIAG(
      'Bell jar experiment showing an electric bell inside a sealed jar connected to a power supply and a vacuum pump',
      'Labelled scientific diagram on dark background (#0B0F15). A glass bell jar on a base plate with an electric bell suspended inside it. Thin callout lines label: "Bell jar", "Electric bell", "To power supply", and "To vacuum pump". Clean light line-art, crisp labels, textbook clarity. Matches NCERT Fig 10.7.'
    ),
    reasoning: reason(
      'logical',
      'In the bell-jar experiment, the bell is clearly still being struck, yet the sound fades as the air is pumped out. What is the best conclusion?',
      ['Sound needs a medium (matter) to travel, and the air was that medium', 'The bell stops vibrating in low air', 'The glass blocks the sound once air is removed', 'Sound is created by the air pump, not the bell'],
      0,
      'The bell keeps vibrating throughout. Only the air — the medium carrying the sound to your ear — is removed, so the sound fades. Sound cannot travel through a vacuum.',
      3
    ),
    quiz: [
      q('Through which of these can sound travel?',
        ['Solids, liquids and gases', 'Only gases such as air', 'Only solids', 'Empty space with no matter'],
        0,
        'Sound propagates through any material medium — solid, liquid or gas. It cannot travel through a vacuum.',
        1),
      q('As the air is slowly pumped out of the bell jar, the ringing you hear becomes',
        ['fainter and fainter', 'louder and louder', 'higher in pitch', 'completely unchanged'],
        0,
        'With less air to carry the vibration, less sound reaches your ear, so it grows fainter until nearly silent.',
        2),
      q('Two astronauts on a spacewalk bang metal tools together but hear nothing directly. Why?',
        ['Space is a near-vacuum with no medium to carry sound', 'The tools are too small to make sound', 'Their helmets are soundproof on purpose', 'Sound travels too fast to notice in space'],
        0,
        'Outer space is a near-vacuum. With no medium, the vibration cannot reach their ears, so they communicate through radio devices in their suits.',
        3),
    ],
  },
  // ── p158 ───────────────────────────────────────────────────────────────────
  {
    slug: 'sound-as-longitudinal-wave',
    hook: cur(
      'Stretch a slinky across the floor, mark one coil with a pen, then push-and-pull one end again and again. A pattern of squeezed-and-stretched coils races to the far end — but the marked coil just jiggles in place. What actually travelled?',
      'The coils never left their spots. So the thing moving down the slinky is not the metal itself.',
      'A disturbance travelled — a moving pattern of crowded coils (compressions) and spread-out coils (rarefactions). Sound moves through air in exactly this way: the air particles only jiggle in place while the disturbance races forward. That is a longitudinal wave.'
    ),
    hero: img(
      'A long stretched slinky held between two hands, with one region of coils bunched close together travelling toward the far end',
      'Dark background (#050505). A long metal slinky stretched horizontally between two hands. One zone of coils is clearly bunched close together (a compression) with neighbouring zones spread out (rarefactions), and a subtle arrow shows the bunched zone moving toward the right hand. One coil marked in orange to show it stays put. Clean illustration, light on dark, no text.'
    ),
    diagram: DIAG(
      'A longitudinal wave showing alternating compressions and rarefactions, with particle vibration parallel to the direction of wave travel',
      'Labelled scientific diagram on dark background (#0B0F15). A horizontal band of dots representing air particles, showing alternating dense regions labelled "Compression (C)" and sparse regions labelled "Rarefaction (R)". A small double-headed arrow labelled "Direction of particle vibration" points left-right, parallel to a long arrow labelled "Direction of wave propagation". Clean light dots and labels. Matches NCERT Fig 10.9 / 10.12.'
    ),
    reasoning: reason(
      'spatial',
      'In the slinky, the marked coil only swings back and forth about its own spot, yet the squeezed-coil pattern travels the whole length. What does this reveal about sound in air?',
      ['The air particles vibrate in place while the disturbance travels through them', 'The air particles fly along with the sound from source to ear', 'Only the marked particle moves; the rest stay frozen', 'The disturbance cannot move unless the particles move with it'],
      0,
      'Like the slinky coils, air particles only oscillate about their mean positions. The compressions and rarefactions move forward, but the particles themselves do not travel with the wave.',
      3
    ),
    quiz: [
      q('In a sound wave, a region where the air is squeezed to a higher density is called a',
        ['compression', 'rarefaction', 'wavelength', 'vacuum'],
        0,
        'A compression is a region of higher density; a rarefaction is a region of lower density.',
        1),
      q('In a longitudinal wave, the particles of the medium vibrate in which direction?',
        ['Parallel to the direction the wave travels', 'At right angles to the wave', 'In circles around their spot', 'They do not vibrate at all'],
        0,
        'In a longitudinal wave the particles oscillate back and forth along the same line the wave moves. Sound is a longitudinal wave.',
        2),
      q('Sound is classed as a "mechanical wave". What does that label tell us?',
        ['It needs a material medium to travel', 'It can travel through empty space', 'It is made only of light', 'It travels faster than light'],
        0,
        'Mechanical waves require a material medium to propagate. Since sound cannot travel through a vacuum, it is a mechanical wave.',
        3),
    ],
  },
  // ── p159 ───────────────────────────────────────────────────────────────────
  {
    slug: 'characteristics-of-sound-waves',
    hook: cur(
      'A sound wave is invisible — just crowded and spread-out air. Yet textbooks draw it as a smooth up-and-down curve. How can an invisible squeeze-and-stretch become a wavy line on paper?',
      'Think about plotting how dense the air is at each point along the wave.',
      'We plot the air\'s density against distance. Where the air is crowded (a compression) the curve peaks — a crest; where it is spread out (a rarefaction) the curve dips — a trough. The invisible wave becomes a readable graph.'
    ),
    hero: img(
      'A smooth density-versus-distance curve drawn above a band of dots, peaks lining up with crowded dots and dips with sparse dots',
      'Dark background (#050505). Top: a horizontal band of dots showing alternating dense and sparse regions. Below it, aligned, a smooth blue sine-like curve where peaks sit above the dense regions and dips below the sparse regions, with a faint horizontal dashed "average density" line through the middle. Clean, elegant, light-on-dark, minimal.'
    ),
    diagram: DIAG(
      'Graph of a sound wave showing crest, trough, average-density line, and wavelength marked between two consecutive crests',
      'Labelled scientific diagram on dark background (#0B0F15). A smooth sine curve with y-axis "Density" and x-axis "Distance". A horizontal dashed line labelled "Average density". The top of a hump labelled "Crest", the bottom of a dip labelled "Trough", and a double-headed arrow between two consecutive crests labelled with the Greek letter lambda for "Wavelength". Clean light line-art, crisp labels. Matches NCERT Fig 10.16 / 10.18.'
    ),
    reasoning: reason(
      'spatial',
      'On the density graph, where do the crest and the trough come from in the real, invisible sound wave?',
      ['The crest is a compression (highest density); the trough is a rarefaction (lowest density)', 'The crest is a rarefaction and the trough is a compression', 'Both the crest and the trough are compressions', 'Crests and troughs are just decoration and mean nothing physical'],
      0,
      'The highest point (crest) corresponds to maximum density — a compression. The lowest point (trough) corresponds to minimum density — a rarefaction.',
      2
    ),
    quiz: [
      q('On a graph of a sound wave, the highest point of the curve is called the',
        ['crest', 'trough', 'medium', 'origin'],
        0,
        'The highest point is the crest (maximum density); the lowest point is the trough (minimum density).',
        1),
      q('The distance between two consecutive compressions (or two consecutive crests) is equal to',
        ['one wavelength', 'one time period', 'the amplitude', 'the frequency'],
        0,
        'The distance between two consecutive crests or two consecutive troughs is the wavelength, written with the Greek letter lambda.',
        2),
      q('What is the SI unit of wavelength?',
        ['metre', 'hertz', 'second', 'newton'],
        0,
        'Wavelength is a distance, so its SI unit is the metre (m).',
        2),
    ],
  },
  // ── p160 ───────────────────────────────────────────────────────────────────
  {
    slug: 'time-period-and-frequency',
    hook: cur(
      'A single tuning fork can make the air around it squeeze and stretch hundreds of times every second — far too fast for your eye to follow. How do scientists pin down a number for "how often"?',
      'Count how many full squeeze-and-stretch cycles happen at one spot in one second.',
      'They count the density oscillations at a fixed point per second — that is the frequency, measured in hertz (Hz). The time for just one full oscillation is the time period. The two are simply linked: frequency = 1 ÷ time period.'
    ),
    hero: img(
      'A vibrating tuning fork beside a metronome, with a small repeating wave pattern suggesting a steady beat in time',
      'Dark background (#050505). A steel tuning fork with softly blurred prongs on the left; on the right a metronome with its arm mid-swing. Between them a short, evenly repeating wave pattern suggests a steady rhythm. Clean light-on-dark illustration, no text.'
    ),
    diagram: DIAG(
      'A density-versus-time graph with one full oscillation marked as the time period T',
      'Labelled scientific diagram on dark background (#0B0F15). A smooth sine curve with y-axis "Density at a fixed point" and x-axis "Time". One complete cycle (peak to next peak) bracketed and labelled "Time period (T)". A short caption-style note "frequency = number of cycles per second". Clean light line-art, crisp labels.'
    ),
    reasoning: reason(
      'quantitative',
      'A thin rubber band vibrates faster than a thick one. Compared with the thick band, the thin band\'s sound has',
      ['a higher frequency and a shorter time period', 'a lower frequency and a longer time period', 'the same frequency but a longer time period', 'a higher frequency and a longer time period'],
      0,
      'Frequency and time period are inversely related (frequency = 1/T). Vibrating faster means more oscillations per second — higher frequency — so each oscillation takes less time — a shorter time period.',
      3
    ),
    quiz: [
      q('What is the SI unit of frequency?',
        ['hertz', 'metre', 'second', 'joule'],
        0,
        'Frequency is measured in hertz (Hz), meaning oscillations per second.',
        1),
      q('At a fixed point, 10 density oscillations happen in 2 seconds. What is the frequency?',
        ['5 Hz', '10 Hz', '2 Hz', '20 Hz'],
        0,
        'Frequency = number of oscillations ÷ time = 10 ÷ 2 = 5 Hz (worked Example 10.1).',
        2),
      q('How are the time period and frequency of a sound wave related?',
        ['They are inversely related: frequency equals one divided by the time period', 'They are equal to each other', 'They are directly proportional', 'They have no connection'],
        0,
        'Frequency = 1 / time period. A shorter time period means a higher frequency, and vice versa.',
        3),
    ],
  },
  // ── p161 ───────────────────────────────────────────────────────────────────
  {
    slug: 'speed-of-sound',
    hook: cur(
      'In a thunderstorm you almost always SEE the lightning flash first, then hear the thunder a few seconds later — even though both were born at the same instant. Why the delay?',
      'Light and sound leave the strike together. One of them is far slower.',
      'Sound is far slower than light. Light reaches you almost instantly, but sound crawls through air at about 340 m/s, so the thunder lags behind. Count the seconds and you can even estimate how far away the strike was.'
    ),
    hero: img(
      'A bright lightning bolt striking over a small town at night, with the flash lighting up the clouds',
      'Dark stormy night background (#050505). A vivid forked lightning bolt strikes down over a small Indian town skyline, illuminating the clouds. Dramatic, clean illustration, light bolt and glow on a dark sky, no text.'
    ),
    diagram: DIAG(
      'Bar chart comparing the speed of sound in steel, water and air',
      'Labelled scientific bar chart on dark background (#0B0F15). Three vertical bars of clearly different heights labelled "Steel (solid) — 5000 m/s" (tallest), "Water (liquid) — 1500 m/s" (medium), and "Air (gas) — 340 m/s" (shortest). Y-axis "Speed of sound". Clean light bars, crisp labels. Based on NCERT Table 10.1.'
    ),
    reasoning: reason(
      'analogical',
      'Sound travels fastest in steel, slower in water, and slowest in air. Which everyday observation fits this best?',
      ['You hear an approaching train sooner by putting your ear to the steel rail than by listening through the air', 'You hear a train earlier through the air than through the rail', 'Sound from the train is equally fast through rail and air', 'The train makes no sound through the rail at all'],
      0,
      'Sound moves 15–20 times faster in solids than in air, so the vibration through the steel rail reaches your ear well before the sound through the air.',
      3
    ),
    quiz: [
      q('In which type of medium does sound travel fastest?',
        ['Solids', 'Liquids', 'Gases', 'It is the same in all three'],
        0,
        'Sound travels fastest in solids, slower in liquids, and slowest in gases.',
        1),
      q('Which formula correctly gives the speed of a sound wave?',
        ['speed = wavelength × frequency', 'speed = wavelength ÷ frequency', 'speed = frequency ÷ wavelength', 'speed = wavelength + frequency'],
        0,
        'Speed = wavelength × frequency (v = λ × ν), since the wave covers one wavelength in one time period.',
        2),
      q('During a storm, lightning is always seen before the thunder is heard. The main reason is that',
        ['light travels much faster than sound', 'sound is created a little after the lightning', 'thunder is quieter than lightning is bright', 'sound bends away before reaching you'],
        0,
        'Light reaches you almost instantly while sound crawls along at roughly 340 m/s, so the thunder arrives noticeably later.',
        3),
    ],
  },
];

applyAug(updates, CH).catch((e) => { console.error(e); process.exit(1); });
