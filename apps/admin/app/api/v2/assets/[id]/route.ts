import type { NextRequest } from 'next/server';
import { DELETE as svcDELETE } from '@canvas/services/assets-by-id';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/adminAuth';

const deps = { getAuthenticatedUser, isAdmin, hasScriptSecret, isLocalhostDev };

export const DELETE = (request: NextRequest, ctx: { params: Promise<{ id: string }> }) =>
  svcDELETE(request, ctx, deps);
