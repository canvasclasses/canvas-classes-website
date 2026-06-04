import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import connectToDatabase from '@canvas/data/db/mongodb';
import BookModel from '@canvas/data/models/Book';
import type { Book } from '@canvas/data/types/books';
import VaultReviewClient from '@/features/books/components/vault/VaultReviewClient';

// Static shell — the per-user vault state hydrates inside the client island
// (which fetches /api/v2/user/word-vault on mount). The page itself only
// renders public book metadata, so it caches like every other book route.
export const revalidate = 3600;

interface Props {
  params: Promise<{ bookSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookSlug } = await params;
  await connectToDatabase();
  const book = await BookModel.findOne({ slug: bookSlug }).lean<Book | null>();
  if (!book) return {};
  return {
    title: `Word Vault — ${book.title}`,
    description: `Review and master the vocabulary from ${book.title} with spaced repetition.`,
    robots: { index: false, follow: true }, // a per-user study tool — not a content page
  };
}

export default async function VaultRoute({ params }: Props) {
  const { bookSlug } = await params;

  await connectToDatabase();
  const book = await BookModel.findOne({ slug: bookSlug }).lean<Book | null>();
  if (!book || !book.is_published) notFound();

  return (
    <VaultReviewClient
      bookSlug={bookSlug}
      bookTitle={book.title}
      basePath={`/class-9/${bookSlug}`}
    />
  );
}
