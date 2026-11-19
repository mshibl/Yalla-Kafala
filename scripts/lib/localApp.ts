/**
 * How both councils start a safe, local copy of the site: a throwaway Convex
 * backend (scripts/council-backend.sh) with invented demo rows
 * (scripts/council/seedData.ts), and a production build of the app with the
 * council test mode on (src/lib/councilTestMode.ts), so the admin area opens
 * without Clerk. Nothing here reaches a cloud service: a cloud Convex
 * deployment is refused by the backend script and again by `assertLocalUrl`.
 *
 * The pure helpers are tested (localApp.test.ts); `startLocalApp` starts
 * processes and is only ever run by the owner (never by the tests).
 */
import { type ChildProcess } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { SEED, toJsonl } from "../council/seedData";
import { type createRunner } from "./agentRunner";

export type Runner = ReturnType<typeof createRunner>;

export type Ports = { app: number; convex: number; convexSite: number };

/** Ports per tool, so the design council and the bug sweep can run together. */
export const PORTS = {
  "design-council": { app: 3600, convex: 3610, convexSite: 3611 },
  "bug-sweep": { app: 3700, convex: 3710, convexSite: 3711 },
} as const satisfies Record<string, Ports>;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

/** True for an http(s) URL on this machine. */
export function isLocalUrl(url: string): boolean {
  try {
    return LOCAL_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** Throws unless `url` is on this machine: the last guard before the app starts. */
export function assertLocalUrl(what: string, url: string): void {
  if (!isLocalUrl(url))
    throw new Error(
      `${what} (${url}) is not a local address: the councils only run on a local backend.`,
    );
}

/**
 * The admin key of the anonymous local backend, from
 * `.convex/local/default/config.json`. The browser never sees it in a bundle:
 * the app's /api/council/session route hands it out in test mode only.
 */
export function readAdminKey(configJson: string): string {
  let config: unknown;
  try {
    config = JSON.parse(configJson);
  } catch {
    throw new Error("The local backend's config.json is not valid JSON");
  }
  const key = (config as { adminKey?: unknown } | null)?.adminKey;
  if (typeof key !== "string" || !key)
    throw new Error("The local backend's config.json has no adminKey");
  return key;
}

/**
 * The environment for `next build` and `next start`. Values are dummies: the
 * site's keys for Clerk, UploadThing, Facebook, EmailOctopus and PostHog are
 * never needed (and never copied from a .env file), so those features fail
 * safely in the council copy instead of reaching a real service.
 */
export function councilAppEnv(opts: {
  baseUrl: string;
  convexUrl: string;
  /** Only at `next start`: the admin key stays out of the build. */
  adminKey?: string;
}): Record<string, string> {
  assertLocalUrl("The Convex URL", opts.convexUrl);
  const env: Record<string, string> = {
    NEXT_PUBLIC_COUNCIL_TEST_MODE: "1",
    NEXT_PUBLIC_CONVEX_URL: opts.convexUrl,
    NEXT_PUBLIC_URL: opts.baseUrl,
    NEXT_PUBLIC_POSTHOG_KEY: "council-dummy",
    NEXT_PUBLIC_POSTHOG_HOST: "http://127.0.0.1:9",
    SKIP_ENV_VALIDATION: "1",
    DATABASE_URL: "http://127.0.0.1:9/unused",
    UPLOADTHING_TOKEN: "council-dummy",
    GOOGLE_GENERATIVE_AI_API_KEY: "council-dummy",
    FACEBOOK_PAGE_ACCESS_TOKEN: "council-dummy",
    EMAIL_OCTOPUS_AUTH_TOKEN: "council-dummy",
    GOOGLE_CLIENT_ID: "council-dummy",
    GOOGLE_CLIENT_SECRET: "council-dummy",
    NEXT_TELEMETRY_DISABLED: "1",
  };
  if (opts.adminKey) env.COUNCIL_CONVEX_ADMIN_KEY = opts.adminKey;
  return env;
}

/** Writes each seed table as `<dir>/<table>.jsonl`; empty tables are skipped. */
export function writeSeedFiles(dir: string): { table: string; file: string }[] {
  mkdirSync(dir, { recursive: true });
  const out: { table: string; file: string }[] = [];
  for (const [table, rows] of Object.entries(SEED)) {
    if (!rows.length) continue;
    const file = join(dir, `${table}.jsonl`);
    writeFileSync(file, toJsonl(rows));
    out.push({ table, file });
  }
  return out;
}

async function waitFor(
  what: string,
  ready: () => Promise<boolean> | boolean,
  seconds: number,
  child?: ChildProcess,
) {
  for (let i = 0; i < seconds; i++) {
    if (await ready()) return;
    if (child && child.exitCode !== null)
      throw new Error(`${what} exited before it was ready`);
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Timed out waiting for ${what}`);
}

export type LocalApp = {
  baseUrl: string;
  convexUrl: string;
  /** Replaces the demo rows with the seed again (a fresh world). */
  reseed(): void;
};

/**
 * Installs, starts the local backend in `worktree`, seeds it, builds the app
 * in test mode and starts it; returns when the home page answers. Everything
 * it starts is stopped by the runner when the script ends.
 */
export async function startLocalApp(opts: {
  runner: Runner;
  worktree: string;
  logDir: string;
  ports: Ports;
  /** False reuses the worktree's last build (same ports only). */
  build?: boolean;
}): Promise<LocalApp> {
  const { runner, worktree, logDir, ports } = opts;
  const { run } = runner;
  const baseUrl = `http://localhost:${ports.app}`;
  mkdirSync(logDir, { recursive: true });

  run("pnpm", ["install", "--frozen-lockfile", "--prefer-offline"], worktree);

  const readyFile = join(worktree, ".council/backend.url");
  mkdirSync(join(worktree, ".council"), { recursive: true });
  rmSync(readyFile, { force: true });
  const backend = runner.startChild(
    join(worktree, "scripts/council-backend.sh"),
    [],
    worktree,
    join(logDir, "backend.log"),
    {
      COUNCIL_CONVEX_PORT: String(ports.convex),
      COUNCIL_CONVEX_SITE_PORT: String(ports.convexSite),
    },
  );
  await waitFor(
    "the Convex backend",
    () =>
      existsSync(readyFile) && readFileSync(readyFile, "utf8").trim() !== "",
    300,
    backend,
  );
  const convexUrl = readFileSync(readyFile, "utf8").trim();
  assertLocalUrl("The Convex backend", convexUrl);
  const adminKey = readAdminKey(
    readFileSync(join(worktree, ".convex/local/default/config.json"), "utf8"),
  );

  const convexEnv = { CONVEX_AGENT_MODE: "anonymous" };
  const seed = () => {
    const files = writeSeedFiles(join(worktree, ".council/seed"));
    for (const { table, file } of files)
      run(
        "npx",
        ["convex", "import", "--table", table, "--replace", "-y", file],
        worktree,
        convexEnv,
      );
  };
  seed();

  const buildEnv = councilAppEnv({ baseUrl, convexUrl });
  const built = existsSync(join(worktree, ".next/BUILD_ID"));
  if (opts.build !== false || !built)
    run("pnpm", ["build"], worktree, buildEnv);
  const app = runner.startChild(
    "pnpm",
    ["start", "--port", String(ports.app)],
    worktree,
    join(logDir, "app.log"),
    councilAppEnv({ baseUrl, convexUrl, adminKey }),
  );
  await waitFor(
    "the app",
    async () => {
      try {
        return (await fetch(`${baseUrl}/en`)).ok;
      } catch {
        return false;
      }
    },
    120,
    app,
  );
  runner.log(`App at ${baseUrl}, backend at ${convexUrl}`);
  return { baseUrl, convexUrl, reseed: seed };
}
