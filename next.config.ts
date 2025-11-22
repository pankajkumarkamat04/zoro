import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.zorotopup.com',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.onetopup.in',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.credszone.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
