import { requireSuperAdmin } from '@/lib/adminAuth';
import { redirect } from 'next/navigation';
import StaffAccessManager from '@/features/admin/components/StaffAccessManager';

export const metadata = {
  title: 'Staff Access | Canvas Admin',
};

export const dynamic = 'force-dynamic';

export default async function StaffPage() {
  const identity = await requireSuperAdmin();
  if (!identity) {
    // Non-super-admin staff land here; middleware already let them in,
    // but this page is super-admin-only. Send them to /, not /login.
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-orange-400/80">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Canvas Classes — Staff Access
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Staff Access</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Grant or revoke per-subject and per-chapter access for non-super-admin staff. Super admins are configured via the{' '}
            <code className="text-orange-300/80">SUPER_ADMIN_EMAILS</code> environment variable and cannot be managed here.
          </p>
        </header>
        <StaffAccessManager currentUserEmail={identity.email} />
      </div>
    </main>
  );
}
