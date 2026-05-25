/**
 * One-time CLI to obtain a Google OAuth refresh token for the SEO dashboard.
 *
 * Prereqs (in root .env.local):
 *   GOOGLE_OAUTH_CLIENT_ID=...
 *   GOOGLE_OAUTH_CLIENT_SECRET=...
 *
 * Usage:
 *   npx tsx scripts/seo/get-refresh-token.ts
 *
 * Flow:
 *   1. Script spins up a tiny HTTP listener on http://localhost:8765.
 *   2. Prints a Google consent URL — you open it in your browser.
 *   3. You sign in with the GSC-owner Google account and approve the scope.
 *   4. Google redirects to localhost:8765, the script captures the auth code,
 *      exchanges it for tokens, and prints the refresh token.
 *   5. You paste the printed line into .env.local. One-time setup, done.
 *
 * The refresh token does not expire (Google policy for apps in "Testing" mode
 * with a test user — see https://developers.google.com/identity/protocols/oauth2#expiration).
 * If it ever stops working, just re-run this script.
 */

import dotenv from 'dotenv';
import path from 'node:path';
import { OAuth2Client } from 'google-auth-library';
import http from 'node:http';
import { URL } from 'node:url';
import crypto from 'node:crypto';

// Repo convention: all scripts load .env.local explicitly (CLAUDE.md §5.1).
// Resolves from the repo root regardless of where the script is invoked from.
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const PORT = 8765;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

async function main() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error(
      '\n❌ Missing env vars.\n\n' +
      'Add these to .env.local before running this script:\n' +
      '  GOOGLE_OAUTH_CLIENT_ID=...\n' +
      '  GOOGLE_OAUTH_CLIENT_SECRET=...\n\n' +
      'Get them from: console.cloud.google.com → APIs & Services → Credentials → your "Canvas SEO CLI" OAuth client.\n'
    );
    process.exit(1);
  }

  const oauth = new OAuth2Client(clientId, clientSecret, REDIRECT_URI);
  const state = crypto.randomBytes(16).toString('hex');

  const authUrl = oauth.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',      // forces refresh_token even if user previously approved
    scope: [SCOPE],
    state,
  });

  console.log('\n──────────────────────────────────────────────────────────────');
  console.log('  STEP 1 — Open this URL in your browser:');
  console.log('──────────────────────────────────────────────────────────────\n');
  console.log(authUrl + '\n');
  console.log('  STEP 2 — Sign in with the Google account that OWNS the\n           canvasclasses.in Search Console property.');
  console.log('  STEP 3 — Click "Continue" past any "Google hasn\'t verified\n           this app" warning (it\'s your own app, in Testing mode).');
  console.log('  STEP 4 — Approve the "View Search Console data" scope.\n');
  console.log('  Waiting for callback on http://localhost:' + PORT + ' …\n');

  const code = await new Promise<string>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
        if (url.pathname !== '/oauth2callback') {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        const returnedState = url.searchParams.get('state');
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
          res.writeHead(400, { 'content-type': 'text/html' });
          res.end(`<h1>Auth failed</h1><p>${error}</p><p>Close this tab and check the terminal.</p>`);
          server.close();
          reject(new Error(`OAuth error: ${error}`));
          return;
        }
        if (returnedState !== state) {
          res.writeHead(400, { 'content-type': 'text/html' });
          res.end('<h1>State mismatch</h1><p>Possible CSRF. Re-run the script.</p>');
          server.close();
          reject(new Error('OAuth state mismatch'));
          return;
        }
        if (!code) {
          res.writeHead(400);
          res.end('Missing code');
          return;
        }

        res.writeHead(200, { 'content-type': 'text/html' });
        res.end(
          '<h1>✅ Refresh token captured</h1>' +
          '<p>You can close this tab and return to the terminal.</p>'
        );
        server.close();
        resolve(code);
      } catch (e) {
        reject(e);
      }
    });
    server.on('error', reject);
    server.listen(PORT);
  });

  console.log('  ✓ Code received, exchanging for tokens …\n');

  const { tokens } = await oauth.getToken(code);
  if (!tokens.refresh_token) {
    console.error(
      '\n❌ Google did not return a refresh token.\n' +
      'This usually means the user previously authorized this OAuth client.\n' +
      'Fix: go to https://myaccount.google.com/permissions, revoke\n' +
      '"Canvas SEO Dashboard" / "Canvas SEO CLI", then re-run this script.\n'
    );
    process.exit(1);
  }

  console.log('──────────────────────────────────────────────────────────────');
  console.log('  ✅ SUCCESS — Add this line to .env.local:');
  console.log('──────────────────────────────────────────────────────────────\n');
  console.log(`GOOGLE_OAUTH_REFRESH_TOKEN=${tokens.refresh_token}\n`);
  console.log('Then you can remove the old GSC_SERVICE_ACCOUNT_JSON line.\n');
}

main().catch((err) => {
  console.error('\n❌ Failed:', err.message ?? err);
  process.exit(1);
});
