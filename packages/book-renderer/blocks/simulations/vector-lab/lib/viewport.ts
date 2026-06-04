// viewport.ts — the ONLY place that bridges physics-coordinates (y up) to
// SVG screen-coordinates (y down). Keeping the flip isolated here means every
// other file can reason in textbook coordinates.

import type { Vec2 } from './vectorMath';
import { VIEW } from './theme';

export interface Frame {
  originX: number;
  originY: number;
  scale: number;
}

const DEFAULT: Frame = { originX: VIEW.originX, originY: VIEW.originY, scale: VIEW.scale };

/** Physics point (units, y up) → SVG point (px, y down). */
export function toScreen(p: Vec2, f: Frame = DEFAULT): Vec2 {
  return { x: f.originX + p.x * f.scale, y: f.originY - p.y * f.scale };
}

/** SVG point (px, y down) → physics point (units, y up). Inverse of toScreen. */
export function toWorld(px: number, py: number, f: Frame = DEFAULT): Vec2 {
  return { x: (px - f.originX) / f.scale, y: (f.originY - py) / f.scale };
}

export const frame = (overrides: Partial<Frame> = {}): Frame => ({ ...DEFAULT, ...overrides });
