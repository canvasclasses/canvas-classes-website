import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
import BookPageModel from '@/lib/models/BookPage';
import { createClient } from '@/app/utils/supabase/server';

async function requireAdmin(): Promise<{ email: string } | null> {
  if (process.env.NODE_ENV === 'development') {
    return { email: 'dev@localhost' };
  }
  try {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return null;
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);
    if (!adminEmails.includes(user.email)) return null;
    return { email: user.email };
  } catch {
    return null;
  }
}

type Params = { params: Promise<{ bookSlug: string }> };

// GET /api/v2/books/[bookSlug] — get book with chapters
export async function GET(_req: NextRequest, { params }: Params) {
  const { bookSlug } = await params;
  try {
    await connectToDatabase();
    const book = await BookModel.findOne({ slug: bookSlug }).lean();
    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: book });
  } catch (error) {
    console.error(`GET /api/v2/books/${bookSlug} error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to fetch book' }, { status: 500 });
  }
}

// PUT /api/v2/books/[bookSlug] — update book metadata (admin only)
export async function PUT(req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  const { bookSlug } = await params;
  try {
    await connectToDatabase();
    const body = await req.json();

    // Prevent overwriting _id or slug via this endpoint
    delete body._id;
    delete body.slug;

    const book = await BookModel.findOneAndUpdate(
      { slug: bookSlug },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: book });
  } catch (error) {
    console.error(`PUT /api/v2/books/${bookSlug} error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to update book' }, { status: 500 });
  }
}

// DELETE /api/v2/books/[bookSlug] — delete book and all its pages (admin only)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  const { bookSlug } = await params;
  try {
    await connectToDatabase();
    const book = await BookModel.findOne({ slug: bookSlug }).lean();
    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    // Delete all pages belonging to this book
    await BookPageModel.deleteMany({ book_id: String(book._id) });
    await BookModel.deleteOne({ slug: bookSlug });

    return NextResponse.json({ success: true, message: 'Book and all its pages deleted' });
  } catch (error) {
    console.error(`DELETE /api/v2/books/${bookSlug} error:`, error);
    return NextResponse.json({ success: false, error: 'Failed to delete book' }, { status: 500 });
  }
}
