/**
 * The bugs the bug sweep and the bug council work with, as plain data: no
 * file, no process. `bugTracker.ts` keeps this in reports/bugs/bugs.json and
 * `scripts/bug-tracker.ts` is the command agents use.
 *
 * A bug has a key (`YKBUGS-<n>`), a title, a severity, a status, where it came
 * from (`source`), the browser group it belongs to (`group`), its evidence (the
 * text of the report) and its comments. A bug that is still there on re-check
 * goes back to `new` (scripts/lib/recheck.ts).
 */

export const KEY_PREFIX = "YKBUGS";

export const STATUSES = ["new", "in_progress", "fixed", "wont_fix"] as const;
export type Status = (typeof STATUSES)[number];

export const SEVERITIES = ["critical", "high", "medium", "low"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const SOURCES = ["sweep", "manual"] as const;
export type Source = (typeof SOURCES)[number];

export type BugComment = { at: string; body: string };

export type Bug = {
  key: string;
  title: string;
  severity: Severity;
  status: Status;
  source: Source;
  /** The browser group's slug (`03-support`), when the bug has one. */
  group?: string;
  /** The report: what is wrong, the steps, where it was seen. */
  evidence: string;
  labels: string[];
  /** The finding that produced it (`<run>/browser/03-support/F2`): filing one twice is a comment. */
  ref?: string;
  run?: string;
  commit?: string;
  fixedIn?: string;
  pr?: string;
  /** Absolute paths of screenshots. */
  attachments: string[];
  comments: BugComment[];
  createdAt: string;
  updatedAt: string;
};

export type Store = { next: number; bugs: Bug[] };

export const emptyStore = (): Store => ({ next: 1, bugs: [] });

/** Open means somebody still has to act: `new` or `in_progress`. */
export const isOpen = (status: Status): boolean =>
  status === "new" || status === "in_progress";

export function isStatus(value: unknown): value is Status {
  return STATUSES.includes(value as Status);
}

export function isSeverity(value: unknown): value is Severity {
  return SEVERITIES.includes(value as Severity);
}

export function isSource(value: unknown): value is Source {
  return SOURCES.includes(value as Source);
}

/** `YKBUGS-12` (any case, or just `12`) as the key; null when it isn't one. */
export function normalizeKey(text: string): string | null {
  const m = new RegExp(`^(?:${KEY_PREFIX}-)?(\\d+)$`, "i").exec(text.trim());
  return m ? `${KEY_PREFIX}-${Number(m[1])}` : null;
}

/** The store in `json`; an empty file or no file is an empty store, anything else throws. */
export function parseStore(json: string): Store {
  if (!json.trim()) return emptyStore();
  const raw = JSON.parse(json) as Partial<Store> | null;
  if (!raw || !Array.isArray(raw.bugs))
    throw new Error("The bug file is not a bug store ({ next, bugs })");
  const bugs = raw.bugs as Bug[];
  const highest = bugs.reduce(
    (max, b) => Math.max(max, Number(b.key.split("-").at(-1)) || 0),
    0,
  );
  return {
    next: Math.max(typeof raw.next === "number" ? raw.next : 1, highest + 1),
    bugs: bugs.map((b) => ({
      ...b,
      labels: b.labels ?? [],
      attachments: b.attachments ?? [],
      comments: b.comments ?? [],
      evidence: b.evidence ?? "",
    })),
  };
}

export type NewBug = {
  title: string;
  severity: Severity;
  source: Source;
  evidence: string;
  group?: string;
  labels?: string[];
  ref?: string;
  run?: string;
  commit?: string;
  attachments?: string[];
};

/**
 * Files a bug. One whose `ref` is already filed is not filed again: the
 * existing bug gets a "seen again" comment and is returned with `created:
 * false`. (The store is changed in place.)
 */
export function fileBug(
  store: Store,
  input: NewBug,
  now: Date,
): { bug: Bug; created: boolean } {
  const title = input.title.trim();
  if (!title) throw new Error("A bug needs a title");
  if (!input.evidence.trim()) throw new Error("A bug needs its evidence");
  const at = now.toISOString();
  const same = input.ref
    ? store.bugs.find((b) => b.ref === input.ref)
    : undefined;
  if (same) {
    same.comments.push({
      at,
      body: `Seen again${input.run ? ` in sweep ${input.run}` : ""}${input.commit ? ` at ${input.commit.slice(0, 12)}` : ""} (${input.ref}).`,
    });
    same.updatedAt = at;
    return { bug: same, created: false };
  }
  const bug: Bug = {
    key: `${KEY_PREFIX}-${store.next}`,
    title,
    severity: input.severity,
    status: "new",
    source: input.source,
    group: input.group,
    evidence: input.evidence.trim(),
    labels: input.labels ?? [],
    ref: input.ref,
    run: input.run,
    commit: input.commit,
    attachments: input.attachments ?? [],
    comments: [],
    createdAt: at,
    updatedAt: at,
  };
  store.next++;
  store.bugs.push(bug);
  return { bug, created: true };
}

function find(store: Store, key: string): Bug {
  const normal = normalizeKey(key);
  const bug = normal ? store.bugs.find((b) => b.key === normal) : undefined;
  if (!bug) throw new Error(`No bug ${key}`);
  return bug;
}

export function getBug(store: Store, key: string): Bug | undefined {
  const normal = normalizeKey(key);
  return normal ? store.bugs.find((b) => b.key === normal) : undefined;
}

export function addComment(
  store: Store,
  key: string,
  body: string,
  now: Date,
): Bug {
  if (!body.trim()) throw new Error("A comment needs text");
  const bug = find(store, key);
  bug.comments.push({ at: now.toISOString(), body: body.trim() });
  bug.updatedAt = now.toISOString();
  return bug;
}

/** Sets the status; `fixedIn` and `pr` are kept when given (for `fixed`). */
export function setStatus(
  store: Store,
  key: string,
  status: string,
  now: Date,
  extra: { fixedIn?: string; pr?: string } = {},
): Bug {
  if (!isStatus(status))
    throw new Error(`Status is one of ${STATUSES.join(", ")}, not "${status}"`);
  const bug = find(store, key);
  bug.status = status;
  if (extra.fixedIn) bug.fixedIn = extra.fixedIn;
  if (extra.pr) bug.pr = extra.pr;
  bug.updatedAt = now.toISOString();
  return bug;
}

export type Filter = {
  open?: boolean;
  status?: Status;
  severity?: Severity;
  limit?: number;
};

/** Bugs matching `filter`, newest first. */
export function listBugs(store: Store, filter: Filter = {}): Bug[] {
  const out = store.bugs
    .filter((b) => (filter.open ? isOpen(b.status) : true))
    .filter((b) => (filter.status ? b.status === filter.status : true))
    .filter((b) => (filter.severity ? b.severity === filter.severity : true))
    .reverse();
  return filter.limit ? out.slice(0, filter.limit) : out;
}

/** One bug as text, for `bug-tracker get` without --json. */
export function formatBug(bug: Bug): string {
  const lines = [
    `${bug.key}  ${bug.title}`,
    `Severity: ${bug.severity}  Status: ${bug.status}  Source: ${bug.source}${bug.group ? `  Group: ${bug.group}` : ""}`,
    bug.ref ? `Ref: ${bug.ref}` : "",
    bug.fixedIn ? `Fixed in: ${bug.fixedIn}` : "",
    "",
    bug.evidence,
    ...bug.attachments.map((a) => `Attachment: ${a}`),
    ...bug.comments.map((c) => `\n[${c.at}] ${c.body}`),
  ];
  return lines.filter((l, i) => l !== "" || i > 0).join("\n");
}
