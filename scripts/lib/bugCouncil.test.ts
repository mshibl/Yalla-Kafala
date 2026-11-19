import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import { GROUPS } from "./browserHunt";
import {
  addRound,
  commitOf,
  DEFAULT_PASS_RATE,
  type FiledBug,
  isFull,
  levelOf,
  nextUp,
  type OpenBug,
  parseArgs,
  parseFiled,
  parseOpenBugs,
  readme,
  type RoundRecord,
  score,
  scoreRound,
  USAGE,
  verdict,
} from "./bugCouncil";
import {
  combineScores,
  type FlowScore,
  type FlowsFile,
  flowScore,
} from "./featureFlows";

const flowsOf = (
  results: Record<number, ("pass" | "fail" | "blocked" | "not reached")[]>,
): FlowsFile => ({
  run: "r",
  groups: Object.entries(results).map(([id, rows]) => {
    const group = GROUPS.find((g) => g.id === Number(id))!;
    return {
      group: group.id,
      slug: group.slug,
      title: group.title,
      score: flowScore(rows.map((result) => ({ result }))),
      flows: [],
    };
  }),
});

const allGroups = (rows: ("pass" | "fail")[]) =>
  Object.fromEntries(GROUPS.map((g) => [g.id, rows]));

const open = (key: string, severity: string, area?: number): OpenBug => ({
  key,
  title: `Bug ${key}`,
  severity,
  area,
});

const NONE = { fixed: 0, stillThere: 0, couldNot: 0 };

/** A round of the history, with the overall numbers and every area walked. */
function round(
  n: number,
  over: {
    groups?: number[];
    rate?: number;
    openCritical?: number;
    openHigh?: number;
    newCriticalHigh?: number;
    stillThere?: number;
  } = {},
): RoundRecord {
  const pass = Math.round((over.rate ?? 1) * 100);
  const flows: FlowScore = {
    pass,
    fail: 100 - pass,
    blocked: 0,
    notReached: 0,
    rate: pass / 100,
  };
  return {
    round: n,
    run: `run-${n}`,
    at: "2026-11-19T00:00:00.000Z",
    commit: `abc${n}`,
    groups: over.groups ?? GROUPS.map((g) => g.id),
    areas: [],
    overall: {
      flows,
      openCritical: over.openCritical ?? 0,
      openHigh: over.openHigh ?? 0,
      newCriticalHigh: over.newCriticalHigh ?? 0,
      rechecks: { ...NONE, stillThere: over.stillThere ?? 0 },
    },
  };
}

describe("scoreRound", () => {
  test("per area and overall: flow rate, open critical and high, new ones, re-checks", () => {
    const filedThisRun: FiledBug[] = [
      { key: "YKBUGS-9", severity: "critical", area: 2 },
      { key: "YKBUGS-10", severity: "low", area: 2 },
      { key: "YKBUGS-11", severity: "high" },
    ];
    const scored = scoreRound({
      flows: flowsOf({ 1: ["pass", "pass", "fail"], 2: ["pass", "blocked"] }),
      rechecks: {
        run: "r",
        rechecks: [
          {
            bug: "YKBUGS-1",
            title: "t",
            group: 2,
            result: "fixed",
            evidence: "",
          },
          {
            bug: "YKBUGS-2",
            title: "t",
            group: 2,
            result: "still there",
            evidence: "",
          },
          {
            bug: "YKBUGS-3",
            title: "t",
            group: 0,
            result: "could not check",
            evidence: "",
          },
        ],
        actions: [],
      },
      filedThisRun,
      openBugs: [
        open("YKBUGS-4", "critical", 2),
        open("YKBUGS-5", "high", 2),
        open("YKBUGS-6", "major", 1),
        open("YKBUGS-7", "medium", 1),
        open("YKBUGS-8", "high"),
      ],
    });
    expect(scored.groups).toEqual([1, 2]);
    const area = (id: number) => scored.areas.find((a) => a.group === id)!;
    expect(area(1).flows?.rate).toBeCloseTo(2 / 3);
    expect(area(2).flows?.rate).toBeCloseTo(1 / 2);
    expect(area(2)).toMatchObject({
      openCritical: 1,
      openHigh: 1,
      newCriticalHigh: 1,
      rechecks: { fixed: 1, stillThere: 1, couldNot: 0 },
    });
    // Medium bugs are not scored; "major" counts as high.
    expect(area(1)).toMatchObject({ openCritical: 0, openHigh: 1 });
    // The overall numbers include bugs with no area and re-checks no group made.
    expect(scored.overall).toMatchObject({
      openCritical: 1,
      openHigh: 3,
      newCriticalHigh: 2,
      rechecks: { fixed: 1, stillThere: 1, couldNot: 1 },
    });
    expect(scored.overall.flows.rate).toBeCloseTo(3 / 5);
  });

  test("an area the sweep did not walk keeps its numbers from the last round that did", () => {
    const first = {
      round: 1,
      ...scoreRound({
        flows: flowsOf({ 1: ["pass", "pass"], 2: ["pass", "fail"] }),
        filedThisRun: [],
        openBugs: [],
      }),
    };
    const second = {
      round: 2,
      ...scoreRound({
        flows: flowsOf({ 2: ["pass", "pass"] }),
        filedThisRun: [],
        openBugs: [],
        before: [{ ...round(1), ...first }],
      }),
    };
    const area = (r: typeof second, id: number) =>
      r.areas.find((a) => a.group === id)!;
    // Area 1 was not walked in round 2: round 1's numbers, marked.
    expect(area(second, 1).flows?.rate).toBe(1);
    expect(area(second, 1).flowsFromRound).toBe(1);
    // Area 2 was walked: its own numbers, no mark.
    expect(area(second, 2).flows?.rate).toBe(1);
    expect(area(second, 2).flowsFromRound).toBeUndefined();
    // A third round that skips area 1 still points at round 1, not at round 2.
    const third = scoreRound({
      flows: flowsOf({ 2: ["pass"] }),
      filedThisRun: [],
      openBugs: [],
      before: [
        { ...round(1), ...first },
        { ...round(2), ...second },
      ],
    });
    expect(third.areas.find((a) => a.group === 1)?.flowsFromRound).toBe(1);
    // An area no round walked has no rate (not 0%).
    expect(third.areas.find((a) => a.group === 3)?.flows).toBeNull();
    // Overall = the combined area numbers, carried ones included.
    expect(third.overall.flows).toEqual(
      combineScores(third.areas.flatMap((a) => (a.flows ? [a.flows] : []))),
    );
  });

  test("flows not reached are listed but not counted in the rate", () => {
    const scored = scoreRound({
      flows: flowsOf({ 1: ["pass", "fail", "not reached", "not reached"] }),
      filedThisRun: [],
      openBugs: [],
    });
    const a = scored.areas.find((x) => x.group === 1)!;
    expect(a.flows).toMatchObject({ pass: 1, fail: 1, notReached: 2 });
    expect(a.flows?.rate).toBe(0.5);
    expect(scored.overall.flows.notReached).toBe(2);
    expect(scored.overall.flows.rate).toBe(0.5);
  });

  test("a sweep that walked every group is full; one that walked some is not", () => {
    const full = scoreRound({
      flows: flowsOf(allGroups(["pass"])),
      filedThisRun: [],
      openBugs: [],
    });
    expect(isFull(full)).toBe(true);
    const some = scoreRound({
      flows: flowsOf({ 1: ["pass"] }),
      filedThisRun: [],
      openBugs: [],
    });
    expect(isFull(some)).toBe(false);
  });
});

describe("verdict", () => {
  /** Two clean full sweeps, nothing open, every flow passing. */
  const clean = [round(1), round(2)];

  test("all rules met is done", () => {
    expect(verdict(clean)).toEqual({ state: "done", reasons: [] });
  });

  test("an open critical or high bug alone is continue, with its reason", () => {
    for (const over of [{ openCritical: 1 }, { openHigh: 2 }]) {
      const v = verdict([round(1), round(2, over)]);
      expect(v.state).toBe("continue");
      expect(v.reasons).toHaveLength(1);
      expect(v.reasons[0]).toMatch(/still open/);
    }
  });

  test("a pass rate under the bar alone is continue; --pass-rate moves the bar", () => {
    const rounds = [round(1), round(2, { rate: 0.9 })];
    const v = verdict(rounds);
    expect(v.state).toBe("continue");
    expect(v.reasons).toEqual([
      expect.stringContaining(`at least ${DEFAULT_PASS_RATE}%`),
    ]);
    expect(verdict(rounds, { passRate: 90 }).state).toBe("done");
    expect(verdict([round(1), round(2, { rate: 0.95 })]).state).toBe("done");
  });

  test("a fixed bug still there alone is continue, with its reason", () => {
    const v = verdict([round(1), round(2, { stillThere: 1 })]);
    expect(v.state).toBe("continue");
    expect(v.reasons).toEqual([expect.stringMatching(/still there/)]);
  });

  test("a new critical or high bug in either of the latest two full sweeps alone is continue", () => {
    for (const rounds of [
      [round(1, { newCriticalHigh: 1 }), round(2)],
      [round(1), round(2, { newCriticalHigh: 2 })],
    ]) {
      const v = verdict(rounds);
      expect(v.state).toBe("continue");
      expect(v.reasons).toEqual([
        expect.stringMatching(/new critical or high/),
      ]);
    }
    // An older full sweep with new bugs no longer counts.
    expect(
      verdict([round(1, { newCriticalHigh: 3 }), round(2), round(3)]).state,
    ).toBe("done");
  });

  test("fewer than two full sweeps is continue", () => {
    const v = verdict([round(1)]);
    expect(v.state).toBe("continue");
    expect(v.reasons).toEqual([expect.stringMatching(/Two full sweeps/)]);
  });

  test("a sweep of some areas is not one of the two clean full sweeps", () => {
    // Round 2 walked two areas only: the full sweeps are round 1 and nothing else.
    const targeted = round(2, { groups: [1, 2] });
    const v = verdict([round(1), targeted]);
    expect(v.state).toBe("continue");
    expect(v.reasons).toEqual([expect.stringMatching(/Two full sweeps/)]);
    // It does not hide a full sweep's new bugs either.
    expect(
      verdict([
        round(1, { newCriticalHigh: 1 }),
        round(2),
        round(3, { groups: [1] }),
      ]).state,
    ).toBe("continue");
    // Two full sweeps around a targeted one are enough.
    expect(verdict([round(1), round(2, { groups: [1] }), round(3)]).state).toBe(
      "done",
    );
  });

  test("three rounds that lowered nothing and raised nothing are stalled; progress is not", () => {
    const flat = [
      round(1, { openHigh: 3, rate: 0.8 }),
      round(2, { openHigh: 3, rate: 0.8 }),
      round(3, { openHigh: 4, rate: 0.7 }),
    ];
    const v = verdict(flat);
    expect(v.state).toBe("stalled");
    expect(v.reasons[0]).toMatch(/last three rounds/);
    // The other unmet rules are listed after it.
    expect(v.reasons.length).toBeGreaterThan(1);
    // Fewer open bugs, or a higher pass rate, is progress.
    expect(
      verdict([
        round(1, { openHigh: 3, rate: 0.8 }),
        round(2, { openHigh: 3, rate: 0.8 }),
        round(3, { openHigh: 2, rate: 0.8 }),
      ]).state,
    ).toBe("continue");
    expect(
      verdict([
        round(1, { openHigh: 3, rate: 0.8 }),
        round(2, { openHigh: 3, rate: 0.8 }),
        round(3, { openHigh: 3, rate: 0.85 }),
      ]).state,
    ).toBe("continue");
    // Two rounds are never stalled.
    expect(verdict(flat.slice(1)).state).toBe("continue");
  });

  test("flat rounds with nothing open and the pass rate met are waiting for clean sweeps, not stalled", () => {
    const v = verdict([
      round(1, { newCriticalHigh: 1 }),
      round(2, { newCriticalHigh: 1 }),
      round(3, { newCriticalHigh: 1 }),
    ]);
    expect(v.state).toBe("continue");
    // The latest two full sweeps (rounds 2 and 3) each filed one.
    expect(v.reasons).toHaveLength(2);
    for (const reason of v.reasons)
      expect(reason).toMatch(/new critical or high/);
  });

  test("done beats stalled, and no history is continue", () => {
    expect(verdict([round(1), round(2), round(3)]).state).toBe("done");
    expect(verdict([]).state).toBe("continue");
  });
});

describe("nextUp", () => {
  const areas = [
    {
      group: 1,
      flows: { pass: 9, fail: 1, blocked: 0, notReached: 0, rate: 0.9 },
    },
    {
      group: 2,
      flows: { pass: 5, fail: 5, blocked: 0, notReached: 0, rate: 0.5 },
    },
    { group: 3, flows: null },
  ];
  const bugs = [
    open("YKBUGS-10", "high", 2),
    open("YKBUGS-11", "critical", 1),
    open("YKBUGS-12", "critical", 2),
    open("YKBUGS-13", "high", 1),
    open("YKBUGS-14", "medium", 2),
    open("YKBUGS-15", "critical"),
    open("YKBUGS-16", "critical", 3),
  ];

  test("critical before high, then the area with the lowest pass rate; medium bugs never", () => {
    expect(nextUp(bugs, 10, areas).map((b) => b.key)).toEqual([
      "YKBUGS-12", // critical, area 2 (50%)
      "YKBUGS-11", // critical, area 1 (90%)
      "YKBUGS-15", // critical, no area
      "YKBUGS-16", // critical, area with no rate
      "YKBUGS-10", // high, area 2
      "YKBUGS-13", // high, area 1
    ]);
  });

  test("the limit, with five as the default", () => {
    expect(nextUp(bugs, 2, areas)).toHaveLength(2);
    expect(nextUp(bugs, 0, areas)).toEqual([]);
    const many = Array.from({ length: 9 }, (_, i) =>
      open(`YKBUGS-${i}`, "high"),
    );
    expect(nextUp(many)).toHaveLength(5);
    expect(nextUp(many, 7, [])).toHaveLength(7);
  });

  test("does not change the list it is given", () => {
    const copy = [...bugs];
    nextUp(bugs, 5, areas);
    expect(bugs).toEqual(copy);
  });
});

describe("reading the files", () => {
  test("severities: blocker is critical, major is high, the rest are not scored", () => {
    expect(levelOf("critical")).toBe("critical");
    expect(levelOf("Blocker")).toBe("critical");
    expect(levelOf("high")).toBe("high");
    expect(levelOf("major")).toBe("high");
    for (const s of ["medium", "low", "minor", "", undefined])
      expect(levelOf(s)).toBeUndefined();
  });

  test("the bug list gives key, severity and the area of its group, else of its ref", () => {
    const bugs = parseOpenBugs(
      JSON.stringify({
        bugs: [
          {
            key: "YKBUGS-1",
            title: "A",
            severity: "high",
            group: "05-admin-stories",
            ref: null,
          },
          {
            key: "YKBUGS-2",
            title: "B",
            severity: "critical",
            ref: "2026-11-01-0300/browser/03-support/F2",
          },
          { key: "YKBUGS-3", title: "C", severity: "critical" },
        ],
      }),
    );
    expect(bugs).toEqual([
      { key: "YKBUGS-1", title: "A", severity: "high", area: 5 },
      { key: "YKBUGS-2", title: "B", severity: "critical", area: 3 },
      { key: "YKBUGS-3", title: "C", severity: "critical", area: undefined },
    ]);
    expect(parseOpenBugs("not json")).toEqual([]);
  });

  test("filed.json gives each bug's severity and the area of its first browser finding", () => {
    expect(
      parseFiled(
        JSON.stringify([
          {
            ticket: "YKBUGS-3",
            severity: "high",
            findings: ["browser/03-support/F2", "browser/04-language/F1"],
          },
          { ticket: "YKBUGS-4", severity: "critical", findings: [] },
        ]),
      ),
    ).toEqual([
      { key: "YKBUGS-3", severity: "high", area: 3 },
      { key: "YKBUGS-4", severity: "critical", area: undefined },
    ]);
    expect(parseFiled("{}")).toEqual([]);
  });

  test("the report's second line names the commit", () => {
    expect(
      commitOf("# Bug sweep r\n\norigin/main at `be7fec60d494`, started now."),
    ).toBe("be7fec60d494");
    expect(commitOf("nothing")).toBeUndefined();
  });

  test("scoring a sweep again replaces its round, a new sweep adds one", () => {
    const base = ({ round: _round, ...rest }: RoundRecord) => rest;
    const one = addRound([], base(round(1)));
    expect(one.map((r) => r.round)).toEqual([1]);
    const two = addRound(one, base(round(2)));
    expect(two.map((r) => r.run)).toEqual(["run-1", "run-2"]);
    const again = addRound(two, {
      ...base(round(2)),
      commit: "newer",
    });
    expect(again.map((r) => [r.round, r.commit])).toEqual([
      [1, "abc1"],
      [2, "newer"],
    ]);
  });
});

describe("the command", () => {
  test("no arguments, or an unknown command, is the usage", () => {
    expect(() => parseArgs([])).toThrow(USAGE);
    expect(() => parseArgs(["explode"])).toThrow(/pnpm bug-council/);
    expect(USAGE).toContain("pnpm bug-council <command>");
    expect(USAGE).toMatch(/^ {2}score /m);
  });

  test("score takes the run, the council, the pass rate and the number to fix next", () => {
    expect(parseArgs(["score"])).toMatchObject({
      command: "score",
      passRate: DEFAULT_PASS_RATE,
    });
    expect(
      parseArgs([
        "score",
        "--run",
        "2026-11-19-0300",
        "--council",
        "Council/Bugs",
        "--pass-rate",
        "90",
        "--next",
        "3",
      ]),
    ).toEqual({
      command: "score",
      run: "2026-11-19-0300",
      council: "council-bugs",
      passRate: 90,
      next: 3,
    });
  });

  test("bad values are refused", () => {
    expect(() => parseArgs(["score", "--pass-rate", "0.95"])).toThrow(
      /percentage/,
    );
    expect(() => parseArgs(["score", "--pass-rate", "150"])).toThrow(
      /percentage/,
    );
    expect(() => parseArgs(["score", "--run"])).toThrow(/needs a value/);
    expect(() => parseArgs(["score", "--next", "0"])).toThrow(/whole number/);
    expect(() => parseArgs(["score", "--fast"])).toThrow(/Unknown option/);
  });
});

describe("score on a fixture sweep run", () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true });
  });

  /** A sweeps folder with one finished run, and a faked bug file. */
  function fixture() {
    const base = mkdtempSync(join(tmpdir(), "bug-council-"));
    dirs.push(base);
    const sweeps = join(base, "sweeps");
    const runDir = join(sweeps, "2026-11-19-0300");
    mkdirSync(runDir, { recursive: true });
    writeFileSync(
      join(runDir, "report.md"),
      "# Bug sweep 2026-11-19-0300\n\norigin/dev at `be7fec60d494`, started now.\n",
    );
    writeFileSync(
      join(runDir, "flows.json"),
      JSON.stringify(flowsOf(allGroups(["pass", "pass", "fail"]))),
    );
    writeFileSync(
      join(runDir, "filed.json"),
      JSON.stringify([
        {
          ticket: "YKBUGS-30",
          severity: "high",
          findings: ["browser/02-stories/F1"],
        },
      ]),
    );
    writeFileSync(
      join(runDir, "rechecks.json"),
      JSON.stringify({
        run: "2026-11-19-0300",
        rechecks: [
          {
            bug: "YKBUGS-1",
            title: "t",
            group: 5,
            result: "fixed",
            evidence: "",
          },
        ],
        actions: [],
      }),
    );
    const deps = {
      sweeps,
      councils: join(base, "councils"),
      defaultName: "council-bugs",
      openBugs: () => [
        open("YKBUGS-30", "high", 2),
        open("YKBUGS-31", "critical", 5),
        open("YKBUGS-32", "low", 5),
      ],
      head: () => "headsha",
      now: () => new Date("2026-11-19T10:00:00.000Z"),
    };
    return { base, deps, runDir };
  }

  test("writes history.json and README.md from the files, with the bug file faked", () => {
    const { deps } = fixture();
    const args = parseArgs(["score"]);
    const result = score(args, deps);

    const history = JSON.parse(
      readFileSync(join(result.dir, "history.json"), "utf8"),
    ) as RoundRecord[];
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({
      round: 1,
      run: "2026-11-19-0300",
      at: "2026-11-19T10:00:00.000Z",
      commit: "be7fec60d494",
      overall: {
        openCritical: 1,
        openHigh: 1,
        newCriticalHigh: 1,
        rechecks: { fixed: 1, stillThere: 0, couldNot: 0 },
      },
    });
    expect(history[0]!.overall.flows.rate).toBeCloseTo(2 / 3);
    expect(isFull(history[0]!)).toBe(true);

    const text = readFileSync(join(result.dir, "README.md"), "utf8");
    expect(result.dir.endsWith("council-bugs")).toBe(true);
    expect(text).toContain("# Bug council: council-bugs");
    expect(text).toContain(
      "| Round | Commit | Sweep | Pass rate | Open critical | Open high | New critical + high | Re-checks | State |",
    );
    expect(text).toContain("| 1 | be7fec60d | full | 67% | 1 | 1 | 1 |");
    for (const g of GROUPS) expect(text).toContain(`| ${g.title} |`);
    expect(text).toContain("## Why not done");
    expect(text).toContain("## Fix next");
    // Critical first.
    expect(text.indexOf("YKBUGS-31")).toBeLessThan(text.indexOf("YKBUGS-30"));
    expect(text).not.toContain("YKBUGS-32");
    expect(result.state).toBe("continue");
    expect(result.fixNext.map((b) => b.key)).toEqual([
      "YKBUGS-31",
      "YKBUGS-30",
    ]);
  });

  test("scoring the same run again changes nothing; --run and --council pick the run and the history", () => {
    const { deps, runDir } = fixture();
    score(parseArgs(["score"]), deps);
    const again = score(parseArgs(["score", "--run", runDir]), deps);
    expect(again.history).toHaveLength(1);

    const other = score(
      parseArgs(["score", "--run", "2026-11-19-0300", "--council", "other"]),
      deps,
    );
    expect(other.dir.endsWith("other")).toBe(true);
    expect(other.history).toHaveLength(1);
    expect(existsSync(join(other.dir, "README.md"))).toBe(true);
  });

  test("a second sweep adds a round, and the README states the verdict", () => {
    const { deps, base } = fixture();
    score(parseArgs(["score"]), deps);
    const second = join(deps.sweeps, "2026-11-20-0300");
    mkdirSync(second);
    writeFileSync(join(second, "report.md"), "# r\n\nx at `abc1234`.\n");
    writeFileSync(
      join(second, "flows.json"),
      JSON.stringify(flowsOf({ 5: ["pass", "pass"] })),
    );
    const result = score(parseArgs(["score"]), {
      ...deps,
      openBugs: () => [],
    });
    expect(result.history.map((r) => r.round)).toEqual([1, 2]);
    const latest = result.history[1]!;
    expect(latest.commit).toBe("abc1234");
    expect(isFull(latest)).toBe(false);
    // The areas this sweep skipped keep round 1's numbers.
    const skipped = latest.areas.find((a) => a.group === 1)!;
    expect(skipped.flowsFromRound).toBe(1);
    const text = readFileSync(join(result.dir, "README.md"), "utf8");
    expect(text).toContain("(round 1)");
    expect(text).toContain("areas 5");
    expect(text).toContain("No critical or high bug is open.");
    expect(base).toBeTruthy();
  });

  test("a run with no flow results, or no run, can't be scored", () => {
    const { deps, runDir } = fixture();
    rmSync(join(runDir, "flows.json"));
    expect(() => score(parseArgs(["score"]), deps)).toThrow(/no flows.json/);
    expect(() => score(parseArgs(["score", "--run", "nope"]), deps)).toThrow(
      /No sweep run folder/,
    );
    expect(() =>
      score(parseArgs(["score"]), { ...deps, sweeps: join(deps.sweeps, "x") }),
    ).toThrow(/No finished bug sweep/);
  });

  test("the README of a done council says so", () => {
    const history = [round(1), round(2)];
    const out = readme({ name: "n", history, openBugs: [] });
    expect(out.state).toBe("done");
    expect(out.text).toContain("**State: done**");
    expect(out.text).toContain("Nothing: every rule is met.");
  });
});
