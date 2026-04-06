import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import connectToDatabase from '@/lib/mongodb';
import BookModel from '@/lib/models/Book';
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

// GET /api/v2/books — list all books
export async function GET() {
  try {
    await connectToDatabase();
    const books = await BookModel.find({}).sort({ created_at: -1 }).lean();
    return NextResponse.json({ success: true, data: books, total: books.length });
  } catch (error) {
    console.error('GET /api/v2/books error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch books' }, { status: 500 });
  }
}

// POST /api/v2/books — create a new book (admin only)
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.title || !body.slug || !body.subject || !body.grade) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, slug, subject, grade' },
        { status: 400 }
      );
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(body.slug)) {
      return NextResponse.json(
        { success: false, error: 'slug must be lowercase alphanumeric with hyphens only' },
        { status: 400 }
      );
    }

    const book = await BookModel.create({
      _id: uuidv4(),
      slug: body.slug,
      title: body.title,
      subject: body.subject,
      grade: body.grade,
      board: body.board || 'ncert',
      cover_image: body.cover_image || undefined,
      chapters: [],
      is_published: false,
    });

    return NextResponse.json({ success: true, data: book }, { status: 201 });
  } catch (error: unknown) {
    console.error('POST /api/v2/books error:', error);
    if (error instanceof Error && (error as Error & { code?: number }).code === 11000) {
      return NextResponse.json(
        { success: false, error: 'A book with this slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: 'Failed to create book' }, { status: 500 });
  }
}
