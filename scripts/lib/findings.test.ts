import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, test } from "vitest";
import {
  appendLedger,
  findingsList,
  knownList,
  ledgerMarkdown,
  parseFindings,
  readLedger,
  rejectionOf,
} from "./findings";

const browser = {
  source: "browser" as const,
  area: "02-stories",
  areaTitle: "Stories",
};

const md = `# Findings

### F1: Story page shows another story's picture

- Severity: critical
- Type: functional
- Screen: Story (/en/kafala-blogs/k57abc)
- Steps:
  1. Open the story
  2. Switch to Arabic
- Expected: the same picture
- Actual: a different one
- Evidence: screenshots/F1-picture.png

### F2 - Footer link 404s
- Severity: low
- Screen: Home (/)

### Untitled note
- Severity: medium
`;

test("findings.md becomes one finding per block, steps kept with their key", () => {
  const [one, two, three] = parseFindings(md, browser);
  expect(one).toMatchObject({
    id: "browser/02-stories/F1",
    title: "Story page shows another story's picture",
    fields: {
      severity: "critical",
      screen: "Story (/en/kafala-blogs/k57abc)",
      steps: "1. Open the story\n2. Switch to Arabic",
      actual: "a different one",
    },
  });
  expect(two).toMatchObject({
    id: "browser/02-stories/F2",
    title: "Footer link 404s",
  });
  expect(three).toMatchObject({
    id: "browser/02-stories/F3",
    title: "Untitled note",
  });
  expect(parseFindings("No findings yet.", browser)).toEqual([]);
});

test("the one list puts the worst first", () => {
  const list = findingsList(parseFindings(md, browser), "Every finding");
  expect(list.indexOf("F1: Story page")).toBeLessThan(
    list.indexOf("F3: Untitled"),
  );
  expect(list.indexOf("F3: Untitled")).toBeLessThan(list.indexOf("F2: Footer"));
  expect(list).toContain("3 findings.");
});

test("the ledger keeps rejections across runs, and agents see their area's", () => {
  const file = join(mkdtempSync(join(tmpdir(), "ledger-")), "not-bugs.jsonl");
  const [one, two] = parseFindings(md, browser);
  appendLedger(file, [
    rejectionOf(one!, "2026-11-18-1000", "the picture is a placeholder"),
  ]);
  appendLedger(file, [
    rejectionOf(two!, "2026-11-19-1000", "the link is right"),
    rejectionOf(one!, "2026-11-19-1000", "still a placeholder"),
  ]);
  const ledger = readLedger(file);
  expect(ledger).toHaveLength(3);
  expect(ledger[1]).toMatchObject({
    where: "Home (/)",
    reason: "the link is right",
  });

  const known = knownList(ledger, "02-stories", [
    { id: "YKBUGS-1", title: "Fix: slider overlaps the text" },
  ]);
  expect(known).toContain("Judged not a bug in earlier sweeps:");
  expect(known).toContain("Already have an open bug:");
  expect(known.match(/Story page shows/g)).toHaveLength(1);
  expect(known).toContain("- YKBUGS-1: Fix: slider overlaps the text");
  expect(knownList(ledger, "03-support", [])).toContain("- none yet");
  expect(ledgerMarkdown(ledger)).toContain("the link is right");
  expect(ledgerMarkdown(ledger)).toContain("# Not bugs");
});

test("a broken ledger line is skipped, not fatal", () => {
  const file = join(mkdtempSync(join(tmpdir(), "ledger-")), "not-bugs.jsonl");
  appendLedger(file, [
    rejectionOf(parseFindings(md, browser)[0]!, "r", "not a bug"),
  ]);
  appendLedger(file, []);
  const text = readFileSync(file, "utf8");
  writeFileSync(file, `${text}{not json\n`);
  expect(readLedger(file)).toHaveLength(1);
});
