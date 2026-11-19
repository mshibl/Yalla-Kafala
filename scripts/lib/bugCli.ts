/**
 * The `bug-tracker` command (`pnpm -s bug-tracker …`, scripts/bug-tracker.ts):
 * what the sweep's ticket agent uses to list, read, file and comment on bugs
 * in the local bug file (scripts/lib/bugTracker.ts). Kept free of process
 * state so the tests can run it.
 */
import { existsSync, readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import {
  type Filter,
  formatBug,
  isSeverity,
  isSource,
  isStatus,
  type Severity,
  SEVERITIES,
  type Source,
  SOURCES,
  STATUSES,
} from "./bugStore";
import { comment, file, get, list, status } from "./bugTracker";

export const USAGE = `pnpm -s bug-tracker <command> [options]
  list [--open] [--status <s>] [--severity <s>] [--limit <n>] [--json]
  get <KEY> [--json]
  new --title <text> --severity ${SEVERITIES.join("|")} (--from <file> | --body <text>)
      [--source ${SOURCES.join("|")}] [--labels a,b] [--ref <finding id>]
      [--group <slug>] [--run <id>] [--commit <sha>] [--attach <png>]…
  comment <KEY> --body <text>
  update <KEY> --status ${STATUSES.join("|")} [--fixed-in <sha>] [--pr <url>]
Bugs are kept in reports/bugs/bugs.json (BUG_STORE moves it).`;

export type CliResult = { code: number; out: string; err: string };

type Parsed = {
  positional: string[];
  flags: Map<string, string[]>;
};

const BOOLEAN = new Set(["--open", "--json"]);

function parse(argv: string[]): Parsed {
  const positional: string[] = [];
  const flags = new Map<string, string[]>();
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    if (BOOLEAN.has(arg)) {
      flags.set(arg, ["true"]);
      continue;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--"))
      throw new Error(`${arg} needs a value`);
    flags.set(arg, [...(flags.get(arg) ?? []), value]);
    i++;
  }
  return { positional, flags };
}

/** Runs one command against the bug file at `path`; paths in `cwd` are resolved there. */
export function runCli(
  argv: string[],
  path: string,
  cwd: string,
  now = new Date(),
): CliResult {
  try {
    const [command, ...rest] = argv;
    if (!command || command === "--help" || command === "help")
      return { code: 0, out: `${USAGE}\n`, err: "" };
    const { positional, flags } = parse(rest);
    const one = (name: string) => flags.get(name)?.at(-1);
    const json = flags.has("--json");
    const keyArg = () => {
      const key = positional[0];
      if (!key) throw new Error(`${command} needs a bug key`);
      return key;
    };
    const absolute = (p: string) => (isAbsolute(p) ? p : resolve(cwd, p));

    switch (command) {
      case "list": {
        const filter: Filter = { open: flags.has("--open") };
        const s = one("--status");
        if (s) {
          if (!isStatus(s))
            throw new Error(`--status is one of ${STATUSES.join(", ")}`);
          filter.status = s;
        }
        const sev = one("--severity");
        if (sev) {
          if (!isSeverity(sev))
            throw new Error(`--severity is one of ${SEVERITIES.join(", ")}`);
          filter.severity = sev;
        }
        const limit = one("--limit");
        if (limit) filter.limit = Number(limit);
        const bugs = list(path, filter);
        if (json)
          return { code: 0, out: `${JSON.stringify({ bugs })}\n`, err: "" };
        return {
          code: 0,
          out: bugs.length
            ? `${bugs.map((b) => `${b.key}\t${b.status}\t${b.severity}\t${b.title}`).join("\n")}\n`
            : "No bugs.\n",
          err: "",
        };
      }
      case "get": {
        const bug = get(path, keyArg());
        if (!bug) return { code: 1, out: "", err: `No bug ${keyArg()}\n` };
        return {
          code: 0,
          out: json ? `${JSON.stringify({ bug })}\n` : `${formatBug(bug)}\n`,
          err: "",
        };
      }
      case "new": {
        const title = one("--title");
        if (!title) throw new Error("new needs --title");
        const severity = one("--severity") ?? "medium";
        if (!isSeverity(severity))
          throw new Error(`--severity is one of ${SEVERITIES.join(", ")}`);
        const source = one("--source") ?? "manual";
        if (!isSource(source))
          throw new Error(`--source is one of ${SOURCES.join(", ")}`);
        const from = one("--from");
        let evidence = one("--body") ?? "";
        if (from) {
          const p = absolute(from);
          if (!existsSync(p)) throw new Error(`--from: no such file ${p}`);
          evidence = readFileSync(p, "utf8");
        }
        const group = one("--group") ?? groupFromRef(one("--ref"));
        const result = file(
          path,
          {
            title,
            severity: severity as Severity,
            source: source as Source,
            evidence,
            group,
            labels: (one("--labels") ?? "")
              .split(",")
              .map((l) => l.trim())
              .filter(Boolean),
            ref: one("--ref"),
            run: one("--run"),
            commit: one("--commit"),
            attachments: (flags.get("--attach") ?? []).map(absolute),
          },
          now,
        );
        return {
          code: 0,
          out: `${result.bug.key}${result.created ? "" : " (already filed: added a comment)"}\n`,
          err: "",
        };
      }
      case "comment": {
        const body = one("--body");
        if (!body) throw new Error("comment needs --body");
        const bug = comment(path, keyArg(), body, now);
        return { code: 0, out: `${bug.key} commented\n`, err: "" };
      }
      case "update": {
        const to = one("--status");
        if (!to) throw new Error("update needs --status");
        const bug = status(
          path,
          keyArg(),
          to,
          { fixedIn: one("--fixed-in"), pr: one("--pr") },
          now,
        );
        return { code: 0, out: `${bug.key} is ${bug.status}\n`, err: "" };
      }
      default:
        throw new Error(`Unknown command ${command}\n\n${USAGE}`);
    }
  } catch (error) {
    return {
      code: 1,
      out: "",
      err: `${error instanceof Error ? error.message : String(error)}\n`,
    };
  }
}

/** The browser group slug in a finding id like `2026-11-19-1000/browser/03-support/F2`. */
export function groupFromRef(ref: string | undefined): string | undefined {
  return /\bbrowser\/(\d{2}-[a-z0-9-]+)\/F\d+/.exec(ref ?? "")?.[1];
}
