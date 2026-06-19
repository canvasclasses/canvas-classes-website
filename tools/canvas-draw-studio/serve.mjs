// Zero-dependency static server for the built tool. Uses ONLY Node's built-in
// modules, so it runs on any machine with Node installed — no `npm install`
// needed. Serves ./dist over http://localhost (a real http origin is required:
// Ketcher's WASM worker and ES modules won't load from a file:// page).
//
// Run directly (`node serve.mjs`) or via the double-click Start.command launcher.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { spawn } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, 'dist');
const START_PORT = 4321;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
};

async function exists(p) {
  try {
    const s = await stat(p);
    return s.isFile();
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  try {
    // Strip query string, decode, and normalise to block path traversal.
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    let rel = normalize(urlPath).replace(/^(\.\.[/\\])+/, '').replace(/^[/\\]+/, '');
    if (rel === '' || rel.endsWith('/')) rel = join(rel, 'index.html');
    let filePath = join(ROOT, rel);

    // Confirm the resolved path stays inside ROOT.
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    // SPA-ish fallback: unknown path → index.html (single-page app).
    if (!(await exists(filePath))) filePath = join(ROOT, 'index.html');

    const data = await readFile(filePath);
    const type = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    res.end(data);
  } catch (err) {
    res.writeHead(500);
    res.end('Server error');
    console.error(err);
  }
});

function openBrowser(url) {
  const cmd =
    process.platform === 'darwin' ? 'open' :
    process.platform === 'win32' ? 'start' :
    'xdg-open';
  try {
    spawn(cmd, [url], { shell: process.platform === 'win32', stdio: 'ignore', detached: true }).unref();
  } catch {
    /* user can open the URL manually */
  }
}

// Try START_PORT, then increment if it's taken, so two copies can run at once.
function listen(port, attemptsLeft) {
  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      listen(port + 1, attemptsLeft - 1);
    } else {
      console.error('Could not start the server:', err.message);
      process.exit(1);
    }
  });
  server.listen(port, '127.0.0.1', () => {
    const url = `http://localhost:${port}`;
    console.log('\n  Canvas Draw Studio is running.');
    console.log(`  → ${url}`);
    console.log('\n  Leave this window open while you work. Close it (or press Ctrl+C) to stop.\n');
    // CDS_NO_OPEN lets a script start the server without launching a browser.
    if (!process.env.CDS_NO_OPEN) openBrowser(url);
  });
}

listen(START_PORT, 20);
