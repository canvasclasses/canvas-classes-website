import { useState, useEffect } from 'react';

export type Subject = 'chemistry' | 'physics' | 'mathematics';
export type RoleType = 'super_admin' | 'subject_admin' | 'viewer';

export interface UserPermissions {
  email: string;
  role: RoleType;
  subjects: Subject[];
  permissions: {
    canEditQuestions: boolean;
    canDeleteQuestions: boolean;
    canManageRoles: boolean;
    canAccessAnalytics: boolean;
    canExportData: boolean;
  };
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      setLoading(true);
      
      // Localhost bypass - grant full super admin access
      const isLocalhost = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      
      if (isLocalhost) {
        setPermissions({
          email: 'local-dev',
          role: 'super_admin',
          subjects: ['chemistry', 'physics', 'mathematics'],
          permissions: {
            canEditQuestions: true,
            canDeleteQuestions: true,
            canManageRoles: true,
            canAccessAnalytics: true,
            canExportData: true,
          },
        });
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/v2/admin/permissions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch permissions');
      }
      
      const data = await response.json();
      setPermissions(data);
    } catch (err: any) {
      setError(err.message);
      // Default to no permissions on error
      setPermissions({
        email: '',
        role: 'viewer',
        subjects: [],
        permissions: {
          canEditQuestions: false,
          canDeleteQuestions: false,
          canManageRoles: false,
          canAccessAnalytics: false,
          canExportData: false,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const canAccessSubject = (subject: Subject): boolean => {
    if (!permissions) return false;
    return permissions.subjects.includes(subject);
  };

  const canAccessChapter = (chapterId: string): boolean => {
    if (!permissions) return false;
    
    // Determine subject from chapter ID
    if (chapterId.startsWith('ch11_') || chapterId.startsWith('ch12_')) {
      return canAccessSubject('chemistry');
    }
    if (chapterId.startsWith('ph11_') || chapterId.startsWith('ph12_')) {
      return canAccessSubject('physics');
    }
    if (chapterId.startsWith('ma_')) {
      return canAccessSubject('mathematics');
    }
    
    return false;
  };

  return {
    permissions,
    loading,
    error,
    canAccessSubject,
    canAccessChapter,
    isSuperAdmin: permissions?.role === 'super_admin',
    canEdit: permissions?.permissions.canEditQuestions ?? false,
    canDelete: permissions?.permissions.canDeleteQuestions ?? false,
    canManageRoles: permissions?.permissions.canManageRoles ?? false,
  };
}
