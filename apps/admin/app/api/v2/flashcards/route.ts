import type { NextRequest } from 'next/server';
import { GET as svcGET, POST as svcPOST } from '@canvas/services/flashcards';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/adminAuth';

const deps = { getAuthenticatedUser, isAdmin, hasScriptSecret, isLocalhostDev };

export const GET = (request: NextRequest) => svcGET(request, deps);
export const POST = (request: NextRequest) => svcPOST(request, deps);
