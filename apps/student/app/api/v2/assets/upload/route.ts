import type { NextRequest } from 'next/server';
import { POST as svcPOST, GET as svcGET } from '@canvas/services/assets-upload';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';

// Configure route to handle large file uploads (videos up to 100MB).
// Next reads these from the route file, not the imported service module.
export const runtime = 'nodejs';
export const maxDuration = 60;

const deps = { getAuthenticatedUser, isAdmin, hasScriptSecret, isLocalhostDev };

export const POST = (request: NextRequest) => svcPOST(request, deps);
export const GET = svcGET;
