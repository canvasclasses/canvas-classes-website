import { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { requireSuperAdmin } from '@/lib/adminAuth';
import BookWorkspace from '@/features/admin/books-editor/BookWorkspace';

export const metadata: Metadata = {
  title: 'Books Editor | Canvas Classes',
  description: 'Author and curate Live Books pages.',
};

export const dynamic = 'force-dynamic';

// BookWorkspace reads selection from the URL (?book=...&page=...) via
// useSearchParams, which Next 15 requires to be wrapped in Suspense.
export default async function BooksAdminPage() {
  const admin = await requireSuperAdmin();
  if (!admin) redirect('/');
  return (
    <Suspense fallback={null}>
      <BookWorkspace />
    </Suspense>
  );
}
