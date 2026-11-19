import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { GROUPS, groupsOf } from "./browserHunt";
import { parseFeatureMap } from "./featureFlows";
import { ROOT } from "./paths";
import {
  applyRechecks,
  areaOf,
  checkFirstPart,
  groupOfRoute,
  parseBug,
  parseRechecks,
  type RecheckBug,
  RECHECK_RESULTS,
  recheckGroups,
  recheckRows,
  REOPEN_STATUS,
  type RecheckTracker,
  routeIn,
  templateRoute,
} from "./recheck";

const flows = parseFeatureMap(
  readFileSync(join(ROOT, "docs/agents/feature-map.md"), "utf8"),
);

const bugJson = (over: Record<string, unknown> = {}) =>
  JSON.stringify({
    bug: {
      key: "YKBUGS-12",
      title: "Fix: the blog list shows the draft",
      status: "fixed",
      fixedIn: "abcdef1234567890",
      ref: "2026-11-19-1000/browser/05-admin-stories/F2",
      group: "05-admin-stories",
      evidence: `## Problem

A blog saved as a draft still shows on the public list.

## Evidence

- Bug sweep \`2026-11-19-1000\`, findings browser/05-admin-stories/F2
- Steps to reproduce on the demo data: unpublish a blog, open the list.
- Screen: Blog list (/admin/blogs)
- Who: the admin
- Width: 360
`,
      ...over,
    },
  });

const bug = (key: string, over: Partial<RecheckBug> = {}): RecheckBug => ({
  key,
  title: `Fix: ${key}`,
  status: "fixed",
  wrong: "it was wrong",
  steps: "do the thing",
  ...over,
});

describe("parseBug", () => {
  test("reads the key, the area, the screen and the steps from the bug file's JSON", () => {
    const b = parseBug(bugJson())!;
    expect(b).toMatchObject({
      key: "YKBUGS-12",
      status: "fixed",
      fixedIn: "abcdef1234567890",
      area: 5,
      route: "/admin/blogs",
      screen: "Blog list (/admin/blogs)",
      who: "the admin",
      width: "360",
    });
    expect(b.wrong).toContain("still shows on the public list");
    expect(b.steps).toContain("unpublish a blog");
  });

  test("a bug with no sections still has steps and a problem (its title)", () => {
    const b = parseBug(
      bugJson({ evidence: "Login loops.", ref: undefined, group: undefined }),
    )!;
    expect(b.wrong).toBe("Fix: the blog list shows the draft");
    expect(b.steps).toBe("Login loops.");
    expect(b.area).toBeUndefined();
  });

  test("the group alone is enough to place a bug", () => {
    expect(
      parseBug(bugJson({ ref: undefined, group: "02-stories" }))!.area,
    ).toBe(2);
  });

  test("anything that isn't a bug is null", () => {
    expect(parseBug("not json")).toBeNull();
    expect(parseBug(JSON.stringify({ ok: false }))).toBeNull();
  });
});

describe("where a bug is checked", () => {
  test("areaOf reads the browser group from a finding id or a slug", () => {
    for (const g of GROUPS) {
      expect(areaOf(`r/browser/${g.slug}/F1`)).toBe(g.id);
      expect(areaOf(g.slug)).toBe(g.id);
    }
    expect(areaOf("r/browser/99-nothing/F2")).toBeUndefined();
    expect(areaOf("something else")).toBeUndefined();
  });

  test("routeIn takes the Screen line, else the first path, never a code path", () => {
    expect(routeIn("- Screen: Blog (/kafala-blogs/k1)")).toBe(
      "/kafala-blogs/k1",
    );
    expect(routeIn("see `/faqs` and more")).toBe("/faqs");
    expect(
      routeIn("Where: src/app/a.tsx and /convex/x.ts and /src/lib/y.ts"),
    ).toBeUndefined();
  });

  test("the language prefix, the query and ids are dropped", () => {
    expect(templateRoute("/ar/kafala-blogs/k57abc?x=1")).toBe(
      "/kafala-blogs/{id}",
    );
    expect(templateRoute("/en/resources/some-guide")).toBe("/resources/{slug}");
    expect(templateRoute("/admin/blogs")).toBe("/admin/blogs");
    expect(templateRoute("/en")).toBe("/");
  });

  test("a real URL lands in the group of a flow with that route", () => {
    expect(flows.length).toBeGreaterThan(0);
    const concrete = (route: string) =>
      route.replace("{id}", "k57abc").replace("{slug}", "some-guide");
    for (const flow of flows) {
      // Several flows can share a route (`/`): the first one's group wins.
      const first = flows.find((f) => f.route === flow.route)!;
      expect(
        groupOfRoute(concrete(flow.route), flows),
        `${flow.id} (${flow.route})`,
      ).toBe(groupsOf(first)[0]);
    }
  });

  test("an admin page under a flow's route is that flow's group", () => {
    expect(groupOfRoute("/admin/board-members/edit/3", flows)).toBe(6);
    expect(groupOfRoute("/admin/blogs/new", flows)).toBe(5);
  });

  test("a route no flow has is no group", () => {
    expect(groupOfRoute("/no/such/page/at/all", flows)).toBeUndefined();
  });
});

describe("recheckGroups", () => {
  test("by the area the bug was filed under", () => {
    const r = recheckGroups(
      [bug("YKBUGS-1", { area: 6 }), bug("YKBUGS-2", { area: 3 })],
      [],
      flows,
    );
    expect(r.groups).toEqual([3, 6]);
    expect(r.assignments.map((a) => [a.bug.key, a.group, a.note])).toEqual([
      ["YKBUGS-1", 6, undefined],
      ["YKBUGS-2", 3, undefined],
    ]);
  });

  test("by the screen's route when the bug has no area", () => {
    const r = recheckGroups(
      [bug("YKBUGS-3", { route: "/admin/carousel" })],
      [],
      flows,
    );
    expect(r.groups).toEqual([6]);
  });

  test("a bug that fits no group goes to group 1 with a note", () => {
    const r = recheckGroups(
      [bug("YKBUGS-4"), bug("YKBUGS-5", { route: "/no/such/page/at/all" })],
      [],
      flows,
    );
    expect(r.groups).toEqual([1]);
    for (const a of r.assignments) {
      expect(a.group).toBe(1);
      expect(a.note).toMatch(/group 1/);
    }
  });

  test("with --groups the sweep runs those groups; a bug outside them is not checked", () => {
    const r = recheckGroups(
      [bug("YKBUGS-6", { area: 5 }), bug("YKBUGS-7", { area: 2 })],
      [5],
      flows,
    );
    expect(r.groups).toEqual([5]);
    expect(r.assignments.map((a) => a.group)).toEqual([5, 0]);
    expect(r.assignments[1]!.note).toMatch(/--groups/);
  });
});

describe("the prompt part", () => {
  test("each bug's key, steps and what was wrong, and where to write the answer", () => {
    const part = checkFirstPart(
      [parseBug(bugJson())!],
      "/runs/r/browser/05-admin-stories",
    );
    expect(part).toContain("## Check these first");
    expect(part).toContain("YKBUGS-12");
    expect(part).toContain("unpublish a blog");
    expect(part).toContain("still shows on the public list");
    expect(part).toContain("/runs/r/browser/05-admin-stories/rechecks.md");
    expect(part).toContain("| Bug | Result | Evidence |");
    for (const word of RECHECK_RESULTS) expect(part).toContain(`\`${word}\``);
  });

  test("a group with no bugs gets nothing", () => {
    expect(checkFirstPart([], "/x")).toBe("");
  });
});

describe("parseRechecks", () => {
  const md = `| Bug | Result | Evidence |
|---|---|---|
| YKBUGS-12 | fixed | followed twice, the draft is hidden |
| \`YKBUGS-15\` | Still-There | screenshots/R-YKBUGS-15.png |
| YKBUGS-16 | maybe | unsure |
`;

  test("one row per key, in order; a key with no row is could not check", () => {
    const rows = parseRechecks(md, ["YKBUGS-15", "YKBUGS-12", "YKBUGS-99"]);
    expect(rows.map((r) => [r.bug, r.result])).toEqual([
      ["YKBUGS-15", "still there"],
      ["YKBUGS-12", "fixed"],
      ["YKBUGS-99", "could not check"],
    ]);
    expect(rows[0]!.evidence).toContain("R-YKBUGS-15.png");
    expect(rows[2]!.evidence).toMatch(/no row/);
  });

  test("a result that isn't one of the three words is could not check, never fixed", () => {
    const [row] = parseRechecks(md, ["YKBUGS-16"]);
    expect(row!.result).toBe("could not check");
    expect(row!.evidence).toContain("maybe");
  });

  test("no file at all: every key could not be checked", () => {
    const rows = parseRechecks("", ["YKBUGS-1", "YKBUGS-2"]);
    expect(rows.map((r) => r.result)).toEqual([
      "could not check",
      "could not check",
    ]);
  });
});

describe("what goes back to the bug file", () => {
  /** A tracker that records its calls. It has no way to create a bug. */
  const fake = () => {
    const calls: string[][] = [];
    const tracker: RecheckTracker = {
      comment: (key, body) => (calls.push(["comment", key, body]), true),
      setStatus: (key, status) => (calls.push(["status", key, status]), true),
    };
    return { calls, tracker };
  };
  const rows = parseRechecks(
    `| Bug | Result | Evidence |
|---|---|---|
| YKBUGS-1 | fixed | gone |
| YKBUGS-2 | still there | the draft still shows (R-YKBUGS-2.png) |
| YKBUGS-3 | could not check | no such record |
`,
    ["YKBUGS-1", "YKBUGS-2", "YKBUGS-3"],
  );

  test("a bug still there gets a comment with the evidence and goes back to new; nothing else is written", () => {
    const { calls, tracker } = fake();
    const actions = applyRechecks(rows, "2026-11-19-1000", tracker);
    expect(actions).toEqual([
      { bug: "YKBUGS-2", commented: true, reopened: true },
    ]);
    expect(calls.map((c) => c.slice(0, 2))).toEqual([
      ["comment", "YKBUGS-2"],
      ["status", "YKBUGS-2"],
    ]);
    expect(calls[0]![2]).toContain("still shows");
    expect(calls[0]![2]).toContain("2026-11-19-1000");
    expect(calls[1]![2]).toBe(REOPEN_STATUS);
    expect(REOPEN_STATUS).toBe("new");
  });

  test("without a tracker (--no-tickets) nothing is written", () => {
    expect(applyRechecks(rows, "r", undefined)).toEqual([]);
  });

  test("the file rows: every bug has one; a bug no group checked is could not check", () => {
    const out = recheckRows(
      [
        { bug: bug("YKBUGS-1"), group: 1 },
        { bug: bug("YKBUGS-2"), group: 5 },
        {
          bug: bug("YKBUGS-3"),
          group: 0,
          note: "its group (2) is not in --groups",
        },
      ],
      rows,
    );
    expect(out.map((r) => [r.bug, r.result])).toEqual([
      ["YKBUGS-1", "fixed"],
      ["YKBUGS-2", "still there"],
      ["YKBUGS-3", "could not check"],
    ]);
    expect(out[2]!.evidence).toMatch(/--groups/);
  });
});
