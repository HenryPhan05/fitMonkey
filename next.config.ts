import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "scontent-lga3-2.xx.fbcdn.net"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uhrjptuvkvajpqznyikd.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  /* config options here */
  reactCompiler: true,
};


export default nextConfig;
