import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import { GROUPS } from "./browserHunt";
import {
  combineScores,
  type FlowScore,
  type FlowsFile,
  rateText,
} from "./featureFlows";
import { areaOf, type RechecksFile } from "./recheck";

/**
 * The bug council's score (scripts/bug-council.ts): one round per finished
 * bug sweep, kept in reports/bug-council/<name>/history.json, and a verdict
 * on whether the app is healthy enough to stop sweeping. It reads the sweep's
 * run folder and the local bug file; it starts no browser and no agent. The loop
 * around it (fix, sweep again, score) is .claude/skills/bug-council/SKILL.md.
 */

export const DEFAULT_PASS_RATE = 95;
export const DEFAULT_NEXT = 5;

// ---- Bugs ----------------------------------------------------------------

export type Level = "critical" | "high";

/** The tracker's severities that count as critical or high; the rest are not scored. */
export function levelOf(severity: string | undefined): Level | undefined {
  switch (severity?.trim().toLowerCase()) {
    case "critical":
    case "blocker":
      return "critical";
    case "high":
    case "major":
      return "high";
    default:
      return undefined;
  }
}

/** An open bug of the sweep, as `bug-tracker list --json` gives it. */
export type OpenBug = {
  key: string;
  title: string;
  severity: string;
  /** The browser group it was filed under (from its group or its ref); none when it has neither. */
  area?: number;
};

/** A bug this run filed (`filed.json`). */
export type FiledBug = { key: string; severity?: string; area?: number };

/** The bugs in `bug-tracker list --json`; [] for anything else. */
export function parseOpenBugs(json: string): OpenBug[] {
  try {
    const parsed = JSON.parse(json) as {
      bugs?: {
        key?: string;
        title?: string;
        severity?: string;
        group?: string | null;
        ref?: string | null;
      }[];
    };
    return (parsed.bugs ?? []).flatMap((b) =>
      b.key
        ? [
            {
              key: b.key,
              title: b.title ?? "",
              severity: b.severity ?? "",
              area: areaOf(b.group ?? "") ?? areaOf(b.ref ?? ""),
            },
          ]
        : [],
    );
  } catch {
    return [];
  }
}

/** `filed.json`: the bugs the run's ticket agent filed. */
export function parseFiled(json: string): FiledBug[] {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((f: unknown) => {
    if (!f || typeof f !== "object") return [];
    const o = f as {
      ticket?: unknown;
      severity?: unknown;
      findings?: unknown;
    };
    const findings = Array.isArray(o.findings) ? o.findings : [];
    return [
      {
        key: typeof o.ticket === "string" ? o.ticket : "pending",
        severity: typeof o.severity === "string" ? o.severity : undefined,
        area: findings
          .map((id) => areaOf(String(id)))
          .find((a) => a !== undefined),
      },
    ];
  });
}

// ---- A round -------------------------------------------------------------

export type Rechecks = { fixed: number; stillThere: number; couldNot: number };

export type AreaRound = {
  group: number;
  slug: string;
  title: string;
  /** Flow results; null when no round has swept the area yet. */
  flows: FlowScore | null;
  /** Set when the area was not swept: the round its flow numbers come from. */
  flowsFromRound?: number;
  openCritical: number;
  openHigh: number;
  newCriticalHigh: number;
  rechecks: Rechecks;
};

export type Overall = {
  flows: FlowScore;
  openCritical: number;
  openHigh: number;
  newCriticalHigh: number;
  rechecks: Rechecks;
};

export type RoundRecord = {
  round: number;
  /** The sweep run folder's name. */
  run: string;
  at: string;
  /** The code the sweep ran on. */
  commit: string;
  /** The browser groups the sweep walked. */
  groups: number[];
  areas: AreaRound[];
  overall: Overall;
};

const count = (rows: { result: string }[], result: string) =>
  rows.filter((r) => r.result === result).length;

function rechecksOf(rows: { result: string }[]): Rechecks {
  return {
    fixed: count(rows, "fixed"),
    stillThere: count(rows, "still there"),
    couldNot: count(rows, "could not check"),
  };
}

/**
 * Scores one finished sweep: per browser group and overall. Open critical and
 * high bugs come from the tracker as it is now, so every area has them. An
 * area the sweep didn't walk keeps its flow numbers from the last round that
 * did (`flowsFromRound`); it has no new bugs or re-checks in this round.
 * `before` is the council's earlier rounds.
 */
export function scoreRound(input: {
  flows: FlowsFile;
  rechecks?: RechecksFile;
  filedThisRun: FiledBug[];
  openBugs: OpenBug[];
  before?: RoundRecord[];
}): Pick<RoundRecord, "groups" | "areas" | "overall"> {
  const before = input.before ?? [];
  const walked = new Map(input.flows.groups.map((g) => [g.group, g.score]));
  const rechecks = input.rechecks?.rechecks ?? [];
  const openIn = (level: Level, area?: number) =>
    input.openBugs.filter(
      (b) =>
        levelOf(b.severity) === level &&
        (area === undefined || b.area === area),
    ).length;
  const newIn = (area?: number) =>
    input.filedThisRun.filter(
      (b) =>
        levelOf(b.severity) !== undefined &&
        (area === undefined || b.area === area),
    ).length;

  const areas: AreaRound[] = GROUPS.map((g) => {
    const score = walked.get(g.id);
    let flows: FlowScore | null = score ?? null;
    let flowsFromRound: number | undefined;
    if (!score) {
      const earlier = [...before]
        .reverse()
        .map((r) => ({
          round: r.round,
          area: r.areas.find((a) => a.group === g.id),
        }))
        .find((r) => r.area?.flows && r.area.flowsFromRound === undefined);
      flows = earlier?.area?.flows ?? null;
      flowsFromRound = earlier?.round;
    }
    return {
      group: g.id,
      slug: g.slug,
      title: g.title,
      flows,
      ...(flowsFromRound === undefined ? {} : { flowsFromRound }),
      openCritical: openIn("critical", g.id),
      openHigh: openIn("high", g.id),
      newCriticalHigh: newIn(g.id),
      rechecks: rechecksOf(rechecks.filter((r) => r.group === g.id)),
    };
  });

  return {
    groups: [...walked.keys()].sort((a, b) => a - b),
    areas,
    overall: {
      flows: combineScores(areas.flatMap((a) => (a.flows ? [a.flows] : []))),
      openCritical: openIn("critical"),
      openHigh: openIn("high"),
      newCriticalHigh: newIn(),
      rechecks: rechecksOf(rechecks),
    },
  };
}

/** True when the sweep walked every browser group. */
export function isFull(round: Pick<RoundRecord, "groups">): boolean {
  return GROUPS.every((g) => round.groups.includes(g.id));
}

/** "full", or "areas 3, 5". */
export function sweepKind(round: Pick<RoundRecord, "groups">): string {
  return isFull(round) ? "full" : `areas ${round.groups.join(", ") || "none"}`;
}

/** Adds a round; scoring the same sweep run again replaces its round. */
export function addRound(
  history: RoundRecord[],
  record: Omit<RoundRecord, "round">,
): RoundRecord[] {
  const same = history.find((h) => h.run === record.run);
  const round = same?.round ?? Math.max(0, ...history.map((h) => h.round)) + 1;
  return [
    ...history.filter((h) => h.run !== record.run),
    { ...record, round },
  ].sort((a, b) => a.round - b.round);
}

// ---- The verdict ---------------------------------------------------------

export type State = "done" | "stalled" | "continue";

const openOf = (r: RoundRecord) => r.overall.openCritical + r.overall.openHigh;
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/**
 * Whether to stop. `passRate` is a percentage (95). The rules, on the latest
 * round: no open critical or high bug; the overall flow pass rate at
 * least `passRate`; no re-check that found the bug still there; and the latest
 * two full sweeps each filed no new critical or high bug (a sweep of some
 * areas doesn't count). `stalled`: while an open bug or a low pass rate could
 * still improve, the latest three rounds didn't lower the
 * open critical + high count and didn't raise the pass rate. Anything else is
 * `continue`, with a reason for each rule not met.
 */
export function verdict(
  history: RoundRecord[],
  options: { passRate?: number } = {},
): { state: State; reasons: string[] } {
  const passRate = options.passRate ?? DEFAULT_PASS_RATE;
  const latest = history.at(-1);
  if (!latest)
    return { state: "continue", reasons: ["No round has been scored yet."] };

  const reasons: string[] = [];
  const { openCritical, openHigh, rechecks, flows } = latest.overall;
  // Stalled only means something while an open bug or a low pass rate could
  // still improve: a council waiting for its clean full sweeps isn't stuck.
  let canImprove = false;
  if (openCritical + openHigh > 0) {
    canImprove = true;
    reasons.push(
      `${plural(openCritical, "critical bug")} and ${plural(openHigh, "high bug")} from the sweeps are still open.`,
    );
  }
  if (flows.rate === null) {
    canImprove = true;
    reasons.push("No flow has been walked yet, so there is no pass rate.");
  } else if (
    // Whole numbers, so 19 of 20 is 95% exactly.
    flows.pass * 100 <
    passRate * (flows.pass + flows.fail + flows.blocked)
  ) {
    canImprove = true;
    reasons.push(
      `The flow pass rate is ${rateText(flows.rate)}; it needs to be at least ${passRate}%.`,
    );
  }
  if (rechecks.stillThere > 0)
    reasons.push(
      `${plural(rechecks.stillThere, "fixed bug")} found still there when checked again.`,
    );
  const full = history.filter(isFull);
  if (full.length < 2)
    reasons.push(
      `Two full sweeps in a row must file no new critical or high bug; ${full.length === 0 ? "none has" : "only one has"} run so far.`,
    );
  for (const r of full.slice(-2))
    if (r.overall.newCriticalHigh > 0)
      reasons.push(
        `The full sweep of round ${r.round} filed ${plural(r.overall.newCriticalHigh, "new critical or high bug")}.`,
      );

  if (reasons.length === 0) return { state: "done", reasons: [] };

  const last3 = history.slice(-3);
  if (last3.length === 3 && canImprove) {
    const [first] = last3;
    const rate = (r: RoundRecord) => r.overall.flows.rate ?? -1;
    if (openOf(latest) >= openOf(first!) && rate(latest) <= rate(first!))
      return {
        state: "stalled",
        reasons: [
          `The last three rounds (${last3.map((r) => r.round).join(", ")}) did not lower the open critical and high bugs (${last3.map(openOf).join(" → ")}) and did not raise the flow pass rate (${last3.map((r) => rateText(r.overall.flows.rate)).join(" → ")}).`,
          ...reasons,
        ],
      };
  }
  return { state: "continue", reasons };
}

// ---- What to fix next ----------------------------------------------------

/**
 * The open critical and high bugs to fix next: critical before high, then the
 * area with the lowest flow pass rate first (a bug with no area, or an area
 * with no rate, after the rest of its severity), then the older bug.
 */
export function nextUp(
  openBugs: OpenBug[],
  n = DEFAULT_NEXT,
  areas: Pick<AreaRound, "group" | "flows">[] = [],
): OpenBug[] {
  const rate = (bug: OpenBug) =>
    areas.find((a) => a.group === bug.area)?.flows?.rate ?? Infinity;
  const number = (bug: OpenBug) => Number(/(\d+)$/.exec(bug.key)?.[1] ?? 0);
  const rank = (bug: OpenBug) => (levelOf(bug.severity) === "critical" ? 0 : 1);
  return openBugs
    .filter((b) => levelOf(b.severity) !== undefined)
    .sort(
      (a, b) => rank(a) - rank(b) || rate(a) - rate(b) || number(a) - number(b),
    )
    .slice(0, Math.max(0, n));
}

// ---- The README ----------------------------------------------------------

const cell = (text: string) =>
  text.replace(/\s+/g, " ").replaceAll("|", "/").trim();

function rechecksText(r: Rechecks): string {
  return r.fixed + r.stillThere + r.couldNot === 0
    ? "–"
    : `${r.fixed} fixed, ${r.stillThere} still there, ${r.couldNot} could not check`;
}

/** The round-by-round table, each round with the state it ended in. */
export function historyTable(
  history: RoundRecord[],
  options: { passRate?: number } = {},
): string {
  return (
    "| Round | Commit | Sweep | Pass rate | Open critical | Open high | New critical + high | Re-checks | State |\n|---|---|---|---|---|---|---|---|---|\n" +
    history
      .map(
        (r, i) =>
          `| ${r.round} | ${r.commit.slice(0, 9)} | ${sweepKind(r)} | ${rateText(r.overall.flows.rate)} | ${r.overall.openCritical} | ${r.overall.openHigh} | ${r.overall.newCriticalHigh} | ${rechecksText(r.overall.rechecks)} | ${verdict(history.slice(0, i + 1), options).state} |`,
      )
      .join("\n")
  );
}

/** The latest round, area by area. */
export function areaTable(round: RoundRecord): string {
  const row = (name: string, o: Overall | AreaRound, rate: string) =>
    `| ${cell(name)} | ${rate} | ${o.flows ? `${o.flows.pass} / ${o.flows.fail} / ${o.flows.blocked} / ${o.flows.notReached}` : "–"} | ${o.openCritical} | ${o.openHigh} | ${o.newCriticalHigh} | ${rechecksText(o.rechecks)} |`;
  return (
    "| Area | Pass rate | Passed / failed / blocked / not reached | Open critical | Open high | New critical + high | Re-checks |\n|---|---|---|---|---|---|---|\n" +
    [
      ...round.areas.map((a) =>
        row(
          a.title,
          a,
          `${rateText(a.flows?.rate ?? null)}${a.flowsFromRound ? ` (round ${a.flowsFromRound})` : ""}`,
        ),
      ),
      row("**All areas**", round.overall, rateText(round.overall.flows.rate)),
    ].join("\n")
  );
}

export function readme(input: {
  name: string;
  history: RoundRecord[];
  openBugs: OpenBug[];
  passRate?: number;
  next?: number;
}): { text: string; state: State; reasons: string[]; fixNext: OpenBug[] } {
  const passRate = input.passRate ?? DEFAULT_PASS_RATE;
  const latest = input.history.at(-1);
  const v = verdict(input.history, { passRate });
  const fixNext = nextUp(input.openBugs, input.next, latest?.areas);
  const text = [
    `# Bug council: ${input.name}`,
    `Done when no critical or high bug is open, at least ${passRate}% of the walked flows pass, no fixed bug is still there, and the latest two full sweeps each filed no new critical or high bug.`,
    `**State: ${v.state}**`,
    "## Rounds",
    input.history.length
      ? historyTable(input.history, { passRate })
      : "No round yet.",
    ...(latest
      ? [
          `## Latest round (${latest.round}, sweep \`${latest.run}\`)`,
          areaTable(latest),
          "Open bugs are the tracker's as of this round. An area not swept this round shows its flow numbers from the round named beside it.",
        ]
      : []),
    "## Why not done",
    v.reasons.length
      ? v.reasons.map((r) => `- ${r}`).join("\n")
      : "Nothing: every rule is met.",
    "## Fix next",
    fixNext.length
      ? fixNext
          .map((b) => `- ${b.key} (${levelOf(b.severity)}): ${cell(b.title)}`)
          .join("\n")
      : "No critical or high bug is open.",
  ].join("\n\n");
  return { text: `${text}\n`, state: v.state, reasons: v.reasons, fixNext };
}

// ---- The command ---------------------------------------------------------

export const USAGE = `pnpm bug-council <command>

Commands:
  score    Score one finished bug sweep and add a round to the council's history.
           It reads the sweep's run folder and the local bug file; it starts no
           browser and no agent.

Options for score:
  --run <folder or run id>   The sweep run to score (default: the latest finished one)
  --council <name>           History name (default: the branch)
  --pass-rate <percent>      Flow pass rate needed for done (default ${DEFAULT_PASS_RATE})
  --next <n>                 How many bugs "Fix next" lists (default ${DEFAULT_NEXT})

Runs are kept in reports/bug-council/<name>/ (git-ignored). The last line printed
is the state: done, stalled or continue.`;

export type Args = {
  command: "score";
  run?: string;
  council?: string;
  passRate: number;
  next: number;
};

/** Throws the usage text for no command or an unknown one. */
export function parseArgs(argv: string[]): Args {
  const [command, ...rest] = argv;
  if (command !== "score") throw new Error(USAGE);
  const args: Args = {
    command,
    passRate: DEFAULT_PASS_RATE,
    next: DEFAULT_NEXT,
  };
  for (let i = 0; i < rest.length; i++) {
    const flag = rest[i]!;
    const value = () => {
      const v = rest[++i];
      if (v === undefined || v.startsWith("--"))
        throw new Error(`${flag} needs a value`);
      return v;
    };
    switch (flag) {
      case "--run":
        args.run = value();
        break;
      case "--council":
        args.council = slug(value());
        break;
      case "--pass-rate": {
        const n = Number(value());
        if (!(n >= 1 && n <= 100))
          throw new Error("--pass-rate is a percentage from 1 to 100");
        args.passRate = n;
        break;
      }
      case "--next": {
        const n = Number(value());
        if (!Number.isInteger(n) || n < 1)
          throw new Error("--next is a whole number of 1 or more");
        args.next = n;
        break;
      }
      default:
        throw new Error(`Unknown option ${flag}\n\n${USAGE}`);
    }
  }
  return args;
}

/** A folder-safe name: `council/bugs` → `council-bugs`. */
export function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** The code a sweep ran on: the sha in its report's second line. */
export function commitOf(report: string): string | undefined {
  return /\bat `([0-9a-f]{7,40})`/.exec(report)?.[1];
}

/** The newest finished run (it has a report.md) in the sweeps folder. */
export function latestRun(sweeps: string): string | undefined {
  if (!existsSync(sweeps)) return undefined;
  return readdirSync(sweeps)
    .filter((d) => existsSync(join(sweeps, d, "report.md")))
    .sort()
    .at(-1);
}

export type ScoreDeps = {
  /** reports/bug-sweep: the sweep runs. */
  sweeps: string;
  /** reports/bug-council: one folder per council. */
  councils: string;
  /** The council's name when `--council` isn't given. */
  defaultName: string;
  /** Every open bug in the local bug file, from any source; throws when it can't be read. */
  openBugs: () => OpenBug[];
  /** The commit when the run's report doesn't say. */
  head: () => string;
  now: () => Date;
};

function readJson<T>(file: string): T | undefined {
  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch {
    return undefined;
  }
}

/** `pnpm bug-council score`: writes history.json and README.md, returns what to print. */
export function score(args: Args, deps: ScoreDeps) {
  const run = args.run ?? latestRun(deps.sweeps);
  if (!run)
    throw new Error(
      `No finished bug sweep in ${deps.sweeps}: run pnpm bug-sweep first, or pass --run <folder>.`,
    );
  const runDir = isAbsolute(run) ? run : resolve(deps.sweeps, run);
  if (!existsSync(runDir)) throw new Error(`No sweep run folder ${runDir}`);
  const flows = readJson<FlowsFile>(join(runDir, "flows.json"));
  if (!flows?.groups)
    throw new Error(
      `${runDir} has no flows.json: the sweep stopped before the browser agents wrote their flow results. Score a finished sweep.`,
    );
  const rechecks = readJson<RechecksFile>(join(runDir, "rechecks.json"));
  const filed = existsSync(join(runDir, "filed.json"))
    ? parseFiled(readFileSync(join(runDir, "filed.json"), "utf8"))
    : [];
  const report = existsSync(join(runDir, "report.md"))
    ? readFileSync(join(runDir, "report.md"), "utf8")
    : "";

  const name = args.council ?? deps.defaultName;
  const dir = join(deps.councils, name);
  const historyFile = join(dir, "history.json");
  const before = readJson<RoundRecord[]>(historyFile) ?? [];
  const openBugs = deps.openBugs();
  const runName = runDir.split("/").filter(Boolean).at(-1)!;
  // Rounds before this run's own (scoring it again replaces its round).
  const earlier = before.filter((r) => r.run !== runName);
  const scored = scoreRound({
    flows,
    rechecks,
    filedThisRun: filed,
    openBugs,
    before: earlier,
  });
  const history = addRound(before, {
    run: runName,
    at: deps.now().toISOString(),
    commit: commitOf(report) ?? deps.head(),
    ...scored,
  });

  mkdirSync(dir, { recursive: true });
  writeFileSync(historyFile, `${JSON.stringify(history, null, 2)}\n`);
  const out = readme({
    name,
    history,
    openBugs,
    passRate: args.passRate,
    next: args.next,
  });
  const readmeFile = join(dir, "README.md");
  writeFileSync(readmeFile, out.text);
  return { dir, readmeFile, history, ...out };
}
