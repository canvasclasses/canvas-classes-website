import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { requireAdmin } from '@/lib/bookAuth';

/**
 * POST /api/v2/taxonomy/save
 * Persists the full taxonomy array back to taxonomyData_from_csv.ts
 * Body: { nodes: TaxonomyNode[] }
 * This is the ONLY way taxonomy edits should be saved — through this endpoint.
 *
 * WARNING: This writes to the local filesystem which only works in non-serverless
 * environments. On Vercel/serverless the filesystem is read-only (except /tmp).
 * TODO: Migrate taxonomy storage to MongoDB for production scalability.
 */
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  // Guard: filesystem writes are not available in serverless environments
  if (process.env.VERCEL === '1') {
    return NextResponse.json(
      { success: false, error: 'Taxonomy save is not available in serverless deployments. Use local dev or migrate to database storage.' },
      { status: 503 }
    );
  }

  try {
    const { nodes } = await request.json();

    if (!Array.isArray(nodes)) {
      return NextResponse.json({ success: false, error: 'nodes must be an array' }, { status: 400 });
    }

    // Validate each node has required fields
    for (const node of nodes) {
      if (!node.id || !node.name || !node.type) {
        return NextResponse.json(
          { success: false, error: `Invalid node: ${JSON.stringify(node)}` },
          { status: 400 }
        );
      }
    }

    interface TaxonomyNode {
      id: string;
      name: string;
      parent_id: string | null;
      type: string;
      sequence_order?: number;
      class_level?: number;
      chapterType?: string;
    }
    const chapters = nodes.filter((n: TaxonomyNode) => n.type === 'chapter');
    const tags = nodes.filter((n: TaxonomyNode) => n.type === 'topic');
    const microTopics = nodes.filter((n: TaxonomyNode) => n.type === 'micro_topic');

    // Generate the TypeScript file content
    const lines: string[] = [
      '// CRITICAL: This taxonomy data is the single source of truth for the practice session.',
      '// DO NOT MODIFY DIRECTLY — use the Taxonomy Dashboard at /crucible/admin/taxonomy',
      '// Changes made in the dashboard are auto-saved here via POST /api/v2/taxonomy/save',
      '',
      'export interface TaxonomyNode {',
      "    id: string;",
      "    name: string;",
      "    parent_id: string | null;",
      "    type: 'chapter' | 'topic' | 'micro_topic';",
      "    sequence_order?: number;",
      "    class_level?: 9 | 10 | 11 | 12;",
      "    chapterType?: 'physical' | 'inorganic' | 'organic' | 'practical' | 'physics' | 'algebra' | 'calculus' | 'coordinate_geometry' | 'trigonometry' | 'vector_algebra' | 'biology';",
      '}',
      '',
      'export const TAXONOMY_FROM_CSV: TaxonomyNode[] = [',
    ];

    // Group chapters by class and type for organized output
    const byOrder = (a: TaxonomyNode, b: TaxonomyNode) => (a.sequence_order || 0) - (b.sequence_order || 0);
    const class9Chem = chapters
      .filter((c: TaxonomyNode) => c.class_level === 9 && c.id.startsWith('ch9_'))
      .sort(byOrder);
    const class9Bio = chapters
      .filter((c: TaxonomyNode) => c.id.startsWith('bio9_'))
      .sort(byOrder);
    const class11 = chapters
      .filter((c: TaxonomyNode) => c.class_level === 11 && !c.id.startsWith('ma_') && !c.id.startsWith('ph'))
      .sort(byOrder);
    const class12 = chapters
      .filter((c: TaxonomyNode) => c.class_level === 12 && !c.id.startsWith('ma_') && !c.id.startsWith('ph'))
      .sort(byOrder);
    const physChapters = chapters
      .filter((c: TaxonomyNode) => c.id.startsWith('ph9_') || c.id.startsWith('ph11_') || c.id.startsWith('ph12_'))
      .sort(byOrder);
    const mathChapters = chapters
      .filter((c: TaxonomyNode) => c.id.startsWith('ma_'))
      .sort(byOrder);

    const escapeStr = (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

    const nodeToLine = (node: TaxonomyNode): string => {
      const parts: string[] = [
        `id: '${node.id}'`,
        `name: '${escapeStr(node.name)}'`,
        `parent_id: ${node.parent_id === null ? 'null' : `'${node.parent_id}'`}`,
        `type: '${node.type}'`,
      ];
      if (node.sequence_order !== undefined) parts.push(`sequence_order: ${node.sequence_order}`);
      if (node.class_level !== undefined) parts.push(`class_level: ${node.class_level}`);
      if (node.chapterType) parts.push(`chapterType: '${node.chapterType}'`);
      return `    { ${parts.join(', ')} },`;
    };

    const writeChapterGroup = (chList: TaxonomyNode[], label: string) => {
      lines.push(`    // ${label}`);
      for (const ch of chList) {
        lines.push(nodeToLine(ch));
        const chTags = tags.filter((t: TaxonomyNode) => t.parent_id === ch.id);
        for (const tag of chTags) {
          lines.push(nodeToLine(tag));
          const tagMicroTopics = microTopics.filter((mt: TaxonomyNode) => mt.parent_id === tag.id);
          for (const mt of tagMicroTopics) lines.push(nodeToLine(mt));
        }
        lines.push('');
      }
    };

    writeChapterGroup(class9Chem, 'Class 9 Chemistry');
    writeChapterGroup(class9Bio, 'Class 9 Biology');
    writeChapterGroup(class11, 'Class 11 Chemistry');
    writeChapterGroup(class12, 'Class 12 Chemistry');
    writeChapterGroup(physChapters, 'Physics');
    writeChapterGroup(mathChapters, 'Mathematics (Competitive Syllabus)');

    lines.push('];');
    lines.push('');
    lines.push(`// Summary Statistics`);
    lines.push(`// Total Chapters: ${chapters.length}`);
    lines.push(`// Total Tags: ${tags.length}`);
    lines.push(`// Total Micro Topics: ${microTopics.length}`);
    lines.push(`// Last saved: ${new Date().toISOString()}`);
    lines.push('');

    const fileContent = lines.join('\n');

    const filePath = join(process.cwd(), 'app', 'crucible', 'admin', 'taxonomy', 'taxonomyData_from_csv.ts');
    await writeFile(filePath, fileContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: `Saved ${chapters.length} chapters, ${tags.length} tags, and ${microTopics.length} micro topics to taxonomyData_from_csv.ts`,
      chapters: chapters.length,
      tags: tags.length,
      microTopics: microTopics.length,
    });

  } catch (error: unknown) {
    console.error('Taxonomy save error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save taxonomy' },
      { status: 500 }
    );
  }
}
