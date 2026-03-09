import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import connectToDatabase from '@/lib/mongodb';
import TestResult from '@/lib/models/TestResult';
import { TAXONOMY_FROM_CSV } from '@/app/crucible/admin/taxonomy/taxonomyData_from_csv';

export const metadata = {
  title: 'Test Dashboard - Canvas Chemistry',
  description: 'Track your test performance and progress',
};

async function getTestResults(userId: string) {
  await connectToDatabase();
  
  const results = await TestResult.find({ user_id: userId })
    .sort({ created_at: -1 })
    .limit(50)
    .lean();

  return results.map(r => ({
    ...r,
    _id: r._id.toString(),
    created_at: r.created_at.toISOString(),
    updated_at: r.updated_at.toISOString(),
    timing: {
      ...r.timing,
      started_at: r.timing.started_at.toISOString(),
      completed_at: r.timing.completed_at.toISOString(),
    },
  }));
}

export default async function DashboardPage() {
  let user = null;
  
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }
  } catch (error) {
    console.error('[Dashboard] Auth error:', error);
  }

  // Check for local dev bypass
  const isLocalDev = process.env.NODE_ENV === 'development';
  
  if (!user && !isLocalDev) {
    redirect('/login?next=/the-crucible/dashboard');
  }

  // For local dev without user, show empty state
  const userId = user?.id || 'local-dev';
  let testResults: any[] = [];
  
  if (user) {
    try {
      testResults = await getTestResults(userId);
    } catch (error) {
      console.error('[Dashboard] Error fetching test results:', error);
      testResults = [];
    }
  }

  // Build chapter map from taxonomy
  const chapterMap: Record<string, string> = {};
  TAXONOMY_FROM_CSV.forEach(chapter => {
    chapterMap[chapter.id] = chapter.name;
  });

  return (
    <DashboardClient 
      testResults={testResults} 
      chapterMap={chapterMap}
      isLocalDev={isLocalDev && !user}
    />
  );
}
