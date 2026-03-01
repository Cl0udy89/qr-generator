import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://qr_backend:8000/api/:path*',
      },
      {
        source: '/static/:path*',
        destination: 'http://qr_backend:8000/static/:path*',
      },
      {
        source: '/qr_codes/:path*',
        destination: 'http://qr_backend:8000/qr_codes/:path*',
      },
      {
        source: '/r/:path*',
        destination: 'http://qr_backend:8000/r/:path*',
      }
    ]
  },
};

export default nextConfig;
