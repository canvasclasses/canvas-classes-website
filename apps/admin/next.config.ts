import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  transpilePackages: ['@canvas/book-renderer', '@canvas/core', '@canvas/data', '@canvas/persona', '@canvas/services', '@canvas/ui'],
  experimental: {
    // Reduce webpack's peak memory during `next build`. The admin app bundles two
    // heavy editors (Ketcher + Excalidraw), and the Vercel build was OOM-killed
    // (build container ran out of RAM). This trades a little build speed for a
    // much lower memory ceiling. See Next 15 docs: webpackMemoryOptimizations.
    webpackMemoryOptimizations: true,
    // Default is 10 MB. The admin uploads videos (up to 200 MB per the asset-upload
    // route) through middleware-gated routes. Without this, Next.js silently
    // truncates the request body at 10 MB and the route's `request.formData()`
    // throws "expected boundary after body" because the multipart marker got cut.
    // Match this to the video size cap in apps/admin/app/api/v2/books/assets/upload/route.ts.
    // NOTE: this MUST live under `experimental` — Next 15 puts it there, even
    // though the doc URL path (`/next-config-js/middlewareClientMaxBodySize`)
    // makes it look top-level. Confirmed by reading node_modules/next/dist/esm/
    // server/config-shared.js: the default value sits inside the experimental
    // block, so user overrides must too.
    middlewareClientMaxBodySize: '200mb',
    serverActions: {
      bodySizeLimit: '20mb',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",
              // cdn.jsdelivr.net: Excalidraw (/diagram-editor) loads its fonts from
              // EXCALIDRAW_ASSET_PATH on jsdelivr; the font fetch needs connect-src.
              "connect-src 'self' blob: https://cdn.jsdelivr.net https://*.supabase.co https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.de.sentry.io https://api.mixpanel.com",
              "media-src 'self' https: blob:",
              // worker-src + blob: connect-src are required by the Structure Editor
              // (/structure-editor): Ketcher runs its Indigo cheminformatics engine
              // (SMILES/InChI/clean-up/image export) inside a blob web worker that
              // streams a WASM binary. Without these, the canvas mounts but every
              // chemistry operation fails silently. script-src already has
              // 'unsafe-eval' which permits the WASM compile.
              "worker-src 'self' blob:",
              "object-src 'none'",
              "frame-src 'self' https://customer-stream.cloudflarestream.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              ...(isProd ? ["upgrade-insecure-requests"] : []),
            ].join('; ')
          }
        ],
      },
    ];
  },
  images: {
    unoptimized: false,
    minimumCacheTTL: 31536000,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'canvas-chemistry-assets.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        pathname: '/thumbnail',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
  staticPageGenerationTimeout: 300,
  webpack: (config) => {
    // Ketcher (Structure Editor) depends on Paper.js, whose Node build statically
    // require()s `jsdom` + `canvas` for a server-side canvas shim. Those are
    // server-only and absent in the browser bundle, so webpack fails to resolve
    // them even though the code path never runs in the browser. Alias them to
    // `false` so webpack supplies an empty module and tree-shakes the dead branch.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      jsdom: false,
      canvas: false,
    };
    return config;
  },
};

export default withSentryConfig(nextConfig, {
  org: "canvas-classes",
  project: "canvas-admin",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  webpack: {
    automaticVercelMonitors: false,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
