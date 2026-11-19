import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { CHECKLIST } from "../design-council/checklist";
import { APP, SCREENS } from "../design-council/screens";
import {
  type Answer,
  type Answers,
  assignSides,
  type Call,
  CATEGORIES,
  changedShots,
  checklistScores,
  checklistText,
  claudeAnswer,
  codexArgs,
  compareFile,
  compareMarkdown,
  comparePrompt,
  comparison,
  confirmed,
  type Comparison,
  feedbackMarkdown,
  gaps,
  historyTable,
  type Issue,
  type Key,
  type Ledger,
  type LedgerIssue,
  mergeIssues,
  mergePrompt,
  newIssuesOf,
  nextRound,
  parseArgs,
  parseComparison,
  parseGroups,
  parseReview,
  parseReviewer,
  pickScreens,
  proposals,
  proposalsMarkdown,
  readmeMarkdown,
  REFERENCE_MARGIN,
  type Review,
  reviewerPrompt,
  roundFolder,
  type RoundRecord,
  roundRecord,
  type Screen,
  scoresTable,
  type Shares,
  shotPath,
  shotsFor,
  stalled,
  updateLedger,
  verdict,
  type Vote,
} from "./designCouncil";

/** Every category at `n` percent. */
const all = (n: number): Shares => ({
  categories: Object.fromEntries(
    CATEGORIES.map((c) => [c.key, n]),
  ) as Shares["categories"],
  overall: n,
});

/** The same answer to every check. */
const answered = (answer: Answer): Answers =>
  Object.fromEntries(CHECKLIST.map((c) => [c.id, answer]));

const inCategory = (category: string) =>
  CHECKLIST.filter((c) => c.category === category);

const review = (
  reviewer: string,
  ours: Shares,
  references: Record<string, Shares> = {},
): Review => ({
  reviewer,
  ours,
  references,
  answers: {},
  failures: {},
  issues: [],
  earlier: {},
  keep: [],
  summary: "",
});

describe("[harness] design council options", () => {
  test("defaults: next round, target 90, three reviewers", () => {
    const o = parseArgs([]);
    expect(o.round).toBe(0);
    expect(o.target).toBe(90);
    expect(o.dryRun).toBe(false);
    expect(o.reviewers.map((r) => r.name)).toEqual(["opus", "sonnet", "codex"]);
  });

  test("reads every option", () => {
    const o = parseArgs([
      "--name",
      "Design/Council",
      "--round",
      "3",
      "--target",
      "95",
      "--reviewers",
      "opus, codex:gpt-6.1",
      "--screens",
      "home,club",
      "--minutes",
      "10",
      "--review-only",
    ]);
    expect(o).toMatchObject({
      name: "design-council",
      round: 3,
      target: 95,
      screens: ["home", "club"],
      minutes: 10,
      reviewOnly: true,
    });
    expect(o.reviewers).toEqual([
      { name: "opus", kind: "claude", model: "claude-opus-5-5" },
      { name: "codex-gpt-6.1", kind: "codex", model: "gpt-6.1" },
    ]);
  });

  test("refuses bad values", () => {
    expect(() => parseArgs(["--target", "101"])).toThrow(/at most 100/);
    expect(parseArgs(["--dry-run"]).dryRun).toBe(true);
    expect(() => parseArgs(["--round", "1.5"])).toThrow(/whole/);
    expect(() => parseArgs(["--reviewers", "gemini"])).toThrow(
      /Unknown reviewer/,
    );
    expect(() => parseArgs(["--capture-only", "--review-only"])).toThrow();
    expect(() => parseArgs(["--nope"])).toThrow(/Unknown option/);
  });

  test("claude:<id> passes a model ID through", () => {
    expect(parseReviewer("claude:claude-x")).toEqual({
      name: "claude-x",
      kind: "claude",
      model: "claude-x",
    });
  });
});

describe("[harness] design council rounds and screens", () => {
  test("the next round follows the highest folder", () => {
    expect(nextRound([])).toBe(1);
    expect(nextRound(["round-01", "round-03", "references", "x"])).toBe(4);
    expect(roundFolder(4)).toBe("round-04");
  });

  const screens: Screen[] = [
    {
      id: "home",
      title: "Home",
      as: null,
      path: "/",
      widths: [360, 1280],
      arabic: true,
    },
    {
      id: "club",
      title: "Club",
      as: "admin",
      path: "/club/{club}",
      widths: [1280],
    },
  ];

  test("a shot per width, and one in Arabic at the first width", () => {
    expect(shotsFor(screens).map((s) => s.file)).toEqual([
      "home-360.png",
      "home-1280.png",
      "home-360-ar.png",
      "club-1280.png",
    ]);
  });

  test("paths get the language prefix and found values", () => {
    expect(shotPath("/", "en", {})).toBe("/en");
    expect(shotPath("/club/{club}/schedule", "ar", { club: "k1" })).toBe(
      "/ar/club/k1/schedule",
    );
    expect(() => shotPath("/club/{club}", "en", {})).toThrow(/club/);
    // The admin area has no language prefix.
    expect(shotPath("/admin/blogs", "en", {}, true)).toBe("/admin/blogs");
  });

  test("picks screens by ID and refuses unknown ones", () => {
    expect(pickScreens(screens, []).length).toBe(2);
    expect(pickScreens(screens, ["club"]).map((s) => s.id)).toEqual(["club"]);
    expect(() => pickScreens(screens, ["nope"])).toThrow(/Unknown screen/);
  });
});

describe("[harness] design council reviewers", () => {
  test("codex: one image per flag, the prompt after --", () => {
    const args = codexArgs("Score it", ["a.png", "b.png"], "out.md");
    expect(args).toContain("--image=a.png");
    expect(args).toContain("--image=b.png");
    expect(args.slice(-2)).toEqual(["--", "Score it"]);
    expect(args).toContain("read-only");
  });

  test("reads Claude's json output", () => {
    expect(
      claudeAnswer(`{"type":"result","result":"hello","session_id":"s"}\n`),
    ).toBe("hello");
    expect(() => claudeAnswer("not json")).toThrow();
  });

  const answer = (body: object) =>
    `Some thoughts.\n\n\`\`\`json\n${JSON.stringify(body)}\n\`\`\`\n`;

  const typography = inCategory("typography");
  const failShare = Math.round(
    ((typography.length - 1) / typography.length) * 100,
  );

  test("parses the last json block of an answer", () => {
    const r = parseReview(
      "opus",
      answer({
        ours: {
          ...answered("pass"),
          "typography-1": { answer: "fail", screens: ["home-360.png", "club"] },
          "rtl-1": "na",
        },
        references: {
          vezeeta: { ...answered("pass"), "typography-2": "fail" },
        },
        issues: [
          {
            screens: ["home-360"],
            category: "typography",
            severity: "high",
            kind: "structural",
            problem: "Tiny labels",
            fix: "Use text-sm",
          },
          { problem: "Odd", fix: "Fix", category: "nonsense", severity: "?" },
          { nothing: true },
        ],
        keep: ["The green"],
        summary: "Decent",
      }),
      ["vezeeta"],
    );
    expect(r.ours.categories.typography).toBe(failShare);
    expect(r.ours.categories.color).toBe(100);
    expect(r.answers["rtl-1"]).toBe("na");
    expect(r.failures).toEqual({ "typography-1": ["home-360", "club"] });
    expect(r.references.vezeeta!.categories.typography).toBe(failShare);
    expect(r.references.vezeeta!.categories.color).toBe(100);
    expect(r.issues).toHaveLength(2);
    expect(r.issues[0]).toMatchObject({ kind: "structural" });
    expect(r.issues[1]).toMatchObject({
      category: "polish",
      severity: "medium",
      kind: "visual",
    });
    expect(r.keep).toEqual(["The green"]);
  });

  test("earlier calls parse; an unknown id or call is dropped", () => {
    const body = {
      ours: answered("pass"),
      earlier: {
        I1: "fixed",
        I2: "worse",
        I3: "still",
        I9: "fixed",
        I4: "gone",
      },
    };
    const r = parseReview("opus", answer(body), [], ["I1", "I2", "I3", "I4"]);
    expect(r.earlier).toEqual({ I1: "fixed", I2: "worse", I3: "still" });
    expect(parseReview("opus", answer(body), []).earlier).toEqual({});
    expect(
      parseReview("opus", answer({ ours: answered("pass") }), [], ["I1"])
        .earlier,
    ).toEqual({});
  });

  test("a missing reference, or a check left out, is an error that names it", () => {
    expect(() =>
      parseReview("opus", answer({ ours: answered("pass"), references: {} }), [
        "vezeeta",
      ]),
    ).toThrow(/vezeeta/);
    const ours = answered("pass");
    delete ours["rtl-3"];
    expect(() =>
      parseReview("opus", answer({ ours, references: {} }), []),
    ).toThrow(/ours: no answer for check rtl-3/);
    const theirs = answered("pass");
    delete theirs["hierarchy-2"];
    expect(() =>
      parseReview(
        "opus",
        answer({ ours: answered("pass"), references: { vezeeta: theirs } }),
        ["vezeeta"],
      ),
    ).toThrow(/vezeeta: no answer for check hierarchy-2/);
    expect(() => parseReview("opus", "no json here", [])).toThrow(/no JSON/);
  });

  test("an answer that is not pass, fail or na, or a failure of ours with no screenshot, is an error", () => {
    expect(() =>
      parseReview(
        "opus",
        answer({ ours: { ...answered("pass"), "color-1": "maybe" } }),
        [],
      ),
    ).toThrow(/color-1 is not answered/);
    expect(() =>
      parseReview(
        "opus",
        answer({ ours: { ...answered("pass"), "color-1": "fail" } }),
        [],
      ),
    ).toThrow(/color-1 fails but names no screenshot/);
    expect(() =>
      parseReview(
        "opus",
        answer({
          ours: {
            ...answered("pass"),
            "color-1": { answer: "fail", screens: [] },
          },
        }),
        [],
      ),
    ).toThrow(/color-1/);
  });
});

describe("[harness] design council checklist", () => {
  test("five to seven checks for every category, with unique stable ids", () => {
    for (const { key } of CATEGORIES) {
      const checks = CHECKLIST.filter((c) => c.category === key);
      expect(checks.length, key).toBeGreaterThanOrEqual(5);
      expect(checks.length, key).toBeLessThanOrEqual(7);
      checks.forEach((check, i) => {
        expect(check.id).toBe(`${key}-${i + 1}`);
        expect(check.question.trim().endsWith("?"), check.id).toBe(true);
      });
    }
    const ids = CHECKLIST.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const check of CHECKLIST)
      expect(
        CATEGORIES.some((c) => c.key === check.category),
        check.id,
      ).toBe(true);
  });

  test("a category's share is the share of its non-na checks that pass", () => {
    expect(checklistScores(answered("pass"))).toEqual(all(100));
    expect(checklistScores(answered("fail"))).toEqual(all(0));
    const hierarchy = inCategory("hierarchy");
    const answers = answered("pass");
    answers[hierarchy[0]!.id] = "na";
    answers[hierarchy[1]!.id] = "fail";
    expect(checklistScores(answers).categories.hierarchy).toBe(
      Math.round(((hierarchy.length - 2) / (hierarchy.length - 1)) * 100),
    );
    // na is left out, not counted as a pass: one fail among two counted.
    expect(
      checklistScores({ a: "na", b: "pass", c: "fail" }, [
        { id: "a", category: "rtl" },
        { id: "b", category: "rtl" },
        { id: "c", category: "rtl" },
      ]).categories.rtl,
    ).toBe(50);
  });

  test("a category with only na checks has no share and is left out of the overall", () => {
    const answers = answered("pass");
    for (const check of inCategory("rtl")) answers[check.id] = "na";
    const shares = checklistScores(answers);
    expect(shares.categories.rtl).toBeNull();
    expect(shares.overall).toBe(100);
    const failing = answered("fail");
    for (const check of inCategory("rtl")) failing[check.id] = "na";
    expect(checklistScores(failing).overall).toBe(0);
    expect(checklistScores(answered("na")).overall).toBeNull();
  });

  test("the overall share averages the categories, each counted once", () => {
    const answers = answered("pass");
    for (const check of inCategory("color")) answers[check.id] = "fail";
    const shares = checklistScores(answers);
    expect(shares.categories.color).toBe(0);
    expect(shares.overall).toBe(
      Math.round((100 * (CATEGORIES.length - 1)) / CATEGORIES.length),
    );
  });
});

describe("[harness] design council prompt", () => {
  const template = readFileSync(
    join(import.meta.dirname, "../design-council/reviewer.md"),
    "utf8",
  );

  test("the prompt lists every check, our screenshots and the references", () => {
    const prompt = reviewerPrompt(template, APP, shotsFor(SCREENS), {
      okadoc: ["references/okadoc/a.png"],
    });
    for (const check of CHECKLIST) {
      expect(prompt, check.id).toContain(`\`${check.id}\`: ${check.question}`);
      expect(prompt.split(`"${check.id}"`).length - 1, check.id).toBe(2);
    }
    for (const shot of shotsFor(SCREENS))
      expect(prompt).toContain(`screens/${shot.file}`);
    expect(prompt).toContain("references/okadoc/a.png");
    expect(prompt).toContain('"okadoc": {');
    expect(prompt).not.toMatch(/\{\{/);
    expect(checklistText()).toContain("(`rtl`)");
  });

  test("the prompt no longer anchors the score or asks for 15 issues", () => {
    expect(template).not.toMatch(/a 7 is/i);
    expect(template).not.toMatch(/up to 15/i);
    expect(template).not.toMatch(/don't be generous/i);
    expect(template).toMatch(/at most 10/);
    expect(template).toMatch(/none is a valid answer/);
  });

  const entry = (id: string, status: "open" | "closed"): LedgerIssue => ({
    ...issue({ problem: `problem of ${id}`, screens: [`screen-${id}`] }),
    id,
    round: 1,
    raisedBy: ["a"],
    calls: { a: "still" },
    status,
  });

  test("round 1 has no earlier issues; round 2 lists the open ones by ID", () => {
    const first = reviewerPrompt(template, APP, shotsFor(SCREENS), {});
    expect(first).not.toMatch(/\{\{/);
    expect(first).not.toContain("Issues from earlier rounds");
    expect(first).toContain('"earlier": {}');

    const ledger: Ledger = [
      entry("I1", "open"),
      entry("I2", "closed"),
      entry("I3", "open"),
    ];
    const prompt = reviewerPrompt(template, APP, shotsFor(SCREENS), {}, ledger);
    expect(prompt).not.toMatch(/\{\{/);
    expect(prompt).toContain("Issues from earlier rounds");
    for (const i of ledger) {
      expect(prompt).toContain(`\`${i.id}\` (${i.screens[0]}): ${i.problem}`);
    }
    // The open issues are the ones the JSON asks an answer for.
    expect(prompt).toContain('"I1": "fixed"');
    expect(prompt).toContain('"I3": "fixed"');
    expect(prompt).not.toContain('"I2"');
    expect(prompt.indexOf("`I2`")).toBeGreaterThan(
      prompt.indexOf("Closed earlier"),
    );
    expect(prompt.indexOf("`I1`")).toBeLessThan(
      prompt.indexOf("Closed earlier"),
    );
    expect(prompt).toMatch(/not .*as a new one/i);
  });

  test("the template asks for a kind and for earlier calls", () => {
    expect(template).toContain('"kind"');
    expect(template).toContain("structural");
    expect(template).toContain('"earlier"');
  });
});

/** An issue, with the parts a test cares about changed. */
function issue(over: Partial<Issue> = {}): Issue {
  return {
    screens: ["home-out-360"],
    category: "typography",
    severity: "medium",
    kind: "visual",
    problem: "Tiny labels",
    fix: "Use text-sm",
    ...over,
  };
}

/** A review that raised `issues` and answered `earlier`. */
function reviewWith(
  reviewer: string,
  issues: Issue[] = [],
  earlier: Record<string, Call> = {},
): Review {
  return { ...review(reviewer, all(100)), issues, earlier };
}

/** A ledger entry, open unless said otherwise. */
function ledgerIssue(id: string, over: Partial<LedgerIssue> = {}): LedgerIssue {
  return {
    ...issue(),
    id,
    round: 1,
    raisedBy: ["a"],
    calls: { a: "still" },
    status: "open",
    ...over,
  };
}

describe("[harness] design council issue ledger", () => {
  test("a new issue gets the next id, even past a closed one", () => {
    const first = updateLedger(
      [],
      1,
      [reviewWith("a", [issue({ problem: "one" }), issue({ problem: "two" })])],
      [],
    );
    expect(first.map((i) => i.id)).toEqual(["I1", "I2"]);
    expect(first[0]).toMatchObject({
      round: 1,
      raisedBy: ["a"],
      calls: { a: "still" },
      status: "open",
    });
    const closed = [{ ...first[1]!, status: "closed" as const }, first[0]!];
    const second = updateLedger(
      closed,
      2,
      [reviewWith("a", [issue({ problem: "three" })])],
      [],
    );
    expect(second.at(-1)).toMatchObject({ id: "I3", round: 2 });
    expect(second).toHaveLength(closed.length + 1);
  });

  test("an issue two of three reviewers call fixed closes", () => {
    const ledger = [ledgerIssue("I1")];
    const next = updateLedger(
      ledger,
      2,
      [
        reviewWith("a", [], { I1: "fixed" }),
        reviewWith("b", [], { I1: "fixed" }),
        reviewWith("c", [], { I1: "still" }),
      ],
      [],
    );
    expect(next[0]).toMatchObject({
      status: "closed",
      calls: { a: "fixed", b: "fixed", c: "still" },
    });
  });

  test("one fixed in three, or a tie, leaves it open", () => {
    const ledger = [ledgerIssue("I1")];
    const call = (calls: Call[]) =>
      updateLedger(
        ledger,
        2,
        calls.map((c, n) => reviewWith(`r${n}`, [], { I1: c })),
        [],
      )[0]!.status;
    expect(call(["fixed", "still", "worse"])).toBe("open");
    expect(call(["fixed", "still"])).toBe("open");
    expect(call(["worse"])).toBe("open");
    expect(call(["fixed"])).toBe("closed");
  });

  test("a reviewer who did not answer does not count", () => {
    const ledger = [ledgerIssue("I1")];
    const status = (reviews: Review[]) =>
      updateLedger(ledger, 2, reviews, [])[0]!.status;
    // Two answered and both said fixed: the silent third is not a "no".
    expect(
      status([
        reviewWith("a", [], { I1: "fixed" }),
        reviewWith("b", [], { I1: "fixed" }),
        reviewWith("c"),
      ]),
    ).toBe("closed");
    // One fixed, one still, one silent: half of those who answered is not most.
    expect(
      status([
        reviewWith("a", [], { I1: "fixed" }),
        reviewWith("b", [], { I1: "still" }),
        reviewWith("c"),
      ]),
    ).toBe("open");
    // Nobody answered: nothing changes, and no earlier call is lost.
    const untouched = updateLedger(ledger, 2, [reviewWith("a")], []);
    expect(untouched[0]).toEqual(ledger[0]);
  });

  test("one reviewer saying still on a closed issue reopens it", () => {
    const ledger = [
      ledgerIssue("I1", {
        status: "closed",
        calls: { a: "fixed", b: "fixed" },
      }),
    ];
    const next = updateLedger(
      ledger,
      3,
      [reviewWith("a", [], { I1: "still" }), reviewWith("b")],
      [],
    );
    expect(next[0]).toMatchObject({
      status: "open",
      calls: { a: "still", b: "fixed" },
    });
    // Saying it is still fixed leaves it closed.
    expect(
      updateLedger(ledger, 3, [reviewWith("a", [], { I1: "fixed" })], [])[0]!
        .status,
    ).toBe("closed");
  });

  test("the ledger passed in is not changed", () => {
    const ledger = [ledgerIssue("I1")];
    const before = structuredClone(ledger);
    updateLedger(ledger, 2, [reviewWith("a", [issue()], { I1: "fixed" })], []);
    expect(ledger).toEqual(before);
  });

  test("duplicates among the new issues become one entry raised by several", () => {
    const reviews = [
      reviewWith("a", [
        issue({ problem: "Tiny labels", screens: ["x"], severity: "low" }),
        issue({ problem: "Other", category: "color" }),
      ]),
      reviewWith("b", [
        issue({
          problem: "Labels too small",
          screens: ["y"],
          severity: "high",
          kind: "structural",
        }),
      ]),
    ];
    const next = updateLedger([], 1, reviews, [[0, 2]]);
    expect(next).toHaveLength(2);
    expect(next[0]).toMatchObject({
      id: "I1",
      raisedBy: ["a", "b"],
      calls: { a: "still", b: "still" },
      severity: "high",
      problem: "Labels too small",
      kind: "structural",
    });
    expect(next[0]!.screens).toEqual(["x", "y"]);
    expect(next[1]).toMatchObject({ id: "I2", raisedBy: ["a"] });
  });
});

describe("[harness] design council merging issues", () => {
  const reviews = [
    reviewWith("a", [issue({ problem: "p0" }), issue({ problem: "p1" })]),
    reviewWith("b", [issue({ problem: "p2" })]),
  ];
  const issues = newIssuesOf(reviews);

  test("the new issues keep their reviewer and their order", () => {
    expect(issues.map((i) => [i.reviewer, i.problem])).toEqual([
      ["a", "p0"],
      ["a", "p1"],
      ["b", "p2"],
    ]);
  });

  test("two reviewers' same issue becomes one entry raised by both", () => {
    const merged = mergeIssues(issues, [[0, 2]]);
    expect(merged.map((m) => m.raisedBy)).toEqual([["a", "b"], ["a"]]);
    expect(merged.map((m) => m.issue.problem)).toEqual(["p0", "p1"]);
  });

  test("a failed merge keeps every issue apart", () => {
    const merged = mergeIssues(issues, []);
    expect(merged).toHaveLength(issues.length);
    expect(merged.map((m) => m.raisedBy)).toEqual([["a"], ["a"], ["b"]]);
  });

  test("a bad group is ignored, and an issue joins only its first group", () => {
    // 9, -1 and 1.5 point at no issue; 1 is in the first group, so the second
    // group is only 0 and 2.
    const merged = mergeIssues(issues, [[1, 9, -1, 1.5], [], [0, 1, 2]]);
    expect(merged.map((m) => m.raisedBy)).toEqual([["a", "b"], ["a"]]);
    expect(merged.map((m) => m.issue.problem)).toEqual(["p0", "p1"]);
  });

  test("one reviewer's two issues in a group are raised by that reviewer once", () => {
    const merged = mergeIssues(issues, [[0, 1]]);
    expect(merged[0]!.raisedBy).toEqual(["a"]);
  });

  test("the merge prompt numbers every issue; the answer parses into groups", () => {
    const prompt = mergePrompt(issues);
    issues.forEach((i, n) => {
      expect(prompt).toContain(`${n}. (${i.reviewer};`);
      expect(prompt).toContain(i.problem);
    });
    expect(
      parseGroups('Same.\n```json\n{ "groups": [[0, 2], ["x", 1], 5] }\n```'),
    ).toEqual([[0, 2], [1]]);
    expect(parseGroups('{ "groups": [] }')).toEqual([]);
    expect(() => parseGroups("no json")).toThrow(/no JSON/);
    expect(() => parseGroups('{ "nothing": 1 }')).toThrow(/no groups/);
  });
});

describe("[harness] design council confirmed issues", () => {
  test("two reviewers who raised it, or who say it is still there", () => {
    expect(confirmed(ledgerIssue("I1"))).toBe(false);
    expect(
      confirmed(
        ledgerIssue("I1", {
          raisedBy: ["a", "b"],
          calls: { a: "still", b: "still" },
        }),
      ),
    ).toBe(true);
    expect(
      confirmed(
        ledgerIssue("I1", { calls: { a: "still", b: "worse", c: "fixed" } }),
      ),
    ).toBe(true);
  });

  test("a reviewer who now calls it fixed no longer stands behind it", () => {
    expect(
      confirmed(
        ledgerIssue("I1", {
          raisedBy: ["a", "b"],
          calls: { a: "fixed", b: "still" },
        }),
      ),
    ).toBe(false);
  });
});

describe("[harness] design council verdict", () => {
  const withShare = (
    s: Shares,
    key: keyof Shares["categories"],
    n: number | null,
  ): Shares => ({ ...s, categories: { ...s.categories, [key]: n } });

  test("gaps list every category under the target, and only against the target", () => {
    const low = withShare(all(90), "rtl", 80);
    expect(gaps([review("a", all(90)), review("b", low)], 90)).toEqual([
      { reviewer: "b", category: "rtl", ours: 80, needs: 90 },
    ]);
    // A category with no share has no gap.
    expect(gaps([review("a", withShare(all(95), "rtl", null))], 90)).toEqual(
      [],
    );
    // A reference app ahead of us doesn't change a category's gap.
    expect(
      gaps(
        [review("a", all(90), { vezeeta: withShare(all(80), "color", 99) })],
        90,
      ),
    ).toEqual([]);
  });

  describe("the verdict", () => {
    const meets = () => ({
      reviews: [review("a", all(95)), review("b", all(92))],
      ledger: [] as Ledger,
      comparison: null as Comparison | null,
      target: 90,
      failed: [] as string[],
    });
    const blocker = (id: string, over: Partial<LedgerIssue> = {}) =>
      ledgerIssue(id, {
        severity: "high",
        raisedBy: ["a", "b"],
        calls: { a: "still", b: "still" },
        ...over,
      });
    const flat: Comparison = { better: 0, worse: 0, same: 2, result: "same" };

    test("done when every rule holds", () => {
      expect(verdict(meets())).toEqual({ state: "done", reasons: [] });
      expect(
        verdict({ ...meets(), comparison: flat, ledger: [ledgerIssue("I1")] })
          .state,
      ).toBe("done");
    });

    test("an open confirmed high visual issue keeps it going, naming the issue", () => {
      const v = verdict({ ...meets(), ledger: [blocker("I3")] });
      expect(v.state).toBe("continue");
      expect(v.reasons).toHaveLength(1);
      expect(v.reasons[0]).toContain("I3");
      // Each of these alone doesn't block it.
      for (const over of [
        { status: "closed" as const },
        { severity: "medium" as const },
        { calls: { a: "still" as const }, raisedBy: ["a"] },
      ])
        expect(
          verdict({ ...meets(), ledger: [blocker("I3", over)] }).state,
        ).toBe("done");
    });

    test("an open confirmed high structural issue never blocks it", () => {
      const v = verdict({
        ...meets(),
        ledger: [blocker("I3", { kind: "structural" })],
      });
      expect(v).toEqual({ state: "done", reasons: [] });
    });

    test("one reviewer under the overall target keeps it going", () => {
      const v = verdict({
        ...meets(),
        reviews: [review("a", all(95)), review("b", all(89))],
      });
      expect(v.state).toBe("continue");
      expect(v.reasons).toHaveLength(1);
      expect(v.reasons[0]).toMatch(/b \(89%\).*90%/);
      // A reviewer with no overall share at all is under it too.
      expect(
        verdict({
          ...meets(),
          reviews: [review("a", { ...all(95), overall: null })],
        }).state,
      ).toBe("continue");
    });

    test("a reviewer that puts ours well under the best reference app keeps it going", () => {
      const ref = (n: number) => ({
        vezeeta: all(n - 10),
        doctolib: all(n),
      });
      const at = (points: number) =>
        verdict({
          ...meets(),
          reviews: [review("a", all(95), ref(95 + points))],
        });
      expect(at(REFERENCE_MARGIN).state).toBe("done");
      const v = at(REFERENCE_MARGIN + 1);
      expect(v.state).toBe("continue");
      expect(v.reasons).toHaveLength(1);
      expect(v.reasons[0]).toContain("doctolib");
      expect(v.reasons[0]).toContain(`${REFERENCE_MARGIN + 1} points`);
      // With no reference app there is nothing to be behind.
      expect(verdict(meets()).state).toBe("done");
    });

    test("pictures that are still getting better keep it going", () => {
      const better: Comparison = {
        better: 3,
        worse: 1,
        same: 0,
        result: "better",
      };
      const v = verdict({ ...meets(), comparison: better });
      expect(v.state).toBe("continue");
      expect(v.reasons).toHaveLength(1);
      expect(v.reasons[0]).toContain("better 3 / worse 1 / same 0");
      const worse: Comparison = { ...better, result: "worse" };
      expect(verdict({ ...meets(), comparison: worse }).state).toBe("done");
    });

    test("a missing reviewer keeps it going", () => {
      const v = verdict({ ...meets(), failed: ["codex"] });
      expect(v.state).toBe("continue");
      expect(v.reasons).toEqual([expect.stringContaining("codex")]);
      const none = verdict({ ...meets(), reviews: [] });
      expect(none.state).toBe("continue");
      expect(none.reasons).toContain("no reviewer answered");
    });

    test("every unmet rule gets its own reason", () => {
      const v = verdict({
        reviews: [review("a", all(50), { vezeeta: all(99) })],
        ledger: [blocker("I1")],
        comparison: { better: 1, worse: 0, same: 0, result: "better" },
        target: 90,
        failed: ["codex"],
      });
      expect(v.state).toBe("continue");
      expect(v.reasons).toHaveLength(5);
    });
  });

  describe("stalled", () => {
    const record = (
      round: number,
      result: Comparison["result"] | null,
    ): RoundRecord => ({
      round,
      commit: "abc",
      at: new Date(0).toISOString(),
      reviewers: {},
      state: "continue",
      blocking: 0,
      closed: 0,
      comparison: result ? { better: 0, worse: 0, same: 0, result } : null,
    });
    const closedIn = (round: number) =>
      ledgerIssue("I1", { status: "closed", closedIn: round });

    test("two rounds that closed nothing and made nothing better stall", () => {
      expect(stalled([record(1, null), record(2, "same")], [])).toBe(true);
      expect(stalled([record(2, "worse"), record(3, "same")], [])).toBe(true);
    });

    test("an issue closed in either of the last two rounds does not", () => {
      const history = [record(1, null), record(2, "same")];
      expect(stalled(history, [closedIn(1)])).toBe(false);
      expect(stalled(history, [closedIn(2)])).toBe(false);
      // An issue closed before them doesn't count.
      expect(stalled([...history, record(3, "same")], [closedIn(1)])).toBe(
        true,
      );
    });

    test("a round whose pictures got better in either of the last two does not", () => {
      expect(stalled([record(1, "better"), record(2, "same")], [])).toBe(false);
      expect(stalled([record(1, null), record(2, "better")], [])).toBe(false);
    });

    test("fewer than two rounds never stall, and the order of the history doesn't matter", () => {
      expect(stalled([], [])).toBe(false);
      expect(stalled([record(1, null)], [])).toBe(false);
      expect(
        stalled(
          [record(3, "same"), record(1, "better"), record(2, "same")],
          [],
        ),
      ).toBe(true);
    });
  });

  describe("proposals", () => {
    test("only open structural issues, the most confirmed first", () => {
      const ledger: Ledger = [
        ledgerIssue("I1", { kind: "visual" }),
        ledgerIssue("I2", { kind: "structural", severity: "low" }),
        ledgerIssue("I3", {
          kind: "structural",
          severity: "low",
          raisedBy: ["a", "b"],
          calls: { a: "still", b: "worse" },
        }),
        ledgerIssue("I4", { kind: "structural", status: "closed" }),
        ledgerIssue("I5", { kind: "structural", severity: "high" }),
      ];
      expect(proposals(ledger).map((i) => i.id)).toEqual(["I3", "I5", "I2"]);
      expect(proposals([ledgerIssue("I1")])).toEqual([]);
    });

    test("proposals.md gives each issue's screens, problem, change and backing", () => {
      const ledger: Ledger = [
        ledgerIssue("I7", {
          kind: "structural",
          screens: ["home-out-360", "club-1280"],
          problem: "Two search boxes",
          fix: "Merge them into one",
          raisedBy: ["a", "b"],
          calls: { a: "still", b: "still" },
        }),
        ledgerIssue("I8", { problem: "visual-one" }),
      ];
      const md = proposalsMarkdown(ledger, 3);
      expect(md).toContain("I7");
      expect(md).toContain("home-out-360, club-1280");
      expect(md).toContain("Two search boxes");
      expect(md).toContain("Merge them into one");
      expect(md).toContain("Raised by 2 of 3");
      expect(md).not.toContain("visual-one");
      expect(proposalsMarkdown([], 3)).toContain("None.");
    });
  });

  describe("the run's README", () => {
    const readme = (over: Partial<Parameters<typeof readmeMarkdown>[0]> = {}) =>
      readmeMarkdown({
        branch: "council/design",
        target: 90,
        history: [],
        round: 2,
        reasons: [],
        stalled: false,
        proposals: 0,
        ...over,
      });

    test("states the rules once, with the target, and links the owner's list", () => {
      const md = readme({ target: 95 });
      expect(md).toContain("95%");
      expect(md).toContain(`${REFERENCE_MARGIN} points`);
      expect(md).toContain("[proposals.md](proposals.md)");
      expect(md.indexOf("## For the owner")).toBeGreaterThan(-1);
      expect(md).not.toMatch(/twice|in a row|0\.2/i);
    });

    test("lists why it isn't done, and says when it is stalled", () => {
      const md = readme({ reasons: ["b (89%) is under"], stalled: true });
      expect(md).toContain("- b (89%) is under");
      expect(md).toContain("Stalled");
      expect(readme()).toContain("Done.");
      expect(readme()).not.toContain("Stalled");
    });
  });

  test("the scores table shows whole percentages, and a dash for no share", () => {
    const table = scoresTable([
      review("a", withShare(all(78), "rtl", null), { vezeeta: all(100) }),
    ]);
    const rows = table.split("\n");
    expect(rows[0]).toContain("| Overall |");
    expect(rows[2]).toBe(
      `| a | **ours** | ${CATEGORIES.map((c) => (c.key === "rtl" ? "–" : "78%")).join(" | ")} | 78% |`,
    );
    expect(rows[3]).toContain("| a | vezeeta | 100% |");
    expect(table).not.toMatch(/\d\.\d/);
  });

  test("history and feedback", () => {
    const reviews = [
      {
        ...review("a", {
          ...withShare(all(80), "rtl", 60),
          overall: 78,
        }),
        failures: { "rtl-2": ["home-out-360-ar", "club-1280-ar"] },
        issues: [
          issue({
            screens: [],
            category: "polish",
            severity: "low",
            problem: "p1",
            fix: "f1",
          }),
          issue({
            screens: ["x"],
            category: "rtl",
            severity: "high",
            problem: "p2",
            fix: "f2",
          }),
        ],
      },
    ];
    const ledger = updateLedger([], 2, reviews, []);
    const record = roundRecord({
      round: 2,
      commit: "abcdef1234567",
      at: new Date(0),
      reviews,
      ledger,
      state: "continue",
    });
    expect(record.reviewers.a).toEqual({ avg: 78, min: 60 });
    // Round 1 has no comparison: the new column shows a dash.
    expect(record.comparison).toBeNull();
    expect(historyTable([record])).toContain(
      "| 2 | abcdef123 | 78% (min 60%) | 0 | 0 | – | continue |",
    );
    const md = feedbackMarkdown(reviews, gaps(reviews, 90), ["codex"], ledger);
    expect(md.indexOf("p2")).toBeLessThan(md.indexOf("p1"));
    expect(md).toContain("run them again): codex");
    expect(md).toContain("60% of checks pass, needs 90%");
    const check = CHECKLIST.find((c) => c.id === "rtl-2")!;
    expect(md).toContain(`\`rtl-2\` ${check.question}`);
    expect(md).toContain("home-out-360-ar, club-1280-ar");
  });

  test("feedback lists open issues from the ledger: confirmed first, then by severity", () => {
    const reviews = [reviewWith("a"), reviewWith("b"), reviewWith("c")];
    const ledger: Ledger = [
      ledgerIssue("I1", { severity: "high", problem: "lone-high" }),
      ledgerIssue("I2", {
        severity: "low",
        problem: "agreed-low",
        raisedBy: ["a", "b"],
        calls: { a: "still", b: "worse" },
      }),
      ledgerIssue("I3", { severity: "medium", problem: "lone-medium" }),
      ledgerIssue("I4", { status: "closed", problem: "closed-one" }),
      ledgerIssue("I5", { kind: "structural", problem: "structural-one" }),
    ];
    const md = feedbackMarkdown(reviews, [], [], ledger);
    const at = (text: string) => md.indexOf(text);
    expect(at("agreed-low")).toBeGreaterThan(-1);
    expect(at("agreed-low")).toBeLessThan(at("lone-high"));
    expect(at("lone-high")).toBeLessThan(at("lone-medium"));
    expect(md).toContain("`I2`, raised by 2 of 3, confirmed");
    expect(md).toContain("`I1`, raised by 1 of 3;");
    expect(md).not.toContain("closed-one");
    expect(md).not.toContain("structural-one");
  });
});

describe("[harness] design council comparison with the last round", () => {
  const template = readFileSync(
    join(import.meta.dirname, "../design-council/compare.md"),
    "utf8",
  );
  const vote = (better: "A" | "B" | "same", why = "w"): Vote => ({
    better,
    why,
  });
  /** `a` is the new picture of `x`, `b` of `y`: so A is new for x, B for y. */
  const key: Key = {
    x: { A: "new", B: "old" },
    y: { A: "old", B: "new" },
  };

  test("changedShots leaves out the same bytes and a shot new this round", () => {
    const previous = { same: "h1", changed: "h2", gone: "h3" };
    const current = { added: "h9", same: "h1", changed: "h2b" };
    expect(changedShots(previous, current)).toEqual(["changed"]);
    expect(changedShots({}, current)).toEqual([]);
    expect(changedShots(previous, previous)).toEqual([]);
  });

  test("assignSides flips a coin per shot and keeps one of each side", () => {
    const flips = [0.1, 0.9, 0.5, 0.49];
    let n = 0;
    const sides = assignSides(["a", "b", "c", "d"], () => flips[n++]!);
    expect(sides).toEqual({
      a: { A: "new", B: "old" },
      b: { A: "old", B: "new" },
      c: { A: "old", B: "new" },
      d: { A: "new", B: "old" },
    });
    for (const { A, B } of Object.values(sides)) expect(A).not.toBe(B);
    expect(assignSides([], Math.random)).toEqual({});
  });

  test("comparison: the most common answer wins; A and B turn back into rounds", () => {
    const result = comparison(key, {
      r1: { x: vote("A"), y: vote("A") },
      r2: { x: vote("A"), y: vote("same") },
      r3: { x: vote("B"), y: vote("A") },
    });
    // x: A, A, B = new, new, old -> new. y: A, same, A = old, same, old -> old.
    expect(result.shots).toEqual({ x: "new", y: "old" });
    expect(result).toMatchObject({ better: 1, worse: 1, same: 0 });
    expect(result.result).toBe("same");
  });

  test("comparison: a tie is same, and so is a shot nobody answered", () => {
    const tied = comparison(key, {
      r1: { x: vote("A") },
      r2: { x: vote("B") },
    });
    expect(tied.shots).toEqual({ x: "same", y: "same" });
    expect(tied).toMatchObject({
      better: 0,
      worse: 0,
      same: 2,
      result: "same",
    });
  });

  test("comparison: a reviewer with no answer for a shot is not counted", () => {
    const result = comparison(key, {
      r1: { x: vote("A") },
      r2: {},
      r3: { y: vote("same") },
    });
    // x: one vote for new, nobody else answered it: new.
    expect(result.shots.x).toBe("new");
    expect(result.shots.y).toBe("same");
    expect(comparison(key, {}).shots).toEqual({ x: "same", y: "same" });
  });

  test("comparison: the round is better when more shots are new than old, worse for the reverse", () => {
    const three: Key = {
      a: { A: "new", B: "old" },
      b: { A: "new", B: "old" },
      c: { A: "new", B: "old" },
    };
    const better = comparison(three, {
      r: { a: vote("A"), b: vote("A"), c: vote("B") },
    });
    expect([better.better, better.worse, better.result]).toEqual([
      2,
      1,
      "better",
    ]);
    const worse = comparison(three, {
      r: { a: vote("B"), b: vote("B"), c: vote("same") },
    });
    expect([worse.better, worse.worse, worse.same, worse.result]).toEqual([
      0,
      2,
      1,
      "worse",
    ]);
  });

  test("comparison: no changed shot is same", () => {
    expect(comparison({}, { r: {} })).toEqual({
      better: 0,
      worse: 0,
      same: 0,
      result: "same",
      shots: {},
    });
  });

  test("parseComparison reads the last json block", () => {
    const answer = [
      "x looks cleaner in A.",
      "```json",
      JSON.stringify({
        x: { better: "A", why: "bigger title" },
        y: { better: "same", why: "no real difference" },
      }),
      "```",
    ].join("\n");
    expect(parseComparison("r", answer, ["x", "y"])).toEqual({
      x: { better: "A", why: "bigger title" },
      y: { better: "same", why: "no real difference" },
    });
    // The bare JSON works too.
    expect(
      parseComparison("r", JSON.stringify({ x: { better: "B" } }), ["x"]),
    ).toEqual({ x: { better: "B", why: "" } });
  });

  test("parseComparison: a shot missing from the answer is no vote from that reviewer", () => {
    const answer = JSON.stringify({
      x: { better: "A", why: "w" },
      y: { better: "newer", why: "not a pick" },
      extra: { better: "B", why: "not a shot of ours" },
    });
    const votes = parseComparison("r", answer, ["x", "y", "z"]);
    expect(Object.keys(votes)).toEqual(["x"]);
    // It is then not counted for y: another reviewer's single vote decides.
    expect(comparison(key, { r: votes, s: { y: vote("B") } }).shots.y).toBe(
      "new",
    );
  });

  test("parseComparison throws when there is no JSON or no usable vote", () => {
    expect(() => parseComparison("r", "I like A.", ["x"])).toThrow("no JSON");
    expect(() => parseComparison("r", "{}", ["x"])).toThrow("answers no shot");
  });

  test("the prompt lists both pictures of every shot and never says which is newer", () => {
    const prompt = comparePrompt(template, "An app", ["x", "y"]);
    for (const shot of ["x", "y"])
      for (const side of ["A", "B"] as const)
        expect(prompt).toContain(compareFile(shot, side));
    expect(prompt).toContain("An app");
    expect(prompt).not.toContain("{{");
    // The example answer has a key per shot.
    expect(prompt).toContain('"x": {');
    expect(prompt).toContain('"y": {');
    expect(prompt).not.toMatch(
      /\b(newer|older|earlier|previous|last round)\b/i,
    );
  });

  test("compare.md has a row per shot with each reviewer's pick as a round", () => {
    const answers = {
      r1: { x: vote("A", "bigger | title"), y: vote("A") },
      r2: { x: vote("A") },
    };
    const result = comparison(key, answers);
    const md = compareMarkdown(key, result, answers);
    expect(md).toContain(`**${result.result}**`);
    expect(md).toContain("| x | new | r1: new (bigger / title); r2: new (w) |");
    expect(md).toContain("| y | old | r1: old (w) |");
    expect(compareMarkdown({}, comparison({}, {}), {})).toContain(
      "No shot changed",
    );
  });

  test("the history has a column for the comparison, and the feedback lists the shots that got worse", () => {
    const reviews = [reviewWith("a")];
    const answers = { r: { x: vote("B"), y: vote("A") } };
    const result = comparison(key, answers);
    expect(result.shots).toEqual({ x: "old", y: "old" });
    const record = roundRecord({
      round: 2,
      commit: "abcdef1234567",
      at: new Date(0),
      reviews,
      ledger: [],
      state: "continue",
      comparison: result,
    });
    expect(record.comparison).toEqual({
      better: 0,
      worse: 2,
      same: 0,
      result: "worse",
    });
    const table = historyTable([record]);
    expect(table).toContain("vs last round");
    expect(table).toContain("better 0 / worse 2 / same 0");
    expect(historyTable([{ ...record, comparison: null }])).toContain(
      "| – | continue |",
    );

    const md = feedbackMarkdown(reviews, [], [], [], result);
    const heading = "## Got worse: consider reverting";
    expect(md).toContain(heading);
    expect(md.indexOf(heading)).toBeLessThan(md.indexOf("## Gaps"));
    expect(md).toContain("- `x`");
    expect(md).toContain("- `y`");
    // Nothing got worse: no section.
    const fine = comparison(key, { r: { x: vote("A"), y: vote("B") } });
    expect(feedbackMarkdown(reviews, [], [], [], fine)).not.toContain(heading);
    expect(feedbackMarkdown(reviews, [], [], [])).not.toContain(heading);
  });
});
