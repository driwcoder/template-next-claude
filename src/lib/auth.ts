import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { memoryAdapter } from "better-auth/adapters/memory";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/env";
import { db, schema } from "@/lib/db";

function resolveSecret() {
  if (env.BETTER_AUTH_SECRET) return env.BETTER_AUTH_SECRET;

  const isBuild = process.env.NEXT_PHASE === "phase-production-build";
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(env.BETTER_AUTH_URL);

  // Fail only on a real deployment (production, not build, non-localhost URL).
  // `pnpm dev` and a local `pnpm start` still work with the insecure fallback.
  if (env.NODE_ENV === "production" && !isBuild && !isLocal) {
    throw new Error(
      "BETTER_AUTH_SECRET is required in production. Generate one with `openssl rand -base64 32`."
    );
  }
  console.warn(
    "[auth] BETTER_AUTH_SECRET not set — using an insecure dev fallback (never in production)."
  );
  return "dev-only-insecure-secret-change-me";
}

// In-memory store used when DATABASE_URL is absent, so the template runs on clone.
// The memory adapter does not create tables — seed each model key with an array.
const memoryStore: Record<string, unknown[]> = {
  user: [],
  session: [],
  account: [],
  verification: [],
};

export const auth = betterAuth({
  appName: "Template Next Claude",
  secret: resolveSecret(),
  baseURL: env.BETTER_AUTH_URL,
  database: db ? drizzleAdapter(db, { provider: "pg", schema }) : memoryAdapter(memoryStore),
  emailAndPassword: { enabled: true },
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  // Keep last: lets server actions / route handlers set auth cookies.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
