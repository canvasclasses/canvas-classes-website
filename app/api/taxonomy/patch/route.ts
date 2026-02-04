/**
 * The Crucible - Taxonomy Patch API
 * 
 * PATCH /api/taxonomy/patch
 * 
 * Allows updating individual taxonomy entries (e.g., adding remedial_video_url)
 * without re-seeding the entire database.
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Path to the taxonomy seed file
const TAXONOMY_PATH = path.join(process.cwd(), 'server/seed/taxonomy_seed.json');

interface TaxonomyPatchRequest {
    tag_id: string;
    updates: {
        remedial_video_url?: string;
        remedial_notes_url?: string;
        name?: string;
        parent_id?: string;
    };
}

interface TaxonomyEntry {
    _id: string;
    name: string;
    parent_id: string | null;
    subject: string;
    chapter: string;
    question_count: number;
    remedial_video_url?: string;
    remedial_notes_url?: string;
    is_chapter_tag?: boolean;
}

// PATCH - Update a single taxonomy entry
export async function PATCH(request: NextRequest) {
    try {
        const body: TaxonomyPatchRequest = await request.json();
        const { tag_id, updates } = body;

        if (!tag_id || !updates) {
            return NextResponse.json(
                { error: 'Missing required fields: tag_id, updates' },
                { status: 400 }
            );
        }

        // Read current taxonomy
        const rawData = await fs.readFile(TAXONOMY_PATH, 'utf-8');
        const taxonomy: TaxonomyEntry[] = JSON.parse(rawData);

        // Find the entry
        const index = taxonomy.findIndex(t => t._id === tag_id);

        if (index === -1) {
            return NextResponse.json(
                { error: `Tag not found: ${tag_id}` },
                { status: 404 }
            );
        }

        // Apply updates
        const updatedEntry = {
            ...taxonomy[index],
            ...updates
        };
        taxonomy[index] = updatedEntry;

        // Write back
        await fs.writeFile(TAXONOMY_PATH, JSON.stringify(taxonomy, null, 2));

        return NextResponse.json({
            success: true,
            updated: updatedEntry,
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

// GET - List all taxonomy entries
export async function GET() {
    try {
        const rawData = await fs.readFile(TAXONOMY_PATH, 'utf-8');
        const taxonomy: TaxonomyEntry[] = JSON.parse(rawData);

        // Calculate stats
        const withVideo = taxonomy.filter(t => t.remedial_video_url).length;
        const withNotes = taxonomy.filter(t => t.remedial_notes_url).length;
        const chapters = taxonomy.filter(t => t.is_chapter_tag).length;
        const concepts = taxonomy.filter(t => !t.is_chapter_tag).length;

        return NextResponse.json({
            taxonomy,
            stats: {
                total: taxonomy.length,
                chapters,
                concepts,
                withRemedialVideo: withVideo,
                withRemedialNotes: withNotes,
                missingVideo: taxonomy.length - withVideo
            }
        });

    } catch (error) {
        console.error('Taxonomy fetch error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Bulk update multiple taxonomy entries
export async function POST(request: NextRequest) {
    try {
        const body: { updates: TaxonomyPatchRequest[] } = await request.json();
        const { updates } = body;

        if (!updates || !Array.isArray(updates)) {
            return NextResponse.json(
                { error: 'Missing required field: updates (array)' },
                { status: 400 }
            );
        }

        // Read current taxonomy
        const rawData = await fs.readFile(TAXONOMY_PATH, 'utf-8');
        const taxonomy: TaxonomyEntry[] = JSON.parse(rawData);

        const results: { tag_id: string; success: boolean; error?: string }[] = [];

        for (const update of updates) {
            const { tag_id, updates: fields } = update;
            const index = taxonomy.findIndex(t => t._id === tag_id);

            if (index === -1) {
                results.push({ tag_id, success: false, error: 'Not found' });
                continue;
            }

            taxonomy[index] = { ...taxonomy[index], ...fields };
            results.push({ tag_id, success: true });
        }

        // Write back
        await fs.writeFile(TAXONOMY_PATH, JSON.stringify(taxonomy, null, 2));

        const successCount = results.filter(r => r.success).length;

        return NextResponse.json({
            success: true,
            results,
            message: `Updated ${successCount}/${updates.length} taxonomy entries`
        });

    } catch (error) {
        console.error('Taxonomy bulk update error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
