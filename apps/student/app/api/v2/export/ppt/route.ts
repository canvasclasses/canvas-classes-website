import type { NextRequest } from 'next/server';
import { POST as svcPOST } from '@canvas/services/export-ppt';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/bookAuth';

export const runtime = 'nodejs';

const deps = { getAuthenticatedUser, isAdmin, hasScriptSecret, isLocalhostDev };

export const POST = (request: NextRequest) => svcPOST(request, deps);
