import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Account',
};

function formatDate(iso: string | undefined | null): string {
  if (!iso) return 'unknown';
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default async function AccountPage() {
  const supabase = await createClient();
  if (!supabase) {
    redirect('/login?next=/account');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/account');
  }

  const meta = user.user_metadata ?? {};
  const privacyVersion = (meta.privacy_version as string | undefined) ?? 'not recorded';
  const termsVersion = (meta.terms_version as string | undefined) ?? 'not recorded';
  const acceptedAt = formatDate(meta.consent_accepted_at as string | undefined);

  const deletionSubject = encodeURIComponent('Account deletion request');
  const deletionBody = encodeURIComponent(
    `Hello Canvas Classes team,\n\nI would like to request deletion of my account (${user.email}) and associated practice history.\n\nThank you.`,
  );

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 text-white/90">
      <h1 className="text-2xl font-bold mb-1">Account</h1>
      <p className="text-sm text-white/60 mb-8">{user.email}</p>

      <section className="rounded-xl border border-white/10 bg-[#151E32] p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Consent record</h2>
        <dl className="text-sm space-y-2">
          <div className="flex justify-between gap-4">
            <dt className="text-white/60">Privacy Policy version</dt>
            <dd>{privacyVersion}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-white/60">Terms &amp; Conditions version</dt>
            <dd>{termsVersion}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-white/60">Accepted on</dt>
            <dd>{acceptedAt}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#151E32] p-6">
        <h2 className="text-lg font-semibold mb-2">Delete your account</h2>
        <p className="text-sm text-white/70 mb-3">
          To request deletion of your account and all associated practice
          history, send us an email. We will acknowledge within seven business
          days and complete the deletion within thirty days.
        </p>
        <a
          href={`mailto:support@canvasclasses.in?subject=${deletionSubject}&body=${deletionBody}`}
          className="inline-block rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Request account deletion
        </a>
      </section>
    </main>
  );
}
