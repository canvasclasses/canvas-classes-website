'use client';

import { useState, useEffect, useCallback } from 'react';

export type Subject = 'chemistry' | 'physics' | 'mathematics' | 'biology';
export type AccessLevel = 'view' | 'edit';

export interface Grant {
  subject: Subject;
  chapters: 'all' | string[];
  level: AccessLevel;
}

export interface PermissionsResponse {
  email: string;
  isSuperAdmin: boolean;
  grants: Grant[];
  superAdmins: string[];
}

function getSubjectFromChapterId(chapterId: string): Subject | null {
  if (chapterId.startsWith('ch11_') || chapterId.startsWith('ch12_')) return 'chemistry';
  if (chapterId.startsWith('ph11_') || chapterId.startsWith('ph12_')) return 'physics';
  if (chapterId.startsWith('ma_')) return 'mathematics';
  if (
    chapterId.startsWith('bio9_') ||
    chapterId.startsWith('bio11_') ||
    chapterId.startsWith('bio12_')
  ) {
    return 'biology';
  }
  return null;
}

const EMPTY: PermissionsResponse = {
  email: '',
  isSuperAdmin: false,
  grants: [],
  superAdmins: [],
};

export function usePermissions() {
  const [data, setData] = useState<PermissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);

        // Localhost grants full super admin in dev (matches the API behaviour).
        const isLocalhost =
          typeof window !== 'undefined' &&
          (window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1');
        if (isLocalhost) {
          if (!cancelled) {
            setData({
              email: 'local-dev',
              isSuperAdmin: true,
              grants: [],
              superAdmins: [],
            });
          }
          return;
        }

        const res = await fetch('/api/v2/admin/permissions');
        if (!res.ok) throw new Error('Failed to fetch permissions');
        const json = (await res.json()) as PermissionsResponse;
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setData(EMPTY);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const canView = useCallback(
    (chapterId: string): boolean => {
      if (!data) return false;
      if (data.isSuperAdmin) return true;
      const subj = getSubjectFromChapterId(chapterId);
      if (!subj) return false;
      return data.grants.some(
        (g) =>
          g.subject === subj && (g.chapters === 'all' || g.chapters.includes(chapterId)),
      );
    },
    [data],
  );

  const canEdit = useCallback(
    (chapterId: string): boolean => {
      if (!data) return false;
      if (data.isSuperAdmin) return true;
      const subj = getSubjectFromChapterId(chapterId);
      if (!subj) return false;
      return data.grants.some(
        (g) =>
          g.subject === subj &&
          g.level === 'edit' &&
          (g.chapters === 'all' || g.chapters.includes(chapterId)),
      );
    },
    [data],
  );

  return {
    email: data?.email ?? '',
    isSuperAdmin: data?.isSuperAdmin ?? false,
    grants: data?.grants ?? [],
    superAdmins: data?.superAdmins ?? [],
    canView,
    canEdit,
    loading,
    error,
  };
}
