'use client';

/*
 * BookShelf — the subject chooser: a real 3D book floating above each card.
 *
 * GEOMETRY (adapted from the founder's reference mock, which is a better model
 * than the one it replaced): a true six-face box — front, back, spine, top
 * page-block, fore-edge page-block — inside a `.lb-scene` that owns the
 * perspective. Every face is derived from three custom properties, so a book's
 * THICKNESS can come from its real page count:
 *
 *     --lb-w  cover width      --lb-h  cover height      --lb-t  thickness
 *
 * ⚠️  NEVER put `filter`, `opacity`, `backdrop-filter` or `mask` on .lb-book
 * or .lb-scene. Those are grouping properties: they force `transform-style:
 * flat`, which collapses all six faces into one plane. That is exactly why the
 * previous build's books refused to rotate — they were being squashed, not
 * turned. Dim the FACES instead (see .lb-front::after).
 *
 * Hover is driven from the CARD (`.lb-card:hover`), not the book, so the hit
 * area is a stable rectangle rather than a skewed 3D silhouette.
 */

import { useMemo } from 'react';
import { useBookProgress } from '@/features/books/hooks/useBookProgress';
import { getTheme } from './bookDesign';
import type { GradeBook, GradePage } from './GradeLandingPage';

/**
 * Subjects arrive from the DB as raw slugs — `social_science`, `life_skills`,
 * lowercase. Render them as words.
 *
 * A few get a shorter display name so they fit the cover board and read the way
 * students actually say them ("Maths", not "Mathematics"). The full subject is
 * still what the DB stores and what the card body shows.
 */
const COVER_NAME: Record<string, string> = {
  mathematics: 'Maths',
  'social science': 'Social Science',
  'life skills': 'Life Skills',
};

function subjectLabel(subject: string) {
  return subject
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** The name printed on the cover — short form where one exists. */
function coverName(subject: string) {
  const key = subject.replace(/[_-]+/g, ' ').trim().toLowerCase();
  return COVER_NAME[key] ?? subjectLabel(subject);
}

/**
 * The cover is a fixed 112px board, so a long title has to come down to fit —
 * "Mathematics" and "Social Science" were running off the edge of the book.
 * Stepped rather than continuous so the set still looks like one publisher.
 */
function coverTitleSize(label: string) {
  const n = label.length;
  if (n <= 5)  return 21;   // Maths, Hindi
  if (n <= 8)  return 18;   // Physics, Biology, Science, English
  if (n <= 11) return 15;   // Life Skills, Chemistry
  // "Social Science" wraps to two lines at this width regardless of size —
  // it isn't fighting to fit on one, so it doesn't need the cramped size a
  // long single-line name would. Sized for a comfortable two-line stack.
  if (n <= 15) return 16;   // Social Science
  return 12;
}

/* Thickness from the real page count — a readable exaggeration, not a scale
 * model, so a 12-page book still reads as a book. */
function thickness(pageCount: number) {
  const t = Math.max(0, Math.min(1, pageCount / 80));
  return Math.round(20 + t * 22); // 20 → 42px of spine
}

interface ShelfBookProps {
  book: GradeBook;
  pages: GradePage[];
  isActive: boolean;
  onSelect: (slug: string) => void;
}

function ShelfBook({ book, pages, isActive, onSelect }: ShelfBookProps) {
  const theme = getTheme(book.subject);
  const Icon = theme.icon;
  const { completedSlugs, loading } = useBookProgress(book.slug);

  const pct = useMemo(() => {
    if (pages.length === 0) return 0;
    const done = pages.filter(p => completedSlugs.has(p.slug)).length;
    return Math.round((done / pages.length) * 100);
  }, [pages, completedSlugs]);

  const label = subjectLabel(book.subject);   // card body + a11y
  const cover = coverName(book.subject);      // the shorter name on the board
  const chapters = book.chapters.length;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(book.slug)}
      className={`lb-card${isActive ? ' is-active' : ''}`}
      style={{
        ['--lb-cloth' as string]: theme.cloth,
        ['--lb-edge' as string]: `rgb(${theme.ambient})`,
        ['--lb-t' as string]: `${thickness(pages.length)}px`,
        ['--lb-title-size' as string]: `${coverTitleSize(cover)}px`,
      }}
      aria-label={`${label} — ${chapters} chapters, ${pct}% complete`}
    >
      <span className="lb-scene">
        <span className="lb-book">
          <span className="lb-face lb-front">
            {book.cover_image && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="lb-art" src={book.cover_image} alt="" loading="lazy" decoding="async" />
                <span className="lb-veil" />
              </>
            )}
            <span className="lb-front-ink">
              <span className="lb-pub">NCERT</span>
              <span className="lb-title">{cover}</span>
              <span className="lb-emblem"><Icon size={16} strokeWidth={1.7} /></span>
            </span>
            <span className="lb-groove" />
          </span>
          <span className="lb-face lb-back" />
          <span className="lb-face lb-spine">
            <span className="lb-spine-text">{cover} · Class {book.grade}</span>
          </span>
          <span className="lb-face lb-top" />
          <span className="lb-face lb-fore" />
        </span>
        <span className="lb-drop" />
      </span>

      <span className="lb-meta">
        <span className="lb-name">{label}</span>
        <span className="lb-sub">{chapters} {chapters === 1 ? 'chapter' : 'chapters'}</span>
        <span className="lb-bar"><i style={{ width: `${loading ? 0 : pct}%` }} /></span>
        <span className="lb-pct">{pct > 0 ? `${pct}% complete` : 'Not started'}</span>
      </span>
    </button>
  );
}

export interface BookShelfProps {
  heading: string;
  books: GradeBook[];
  pages: GradePage[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}

export default function BookShelf({ heading, books, pages, activeSlug, onSelect }: BookShelfProps) {
  /* The wash behind the books takes the SELECTED subject's colour and drifts.
     Light and colour only — never floating subject glyphs, which are the
     strongest "AI-generated page" tell. */
  const ambient = useMemo(() => {
    const active = books.find(b => b.slug === activeSlug) ?? books[0];
    return active ? getTheme(active.subject).ambient : '140, 52, 104';
  }, [books, activeSlug]);

  if (books.length === 0) return null;

  return (
    <section className="lb-section" style={{ ['--lb-ambient' as string]: ambient }}>
      <div className="lb-heading">
        <h2>{heading}</h2>
        <span className="lb-count">
          {books.length} {books.length === 1 ? 'book' : 'books'}
        </span>
      </div>

      <div className="lb-stage">
        <div className="lb-aurora" aria-hidden="true">
          <i /><i /><i />
        </div>
        <div className="lb-grid" role="tablist" aria-label={heading}>
          {books.map(b => (
            <ShelfBook
              key={b.slug}
              book={b}
              pages={pages.filter(p => p.book_id === b._id)}
              isActive={b.slug === activeSlug}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
