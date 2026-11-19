import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  combineScores,
  flowScore,
  parseFeatureMap,
  parseFlowResults,
  rateText,
} from "./featureFlows";

const SAMPLE = `# Feature map

Intro text with ### not a heading.

## Public visitor

### Home
- **Route**: \`/\`
- **Expected**: Hero.

### Search doctors
- **Route**: \`/search\`

## Staff (any Clinic member)

### Today (day view)
- **Route**: \`/staff/{clinic}\`
- **Steps**: open it.

## Not mapped

- \`/offline\`: fallback.
`;

describe("parseFeatureMap", () => {
  test("reads role, title, route and a slug id from a short sample", () => {
    expect(parseFeatureMap(SAMPLE)).toEqual([
      {
        id: "public-visitor/home",
        role: "Public visitor",
        title: "Home",
        route: "/",
      },
      {
        id: "public-visitor/search-doctors",
        role: "Public visitor",
        title: "Search doctors",
        route: "/search",
      },
      {
        id: "staff/today-day-view",
        role: "Staff (any Clinic member)",
        title: "Today (day view)",
        route: "/staff/{clinic}",
      },
    ]);
  });

  test("a duplicate id throws", () => {
    expect(() => parseFeatureMap("## A\n\n### Home\n\n### Home!\n")).toThrow(
      /Duplicate flow id a\/home/,
    );
  });

  test("a heading inside a code block is not a flow", () => {
    expect(parseFeatureMap("## A\n\n```\n### Fake\n```\n### Real\n")).toEqual([
      { id: "a/real", role: "A", title: "Real", route: "" },
    ]);
  });

  test("the real feature map has about fifty flows with unique ids, each with a route", () => {
    const flows = parseFeatureMap(
      readFileSync(
        join(import.meta.dirname, "../../docs/agents/feature-map.md"),
        "utf8",
      ),
    );
    expect(flows.length).toBeGreaterThan(40);
    expect(new Set(flows.map((f) => f.id)).size).toBe(flows.length);
    expect(flows.every((f) => f.route.startsWith("/"))).toBe(true);
    expect(
      flows.find((f) => f.id === "public-visitor-learn/home-page")?.route,
    ).toBe("/");
  });
});

describe("parseFlowResults", () => {
  const ids = ["a/one", "a/two", "a/three", "a/four"];
  const md = `| Flow id | Result | Finding |
|---|---|---|
| \`a/one\` | pass | |
| a/two | Fail | F3 |
| a/zzz | pass | |
| a/four | maybe | |
`;

  test("rows by id, in the listed order", () => {
    expect(parseFlowResults(md, ids).map((r) => [r.id, r.result])).toEqual([
      ["a/one", "pass"],
      ["a/two", "fail"],
      ["a/three", "not reached"],
      ["a/four", "not reached"],
    ]);
  });

  test("a failing row keeps its finding", () => {
    expect(parseFlowResults(md, ids)[1]!.finding).toBe("F3");
  });

  test("a flow with no row is not reached, an unknown id is dropped", () => {
    const rows = parseFlowResults(md, ids);
    expect(rows).toHaveLength(4);
    expect(rows.some((r) => r.id === "a/zzz")).toBe(false);
    expect(rows[2]).toEqual({
      id: "a/three",
      result: "not reached",
      finding: "",
    });
  });

  test("an unknown result word is not reached; 'not-reached' is accepted", () => {
    const rows = parseFlowResults("| a/one | not-reached |\n| a/two | ok |", [
      "a/one",
      "a/two",
    ]);
    expect(rows.map((r) => r.result)).toEqual(["not reached", "not reached"]);
  });

  test("the later row for an id wins", () => {
    const rows = parseFlowResults(
      "| a/one | blocked | F1 |\n| a/one | pass |",
      ["a/one"],
    );
    expect(rows[0]!.result).toBe("pass");
  });

  test("no file text at all means every flow is not reached", () => {
    expect(
      parseFlowResults("", ids).every((r) => r.result === "not reached"),
    ).toBe(true);
  });
});

describe("flowScore", () => {
  test("the rate is pass over pass, fail and blocked", () => {
    const score = flowScore([
      { result: "pass" },
      { result: "pass" },
      { result: "pass" },
      { result: "fail" },
      { result: "blocked" },
      { result: "not reached" },
    ]);
    expect(score).toEqual({
      pass: 3,
      fail: 1,
      blocked: 1,
      notReached: 1,
      rate: 0.6,
    });
  });

  test("all not reached gives a null rate", () => {
    const score = flowScore([
      { result: "not reached" },
      { result: "not reached" },
    ]);
    expect(score.rate).toBeNull();
    expect(score.notReached).toBe(2);
    expect(flowScore([]).rate).toBeNull();
  });

  test("combined scores add the counts and recompute the rate", () => {
    const total = combineScores([
      flowScore([{ result: "pass" }, { result: "fail" }]),
      flowScore([{ result: "pass" }, { result: "not reached" }]),
      flowScore([{ result: "not reached" }]),
    ]);
    expect(total).toEqual({
      pass: 2,
      fail: 1,
      blocked: 0,
      notReached: 2,
      rate: 2 / 3,
    });
    expect(rateText(total.rate)).toBe("67%");
    expect(rateText(null)).toBe("–");
  });
});
