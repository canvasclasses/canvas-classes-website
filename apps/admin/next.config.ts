import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  transpilePackages: ['@canvas/book-renderer', '@canvas/core', '@canvas/data', '@canvas/persona', '@canvas/services', '@canvas/ui'],
  experimental: {
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
              "connect-src 'self' https://*.supabase.co https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.de.sentry.io https://api.mixpanel.com",
              "media-src 'self' https: blob:",
              "object-src 'none'",
              // Must allow the same embeddable media sources the student app allows —
              // the admin editor's preview pane renders the exact same book content
              // (YouTube/youtube-nocookie video blocks, Drive/Docs embeds, PhET sims),
              // so anything a student can see must render here too. Kept in sync with
              // apps/student/next.config.ts frame-src. frame-ancestors 'none' + the
              // X-Frame-Options: DENY above still prevent the admin app itself from
              // being embedded anywhere — this only governs what it may embed.
              "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://customer-stream.cloudflarestream.com https://drive.google.com https://docs.google.com https://phet.colorado.edu",
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
