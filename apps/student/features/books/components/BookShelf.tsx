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
import Book3D, { subjectLabel, bookThickness } from './Book3D';
import type { GradeBook, GradePage } from './GradeLandingPage';

interface ShelfBookProps {
  book: GradeBook;
  pages: GradePage[];
  isActive: boolean;
  onSelect: (slug: string) => void;
}

function ShelfBook({ book, pages, isActive, onSelect }: ShelfBookProps) {
  const { completedSlugs, loading } = useBookProgress(book.slug);

  const pct = useMemo(() => {
    if (pages.length === 0) return 0;
    const done = pages.filter(p => completedSlugs.has(p.slug)).length;
    return Math.round((done / pages.length) * 100);
  }, [pages, completedSlugs]);

  const label = subjectLabel(book.subject);
  const chapters = book.chapters.length;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(book.slug)}
      className={`lb-card${isActive ? ' is-active' : ''}`}
      aria-label={`${label} — ${chapters} chapters, ${pct}% complete`}
    >
      <Book3D
        subject={book.subject}
        grade={book.grade}
        coverImage={book.cover_image}
        thickness={bookThickness(pages.length)}
      />

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
