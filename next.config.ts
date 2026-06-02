import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../"),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@mock": path.resolve(__dirname, "../src/mock"),
      "@type": path.resolve(__dirname, "../src/types"),
    };
    return config;
  },
};

export default nextConfig;
