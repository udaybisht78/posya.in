import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ✅ Local (development)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      // ✅ Production
      {
        protocol: 'https',
        hostname: 'api.posya.in',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;