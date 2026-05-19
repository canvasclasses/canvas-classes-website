import type { NextRequest } from 'next/server';
import {
  GET as svcGET,
  PATCH as svcPATCH,
  DELETE as svcDELETE,
} from '@canvas/services/questions-by-id';
import { getAuthenticatedUser, isAdmin, hasScriptSecret } from '@/lib/auth';
import { isLocalhostDev } from '@/lib/adminAuth';

const deps = { getAuthenticatedUser, isAdmin, hasScriptSecret, isLocalhostDev };

type Ctx = { params: Promise<{ id: string }> };

export const GET = (request: NextRequest, ctx: Ctx) => svcGET(request, ctx, deps);
export const PATCH = (request: NextRequest, ctx: Ctx) => svcPATCH(request, ctx, deps);
export const DELETE = (request: NextRequest, ctx: Ctx) => svcDELETE(request, ctx, deps);
