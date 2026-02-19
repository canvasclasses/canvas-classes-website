import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import UserDashboard from '../components/UserDashboard';

// ============================================
// USER DASHBOARD PAGE
// Requires authentication via Supabase
// ============================================

export const metadata = {
  title: 'Your Progress | Canvas Crucible',
  description: 'Track your chemistry practice progress and view recommendations',
};

export default async function DashboardPage() {
  // Get user session from Supabase
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user || error) {
    redirect('/login?redirect=/crucible/dashboard');
  }

  return (
    <main className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Canvas Crucible</h1>
              <p className="text-sm text-slate-400">JEE Chemistry Mastery Platform</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">{user.email}</span>
              <a 
                href="/crucible"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
              >
                Practice
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <UserDashboard userId={user.id} userEmail={user.email || ''} />
    </main>
  );
}
