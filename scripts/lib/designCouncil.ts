/**
 * The design council (scripts/design-council.ts): a panel of models scores
 * answers a yes/no checklist (scripts/design-council/checklist.ts) for
 * screenshots of the app, side by side with screenshots of other apps, and
 * says what to fix. An agent fixes the UI and runs another round
 * (.claude/skills/design-council/SKILL.md). A score is the share of checks
 * that pass, so it moves when a check starts passing.
 *
 * This module holds the pure parts: options, the rubric, the reviewers'
 * command lines, reading their answers, the issue ledger, the comparison with
 * the last round, and the verdict (done, or why not) and `stalled`. The reviewers never
 * see the target or earlier rounds' scores: a reviewer told the goal tends to
 * answer near it.
 */
import { fill } from "./bugSweep";
import { CHECKLIST } from "../design-council/checklist";

/** The rubric: the categories the checklist is grouped in. */
export const CATEGORIES = [
  { key: "hierarchy", title: "Visual hierarchy and focus" },
  { key: "typography", title: "Typography" },
  { key: "color", title: "Colour and contrast" },
  { key: "spacing", title: "Spacing, alignment and density" },
  { key: "consistency", title: "Consistency across screens" },
  { key: "components", title: "Components, icons and controls" },
  { key: "mobile", title: "Phone layout (360 px)" },
  { key: "rtl", title: "Arabic and right to left" },
  { key: "polish", title: "Overall polish and character" },
] as const;

export type Category = (typeof CATEGORIES)[number]["key"];

/** A reviewer's answer to one check. `na`: the screenshots can't show it. */
export type Answer = "pass" | "fail" | "na";

/** Answers by check ID. */
export type Answers = Record<string, Answer>;

/**
 * Shares of passing checks, whole percentages 0–100: a category's share of
 * its non-`na` checks, and the overall share (the average of the categories
 * that have any). `null`: every check of it was `na`.
 */
export type Shares = {
  categories: Record<Category, number | null>;
  overall: number | null;
};

/**
 * The shares in a set of answers. A check with no answer counts nowhere; a
 * category with only `na` checks has no share and is left out of the overall.
 */
export function checklistScores(
  answers: Answers,
  checklist: { id: string; category: Category }[] = CHECKLIST,
): Shares {
  const categories = {} as Shares["categories"];
  const shares: number[] = [];
  for (const { key } of CATEGORIES) {
    let passed = 0;
    let counted = 0;
    for (const check of checklist) {
      if (check.category !== key) continue;
      const answer = answers[check.id];
      if (answer === "pass") passed++;
      if (answer === "pass" || answer === "fail") counted++;
    }
    categories[key] = counted ? Math.round((passed / counted) * 100) : null;
    if (counted) shares.push((passed / counted) * 100);
  }
  return {
    categories,
    overall: shares.length
      ? Math.round(shares.reduce((a, b) => a + b, 0) / shares.length)
      : null,
  };
}

/** The models, as the Claude Code CLI takes them. */
export const CLAUDE_MODELS: Record<string, string> = {
  opus: "claude-opus-5-5",
  sonnet: "claude-sonnet-5-5",
  fable: "claude-fable-5-1",
  haiku: "claude-haiku-5-5",
};

/**
 * A reviewer: a Claude model through the Claude Code CLI, or Codex (another
 * provider, which is the point of a council) through `codex exec`.
 */
export type Reviewer =
  | { name: string; kind: "claude"; model: string }
  | { name: string; kind: "codex"; model?: string };

/** `opus`, `sonnet`, `claude:<model id>`, `codex` or `codex:<model>`. */
export function parseReviewer(spec: string): Reviewer {
  const [kind, model] = spec.split(":", 2) as [string, string | undefined];
  if (kind === "codex")
    return model
      ? { name: `codex-${model}`, kind: "codex", model }
      : { name: "codex", kind: "codex" };
  if (kind === "claude" && model) return { name: model, kind: "claude", model };
  const known = CLAUDE_MODELS[kind];
  if (known && !model) return { name: kind, kind: "claude", model: known };
  throw new Error(
    `Unknown reviewer ${spec}: use ${Object.keys(CLAUDE_MODELS).join(", ")}, claude:<model id>, codex or codex:<model>`,
  );
}

export type Options = {
  /** The round to run; 0 means the one after the last in the run folder. */
  round: number;
  /** The run's folder name under reports/design-council/. */
  name: string;
  /** The share of checks (0–100) every reviewer's category must reach. */
  target: number;
  reviewers: Reviewer[];
  /** Screen IDs to capture; empty means all. */
  screens: string[];
  /** Minutes each reviewer gets. */
  minutes: number;
  /** Capture only: no reviewers. */
  captureOnly: boolean;
  /** Review the screenshots already in the round's folder again. */
  reviewOnly: boolean;
  /** Print the reviewers' prompt and stop: no app, no browser, no reviewers. */
  dryRun: boolean;
};

export const DEFAULTS: Options = {
  round: 0,
  name: "",
  target: 90,
  reviewers: ["opus", "sonnet", "codex"].map(parseReviewer),
  screens: [],
  minutes: 20,
  captureOnly: false,
  reviewOnly: false,
  dryRun: false,
};

export const USAGE = `pnpm design-council [options]
  --name <name>          the run's folder under reports/design-council/ (default: the branch)
  --round <n>            the round to run (default: the next one)
  --target <percent>     the overall share of passing checks every reviewer must reach (default 90)
  --reviewers <list>     comma-separated: opus, sonnet, fable, haiku, claude:<id>,
                         codex, codex:<model> (default opus,sonnet,codex; a
                         missing codex CLI is skipped)
  --screens <ids>        only these screens (scripts/design-council/screens.ts)
  --minutes <n>          each reviewer's time limit (default 20)
  --capture-only         take the screenshots, skip the reviewers
  --review-only          review this round's screenshots again, skip the app
  --dry-run              print the reviewers' prompt and stop (no app, no browser, no reviewers)`;

export function parseArgs(argv: string[]): Options {
  const options: Options = { ...DEFAULTS };
  const positive = (flag: string, value: string): number => {
    const n = Number(value);
    if (!Number.isFinite(n) || n <= 0)
      throw new Error(`${flag} needs a positive number`);
    return n;
  };
  for (let i = 0; i < argv.length; i++) {
    const flag = argv[i]!;
    const value = argv[i + 1];
    const takes = () => {
      if (!value || value.startsWith("--"))
        throw new Error(`${flag} needs a value`);
      i++;
      return value;
    };
    switch (flag) {
      case "--name":
        options.name = slug(takes());
        break;
      case "--round": {
        const round = positive(flag, takes());
        if (!Number.isInteger(round))
          throw new Error("--round is a whole number");
        options.round = round;
        break;
      }
      case "--target":
        options.target = positive(flag, takes());
        if (options.target > 100) throw new Error("--target is at most 100");
        break;
      case "--reviewers":
        options.reviewers = takes()
          .split(",")
          .map((s) => parseReviewer(s.trim()));
        break;
      case "--screens":
        options.screens = takes()
          .split(",")
          .map((s) => s.trim());
        break;
      case "--minutes":
        options.minutes = positive(flag, takes());
        break;
      case "--capture-only":
        options.captureOnly = true;
        break;
      case "--review-only":
        options.reviewOnly = true;
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      default:
        throw new Error(`Unknown option ${flag}\n\n${USAGE}`);
    }
  }
  if (options.captureOnly && options.reviewOnly)
    throw new Error("--capture-only and --review-only exclude each other");
  return options;
}

/** A folder-safe name: `design/council` → `design-council`. */
export function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** The round after the highest `round-<n>` folder, or 1. */
export function nextRound(folders: string[]): number {
  const rounds = folders
    .map((f) => /^round-(\d+)$/.exec(f)?.[1])
    .filter((n): n is string => n !== undefined)
    .map(Number);
  return rounds.length ? Math.max(...rounds) + 1 : 1;
}

/** `round-03`: sorts as text. */
export function roundFolder(round: number): string {
  return `round-${String(round).padStart(2, "0")}`;
}

// ---- Screens ------------------------------------------------------------

export type Screen = {
  /** Unique, folder-safe; the screenshot's file name starts with it. */
  id: string;
  title: string;
  /**
   * "admin" signs in as the test admin first (`GET /api/council/login`, test
   * mode only); null is a visitor with no session.
   */
  as: "admin" | null;
  /** The path without the language prefix; `{name}` takes a found value. */
  path: string;
  /** The path has no language prefix (the admin area has none). */
  unprefixed?: boolean;
  /** Widths to capture it at. */
  widths: number[];
  /** Also capture it in Arabic (at the first width). */
  arabic?: boolean;
};

/**
 * A value a screen's path needs (a blog's ID): the first match of `pattern`
 * in the link targets of the English page `open` (a visitor sees it).
 */
export type Lookup = {
  name: string;
  open: string;
  pattern: RegExp;
};

/** One screenshot: which screen, at what width, in which language. */
export type Shot = {
  screen: Screen;
  width: number;
  locale: "en" | "ar";
  file: string;
};

/** Every screenshot the screens ask for, in order. */
export function shotsFor(screens: Screen[]): Shot[] {
  return screens.flatMap((screen) => [
    ...screen.widths.map((width) => ({
      screen,
      width,
      locale: "en" as const,
      file: `${screen.id}-${width}.png`,
    })),
    ...(screen.arabic
      ? [
          {
            screen,
            width: screen.widths[0]!,
            locale: "ar" as const,
            file: `${screen.id}-${screen.widths[0]}-ar.png`,
          },
        ]
      : []),
  ]);
}

/**
 * The path with its `{name}` values filled and the language prefix (none for
 * a path with `unprefixed`, such as the admin area's).
 */
export function shotPath(
  path: string,
  locale: "en" | "ar",
  found: Record<string, string>,
  unprefixed = false,
): string {
  const filled = path.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = found[name];
    if (value === undefined) throw new Error(`No value for {${name}}`);
    return value;
  });
  if (unprefixed) return filled;
  return `/${locale}${filled === "/" ? "" : filled}`;
}

/** Only the screens named, in the list's order; an unknown ID is an error. */
export function pickScreens(all: Screen[], ids: string[]): Screen[] {
  if (!ids.length) return all;
  const unknown = ids.filter((id) => !all.some((s) => s.id === id));
  if (unknown.length)
    throw new Error(
      `Unknown screen ${unknown.join(", ")}: pick from ${all.map((s) => s.id).join(", ")}`,
    );
  return all.filter((s) => ids.includes(s.id));
}

// ---- Reviewers ----------------------------------------------------------

/**
 * A Claude reviewer may only read its round folder (the screenshots and the
 * reference apps); anything else is refused without a prompt (`dontAsk`).
 */
export function claudeArgs(prompt: string, model: string): string[] {
  return [
    "-p",
    prompt,
    "--model",
    model,
    "--permission-mode",
    "dontAsk",
    "--allowedTools",
    "Read(./**)",
    "Glob",
    "--disallowedTools",
    "Bash",
    "Edit",
    "WebFetch",
    "WebSearch",
    "Agent",
    "--strict-mcp-config",
    "--output-format",
    "json",
  ];
}

/**
 * Codex in a read-only sandbox, the screenshots attached, its last message
 * written to `answerFile`. `--image=<file>` takes one file each, so the
 * prompt after `--` is never read as an image.
 */
export function codexArgs(
  prompt: string,
  images: string[],
  answerFile: string,
  model?: string,
): string[] {
  return [
    "exec",
    "--sandbox",
    "read-only",
    "--skip-git-repo-check",
    "--output-last-message",
    answerFile,
    ...(model ? ["--model", model] : []),
    ...images.map((image) => `--image=${image}`),
    "--",
    prompt,
  ];
}

/** The answer text in Claude's `--output-format json` output. */
export function claudeAnswer(stdout: string): string {
  const lines = stdout.trim().split("\n").reverse();
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line) as { result?: unknown };
      if (typeof parsed.result === "string") return parsed.result;
    } catch {}
  }
  throw new Error("No result in the reviewer's output");
}

export type Severity = "high" | "medium" | "low";

/**
 * `structural`: the fix removes, merges, reorders or adds a section or a
 * control, so it changes what the screen holds. `visual`: anything else.
 */
export type Kind = "visual" | "structural";

const KINDS: Kind[] = ["visual", "structural"];

export type Issue = {
  screens: string[];
  category: Category;
  severity: Severity;
  kind: Kind;
  problem: string;
  fix: string;
};

/** A reviewer's call on an issue raised in an earlier round. */
export type Call = "fixed" | "still" | "worse";

const CALLS: Call[] = ["fixed", "still", "worse"];

export type Review = {
  reviewer: string;
  /** The share of our checks that pass. */
  ours: Shares;
  /** Each reference app's shares, by its folder name. */
  references: Record<string, Shares>;
  /** Our answer to every check. */
  answers: Answers;
  /** For each check we failed, the screenshots (names without `.png`) it shows on. */
  failures: Record<string, string[]>;
  /** The new issues this reviewer raised. */
  issues: Issue[];
  /** Its call on each earlier issue it answered, by the ledger's issue ID. */
  earlier: Record<string, Call>;
  keep: string[];
  summary: string;
};

const SEVERITIES: Severity[] = ["high", "medium", "low"];

/**
 * An answer per check: `"pass"`, or `{ "answer": "fail", "screens": […] }`.
 * A check left out is an error, and for our app so is a `fail` that names no
 * screenshot.
 */
function answersFrom(
  value: unknown,
  what: string,
  ours: boolean,
): { answers: Answers; failures: Record<string, string[]> } {
  if (!value || typeof value !== "object")
    throw new Error(`${what}: no answers`);
  const answers: Answers = {};
  const failures: Record<string, string[]> = {};
  for (const check of CHECKLIST) {
    const raw = (value as Record<string, unknown>)[check.id];
    if (raw === undefined || raw === null)
      throw new Error(`${what}: no answer for check ${check.id}`);
    const answer =
      typeof raw === "object" ? (raw as { answer?: unknown }).answer : raw;
    if (answer !== "pass" && answer !== "fail" && answer !== "na")
      throw new Error(
        `${what}: check ${check.id} is not answered pass, fail or na`,
      );
    answers[check.id] = answer;
    if (ours && answer === "fail") {
      const screens = (raw as { screens?: unknown }).screens;
      const names = (Array.isArray(screens) ? screens : [])
        .map((s) => String(s).replace(/\.png$/i, ""))
        .filter(Boolean);
      if (!names.length)
        throw new Error(
          `${what}: check ${check.id} fails but names no screenshot`,
        );
      failures[check.id] = names;
    }
  }
  return { answers, failures };
}

/**
 * The review in a reviewer's answer: its last ```json block, or the whole
 * answer when it is bare JSON. A check left out, for our app or for a
 * reference, is an error: every app must be answered in the same pass to be
 * comparable. `knownIds` are the ledger's issue IDs: a call on any other ID
 * is dropped, and so is one that isn't `fixed`, `still` or `worse`.
 */
export function parseReview(
  reviewer: string,
  answer: string,
  referenceNames: string[],
  knownIds: string[] = [],
): Review {
  const blocks = [...answer.matchAll(/```(?:json)?\s*\n([\s\S]*?)```/g)];
  const text = blocks.at(-1)?.[1] ?? answer;
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error(`${reviewer}: the answer has no JSON review`);
  }
  const refs = (raw.references ?? {}) as Record<string, unknown>;
  const references: Record<string, Shares> = {};
  for (const name of referenceNames)
    references[name] = checklistScores(
      answersFrom(refs[name], `${reviewer}, ${name}`, false).answers,
    );
  const mine = answersFrom(raw.ours, `${reviewer}, ours`, true);
  const categories = CATEGORIES.map((c) => c.key) as string[];
  const issues = (Array.isArray(raw.issues) ? raw.issues : []).flatMap(
    (item: unknown): Issue[] => {
      const i = item as Record<string, unknown>;
      if (typeof i.problem !== "string" || typeof i.fix !== "string") return [];
      return [
        {
          screens: Array.isArray(i.screens) ? i.screens.map(String) : [],
          category: (categories.includes(String(i.category))
            ? i.category
            : "polish") as Category,
          severity: SEVERITIES.includes(i.severity as Severity)
            ? (i.severity as Severity)
            : "medium",
          kind: KINDS.includes(i.kind as Kind) ? (i.kind as Kind) : "visual",
          problem: i.problem,
          fix: i.fix,
        },
      ];
    },
  );
  const earlier: Record<string, Call> = {};
  if (raw.earlier && typeof raw.earlier === "object")
    for (const [id, call] of Object.entries(raw.earlier))
      if (knownIds.includes(id) && CALLS.includes(call as Call))
        earlier[id] = call as Call;
  return {
    reviewer,
    ours: checklistScores(mine.answers),
    references,
    answers: mine.answers,
    failures: mine.failures,
    issues,
    earlier,
    keep: Array.isArray(raw.keep) ? raw.keep.map(String) : [],
    summary: typeof raw.summary === "string" ? raw.summary : "",
  };
}

// ---- The issue ledger ---------------------------------------------------

/**
 * An issue the run keeps across rounds (`issues.json` beside `history.json`),
 * so a later round can say whether a fix worked and the fixer can see which
 * issues several reviewers agree on.
 */
export type LedgerIssue = Issue & {
  /** `I1`, `I2`, …: stable for the run. */
  id: string;
  /** The round it was first raised in. */
  round: number;
  /** The reviewers who raised it (several when their issues were merged). */
  raisedBy: string[];
  /** Each reviewer's latest call; raising an issue counts as `still`. */
  calls: Record<string, Call>;
  status: "open" | "closed";
  /** The round it was closed in; gone when it reopens. */
  closedIn?: number;
};

export type Ledger = LedgerIssue[];

/** A new issue with the reviewer who raised it. */
export type NewIssue = Issue & { reviewer: string };

/** The new issues of every review, in the order the merge call sees them. */
export function newIssuesOf(reviews: Review[]): NewIssue[] {
  return reviews.flatMap((r) =>
    r.issues.map((issue) => ({ ...issue, reviewer: r.reviewer })),
  );
}

/** One ledger entry to be: the issue, and who raised it. */
export type Merged = { issue: Issue; raisedBy: string[] };

/**
 * The new issues with the duplicates joined. `groups` are lists of indexes
 * into `newIssues` that name the same issue; an index in no group, or in a
 * group after its first, stays on its own (so no groups, as when the merge
 * call failed, keeps every issue apart). A merged issue takes the words of
 * its most severe member, the first on a tie; all their screens; and
 * `structural` if any member is.
 */
export function mergeIssues(
  newIssues: NewIssue[],
  groups: number[][],
): Merged[] {
  const taken = new Set<number>();
  const lists: number[][] = [];
  for (const group of groups) {
    const members = [...new Set(group)]
      .filter(
        (i) =>
          Number.isInteger(i) &&
          i >= 0 &&
          i < newIssues.length &&
          !taken.has(i),
      )
      .sort((a, b) => a - b);
    members.forEach((i) => taken.add(i));
    if (members.length) lists.push(members);
  }
  newIssues.forEach((_, i) => {
    if (!taken.has(i)) lists.push([i]);
  });
  lists.sort((a, b) => a[0]! - b[0]!);
  return lists.map((members) => {
    const issues = members.map((i) => newIssues[i]!);
    const lead = issues.reduce((best, issue) =>
      SEVERITIES.indexOf(issue.severity) < SEVERITIES.indexOf(best.severity)
        ? issue
        : best,
    );
    return {
      issue: {
        screens: [...new Set(issues.flatMap((i) => i.screens))],
        category: lead.category,
        severity: lead.severity,
        kind: issues.some((i) => i.kind === "structural")
          ? "structural"
          : "visual",
        problem: lead.problem,
        fix: lead.fix,
      },
      raisedBy: [...new Set(issues.map((i) => i.reviewer))],
    };
  });
}

/** The prompt that asks a model which new issues are the same issue. */
export function mergePrompt(newIssues: NewIssue[]): string {
  return [
    "Below are issues several reviewers found in one app's screenshots. Some are the same issue in different words. Group the ones that name the same problem on the same element: two issues are the same when one fix would close both. Issues that merely share a screen or a category are not the same.",
    "",
    ...newIssues.map(
      (i, n) =>
        `${n}. (${i.reviewer}; ${i.category}; ${i.screens.join(", ") || "all screens"}) ${i.problem}`,
    ),
    "",
    'Answer with exactly one fenced `json` block and nothing after it: `{ "groups": [[0, 3], [1, 4, 5]] }`. A group is the numbers of issues that are the same issue; leave out an issue that has no duplicate.',
  ].join("\n");
}

/** The groups in the merge call's answer; throws when it has none. */
export function parseGroups(answer: string): number[][] {
  const blocks = [...answer.matchAll(/```(?:json)?\s*\n([\s\S]*?)```/g)];
  let raw: { groups?: unknown };
  try {
    raw = JSON.parse(blocks.at(-1)?.[1] ?? answer) as { groups?: unknown };
  } catch {
    throw new Error("the merge answer has no JSON");
  }
  if (!Array.isArray(raw.groups))
    throw new Error("the merge answer has no groups");
  return raw.groups
    .filter(Array.isArray)
    .map((g: unknown[]) => g.filter((n): n is number => typeof n === "number"));
}

const idNumber = (id: string) => Number(/^I(\d+)$/.exec(id)?.[1] ?? 0);

/**
 * The ledger after a round. Each reviewer's call on an earlier issue is
 * recorded. An open issue closes when most of the reviewers who answered it
 * this round say `fixed`; a reviewer who did not answer does not count. A
 * closed issue a reviewer says is `still` or `worse` reopens. The new issues,
 * with the duplicates in `groups` merged, get the next IDs. Pure: the ledger
 * passed in is not changed.
 */
export function updateLedger(
  ledger: Ledger,
  round: number,
  reviews: Review[],
  groups: number[][],
): Ledger {
  const next = ledger.map((issue) => ({
    ...issue,
    raisedBy: [...issue.raisedBy],
    calls: { ...issue.calls },
  }));
  for (const issue of next) {
    const answers = reviews.flatMap((r) =>
      r.earlier[issue.id] ? [[r.reviewer, r.earlier[issue.id]!] as const] : [],
    );
    if (!answers.length) continue;
    for (const [reviewer, call] of answers) issue.calls[reviewer] = call;
    const fixed = answers.filter(([, call]) => call === "fixed").length;
    if (issue.status === "open") {
      if (fixed * 2 > answers.length) {
        issue.status = "closed";
        issue.closedIn = round;
      }
    } else if (fixed < answers.length) {
      issue.status = "open";
      delete issue.closedIn;
    }
  }
  let id = Math.max(0, ...next.map((i) => idNumber(i.id)));
  for (const { issue, raisedBy } of mergeIssues(newIssuesOf(reviews), groups))
    next.push({
      ...issue,
      id: `I${++id}`,
      round,
      raisedBy,
      calls: Object.fromEntries(raisedBy.map((r) => [r, "still" as const])),
      status: "open",
    });
  return next;
}

/**
 * Two or more reviewers stand behind the issue: raised it, or called it
 * `still` or `worse` in the latest round they answered it.
 */
export function confirmed(issue: LedgerIssue): boolean {
  return (
    Object.values(issue.calls).filter((c) => c === "still" || c === "worse")
      .length >= 2
  );
}

// ---- The comparison with the last round -----------------------------------

/**
 * From round 2 each shot whose picture changed is put next to the last
 * round's, the two unlabelled, and every reviewer says which it would ship.
 * It answers what the checklist can't: whether the round's changes made the
 * screen better.
 */

/** Which round a picture is from. */
export type Side = "new" | "old";

/** For each changed shot, which round `A` and `B` are. Never shown to reviewers. */
export type Key = Record<string, { A: Side; B: Side }>;

/**
 * The shots in `current` whose picture differs from the same shot in
 * `previous` (both: shot name → hash of its PNG bytes). A shot with the same
 * bytes, or one that wasn't there last round, is left out. In `current`'s order.
 */
export function changedShots(
  previous: Record<string, string>,
  current: Record<string, string>,
): string[] {
  return Object.keys(current).filter(
    (name) => previous[name] !== undefined && previous[name] !== current[name],
  );
}

/**
 * A random flip per shot decides which round is `A`. `random` returns [0, 1):
 * below a half, `A` is the new picture.
 */
export function assignSides(shots: string[], random: () => number): Key {
  return Object.fromEntries(
    shots.map((shot) => [
      shot,
      random() < 0.5
        ? { A: "new" as const, B: "old" as const }
        : { A: "old" as const, B: "new" as const },
    ]),
  );
}

/** What a reviewer says it would ship. */
export type Choice = "A" | "B" | "same";

const CHOICES: Choice[] = ["A", "B", "same"];

/** A reviewer's answer for one shot. */
export type Vote = { better: Choice; why: string };

/** The comparison files of a shot, in the round's folder. */
export const compareFile = (shot: string, side: "A" | "B") =>
  `compare/${shot}-${side}.png`;

/** The prompt that asks a reviewer to pick, for each shot, A or B. */
export function comparePrompt(
  template: string,
  app: string,
  shots: string[],
): string {
  return fill(template, {
    APP: app,
    SHOTS: shots
      .map((s) => `- \`${compareFile(s, "A")}\` and \`${compareFile(s, "B")}\``)
      .join("\n"),
    ANSWERS: JSON.stringify(
      Object.fromEntries(
        shots.map((s) => [s, { better: "A", why: "one line" }]),
      ),
      null,
      2,
    ),
  });
}

/**
 * A reviewer's picks: its last ```json block (or the bare answer), a vote per
 * shot it answered with `A`, `B` or `same`. A shot left out, or answered
 * anything else, is no vote from this reviewer; a shot that isn't in `shots` is
 * dropped. Throws when there is no JSON or no usable vote at all.
 */
export function parseComparison(
  reviewer: string,
  answer: string,
  shots: string[],
): Record<string, Vote> {
  const blocks = [...answer.matchAll(/```(?:json)?\s*\n([\s\S]*?)```/g)];
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(blocks.at(-1)?.[1] ?? answer) as Record<string, unknown>;
  } catch {
    throw new Error(`${reviewer}: the comparison has no JSON`);
  }
  const votes: Record<string, Vote> = {};
  for (const shot of shots) {
    const item = raw?.[shot];
    if (!item || typeof item !== "object") continue;
    const { better, why } = item as { better?: unknown; why?: unknown };
    if (CHOICES.includes(better as Choice))
      votes[shot] = {
        better: better as Choice,
        why: typeof why === "string" ? why : "",
      };
  }
  if (shots.length && !Object.keys(votes).length)
    throw new Error(`${reviewer}: the comparison answers no shot`);
  return votes;
}

/** A shot's verdict: the new picture won, the old one did, or neither. */
export type Judgement = "new" | "old" | "same";

/** A round's result of the comparison, as the history keeps it. */
export type Comparison = {
  /** Shots judged `new`. */
  better: number;
  /** Shots judged `old`. */
  worse: number;
  /** Shots judged `same`. */
  same: number;
  result: "better" | "worse" | "same";
};

/**
 * Each shot's verdict is the one most of the reviewers who answered it gave
 * (`A` and `B` are turned back into the round they were); a tie for the most,
 * or no answer, is `same`. The round is `better` when more shots are `new`
 * than `old`, `worse` when more are `old`, and otherwise `same`, as it is
 * when no shot changed. `answers`: reviewer → their votes.
 */
export function comparison(
  key: Key,
  answers: Record<string, Record<string, Vote>>,
): Comparison & { shots: Record<string, Judgement> } {
  const shots: Record<string, Judgement> = {};
  for (const [shot, sides] of Object.entries(key)) {
    const tally: Record<Judgement, number> = { new: 0, old: 0, same: 0 };
    for (const votes of Object.values(answers)) {
      const pick = votes[shot]?.better;
      if (pick) tally[pick === "same" ? "same" : sides[pick]]++;
    }
    const top = Math.max(tally.new, tally.old, tally.same);
    const winners = (["new", "old", "same"] as const).filter(
      (j) => tally[j] === top,
    );
    shots[shot] = top > 0 && winners.length === 1 ? winners[0]! : "same";
  }
  const verdicts = Object.values(shots);
  const better = verdicts.filter((j) => j === "new").length;
  const worse = verdicts.filter((j) => j === "old").length;
  return {
    better,
    worse,
    same: verdicts.length - better - worse,
    result: better > worse ? "better" : worse > better ? "worse" : "same",
    shots,
  };
}

/** `compare.md` of a round: a row per changed shot, with every reviewer's pick. */
export function compareMarkdown(
  key: Key,
  result: Comparison & { shots: Record<string, Judgement> },
  answers: Record<string, Record<string, Vote>>,
): string {
  const cell = (s: string) => s.replace(/\s+/g, " ").replace(/\|/g, "/").trim();
  const rows = Object.entries(key).map(([shot, sides]) => {
    const picks = Object.entries(answers).flatMap(([reviewer, votes]) => {
      const vote = votes[shot];
      if (!vote) return [];
      const round = vote.better === "same" ? "same" : sides[vote.better];
      return [`${reviewer}: ${round}${vote.why ? ` (${cell(vote.why)})` : ""}`];
    });
    return `| ${shot} | ${result.shots[shot]} | ${picks.join("; ") || "no answers"} |`;
  });
  return [
    "# Compared with the last round",
    "",
    Object.keys(key).length
      ? `Result: **${result.result}** (${comparisonText(result)}). \`new\` is this round's picture, \`old\` last round's.`
      : "No shot changed since the last round.",
    "",
    ...(rows.length
      ? ["| Shot | Judged | Reviewers |", "|---|---|---|", ...rows, ""]
      : []),
  ].join("\n");
}

/** `better 7 / worse 1 / same 2`, or `–` for a round with no comparison. */
export function comparisonText(c: Comparison | null | undefined): string {
  return c ? `better ${c.better} / worse ${c.worse} / same ${c.same}` : "–";
}

// ---- Verdict and reports -----------------------------------------------

export type Gap = {
  reviewer: string;
  category: Category;
  /** Our share of the category's checks that pass. */
  ours: number;
  /** What it must reach: the target. */
  needs: number;
};

/**
 * Every category a reviewer's checks pass below the target share: where to
 * look first. A category with only `na` checks has no share and no gap. The
 * reference apps are compared on the overall share only (see `verdict`), not
 * here. Not part of `verdict`.
 */
export function gaps(reviews: Review[], target: number): Gap[] {
  const found: Gap[] = [];
  for (const review of reviews)
    for (const { key } of CATEGORIES) {
      const ours = review.ours.categories[key];
      if (ours !== null && ours < target)
        found.push({
          reviewer: review.reviewer,
          category: key,
          ours,
          needs: target,
        });
    }
  return found;
}

/** How far under the best reference app's overall share ours may be. */
export const REFERENCE_MARGIN = 10;

export type State = "done" | "continue";

/** The open issues that block `done`: visual, high, and confirmed. */
export function blockingIssues(ledger: Ledger): LedgerIssue[] {
  return ledger.filter(
    (i) =>
      i.status === "open" &&
      i.kind === "visual" &&
      i.severity === "high" &&
      confirmed(i),
  );
}

const list = (items: string[]) =>
  items.length < 3
    ? items.join(" and ")
    : `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;

/**
 * Whether the council is done, and if not why not, one reason per unmet rule.
 * Done when all of these hold:
 *  - no open issue is `visual`, `high` and confirmed (`structural` ones go to
 *    the owner in proposals.md and never block);
 *  - every reviewer's overall share is at least the target;
 *  - no reviewer puts ours more than `REFERENCE_MARGIN` points under the best
 *    reference app's overall share;
 *  - the round's pictures didn't beat last round's (`comparison` is null in
 *    round 1, where this holds): a round that still made them better has more to
 *    climb;
 *  - every reviewer answered.
 */
export function verdict(input: {
  reviews: Review[];
  ledger: Ledger;
  comparison: Comparison | null;
  target: number;
  failed?: string[];
}): { state: State; reasons: string[] } {
  const { reviews, ledger, comparison: compared, target } = input;
  const failed = input.failed ?? [];
  const reasons: string[] = [];
  const blocking = blockingIssues(ledger);
  if (blocking.length)
    reasons.push(
      `${blocking.length} confirmed high ${blocking.length === 1 ? "issue" : "issues"} open: ${blocking.map((i) => i.id).join(", ")}`,
    );
  const under = reviews.filter((r) => (r.ours.overall ?? -1) < target);
  if (under.length)
    reasons.push(
      `${list(under.map((r) => `${r.reviewer} (${pct(r.ours.overall)})`))} ${under.length === 1 ? "is" : "are"} under the ${target}% overall target`,
    );
  const behind = reviews.flatMap((r) => {
    const best = Object.entries(r.references).reduce<[string, number] | null>(
      (top, [name, s]) =>
        s.overall !== null && (!top || s.overall > top[1])
          ? [name, s.overall]
          : top,
      null,
    );
    if (!best || r.ours.overall === null) return [];
    const points = best[1] - r.ours.overall;
    return points > REFERENCE_MARGIN
      ? [`${r.reviewer} puts ours ${points} points under ${best[0]}`]
      : [];
  });
  if (behind.length)
    reasons.push(
      `${behind.join(", ")} (the most is ${REFERENCE_MARGIN} points under the best reference app)`,
    );
  if (compared?.result === "better")
    reasons.push(
      `this round's pictures are still better than last round's (${comparisonText(compared)}): run a round to see whether the gains stop`,
    );
  if (!reviews.length) reasons.push("no reviewer answered");
  if (failed.length) reasons.push(`no usable answer from ${failed.join(", ")}`);
  return { state: reasons.length ? "continue" : "done", reasons };
}

/** The issues closed in `round`: the ones the reviewers said were fixed in it. */
export function closedIn(ledger: Ledger, round: number): LedgerIssue[] {
  return ledger.filter((i) => i.status === "closed" && i.closedIn === round);
}

/**
 * The council has stopped climbing: each of the last two rounds closed no
 * issue and its pictures did not beat the round before's. Needs two rounds.
 */
export function stalled(history: RoundRecord[], ledger: Ledger): boolean {
  const last = [...history].sort((a, b) => a.round - b.round).slice(-2);
  return (
    last.length === 2 &&
    last.every(
      (h) =>
        h.comparison?.result !== "better" &&
        closedIn(ledger, h.round).length === 0,
    )
  );
}

/**
 * What the owner decides: the open `structural` issues, most confirmed first
 * (then high first, then by ID). The fixer leaves them alone: they change what
 * a screen holds. They never count against `done`.
 */
export function proposals(ledger: Ledger): LedgerIssue[] {
  const behind = (i: LedgerIssue) =>
    Object.values(i.calls).filter((c) => c === "still" || c === "worse").length;
  return ledger
    .filter((i) => i.status === "open" && i.kind === "structural")
    .sort(
      (a, b) =>
        behind(b) - behind(a) ||
        SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) ||
        idNumber(a.id) - idNumber(b.id),
    );
}

/** `proposals.md` of the run: the owner's list. `reviewers`: how many answered. */
export function proposalsMarkdown(ledger: Ledger, reviewers: number): string {
  const title = (key: Category) => CATEGORIES.find((c) => c.key === key)!.title;
  const items = proposals(ledger);
  return [
    "# Proposals for the owner",
    "",
    "Each of these changes what a screen holds (it removes, merges, reorders or adds a section or a control), so the agent that fixes the UI leaves it alone. They never keep the council from finishing. The most confirmed are first.",
    "",
    ...(items.length
      ? items.flatMap((i) => [
          `## ${i.id}: ${title(i.category)} (${i.severity})`,
          "",
          `- Screens: ${i.screens.join(", ") || "all screens"}`,
          `- Problem: ${i.problem}`,
          `- Proposed change: ${i.fix}`,
          `- Raised by ${i.raisedBy.length} of ${Math.max(reviewers, i.raisedBy.length)}${confirmed(i) ? ", confirmed" : ""}`,
          "",
        ])
      : ["None.", ""]),
  ].join("\n");
}

const pct = (n: number | null) => (n === null ? "–" : `${n}%`);

/** One round's shares: a row per reviewer and app, a column per category. */
export function scoresTable(reviews: Review[]): string {
  const head = `| Reviewer | App | ${CATEGORIES.map((c) => c.key).join(" | ")} | Overall |`;
  const rule = `|${"---|".repeat(CATEGORIES.length + 3)}`;
  const row = (reviewer: string, app: string, s: Shares) =>
    `| ${reviewer} | ${app} | ${CATEGORIES.map((c) => pct(s.categories[c.key])).join(" | ")} | ${pct(s.overall)} |`;
  const rows = reviews.flatMap((r) => [
    row(r.reviewer, "**ours**", r.ours),
    ...Object.entries(r.references).map(([name, s]) =>
      row(r.reviewer, name, s),
    ),
  ]);
  return [head, rule, ...rows].join("\n");
}

export type RoundRecord = {
  round: number;
  commit: string;
  at: string;
  /**
   * Each reviewer's overall share for the app, and its lowest category
   * share (0–100; 0 when it had none to give).
   */
  reviewers: Record<string, { avg: number; min: number }>;
  state: State;
  /** Open issues that are visual, high and confirmed, after the round. */
  blocking: number;
  /** Issues the reviewers closed in the round. */
  closed: number;
  /** How the round's pictures compare with the last round's; null in round 1. */
  comparison: Comparison | null;
};

export function roundRecord(input: {
  round: number;
  commit: string;
  at: Date;
  reviews: Review[];
  /** The ledger after the round. */
  ledger: Ledger;
  state: State;
  comparison?: Comparison | null;
}): RoundRecord {
  const { round, commit, at, reviews, ledger, state } = input;
  const compared = input.comparison ?? null;
  const reviewers: RoundRecord["reviewers"] = {};
  for (const r of reviews) {
    const shares = CATEGORIES.map((c) => r.ours.categories[c.key]).filter(
      (n): n is number => n !== null,
    );
    reviewers[r.reviewer] = {
      avg: r.ours.overall ?? 0,
      min: shares.length ? Math.min(...shares) : 0,
    };
  }
  return {
    round,
    commit,
    at: at.toISOString(),
    reviewers,
    state,
    blocking: blockingIssues(ledger).length,
    closed: closedIn(ledger, round).length,
    comparison: compared
      ? {
          better: compared.better,
          worse: compared.worse,
          same: compared.same,
          result: compared.result,
        }
      : null,
  };
}

/**
 * Every round so far: each reviewer's overall share (lowest category), the
 * confirmed high issues still open, the issues closed in the round, how its
 * pictures compare with the round before, and the state.
 */
export function historyTable(history: RoundRecord[]): string {
  const names = [...new Set(history.flatMap((h) => Object.keys(h.reviewers)))];
  const head = `| Round | Commit | ${names.join(" | ")} | Confirmed high open | Closed | vs last round | State |`;
  const rule = `|${"---|".repeat(names.length + 6)}`;
  const rows = history.map((h) => {
    const shares = names.map((n) => {
      const s = h.reviewers[n];
      return s ? `${s.avg}% (min ${s.min}%)` : "–";
    });
    return `| ${[
      h.round,
      h.commit.slice(0, 9),
      ...shares,
      h.blocking,
      h.closed,
      comparisonText(h.comparison),
      h.state,
    ].join(" | ")} |`;
  });
  return [head, rule, ...rows].join("\n");
}

/**
 * The run's README.md: the rules in one paragraph, the history, the latest
 * round's reasons for going on, and the owner's list.
 */
export function readmeMarkdown(input: {
  branch: string;
  target: number;
  history: RoundRecord[];
  round: number;
  reasons: string[];
  stalled: boolean;
  proposals: number;
}): string {
  const { target, history, round, reasons } = input;
  return [
    `# Design council: ${input.branch}`,
    "",
    `A round is **done** when no confirmed high visual issue is open, every reviewer's overall share of passing checks is at least ${target}%, no reviewer puts ours more than ${REFERENCE_MARGIN} points under the best reference app's overall share, the round's pictures are not still better than last round's, and every reviewer answered. It is **stalled** when each of the last two rounds closed no issue and made no picture better. Issues that change what a screen holds (\`structural\`) never count against done: they go to the owner in proposals.md.`,
    "",
    historyTable(history),
    "",
    `Latest: ${roundFolder(round)}/feedback.md`,
    ...(input.stalled
      ? ["", "**Stalled**: stop and report what is holding it back."]
      : []),
    ...(reasons.length
      ? ["", "Not done yet:", "", ...reasons.map((r) => `- ${r}`)]
      : ["", "Done."]),
    "",
    "## For the owner",
    "",
    input.proposals
      ? `${input.proposals} proposals that change what a screen holds: [proposals.md](proposals.md).`
      : "No proposals yet: [proposals.md](proposals.md).",
    "",
  ].join("\n");
}

/**
 * What to fix, for the agent: the gaps, the checks that failed, then the
 * ledger's open issues: the ones several reviewers stand behind first, then
 * the high ones first and, within a severity, the ones on the weakest
 * categories first. Each says how many reviewers raised it. `structural`
 * issues are left out: they change what a screen holds.
 */
export function feedbackMarkdown(
  reviews: Review[],
  gaps: Gap[],
  failed: string[],
  ledger: Ledger,
  compared: (Comparison & { shots: Record<string, Judgement> }) | null = null,
): string {
  const worse = Object.entries(compared?.shots ?? {})
    .filter(([, judged]) => judged === "old")
    .map(([shot]) => shot);
  const lowest = new Map<Category, number>();
  for (const r of reviews)
    for (const { key } of CATEGORIES) {
      const share = r.ours.categories[key];
      if (share !== null)
        lowest.set(key, Math.min(lowest.get(key) ?? 100, share));
    }
  const issues = ledger
    .filter((i) => i.status === "open" && i.kind !== "structural")
    .sort(
      (a, b) =>
        Number(confirmed(b)) - Number(confirmed(a)) ||
        SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) ||
        (lowest.get(a.category) ?? 100) - (lowest.get(b.category) ?? 100) ||
        idNumber(a.id) - idNumber(b.id),
    );
  const raisedBy = (i: LedgerIssue) =>
    `raised by ${i.raisedBy.length} of ${Math.max(reviews.length, i.raisedBy.length)}${confirmed(i) ? ", confirmed" : ""}`;
  const title = (key: Category) => CATEGORIES.find((c) => c.key === key)!.title;
  const failedChecks = CHECKLIST.flatMap((check) => {
    const who = reviews.filter((r) => r.failures[check.id]);
    if (!who.length) return [];
    const screens = [...new Set(who.flatMap((r) => r.failures[check.id]!))];
    return [
      `- \`${check.id}\` ${check.question} Failed by ${who.map((r) => r.reviewer).join(", ")} on ${screens.join(", ")}.`,
    ];
  });
  return [
    "# What to fix",
    "",
    failed.length
      ? `Reviewers with no usable answer this round (run them again): ${failed.join(", ")}.\n`
      : "",
    ...(worse.length
      ? [
          "## Got worse: consider reverting",
          "",
          "Most reviewers would ship last round's picture of these, not this round's. Compare them in `compare.md`; revert the change that made each worse unless you can fix it.",
          "",
          ...worse.map((shot) => `- \`${shot}\``),
          "",
        ]
      : []),
    "## Gaps",
    "",
    gaps.length
      ? gaps
          .map(
            (g) =>
              `- ${g.reviewer}, ${title(g.category)}: ${g.ours}% of checks pass, needs ${g.needs}% (the target)`,
          )
          .join("\n")
      : "None.",
    "",
    "## Failed checks",
    "",
    ...(failedChecks.length ? failedChecks : ["None."]),
    "",
    "## Issues",
    "",
    ...issues.map(
      (i) =>
        `- **[${i.severity}] ${title(i.category)}** (\`${i.id}\`, ${raisedBy(i)}; ${i.screens.join(", ") || "all screens"}): ${i.problem}\n  Fix: ${i.fix}`,
    ),
    "",
    "## Keep",
    "",
    ...reviews.flatMap((r) => r.keep.map((k) => `- ${k} (${r.reviewer})`)),
    "",
    "## Summaries",
    "",
    ...reviews.map((r) => `- **${r.reviewer}**: ${r.summary}`),
    "",
  ].join("\n");
}

// ---- The reviewers' prompt ----------------------------------------------

/** The checklist as the prompt lists it: a heading per category, a line per check. */
export function checklistText(): string {
  return CATEGORIES.map((c) =>
    [
      `### ${c.title} (\`${c.key}\`)`,
      "",
      ...CHECKLIST.filter((check) => check.category === c.key).map(
        (check) => `- \`${check.id}\`: ${check.question}`,
      ),
    ].join("\n"),
  ).join("\n\n");
}

/** Our shots as the prompt lists them, one line each. */
export function shotsText(shots: Shot[]): string {
  return shots
    .map(
      (s) =>
        `- \`screens/${s.file}\`: ${s.screen.title}, ${s.width} px${s.locale === "ar" ? ", Arabic" : ""}${s.screen.as ? ", signed in as the test admin" : ""}`,
    )
    .join("\n");
}

/**
 * The ledger as the prompt lists it, from round 2 on: the open issues to
 * answer, and the closed ones to answer only if they are back. Empty before
 * the first issue.
 */
export function earlierText(ledger: Ledger): string {
  if (!ledger.length) return "";
  const line = (i: LedgerIssue) =>
    `- \`${i.id}\` (${i.screens.join(", ") || "all screens"}): ${i.problem}`;
  const open = ledger.filter((i) => i.status === "open");
  const closed = ledger.filter((i) => i.status === "closed");
  return [
    "## Issues from earlier rounds",
    "",
    "The team has worked on the issues below since they were raised. Look at the screenshots as they are now, and answer every open issue before you list new ones: `fixed` (it is gone), `still` (it is as it was) or `worse`. Do not list an open issue again as a new one; answer it here.",
    "",
    "Open:",
    "",
    ...(open.length ? open.map(line) : ["None."]),
    ...(closed.length
      ? [
          "",
          "Closed earlier: answer one of these only if it is back (`still` or `worse`), and leave out the ones that stay fixed. Don't list it as a new issue.",
          "",
          ...closed.map(line),
        ]
      : []),
    "",
  ].join("\n");
}

/** The prompt every reviewer gets: the template filled for this round. */
export function reviewerPrompt(
  template: string,
  app: string,
  shots: Shot[],
  refs: Record<string, string[]>,
  ledger: Ledger = [],
): string {
  const blank = Object.fromEntries(CHECKLIST.map((c) => [c.id, "pass"]));
  return fill(template, {
    EARLIER: earlierText(ledger),
    EARLIER_ANSWERS: JSON.stringify(
      Object.fromEntries(
        ledger.filter((i) => i.status === "open").map((i) => [i.id, "fixed"]),
      ),
      null,
      2,
    ),
    APP: app,
    SHOTS: shotsText(shots),
    REFERENCES: Object.keys(refs).length
      ? Object.entries(refs)
          .map(
            ([name, files]) =>
              `- ${name}: ${files.map((f) => `\`${f}\``).join(", ")}`,
          )
          .join("\n")
      : "None this time: answer for ours alone, and leave `references` as `{}`.",
    CHECKLIST: checklistText(),
    ANSWERS: JSON.stringify(blank, null, 2),
    REFERENCE_ANSWERS: JSON.stringify(
      Object.fromEntries(Object.keys(refs).map((name) => [name, blank])),
      null,
      2,
    ),
  });
}
