import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

function createClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  }).$extends(withAccelerate());
}

const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof createClient> };

const client = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;

// Typed as the base PrismaClient rather than the `$extends()` result:
// Accelerate's extension type doesn't reliably preserve relation `include`/
// `select` typing across the whole project's call sites (a known rough
// edge), even though it doesn't change actual query shapes or return
// values at runtime — it only adds `cacheStrategy` options and the
// `$accelerate` namespace, neither of which this app uses yet.
export const db = client as unknown as PrismaClient;
