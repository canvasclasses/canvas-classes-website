/*
 * optics-bench/types.ts — E4 ENGINE CONTRACT. Frozen surface.
 * ─────────────────────────────────────────────────────────────────────────────
 * A REAL ray tracer over a bench of optical surfaces — not a paraxial formula
 * with a cartoon drawn next to it. Rays are traced surface by surface, so
 * spherical aberration, total internal reflection and a ray that misses the
 * lens entirely all fall out of the trace rather than being special-cased.
 *
 * The payoff is the INSTRUMENT ASSEMBLER (§6): lens → +aperture → +sensor at
 * the focal plane = a camera; swap the sensor for a retina = an eye; lengthen
 * the eyeball and the student invents spectacles; add a second lens = a
 * microscope; make the first long-focal = a telescope; add two prisms and the
 * image erects while the tube shortens = binoculars. Three primitives, six
 * instruments — that is "concepts connecting into systems" made literal.
 *
 * Pure — no React, no DOM. SI-ish: distances in cm (the register every Indian
 * optics textbook uses), angles in degrees, wavelengths in nm.
 *
 * SIGN CONVENTION: the Cartesian convention used by NCERT — light travels +x,
 * distances measured from the pole, +x to the right, +y up. The engine must
 * never silently switch conventions; every formula comment states which is in
 * force, because a flipped sign is the single most common student error here.
 */

export interface Vec2 { x: number; y: number }

// ── Bench elements ───────────────────────────────────────────────────────────

export type ElementKind =
  | 'thin-lens' | 'thick-lens' | 'mirror-spherical' | 'mirror-plane'
  | 'aperture' | 'screen' | 'prism' | 'slab' | 'eye' | 'grating';

export interface OpticalElement {
  id: string;
  kind: ElementKind;
  /** Position of the pole/centre along the bench axis (cm). */
  x: number;
  /** Vertical offset — 0 for a centred element (cm). */
  y?: number;
  /** cm. Positive = converging lens / concave mirror, per the Cartesian rule. */
  focalLength?: number;
  /** cm. Physical half-height; a ray beyond this MISSES the element. */
  aperture?: number;
  /** cm. Radius of curvature, for surfaces traced exactly rather than thinly. */
  radius?: number;
  /** Refractive index of the glass (thick lens, slab, prism). */
  n?: number;
  /** Apex angle in degrees, for a prism. */
  apexDeg?: number;
  /** Tilt of the element in degrees, for mirrors and prisms. */
  tiltDeg?: number;
  label?: string;
}

export interface LightSource {
  id: string;
  /** cm — object position and height. */
  x: number;
  y: number;
  /** How many rays to trace. The classic three (parallel, through-centre,
   *  through-focus) plus a fan for the real trace. */
  rayCount?: number;
  /** nm — drives dispersion in a prism and fringe spacing in YDSE. */
  wavelength?: number;
  kind?: 'point' | 'extended' | 'parallel-beam';
  /** Degrees, for a parallel beam arriving off-axis. */
  beamAngleDeg?: number;
}

export interface Bench {
  elements: OpticalElement[];
  sources: LightSource[];
  /** Refractive index of the surrounding medium. Water changes every answer. */
  nMedium?: number;
}

// ── Tracing ──────────────────────────────────────────────────────────────────

export interface RaySegment {
  from: Vec2;
  to: Vec2;
  /** false once the ray is a construction line (a virtual-image back-extension),
   *  which must be drawn dashed — students routinely mistake these for real light. */
  real: boolean;
  /** nm, carried through so dispersion can colour the segment correctly. */
  wavelength?: number;
  /** The element this segment left, for highlighting on hover. */
  fromElementId?: string;
}

export interface TracedRay {
  id: string;
  segments: RaySegment[];
  /** Set when the ray stopped early, with the honest reason. */
  terminated?: 'missed-element' | 'total-internal-reflection' | 'absorbed' | 'escaped';
}

/** Where the image forms, and what kind it is. */
export interface ImageResult {
  /** cm along the axis. null when the rays emerge parallel (image at infinity). */
  x: number | null;
  y: number | null;
  /** Transverse magnification. Negative = inverted. */
  magnification: number | null;
  real: boolean;
  inverted: boolean;
  /** Angular magnification — the number that actually matters for a telescope
   *  or microscope, where transverse magnification is meaningless. */
  angular?: number;
  /** true when rays do not converge to a point — spherical aberration visible. */
  aberrated?: boolean;
}

export interface TraceResult {
  rays: TracedRay[];
  /** Image formed by each element in turn — the intermediate image of a
   *  compound instrument is the thing students never see. */
  images: { elementId: string; image: ImageResult }[];
  finalImage: ImageResult | null;
  warnings: string[];
}

// ── The Instrument Assembler ─────────────────────────────────────────────────

export type InstrumentId =
  | 'bare-lens' | 'pinhole' | 'camera' | 'eye' | 'eye-myopic' | 'eye-corrected'
  | 'magnifier' | 'microscope' | 'telescope-refracting' | 'telescope-reflecting'
  | 'binoculars' | 'projector';

/** What a student has assembled so far, and what it has therefore become. */
export interface AssemblyState {
  bench: Bench;
  /** The instrument the current bench matches, if any. Recognition is by
   *  STRUCTURE (which primitives, in what arrangement), never by a flag the UI
   *  sets — that is what makes "you have just built a camera" feel earned. */
  recognised: InstrumentId | null;
  /** The next primitive that would turn this into something new, with why. */
  nextStep?: { add: ElementKind; becomes: InstrumentId; because: string };
}

// ── Misconceptions ───────────────────────────────────────────────────────────

export type OpticsMisconception =
  | 'half_lens_half_image'        // "cover half the lens → half the image"
  | 'image_needs_screen'          // virtual images "do not exist"
  | 'rays_are_only_three'         // the construction rays are the only light
  | 'magnification_is_size_only'  // ignores angular magnification
  | 'sign_convention_dropped'
  | 'focal_length_fixed_in_water'
  | 'real_image_always_inverted_confusion'
  | 'tir_without_denser_medium'
  | 'telescope_magnifies_like_microscope';

export interface OpticsIssue {
  code: OpticsMisconception;
  message: string;
  hint?: string;
}

// ── Archetypes ───────────────────────────────────────────────────────────────

export interface OpticsArchetype {
  id: string;
  title: string;
  summary: string;
  mode: 'bench' | 'assembler' | 'wave';
  params?: {
    key: string; label: string; kind: 'number' | 'boolean' | 'select';
    default: number | boolean | string;
    min?: number; max?: number; step?: number; options?: string[]; unit?: string;
  }[];
  build(params?: Record<string, number | string | boolean>): Bench;
  defaultSteps?: { say: string; cta: string }[];
  targets?: OpticsMisconception;
}
