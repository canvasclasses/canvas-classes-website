import { redirect } from 'next/navigation';

/**
 * /class-9/[bookSlug] — redirect back to the grade landing page.
 *
 * The reader's back button (←) links to basePath = /class-9/[bookSlug].
 * Instead of rendering a standalone single-book ToC (which duplicates /class-9),
 * we redirect so the student always lands on the unified Class 9 page.
 */
export default async function Class9BookRedirect() {
  redirect('/class-9');
}
