/**
 * The design council (scripts/design-council.ts): a panel of models scores
 * screenshots of the Yalla Kafala site, in English and Arabic, side by side
 * with screenshots of other sites, and says what to fix. An agent fixes the UI and runs another round until every
 * reviewer scores every category at or above the target, and the site at or
 * above every reference site (.claude/skills/design-council/SKILL.md,
 * docs/design-council.md).
 *
 * This module holds the pure parts: options, the rubric, the screens'
 * shots, the reviewers' command lines, reading their answers and the
 * verdict. The reviewers never see the target or earlier rounds' scores: a
 * reviewer told the goal tends to score near it.
 *
 * Plain TypeScript that Node runs as is (type stripping): type-only imports
 * use `import type`, and nothing here needs compiling.
 */

/** The rubric. Every reviewer scores every category, 1–10. */
export const CATEGORIES = [
  {
    key: "impression",
    title: "First impression (the first screen of each page)",
  },
  { key: "hierarchy", title: "Visual hierarchy and focus" },
  { key: "typography", title: "Typography, in English and Arabic" },
  { key: "color", title: "Colour, contrast and legibility" },
  { key: "layout", title: "Layout, spacing and rhythm" },
  { key: "components", title: "Components: cards, buttons, icons, imagery" },
  { key: "mobile", title: "Phone layout" },
  { key: "rtl", title: "Arabic and right to left" },
  {
    key: "trust",
    title:
      "Trust and clarity: what kafala is, why trust Yalla Kafala, what to do next (learn, apply, donate)",
  },
  { key: "polish", title: "Overall polish and character" },
] as const;

export type Category = (typeof CATEGORIES)[number]["key"];
export type Scores = Record<Category, number>;

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
  /** The score every reviewer must give every category. */
  target: number;
  reviewers: Reviewer[];
  /** Screen IDs to capture; empty means all. */
  screens: string[];
  /** Minutes each reviewer gets. */
  minutes: number;
  /** The port the built site is served on. */
  port: number;
  /**
   * A deployed site to photograph instead of building this checkout
   * (production, or a Vercel preview of a branch). Empty: build locally.
   */
  url: string;
  /** Capture only: no reviewers. */
  captureOnly: boolean;
  /** Review the screenshots already in the round's folder again. */
  reviewOnly: boolean;
};

export const DEFAULTS: Options = {
  round: 0,
  name: "",
  target: 9,
  reviewers: ["opus", "sonnet", "codex"].map(parseReviewer),
  screens: [],
  minutes: 20,
  port: 5600,
  url: "",
  captureOnly: false,
  reviewOnly: false,
};

export const USAGE = `npm run design-council -- [options]
  --name <name>          the run's folder under reports/design-council/ (default: the branch)
  --round <n>            the round to run (default: the next one)
  --target <score>       what every reviewer must give every category (default 9)
  --reviewers <list>     comma-separated: opus, sonnet, fable, haiku, claude:<id>,
                         codex, codex:<model> (default opus,sonnet,codex; a
                         missing codex CLI is skipped)
  --screens <ids>        only these screens (scripts/design-council/screens.ts)
  --minutes <n>          each reviewer's time limit (default 20)
  --port <port>          where the local build is served (default 5600)
  --url <url>            photograph this deployment instead of building
                         (https://www.yallakafala.org, or a Vercel preview)
  --capture-only         take the screenshots, skip the reviewers
  --review-only          review this round's screenshots again, skip the build`;

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
        if (options.target > 10) throw new Error("--target is at most 10");
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
      case "--port": {
        const port = positive(flag, takes());
        if (!Number.isInteger(port) || port > 65535)
          throw new Error("--port is a port number");
        options.port = port;
        break;
      }
      case "--url": {
        const url = takes().replace(/\/+$/, "");
        if (!/^https?:\/\/[^/]+$/.test(url))
          throw new Error(
            "--url is a site's origin, like https://www.yallakafala.org",
          );
        options.url = url;
        break;
      }
      case "--capture-only":
        options.captureOnly = true;
        break;
      case "--review-only":
        options.reviewOnly = true;
        break;
      case "--help":
        throw new Error(USAGE);
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

export type Locale = "en" | "ar";

export type Screen = {
  /** Unique, folder-safe; the screenshot's file name starts with it. */
  id: string;
  title: string;
  /** The page's path without the language prefix. */
  path: string;
  /** Widths to capture it at, in English. */
  widths: number[];
  /** Also capture it in Arabic (at the first width). */
  arabic?: boolean;
};

/** One screenshot: which screen, at what width, in which language. */
export type Shot = {
  screen: Screen;
  width: number;
  locale: Locale;
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

/** The page's path with its language prefix: `/ar/faqs`, `/en`. */
export function shotPath(shot: Shot): string {
  return `/${shot.locale}${shot.screen.path === "/" ? "" : shot.screen.path}`;
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
 * reference sites); anything else is refused without a prompt (`dontAsk`).
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
  for (const line of stdout.trim().split("\n").reverse()) {
    try {
      const parsed = JSON.parse(line) as { result?: unknown };
      if (typeof parsed.result === "string") return parsed.result;
    } catch {}
  }
  throw new Error("No result in the reviewer's output");
}

export type Severity = "high" | "medium" | "low";

export type Issue = {
  screens: string[];
  category: Category;
  severity: Severity;
  problem: string;
  fix: string;
};

export type Review = {
  reviewer: string;
  ours: Scores;
  /** Each reference site's scores, by its folder name. */
  references: Record<string, Scores>;
  issues: Issue[];
  keep: string[];
  summary: string;
};

const SEVERITIES: Severity[] = ["high", "medium", "low"];

function scoresFrom(value: unknown, what: string): Scores {
  if (!value || typeof value !== "object")
    throw new Error(`${what}: no scores`);
  const scores = {} as Scores;
  for (const { key } of CATEGORIES) {
    const n = Number((value as Record<string, unknown>)[key]);
    if (!Number.isFinite(n) || n < 1 || n > 10)
      throw new Error(`${what}: ${key} is not a score from 1 to 10`);
    scores[key] = n;
  }
  return scores;
}

/**
 * The review in a reviewer's answer: its last ```json block, or the whole
 * answer when it is bare JSON. A reference the reviewer leaves out is an
 * error: every site must be scored in the same pass to be comparable.
 */
export function parseReview(
  reviewer: string,
  answer: string,
  referenceNames: string[],
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
  const references: Record<string, Scores> = {};
  for (const name of referenceNames)
    references[name] = scoresFrom(refs[name], `${reviewer}, ${name}`);
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
          problem: i.problem,
          fix: i.fix,
        },
      ];
    },
  );
  return {
    reviewer,
    ours: scoresFrom(raw.ours, `${reviewer}, ours`),
    references,
    issues,
    keep: Array.isArray(raw.keep) ? raw.keep.map(String) : [],
    summary: typeof raw.summary === "string" ? raw.summary : "",
  };
}

// ---- Verdict and reports -----------------------------------------------

export type Gap = {
  reviewer: string;
  category: Category;
  ours: number;
  /** What it must reach: the target, or the best reference when higher. */
  needs: number;
  /** "target", or the reference site that set the bar. */
  because: string;
};

/**
 * Every place the site falls short: a category a reviewer scored below the
 * target, or below a reference site it scored in the same pass. Passed when
 * there are none and every reviewer answered.
 */
export function verdict(
  reviews: Review[],
  target: number,
  failed: string[] = [],
): { passed: boolean; gaps: Gap[] } {
  const gaps: Gap[] = [];
  for (const review of reviews)
    for (const { key } of CATEGORIES) {
      const ours = review.ours[key];
      let needs = target;
      let because = "target";
      for (const [name, scores] of Object.entries(review.references))
        if (scores[key] > needs) {
          needs = scores[key];
          because = name;
        }
      if (ours < needs)
        gaps.push({
          reviewer: review.reviewer,
          category: key,
          ours,
          needs,
          because,
        });
    }
  return { passed: reviews.length > 0 && !failed.length && !gaps.length, gaps };
}

const average = (scores: Scores) =>
  CATEGORIES.reduce((n, { key }) => n + scores[key], 0) / CATEGORIES.length;

const fmt = (n: number) => n.toFixed(1);

/** One round's scores: a row per reviewer and site, a column per category. */
export function scoresTable(reviews: Review[]): string {
  const head = `| Reviewer | Site | ${CATEGORIES.map((c) => c.key).join(" | ")} | Avg |`;
  const rule = `|${"---|".repeat(CATEGORIES.length + 3)}`;
  const row = (reviewer: string, site: string, s: Scores) =>
    `| ${reviewer} | ${site} | ${CATEGORIES.map((c) => fmt(s[c.key])).join(" | ")} | ${fmt(average(s))} |`;
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
  /** Each reviewer's average for the site, and its lowest category score. */
  reviewers: Record<string, { avg: number; min: number }>;
  passed: boolean;
};

export function roundRecord(
  round: number,
  commit: string,
  at: Date,
  reviews: Review[],
  passed: boolean,
): RoundRecord {
  const reviewers: RoundRecord["reviewers"] = {};
  for (const r of reviews)
    reviewers[r.reviewer] = {
      avg: Number(fmt(average(r.ours))),
      min: Math.min(...CATEGORIES.map((c) => r.ours[c.key])),
    };
  return { round, commit, at: at.toISOString(), reviewers, passed };
}

/** Every round so far: each reviewer's average (lowest category). */
export function historyTable(history: RoundRecord[]): string {
  const names = [...new Set(history.flatMap((h) => Object.keys(h.reviewers)))];
  const head = `| Round | Commit | ${names.join(" | ")} | Passed |`;
  const rule = `|${"---|".repeat(names.length + 3)}`;
  const rows = history.map(
    (h) =>
      `| ${h.round} | ${h.commit.slice(0, 9)} | ${names
        .map((n) => {
          const s = h.reviewers[n];
          return s ? `${fmt(s.avg)} (min ${fmt(s.min)})` : "–";
        })
        .join(" | ")} | ${h.passed ? "yes" : "no"} |`,
  );
  return [head, rule, ...rows].join("\n");
}

/**
 * What to fix, for the agent: the gaps, then every issue, the high ones
 * first and, within a severity, the ones on the weakest categories first.
 */
export function feedbackMarkdown(
  reviews: Review[],
  gaps: Gap[],
  failed: string[],
): string {
  const lowest = new Map<Category, number>();
  for (const r of reviews)
    for (const { key } of CATEGORIES)
      lowest.set(key, Math.min(lowest.get(key) ?? 10, r.ours[key]));
  const issues = reviews
    .flatMap((r) =>
      r.issues.map((issue) => ({ ...issue, reviewer: r.reviewer })),
    )
    .sort(
      (a, b) =>
        SEVERITIES.indexOf(a.severity) - SEVERITIES.indexOf(b.severity) ||
        lowest.get(a.category)! - lowest.get(b.category)!,
    );
  const title = (key: Category) => CATEGORIES.find((c) => c.key === key)!.title;
  return [
    "# What to fix",
    "",
    failed.length
      ? `Reviewers with no usable answer this round (run them again): ${failed.join(", ")}.\n`
      : "",
    "## Gaps",
    "",
    gaps.length
      ? gaps
          .map(
            (g) =>
              `- ${g.reviewer}, ${title(g.category)}: ${fmt(g.ours)}, needs ${fmt(g.needs)} (${g.because === "target" ? "the target" : `${g.because} scored that`})`,
          )
          .join("\n")
      : "None.",
    "",
    "## Issues",
    "",
    ...issues.map(
      (i) =>
        `- **[${i.severity}] ${title(i.category)}** (${i.reviewer}; ${i.screens.join(", ") || "all screens"}): ${i.problem}\n  Fix: ${i.fix}`,
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
