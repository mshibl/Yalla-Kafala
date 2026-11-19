import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";
import { DEFAULTS, fill, parseArgs, PROJECT, ticketArgs } from "./bugSweep";
import { ROOT } from "./paths";

test("defaults: the branch you are on, all groups, bugs numbered YKBUGS", () => {
  expect(parseArgs([])).toEqual(DEFAULTS);
  expect(DEFAULTS).toMatchObject({
    ref: "HEAD",
    groups: [],
    recheck: [],
    browserPerWave: 2,
    browserMinutes: 15,
    ticketMinutes: 60,
    build: true,
    tickets: true,
    dryRun: false,
  });
  expect(PROJECT).toBe("YKBUGS");
});

test("flags", () => {
  expect(
    parseArgs([
      "--ref",
      "origin/dev",
      "--groups",
      "3,5",
      "--browser-per-wave",
      "1",
      "--browser-minutes",
      "5",
      "--ticket-minutes",
      "30",
      "--no-build",
      "--no-tickets",
      "--dry-run",
    ]),
  ).toEqual({
    ref: "origin/dev",
    groups: [3, 5],
    recheck: [],
    browserPerWave: 1,
    browserMinutes: 5,
    ticketMinutes: 30,
    build: false,
    tickets: false,
    dryRun: true,
  });
});

test("--recheck takes bug keys, with or without the prefix, in any case", () => {
  expect(parseArgs(["--recheck", "YKBUGS-12,15, ykbugs-3"]).recheck).toEqual([
    "YKBUGS-12",
    "YKBUGS-15",
    "YKBUGS-3",
  ]);
  expect(() => parseArgs(["--recheck", "bug-one"])).toThrow(/keys like/);
  expect(() => parseArgs(["--recheck"])).toThrow(/needs a value/);
});

test("the Hakimy-only options are gone", () => {
  for (const flag of [
    "--only",
    "--systems",
    "--code-minutes",
    "--jev-threshold",
    "--slot",
    "--sequential",
  ])
    expect(() => parseArgs([flag, "1"])).toThrow(/Unknown option/);
});

test("the Opus prompt fills with every placeholder, files with the one source and names the local bug file", () => {
  const template = readFileSync(
    join(ROOT, "scripts/bug-sweep/tickets.md"),
    "utf8",
  );
  const filled = fill(template, {
    SHA: "abc",
    RUN_DIR: "/r",
    RUN_ID: "id",
    COUNT: "1",
    MINUTES: "5",
    DEADLINE: "10:00",
    PROJECT: "YKBUGS",
    BROWSER_NOTE: "",
  });
  expect(filled).toContain("pnpm -s bug-tracker new --source sweep");
  expect(filled).not.toMatch(/\bkb\b/);
  expect(filled).not.toMatch(/jev/i);
  expect(filled).not.toContain("{{");
});

test("there is no nightly installer", () => {
  expect(() =>
    readFileSync(join(ROOT, "scripts/bug-sweep/nightly.sh"), "utf8"),
  ).toThrow();
});

test("bad values are refused", () => {
  expect(() => parseArgs(["--ref", "--dry-run"])).toThrow(/needs a value/);
  expect(() => parseArgs(["--groups", "0"])).toThrow(/positive number/);
  expect(() => parseArgs(["--browser-minutes", "x"])).toThrow(
    /positive number/,
  );
  expect(() => parseArgs(["--fast"])).toThrow(/Unknown option --fast/);
});

test("fill refuses a placeholder with no value", () => {
  expect(fill("{{a}} and {{b}}", { a: "1", b: "2" })).toBe("1 and 2");
  expect(() => fill("{{missing}}", {})).toThrow(/missing/);
});

test("the ticket agent runs on Opus, writes only in the run folder and files bugs with the bug-tracker command", () => {
  const args = ticketArgs("go", "/tmp/run");
  expect(args).toContain("claude-opus-5-5");
  expect(args).toEqual(
    expect.arrayContaining([
      "Edit(//tmp/run/**)",
      "Bash(pnpm -s bug-tracker new:*)",
      "Bash(pnpm -s bug-tracker list:*)",
    ]),
  );
  expect(args.filter((a) => a.includes("kb "))).toEqual([]);
  expect(args).not.toContain("Edit");
  expect(args).not.toContain("Write");
});
