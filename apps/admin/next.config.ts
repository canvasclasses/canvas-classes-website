import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  transpilePackages: ['@canvas/book-renderer', '@canvas/core', '@canvas/data', '@canvas/persona', '@canvas/services', '@canvas/ui'],
  experimental: {
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
