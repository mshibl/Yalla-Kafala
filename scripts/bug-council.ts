/**
 * The bug council's score: reads one finished bug sweep and the local bug file
 * (reports/bugs/bugs.json), adds a round to
 * reports/bug-council/<name>/history.json and writes its README.md. It starts
 * no browser and no agent.
 *
 *   pnpm bug-council score                 # the latest finished sweep
 *   pnpm bug-council score --run <folder> --council <name> --pass-rate 95
 *
 * The last line printed is the state: done, stalled or continue. The loop
 * around it (fix, sweep again, score) is .claude/skills/bug-council/SKILL.md.
 */
import { spawnSync } from "node:child_process";
import { join, resolve } from "node:path";
import { type OpenBug, parseArgs, score, slug, USAGE } from "./lib/bugCouncil";
import { list, storeFile } from "./lib/bugTracker";
import { ROOT } from "./lib/paths";
import { areaOf } from "./lib/recheck";

if (process.argv.length <= 2 || process.argv[2] === "--help") {
  console.log(USAGE);
  process.exit(0);
}

const root = ROOT;
const git = (args: string[]) =>
  spawnSync("git", args, { cwd: root, encoding: "utf8" }).stdout.trim();

/**
 * Every open bug in the local bug file, whatever filed it: a critical bug
 * written by hand counts against the app as much as one a sweep filed.
 */
function openLocalBugs(): OpenBug[] {
  return list(storeFile(root), { open: true }).map((b) => ({
    key: b.key,
    title: b.title,
    severity: b.severity,
    area: areaOf(b.group ?? "") ?? areaOf(b.ref ?? ""),
  }));
}

try {
  const args = parseArgs(process.argv.slice(2));
  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]);
  const result = score(args, {
    sweeps: resolve(
      process.env.BUG_SWEEP_DIR ?? join(root, "reports/bug-sweep"),
    ),
    councils: join(root, "reports/bug-council"),
    defaultName: slug(!branch || branch === "HEAD" ? "detached" : branch),
    openBugs: openLocalBugs,
    head: () => git(["rev-parse", "--short=12", "HEAD"]),
    now: () => new Date(),
  });
  const latest = result.history.at(-1)!;
  console.log(`Round ${latest.round} of ${result.history.length} scored.`);
  console.log(`Written: ${result.readmeFile}`);
  for (const reason of result.reasons) console.log(`- ${reason}`);
  if (result.fixNext.length) {
    console.log("Fix next:");
    for (const b of result.fixNext) console.log(`  ${b.key}  ${b.title}`);
  }
  console.log(result.state);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
