import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import { existsSync, openSync, readFileSync } from "node:fs";

/**
 * How both councils run things: commands in a clean environment, a worktree
 * at the tested commit, and Claude Code agents with a time limit. Bugs go to
 * the local bug store (scripts/lib/bugStore.ts).
 */

export type Env = Record<string, string | undefined>;

/** How an agent ended: finished, stopped at its time limit, or failed. */
export type Ending = "finished" | "timed out" | `failed (exit ${number})`;

export type AgentRun = {
  ending: Ending;
  minutes: number;
  /** How often it ended early and was resumed. */
  resumes: number;
};

/** The Claude Code session ID an agent's stream-json log ends with. */
export function sessionIdIn(log: string): string | null {
  const ids = [...log.matchAll(/"session_id":"([^"]+)"/g)];
  return ids.at(-1)?.[1] ?? null;
}

/** `args` (`-p <prompt> …`) with a new prompt, resuming `sessionId`. */
export function resumeArgs(
  args: string[],
  sessionId: string,
  prompt: string,
): string[] {
  if (args[0] !== "-p") throw new Error("args must start with -p <prompt>");
  return ["-p", prompt, "--resume", sessionId, ...args.slice(2)];
}

/** An agent that ends with less than this much time left isn't resumed. */
const MIN_MINUTES_TO_RESUME = 2;
const MAX_RESUMES = 5;

/** `2026-10-24-1937`: local time, for a run's folder. */
export function runIdFor(at: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}-${pad(at.getHours())}${pad(at.getMinutes())}`;
}

export function createRunner(name: string, extraEnv: Env = {}) {
  const children = new Set<ChildProcess>();
  const sessions = new Set<string>();

  /**
   * The shell's leftovers removed: NODE_ENV=production breaks builds, an
   * inherited PORT moves the app, and cloud Convex variables must never reach
   * a local backend.
   */
  const env: Env = { ...process.env, ...extraEnv };
  for (const key of [
    "NODE_ENV",
    "PORT",
    "CONVEX_DEPLOYMENT",
    "CONVEX_URL",
    "CONVEX_SELF_HOSTED_URL",
    "CONVEX_DEPLOY_KEY",
    "NEXT_PUBLIC_CONVEX_URL",
    "NEXT_PUBLIC_CONVEX_SITE_URL",
  ])
    delete env[key];

  /** `env` plus `extra`, as `spawn` takes it. */
  const childEnv = (extra: Env = {}): NodeJS.ProcessEnv =>
    ({ ...env, ...extra }) as NodeJS.ProcessEnv;

  function log(message: string) {
    console.log(
      `[${name} ${new Date().toTimeString().slice(0, 8)}] ${message}`,
    );
  }

  function git(args: string[], cwd: string): string {
    return spawnSync("git", args, { cwd, encoding: "utf8" }).stdout.trim();
  }

  function run(cmd: string, args: string[], cwd: string, extra: Env = {}) {
    log(`$ ${cmd} ${args.join(" ")}`);
    const r = spawnSync(cmd, args, {
      cwd,
      stdio: "inherit",
      env: childEnv(extra),
    });
    if (r.status !== 0) throw new Error(`${cmd} ${args[0]} failed`);
  }

  function missing(cmds: string[]): string[] {
    return cmds.filter(
      (cmd) => spawnSync("which", [cmd], { env: childEnv() }).status !== 0,
    );
  }

  /** The commit `ref` names, after fetching when it is a remote branch. */
  function resolveRef(ref: string, root: string): string {
    if (ref.startsWith("origin/"))
      spawnSync("git", ["fetch", "-q", "origin"], {
        cwd: root,
        stdio: "inherit",
      });
    const sha = git(["rev-parse", "--verify", `${ref}^{commit}`], root);
    if (!sha) throw new Error(`No commit for --ref ${ref}`);
    return sha;
  }

  /** A worktree at `sha`, created or moved there; refuses a dirty one. */
  function prepareWorktree(root: string, path: string, sha: string) {
    if (!existsSync(path)) {
      run("git", ["worktree", "add", "--detach", path, sha], root);
      return;
    }
    const dirty = git(["status", "--porcelain", "--untracked-files=no"], path);
    if (dirty) throw new Error(`${path} has uncommitted changes:\n${dirty}`);
    run("git", ["checkout", "--detach", sha], path);
  }

  function startChild(
    cmd: string,
    args: string[],
    cwd: string,
    logFile: string,
    extra: Env = {},
  ): ChildProcess {
    const out = openSync(logFile, "a");
    const child = spawn(cmd, args, {
      cwd,
      env: childEnv(extra),
      detached: true,
      stdio: ["ignore", out, out],
    });
    children.add(child);
    child.on("exit", () => children.delete(child));
    return child;
  }

  function stop(child: ChildProcess) {
    if (!child.pid || child.exitCode !== null) return;
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {}
    setTimeout(() => {
      try {
        process.kill(-child.pid!, "SIGKILL");
      } catch {}
    }, 10_000).unref();
  }

  function closeSession(session: string) {
    spawnSync("agent-browser", ["--session", session, "close"], {
      env: childEnv(),
    });
    sessions.delete(session);
  }

  /**
   * Runs one Claude Code agent (`claude` with `args`) until its time is up.
   * A stopped agent still leaves the files it wrote so far. Agents tend to
   * stop early: with `keepGoing`, one that ends with time left is resumed
   * (same session) with the prompt it returns for the minutes left. With a
   * browser `session`, the agent gets it and it is closed afterwards.
   */
  async function runAgent(opts: {
    name: string;
    args: string[];
    cwd: string;
    minutes: number;
    logFile: string;
    session?: string;
    keepGoing?: (minutesLeft: number) => string;
  }): Promise<AgentRun> {
    const started = Date.now();
    const deadline = started + opts.minutes * 60_000;
    if (opts.session) sessions.add(opts.session);
    let args = opts.args;
    let ending: Ending;
    let resumes = 0;
    for (;;) {
      const child = startChild(
        "claude",
        args,
        opts.cwd,
        opts.logFile,
        opts.session ? { AGENT_BROWSER_SESSION: opts.session } : {},
      );
      let timedOut = false;
      const timer = setTimeout(
        () => {
          timedOut = true;
          log(`${opts.name}: time is up, stopping it`);
          stop(child);
        },
        Math.max(deadline - Date.now(), 0),
      );
      const code = await new Promise<number | null>((done) =>
        child.on("exit", (c) => done(c)),
      );
      clearTimeout(timer);
      ending = timedOut
        ? "timed out"
        : code === 0
          ? "finished"
          : `failed (exit ${code ?? -1})`;
      const left = (deadline - Date.now()) / 60_000;
      if (
        ending !== "finished" ||
        !opts.keepGoing ||
        left < MIN_MINUTES_TO_RESUME ||
        resumes >= MAX_RESUMES
      )
        break;
      const id = sessionIdIn(readFileSync(opts.logFile, "utf8"));
      if (!id) break;
      resumes++;
      log(
        `${opts.name}: ended with ${left.toFixed(1)} min left; resuming it (${resumes})`,
      );
      args = resumeArgs(opts.args, id, opts.keepGoing(Math.floor(left)));
    }
    if (opts.session) closeSession(opts.session);
    const minutes = (Date.now() - started) / 60_000;
    log(
      `${opts.name}: ${ending} after ${minutes.toFixed(1)} min${resumes ? `, resumed ${resumes}×` : ""}`,
    );
    return { ending, minutes, resumes };
  }

  /** Stops every agent and process this runner started. */
  function cleanUp() {
    for (const session of sessions) closeSession(session);
    for (const child of children) stop(child);
  }

  /** Stops everything on Ctrl-C, then runs `main` and stops what is left. */
  function main(body: () => Promise<void>, after: () => void = () => {}) {
    for (const signal of ["SIGINT", "SIGTERM"] as const)
      process.on(signal, () => {
        log(`${signal}: stopping everything`);
        cleanUp();
        after();
        process.exit(1);
      });
    body()
      .catch((error: unknown) => {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
      })
      .finally(() => {
        cleanUp();
        after();
      });
  }

  return {
    env,
    childEnv,
    log,
    git,
    run,
    missing,
    resolveRef,
    prepareWorktree,
    startChild,
    runAgent,
    main,
  };
}
