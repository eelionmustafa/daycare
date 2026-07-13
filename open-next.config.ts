import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig();

// Turbopack (the default bundler as of Next.js 16) emits WASM chunk loaders
// with absolute Windows paths baked in as literal string keys when building
// on Windows, which esbuild then can't resolve during the Cloudflare
// Workers bundling step. This trips on Prisma's generated client, which
// statically references its (unused, since we use Accelerate/DataProxy at
// runtime) query_engine_bg.wasm regardless. Webpack doesn't have this bug.
config.buildCommand = "next build --webpack";

export default config;
