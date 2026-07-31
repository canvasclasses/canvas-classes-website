/*
 * motion-lab/waves/lib/wave.ts — travelling waves, superposition, Doppler.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM, no dependencies. Checked by
 * `scripts/verify-motion-phase2.mjs`.
 *
 * ── THE ONE IDEA THIS FILE EXISTS FOR ───────────────────────────────────────
 * A standing wave is NOT a new kind of wave. It is two ordinary travelling
 * waves of the same amplitude and frequency running through each other in
 * opposite directions, added point by point. Every node is a place where the
 * two are permanently out of step; every antinode is a place where they are
 * permanently in step.
 *
 * So this module refuses to have a `standingWave(A, k, x, t)` primitive that
 * draws 2A sin(kx)cos(ωt) directly. `standing()` builds the two counter-runners
 * and RETURNS BOTH ALONGSIDE THEIR SUM. The renderer can therefore split them
 * apart on a toggle and the student watches the pattern assemble itself from
 * its two components — and the nodes fall out of the arithmetic instead of
 * being drawn on afterwards. The verifier checks that the sum matches the
 * textbook product form to 1e-12, which is what makes the split honest.
 *
 * Beats are the same trick along the time axis instead of the space axis, which
 * is why they live in the same file: two frequencies added give a carrier at
 * the mean and an envelope at the difference. Nothing is "modulating" anything.
 *
 * Convention: SI. k = 2π/λ (rad/m), ω = 2πf (rad/s), v = ω/k = fλ.
 */

export const TAU = Math.PI * 2;

// ── One travelling wave ──────────────────────────────────────────────────────

export interface WaveSpec {
  /** m */
  amplitude: number;
  /** m — wavelength. */
  wavelength: number;
  /** Hz */
  frequency: number;
  /** +1 runs towards +x, −1 runs towards −x. */
  direction: 1 | -1;
  /** rad */
  phase?: number;
}

export const angularWavenumber = (wavelength: number): number => TAU / Math.max(wavelength, 1e-9);
export const angularFrequency = (frequency: number): number => TAU * frequency;

/** v = fλ = ω/k, m/s. */
export const waveSpeed = (frequency: number, wavelength: number): number => frequency * wavelength;

/** λ = v/f. */
export const wavelengthOf = (speed: number, frequency: number): number => speed / Math.max(frequency, 1e-9);

/**
 * y(x, t) = A sin(kx − ωt + φ) for a wave running towards +x,
 *           A sin(kx + ωt + φ) for one running towards −x.
 *
 * The sign of ωt is the ONLY difference between the two, and it is the whole
 * of "which way is it going" — worth seeing as one character rather than as
 * two memorised formulas.
 */
export function waveAt(w: WaveSpec, x: number, t: number): number {
  const k = angularWavenumber(w.wavelength);
  const om = angularFrequency(w.frequency);
  return w.amplitude * Math.sin(k * x - w.direction * om * t + (w.phase ?? 0));
}

/** Sample one wave across [0, xMax] at time t. */
export function sampleWave(w: WaveSpec, xMax: number, t: number, samples = 400): number[] {
  const out = new Array<number>(samples + 1);
  for (let i = 0; i <= samples; i++) out[i] = waveAt(w, (xMax * i) / samples, t);
  return out;
}

/** Point-by-point sum of any number of waves. Superposition is addition — the
 *  sim never "combines" waves by any other rule. */
export function superpose(waves: WaveSpec[], x: number, t: number): number {
  let y = 0;
  for (const w of waves) y += waveAt(w, x, t);
  return y;
}

export function sampleSuperposition(waves: WaveSpec[], xMax: number, t: number, samples = 400): number[] {
  const out = new Array<number>(samples + 1);
  for (let i = 0; i <= samples; i++) out[i] = superpose(waves, (xMax * i) / samples, t);
  return out;
}

// ── Standing waves — built, never drawn ──────────────────────────────────────

export interface StandingSplit {
  /** The wave running towards +x. */
  right: WaveSpec;
  /** The wave running towards −x — identical except for its direction. */
  left: WaveSpec;
  /** Sampled y for each, and their sum, on the same x grid. */
  xs: number[];
  yRight: number[];
  yLeft: number[];
  ySum: number[];
}

/**
 * Two counter-running waves and their sum, on one shared x grid.
 *
 * Adding A sin(kx − ωt) and A sin(kx + ωt) gives 2A sin(kx) cos(ωt) — a shape
 * fixed in space whose whole profile breathes in time. The x-dependence and the
 * t-dependence have SEPARATED, which is exactly why nothing appears to travel.
 * `nodePositions` below reads its answer off sin(kx) = 0, i.e. off the sum, not
 * off a stored list.
 */
export function standing(
  amplitude: number, wavelength: number, frequency: number, xMax: number, t: number, samples = 400
): StandingSplit {
  const right: WaveSpec = { amplitude, wavelength, frequency, direction: 1 };
  const left: WaveSpec = { amplitude, wavelength, frequency, direction: -1 };
  const xs: number[] = [];
  const yRight: number[] = [];
  const yLeft: number[] = [];
  const ySum: number[] = [];
  for (let i = 0; i <= samples; i++) {
    const x = (xMax * i) / samples;
    const r = waveAt(right, x, t);
    const l = waveAt(left, x, t);
    xs.push(x);
    yRight.push(r);
    yLeft.push(l);
    ySum.push(r + l);
  }
  return { right, left, xs, yRight, yLeft, ySum };
}

/** The textbook product form, kept ONLY so the verifier can prove the sum of
 *  the two counter-runners equals it. Nothing in the UI calls this. */
export const standingClosedForm = (A: number, wavelength: number, frequency: number, x: number, t: number): number =>
  2 * A * Math.sin(angularWavenumber(wavelength) * x) * Math.cos(angularFrequency(frequency) * t);

/**
 * Where the sum is permanently zero: sin(kx) = 0 → x = nλ/2.
 *
 * Half a wavelength apart, ALWAYS — which is the measurement that turns a
 * standing wave on a string into a way of measuring λ, and from there into
 * v = fλ and the speed of sound in a resonance tube.
 */
export function nodePositions(wavelength: number, xMax: number): number[] {
  const half = wavelength / 2;
  const out: number[] = [];
  for (let n = 0; n * half <= xMax + 1e-12; n++) out.push(n * half);
  return out;
}

/** Antinodes sit exactly halfway between neighbouring nodes: x = (2n+1)λ/4. */
export function antinodePositions(wavelength: number, xMax: number): number[] {
  const quarter = wavelength / 4;
  const out: number[] = [];
  for (let n = 0; (2 * n + 1) * quarter <= xMax + 1e-12; n++) out.push((2 * n + 1) * quarter);
  return out;
}

// ── A string fixed at both ends ──────────────────────────────────────────────

/** v = √(T/μ) on a stretched string, m/s. */
export const stringWaveSpeed = (tension: number, linearDensity: number): number =>
  Math.sqrt(Math.max(tension, 0) / Math.max(linearDensity, 1e-12));

/**
 * fₙ = n·v / 2L.
 *
 * The 2L is not arbitrary: a string clamped at both ends must have a node at
 * each end, so a whole number of HALF wavelengths has to fit — L = nλ/2. Every
 * harmonic on the ladder is that one constraint counted out.
 */
export const harmonicFrequency = (n: number, speed: number, length: number): number =>
  (n * speed) / (2 * Math.max(length, 1e-9));

/** λₙ = 2L/n — the wavelength that fits n half-loops between the clamps. */
export const harmonicWavelength = (n: number, length: number): number => (2 * length) / Math.max(n, 1);

/** The shape of the nth mode at time t: 2A sin(nπx/L)cos(ωₙt), built from its
 *  two counter-runners like everything else here. */
export function harmonicShape(
  n: number, amplitude: number, length: number, speed: number, t: number, samples = 400
): StandingSplit {
  return standing(amplitude, harmonicWavelength(n, length), harmonicFrequency(n, speed, length), length, t, samples);
}

// ── Beats ────────────────────────────────────────────────────────────────────

export interface BeatSample {
  t: number;
  /** The two individual tones. */
  y1: number;
  y2: number;
  /** Their sum — what the ear actually receives. */
  sum: number;
  /** ±envelope, drawn as the two dashed curves the sum lives between. */
  envelope: number;
  /** The identity's two factors, kept so the renderer can show that the sum
   *  IS `envelopeSigned × carrier` rather than merely resembling it. */
  envelopeSigned: number;
  carrier: number;
}

/**
 * Two tones added.
 *
 *      sin(2πf₁t) + sin(2πf₂t) = 2 cos(2π·(Δf/2)·t) · sin(2π·f̄·t)
 *
 * i.e. a tone at the MEAN frequency inside an envelope at HALF the difference.
 * The ear hears a loudness maximum every time the envelope's magnitude peaks,
 * and |cos| peaks TWICE per envelope cycle — which is why the beat frequency is
 * |f₁ − f₂| and not half of it. That factor of two is the single most-missed
 * step in the topic, so `beatFrequency` and `envelopeFrequency` are separate
 * functions here rather than one with a comment.
 */
export function beatSamples(
  A: number, f1: number, f2: number, tMax: number, samples = 900
): BeatSample[] {
  const out: BeatSample[] = [];
  const half = Math.PI * (f1 - f2);
  const mean = Math.PI * (f1 + f2);
  for (let i = 0; i <= samples; i++) {
    const t = (tMax * i) / samples;
    const y1 = A * Math.sin(TAU * f1 * t);
    const y2 = A * Math.sin(TAU * f2 * t);
    const envelopeSigned = 2 * A * Math.cos(half * t);
    const carrier = Math.sin(mean * t);
    out.push({
      t,
      y1,
      y2,
      sum: y1 + y2,
      envelope: Math.abs(envelopeSigned),
      envelopeSigned,
      carrier,
    });
  }
  return out;
}

/** |f₁ − f₂|, Hz — the number of loudness surges per second. */
export const beatFrequency = (f1: number, f2: number): number => Math.abs(f1 - f2);

/** The envelope repeats at HALF the beat rate, because |cos| peaks twice per
 *  cycle of cos. Kept separate so the two can never be conflated. */
export const envelopeFrequency = (f1: number, f2: number): number => Math.abs(f1 - f2) / 2;

/** The pitch actually heard: the mean of the two. */
export const carrierFrequency = (f1: number, f2: number): number => (f1 + f2) / 2;

// ── Doppler ──────────────────────────────────────────────────────────────────

/**
 * SIGN CONVENTION, stated once so nothing downstream has to guess:
 *   • `vs` is the source's speed ALONG THE LINE TOWARDS THE OBSERVER.
 *     Positive = closing in. Negative = running away.
 *   • `vo` is the observer's speed ALONG THE LINE TOWARDS THE SOURCE.
 *     Positive = closing in. Negative = running away.
 * Both are measured in the medium's rest frame, which is the frame the sound
 * speed `v` is quoted in — the reason this asymmetry exists at all.
 */
export interface DopplerSpec {
  /** Emitted frequency, Hz. */
  f0: number;
  /** Speed of sound in the medium, m/s. */
  v: number;
  /** Source speed towards the observer, m/s. */
  vs: number;
  /** Observer speed towards the source, m/s. */
  vo: number;
}

/**
 * f′ = f₀ (v + v_o) / (v − v_s).
 *
 * ── WHY THE TWO CASES ARE NOT THE SAME FORMULA ──────────────────────────────
 * A moving SOURCE changes the WAVELENGTH: each crest is emitted from a point
 * further forward, so the crests are physically bunched in the medium. v_s
 * therefore lands in the DENOMINATOR and the effect blows up as v_s → v.
 *
 * A moving OBSERVER changes nothing about the wave. The crests are exactly
 * where they were; the observer simply runs into more of them per second. v_o
 * therefore lands in the NUMERATOR, and the effect stays perfectly linear — an
 * observer at v_o = v hears exactly 2f₀ and nothing dramatic happens.
 *
 * Same apparent "it sounds higher when we approach", two genuinely different
 * mechanisms, two genuinely different numbers. That is the archetype's point.
 */
export function dopplerObserved(d: DopplerSpec): number {
  const denom = d.v - d.vs;
  if (denom <= 1e-9) return Infinity; // at or past the sound barrier
  return (d.f0 * (d.v + d.vo)) / denom;
}

/** Only the source moves. f′ = f₀ v/(v − v_s) — a hyperbola in v_s. */
export const dopplerSourceMoving = (f0: number, v: number, vs: number): number =>
  dopplerObserved({ f0, v, vs, vo: 0 });

/** Only the observer moves. f′ = f₀ (v + v_o)/v — a straight line in v_o. */
export const dopplerObserverMoving = (f0: number, v: number, vo: number): number =>
  dopplerObserved({ f0, v, vs: 0, vo });

/**
 * The wavelength in front of a moving source: λ′ = (v − v_s)/f₀.
 *
 * This is the quantity that actually changes when the source moves, and
 * rendering it — crests bunched ahead, stretched behind — is what makes the
 * asymmetry visible rather than merely stated.
 */
export const dopplerWavelengthAhead = (f0: number, v: number, vs: number): number =>
  (v - vs) / Math.max(f0, 1e-9);

export const dopplerWavelengthBehind = (f0: number, v: number, vs: number): number =>
  (v + vs) / Math.max(f0, 1e-9);

/**
 * Circular wavefronts emitted at regular intervals by a source moving along x.
 *
 * Each front is a circle centred WHERE THE SOURCE WAS when it was emitted,
 * growing at the medium's speed. Draw enough of them and the bunching in front
 * / stretching behind is not an illustration of the Doppler effect — it IS the
 * Doppler effect, with nothing added.
 */
export function wavefronts(
  d: { f0: number; v: number; sourceVx: number; sourceX0: number },
  tNow: number,
  count = 9
): { cx: number; radius: number; age: number }[] {
  const period = 1 / Math.max(d.f0, 1e-9);
  const out: { cx: number; radius: number; age: number }[] = [];
  for (let i = 0; i < count; i++) {
    const tEmit = tNow - i * period;
    if (tEmit < 0) break;
    const age = tNow - tEmit;
    out.push({ cx: d.sourceX0 + d.sourceVx * tEmit, radius: d.v * age, age });
  }
  return out;
}

/** Mach number — above 1 the "wavefronts ahead" have nowhere to go and the
 *  formula's denominator has already told you so. */
export const machNumber = (vs: number, v: number): number => Math.abs(vs) / Math.max(v, 1e-9);
