import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow unoptimized images for max compatibility across Vercel, Netlify, and GitHub Pages
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Ensure strict React hydration compliance
  reactStrictMode: true,
};

export default nextConfig;
