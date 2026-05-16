// TODO (follow-up phase): the book editor (`features/books/components/editor/`,
// 27 files) lives in apps/student/. It is admin-only by intent — student
// users never reach it — but it's coupled into features/books which is the
// student book reader feature. Properly migrating it to apps/admin requires:
//   1. Moving features/books/components/editor → apps/admin/features/admin/books-editor.
//   2. Resolving its one outbound edge to MoleculeViewer
//      (`features/simulations/components/organic-wizard/MoleculeViewer`),
//      which pulls in three.js + openchemlib + smiles-drawer. Either add
//      those deps to admin's package.json, promote MoleculeViewer to a
//      shared package, or stub the 3D editor for the admin app.
//
// Until that migration ships, this page stands in as a placeholder.
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function BooksAdminPlaceholder() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30">
          <BookOpen className="w-5 h-5 text-orange-300" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Books editor — migration pending</h1>
        <p className="text-sm text-white/60 leading-relaxed">
          The book editor is being ported from the student app. Until it lands here,
          continue editing books from <code className="px-1 rounded bg-white/5">canvasclasses.in/crucible/admin/books</code>
          {' '}only if that route still exists on a legacy deployment.
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-orange-300 hover:text-orange-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to admin
        </Link>
      </div>
    </main>
  );
}
