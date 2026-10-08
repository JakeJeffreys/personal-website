import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production builds from replacing files used by a running dev server.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
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
