import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirects and other config...
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
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
