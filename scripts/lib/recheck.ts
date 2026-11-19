/**
 * `pnpm bug-sweep --recheck YKBUGS-12,YKBUGS-15`: a short sweep that goes back
 * to bugs already marked fixed and says, for each, whether the problem is
 * gone in the running app. This module is the pure part: reading a bug from
 * the bug file's JSON, choosing the browser group for it, the "Check these
 * first" part of the agent's prompt, reading the agent's `rechecks.md`, and
 * what goes back to the bug file for a bug that is still there (a comment and
 * the `new` status; never a second bug).
 */
import { GROUPS, groupsOf } from "./browserHunt";
import type { Flow } from "./featureFlows";

export const RECHECK_RESULTS = [
  "fixed",
  "still there",
  "could not check",
] as const;
export type RecheckResult = (typeof RECHECK_RESULTS)[number];

/**
 * The status a bug goes back to when it is still there: `new`, the bug
 * file's open status (it holds `new`, `in_progress`, `fixed` and `wont_fix`).
 */
export const REOPEN_STATUS = "new";

export type RecheckBug = {
  key: string;
  title: string;
  status: string;
  /** The commit the fix landed in, if the bug file has it. */
  fixedIn?: string;
  /** What was wrong, for the agent: the bug's Problem section, else its title. */
  wrong: string;
  /** How to see it: the Steps or Evidence of the bug, else its whole text. */
  steps: string;
  screen?: string;
  who?: string;
  width?: string;
  /** The browser group the sweep filed it under (its `group`, else the finding id in its `ref`). */
  area?: number;
  /** The screen's route, as far as the bug text names one. */
  route?: string;
};

export type RecheckRow = {
  bug: string;
  result: RecheckResult;
  evidence: string;
};

/** A bug and the group that will check it. */
export type Assignment = {
  bug: RecheckBug;
  /** 0 when no group will check it (see `note`). */
  group: number;
  note?: string;
};

const MAX_TEXT = 1200;

/** The text under a `###`/`##` heading that starts with `name`, up to the next heading. */
function section(text: string, name: string): string | undefined {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) =>
    new RegExp(`^#{2,4}\\s*${name}\\b`, "i").test(l),
  );
  if (start === -1) return undefined;
  const body: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (/^#{2,4}\s/.test(line)) break;
    body.push(line);
  }
  const out = body.join("\n").trim();
  return out || undefined;
}

/** The value of a `- Name: value` line of a finding block. */
function field(text: string, name: string): string | undefined {
  const m = new RegExp(`^[-*]\\s*${name}:\\s*(.+)$`, "im").exec(text);
  return m?.[1]?.trim() || undefined;
}

const cap = (text: string) =>
  text.length > MAX_TEXT ? `${text.slice(0, MAX_TEXT).trimEnd()}…` : text;

/** The browser group named in a finding id like `browser/05-admin-stories/F2`, or by its slug alone. */
export function areaOf(text: string): number | undefined {
  const m = /\bbrowser\/(\d{2}-[a-z0-9-]+)\/F\d+/.exec(text);
  const slug = m?.[1] ?? /^\s*(\d{2}-[a-z0-9-]+)\s*$/.exec(text)?.[1];
  return GROUPS.find((g) => g.slug === slug)?.id;
}

const CODE_DIRS =
  /^\/(apps|convex|scripts|packages|node_modules|src|docs|public)\b/;

/** The first route of the app the text names: a `Screen:` line, else a `/path` token. */
export function routeIn(text: string): string | undefined {
  const screen = field(text, "Screen");
  const fromScreen = screen && /\((\/[^)\s]*)\)/.exec(screen)?.[1];
  if (fromScreen) return fromScreen;
  for (const m of text.matchAll(/(?:^|[\s`(])(\/[a-z][\w\-/]*)/gim)) {
    if (!CODE_DIRS.test(m[1]!)) return m[1]!;
  }
  return undefined;
}

/**
 * A real URL path as the feature map writes it (`/en/kafala-blogs/k17abc` →
 * `/kafala-blogs/{id}`), without the language prefix and the query.
 */
export function templateRoute(path: string): string {
  const parts = path
    .split(/[?#]/)[0]!
    .replace(/^\/(ar|en)(?=\/|$)/, "")
    .split("/")
    .filter(Boolean);
  if (
    (parts[0] === "kafala-blogs" || parts[0] === "kafala-articles") &&
    parts[1]
  )
    parts[1] = "{id}";
  else if (parts[0] === "resources" && parts[1]) parts[1] = "{slug}";
  return `/${parts.join("/")}`;
}

/**
 * The browser group whose flows include this route: the flow with exactly
 * this route (the first one when several share it, such as `/`), else an
 * admin page under a flow's route (`/admin/blogs/edit` is under
 * `/admin/blogs`); undefined if none does.
 */
export function groupOfRoute(route: string, flows: Flow[]): number | undefined {
  const template = templateRoute(route);
  const exact = flows.find((f) => f.route === template);
  const under = flows
    .filter((f) => f.route !== "/" && template.startsWith(`${f.route}/`))
    .sort((a, b) => b.route.length - a.route.length)[0];
  const flow = exact ?? under;
  return flow ? groupsOf(flow)[0] : undefined;
}

/** A bug from `pnpm -s bug-tracker get <KEY> --json`; null when the JSON isn't one. */
export function parseBug(json: string): RecheckBug | null {
  let bug: Record<string, unknown> | undefined;
  try {
    const parsed = JSON.parse(json) as { bug?: Record<string, unknown> };
    bug = parsed.bug;
  } catch {
    return null;
  }
  if (!bug || typeof bug.key !== "string") return null;
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const description = str(bug.evidence);
  const title = str(bug.title) || bug.key;
  const text = `${str(bug.group)}\n${str(bug.ref)}\n${description}`;
  const steps =
    section(description, "Steps") ??
    field(description, "Steps") ??
    section(description, "Evidence") ??
    description;
  const route = routeIn(description);
  return {
    key: bug.key,
    title,
    status: str(bug.status),
    fixedIn: str(bug.fixedIn) || undefined,
    wrong: cap(section(description, "Problem") ?? title),
    steps: cap(steps.trim() || title),
    screen: field(description, "Screen"),
    who: field(description, "Who"),
    width: field(description, "Width"),
    area: areaOf(str(bug.group)) ?? areaOf(text),
    route,
  };
}

/**
 * The group each bug is checked in: the area it was filed under, else the
 * group of the screen's route, else group 1 with a note. `groups` is
 * `--groups` (empty: not given). Returns the groups the sweep runs (the given
 * ones, else the groups of the bugs) and one assignment per bug; a bug whose
 * group isn't in the given list gets group 0 and a note, and is reported as
 * not checked.
 */
export function recheckGroups(
  bugs: RecheckBug[],
  groups: number[],
  flows: Flow[],
): { groups: number[]; assignments: Assignment[] } {
  const assignments = bugs.map((bug): Assignment => {
    let group = bug.area;
    let note: string | undefined;
    if (group === undefined && bug.route) {
      group = groupOfRoute(bug.route, flows);
      if (group === undefined)
        note = `its screen (${bug.route}) fits no group: checked in group 1`;
    } else if (group === undefined) {
      note = "no area or screen in the bug: checked in group 1";
    }
    group ??= 1;
    if (groups.length && !groups.includes(group))
      return {
        bug,
        group: 0,
        note: `its group (${group}) is not in --groups`,
      };
    return { bug, group, note };
  });
  const run = groups.length
    ? [...groups]
    : [...new Set(assignments.map((a) => a.group))].sort((a, b) => a - b);
  return { groups: run, assignments };
}

/**
 * The "Check these first" part of one browser agent's prompt: its bugs, how
 * to check them and where to write the answer. Empty when it has none.
 */
export function checkFirstPart(bugs: RecheckBug[], folder: string): string {
  if (!bugs.length) return "";
  const list = bugs
    .map((b) =>
      [
        `### ${b.key}: ${b.title}`,
        b.fixedIn ? `- Fixed in: \`${b.fixedIn.slice(0, 12)}\`` : "",
        b.screen ? `- Screen: ${b.screen}` : "",
        b.who ? `- Who: ${b.who}` : "",
        b.width ? `- Width: ${b.width}` : "",
        `- What was wrong: ${b.wrong.replace(/\n+/g, " ")}`,
        `- Steps:\n${b.steps
          .split("\n")
          .map((l) => `  ${l}`)
          .join("\n")}`,
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");
  return `## Check these first

These bugs were found by earlier sweeps and are marked fixed. **Before your brief**, check each one in the app: follow its steps (as the person it names, at the width it names), then do it a second time. Write one row per bug in \`${folder}/rechecks.md\`, starting the file with \`| Bug | Result | Evidence |\` and \`|---|---|---|\`, as soon as you have checked it. Result is one of:

- \`fixed\`: you followed the steps twice and the problem is gone. Evidence: what you saw instead.
- \`still there\`: the problem is still there. Evidence: what you saw, and a screenshot saved in \`${folder}/screenshots/\` (\`R-<bug key>.png\`).
- \`could not check\`: you could not follow the steps (the screen, the record or the person is missing). Evidence: why.

Don't write a finding for a bug that is still there: its row is enough. When all rows are written, carry on with your brief for the rest of your time.

${list}`;
}

/**
 * The rows of an agent's `rechecks.md`, one per key in `keys`, in order. A
 * key with no row, or a row with a result that isn't one of the three, is
 * `could not check`. A later row for the same bug wins.
 */
export function parseRechecks(markdown: string, keys: string[]): RecheckRow[] {
  const rows = new Map<string, RecheckRow>();
  for (const line of markdown.split(/\r?\n/)) {
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 2) continue;
    const key = cells[0]!.replace(/[`*]/g, "").toUpperCase();
    const result = cells[1]!
      .replace(/[`*]/g, "")
      .toLowerCase()
      .replace(/[-_]+/g, " ");
    const evidence = cells.slice(2).join(" | ").trim();
    const known = RECHECK_RESULTS.find((r) => r === result);
    rows.set(key, {
      bug: key,
      result: known ?? "could not check",
      evidence:
        known || !evidence
          ? evidence
          : `${cells[1]} (not a result word). ${evidence}`,
    });
  }
  return keys.map((k) => {
    const key = k.toUpperCase();
    return (
      rows.get(key) ?? {
        bug: key,
        result: "could not check",
        evidence: "the agent wrote no row for it",
      }
    );
  });
}

/** What the sweep needs from the bug file to put a bug that is still there back. */
export type RecheckTracker = {
  comment(key: string, body: string): boolean;
  setStatus(key: string, status: string): boolean;
};

export type RecheckAction = {
  bug: string;
  commented: boolean;
  reopened: boolean;
};

/**
 * A bug that is `still there` gets a comment with the evidence and goes back
 * to `new`. Nothing else is written: not a new bug, not for `fixed` or `could
 * not check`. `tracker` is undefined with `--no-tickets`: nothing is written
 * then.
 */
export function applyRechecks(
  rows: RecheckRow[],
  runId: string,
  tracker: RecheckTracker | undefined,
): RecheckAction[] {
  if (!tracker) return [];
  return rows
    .filter((r) => r.result === "still there")
    .map((r) => {
      const commented = tracker.comment(
        r.bug,
        `Bug sweep ${runId} checked this fix again and the problem is still there.\n\n${r.evidence || "(no evidence written)"}`,
      );
      const reopened = tracker.setStatus(r.bug, REOPEN_STATUS);
      return { bug: r.bug, commented, reopened };
    });
}

/** The file `recheck` writes in the run folder. */
export type RechecksFile = {
  run: string;
  rechecks: (RecheckRow & { group: number; note?: string; title: string })[];
  actions: RecheckAction[];
};

/** One row per assignment, for `rechecks.json` and the report. */
export function recheckRows(
  assignments: Assignment[],
  found: RecheckRow[],
): RechecksFile["rechecks"] {
  return assignments.map((a) => {
    const row = found.find((r) => r.bug === a.bug.key.toUpperCase());
    const outcome =
      a.group === 0
        ? {
            result: "could not check" as const,
            evidence: a.note ?? "no group checked it",
          }
        : row
          ? { result: row.result, evidence: row.evidence }
          : {
              result: "could not check" as const,
              evidence: "the agent wrote no row for it",
            };
    return {
      bug: a.bug.key,
      title: a.bug.title,
      group: a.group,
      note: a.note,
      ...outcome,
    };
  });
}
