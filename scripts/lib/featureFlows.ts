/**
 * The feature map's flows (docs/agents/feature-map.md) and the bug sweep's
 * result for each one. Browser agents walk the flows of their group
 * (scripts/lib/browserHunt.ts `flowsFor`) and write one row per flow in
 * `flows.md`; the sweep turns those rows into `flows.json` and a pass rate
 * per group, which the bug council scores (scripts/lib/bugCouncil.ts).
 */

export type Flow = {
  /** `<role>/<title>` as slugs, e.g. `public-visitor/home`. */
  id: string;
  /** The `##` section the flow is under. */
  role: string;
  /** The `###` heading. */
  title: string;
  /** The path after the language prefix, without the backticks; "" when none. */
  route: string;
};

/** Lower-case letters and digits, one hyphen between words. */
function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The flows of the feature map: each `###` heading under a `##` section,
 * with its Route line. The role's slug drops a parenthetical ("Admin (any
 * signed-in editor)" is `admin`). A duplicate id throws.
 */
export function parseFeatureMap(markdown: string): Flow[] {
  const flows: Flow[] = [];
  const seen = new Set<string>();
  let role = "";
  let fenced = false;
  let open: Flow | null = null;
  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    const section = /^##\s+(.+?)\s*$/.exec(line);
    if (section) {
      role = section[1]!;
      open = null;
      continue;
    }
    const heading = /^###\s+(.+?)\s*$/.exec(line);
    if (heading) {
      const title = heading[1]!;
      const id = `${slug(role.replace(/\s*\(.*\)\s*$/, ""))}/${slug(title)}`;
      if (seen.has(id)) throw new Error(`Duplicate flow id ${id}`);
      seen.add(id);
      open = { id, role, title, route: "" };
      flows.push(open);
      continue;
    }
    if (open && !open.route) {
      const route = /^-\s+\*\*Route\*\*:\s*(.+?)\s*$/.exec(line);
      if (route) open.route = route[1]!.replace(/`/g, "");
    }
  }
  return flows;
}

export const RESULTS = ["pass", "fail", "blocked", "not reached"] as const;
export type FlowResult = (typeof RESULTS)[number];

export type FlowRow = {
  id: string;
  result: FlowResult;
  /** The finding that explains a `fail` or `blocked` (`F3`), or "". */
  finding: string;
};

/**
 * The agent's `flows.md` (`| Flow id | Result | Finding |`) as one row per
 * expected flow, in that order. A flow with no row, or with a result that
 * isn't one of the four words, is `not reached`; rows for other ids are
 * dropped; when an id has two rows the later one wins.
 */
export function parseFlowResults(
  markdown: string,
  expectedIds: string[],
): FlowRow[] {
  const expected = new Set(expectedIds);
  const rows = new Map<string, FlowRow>();
  for (const line of markdown.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;
    const cells = trimmed
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());
    const id = cells[0]?.replace(/[`*]/g, "").trim() ?? "";
    if (!expected.has(id)) continue;
    const word = (cells[1] ?? "")
      .replace(/[`*]/g, "")
      .trim()
      .toLowerCase()
      .replace(/[-_]+/g, " ");
    const result = RESULTS.find((r) => r === word) ?? "not reached";
    rows.set(id, { id, result, finding: cells.slice(2).join(" | ").trim() });
  }
  return expectedIds.map(
    (id) => rows.get(id) ?? { id, result: "not reached", finding: "" },
  );
}

export type FlowScore = {
  pass: number;
  fail: number;
  blocked: number;
  notReached: number;
  /** pass ÷ (pass + fail + blocked); null when no flow was walked. */
  rate: number | null;
};

export function flowScore(results: { result: FlowResult }[]): FlowScore {
  const count = (r: FlowResult) => results.filter((x) => x.result === r).length;
  return scoreOf(
    count("pass"),
    count("fail"),
    count("blocked"),
    count("not reached"),
  );
}

function scoreOf(
  pass: number,
  fail: number,
  blocked: number,
  notReached: number,
): FlowScore {
  const walked = pass + fail + blocked;
  return {
    pass,
    fail,
    blocked,
    notReached,
    rate: walked === 0 ? null : pass / walked,
  };
}

/** The scores of several areas as one (counts added, the rate recomputed). */
export function combineScores(scores: FlowScore[]): FlowScore {
  const sum = (key: "pass" | "fail" | "blocked" | "notReached") =>
    scores.reduce((n, s) => n + s[key], 0);
  return scoreOf(sum("pass"), sum("fail"), sum("blocked"), sum("notReached"));
}

/** "93%", or "–" when nothing was walked. */
export function rateText(rate: number | null): string {
  return rate === null ? "–" : `${Math.round(rate * 100)}%`;
}

/** One browser group's flows and what the agent found, as `flows.json` holds them. */
export type GroupFlows = {
  group: number;
  slug: string;
  title: string;
  score: FlowScore;
  flows: (FlowRow & { title: string; route: string })[];
};

/** `flows.json` in a sweep run folder. */
export type FlowsFile = { run: string; groups: GroupFlows[] };
