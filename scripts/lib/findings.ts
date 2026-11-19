import { appendFileSync, existsSync, readFileSync } from "node:fs";

/**
 * The bug sweep's findings (scripts/bug-sweep.ts): what the agents wrote in
 * their findings.md, read into one list, and the ledger of findings the Opus
 * agent judged not real, which later sweeps show their agents so they don't
 * report them again. Nothing filters the list before Opus sees it.
 */

/** Where a finding came from: the browser agents are the only source here. */
export type Source = "browser";

const SOURCE_TITLES: Record<Source, string> = {
  browser: "Browser",
};

export type Finding = {
  /** Unique in a run: `browser/02-stories/F3`. */
  id: string;
  source: Source;
  /** The browser group's slug, and its title. */
  area: string;
  areaTitle: string;
  title: string;
  /** The `- Key: value` lines, keys lower-cased (`severity`, `where`, `steps`…). */
  fields: Record<string, string>;
  /** The block as the agent wrote it, without its heading. */
  text: string;
};

/**
 * Reads an agent's findings.md: one `### F<n>: <title>` block per finding
 * with `- Key: value` lines; a line that isn't a new key (a numbered step,
 * a wrapped sentence) belongs to the key above it. Blocks without a number
 * get one by their position.
 */
export function parseFindings(
  markdown: string,
  where: { source: Source; area: string; areaTitle: string },
): Finding[] {
  const blocks = markdown.split(/^### /m).slice(1);
  return blocks.map((block, i) => {
    const [heading = "", ...rest] = block.split("\n");
    const match = /^(F\d+)\s*[:.-]\s*(.*)$/.exec(heading.trim());
    const number = match?.[1] ?? `F${i + 1}`;
    const title = (match?.[2] ?? heading).trim();
    const fields: Record<string, string> = {};
    let key: string | null = null;
    for (const line of rest) {
      const field = /^- ([A-Za-z][\w ]*?):\s*(.*)$/.exec(line);
      if (field) {
        key = field[1]!.toLowerCase();
        fields[key] = field[2]!.trim();
      } else if (key && line.trim() && !line.startsWith("```")) {
        fields[key] = `${fields[key]}\n${line.trim()}`.trim();
      }
    }
    return {
      id: `${where.source}/${where.area}/${number}`,
      ...where,
      title,
      fields,
      text: rest.join("\n").trim(),
    };
  });
}

/** Where a finding is: the code location, or the screen. */
export function locationOf(f: Finding): string {
  return f.fields.where ?? f.fields.screen ?? "";
}

/** The one list of every finding, worst first, as Markdown. */
export function findingsList(findings: Finding[], heading: string): string {
  const rank = (f: Finding) =>
    ["critical", "high", "medium", "low"].indexOf(
      (f.fields.severity ?? "").split(/[\s|]/)[0]!.toLowerCase(),
    ) >>> 0;
  const sorted = [...findings].sort((a, b) => rank(a) - rank(b));
  return [
    `# ${heading}`,
    `${findings.length} findings.`,
    ...sorted.map((f) =>
      [
        `## ${f.id}: ${f.title}`,
        `${SOURCE_TITLES[f.source]}, ${f.areaTitle}.`,
        f.text,
      ].join("\n\n"),
    ),
  ].join("\n\n");
}

/** One finding the Opus agent judged not real, as the ledger keeps it. */
export type Rejection = {
  id: string;
  run: string;
  source: Source;
  area: string;
  title: string;
  where: string;
  /** Why Opus judged it not a bug. */
  reason: string;
};

export function rejectionOf(
  f: Finding,
  run: string,
  reason: string,
): Rejection {
  return {
    id: f.id,
    run,
    source: f.source,
    area: f.area,
    title: f.title,
    where: locationOf(f),
    reason,
  };
}

/** The ledger: one JSON object per line, oldest first. Unreadable lines are skipped. */
export function readLedger(file: string): Rejection[] {
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => line.trim())
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as Rejection];
      } catch {
        return [];
      }
    });
}

export function appendLedger(file: string, entries: Rejection[]) {
  if (entries.length)
    appendFileSync(file, entries.map((e) => JSON.stringify(e) + "\n").join(""));
}

/**
 * What an agent is told not to report again: the ledger's entries for its
 * area (newest first, the same title once) and the bugs that are already
 * open.
 */
export function knownList(
  ledger: Rejection[],
  area: string,
  openBugs: { id: string; title: string }[],
  limit = 50,
): string {
  const seen = new Set<string>();
  const rejected = ledger
    .filter((e) => e.area === area)
    .reverse()
    .filter((e) => {
      const key = e.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit)
    .map((e) => `- ${e.title}${e.where ? ` (${e.where})` : ""}`);
  const ticketed = openBugs.slice(0, limit).map((t) => `- ${t.id}: ${t.title}`);
  return [
    "Judged not a bug in earlier sweeps:",
    rejected.join("\n") || "- none yet",
    "Already have an open bug:",
    ticketed.join("\n") || "- none yet",
  ].join("\n\n");
}

/** The whole ledger, newest first, for a person to read (not-bugs.md). */
export function ledgerMarkdown(ledger: Rejection[]): string {
  return (
    [
      "# Not bugs: findings the bug sweep rejected",
      `${ledger.length} entries. Each sweep shows an agent the entries for its area so it doesn't report them again. To bring one back, delete its line from not-bugs.jsonl.`,
      "| Run | Area | Finding | Where | Why not a bug |\n|---|---|---|---|---|\n" +
        [...ledger]
          .reverse()
          .map(
            (e) =>
              `| ${e.run} | ${e.source}/${e.area} | ${e.title.replaceAll("|", "/")} | ${e.where.replaceAll("|", "/")} | ${(e.reason ?? "").replace(/\s+/g, " ").replaceAll("|", "/")} |`,
          )
          .join("\n"),
    ].join("\n\n") + "\n"
  );
}
