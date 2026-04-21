import type { Metadata } from 'next';
import { LAST_UPDATED, TERMS_VERSION } from '@/lib/legal/versions';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'The Terms and Conditions governing access to and use of Canvas Classes / Crucible.',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-28 pb-12 text-white/90 leading-relaxed">
      <h1 className="text-3xl font-bold mb-1">Terms &amp; Conditions</h1>
      <p className="text-sm text-white/60 mb-10">
        Version {TERMS_VERSION} &middot; Last updated: {LAST_UPDATED}
      </p>

      <section className="space-y-8 text-[15px]">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            These Terms and Conditions (the &ldquo;Terms&rdquo;) constitute a
            legally binding agreement between you (the &ldquo;User&rdquo;,
            &ldquo;you&rdquo;, or &ldquo;your&rdquo;) and Canvas Classes (the
            &ldquo;Company&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
            &ldquo;our&rdquo;) and govern your access to and use of the
            Crucible platform at canvasclasses.in (the &ldquo;Platform&rdquo;)
            and all content, materials, and services made available through
            it (collectively, the &ldquo;Content&rdquo;). By creating an
            account, or by otherwise accessing or using the Platform, you
            represent that you have read, understood, and irrevocably agreed
            to be bound by these Terms and by our Privacy Policy, which is
            incorporated herein by reference. If you do not agree to these
            Terms, you must not access or use the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
          <p>
            The Platform is intended for students preparing for JEE, NEET, and
            CBSE examinations. By using the Platform, you represent and warrant
            that you are either (a) at least eighteen (18) years of age, or (b)
            a minor who has obtained the consent of a parent or legal guardian
            to access the Platform. A parent or legal guardian who permits a
            minor to use the Platform agrees to these Terms on the
            minor&rsquo;s behalf and remains responsible for the minor&rsquo;s
            use of the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            3. Account Registration and Security
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activity that occurs under your
            account. You agree to notify the Company immediately at{' '}
            <a
              href="mailto:support@canvasclasses.in"
              className="text-orange-400 underline"
            >
              support@canvasclasses.in
            </a>{' '}
            of any unauthorised use of your account. The Company is not liable
            for any loss or damage arising from your failure to safeguard your
            credentials.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            4. User Conduct and Prohibited Uses
          </h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              copy, reproduce, distribute, or sell any portion of the Platform
              or its content without prior written permission;
            </li>
            <li>
              attempt to gain unauthorised access to any portion of the
              Platform, other user accounts, or the Company&rsquo;s systems;
            </li>
            <li>
              use automated scripts, scrapers, or bots to extract data from the
              Platform;
            </li>
            <li>
              interfere with the proper working of the Platform or the
              experience of other users;
            </li>
            <li>
              upload or transmit any content that is unlawful, defamatory,
              obscene, or infringes the rights of any third party;
            </li>
            <li>
              share your account credentials with any other person; or
            </li>
            <li>
              engage in any other conduct that the Company, acting
              reasonably, considers harmful to the Platform, its Users, or
              the Company&rsquo;s interests.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            5. Intellectual Property
          </h2>
          <p className="mb-2">
            All Content made available on the Platform &mdash; including but
            not limited to the question bank, interactive simulators,
            explanatory text, diagrams, videos, software, and branding
            &mdash; is the property of the Company or its licensors and is
            protected by copyright, trademark, and other intellectual-property
            laws in India and other jurisdictions. Subject to your continued
            compliance with these Terms, you are granted a limited,
            non-exclusive, non-transferable, non-sublicensable, revocable
            licence to access and use the Content solely for your personal,
            non-commercial educational use. All rights not expressly granted
            are reserved.
          </p>
          <p>
            <strong>User Submissions.</strong> When you submit any question
            flag, error report, feedback, or other communication to the
            Company (&ldquo;User Submissions&rdquo;), you grant the Company a
            worldwide, royalty-free, perpetual, irrevocable, sublicensable
            licence to use, reproduce, modify, and incorporate such User
            Submissions for the purpose of operating, maintaining, and
            improving the Platform. You represent and warrant that you have
            all rights necessary to grant this licence and that your User
            Submissions do not infringe the rights of any third party.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Service &ldquo;As Is&rdquo;</h2>
          <p>
            The Platform is provided on an &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; basis. While the Company takes reasonable care to
            ensure the accuracy of its content, it makes no warranty, express
            or implied, that the content is free from errors or that use of the
            Platform will result in any particular outcome, including success
            in any examination.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            7. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by applicable law, the Company
            and its officers, directors, employees, affiliates, and licensors
            shall not be liable for any indirect, incidental, special,
            consequential, exemplary, or punitive damages, or for any loss
            of profits, revenue, goodwill, or data, arising out of or in
            connection with your access to or use of, or inability to access
            or use, the Platform, whether based on warranty, contract, tort
            (including negligence), statute, or any other legal theory, and
            whether or not the Company has been advised of the possibility
            of such damages. The Company&rsquo;s total aggregate liability
            to any User under or in connection with these Terms shall not
            exceed the greater of (a) the amount, if any, paid by that User
            to the Company in the twelve (12) months preceding the event
            giving rise to the claim, or (b) INR 1,000 (Indian Rupees One
            Thousand).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">8. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless the Company and its
            officers, directors, and employees from and against any claims,
            liabilities, damages, losses, and expenses (including reasonable
            legal fees) arising out of your breach of these Terms or your
            misuse of the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">9. Termination</h2>
          <p className="mb-2">
            The Company may, in its sole discretion, suspend, restrict, or
            terminate your access to the Platform, in whole or in part, at
            any time and with or without prior notice, for any breach of
            these Terms or for any conduct that the Company, acting
            reasonably, considers harmful to the Platform, its Users, or the
            Company&rsquo;s interests. You may terminate your account at any
            time by writing to{' '}
            <a
              href="mailto:support@canvasclasses.in"
              className="text-orange-400 underline"
            >
              support@canvasclasses.in
            </a>
            .
          </p>
          <p>
            <strong>Effect of Termination.</strong> Upon termination of your
            account, (i) the licence granted to you under Section 5 shall
            cease immediately, (ii) you must cease all use of the Platform
            and the Content, and (iii) the provisions of Sections 5, 7, 8,
            10, 11, and 12 to 19 shall survive termination and remain in
            full force and effect. Termination shall not affect any accrued
            rights or remedies of either party.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            10. Governing Law and Jurisdiction
          </h2>
          <p>
            These Terms are governed by and construed in accordance with the
            laws of the Republic of India. Any dispute arising out of or in
            connection with these Terms shall be subject to the exclusive
            jurisdiction of the competent courts in Mandi (H.P.), India.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            11. Dispute Resolution
          </h2>
          <p>
            Any dispute, controversy, or claim arising out of or in
            connection with these Terms, including any question regarding
            their existence, validity, or termination, shall first be
            addressed through good-faith negotiation between the parties.
            If the dispute is not resolved within thirty (30) days of
            written notice from one party to the other, the parties may
            pursue their respective remedies in the courts specified in
            Section 10 above.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            12. Electronic Communications
          </h2>
          <p>
            By creating an account or otherwise using the Platform, you
            consent to receive communications from the Company in electronic
            form, including by email to the address associated with your
            account and by notices posted within the Platform. You agree
            that all agreements, notices, disclosures, and other
            communications that the Company provides to you electronically
            satisfy any legal requirement that such communications be in
            writing.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            13. Modifications to the Terms
          </h2>
          <p>
            The Company reserves the right, in its sole discretion, to
            amend, modify, or replace these Terms at any time. Each update
            will be reflected in a change to the version number displayed
            at the top of this page. Where a modification is material, the
            Company will prompt you to review and re-accept the updated
            Terms on your next sign-in to the Platform. Your continued use
            of the Platform following such modification constitutes your
            acceptance of the modified Terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">14. Severability</h2>
          <p>
            If any provision of these Terms is held by a court of competent
            jurisdiction to be invalid, illegal, or unenforceable, such
            provision shall be severed or, where permissible, construed so
            as to give effect to the original intent of the parties to the
            fullest extent permitted by law, and the remaining provisions
            of these Terms shall continue in full force and effect.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">15. Entire Agreement</h2>
          <p>
            These Terms, together with the Privacy Policy incorporated
            herein by reference, constitute the entire agreement between
            you and the Company concerning the Platform and supersede all
            prior or contemporaneous communications, proposals, and
            agreements, whether oral or written, between you and the
            Company in relation to the subject matter hereof.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">16. Waiver</h2>
          <p>
            No failure or delay by the Company in exercising any right,
            power, or privilege under these Terms shall operate as a waiver
            thereof, nor shall any single or partial exercise of any such
            right, power, or privilege preclude any further exercise
            thereof or the exercise of any other right, power, or
            privilege. Any waiver by the Company shall be effective only if
            made in writing.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">17. Assignment</h2>
          <p>
            You may not assign, transfer, or delegate these Terms or any of
            your rights or obligations hereunder, whether by operation of
            law or otherwise, without the prior written consent of the
            Company. The Company may freely assign or transfer these Terms,
            in whole or in part, to any successor in interest, affiliate,
            or acquirer of all or substantially all of its business or
            assets. Any purported assignment in violation of this Section
            shall be void.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">18. Force Majeure</h2>
          <p>
            The Company shall not be liable for any failure or delay in
            the performance of its obligations under these Terms arising
            out of or caused by events beyond its reasonable control,
            including, without limitation, acts of God, natural disasters,
            war, terrorism, riots, civil unrest, government action,
            epidemics or pandemics, failure of public or private
            telecommunications networks, or interruptions affecting
            third-party service providers or hosting infrastructure.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">19. Notices</h2>
          <p>
            Any notice or other communication required or permitted to be
            given to the Company under these Terms shall be in writing and
            shall be sent by email to{' '}
            <a
              href="mailto:support@canvasclasses.in"
              className="text-orange-400 underline"
            >
              support@canvasclasses.in
            </a>
            . Notices to you shall be deemed effectively given when sent to
            the email address associated with your account or when posted
            within the Platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            20. Contact Information
          </h2>
          <p>
            Questions regarding these Terms may be directed to{' '}
            <a
              href="mailto:support@canvasclasses.in"
              className="text-orange-400 underline"
            >
              support@canvasclasses.in
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
