import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Isolated cache dir — lets secondary/preview servers use NEXT_DIST_DIR=.next-preview
  // so they never write to the primary .next directory and corrupt the main dev server.
  distDir: process.env.NEXT_DIST_DIR ?? '.next',

  // SECURITY FIX: Request body size limits to prevent DoS
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Redirects and other config...
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // SECURITY FIX: Enhanced security headers for CSRF and XSS protection
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { 
            key: 'Strict-Transport-Security', 
            value: 'max-age=31536000; includeSubDomains; preload' 
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // cdnjs & cdn.tailwindcss needed by the self-hosted VSEPR/simulator HTML files
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.tailwindcss.com https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",
              "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.de.sentry.io https://api.mixpanel.com https://*.clarity.ms https://*.clarity.microsoft.com https://*.vercel-insights.com https://va.vercel-scripts.com",
              "media-src 'self' https: blob:",
              "object-src 'none'",
              "frame-src 'self' https://www.youtube.com https://youtube.com https://www.youtube-nocookie.com https://customer-stream.cloudflarestream.com https://drive.google.com https://docs.google.com https://phet.colorado.edu",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              // upgrade-insecure-requests must ONLY run in production HTTPS.
              // On localhost (HTTP), it causes iframes to be upgraded to https://localhost
              // which has no listener, producing "refused to connect".
              ...(isProd ? ["upgrade-insecure-requests"] : []),
            ].join('; ')
          }
        ],
      },
      {
        // Additional CORS headers for API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.canvasclasses.in' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,PATCH,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
      {
        // Override framing headers for self-hosted simulator files so they can
        // be embedded in iframes on the same origin (the VSEPR/Bond Angles pages).
        // X-Frame-Options: DENY and CSP frame-ancestors 'none' both block same-origin iframes.
        source: '/simulators/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Content-Security-Policy',
            // Minimal CSP for simulators: allow same-origin framing and required CDNs
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://cdn.tailwindcss.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self'",
              "media-src 'self' blob:",
              "object-src 'none'",
              // Allow this document to be framed by the same origin
              "frame-ancestors 'self'",
            ].join('; ')
          },
        ],
      },
    ];
  },
  images: {
    // Enable next/image optimization (AVIF/WebP, responsive srcsets, blur placeholders).
    // Every existing <Image> in the app points at local /public assets — those stay
    // optimized regardless. Remote R2 hosts below cover the books CMS and shared assets.
    unoptimized: false,
    minimumCacheTTL: 31536000,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      // Cloudflare R2 public bucket — canvas-chemistry-assets legacy host
      {
        protocol: 'https',
        hostname: 'canvas-chemistry-assets.r2.dev',
        pathname: '/**',
      },
      // Cloudflare R2 public bucket — shared pub-* alias (used by BohrModel,
      // AcidityEducationCards, PeriodicTableClient, and book image blocks)
      {
        protocol: 'https',
        hostname: 'pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev',
        pathname: '/**',
      },
    ],
  },
  staticPageGenerationTimeout: 300,
  async redirects() {
    return [
      // Redirect non-www to www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'canvasclasses.in',
          },
        ],
        destination: 'https://www.canvasclasses.in/:path*',
        permanent: true,
      },
      {
        source: '/flashcards',
        destination: '/chemistry-flashcards',
        permanent: true,
      },
      {
        source: '/flashcards/:slug*',
        destination: '/chemistry-flashcards/:slug*',
        permanent: true,
      },
      // GSC SEO Fixes for Renamed/Deleted Chapters
      {
        source: '/chemistry-flashcards/aldehydes-ketones',
        destination: '/chemistry-flashcards/aldehydes-ketones-acids',
        permanent: true,
      },
      {
        source: '/chemistry-flashcards/carboxylic-acids-derivatives',
        destination: '/chemistry-flashcards/aldehydes-ketones-acids',
        permanent: true,
      },
      {
        source: '/chemistry-flashcards/p-block-12th',
        destination: '/chemistry-flashcards/p-block-elements-g15-18',
        permanent: true,
      },
      {
        source: '/chemistry-flashcards/redox-reactions',
        destination: '/chemistry-flashcards',
        permanent: true,
      },
      {
        source: '/chemistry-flashcards/thermodynamics',
        destination: '/chemistry-flashcards',
        permanent: true,
      },
      {
        source: '/chemistry-flashcards/hydrogen',
        destination: '/chemistry-flashcards',
        permanent: true,
      },
      {
        source: '/chemistry-flashcards/hydrocarbons',
        destination: '/chemistry-flashcards',
        permanent: true,
      },
      // Fix broken typo link
      {
        source: '/detailed-',
        destination: '/detailed-lectures',
        permanent: true,
      },
      // NCERT Simplified canonical URL moved to /class-11/chemistry
      {
        source: '/books/ncert-simplified',
        destination: '/class-11/chemistry',
        permanent: true,
      },
      {
        source: '/books/ncert-simplified/:pageSlug',
        destination: '/class-11/chemistry/:pageSlug',
        permanent: true,
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "canvas-classes",

  project: "canvas-prod",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Tree-shake Sentry's internal logger from client bundles.
  disableLogger: true,

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
