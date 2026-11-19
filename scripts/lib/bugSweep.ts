/**
 * The bug sweep (scripts/bug-sweep.ts): Haiku agents test the site in a
 * browser (scripts/lib/browserHunt.ts) on a local test-mode build with demo
 * data; their findings become one list (scripts/lib/findings.ts, with no
 * filter: every finding is filed); Opus files one bug per root cause in the
 * local bug file (reports/bugs/bugs.json) with the `bug-tracker` command
 * (scripts/lib/bugTracker.ts). This module holds its options and the parts
 * the other modules share.
 */
import { KEY_PREFIX } from "./bugTracker";

/** The bug tracker's key prefix every bug is numbered under. */
export const PROJECT = KEY_PREFIX;

/** The models, as the Claude Code CLI takes them. */
export const HAIKU = "claude-haiku-5-5";
export const OPUS = "claude-opus-5-5";

export type Options = {
  /** The branch, tag or commit to test. */
  ref: string;
  /** Browser groups (1–6) to run; empty means all. */
  groups: number[];
  /** Bugs marked fixed to check again in the browser (`YKBUGS-12`); empty means a normal sweep. */
  recheck: string[];
  browserPerWave: number;
  browserMinutes: number;
  ticketMinutes: number;
  build: boolean;
  tickets: boolean;
  dryRun: boolean;
};

export const DEFAULTS: Options = {
  ref: "HEAD",
  groups: [],
  recheck: [],
  browserPerWave: 2,
  browserMinutes: 15,
  ticketMinutes: 60,
  build: true,
  tickets: true,
  dryRun: false,
};

export const USAGE = `pnpm bug-sweep [options]
  --ref <ref>               what to test (default HEAD: the branch you are on)
  --groups 1,4              browser groups (default all 6)
  --recheck ${PROJECT}-12,${PROJECT}-15
                            check these fixed bugs again first, and with no --groups
                            only the groups they belong to
  --browser-per-wave <n>    browser agents at once (default 2)
  --browser-minutes <n>     per browser agent (default 15)
  --ticket-minutes <n>      for the Opus agent (default 60)
  --no-build                reuse the worktree's last build
  --no-tickets              stop after the findings list: no Opus, no bugs filed
  --dry-run                 print the plan and the first prompt, start nothing`;

export function parseArgs(argv: string[]): Options {
  const options: Options = { ...DEFAULTS };
  const positive = (flag: string, value: string | undefined): number => {
    const n = Number(value);
    if (!value || !Number.isFinite(n) || n <= 0)
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
      case "--ref":
        options.ref = takes();
        break;
      case "--groups":
        options.groups = takes()
          .split(",")
          .map((id) => positive(flag, id.trim()));
        break;
      case "--recheck":
        options.recheck = takes()
          .split(",")
          .map((key) => {
            const m = new RegExp(`^(?:${PROJECT}-)?(\\d+)$`, "i").exec(
              key.trim(),
            );
            if (!m) throw new Error(`--recheck takes keys like ${PROJECT}-12`);
            return `${PROJECT}-${Number(m[1])}`;
          });
        break;
      case "--browser-per-wave":
        options.browserPerWave = positive(flag, takes());
        break;
      case "--browser-minutes":
        options.browserMinutes = positive(flag, takes());
        break;
      case "--ticket-minutes":
        options.ticketMinutes = positive(flag, takes());
        break;
      case "--no-build":
        options.build = false;
        break;
      case "--no-tickets":
        options.tickets = false;
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      default:
        throw new Error(`Unknown option ${flag}\n\n${USAGE}`);
    }
  }
  return options;
}

/** Fills `{{name}}` placeholders; a placeholder with no value is an error. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    const value = values[name];
    if (value === undefined) throw new Error(`No value for {{${name}}}`);
    return value;
  });
}

/** `HH:MM`, local time, `minutes` after `from`. */
export function clockAfter(from: Date, minutes: number): string {
  const at = new Date(from.getTime() + minutes * 60_000);
  return `${String(at.getHours()).padStart(2, "0")}:${String(at.getMinutes()).padStart(2, "0")}`;
}

/**
 * Tools the ticket agent may use: read the code, re-check a finding in the
 * browser while the sweep's app still runs, write in the run folder, and
 * list and file bugs with `pnpm -s bug-tracker`.
 */
export function ticketArgs(prompt: string, runDir: string): string[] {
  return [
    "-p",
    prompt,
    "--model",
    OPUS,
    "--permission-mode",
    "dontAsk",
    "--add-dir",
    runDir,
    "--allowedTools",
    "Read",
    "Grep",
    "Glob",
    // Edit rules cover every file-writing tool, Write included.
    `Edit(/${runDir}/**)`,
    "Bash(agent-browser:*)",
    "Bash(date:*)",
    "Bash(git log:*)",
    "Bash(git grep:*)",
    "Bash(pnpm -s bug-tracker new:*)",
    "Bash(pnpm -s bug-tracker list:*)",
    "Bash(pnpm -s bug-tracker get:*)",
    "Bash(pnpm -s bug-tracker comment:*)",
    "--disallowedTools",
    "WebFetch",
    "WebSearch",
    "Agent",
    "--strict-mcp-config",
    "--output-format",
    "stream-json",
    "--verbose",
  ];
}
