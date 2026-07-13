import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the tracing root: a stray lockfile exists in the user home directory.
  outputFileTracingRoot: __dirname,
  // Gallery photos are fetched live from Facebook's CDN (see
  // getLiveFacebookPhotos in src/lib/facebook.ts) rather than re-hosted,
  // so next/image needs these remote hosts allow-listed.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.fbcdn.net" }],
  },
  // Prisma's generated client statically references its WASM query engine
  // even though it's unused at runtime (Accelerate uses the Data Proxy
  // engine instead); webpack needs this flag to bundle .wasm imports at
  // all (off by default since webpack 5). Only applies to the `--webpack`
  // build we use to work around a Turbopack/Windows path bug — see
  // open-next.config.ts.
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
};

export default nextConfig;
