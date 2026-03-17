import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable "X-Powered-By: Next.js" header for security
  poweredByHeader: false,

  // Production image optimization (add external domains here if needed)
  images: {
    domains: [],
  },

  // Ensure environment variable is exposed to browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  },
};

export default nextConfig;
