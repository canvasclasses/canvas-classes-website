import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net",
              "connect-src 'self' https://*.supabase.co https://www.google-analytics.com",
              "media-src 'self' https: blob:",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests",
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
    ];
  },
  images: {
    unoptimized: true,
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
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
    ];
  },
};

export default nextConfig;
