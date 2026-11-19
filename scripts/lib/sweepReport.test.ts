import { expect, test } from "vitest";
import { type FlowScore, flowScore } from "./featureFlows";
import { sweepReport } from "./sweepReport";

const noTickets = {
  ran: false,
  filed: [],
  notBugs: [],
  duplicates: [],
  owner: "",
};

test("the report counts findings and lists what Opus filed, rejected and didn't get to", () => {
  const report = sweepReport({
    runId: "2026-11-19-1000",
    ref: "HEAD",
    sha: "be7fec60d4941234",
    startedAt: "Thu Nov 19 2026 10:00",
    areas: [
      {
        slug: "02-stories",
        title: "Stories",
        ending: "finished",
        minutes: 14.5,
        findings: 3,
      },
      {
        slug: "04-language",
        title: "Language and layout",
        ending: "timed out",
        minutes: 15,
        findings: 0,
      },
    ],
    findingIds: [
      "browser/02-stories/F1",
      "browser/02-stories/F2",
      "browser/02-stories/F3",
    ],
    tickets: {
      ran: true,
      ending: "finished",
      filed: [
        {
          ticket: "YKBUGS-1",
          title: "Fix: story shows twice",
          severity: "critical",
          findings: ["browser/02-stories/F1"],
        },
      ],
      notBugs: [{ id: "browser/02-stories/F2", reason: "works as designed" }],
      duplicates: [],
      owner: "Check the Arabic font.",
    },
  });
  expect(report).toContain("**3 findings** from 2 browser agents");
  expect(report).toContain("**Opus filed 1 bugs**");
  expect(report).toContain("1 not real");
  expect(report).toContain("1 it didn't get to");
  expect(report).toContain(
    "| YKBUGS-1 | Fix: story shows twice | critical | browser/02-stories/F1 |",
  );
  expect(report).toContain("## Not handled by Opus");
  expect(report).toContain("- browser/02-stories/F3");
  expect(report).toContain("- browser/02-stories/F2: works as designed");
  expect(report).toContain("## For the owner\n\nCheck the Arabic font.");
});

test("no scoring filter, no code part: the report has no Jev and no code agents", () => {
  const report = sweepReport({
    runId: "r",
    ref: "HEAD",
    sha: "be7fec60d4941234",
    startedAt: "now",
    areas: [],
    findingIds: [],
    tickets: noTickets,
  });
  expect(report).not.toMatch(/jev|code agent/i);
  expect(report).toContain("No bugs filed");
});

test("the report has a Flows table and the overall rate", () => {
  const area = (slug: string, title: string, flows: FlowScore) => ({
    slug,
    title,
    ending: "finished" as const,
    minutes: 10,
    findings: 0,
    flows,
  });
  const report = sweepReport({
    runId: "2026-11-19-1000",
    ref: "HEAD",
    sha: "be7fec60d4941234",
    startedAt: "Thu Nov 19 2026 10:00",
    areas: [
      area(
        "01-learn",
        "Learn",
        flowScore([
          { result: "pass" },
          { result: "pass" },
          { result: "pass" },
          { result: "fail" },
          { result: "not reached" },
        ]),
      ),
      area(
        "05-admin-stories",
        "Admin: stories and FAQs",
        flowScore([{ result: "pass" }, { result: "blocked" }]),
      ),
      area("06-admin-site", "Admin: site content", flowScore([])),
    ],
    findingIds: [],
    tickets: noTickets,
  });
  expect(report).toContain("## Flows");
  expect(report).toContain(
    "| Area | Passed | Failed | Blocked | Not reached | Rate |",
  );
  expect(report).toContain("| Learn | 3 | 1 | 0 | 1 | 75% |");
  expect(report).toContain("| Admin: stories and FAQs | 1 | 0 | 1 | 0 | 50% |");
  // Nothing walked: no rate, not 0%.
  expect(report).toContain("| Admin: site content | 0 | 0 | 0 | 0 | – |");
  // 4 passed of 6 walked (the not reached one is left out).
  expect(report).toContain("| **All areas** | 4 | 1 | 1 | 1 | 67% |");
  expect(report).toContain("**Flows: 67% passed**");
});

test("the report lists the fixed bugs checked again, and has none of it without --recheck", () => {
  const base = {
    runId: "r",
    ref: "HEAD",
    sha: "be7fec60d4941234",
    startedAt: "now",
    areas: [],
    findingIds: [],
    tickets: noTickets,
  };
  const report = sweepReport({
    ...base,
    rechecks: {
      run: "r",
      rechecks: [
        {
          bug: "YKBUGS-1",
          title: "Fix: a | b",
          group: 5,
          result: "fixed",
          evidence: "gone",
        },
        {
          bug: "YKBUGS-2",
          title: "Fix: two",
          group: 0,
          result: "still there",
          evidence: "still shows\ntwice",
        },
        {
          bug: "YKBUGS-3",
          title: "Fix: three",
          group: 1,
          result: "could not check",
          evidence: "no row",
        },
      ],
      actions: [{ bug: "YKBUGS-2", commented: true, reopened: true }],
    },
  });
  expect(report).toContain("## Fixed bugs checked again");
  expect(report).toContain("| Bug | Title | Group | Result | Evidence |");
  expect(report).toContain("| YKBUGS-1 | Fix: a / b | 5 | fixed | gone |");
  expect(report).toContain(
    "| YKBUGS-2 | Fix: two | – | still there | still shows twice |",
  );
  expect(report).toContain("1 fixed, 1 still there, 1 could not be checked");
  expect(sweepReport(base)).not.toContain("Fixed bugs checked again");
});

test("without flow results there is no Flows table", () => {
  const report = sweepReport({
    runId: "r",
    ref: "HEAD",
    sha: "be7fec60d4941234",
    startedAt: "now",
    areas: [
      {
        slug: "01-learn",
        title: "Learn",
        ending: "finished",
        minutes: 5,
        findings: 0,
      },
    ],
    findingIds: [],
    tickets: noTickets,
  });
  expect(report).not.toContain("## Flows");
});
