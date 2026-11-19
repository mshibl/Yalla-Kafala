/**
 * The design council (scripts/lib/designCouncil.ts), one round:
 *
 * 1. Snapshot the working tree (committed or not) into a commit of its own,
 *    without touching the branch or the index, and check it out in a
 *    worktree (../yk-design-council), so the local backend never meets this
 *    checkout's cloud .env.local. The snapshot must hold the councils'
 *    scripts: run it from a checkout that has them.
 * 2. Start a throwaway local Convex backend with invented demo rows and a
 *    production build in council test mode there (scripts/lib/localApp.ts;
 *    app on 3600, Convex on 3610), and photograph every screen
 *    (scripts/design-council/screens.ts), the admin ones through the
 *    test-only login (scripts/lib/designCapture.ts).
 * 3. Every reviewer (Claude models, and Codex when installed) answers the
 *    yes/no checklist (design-council/checklist.ts) for the screenshots and
 *    for the reference apps in design/references/, in a
 *    session of its own, with no idea of the target or earlier rounds' scores.
 *    From round 2 each also gets the run's open issues (issues.json) and says
 *    whether each is fixed, still there or worse.
 * 4. From round 2, each shot whose picture changed is put beside the last
 *    round's, unlabelled and in random order (compare/<shot>-A.png and -B.png,
 *    the key in compare/key.json), and every reviewer says in a call of its
 *    own which it would ship. compare.md of the round has the result.
 * 5. One Sonnet call joins the reviewers' duplicate new issues; the ledger
 *    (issues.json: the round's folder, and the run's folder for the latest)
 *    is updated. The round's folder gets each review, scores.md and
 *    feedback.md; the run's folder the README.md (rules and history) and
 *    proposals.md (the open structural issues, for the owner).
 * 6. The verdict is DONE or CONTINUE with a reason for each rule not met
 *    (`verdict`), and a STALLED line when the last two rounds closed no issue
 *    and made no picture better (`stalled`).
 *
 *   pnpm design-council                     # the next round
 *   pnpm design-council --target 95         # overall share of passing checks, percent (default 90)
 *   pnpm design-council --review-only       # answer this round's screenshots again
 *   pnpm design-council --dry-run           # print the reviewers' prompt, run nothing
 *
 * The loop around it (fix, check, commit, next round) is the agent's:
 * .claude/skills/design-council/SKILL.md. Runs: reports/design-council/<name>/
 * (git-ignored). It drives a browser: run it only when the owner asks.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { APP, LOOKUPS, SCREENS, STORAGE } from "./design-council/screens";
import { createRunner } from "./lib/agentRunner";
import { capture } from "./lib/designCapture";
import {
  assignSides,
  changedShots,
  CLAUDE_MODELS,
  claudeAnswer,
  claudeArgs,
  codexArgs,
  compareFile,
  compareMarkdown,
  comparePrompt,
  comparison,
  feedbackMarkdown,
  gaps,
  type Ledger,
  mergePrompt,
  newIssuesOf,
  nextRound,
  parseArgs,
  parseComparison,
  parseGroups,
  parseReview,
  pickScreens,
  proposals,
  proposalsMarkdown,
  readmeMarkdown,
  type Review,
  type Reviewer,
  reviewerPrompt,
  roundFolder,
  type RoundRecord,
  roundRecord,
  scoresTable,
  type Shot,
  shotsFor,
  slug,
  stalled,
  updateLedger,
  verdict,
  type Vote,
} from "./lib/designCouncil";
import { PORTS, startLocalApp } from "./lib/localApp";

const root = resolve(import.meta.dirname, "..");
const prompts = join(root, "scripts/design-council");
const references = join(root, "design/references");
const worktree = resolve(root, "../yk-design-council");
const IMAGE = /\.(png|jpe?g|webp)$/i;

/**
 * The issues carried into `round`: the ledger the highest earlier round of
 * the run left (`round-NN/issues.json`), or none. Reading the round before,
 * not the run's latest ledger, makes running a round again start from the
 * same place.
 */
function earlierLedger(dir: string, round: number): Ledger {
  if (!existsSync(dir)) return [];
  const rounds = readdirSync(dir)
    .map((f) => /^round-(\d+)$/.exec(f)?.[1])
    .filter((n): n is string => n !== undefined)
    .map(Number)
    .filter((n) => n < round)
    .sort((a, b) => b - a);
  for (const n of rounds) {
    const file = join(dir, roundFolder(n), "issues.json");
    if (existsSync(file))
      return JSON.parse(readFileSync(file, "utf8")) as Ledger;
  }
  return [];
}

/** Each PNG in `dir`: its name without `.png` → a hash of its bytes. */
function hashShots(dir: string): Record<string, string> {
  return Object.fromEntries(
    readdirSync(dir)
      .filter((f) => f.endsWith(".png"))
      .sort()
      .map((f) => [
        f.slice(0, -4),
        createHash("sha256")
          .update(readFileSync(join(dir, f)))
          .digest("hex"),
      ]),
  );
}

/** The screenshots folder of the highest earlier round that has one, or null. */
function previousScreens(dir: string, round: number): string | null {
  if (!existsSync(dir)) return null;
  const rounds = readdirSync(dir)
    .map((f) => /^round-(\d+)$/.exec(f)?.[1])
    .filter((n): n is string => n !== undefined)
    .map(Number)
    .filter((n) => n < round)
    .sort((a, b) => b - a);
  for (const n of rounds) {
    const screens = join(dir, roundFolder(n), "screens");
    if (existsSync(screens)) return screens;
  }
  return null;
}

const options = parseArgs(process.argv.slice(2));
if (options.dryRun) {
  // The prompt as the reviewers would get it: no app, no browser, no run
  // folder. The shots are the screens' file names; nothing is photographed.
  // With --name of a run that has issues, it is the prompt of its next round.
  const dir = join(root, "reports/design-council", options.name);
  const next =
    options.round || nextRound(existsSync(dir) ? readdirSync(dir) : []);
  console.log(
    reviewerPrompt(
      template(),
      APP,
      shotsFor(pickScreens(SCREENS, options.screens)),
      referencePaths(),
      options.name ? earlierLedger(dir, next) : [],
    ),
  );
  process.exit(0);
}
const runner = createRunner("design-council");
const { log } = runner;

const branch = runner.git(["rev-parse", "--abbrev-ref", "HEAD"], root);
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
if (round < 1) throw new Error("No round to review yet: run one first");
const roundDir = join(runDir, roundFolder(round));
const screensDir = join(roundDir, "screens");
const historyFile = join(runDir, "history.json");

/** The working tree as a commit, the branch and the index untouched. */
function snapshot(): string {
  const index = join(runDir, ".snapshot-index");
  const tmp = runner.childEnv({ GIT_INDEX_FILE: index });
  const git = (args: string[]) => {
    const r = spawnSync("git", args, { cwd: root, env: tmp, encoding: "utf8" });
    if (r.status !== 0) throw new Error(`git ${args[0]}: ${r.stderr}`);
    return r.stdout.trim();
  };
  try {
    git(["read-tree", "HEAD"]);
    git(["add", "-A"]);
    const tree = git(["write-tree"]);
    return git([
      "commit-tree",
      tree,
      "-p",
      "HEAD",
      "-m",
      `design council round ${round} snapshot`,
    ]);
  } finally {
    rmSync(index, { force: true });
  }
}

/** Stops early, with a plain message, when a tool or a port isn't ready. */
function preflight() {
  const missing = runner.missing(["claude", "pnpm", "npx"]);
  if (missing.length)
    throw new Error(`Not installed or not on PATH: ${missing.join(", ")}`);
  for (const port of Object.values(PORTS["design-council"])) {
    if (
      spawnSync("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"]).status === 0
    )
      throw new Error(
        `Port ${port} is in use: another design council run, or something else. Stop it first.`,
      );
  }
  // The browser is the owner's one-time install; a missing one fails late and
  // confusingly, so name the command here.
  const browser = spawnSync(
    "node",
    [
      "-e",
      "const {chromium}=require('playwright');process.exit(require('fs').existsSync(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||chromium.executablePath())?0:1)",
    ],
    { cwd: root },
  );
  if (browser.status !== 0)
    throw new Error(
      "No Chromium for Playwright: run `pnpm exec playwright install chromium` once, or set PLAYWRIGHT_CHROMIUM_EXECUTABLE.",
    );
}

/** design/references/<app>/ images, by app folder name (as `slug`). */
function listReferences(): Record<string, { dir: string; files: string[] }> {
  const out: Record<string, { dir: string; files: string[] }> = {};
  if (!existsSync(references)) return out;
  for (const app of readdirSync(references, { withFileTypes: true })) {
    if (!app.isDirectory()) continue;
    const files = readdirSync(join(references, app.name)).filter((f) =>
      IMAGE.test(f),
    );
    if (files.length) out[slug(app.name)] = { dir: app.name, files };
  }
  return out;
}

/** The reference images as the round's folder holds them, by app. */
function referencePaths(): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(listReferences()).map(([name, { files }]) => [
      name,
      files.map((f) => `references/${name}/${f}`),
    ]),
  );
}

/** design/references/<app>/*.png copied into the round, by app. */
function copyReferences(): Record<string, string[]> {
  for (const [name, { dir, files }] of Object.entries(listReferences())) {
    mkdirSync(join(roundDir, "references", name), { recursive: true });
    for (const f of files)
      copyFileSync(
        join(references, dir, f),
        join(roundDir, "references", name, f),
      );
  }
  return referencePaths();
}

function template(): string {
  return readFileSync(join(prompts, "reviewer.md"), "utf8");
}

/** One reviewer's answer text, or null when it gave none in time. */
async function ask(
  reviewer: Reviewer,
  prompt: string,
  images: string[],
  /** Keeps a second call to the same reviewer from overwriting its logs. */
  tag = "",
): Promise<string | null> {
  const logFile = join(roundDir, "logs", `${reviewer.name}${tag}.log`);
  rmSync(logFile, { force: true });
  if (reviewer.kind === "claude") {
    const r = await runner.runAgent({
      name: reviewer.name,
      args: claudeArgs(prompt, reviewer.model),
      cwd: roundDir,
      minutes: options.minutes,
      logFile,
    });
    if (r.ending !== "finished") return null;
    return claudeAnswer(readFileSync(logFile, "utf8"));
  }
  const answerFile = join(roundDir, "logs", `${reviewer.name}${tag}.answer.md`);
  rmSync(answerFile, { force: true });
  const child = runner.startChild(
    "codex",
    codexArgs(prompt, images, answerFile, reviewer.model),
    roundDir,
    logFile,
  );
  const timer = setTimeout(
    () => child.kill("SIGTERM"),
    options.minutes * 60_000,
  );
  const code = await new Promise<number | null>((done) =>
    child.on("exit", (c) => done(c)),
  );
  clearTimeout(timer);
  log(`${reviewer.name}: exit ${code}`);
  return existsSync(answerFile) ? readFileSync(answerFile, "utf8") : null;
}

/**
 * Which new issues of the reviewers are the same: one Sonnet call, the same
 * runner as the reviewers. Any failure leaves every issue on its own.
 */
async function mergeGroups(reviews: Review[]): Promise<number[][]> {
  const issues = newIssuesOf(reviews);
  if (issues.length < 2) return [];
  try {
    const answer = await ask(
      { name: "merge", kind: "claude", model: CLAUDE_MODELS.sonnet! },
      mergePrompt(issues),
      [],
    );
    if (answer === null) throw new Error("no answer in time");
    return parseGroups(answer);
  } catch (error) {
    log(
      `merge: ${error instanceof Error ? error.message : error}; every issue stays on its own`,
    );
    return [];
  }
}

/**
 * From round 2: each shot whose picture changed since the last round goes into
 * `compare/` beside the last round's, as `<shot>-A.png` and `<shot>-B.png`
 * (a coin flip per shot decides which is which), and every reviewer says,
 * in a call of its own, which it would ship. The key (which side is the new
 * picture) is written after they answered, so no reviewer can read it.
 * Round 1 has nothing to compare: no folder, no calls, null. With no changed
 * shot there are no calls either.
 */
async function compareWithLast(reviewers: Reviewer[]) {
  const previous = previousScreens(runDir, round);
  const compareDir = join(roundDir, "compare");
  rmSync(compareDir, { recursive: true, force: true });
  if (!previous) return null;
  const key = assignSides(
    changedShots(hashShots(previous), hashShots(screensDir)),
    Math.random,
  );
  const shots = Object.keys(key);
  const answers: Record<string, Record<string, Vote>> = {};
  if (shots.length) {
    mkdirSync(compareDir, { recursive: true });
    for (const [shot, { A, B }] of Object.entries(key)) {
      copyFileSync(
        join(A === "new" ? screensDir : previous, `${shot}.png`),
        join(roundDir, compareFile(shot, "A")),
      );
      copyFileSync(
        join(B === "new" ? screensDir : previous, `${shot}.png`),
        join(roundDir, compareFile(shot, "B")),
      );
    }
    const prompt = comparePrompt(
      readFileSync(join(prompts, "compare.md"), "utf8"),
      APP,
      shots,
    );
    writeFileSync(join(roundDir, "compare-prompt.md"), prompt);
    const images = shots.flatMap((shot) =>
      (["A", "B"] as const).map((side) =>
        join(roundDir, compareFile(shot, side)),
      ),
    );
    log(`Comparing ${shots.length} changed shots with the last round…`);
    await Promise.all(
      reviewers.map(async (reviewer) => {
        try {
          const answer = await ask(reviewer, prompt, images, "-compare");
          if (answer === null) throw new Error("no answer in time");
          writeFileSync(join(roundDir, `${reviewer.name}-compare.md`), answer);
          answers[reviewer.name] = parseComparison(
            reviewer.name,
            answer,
            shots,
          );
        } catch (error) {
          log(
            `${reviewer.name} (comparison): ${error instanceof Error ? error.message : error}`,
          );
        }
      }),
    );
    writeFileSync(join(compareDir, "key.json"), JSON.stringify(key, null, 2));
  }
  return { key, answers, result: comparison(key, answers) };
}

async function main() {
  mkdirSync(join(roundDir, "logs"), { recursive: true });
  log(`Round ${round} in ${roundDir}`);
  let commit = runner.git(["rev-parse", "HEAD"], root);

  if (!options.reviewOnly) {
    preflight();
    commit = snapshot();
    runner.prepareWorktree(root, worktree, commit);
    rmSync(screensDir, { recursive: true, force: true });
    mkdirSync(screensDir, { recursive: true });
    const app = await startLocalApp({
      runner,
      worktree,
      logDir: join(roundDir, "logs"),
      ports: PORTS["design-council"],
    });
    log("Taking the screenshots…");
    const { shots, failures } = await capture({
      baseUrl: app.baseUrl,
      screens: pickScreens(SCREENS, options.screens),
      lookups: LOOKUPS,
      outDir: screensDir,
      storage: STORAGE,
      log,
    });
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
  ) as { commit: string; shots: Shot[] };
  commit = manifest.commit;
  const refs = copyReferences();
  if (!Object.keys(refs).length)
    log(
      "No reference apps in design/references/: reviewers judging one app alone answer too kindly (see design/references/README.md).",
    );
  const earlier = earlierLedger(runDir, round);
  const prompt = reviewerPrompt(template(), APP, manifest.shots, refs, earlier);
  writeFileSync(join(roundDir, "prompt.md"), prompt);
  const images = [
    ...manifest.shots.map((s) => join(roundDir, "screens", s.file)),
    ...Object.values(refs)
      .flat()
      .map((f) => join(roundDir, f)),
  ];

  let reviewers = options.reviewers;
  const skipped = reviewers.filter(
    (r) => r.kind === "codex" && runner.missing(["codex"]).length,
  );
  if (skipped.length) {
    log("codex isn't installed: skipping it (npm i -g @openai/codex).");
    reviewers = reviewers.filter((r) => !skipped.includes(r));
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
        const review = parseReview(
          reviewer.name,
          answer,
          Object.keys(refs),
          earlier.map((i) => i.id),
        );
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

  const compared = await compareWithLast(
    reviewers.filter((r) => reviews.some((x) => x.reviewer === r.name)),
  );
  if (compared)
    writeFileSync(
      join(roundDir, "compare.md"),
      compareMarkdown(compared.key, compared.result, compared.answers),
    );
  const ledger = updateLedger(
    earlier,
    round,
    reviews,
    await mergeGroups(reviews),
  );
  const { state, reasons } = verdict({
    reviews,
    ledger,
    comparison: compared?.result ?? null,
    target: options.target,
    failed,
  });
  writeFileSync(join(roundDir, "issues.json"), JSON.stringify(ledger, null, 2));
  writeFileSync(join(runDir, "issues.json"), JSON.stringify(ledger, null, 2));
  writeFileSync(
    join(runDir, "proposals.md"),
    proposalsMarkdown(ledger, reviews.length),
  );
  writeFileSync(join(roundDir, "scores.md"), `${scoresTable(reviews)}\n`);
  writeFileSync(
    join(roundDir, "feedback.md"),
    feedbackMarkdown(
      reviews,
      gaps(reviews, options.target),
      failed,
      ledger,
      compared?.result ?? null,
    ),
  );
  const history: RoundRecord[] = existsSync(historyFile)
    ? (JSON.parse(readFileSync(historyFile, "utf8")) as RoundRecord[])
    : [];
  const record = roundRecord({
    round,
    commit,
    at: new Date(),
    reviews,
    ledger,
    state,
    comparison: compared?.result ?? null,
  });
  const next = [...history.filter((h) => h.round !== round), record].sort(
    (a, b) => a.round - b.round,
  );
  writeFileSync(historyFile, JSON.stringify(next, null, 2));
  const stuck = stalled(next, ledger);
  writeFileSync(
    join(runDir, "README.md"),
    readmeMarkdown({
      branch,
      target: options.target,
      history: next,
      round,
      reasons,
      stalled: stuck,
      proposals: proposals(ledger).length,
    }),
  );
  console.log(`\n${scoresTable(reviews)}\n`);
  console.log(
    state === "done"
      ? `DONE round ${round}: ${options.target}% overall from every reviewer, no confirmed high issue open, no reference app far ahead, and the pictures no longer getting better.`
      : `CONTINUE round ${round}:\n${reasons.map((r) => `- ${r}`).join("\n")}\nRead ${join(roundDir, "feedback.md")}`,
  );
  if (stuck)
    console.log(
      "STALLED: the last two rounds closed no issue and made no picture better. Stop and report what is holding it back.",
    );
  const open = proposals(ledger).length;
  if (open)
    console.log(
      `${open} proposals for the owner in ${join(runDir, "proposals.md")}`,
    );
}

// The backend binary can outlive the script that started it.
runner.main(main, () => {
  spawnSync("pkill", ["-f", join(worktree, ".convex")]);
});
