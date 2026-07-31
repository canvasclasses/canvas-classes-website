'use client';

/*
 * Book3D — the hardbound six-face book, on its own so every surface that shows
 * a book shows the SAME book.
 *
 * Faces: front, back, spine, top page-block, fore-edge page-block. All of them
 * derive from --lb-w / --lb-h / --lb-t, so a caller can resize the whole object
 * (and vary thickness by real page count) with three numbers.
 *
 * ⚠️  NEVER put `filter`, `opacity`, `backdrop-filter` or `mask` on .lb-book or
 * .lb-scene. Those are grouping properties: they force `transform-style: flat`,
 * which collapses all six faces into one plane. Dim the FACES instead
 * (.lb-front::after). Layout lives in the `.lb-*` block in globals.css.
 */

import { getTheme } from './bookDesign';

/**
 * Subjects arrive from the DB as raw slugs — `social_science`, `life_skills`,
 * lowercase. Render them as words.
 */
export function subjectLabel(subject: string) {
  return subject
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * A few subjects get a shorter name on the cover so they fit the board and
 * read the way students say them. The card body keeps the full subject.
 */
const COVER_NAME: Record<string, string> = {
  mathematics: 'Maths',
  'social science': 'Social Science',
  'life skills': 'Life Skills',
};

export function coverName(subject: string) {
  const key = subject.replace(/[_-]+/g, ' ').trim().toLowerCase();
  return COVER_NAME[key] ?? subjectLabel(subject);
}

/** Stepped so the set still looks like one publisher, not fluid per-title. */
function coverTitleSize(label: string, scale: number) {
  const n = label.length;
  const base = n <= 5 ? 21 : n <= 8 ? 18 : n <= 11 ? 15 : n <= 15 ? 16 : 12;
  return Math.round(base * scale);
}

/** Thickness from the real page count — a readable exaggeration, not a model. */
export function bookThickness(pageCount: number) {
  const t = Math.max(0, Math.min(1, pageCount / 80));
  return Math.round(20 + t * 22);
}

export interface Book3DProps {
  subject: string;
  grade: number;
  /** Cover artwork; falls back to cloth-and-foil when absent. */
  coverImage?: string | null;
  /** Spine width in px — pass bookThickness(pageCount). */
  thickness?: number;
  /** 1 = the shelf's size. The hero uses a larger scale. */
  scale?: number;
}

export default function Book3D({
  subject, grade, coverImage, thickness = 30, scale = 1,
}: Book3DProps) {
  const theme = getTheme(subject);
  const Icon = theme.icon;
  const cover = coverName(subject);

  return (
    <span
      className="lb-scene lb-scene-static"
      style={{
        ['--lb-cloth' as string]: theme.cloth,
        ['--lb-edge' as string]: `rgb(${theme.ambient})`,
        ['--lb-t' as string]: `${Math.round(thickness * scale)}px`,
        ['--lb-w' as string]: `${Math.round(112 * scale)}px`,
        ['--lb-h' as string]: `${Math.round(158 * scale)}px`,
        ['--lb-title-size' as string]: `${coverTitleSize(cover, scale)}px`,
      }}
      aria-hidden="true"
    >
      <span className="lb-book">
        <span className="lb-face lb-front">
          {coverImage && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lb-art" src={coverImage} alt="" loading="lazy" decoding="async" />
              <span className="lb-veil" />
            </>
          )}
          <span className="lb-front-ink">
            <span className="lb-pub">NCERT</span>
            <span className="lb-title">{cover}</span>
            <span className="lb-emblem">
              <Icon size={Math.round(16 * scale)} strokeWidth={1.7} />
            </span>
          </span>
          <span className="lb-groove" />
        </span>
        <span className="lb-face lb-back" />
        <span className="lb-face lb-spine">
          <span className="lb-spine-text">{cover} · Class {grade}</span>
        </span>
        <span className="lb-face lb-top" />
        <span className="lb-face lb-fore" />
      </span>
      <span className="lb-drop" />
    </span>
  );
}
