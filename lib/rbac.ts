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
export function getChapterIdsForSubject(subject: Subject): string[] {
  const { TAXONOMY_FROM_CSV } = require('@/app/crucible/admin/taxonomy/taxonomyData_from_csv');
  
  return TAXONOMY_FROM_CSV
    .filter((node: any) => node.type === 'chapter')
    .filter((node: any) => {
      const nodeSubject = getSubjectFromChapterId(node.id);
      return nodeSubject === subject;
    })
    .map((node: any) => node.id);
}

/**
 * Fetch user permissions from database
 * CRITICAL: This is the single source of truth for permissions
 */
export async function getUserPermissions(email: string): Promise<UserPermissions> {
  await connectToDatabase();

  // Check if user has a role in database
  const userRole = await UserRole.findOne({ email: email.toLowerCase(), is_active: true });

  // Default: no access (fail-safe)
  if (!userRole) {
    return {
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

  return {
    email,
    role: userRole.role,
    subjects: isSuperAdmin ? ['chemistry', 'physics', 'mathematics'] : userRole.subjects,
    canAccessSubject: (subject: Subject) => {
      if (isSuperAdmin) return true;
      return userRole.subjects.includes(subject);
    },
    canEditQuestions: isSuperAdmin || isSubjectAdmin,
    canDeleteQuestions: isSuperAdmin, // Only super admin can delete
    canManageRoles: isSuperAdmin,
    canAccessAnalytics: true, // All authenticated users can view analytics
    canExportData: isSuperAdmin || isSubjectAdmin,
  };
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
    const { TAXONOMY_FROM_CSV } = require('@/app/crucible/admin/taxonomy/taxonomyData_from_csv');
    return TAXONOMY_FROM_CSV
      .filter((node: any) => node.type === 'chapter')
      .map((node: any) => node.id);
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
export async function getQuestionFilter(email: string): Promise<Record<string, any>> {
  const accessibleChapters = await getAccessibleChapters(email);
  
  if (accessibleChapters.length === 0) {
    // No access - return filter that matches nothing
    return { _id: { $exists: false } };
  }
  
  return {
    'metadata.chapter_id': { $in: accessibleChapters },
  };
}
