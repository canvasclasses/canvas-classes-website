import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';
export const maxDuration = 15;

// POST /api/v2/iupac/name-to-structure   body: { name: string }
//
// Resolves an IUPAC (or common) chemical name to a SMILES string via OPSIN
// (Open Parser for Systematic IUPAC Nomenclature), hosted by EBI. The Structure
// Editor then feeds the SMILES to Ketcher to draw it.
//
// Why a server route (not a direct browser fetch): keeps it CORS-clean, keeps the
// external host out of the page CSP, and lets us gate on admin auth. SSRF-safe —
// the host is hard-coded and the only user input is URL-encoded into a single
// path segment, so a name can never redirect the request elsewhere.
const OPSIN_BASE = 'https://www.ebi.ac.uk/opsin/ws';

export async function POST(request: NextRequest) {
  const gate = await requireAdmin(request);
  if (!gate.ok) return gate.response;

  let name: unknown;
  try {
    ({ name } = await request.json());
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  if (typeof name !== 'string' || !name.trim()) {
    return NextResponse.json({ success: false, error: 'Enter a chemical name' }, { status: 400 });
  }
  const trimmed = name.trim();
  if (trimmed.length > 200) {
    return NextResponse.json({ success: false, error: 'Name is too long' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    const res = await fetch(`${OPSIN_BASE}/${encodeURIComponent(trimmed)}.smi`, {
      signal: controller.signal,
      headers: { Accept: 'text/plain' },
    }).finally(() => clearTimeout(timeout));

    // OPSIN returns 404 (with an empty body) when it cannot parse the name.
    if (res.status === 404) {
      return NextResponse.json(
        { success: false, error: `Couldn't understand "${trimmed}". Check the spelling/locants.` },
        { status: 422 },
      );
    }
    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Naming service unavailable' }, { status: 502 });
    }

    const smiles = (await res.text()).trim();
    if (!smiles) {
      return NextResponse.json(
        { success: false, error: `Couldn't understand "${trimmed}".` },
        { status: 422 },
      );
    }

    return NextResponse.json({ success: true, smiles });
  } catch (error) {
    console.error('name-to-structure error:', error);
    return NextResponse.json({ success: false, error: 'Naming service unavailable' }, { status: 502 });
  }
}
