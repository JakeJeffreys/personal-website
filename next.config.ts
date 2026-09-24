import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF runs ~20-30% smaller than WebP; browsers without it get WebP.
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75],
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "github.com" },
      { hostname: "raw.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
