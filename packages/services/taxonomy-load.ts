// GET /api/v2/taxonomy/load — read the canonical taxonomy source file from
// disk (bypassing the module cache) so the admin Taxonomy Manager always
// sees latest edits.
//
// KNOWN ISSUES (carried over from the pre-extraction route — flagged for a
// future cleanup, not changed during the service extraction so behavior is
// preserved verbatim):
//   1. The hardcoded path `app/crucible/admin/taxonomy/taxonomyData_from_csv.ts`
//      is stale. The canonical file lives at
//      `packages/data/taxonomy/taxonomyData_from_csv.ts` after the Phase 4
//      monorepo migration. The current route returns a 500 in every
//      environment because of this; the admin UI falls back to the
//      compiled-in TAXONOMY_FROM_CSV.
//   2. Both read (this route) and write (/api/v2/taxonomy/save) write to the
//      local filesystem, which is read-only on Vercel/serverless. The
//      taxonomy/save route has a TODO noting this; the same applies here.
//      Both routes need a MongoDB-backed redesign for production.
// Until that redesign ships, this route stays broken — keeping the
// extraction byte-for-byte equivalent to the pre-extraction handler.

import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'app', 'crucible', 'admin', 'taxonomy', 'taxonomyData_from_csv.ts');
    const content = await readFile(filePath, 'utf-8');

    const match = content.match(/TAXONOMY_FROM_CSV[^=]+=\s*\[([\s\S]*?)\];/);
    if (!match) {
      return NextResponse.json({ success: false, error: 'Could not parse taxonomy file' }, { status: 500 });
    }

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
    return NextResponse.json({ success: false, error: 'Failed to load taxonomy' }, { status: 500 });
  }
}
