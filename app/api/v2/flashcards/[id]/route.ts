import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Flashcard from '@/lib/models/Flashcard';
import { createClient } from '@/app/utils/supabase/server';

async function getAuthenticatedUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { id: 'local', email: 'local' };
  }

  try {
    const supabase = await createClient();
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      return { id: session.user.id, email: session.user.email || '' };
    }
    return null;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
}

// GET /api/v2/flashcards/[id] - Get single flashcard
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const user = await getAuthenticatedUser();
    const isAuthenticated = !!user;

    const flashcard = await Flashcard.findOne({
      flashcard_id: id,
      deleted_at: null,
    }).lean();

    if (!flashcard) {
      return NextResponse.json(
        { error: 'Flashcard not found' },
        { status: 404 }
      );
    }

    // Unauthenticated users: strip answer
    if (!isAuthenticated) {
      return NextResponse.json({
        ...flashcard,
        answer: '🔒 Sign in to view answer',
        authenticated: false,
      });
    }

    return NextResponse.json({
      ...flashcard,
      authenticated: true,
    });

  } catch (error) {
    console.error('Error fetching flashcard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcard' },
      { status: 500 }
    );
  }
}

// PATCH /api/v2/flashcards/[id] - Update flashcard (Admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    // Check authentication and admin (bypass for local development)
    const user = await getAuthenticatedUser();
    const isLocal = user?.id === 'local';
    
    if (!isLocal) {
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
      if (!adminEmails.includes(user.email)) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    }

    const body = await req.json();

    // Find existing flashcard
    const existingFlashcard = await Flashcard.findOne({
      flashcard_id: id,
      deleted_at: null,
    });

    if (!existingFlashcard) {
      return NextResponse.json(
        { error: 'Flashcard not found' },
        { status: 404 }
      );
    }

    // Convert to plain object to avoid Mongoose subdocument issues
    const existing = existingFlashcard.toObject();

    // Update fields
    const updateData: any = {
      chapter: body.chapter || existing.chapter,
      topic: body.topic || existing.topic,
      question: body.question !== undefined ? body.question : existing.question,
      answer: body.answer !== undefined ? body.answer : existing.answer,
      metadata: {
        ...existing.metadata,
        ...body.metadata,
        updated_at: new Date(),
      },
    };

    const updatedFlashcard = await Flashcard.findOneAndUpdate(
      { flashcard_id: id, deleted_at: null },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      flashcard: updatedFlashcard,
    });

  } catch (error) {
    console.error('Error updating flashcard:', error);
    return NextResponse.json(
      { error: 'Failed to update flashcard' },
      { status: 500 }
    );
  }
}

// DELETE /api/v2/flashcards/[id] - Soft delete flashcard (Admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    // Check authentication and admin (bypass for local development)
    const user = await getAuthenticatedUser();
    const isLocal = user?.id === 'local';
    
    if (!isLocal) {
      if (!user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
      if (!adminEmails.includes(user.email)) {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    }

    const flashcard = await Flashcard.findOneAndUpdate(
      { flashcard_id: id, deleted_at: null },
      { deleted_at: new Date() },
      { new: true }
    );

    if (!flashcard) {
      return NextResponse.json(
        { error: 'Flashcard not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Flashcard deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return NextResponse.json(
      { error: 'Failed to delete flashcard' },
      { status: 500 }
    );
  }
}
