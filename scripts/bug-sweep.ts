/**
 * The bug sweep (scripts/lib/bugSweep.ts), one run end to end:
 *
 * 1. Haiku agents test a local test-mode build of the site in a browser, in
 *    waves (scripts/lib/browserHunt.ts), the demo data reseeded before each
 *    wave. Each walks the flows of the feature map and gives each a result.
 * 2. Every finding goes into one list (findings.md). There is no scoring
 *    filter: all of them go to Opus.
 * 3. Opus checks each one and files one bug per root cause in the local bug
 *    file (reports/bugs/bugs.json) with `pnpm -s bug-tracker`; findings it
 *    judges not real go to the not-bugs ledger, which later sweeps show their
 *    agents so they aren't reported again.
 * 4. report.md sums it up (also copied to reports/bug-sweep/latest.md).
 *
 *   pnpm bug-sweep                 # everything, on HEAD
 *   pnpm bug-sweep --groups 1,4    # see scripts/lib/bugSweep.ts USAGE for every option
 *   pnpm bug-sweep --dry-run       # the plan and the first prompt; starts nothing
 *
 * The app is a git worktree at the tested commit (../yk-bug-sweep) on its own
 * local backend (scripts/lib/localApp.ts), so it never meets this checkout's
 * cloud .env. Runs: reports/bug-sweep/<run>/; the ledger:
 * reports/bug-sweep/not-bugs.jsonl (and .md); both git-ignored. BUG_SWEEP_DIR
 * moves that folder; BUG_STORE moves the bug file.
 *
 * Only the owner starts this (AGENTS.md): it runs a browser.
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { loadavg } from "node:os";
import { join, resolve } from "node:path";
import { type AgentRun, createRunner, runIdFor } from "./lib/agentRunner";
import {
  clockAfter,
  fill,
  parseArgs,
  PROJECT,
  ticketArgs,
} from "./lib/bugSweep";
import { comment, get, openBugs, status, storeFile } from "./lib/bugTracker";
import {
  flowsFor,
  type Group,
  GROUPS,
  huntArgs,
  planWaves,
} from "./lib/browserHunt";
import {
  type Flow,
  type FlowScore,
  flowScore,
  type FlowsFile,
  type GroupFlows,
  parseFeatureMap,
  parseFlowResults,
} from "./lib/featureFlows";
import {
  appendLedger,
  type Finding,
  findingsList,
  knownList,
  ledgerMarkdown,
  parseFindings,
  readLedger,
  rejectionOf,
} from "./lib/findings";
import { PORTS, startLocalApp } from "./lib/localApp";
import { FEATURE_MAP, ROOT } from "./lib/paths";
import {
  applyRechecks,
  checkFirstPart,
  parseBug,
  parseRechecks,
  type RecheckBug,
  type RecheckRow,
  type RechecksFile,
  recheckGroups,
  recheckRows,
  type RecheckTracker,
} from "./lib/recheck";
import {
  type AreaRun,
  sweepReport,
  type TicketResults,
} from "./lib/sweepReport";

const root = ROOT;
const prompts = join(root, "scripts/bug-sweep");
const worktree = resolve(root, "../yk-bug-sweep");
const sweeps = resolve(
  process.env.BUG_SWEEP_DIR ?? join(root, "reports/bug-sweep"),
);
const ledgerFile = join(sweeps, "not-bugs.jsonl");
/** The agents run in the worktree, so they get the bug file's absolute path. */
const bugFile = storeFile(root);

const options = parseArgs(process.argv.slice(2));
const runner = createRunner("bug-sweep", { BUG_STORE: bugFile });
const { log } = runner;
const ports = PORTS["bug-sweep"];
const baseUrl = `http://localhost:${ports.app}`;
const sha = runner.resolveRef(options.ref, root);
const startedAt = new Date();
const runId = runIdFor(startedAt);
const runDir = join(sweeps, runId);

let featureFlows: Flow[] | undefined;

/** The feature map's flows (parsed once, from this checkout). */
function allFlows(): Flow[] {
  featureFlows ??= parseFeatureMap(
    readFileSync(join(root, FEATURE_MAP), "utf8"),
  );
  return featureFlows;
}

/**
 * The bugs `--recheck` names, read from the bug file. A bug it can't read
 * stops a real run; a dry run keeps going with the key alone and says so.
 */
function loadRecheckBugs(): RecheckBug[] {
  return options.recheck.map((key) => {
    const found = get(bugFile, key);
    const bug = found ? parseBug(JSON.stringify({ bug: found })) : null;
    if (bug) return bug;
    const why = `no such bug in ${bugFile}`;
    if (!options.dryRun) throw new Error(`Can't read ${key}: ${why}`);
    console.log(`Warning: can't read ${key} (${why}); dry run uses its key.`);
    return { key, title: key, status: "", wrong: key, steps: key };
  });
}

const recheckPlan = recheckGroups(
  options.recheck.length ? loadRecheckBugs() : [],
  options.groups,
  allFlows(),
);

const unknown = options.groups.filter((id) => !GROUPS.some((g) => g.id === id));
if (unknown.length)
  throw new Error(
    `Unknown group ${unknown.join(", ")}: pick from ${GROUPS.map((g) => g.id).join(", ")}`,
  );

const waves = planWaves(
  options.recheck.length
    ? recheckPlan.groups
    : options.groups.length
      ? options.groups
      : GROUPS.map((g) => g.id),
  options.browserPerWave,
);

const ledger = readLedger(ledgerFile);
/** Bugs still open in the bug file, for the agents' "already known" list. */
const tickets = openBugs(bugFile);

// ---- Browser part -------------------------------------------------------

function portInUse(port: number): boolean {
  return (
    spawnSync("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"]).status === 0
  );
}

/** The flows a group walks, as the list its prompt shows. */
function flowList(flows: Flow[]): string {
  return flows.length
    ? flows.map((f) => `- \`${f.id}\`: ${f.title} (\`${f.route}\`)`).join("\n")
    : "(none: write an empty flows.md with just the header row)";
}

function browserPrompt(group: Group, deadline: string) {
  // The group briefs name the app's address too, so fill them first.
  const brief = fill(
    readFileSync(
      join(prompts, "browser/groups", `${group.slug}.md`),
      "utf8",
    ).trim(),
    { BASE_URL: baseUrl },
  );
  return fill(readFileSync(join(prompts, "browser/agent.md"), "utf8"), {
    TITLE: group.title,
    BASE_URL: baseUrl,
    MINUTES: String(options.browserMinutes),
    DEADLINE: deadline,
    FOLDER: join(runDir, "browser", group.slug),
    KNOWN: knownList(ledger, group.slug, tickets),
    FLOWS: flowList(flowsFor(group.id, allFlows())),
    RECHECKS: checkFirstPart(
      recheckPlan.assignments
        .filter((a) => a.group === group.id)
        .map((a) => a.bug),
      join(runDir, "browser", group.slug),
    ),
    BRIEF: brief,
  });
}

/** Every browser group's flows with the agent's result for each, for flows.json. */
const flowGroups: GroupFlows[] = [];

/** Reads the group's flows.md; a flow with no row is `not reached`. */
function flowResults(group: Group, dir: string): GroupFlows {
  const flows = flowsFor(group.id, allFlows());
  const file = join(dir, "flows.md");
  const rows = parseFlowResults(
    existsSync(file) ? readFileSync(file, "utf8") : "",
    flows.map((f) => f.id),
  );
  const result: GroupFlows = {
    group: group.id,
    slug: group.slug,
    title: group.title,
    score: flowScore(rows),
    flows: rows.map((row, i) => ({
      ...row,
      title: flows[i]!.title,
      route: flows[i]!.route,
    })),
  };
  flowGroups.push(result);
  return result;
}

/** What the agents wrote in rechecks.md, for the bugs they were given. */
const recheckFound: RecheckRow[] = [];

function readRechecks(group: Group, dir: string) {
  const keys = recheckPlan.assignments
    .filter((a) => a.group === group.id)
    .map((a) => a.bug.key);
  if (!keys.length) return;
  const file = join(dir, "rechecks.md");
  recheckFound.push(
    ...parseRechecks(existsSync(file) ? readFileSync(file, "utf8") : "", keys),
  );
}

/** The bug file as `applyRechecks` uses it; none with --no-tickets. */
function recheckTracker(): RecheckTracker | undefined {
  if (!options.tickets) return undefined;
  const attempt = (change: () => unknown) => {
    try {
      change();
      return true;
    } catch (error) {
      log(
        `Bug file: ${error instanceof Error ? error.message : String(error)}`,
      );
      return false;
    }
  };
  return {
    comment: (key, body) => attempt(() => comment(bugFile, key, body)),
    setStatus: (key, to) => attempt(() => status(bugFile, key, to)),
  };
}

/** Writes rechecks.json and puts the bugs that are still there back to `new`. */
function finishRechecks(): RechecksFile | undefined {
  if (!options.recheck.length) return undefined;
  const rows = recheckRows(recheckPlan.assignments, recheckFound);
  const file: RechecksFile = {
    run: runId,
    rechecks: rows,
    actions: applyRechecks(rows, runId, recheckTracker()),
  };
  writeFileSync(
    join(runDir, "rechecks.json"),
    `${JSON.stringify(file, null, 2)}\n`,
  );
  return file;
}

const found: Finding[] = [];

/** Reads the agent's findings.md into `found` and records how the agent did. */
function areaRun(
  slug: string,
  title: string,
  r: AgentRun,
  flows?: FlowScore,
): AreaRun {
  const file = join(runDir, "browser", slug, "findings.md");
  const findings = existsSync(file)
    ? parseFindings(readFileSync(file, "utf8"), {
        source: "browser",
        area: slug,
        areaTitle: title,
      })
    : [];
  found.push(...findings);
  return { slug, title, ...r, findings: findings.length, flows };
}

async function browserPart(
  app: Awaited<ReturnType<typeof startLocalApp>>,
): Promise<AreaRun[]> {
  const runs: AreaRun[] = [];
  for (const [i, wave] of waves.entries()) {
    log(
      `Browser wave ${i + 1}/${waves.length}: ${wave.map((g) => g.title).join(" + ")}.`,
    );
    // The first wave starts on the fresh seed from startLocalApp.
    if (i > 0) {
      log("Reseeding the demo data…");
      app.reseed();
    }
    // The agent wraps up a minute before it is stopped.
    const deadline = clockAfter(new Date(), options.browserMinutes - 1);
    runs.push(
      ...(await Promise.all(
        wave.map(async (group) => {
          const dir = join(runDir, "browser", group.slug);
          mkdirSync(join(dir, "screenshots"), { recursive: true });
          // The agent can only read inside its own folder: give it the map.
          copyFileSync(join(root, FEATURE_MAP), join(dir, "feature-map.md"));
          const r = await runner.runAgent({
            name: `browser/${group.slug}`,
            args: huntArgs(browserPrompt(group, deadline)),
            cwd: dir,
            minutes: options.browserMinutes,
            logFile: join(runDir, "logs", `browser-${group.slug}.jsonl`),
            session: `ykbugsweep-${group.slug}`,
            keepGoing: (left) =>
              `You stopped early: you still have ${left} minutes, until ${deadline}. Keep testing: the flows in flows.md that have no result yet, then deeper checks (wrong inputs, Arabic, 360 px). Keep adding to flows.md and findings.md in ${dir}.`,
          });
          readRechecks(group, dir);
          return areaRun(
            group.slug,
            group.title,
            r,
            flowResults(group, dir).score,
          );
        }),
      )),
    );
  }
  return runs;
}

// ---- Opus files the bugs --------------------------------------------------

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function fileTickets(count: number): Promise<TicketResults> {
  const none: TicketResults = {
    ran: false,
    filed: [],
    notBugs: [],
    duplicates: [],
    owner: "",
  };
  if (!options.tickets || count === 0) return none;
  mkdirSync(join(runDir, "bugs"), { recursive: true });
  const prompt = fill(readFileSync(join(prompts, "tickets.md"), "utf8"), {
    SHA: sha.slice(0, 12),
    RUN_DIR: runDir,
    RUN_ID: runId,
    COUNT: String(count),
    MINUTES: String(options.ticketMinutes),
    DEADLINE: clockAfter(new Date(), options.ticketMinutes - 2),
    PROJECT,
    BROWSER_NOTE: `If the code doesn't settle a browser finding, check it in the app, still running at ${baseUrl} (sign in as the test admin by opening ${baseUrl}/api/council/login; run \`agent-browser\` commands on their own). The demo data was reset before each wave and the agents changed it since, so a record they mention may be gone.`,
  });
  log(`Opus: checking ${count} findings and filing bugs…`);
  const r = await runner.runAgent({
    name: "tickets",
    args: ticketArgs(prompt, runDir),
    cwd: worktree,
    minutes: options.ticketMinutes,
    logFile: join(runDir, "logs/tickets.jsonl"),
    session: "ykbugsweep-tickets",
  });
  const owner = join(runDir, "owner.md");
  return {
    ran: true,
    ending: r.ending,
    filed: readJson(join(runDir, "filed.json"), []),
    notBugs: readJson(join(runDir, "not-bugs.json"), []),
    duplicates: readJson(join(runDir, "duplicates.json"), []),
    owner: existsSync(owner) ? readFileSync(owner, "utf8") : "",
  };
}

// ---- The run ------------------------------------------------------------

function printPlan() {
  console.log(`Bug sweep ${runId} on ${options.ref} (${sha.slice(0, 12)})`);
  console.log(`  worktree ${worktree}; runs in ${runDir}`);
  console.log(`  bug file ${bugFile}`);
  console.log(
    `  app ${baseUrl}, backend on port ${ports.convex} (local, throwaway data)`,
  );
  for (const [i, wave] of waves.entries())
    console.log(
      `  browser wave ${i + 1}: ${wave.map((g) => g.title).join(" + ")} (${options.browserMinutes} min)`,
    );
  for (const a of recheckPlan.assignments)
    console.log(
      `  recheck ${a.bug.key}: ${a.group ? `group ${a.group}` : "not checked"}${a.note ? ` (${a.note})` : ""}`,
    );
  const agents = waves.length * (options.browserMinutes + 1);
  console.log(
    `  about ${agents} min of browser agents plus the build${options.tickets ? `, then up to ${options.ticketMinutes} min of Opus` : ""}`,
  );
  console.log(`  ledger: ${ledger.length} findings judged not bugs so far`);
  console.log(`  open bugs shown to the agents: ${tickets.length}`);
}

function preflight() {
  const missing = runner.missing(["claude", "agent-browser", "pnpm", "npx"]);
  if (missing.length)
    throw new Error(
      `Not on PATH: ${missing.join(", ")} (agent-browser is the browser CLI the agents drive)`,
    );
  const busy = [ports.app, ports.convex, ports.convexSite].filter(portInUse);
  if (busy.length)
    throw new Error(
      `Ports ${busy.join(", ")} are in use: another bug sweep may be running.`,
    );
  const load = loadavg()[0]!;
  if (load > 12)
    log(
      `Warning: load average is ${load.toFixed(1)}. Browser timings will look slow.`,
    );
}

async function main() {
  printPlan();
  if (options.dryRun) {
    const g = waves[0]?.[0];
    if (g)
      console.log(
        `\n--- browser prompt: ${g.slug} ---\n\n${browserPrompt(g, clockAfter(new Date(), 15))}`,
      );
    console.log("\nDry run: nothing was started.");
    return;
  }
  preflight();
  mkdirSync(join(runDir, "logs"), { recursive: true });
  runner.prepareWorktree(root, worktree, sha);

  const app = await startLocalApp({
    runner,
    worktree,
    logDir: join(runDir, "logs"),
    ports,
    build: options.build,
  });
  const areas = await browserPart(app);

  if (flowGroups.length) {
    const flowsFile: FlowsFile = {
      run: runId,
      groups: flowGroups.sort((a, b) => a.group - b.group),
    };
    writeFileSync(
      join(runDir, "flows.json"),
      `${JSON.stringify(flowsFile, null, 2)}\n`,
    );
  }
  const rechecks = finishRechecks();
  writeFileSync(
    join(runDir, "findings.md"),
    findingsList(found, `Bug sweep ${runId}: every finding`),
  );
  writeFileSync(join(runDir, "findings.json"), JSON.stringify(found, null, 2));
  log(`${found.length} findings. No scoring filter: all go to Opus.`);

  const results = await fileTickets(found.length);
  const byId = new Map(found.map((f) => [f.id, f]));
  appendLedger(
    ledgerFile,
    results.notBugs.flatMap((n) => {
      const f = byId.get(n.id);
      return f ? [rejectionOf(f, runId, n.reason)] : [];
    }),
  );
  writeFileSync(
    join(sweeps, "not-bugs.md"),
    ledgerMarkdown(readLedger(ledgerFile)),
  );

  const report = join(runDir, "report.md");
  writeFileSync(
    report,
    sweepReport({
      runId,
      ref: options.ref,
      sha,
      startedAt: startedAt.toString(),
      areas,
      findingIds: found.map((f) => f.id),
      tickets: results,
      rechecks,
    }),
  );
  copyFileSync(report, join(sweeps, "latest.md"));
  log(`Done: ${report}`);
}

// The backend binary can outlive the script that started it.
runner.main(main, () => {
  spawnSync("pkill", ["-f", join(worktree, ".convex")]);
});
