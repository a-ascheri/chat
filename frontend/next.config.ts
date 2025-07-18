import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Configuración para proxying todas las peticiones al backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`
      },
      {
        source: '/ws',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ws`
      },
      {
        source: '/ws/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/ws/:path*`
      }
    ];
  }
};

export default nextConfig;
