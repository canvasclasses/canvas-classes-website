import { Metadata } from 'next';
import { Suspense } from 'react';
import BookWorkspace from '@/features/admin/books-editor/BookWorkspace';

export const metadata: Metadata = {
  title: 'Books Editor | Canvas Classes',
  description: 'Author and curate Live Books pages.',
};

// BookWorkspace reads selection from the URL (?book=...&page=...) via
// useSearchParams, which Next 15 requires to be wrapped in Suspense.
export default function BooksAdminPage() {
  return (
    <Suspense fallback={null}>
      <BookWorkspace />
    </Suspense>
  );
}
