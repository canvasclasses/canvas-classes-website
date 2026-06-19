import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Standalone, local-only tool. Built to ./dist and served by serve.mjs (or any
// static server). `base: './'` makes the bundle use relative asset paths so the
// folder works no matter where it's copied — opened from disk or served from any
// sub-path. Excalidraw needs the IS_PREACT define to know it's running on React.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  define: {
    'process.env.IS_PREACT': JSON.stringify('false'),
    // A Ketcher dependency references Node's `global`, which doesn't exist in the
    // browser (Webpack auto-polyfills it; Vite does not). Without this, Ketcher's
    // engine init throws "global is not defined" inside a promise and onInit never
    // fires — the editor renders but can't draw/export. Map it to globalThis.
    global: 'globalThis',
  },
  // ketcher-core's ESM build contains a stray `require("raphael")` (a mixed
  // ES-module + CommonJS file). Rollup leaves require() in ESM files alone by
  // default, so it survives into the bundle and throws "require is not defined"
  // in the browser. transformMixedEsModules tells the commonjs plugin to rewrite
  // those requires into real imports. optimizeDeps.include does the same for the
  // dev server (esbuild prebundle).
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 6000,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['raphael', 'ketcher-core', 'ketcher-react', 'ketcher-standalone'],
  },
});
