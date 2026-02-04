/**
 * The Crucible - Taxonomy API (MongoDB Edition)
 * 
 * GET    /api/taxonomy - List all taxonomy entries
 * PATCH  /api/taxonomy - Update a single entry
 * POST   /api/taxonomy - Bulk update or seed from JSON
 */

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Taxonomy, ITaxonomy } from '@/lib/models';
import fs from 'fs/promises';
import path from 'path';

// Path to the taxonomy seed file (for initial seeding)
const TAXONOMY_SEED_PATH = path.join(process.cwd(), 'server/seed/taxonomy_seed.json');

interface TaxonomyPatchRequest {
    tag_id: string;
    updates: Partial<ITaxonomy>;
}

// GET - List all taxonomy entries from MongoDB
export async function GET() {
    try {
        const db = await connectToDatabase();

        if (!db) {
            // Fallback to local JSON if MongoDB not available
            try {
                const rawData = await fs.readFile(TAXONOMY_SEED_PATH, 'utf-8');
                const taxonomy = JSON.parse(rawData);
                return NextResponse.json({
                    source: 'local_json',
                    taxonomy,
                    stats: calculateStats(taxonomy)
                });
            } catch {
                return NextResponse.json(
                    { error: 'MongoDB unavailable and no local seed file found' },
                    { status: 500 }
                );
            }
        }

        const taxonomy = await Taxonomy.find({}).lean();

        // If MongoDB is empty, seed from local JSON
        if (taxonomy.length === 0) {
            try {
                const rawData = await fs.readFile(TAXONOMY_SEED_PATH, 'utf-8');
                const seedData = JSON.parse(rawData);

                // Seed MongoDB
                await Taxonomy.insertMany(seedData);

                return NextResponse.json({
                    source: 'seeded_from_json',
                    taxonomy: seedData,
                    stats: calculateStats(seedData),
                    message: `Seeded ${seedData.length} taxonomy entries from local JSON`
                });
            } catch (e) {
                return NextResponse.json({
                    source: 'mongodb',
                    taxonomy: [],
                    stats: { total: 0 },
                    message: 'MongoDB empty and no seed file found'
                });
            }
        }

        return NextResponse.json({
            source: 'mongodb',
            taxonomy,
            stats: calculateStats(taxonomy)
        });

    } catch (error) {
        console.error('Taxonomy fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

// PATCH - Update a single taxonomy entry
export async function PATCH(request: NextRequest) {
    try {
        const db = await connectToDatabase();

        if (!db) {
            return NextResponse.json(
                { error: 'MongoDB connection required for updates' },
                { status: 500 }
            );
        }

        const body: TaxonomyPatchRequest = await request.json();
        const { tag_id, updates } = body;

        if (!tag_id || !updates) {
            return NextResponse.json(
                { error: 'Missing required fields: tag_id, updates' },
                { status: 400 }
            );
        }

        const result = await Taxonomy.findByIdAndUpdate(
            tag_id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!result) {
            return NextResponse.json(
                { error: `Tag not found: ${tag_id}` },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            updated: result,
            message: `Updated taxonomy entry: ${tag_id}`
        });

    } catch (error) {
        console.error('Taxonomy patch error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

// POST - Bulk operations (seed or bulk update)
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
            const rawData = await fs.readFile(TAXONOMY_SEED_PATH, 'utf-8');
            const seedData = JSON.parse(rawData);

            // Clear existing and re-seed
            await Taxonomy.deleteMany({});
            await Taxonomy.insertMany(seedData);

            return NextResponse.json({
                success: true,
                message: `Seeded ${seedData.length} taxonomy entries`,
                stats: calculateStats(seedData)
            });
        }

        // Handle bulk update
        if (body.updates && Array.isArray(body.updates)) {
            const results: { tag_id: string; success: boolean; error?: string }[] = [];

            for (const update of body.updates as TaxonomyPatchRequest[]) {
                try {
                    const result = await Taxonomy.findByIdAndUpdate(
                        update.tag_id,
                        { $set: update.updates },
                        { new: true }
                    );
                    results.push({
                        tag_id: update.tag_id,
                        success: !!result,
                        error: result ? undefined : 'Not found'
                    });
                } catch (e) {
                    results.push({
                        tag_id: update.tag_id,
                        success: false,
                        error: String(e)
                    });
                }
            }

            const successCount = results.filter(r => r.success).length;

            return NextResponse.json({
                success: true,
                results,
                message: `Updated ${successCount}/${body.updates.length} entries`
            });
        }

        return NextResponse.json(
            { error: 'Invalid request. Use { action: "seed" } or { updates: [...] }' },
            { status: 400 }
        );

    } catch (error) {
        console.error('Taxonomy POST error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

// Helper to calculate stats
function calculateStats(taxonomy: any[]) {
    const withVideo = taxonomy.filter(t => t.remedial_video_url).length;
    const withNotes = taxonomy.filter(t => t.remedial_notes_url).length;
    const chapters = taxonomy.filter(t => t.is_chapter_tag).length;
    const concepts = taxonomy.filter(t => !t.is_chapter_tag).length;

    return {
        total: taxonomy.length,
        chapters,
        concepts,
        withRemedialVideo: withVideo,
        withRemedialNotes: withNotes,
        missingVideo: taxonomy.length - withVideo
    };
}
