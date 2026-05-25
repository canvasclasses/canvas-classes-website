/**
 * Shim for the `server-only` npm package, which throws unconditionally on
 * import. In Next.js the bundler replaces it with a no-op for server bundles,
 * but plain tsx execution (scripts) doesn't have that replacement, so any
 * file importing `'server-only'` blows up.
 *
 * Solution: pre-populate the require cache with an empty module before any
 * other imports run. Subsequent `require('server-only')` calls return our
 * stub and skip the throwing index.js entirely.
 *
 * Import this file FIRST in any tsx script that touches Mongoose models or
 * @canvas/seo code:
 *
 *   import './_shim-server-only';   // must be first line!
 *   import { GscMetricsDaily } from '@canvas/data/models/GscMetricsDaily';
 *
 * Safe because tsx compiles imports to CJS `require()` calls in source order.
 */

try {
  const resolved = require.resolve('server-only');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (require.cache as any)[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    children: [],
    paths: [],
    exports: {},
  };
} catch {
  // server-only not in node_modules — nothing to shim, scripts will work anyway.
}
