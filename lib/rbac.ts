/**
 * Role-Based Access Control (RBAC) utilities
 * 
 * Security principles:
 * 1. Fail-safe defaults - deny access if unclear
 * 2. Least privilege - users get minimum necessary permissions
 * 3. Defense in depth - check permissions at multiple layers
 * 4. Audit trail - log all permission checks
 */

import { UserRole, type Subject, type RoleType, type IUserRole } from './models/UserRole';
import connectToDatabase from './mongodb';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';

export interface UserPermissions {
  email: string;
  role: RoleType;
  subjects: Subject[];
  canAccessSubject: (subject: Subject) => boolean;
  canEditQuestions: boolean;
  canDeleteQuestions: boolean;
  canManageRoles: boolean;
  canAccessAnalytics: boolean;
  canExportData: boolean;
}

/**
 * Map chapter_id to subject
 */
export function getSubjectFromChapterId(chapterId: string): Subject | null {
  if (chapterId.startsWith('ch11_') || chapterId.startsWith('ch12_')) {
    return 'chemistry';
  }
  if (chapterId.startsWith('ph11_') || chapterId.startsWith('ph12_')) {
    return 'physics';
  }
  if (chapterId.startsWith('ma_')) {
    return 'mathematics';
  }
  return null;
}

/**
 * Get all chapter IDs for a given subject
 */
interface TaxonomyNode {
  type: string;
  id: string;
}

export function getChapterIdsForSubject(subject: Subject): string[] {
  return TAXONOMY_FROM_CSV
    .filter((node: TaxonomyNode) => node.type === 'chapter')
    .filter((node: TaxonomyNode) => {
      const nodeSubject = getSubjectFromChapterId(node.id);
      return nodeSubject === subject;
    })
    .map((node: TaxonomyNode) => node.id);
}

// ── Per-process permissions cache ──────────────────────────────────────────────
// Each call to getUserPermissions previously hit MongoDB. The slow-path admin
// query path triggers up to three calls per request (direct, plus indirectly via
// getQuestionFilter → getAccessibleChapters → getUserPermissions). Caching for
// 60 s removes those round-trips without sacrificing safety:
//   • TTL is short, so role changes propagate within a minute on every instance
//   • A serverless instance restart clears the cache
//   • Writes to /api/v2/admin/roles SHOULD call invalidatePermissionsCache(email)
//     for instant propagation (see invalidate helper below).
// CAUTION: Do NOT cache `UserPermissions` objects that contain bound closures
// over a stale `userRole` document — we re-construct the public surface each
// call so `userRole.subjects` mutations elsewhere can't leak in.
type CachedPermissions = { permissions: UserPermissions; expiresAt: number };
const permissionsCache = new Map<string, CachedPermissions>();
const PERMISSIONS_TTL_MS = 60_000;
const PERMISSIONS_CACHE_MAX = 5_000; // cap to avoid memory growth on unique emails

/** Invalidate cached permissions for one user (call from role-management writes). */
export function invalidatePermissionsCache(email: string): void {
  permissionsCache.delete(email.toLowerCase());
}

/** Drop the entire permissions cache (call after a bulk role migration). */
export function clearPermissionsCache(): void {
  permissionsCache.clear();
}

/**
 * Fetch user permissions from database
 * CRITICAL: This is the single source of truth for permissions
 *
 * Results are cached in-process for {@link PERMISSIONS_TTL_MS}. Use
 * {@link invalidatePermissionsCache} after role changes for instant propagation.
 */
export async function getUserPermissions(email: string): Promise<UserPermissions> {
  const key = email.toLowerCase();
  const now = Date.now();
  const hit = permissionsCache.get(key);
  if (hit && hit.expiresAt > now) {
    return hit.permissions;
  }

  // Periodic eviction so the map can't grow unbounded under unique-email load.
  if (permissionsCache.size >= PERMISSIONS_CACHE_MAX) {
    for (const [k, v] of permissionsCache) {
      if (v.expiresAt <= now) permissionsCache.delete(k);
    }
    // Hard cap fallback: if still full, clear half (oldest entries).
    if (permissionsCache.size >= PERMISSIONS_CACHE_MAX) {
      const drop = Math.floor(PERMISSIONS_CACHE_MAX / 2);
      let i = 0;
      for (const k of permissionsCache.keys()) {
        if (i++ >= drop) break;
        permissionsCache.delete(k);
      }
    }
  }

  await connectToDatabase();

  // Check if user has a role in database
  const userRole = await UserRole.findOne({ email: email.toLowerCase(), is_active: true });

  // Default: no access (fail-safe)
  if (!userRole) {
    const noAccess: UserPermissions = {
      email,
      role: 'viewer',
      subjects: [],
      canAccessSubject: () => false,
      canEditQuestions: false,
      canDeleteQuestions: false,
      canManageRoles: false,
      canAccessAnalytics: false,
      canExportData: false,
    };
    permissionsCache.set(key, { permissions: noAccess, expiresAt: now + PERMISSIONS_TTL_MS });
    return noAccess;
  }

  // Update last accessed timestamp (fire and forget)
  UserRole.updateOne(
    { email: email.toLowerCase() },
    { last_accessed_at: new Date() }
  ).catch(() => {
    // Silently fail - this is just for tracking
  });

  const isSuperAdmin = userRole.role === 'super_admin';
  const isSubjectAdmin = userRole.role === 'subject_admin';
  // Snapshot subjects array at fetch time so the cached canAccessSubject
  // closure can't be affected by any mutation to userRole.subjects later.
  const subjectsSnapshot: Subject[] = isSuperAdmin
    ? ['chemistry', 'physics', 'mathematics']
    : [...userRole.subjects];

  const permissions: UserPermissions = {
    email,
    role: userRole.role,
    subjects: subjectsSnapshot,
    canAccessSubject: (subject: Subject) => {
      if (isSuperAdmin) return true;
      return subjectsSnapshot.includes(subject);
    },
    canEditQuestions: isSuperAdmin || isSubjectAdmin,
    canDeleteQuestions: isSuperAdmin, // Only super admin can delete
    canManageRoles: isSuperAdmin,
    canAccessAnalytics: true, // All authenticated users can view analytics
    canExportData: isSuperAdmin,
  };
  permissionsCache.set(key, { permissions, expiresAt: now + PERMISSIONS_TTL_MS });
  return permissions;
}

/**
 * Check if user can access a specific chapter
 */
export async function canAccessChapter(email: string, chapterId: string): Promise<boolean> {
  const permissions = await getUserPermissions(email);
  const subject = getSubjectFromChapterId(chapterId);
  
  if (!subject) return false; // Unknown chapter format
  
  return permissions.canAccessSubject(subject);
}

/**
 * Check if user can edit a specific question
 */
export async function canEditQuestion(email: string, chapterId: string): Promise<boolean> {
  const permissions = await getUserPermissions(email);
  
  if (!permissions.canEditQuestions) return false;
  
  const subject = getSubjectFromChapterId(chapterId);
  if (!subject) return false;
  
  return permissions.canAccessSubject(subject);
}

/**
 * Check if user can delete a specific question
 */
export async function canDeleteQuestion(email: string, chapterId: string): Promise<boolean> {
  const permissions = await getUserPermissions(email);
  
  if (!permissions.canDeleteQuestions) return false;
  
  const subject = getSubjectFromChapterId(chapterId);
  if (!subject) return false;
  
  return permissions.canAccessSubject(subject);
}

/**
 * Filter chapters based on user permissions
 */
export async function getAccessibleChapters(email: string): Promise<string[]> {
  const permissions = await getUserPermissions(email);

  if (permissions.role === 'super_admin') {
    // Super admin gets all chapters
    return TAXONOMY_FROM_CSV
      .filter((node: TaxonomyNode) => node.type === 'chapter')
      .map((node: TaxonomyNode) => node.id);
  }

  // Get chapters for allowed subjects only
  const allowedChapters: string[] = [];
  for (const subject of permissions.subjects) {
    allowedChapters.push(...getChapterIdsForSubject(subject));
  }

  return allowedChapters;
}

/**
 * Build MongoDB filter for questions based on user permissions
 * CRITICAL: Use this in all question queries to enforce access control
 */
export async function getQuestionFilter(email: string): Promise<Record<string, unknown>> {
  const accessibleChapters = await getAccessibleChapters(email);
  
  if (accessibleChapters.length === 0) {
    // No access - return filter that matches nothing
    return { _id: { $exists: false } };
  }
  
  return {
    'metadata.chapter_id': { $in: accessibleChapters },
  };
}
