import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * POST /api/v2/taxonomy/save
 * Persists the full taxonomy array back to taxonomyData_from_csv.ts
 * Body: { nodes: TaxonomyNode[] }
 * This is the ONLY way taxonomy edits should be saved — through this endpoint.
 */
export async function POST(request: NextRequest) {
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

    const chapters = nodes.filter((n: any) => n.type === 'chapter');
    const tags = nodes.filter((n: any) => n.type === 'topic');

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
      "    type: 'chapter' | 'topic';",
      "    sequence_order?: number;",
      "    class_level?: 11 | 12;",
      "    chapterType?: 'physical' | 'inorganic' | 'organic' | 'practical';",
      '}',
      '',
      'export const TAXONOMY_FROM_CSV: TaxonomyNode[] = [',
    ];

    // Group chapters by class and type for organized output
    const class11 = chapters.filter((c: any) => c.class_level === 11).sort((a: any, b: any) => (a.sequence_order || 0) - (b.sequence_order || 0));
    const class12 = chapters.filter((c: any) => c.class_level === 12).sort((a: any, b: any) => (a.sequence_order || 0) - (b.sequence_order || 0));

    const escapeStr = (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

    const nodeToLine = (node: any): string => {
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

    lines.push('    // Class 11');
    for (const ch of class11) {
      lines.push(nodeToLine(ch));
      const chTags = tags.filter((t: any) => t.parent_id === ch.id);
      for (const tag of chTags) {
        lines.push(nodeToLine(tag));
      }
      lines.push('');
    }

    lines.push('    // Class 12');
    for (const ch of class12) {
      lines.push(nodeToLine(ch));
      const chTags = tags.filter((t: any) => t.parent_id === ch.id);
      for (const tag of chTags) {
        lines.push(nodeToLine(tag));
      }
      lines.push('');
    }

    lines.push('];');
    lines.push('');
    lines.push(`// Summary Statistics`);
    lines.push(`// Total Chapters: ${chapters.length}`);
    lines.push(`// Total Tags: ${tags.length}`);
    lines.push(`// Last saved: ${new Date().toISOString()}`);
    lines.push('');

    const fileContent = lines.join('\n');

    const filePath = join(process.cwd(), 'app', 'crucible', 'admin', 'taxonomy', 'taxonomyData_from_csv.ts');
    await writeFile(filePath, fileContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: `Saved ${chapters.length} chapters and ${tags.length} tags to taxonomyData_from_csv.ts`,
      chapters: chapters.length,
      tags: tags.length,
    });

  } catch (error: any) {
    console.error('Taxonomy save error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save taxonomy' },
      { status: 500 }
    );
  }
}
