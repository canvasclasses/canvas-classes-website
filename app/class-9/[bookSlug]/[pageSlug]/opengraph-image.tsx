/**
 * Dynamic Open Graph image for Class 9 book pages.
 *
 * When a parent/teacher shares a chapter link on WhatsApp, Twitter, or
 * a school group, the preview card pulls from here — so each page gets
 * its own branded image with the chapter/page title instead of the
 * generic site logo.
 *
 * Edge runtime keeps cold starts fast. Revalidate matches the page
 * revalidate so a title edit in the editor reflects within a minute.
 */

import { ImageResponse } from 'next/og';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import type { Book, BookPage } from '@/types/books';

export const runtime = 'nodejs';
export const revalidate = 60;

export const alt = 'Canvas Classes — Class 9 NCERT lesson';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SUBJECT_LABELS: Record<string, string> = {
  chemistry: 'Chemistry',
  biology: 'Biology',
  physics: 'Physics',
  mathematics: 'Mathematics',
  science: 'Science',
  social_science: 'Social Science',
};

export default async function OgImage({
  params,
}: {
  // Next 15 passes dynamic params as a Promise — matches the page route.
  params: Promise<{ bookSlug: string; pageSlug: string }>;
}) {
  const { bookSlug, pageSlug } = await params;

  // Best-effort fetch — if DB is down, fall back to a branded default
  // card rather than failing the entire share preview.
  let pageTitle = 'Class 9 NCERT Lesson';
  let subjectLabel = 'Science';
  let chapterLabel = '';

  try {
    await connectToDatabase();
    const book = await BookModel
      .findOne({ slug: bookSlug, grade: 9, is_published: true })
      .select('subject chapters')
      .lean<Book | null>();
    if (book) {
      subjectLabel = SUBJECT_LABELS[book.subject] ?? 'Science';
      const page = await BookPageModel
        .findOne({ book_id: String(book._id), slug: pageSlug, published: true })
        .select('title chapter_number')
        .lean<BookPage | null>();
      if (page) {
        pageTitle = page.title;
        const chapter = book.chapters.find((c) => c.number === page.chapter_number);
        if (chapter) {
          chapterLabel = `Chapter ${chapter.number} · ${chapter.title}`;
        }
      }
    }
  } catch {
    // Stick with defaults — never throw here, or social cards break.
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background:
            'linear-gradient(135deg, #050505 0%, #0B0F15 55%, #151E32 100%)',
          fontFamily: 'sans-serif',
          color: 'white',
        }}
      >
        {/* Top row — brand + badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #f97316, #fbbf24)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 800,
                color: '#0B0F15',
              }}
            >
              C
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.3 }}>
                Canvas Classes
              </span>
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                Live Books
              </span>
            </div>
          </div>
          <div
            style={{
              padding: '10px 18px',
              borderRadius: 999,
              background: 'rgba(249,115,22,0.12)',
              border: '1px solid rgba(249,115,22,0.35)',
              color: '#fdba74',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            Class 9 · NCERT {subjectLabel}
          </div>
        </div>

        {/* Middle — the page title dominates the card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1040 }}>
          {chapterLabel && (
            <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
              {chapterLabel}
            </span>
          )}
          <span
            style={{
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: -1.5,
              lineHeight: 1.05,
              color: 'white',
            }}
          >
            {pageTitle}
          </span>
        </div>

        {/* Bottom — value proposition */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: '#f97316',
            }}
          />
          <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
            Interactive lessons · Simulations · Worked examples
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
