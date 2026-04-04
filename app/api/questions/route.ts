/**
 * The Crucible - Questions API (MongoDB Edition)
 * 
 * GET    /api/questions - List questions with filters
 * POST   /api/questions - Seed from JSON or add new question
 */

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Question, IQuestion } from '@/lib/models';
import fs from 'fs/promises';
import path from 'path';

// Path to migrated questions
const QUESTIONS_SEED_PATH = path.join(process.cwd(), 'server/seed/questions_migrated.json');
const QUESTIONS_LEGACY_PATH = path.join(process.cwd(), 'app/the-crucible/questions.json');

// GET - List questions with optional filters
export async function GET(request: NextRequest) {
    try {
        const db = await connectToDatabase();
        const { searchParams } = new URL(request.url);

        // Parse filters
        const chapter = searchParams.get('chapter');
        const difficulty = searchParams.get('difficulty');
        const tagId = searchParams.get('tag');
        const limit = parseInt(searchParams.get('limit') || '100');
        const skip = parseInt(searchParams.get('skip') || '0');

        if (!db) {
            // Fallback to local JSON
            try {
                let rawData: string;
                try {
                    rawData = await fs.readFile(QUESTIONS_SEED_PATH, 'utf-8');
                } catch {
                    rawData = await fs.readFile(QUESTIONS_LEGACY_PATH, 'utf-8');
                }
                let questions = JSON.parse(rawData);

                // Apply filters
                interface QuestionRecord {
                  chapter_id?: string;
                  chapterId?: string;
                  meta?: { difficulty?: string };
                  difficulty?: string;
                  tags?: Array<{ tag_id?: string }>;
                  tagId?: string;
                }
                if (chapter) {
                    questions = questions.filter((q: QuestionRecord) =>
                        q.chapter_id === chapter || q.chapterId === chapter
                    );
                }
                if (difficulty) {
                    questions = questions.filter((q: QuestionRecord) =>
                        q.meta?.difficulty === difficulty || q.difficulty === difficulty
                    );
                }
                if (tagId) {
                    questions = questions.filter((q: QuestionRecord) =>
                        q.tags?.some((t: { tag_id?: string }) => t.tag_id === tagId) || q.tagId === tagId
                    );
                }

                const total = questions.length;
                questions = questions.slice(skip, skip + limit);

                return NextResponse.json({
                    source: 'local_json',
                    questions,
                    total,
                    limit,
                    skip
                });
            } catch (e) {
                return NextResponse.json(
                    { error: 'Failed to load questions', details: String(e) },
                    { status: 500 }
                );
            }
        }

        // Build MongoDB query
        const query: Record<string, unknown> = {};
        if (chapter) query.chapter_id = chapter;
        if (difficulty) query['meta.difficulty'] = difficulty;
        if (tagId) query['tags.tag_id'] = tagId;

        const [questions, total] = await Promise.all([
            Question.find(query).skip(skip).limit(limit).lean(),
            Question.countDocuments(query)
        ]);

        // If empty, check if we need to seed
        if (total === 0 && !chapter && !difficulty && !tagId) {
            return NextResponse.json({
                source: 'mongodb',
                questions: [],
                total: 0,
                message: 'MongoDB is empty. Use POST with { action: "seed" } to seed from JSON.'
            });
        }

        return NextResponse.json({
            source: 'mongodb',
            questions,
            total,
            limit,
            skip
        });

    } catch (error) {
        console.error('Questions fetch error:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error',
                ...(process.env.NODE_ENV === 'development' && { details: String(error) })
            },
            { status: 500 }
        );
    }
}

// POST - Seed or add questions
export async function POST(request: NextRequest) {
    try {
        const db = await connectToDatabase();

        if (!db) {
            return NextResponse.json(
                { error: 'MongoDB connection required' },
                { status: 500 }
            );
        }

        const body = await request.json();

        // Handle seed operation
        if (body.action === 'seed') {
            interface SeedQuestion {
              _id: string;
              text_markdown: string;
              type: string;
              options: unknown;
              integer_answer: unknown;
              tags: Array<{ tag_id: string; weight: number }>;
              meta: Record<string, unknown>;
              chapter_id: unknown;
              is_pyq: boolean;
              is_top_pyq: boolean;
              solution: Record<string, unknown>;
              trap: unknown;
            }
            let seedData: SeedQuestion[];

            try {
                // Try migrated format first
                const rawData = await fs.readFile(QUESTIONS_SEED_PATH, 'utf-8');
                seedData = JSON.parse(rawData);
            } catch {
                // Fallback to legacy format and transform
                const rawData = await fs.readFile(QUESTIONS_LEGACY_PATH, 'utf-8');
                interface LegacyQuestion {
                  id: string;
                  textMarkdown: string;
                  type?: string;
                  options: unknown;
                  integerAnswer?: unknown;
                  tagId?: string;
                  chapterId?: string;
                  isPYQ?: boolean;
                  isTopPYQ?: boolean;
                  solution?: Record<string, unknown>;
                  trap?: { likelyWrongChoiceId?: string; message?: string; conceptGapTag?: string };
                  examSource?: string;
                  difficulty?: string;
                }
                const legacyQuestions: LegacyQuestion[] = JSON.parse(rawData);

                // Transform to new schema
                seedData = legacyQuestions.map((q: LegacyQuestion): SeedQuestion => ({
                    _id: q.id,
                    text_markdown: q.textMarkdown,
                    type: q.type || 'MCQ',
                    options: q.options,
                    integer_answer: q.integerAnswer || null,
                    tags: [{
                        tag_id: 'TAG_' + (q.tagId || 'UNKNOWN').toUpperCase().replace(/[^A-Z0-9]/g, '_'),
                        weight: 1.0
                    }],
                    meta: {
                        exam: parseExam(q.examSource),
                        year: parseYear(q.examSource),
                        difficulty: q.difficulty || 'Medium',
                        avg_time_sec: 120
                    },
                    chapter_id: q.chapterId || null,
                    is_pyq: q.isPYQ || false,
                    is_top_pyq: q.isTopPYQ || false,
                    solution: {
                        text_latex: q.solution?.textSolutionLatex || '',
                        video_url: q.solution?.videoUrl || null,
                        audio_url: q.solution?.audioExplanationUrl || null,
                        image_url: q.solution?.handwrittenSolutionImageUrl || null
                    },
                    trap: q.trap ? {
                        likely_wrong_choice_id: q.trap.likelyWrongChoiceId,
                        message: q.trap.message,
                        concept_gap_tag: q.trap.conceptGapTag
                    } : null
                }));
            }

            // Clear and seed
            await Question.deleteMany({});
            await Question.insertMany(seedData);

            return NextResponse.json({
                success: true,
                message: `Seeded ${seedData.length} questions`,
                sample: seedData[0]
            });
        }

        // Handle single question add
        if (body.question) {
            const newQuestion = new Question(body.question);
            await newQuestion.save();

            return NextResponse.json({
                success: true,
                question: newQuestion,
                message: 'Question added successfully'
            });
        }

        return NextResponse.json(
            { error: 'Invalid request. Use { action: "seed" } or { question: {...} }' },
            { status: 400 }
        );

    } catch (error) {
        console.error('Questions POST error:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error',
                ...(process.env.NODE_ENV === 'development' && { details: String(error) })
            },
            { status: 500 }
        );
    }
}

// Helper functions
function parseExam(examSource: string | undefined): string | null {
    if (!examSource) return null;
    const lower = examSource.toLowerCase();
    if (lower.includes('advanced')) return 'JEE Advanced';
    if (lower.includes('main') || lower.includes('aieee')) return 'JEE Mains';
    if (lower.includes('neet')) return 'NEET';
    if (lower.includes('cbse')) return 'CBSE';
    return 'Other';
}

function parseYear(examSource: string | undefined): number | null {
    if (!examSource) return null;
    const match = examSource.match(/\b(19|20)\d{2}\b/);
    return match ? parseInt(match[0]) : null;
}
