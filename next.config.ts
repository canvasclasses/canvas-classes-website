import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
  },
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
    ];
  },
};

export default nextConfig;
