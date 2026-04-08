import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import { BookOpen, ChevronRight, Play } from 'lucide-react';

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export default async function BookLandingPage({ params }: Props) {
  const { bookSlug } = await params;
  await connectToDatabase();

  const book = await BookModel.findOne({ slug: bookSlug }).lean();
  if (!book) notFound();

  const pages = await BookPageModel
    .find({ book_id: String(book._id), published: true })
    .select('slug title chapter_number page_number reading_time_min')
    .sort({ chapter_number: 1, page_number: 1 })
    .lean();

  const firstPage = pages[0];

  // Group pages by chapter
  const byChapter = book.chapters
    .slice()
    .sort((a, b) => a.number - b.number)
    .map(ch => ({
      ...ch,
      pages: pages.filter(p => p.chapter_number === ch.number),
    }));

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-2xl mx-auto px-4 py-12">

        {/* Book header */}
        <div className="flex items-start gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500
            flex items-center justify-center shrink-0">
            <BookOpen size={26} className="text-black" />
          </div>
          <div>
            <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-1">
              {book.subject} · Grade {book.grade}
            </p>
            <h1 className="text-3xl font-bold text-white">{book.title}</h1>
          </div>
        </div>

        {/* Start button */}
        {firstPage && (
          <Link href={`/books/${bookSlug}/${firstPage.slug}`}
            className="flex items-center justify-center gap-2 w-full py-3.5 mb-10 rounded-2xl
              bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-base
              hover:opacity-90 transition-opacity">
            <Play size={18} className="fill-black" />
            Start Learning
          </Link>
        )}

        {/* Chapter list */}
        <div className="flex flex-col gap-6">
          {byChapter.map(ch => (
            <div key={ch.number}>
              <h2 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 px-1">
                Chapter {ch.number} — {ch.title}
              </h2>
              <div className="flex flex-col gap-1.5">
                {ch.pages.map((pg, i) => (
                  <Link
                    key={pg.slug}
                    href={`/books/${bookSlug}/${pg.slug}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/8
                      bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-colors group"
                  >
                    <span className="w-6 h-6 rounded-full border border-white/15 flex items-center
                      justify-center text-xs text-white/40 shrink-0 group-hover:border-orange-500/40
                      group-hover:text-orange-400 transition-colors">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-white/75 group-hover:text-white transition-colors">
                      {pg.title}
                    </span>
                    {pg.reading_time_min && (
                      <span className="text-xs text-white/25 shrink-0">{pg.reading_time_min} min</span>
                    )}
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 shrink-0" />
                  </Link>
                ))}
                {ch.pages.length === 0 && (
                  <p className="text-xs text-white/20 px-4 py-2">No published pages yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
