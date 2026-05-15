import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * GET /api/v2/taxonomy/load
 * Reads the current taxonomyData_from_csv.ts file and returns the nodes array.
 * This bypasses the Next.js module cache so the dashboard always gets the latest data.
 */
export async function GET() {
  try {
    const filePath = join(process.cwd(), 'app', 'crucible', 'admin', 'taxonomy', 'taxonomyData_from_csv.ts');
    const content = await readFile(filePath, 'utf-8');

    // Extract the array content between `TAXONOMY_FROM_CSV: TaxonomyNode[] = [` and the closing `];`
    const match = content.match(/TAXONOMY_FROM_CSV[^=]+=\s*\[([\s\S]*?)\];/);
    if (!match) {
      return NextResponse.json({ success: false, error: 'Could not parse taxonomy file' }, { status: 500 });
    }

    // Parse each node line using a regex that extracts the object literal properties
    const arrayContent = match[1];
    const nodeRegex = /\{\s*id:\s*'([^']+)',\s*name:\s*'((?:[^'\\]|\\[\s\S])*)',\s*parent_id:\s*(null|'[^']*'),\s*type:\s*'([^']+)'([\s\S]*?)\}/g;

    interface TaxonomyNode {
      id: string;
      name: string;
      parent_id: string | null;
      type: string;
      sequence_order?: number;
      class_level?: number;
      chapterType?: string;
    }
    const nodes: TaxonomyNode[] = [];
    let m: RegExpExecArray | null;
    while ((m = nodeRegex.exec(arrayContent)) !== null) {
      const node: TaxonomyNode = {
        id: m[1],
        name: m[2].replace(/\\'/g, "'").replace(/\\\\/g, '\\'),
        parent_id: m[3] === 'null' ? null : m[3].replace(/'/g, ''),
        type: m[4],
      };

      // Extract optional fields from the trailing part
      const rest = m[5];
      const seqMatch = rest.match(/sequence_order:\s*(\d+)/);
      if (seqMatch) node.sequence_order = parseInt(seqMatch[1]);
      const classMatch = rest.match(/class_level:\s*(\d+)/);
      if (classMatch) node.class_level = parseInt(classMatch[1]) as 11 | 12;
      const chapterTypeMatch = rest.match(/chapterType:\s*'([^']+)'/);
      if (chapterTypeMatch) node.chapterType = chapterTypeMatch[1];

      nodes.push(node);
    }

    return NextResponse.json(
      { success: true, nodes },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
    );
  } catch (error: unknown) {
    console.error('Taxonomy load error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
