import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Chapter } from '@/lib/models/Chapter';

// GET - Fetch all chapters
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const classLevel = searchParams.get('class_level');
    const subject = searchParams.get('subject');
    const isActive = searchParams.get('is_active');
    
    // Build query
    const query: any = {};
    if (classLevel) query.class_level = classLevel;
    if (subject) query.subject = subject;
    if (isActive !== null) query.is_active = isActive === 'true';
    
    const chapters = await Chapter.find(query)
      .sort({ display_order: 1 })
      .lean();
    
    return NextResponse.json({
      success: true,
      data: chapters,
      total: chapters.length
    });
    
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chapters' },
      { status: 500 }
    );
  }
}

// POST - Create new chapter
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Check if chapter already exists
    const existing = await Chapter.findById(body._id);
    if (existing) {
      return NextResponse.json({
        success: false,
        error: 'Chapter already exists'
      }, { status: 409 });
    }
    
    // Create new chapter
    const chapter = await Chapter.create({
      _id: body._id,
      name: body.name,
      display_order: body.display_order || 0,
      stats: body.stats || { total_questions: 0 },
      is_active: body.is_active !== false
    });
    
    return NextResponse.json({
      success: true,
      data: chapter
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating chapter:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Chapter with this ID already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create chapter' },
      { status: 500 }
    );
  }
}
