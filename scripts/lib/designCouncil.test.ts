// Run with `pnpm test:scripts` (Node's own test runner).
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  CATEGORIES,
  claudeAnswer,
  codexArgs,
  feedbackMarkdown,
  historyTable,
  nextRound,
  parseArgs,
  parseReview,
  parseReviewer,
  pickScreens,
  roundFolder,
  roundRecord,
  shotPath,
  shotsFor,
  verdict,
} from "./designCouncil.ts";
import type { Review, Scores, Screen } from "./designCouncil.ts";
import { SCREENS } from "../design-council/screens.ts";

const all = (n: number) =>
  Object.fromEntries(CATEGORIES.map((c) => [c.key, n])) as Scores;

const review = (
  reviewer: string,
  ours: Scores,
  references: Record<string, Scores> = {},
): Review => ({
  reviewer,
  ours,
  references,
  issues: [],
  keep: [],
  summary: "",
});

describe("design council options", () => {
  test("defaults: next round, target 9, three reviewers", () => {
    const o = parseArgs([]);
    assert.equal(o.round, 0);
    assert.equal(o.target, 9);
    assert.deepEqual(
      o.reviewers.map((r) => r.name),
      ["opus", "sonnet", "codex"],
    );
  });

  test("reads every option", () => {
    const o = parseArgs([
      "--name",
      "Design/Council",
      "--round",
      "3",
      "--target",
      "9.5",
      "--reviewers",
      "opus, codex:gpt-6.1",
      "--screens",
      "hero,work",
      "--minutes",
      "10",
      "--port",
      "6000",
      "--url",
      "https://preview.example.app/",
      "--review-only",
    ]);
    assert.equal(o.name, "design-council");
    assert.equal(o.round, 3);
    assert.equal(o.target, 9.5);
    assert.deepEqual(o.screens, ["hero", "work"]);
    assert.equal(o.minutes, 10);
    assert.equal(o.port, 6000);
    assert.equal(o.url, "https://preview.example.app");
    assert.equal(o.reviewOnly, true);
    assert.deepEqual(o.reviewers, [
      { name: "opus", kind: "claude", model: "claude-opus-5-5" },
      { name: "codex-gpt-6.1", kind: "codex", model: "gpt-6.1" },
    ]);
  });

  test("refuses bad values", () => {
    assert.throws(() => parseArgs(["--target", "11"]), /at most 10/);
    assert.throws(() => parseArgs(["--round", "1.5"]), /whole/);
    assert.throws(
      () => parseArgs(["--reviewers", "gemini"]),
      /Unknown reviewer/,
    );
    assert.throws(() => parseArgs(["--capture-only", "--review-only"]));
    assert.throws(() => parseArgs(["--nope"]), /Unknown option/);
    assert.throws(() => parseArgs(["--help"]), /design-council/);
    assert.throws(() => parseArgs(["--url", "www.yallakafala.org"]), /origin/);
    assert.throws(
      () => parseArgs(["--url", "https://www.yallakafala.org/en"]),
      /origin/,
    );
  });

  test("claude:<id> passes a model ID through", () => {
    assert.deepEqual(parseReviewer("claude:claude-x"), {
      name: "claude-x",
      kind: "claude",
      model: "claude-x",
    });
  });
});

describe("design council rounds and screens", () => {
  test("the next round follows the highest folder", () => {
    assert.equal(nextRound([]), 1);
    assert.equal(nextRound(["round-01", "round-03", "references", "x"]), 4);
    assert.equal(roundFolder(4), "round-04");
  });

  const screens: Screen[] = [
    { id: "home", title: "Home", path: "/", widths: [390, 1440], arabic: true },
    { id: "faqs", title: "FAQs", path: "/faqs", widths: [1440] },
  ];

  test("a shot per width, and one in Arabic at the first width", () => {
    assert.deepEqual(
      shotsFor(screens).map((s) => s.file),
      ["home-390.png", "home-1440.png", "home-390-ar.png", "faqs-1440.png"],
    );
  });

  test("paths get the language prefix", () => {
    assert.deepEqual(shotsFor(screens).map(shotPath), [
      "/en",
      "/en",
      "/ar",
      "/en/faqs",
    ]);
  });

  test("picks screens by ID and refuses unknown ones", () => {
    assert.equal(pickScreens(screens, []).length, screens.length);
    assert.deepEqual(
      pickScreens(screens, ["faqs"]).map((s) => s.id),
      ["faqs"],
    );
    assert.throws(() => pickScreens(screens, ["nope"]), /Unknown screen/);
  });

  test("the site's screens have unique, folder-safe IDs and at least one width each", () => {
    const ids = SCREENS.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const s of SCREENS) {
      assert.match(s.id, /^[a-z0-9-]+$/);
      assert.ok(s.widths.length > 0, s.id);
      assert.ok(s.path.startsWith("/"), s.id);
      assert.ok(
        !/^\/(en|ar)(\/|$)/.test(s.path),
        `${s.id}: paths carry no language prefix`,
      );
    }
  });
});

describe("design council reviewers", () => {
  test("codex: one image per flag, the prompt after --", () => {
    const args = codexArgs("Score it", ["a.png", "b.png"], "out.md");
    assert.ok(args.includes("--image=a.png"));
    assert.ok(args.includes("--image=b.png"));
    assert.deepEqual(args.slice(-2), ["--", "Score it"]);
    assert.ok(args.includes("read-only"));
  });

  test("reads Claude's json output", () => {
    assert.equal(
      claudeAnswer(`{"type":"result","result":"hello","session_id":"s"}\n`),
      "hello",
    );
    assert.throws(() => claudeAnswer("not json"));
  });

  const answer = (body: object) =>
    `Some thoughts.\n\n\`\`\`json\n${JSON.stringify(body)}\n\`\`\`\n`;

  test("parses the last json block of an answer", () => {
    const r = parseReview(
      "opus",
      answer({
        ours: all(7),
        references: { unicef: all(8) },
        issues: [
          {
            screens: ["home-390"],
            category: "typography",
            severity: "high",
            problem: "Tiny labels",
            fix: "Use 14 px",
          },
          { problem: "Odd", fix: "Fix", category: "nonsense", severity: "?" },
          { nothing: true },
        ],
        keep: ["The warm photography"],
        summary: "Decent",
      }),
      ["unicef"],
    );
    assert.equal(r.ours.typography, 7);
    assert.equal(r.references.unicef!.color, 8);
    assert.equal(r.issues.length, 2);
    assert.equal(r.issues[1]!.category, "polish");
    assert.equal(r.issues[1]!.severity, "medium");
    assert.deepEqual(r.keep, ["The warm photography"]);
  });

  test("a missing reference or category is an error", () => {
    assert.throws(
      () =>
        parseReview("opus", answer({ ours: all(7), references: {} }), [
          "unicef",
        ]),
      /unicef/,
    );
    const partial: Partial<Scores> = all(7);
    delete partial.trust;
    assert.throws(
      () => parseReview("opus", answer({ ours: partial }), []),
      /trust/,
    );
    assert.throws(() => parseReview("opus", "no json here", []), /no JSON/);
  });
});

describe("design council verdict", () => {
  test("passes only when every reviewer gives every category the target", () => {
    assert.equal(
      verdict([review("a", all(9)), review("b", all(9.5))], 9).passed,
      true,
    );
    const v = verdict(
      [review("a", all(9)), review("b", { ...all(9), mobile: 8 })],
      9,
    );
    assert.equal(v.passed, false);
    assert.deepEqual(v.gaps, [
      {
        reviewer: "b",
        category: "mobile",
        ours: 8,
        needs: 9,
        because: "target",
      },
    ]);
  });

  test("a reference scored higher than the target raises the bar", () => {
    const v = verdict(
      [review("a", all(9), { unicef: { ...all(8), color: 9.5 } })],
      9,
    );
    assert.deepEqual(v.gaps, [
      {
        reviewer: "a",
        category: "color",
        ours: 9,
        needs: 9.5,
        because: "unicef",
      },
    ]);
  });

  test("no reviews, or a reviewer that failed, never passes", () => {
    assert.equal(verdict([], 9).passed, false);
    assert.equal(verdict([review("a", all(10))], 9, ["codex"]).passed, false);
  });

  test("history and feedback", () => {
    const reviews: Review[] = [
      {
        ...review("a", { ...all(8), mobile: 6 }),
        issues: [
          {
            screens: [],
            category: "polish",
            severity: "low",
            problem: "p1",
            fix: "f1",
          },
          {
            screens: ["x"],
            category: "mobile",
            severity: "high",
            problem: "p2",
            fix: "f2",
          },
        ],
      },
    ];
    const record = roundRecord(2, "abcdef1234567", new Date(0), reviews, false);
    assert.deepEqual(record.reviewers.a, { avg: 7.8, min: 6 });
    assert.ok(
      historyTable([record]).includes("| 2 | abcdef123 | 7.8 (min 6.0) | no |"),
    );
    const md = feedbackMarkdown(reviews, verdict(reviews, 9).gaps, ["codex"]);
    assert.ok(md.indexOf("p2") < md.indexOf("p1"));
    assert.ok(md.includes("run them again): codex"));
  });
});
