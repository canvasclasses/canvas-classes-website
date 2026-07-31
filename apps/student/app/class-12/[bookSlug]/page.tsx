import { redirect } from 'next/navigation';

/**
 * /class-12/[bookSlug] — redirect back to the grade landing page.
 *
 * The reader's back button links to basePath = /class-12/[bookSlug]. Rather
 * than render a standalone single-book ToC (which would duplicate /class-12),
 * send the student to the unified Class 12 library. Mirrors /class-9.
 */
export default async function Class12BookRedirect() {
  redirect('/class-12');
}
