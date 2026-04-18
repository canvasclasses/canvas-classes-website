import type { Metadata } from 'next';
import { RevokeConsentButton } from './RevokeConsentButton';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Canvas Classes / Crucible collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-white/90">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-sm text-white/60 mb-8">Last updated: 2026-04-17</p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What we collect</h2>
        <p>
          We collect minimal data needed to run the service: your account
          email (for login), your practice history (to show your progress),
          and anonymous usage data so we can improve the platform.
        </p>

        <h2 className="text-xl font-semibold">Third-party services</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Vercel Analytics</strong> — anonymous page views and
            referrers. No cookies.
          </li>
          <li>
            <strong>Vercel Speed Insights</strong> — Core Web Vitals for
            performance monitoring.
          </li>
          <li>
            <strong>Sentry</strong> — application errors and crash reports so
            we can fix bugs.
          </li>
          <li>
            <strong>Mixpanel</strong> — product analytics (signups, practice
            sessions). No PII. Only runs with your consent.
          </li>
          <li>
            <strong>Microsoft Clarity</strong> — anonymous session recordings
            and heatmaps. All text is masked. Only runs with your consent.
          </li>
        </ul>

        <h2 className="text-xl font-semibold">What we never send</h2>
        <p>
          We never send your email, phone number, name, or the content of
          questions/answers to any third-party analytics vendor.
        </p>

        <h2 className="text-xl font-semibold">Your rights</h2>
        <p>
          You may revoke consent at any time. You can request deletion of your
          account by emailing{' '}
          <a
            href="mailto:support@canvasclasses.in"
            className="text-orange-400 underline"
          >
            support@canvasclasses.in
          </a>
          .
        </p>
        <div className="pt-2">
          <RevokeConsentButton />
        </div>
      </section>
    </main>
  );
}
