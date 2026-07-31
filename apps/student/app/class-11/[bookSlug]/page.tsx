import { redirect } from 'next/navigation';

/**
 * /class-11/[bookSlug] — redirect back to the grade landing page.
 *
 * The reader's back button links to basePath = /class-11/[bookSlug]. Rather
 * than render a standalone single-book ToC (which would duplicate /class-11),
 * send the student to the unified Class 11 library. Mirrors /class-9.
 */
export default async function Class11BookRedirect() {
  redirect('/class-11');
}
