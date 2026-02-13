import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
      },
      {
        protocol: 'http',
        hostname: 'sitruyen-strapi', // Internal docker network
        port: '1337',
      },
      {
        protocol: 'http',
        hostname: 'strapi', // Service name as hostname
        port: '1337',
      },
      {
        protocol: 'https',
        hostname: 'api-sitruyen.nhatcuong.io.vn',
      },
    ],
  },
};

export default nextConfig;
