/**
 * The design council (scripts/lib/designCouncil.ts), one round:
 *
 * 1. Snapshot the working tree (committed or not) into a commit of its own,
 *    without touching the branch or the index, and check it out in a
 *    worktree (../yalla-kafala-design-council), so a dev server and its
 *    .next in this checkout are never disturbed. This checkout's .env and
 *    .env.local are copied there: the build needs the site's keys.
 * 2. Build the site there (`next build`) and serve it (`next start`), or,
 *    with --url, use a deployed site instead (production or a Vercel
 *    preview). Photograph every page in scripts/design-council/screens.ts
 *    with Playwright (as a library: no tests).
 * 3. Every reviewer (Claude models, and Codex when installed) scores the
 *    screenshots beside the reference sites in design/references/, in a
 *    session of its own, with no idea of the target or earlier rounds.
 * 4. The round's folder gets each review, scores.md and feedback.md; the
 *    run's README.md the history. The last line says whether it passed.
 *
 *   pnpm design-council                                       # build this checkout, the next round
 *   pnpm design-council --url https://www.yallakafala.org     # photograph production instead
 *   pnpm design-council --review-only                         # score this round's screenshots again
 *
 * The loop around it (fix, build, commit, next round) is the agent's:
 * .claude/skills/design-council/SKILL.md. Runs: reports/design-council/<name>/
 * (git-ignored). Documented in docs/design-council.md.
 */
import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { SCREENS, SITE, STORAGE } from "./design-council/screens.ts";
import {
  CATEGORIES,
  claudeAnswer,
  claudeArgs,
  codexArgs,
  feedbackMarkdown,
  historyTable,
  nextRound,
  parseArgs,
  parseReview,
  pickScreens,
  roundFolder,
  roundRecord,
  scoresTable,
  shotPath,
  shotsFor,
  slug,
  verdict,
} from "./lib/designCouncil.ts";
import type {
  Review,
  Reviewer,
  RoundRecord,
  Shot,
} from "./lib/designCouncil.ts";

const root = resolve(import.meta.dirname, "..");
const prompts = join(root, "scripts/design-council");
const references = join(root, "design/references");
const worktree = resolve(root, "../yalla-kafala-design-council");

let options: ReturnType<typeof parseArgs>;
try {
  options = parseArgs(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
const baseUrl = options.url || `http://localhost:${options.port}`;

// ---- Processes ----------------------------------------------------------

const children = new Set<ChildProcess>();

/** A clean environment: a stray NODE_ENV or PORT breaks a build or moves the server. */
function childEnv(extra: Record<string, string> = {}): NodeJS.ProcessEnv {
  const env: Record<string, string | undefined> = { ...process.env, ...extra };
  delete env.NODE_ENV;
  delete env.PORT;
  return env as NodeJS.ProcessEnv;
}

function log(message: string) {
  console.log(
    `[design-council ${new Date().toISOString().slice(11, 19)}Z] ${message}`,
  );
}

function git(args: string[], extra: Record<string, string> = {}): string {
  const r = spawnSync("git", args, {
    cwd: root,
    env: childEnv(extra),
    encoding: "utf8",
  });
  if (r.status !== 0) throw new Error(`git ${args[0]}: ${r.stderr}`);
  return r.stdout.trim();
}

function run(cmd: string, args: string[], cwd: string) {
  log(`$ ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", env: childEnv() });
  if (r.status !== 0) throw new Error(`${cmd} ${args[0]} failed`);
}

function installed(cmd: string): boolean {
  return spawnSync("which", [cmd], { env: childEnv() }).status === 0;
}

function startChild(
  cmd: string,
  args: string[],
  cwd: string,
  logFile: string,
): ChildProcess {
  const out = openSync(logFile, "a");
  const child = spawn(cmd, args, {
    cwd,
    env: childEnv(),
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
}

/** Runs `cmd` until it exits or `minutes` pass; its exit code, or null when stopped. */
async function runFor(
  cmd: string,
  args: string[],
  cwd: string,
  logFile: string,
  minutes: number,
) {
  const child = startChild(cmd, args, cwd, logFile);
  const timer = setTimeout(() => {
    log(`${cmd}: time is up, stopping it`);
    stop(child);
  }, minutes * 60_000);
  const code = await new Promise<number | null>((done) =>
    child.on("exit", (c) => done(c)),
  );
  clearTimeout(timer);
  return code;
}

async function waitFor(
  what: string,
  ready: () => Promise<boolean>,
  seconds: number,
) {
  for (let i = 0; i < seconds; i++) {
    if (await ready()) return;
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Timed out waiting for ${what}`);
}

// ---- The round ----------------------------------------------------------

const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
const runDir = join(
  root,
  "reports/design-council",
  options.name || slug(branch === "HEAD" ? "detached" : branch),
);
mkdirSync(runDir, { recursive: true });
const existing = readdirSync(runDir);
const round =
  options.round ||
  (options.reviewOnly ? nextRound(existing) - 1 : nextRound(existing));
const roundDir = join(runDir, roundFolder(round));
const screensDir = join(roundDir, "screens");
const historyFile = join(runDir, "history.json");

/** The working tree as a commit, the branch and the index untouched. */
function snapshot(): string {
  const index = { GIT_INDEX_FILE: join(runDir, ".snapshot-index") };
  try {
    git(["read-tree", "HEAD"], index);
    git(["add", "-A"], index);
    const tree = git(["write-tree"], index);
    return git(
      [
        "commit-tree",
        tree,
        "-p",
        "HEAD",
        "-m",
        `design council round ${round} snapshot`,
      ],
      index,
    );
  } finally {
    rmSync(index.GIT_INDEX_FILE, { force: true });
  }
}

/** A worktree at `sha`, created or moved there. */
function prepareWorktree(sha: string) {
  if (!existsSync(worktree))
    run("git", ["worktree", "add", "--detach", worktree, sha], root);
  else run("git", ["checkout", "--force", "--detach", sha], worktree);
}

/** The production build, served on the port, with this checkout's keys. */
async function startSite() {
  const envFiles = [".env", ".env.local"].filter((f) =>
    existsSync(join(root, f)),
  );
  if (!envFiles.length)
    throw new Error(
      "No .env or .env.local in this checkout: the build needs the site's keys. Add them, or photograph a deployment with --url.",
    );
  for (const f of envFiles) copyFileSync(join(root, f), join(worktree, f));
  run("pnpm", ["install", "--frozen-lockfile", "--prefer-offline"], worktree);
  run("pnpm", ["build"], worktree);
  const site = startChild(
    join(worktree, "node_modules/.bin/next"),
    ["start", "-p", String(options.port)],
    worktree,
    join(roundDir, "logs/site.log"),
  );
  await waitFor(
    "the site",
    async () => {
      if (site.exitCode !== null)
        throw new Error("next start exited: see logs/site.log");
      try {
        return (await fetch(`${baseUrl}/en`)).ok;
      } catch {
        return false;
      }
    },
    60,
  );
  log(`Site at ${baseUrl}`);
}

/** Phones at 2× so small text stays legible to the reviewers. */
const scaleFor = (width: number) => (width < 768 ? 2 : 1);
/** A page taller than this is cut: the reviewers judge the first few screens. */
const MAX_HEIGHT = 3000;

/** Every page, scrolled through so lazy images and reveals load, then photographed whole. */
async function capture(
  shots: Shot[],
): Promise<{ shots: Shot[]; failures: string[] }> {
  const { chromium } = await import("playwright");
  // CHROMIUM_PATH: a Chromium already on the machine, when Playwright's own
  // (`pnpm exec playwright install chromium`) isn't.
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : {},
  );
  const taken: Shot[] = [];
  const failures: string[] = [];
  for (const shot of shots) {
    const height = shot.width < 768 ? 844 : 900;
    const context = await browser.newContext({
      viewport: { width: shot.width, height },
      deviceScaleFactor: scaleFor(shot.width),
      locale: shot.locale === "ar" ? "ar-EG" : "en-US",
      colorScheme: "light",
    });
    await context.addInitScript((storage: Record<string, string>) => {
      try {
        for (const [key, value] of Object.entries(storage))
          localStorage.setItem(key, value);
      } catch {}
    }, STORAGE);
    // A signed-out, returning visitor as far as Clerk is concerned. Without
    // these, Clerk's development instance answers a browser's first request
    // with a handshake redirect, which a local build without Clerk's secret
    // key can't complete (it serves a 500 instead of the page).
    if (baseUrl.startsWith("http://localhost"))
      await context.addCookies(
        ["__clerk_db_jwt", "__client_uat"].map((name) => ({
          name,
          value: name === "__client_uat" ? "0" : "dvb_design_council",
          url: baseUrl,
        })),
      );
    const page = await context.newPage();
    try {
      await page.goto(`${baseUrl}${shotPath(shot)}`, {
        waitUntil: "networkidle",
        timeout: 90_000,
      });
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      const full = await page.evaluate(async (max) => {
        // Walk down a screen at a time, so lazy images and reveals load.
        const end = Math.min(document.documentElement.scrollHeight, max);
        for (let y = 0; y < end; y += window.innerHeight * 0.8) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 300));
        }
        window.scrollTo(0, 0);
        return document.documentElement.scrollHeight;
      }, MAX_HEIGHT);
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(800);
      await page.screenshot({
        path: join(screensDir, shot.file),
        fullPage: true,
        clip: {
          x: 0,
          y: 0,
          width: shot.width,
          height: Math.min(full, MAX_HEIGHT),
        },
      });
      taken.push(shot);
      log(`  ${shot.file} ← ${shotPath(shot)}`);
    } catch (error) {
      failures.push(`${shot.file}: ${String(error)}`);
    } finally {
      await context.close();
    }
  }
  await browser.close();
  return { shots: taken, failures };
}

const IMAGE = /\.(png|jpe?g|webp)$/i;

/** design/references/<site>/*.png copied into the round, by site. */
function copyReferences(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  if (!existsSync(references)) return out;
  for (const site of readdirSync(references, { withFileTypes: true })) {
    if (!site.isDirectory()) continue;
    const files = readdirSync(join(references, site.name)).filter((f) =>
      IMAGE.test(f),
    );
    if (!files.length) continue;
    const name = slug(site.name);
    mkdirSync(join(roundDir, "references", name), { recursive: true });
    for (const f of files)
      copyFileSync(
        join(references, site.name, f),
        join(roundDir, "references", name, f),
      );
    out[name] = files.map((f) => `references/${name}/${f}`);
  }
  return out;
}

/** Fills `{{name}}` placeholders; a placeholder with no value is an error. */
function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    const value = values[name];
    if (value === undefined) throw new Error(`No value for {{${name}}}`);
    return value;
  });
}

function reviewerPrompt(shots: Shot[], refs: Record<string, string[]>) {
  const zero = Object.fromEntries(CATEGORIES.map((c) => [c.key, 0]));
  return fill(readFileSync(join(prompts, "reviewer.md"), "utf8"), {
    SITE,
    SHOTS: shots
      .map(
        (s) =>
          `- \`screens/${s.file}\`: ${s.screen.title}, ${s.width} px wide${s.width < 768 ? " (a phone)" : ""}, ${s.locale === "ar" ? "Arabic" : "English"}`,
      )
      .join("\n"),
    REFERENCES: Object.keys(refs).length
      ? Object.entries(refs)
          .map(
            ([site, files]) =>
              `- ${site}: ${files.map((f) => `\`${f}\``).join(", ")}`,
          )
          .join("\n")
      : "None this time: score ours against the best non-profit and family-services sites you know.",
    CATEGORIES: CATEGORIES.map((c) => `- \`${c.key}\`: ${c.title}`).join("\n"),
    SCORES: JSON.stringify(zero),
    REFERENCE_SCORES: JSON.stringify(
      Object.fromEntries(Object.keys(refs).map((site) => [site, zero])),
    ),
    KEYS: CATEGORIES.map((c) => `\`${c.key}\``).join(", "),
  });
}

/** One reviewer's answer text, or null when it gave none in time. */
async function ask(
  reviewer: Reviewer,
  prompt: string,
  images: string[],
): Promise<string | null> {
  const logFile = join(roundDir, "logs", `${reviewer.name}.log`);
  rmSync(logFile, { force: true });
  if (reviewer.kind === "claude") {
    const code = await runFor(
      "claude",
      claudeArgs(prompt, reviewer.model),
      roundDir,
      logFile,
      options.minutes,
    );
    log(`${reviewer.name}: exit ${code}`);
    return code === 0 ? claudeAnswer(readFileSync(logFile, "utf8")) : null;
  }
  const answerFile = join(roundDir, "logs", `${reviewer.name}.answer.md`);
  rmSync(answerFile, { force: true });
  const code = await runFor(
    "codex",
    codexArgs(prompt, images, answerFile, reviewer.model),
    roundDir,
    logFile,
    options.minutes,
  );
  log(`${reviewer.name}: exit ${code}`);
  return existsSync(answerFile) ? readFileSync(answerFile, "utf8") : null;
}

async function main() {
  if (round < 1) throw new Error("No round to review yet: run one first");
  mkdirSync(join(roundDir, "logs"), { recursive: true });
  log(`Round ${round} in ${roundDir}`);
  let commit = git(["rev-parse", "HEAD"]);

  if (!options.reviewOnly) {
    rmSync(screensDir, { recursive: true, force: true });
    mkdirSync(screensDir, { recursive: true });
    if (options.url) {
      // A deployment: what it runs isn't this checkout, so say so.
      commit = `deployed:${options.url}`;
      log(`Photographing ${options.url} (not this checkout)`);
    } else {
      commit = snapshot();
      prepareWorktree(commit);
      await startSite();
    }
    log("Taking the screenshots…");
    const { shots, failures } = await capture(
      shotsFor(pickScreens(SCREENS, options.screens)),
    );
    writeFileSync(
      join(roundDir, "manifest.json"),
      JSON.stringify({ commit, shots, failures }, null, 2),
    );
    for (const f of failures) log(`not captured: ${f}`);
    if (!shots.length) throw new Error("No screenshots: see the logs folder");
    if (options.captureOnly) {
      log(`Captured ${shots.length} screenshots in ${screensDir}`);
      return;
    }
  }

  const manifest = JSON.parse(
    readFileSync(join(roundDir, "manifest.json"), "utf8"),
  ) as {
    commit: string;
    shots: Shot[];
  };
  commit = manifest.commit;
  const refs = copyReferences();
  if (!Object.keys(refs).length)
    log(
      "No reference sites in design/references/: reviewers judging one site alone score it too high (see design/references/README.md).",
    );
  const prompt = reviewerPrompt(manifest.shots, refs);
  writeFileSync(join(roundDir, "prompt.md"), prompt);
  const images = [
    ...manifest.shots.map((s) => join(screensDir, s.file)),
    ...Object.values(refs)
      .flat()
      .map((f) => join(roundDir, f)),
  ];

  let reviewers = options.reviewers;
  if (reviewers.some((r) => r.kind === "codex") && !installed("codex")) {
    log("codex isn't installed: skipping it (npm i -g @openai/codex).");
    reviewers = reviewers.filter((r) => r.kind !== "codex");
  }
  if (!reviewers.length) throw new Error("No reviewers to ask");

  log(`Asking ${reviewers.map((r) => r.name).join(", ")}…`);
  const reviews: Review[] = [];
  const failed: string[] = [];
  await Promise.all(
    reviewers.map(async (reviewer) => {
      try {
        const answer = await ask(reviewer, prompt, images);
        if (answer === null) throw new Error("no answer in time");
        writeFileSync(join(roundDir, `${reviewer.name}.md`), answer);
        const review = parseReview(reviewer.name, answer, Object.keys(refs));
        writeFileSync(
          join(roundDir, `${reviewer.name}.json`),
          JSON.stringify(review, null, 2),
        );
        reviews.push(review);
      } catch (error) {
        log(
          `${reviewer.name}: ${error instanceof Error ? error.message : error}`,
        );
        failed.push(reviewer.name);
      }
    }),
  );
  reviews.sort((a, b) => a.reviewer.localeCompare(b.reviewer));

  const { passed, gaps } = verdict(reviews, options.target, failed);
  writeFileSync(join(roundDir, "scores.md"), `${scoresTable(reviews)}\n`);
  writeFileSync(
    join(roundDir, "feedback.md"),
    feedbackMarkdown(reviews, gaps, failed),
  );
  const history: RoundRecord[] = existsSync(historyFile)
    ? (JSON.parse(readFileSync(historyFile, "utf8")) as RoundRecord[])
    : [];
  const record = roundRecord(round, commit, new Date(), reviews, passed);
  const next = [...history.filter((h) => h.round !== round), record].sort(
    (a, b) => a.round - b.round,
  );
  writeFileSync(historyFile, JSON.stringify(next, null, 2));
  writeFileSync(
    join(runDir, "README.md"),
    `# Design council: ${branch}\n\nTarget ${options.target} in every category, and at least every reference site's score.\n\n${historyTable(next)}\n\nLatest: ${roundFolder(round)}/feedback.md\n`,
  );
  console.log(`\n${scoresTable(reviews)}\n`);
  console.log(
    passed
      ? `PASSED round ${round}: every reviewer gave every category ${options.target} or more.`
      : `NOT YET round ${round}: ${gaps.length} gaps${failed.length ? `, ${failed.join(", ")} gave no answer` : ""}. Read ${join(roundDir, "feedback.md")}`,
  );
}

for (const signal of ["SIGINT", "SIGTERM"] as const)
  process.on(signal, () => {
    for (const child of children) stop(child);
    process.exit(1);
  });

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => {
    for (const child of children) stop(child);
  });
