import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/v1/**',
      },
      {
        protocol: 'https',
        hostname: 'fabrykakavy.com',
        port: '',
        pathname: '/wp-content/uploads**',
      },
    ],
    domains: ['api.qrserver.com', 'fabrykakavy.com'],
  },
};

export default nextConfig;
