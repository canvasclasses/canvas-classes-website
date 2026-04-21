import { NextResponse } from 'next/server';
import { getSearchItems } from '@/app/lib/searchIndices';

// Cache at the HTTP layer — revalidate matches the searchIndices cache (1h)
export const revalidate = 3600;

export async function GET() {
  try {
    const items = await getSearchItems();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
