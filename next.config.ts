import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      // Permanent redirect for old flashcards URL to new SEO-friendly URL
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
    ];
  },
};

export default nextConfig;
