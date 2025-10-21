import type { NextConfig } from "next";

const getImageConfig = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  const url = new URL(apiUrl);
  
  return {
    protocol: url.protocol.replace(':', '') as 'http' | 'https',
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? '443' : '80'),
    pathname: '/media/**',
  };
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Динамически получаем конфигурацию из .env
      getImageConfig(),
      // Локальная разработка (fallback)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
