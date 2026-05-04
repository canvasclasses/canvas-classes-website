import type { Metadata } from 'next';
import LiveBooksComingSoon from '@/components/books/LiveBooksComingSoon';

const SITE_URL = 'https://www.canvasclasses.in';
const CANONICAL = `${SITE_URL}/live-books`;

export const metadata: Metadata = {
  title: 'Live Books — Interactive NCERT Lessons | Canvas Classes',
  description:
    'Canvas Live Books turn every NCERT chapter into an interactive lesson — simulations, worked examples, quizzes, and Hinglish mode. Coming soon across grades.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    type: 'website',
    url: CANONICAL,
    siteName: 'Canvas Classes',
    locale: 'en_IN',
    title: 'Live Books — Interactive NCERT Lessons',
    description:
      'Interactive NCERT live books with simulations, worked examples, and Hinglish mode. Coming soon across grades.',
  },
};

export default function LiveBooksPage() {
  return <LiveBooksComingSoon />;
}
