import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Scope file tracing to this project only — prevents stale cross-directory chunk refs
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },
  webpack(config) {
    // Deterministic IDs prevent chunk renumbering between incremental builds
    config.optimization = {
      ...config.optimization,
      moduleIds: "deterministic",
      chunkIds: "deterministic",
    };
    config.resolve.alias = {
      ...config.resolve.alias,
      "@mock": path.resolve(__dirname, "src/mock"),
      "@type": path.resolve(__dirname, "src/types"),
    };
    return config;
  },
};

export default nextConfig;
