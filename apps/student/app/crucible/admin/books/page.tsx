import { Suspense } from 'react';
import BookWorkspace from '@/components/books/editor/BookWorkspace';

// BookWorkspace uses useSearchParams to restore the last-viewed page after
// refresh — that hook requires a Suspense boundary above it in Next 15.
export default function BooksAdminPage() {
  return (
    <Suspense fallback={null}>
      <BookWorkspace />
    </Suspense>
  );
}
