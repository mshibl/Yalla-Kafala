/**
 * The council test mode: how the design council and the bug sweep let a
 * browser into /admin on a throwaway local Convex backend, without Clerk.
 *
 * It is OFF unless `NEXT_PUBLIC_COUNCIL_TEST_MODE=1` was set when the app was
 * built, and even then it refuses to switch on (it throws) unless
 *   - the app is not on Vercel (`VERCEL` unset), and
 *   - `NEXT_PUBLIC_CONVEX_URL` is a local address (localhost, 127.0.0.1, ::1).
 * So a production or cloud-dev deployment can never run it: those have a
 * cloud Convex URL. (`NODE_ENV` cannot be the guard: the councils run
 * `next start`, which is `production`.)
 *
 * What it changes (see docs/design-council.md, "The test-only login"):
 *   - middleware.ts: /admin is signed in when the `council_admin` cookie is set,
 *     instead of asking Clerk;
 *   - Providers: no Clerk; the Convex client acts as a fixed test admin;
 *   - /api/council/login, /api/council/logout, /api/council/session: set,
 *     clear and use that cookie (404 when the mode is off).
 */

export const COUNCIL_COOKIE = "council_admin";

/** The fixed identity the test admin acts as in Convex. */
export const COUNCIL_IDENTITY = {
  subject: "council-admin",
  issuer: "https://council.local",
  tokenIdentifier: "https://council.local|council-admin",
} as const;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

export type CouncilEnv = {
  /** NEXT_PUBLIC_COUNCIL_TEST_MODE */
  flag?: string | undefined;
  /** NEXT_PUBLIC_CONVEX_URL */
  convexUrl?: string | undefined;
  /** VERCEL: set on any Vercel build or deployment */
  vercel?: string | undefined;
};

export type CouncilVerdict =
  | { on: false }
  | { on: true }
  | { on: false; refused: string };

/** Whether the mode is on, off, or asked for and refused (with why). */
export function checkCouncilTestMode(env: CouncilEnv): CouncilVerdict {
  if (env.flag !== "1") return { on: false };
  if (env.vercel) {
    return {
      on: false,
      refused: "the council test mode never runs on Vercel",
    };
  }
  let host = "";
  try {
    host = new URL(env.convexUrl ?? "").hostname;
  } catch {
    return {
      on: false,
      refused: "NEXT_PUBLIC_CONVEX_URL is not set to a URL",
    };
  }
  if (!LOCAL_HOSTS.has(host)) {
    return {
      on: false,
      refused: `NEXT_PUBLIC_CONVEX_URL (${host}) is not a local Convex backend`,
    };
  }
  return { on: true };
}

/**
 * True when the test mode is on. Throws when it was asked for and refused, so
 * a misconfigured deployment fails loudly instead of running without Clerk.
 * The `process.env.NEXT_PUBLIC_*` reads are literal so Next inlines them.
 */
export function councilTestMode(): boolean {
  const verdict = checkCouncilTestMode({
    flag: process.env.NEXT_PUBLIC_COUNCIL_TEST_MODE,
    convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL,
    vercel: process.env.VERCEL,
  });
  if ("refused" in verdict) {
    throw new Error(
      `NEXT_PUBLIC_COUNCIL_TEST_MODE refused: ${verdict.refused}`,
    );
  }
  return verdict.on;
}
