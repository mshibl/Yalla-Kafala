import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  addComment,
  emptyStore,
  fileBug,
  formatBug,
  getBug,
  isOpen,
  listBugs,
  normalizeKey,
  type NewBug,
  parseStore,
  setStatus,
} from "./bugStore";
import { runCli } from "./bugCli";
import {
  file,
  openBugs,
  readStore,
  storeFile,
  update,
  withLock,
} from "./bugTracker";

const dirs: string[] = [];
const tempDir = () => {
  const dir = mkdtempSync(join(tmpdir(), "bugs-"));
  dirs.push(dir);
  return dir;
};
afterEach(() => {
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});

const NOW = new Date("2026-11-19T10:00:00Z");
const input = (over: Partial<NewBug> = {}): NewBug => ({
  title: "Fix: the Arabic menu opens on the wrong side",
  severity: "high",
  source: "sweep",
  evidence: "## Problem\nThe menu opens on the left in Arabic.",
  ...over,
});

describe("bugStore", () => {
  it("numbers bugs YKBUGS-1, -2, … and starts them as new", () => {
    const store = emptyStore();
    const a = fileBug(store, input(), NOW).bug;
    const b = fileBug(store, input({ title: "Fix: other" }), NOW).bug;
    expect([a.key, b.key]).toEqual(["YKBUGS-1", "YKBUGS-2"]);
    expect(a.status).toBe("new");
    expect(a.comments).toEqual([]);
  });

  it("files the same finding once: the second time is a comment", () => {
    const store = emptyStore();
    const first = fileBug(
      store,
      input({ ref: "r/browser/02-stories/F1" }),
      NOW,
    );
    const again = fileBug(
      store,
      input({ ref: "r/browser/02-stories/F1", run: "R2" }),
      NOW,
    );
    expect(first.created).toBe(true);
    expect(again.created).toBe(false);
    expect(again.bug.key).toBe(first.bug.key);
    expect(store.bugs).toHaveLength(1);
    expect(again.bug.comments[0]!.body).toContain("Seen again in sweep R2");
  });

  it("refuses an empty title or evidence", () => {
    expect(() => fileBug(emptyStore(), input({ title: " " }), NOW)).toThrow(
      /title/,
    );
    expect(() => fileBug(emptyStore(), input({ evidence: "" }), NOW)).toThrow(
      /evidence/,
    );
  });

  it("changes status, and a bug still there goes back to new", () => {
    const store = emptyStore();
    const { bug } = fileBug(store, input(), NOW);
    setStatus(store, bug.key, "fixed", NOW, { fixedIn: "abc123", pr: "u" });
    expect(bug.status).toBe("fixed");
    expect(bug.fixedIn).toBe("abc123");
    expect(isOpen(bug.status)).toBe(false);
    setStatus(store, "ykbugs-1", "new", NOW);
    expect(bug.status).toBe("new");
    expect(isOpen(bug.status)).toBe(true);
    expect(() => setStatus(store, bug.key, "done", NOW)).toThrow(
      /Status is one of/,
    );
    expect(() => setStatus(store, "YKBUGS-99", "fixed", NOW)).toThrow(/No bug/);
  });

  it("adds comments", () => {
    const store = emptyStore();
    fileBug(store, input(), NOW);
    addComment(store, "1", "still there at 360 px", NOW);
    expect(getBug(store, "YKBUGS-1")!.comments.at(-1)!.body).toBe(
      "still there at 360 px",
    );
    expect(() => addComment(store, "1", " ", NOW)).toThrow(/text/);
  });

  it("lists newest first and filters", () => {
    const store = emptyStore();
    fileBug(store, input({ title: "one", severity: "low" }), NOW);
    fileBug(store, input({ title: "two", severity: "critical" }), NOW);
    fileBug(store, input({ title: "three" }), NOW);
    setStatus(store, "YKBUGS-1", "fixed", NOW);
    expect(listBugs(store).map((b) => b.title)).toEqual([
      "three",
      "two",
      "one",
    ]);
    expect(listBugs(store, { open: true }).map((b) => b.title)).toEqual([
      "three",
      "two",
    ]);
    expect(listBugs(store, { severity: "critical" })).toHaveLength(1);
    expect(listBugs(store, { status: "fixed" })).toHaveLength(1);
    expect(listBugs(store, { limit: 1 })).toHaveLength(1);
  });

  it("reads keys in any form", () => {
    expect(normalizeKey("ykbugs-12")).toBe("YKBUGS-12");
    expect(normalizeKey(" 7 ")).toBe("YKBUGS-7");
    expect(normalizeKey("HBUGS-1")).toBeNull();
    expect(normalizeKey("x")).toBeNull();
  });

  it("parses an empty file, fills missing fields and never reuses a number", () => {
    expect(parseStore("").bugs).toEqual([]);
    expect(() => parseStore("[]")).toThrow(/not a bug store/);
    const store = parseStore(
      JSON.stringify({
        next: 1,
        bugs: [
          {
            key: "YKBUGS-5",
            title: "t",
            severity: "low",
            status: "new",
            source: "manual",
            createdAt: "x",
            updatedAt: "x",
          },
        ],
      }),
    );
    expect(store.next).toBe(6);
    expect(store.bugs[0]!.comments).toEqual([]);
    expect(store.bugs[0]!.attachments).toEqual([]);
  });

  it("formats a bug as text", () => {
    const store = emptyStore();
    const { bug } = fileBug(store, input({ group: "02-stories" }), NOW);
    const text = formatBug(bug);
    expect(text).toContain("YKBUGS-1  Fix: the Arabic menu");
    expect(text).toContain("Group: 02-stories");
    expect(text).toContain("The menu opens on the left");
  });
});

describe("bugTracker (the file)", () => {
  it("keeps bugs in the given file and survives a re-read", () => {
    const path = join(tempDir(), "reports/bugs/bugs.json");
    const { bug } = file(path, input(), NOW);
    expect(existsSync(path)).toBe(true);
    expect(readStore(path).bugs.map((b) => b.key)).toEqual([bug.key]);
    file(path, input({ title: "second" }), NOW);
    expect(readStore(path).next).toBe(3);
    expect(openBugs(path).map((b) => b.id)).toEqual(["YKBUGS-2", "YKBUGS-1"]);
  });

  it("takes the file from BUG_STORE, else reports/bugs/bugs.json", () => {
    expect(storeFile("/r", {})).toBe("/r/reports/bugs/bugs.json");
    expect(storeFile("/r", { BUG_STORE: "/x/y.json" })).toBe("/x/y.json");
  });

  it("holds a lock while it changes the file, and frees it", () => {
    const path = join(tempDir(), "bugs.json");
    withLock(path, () => {
      expect(existsSync(`${path}.lock`)).toBe(true);
    });
    expect(existsSync(`${path}.lock`)).toBe(false);
    expect(() =>
      update(path, () => {
        throw new Error("boom");
      }),
    ).toThrow("boom");
    expect(existsSync(`${path}.lock`)).toBe(false);
  });

  it("takes over a stale lock", () => {
    const path = join(tempDir(), "bugs.json");
    mkdirSync(`${path}.lock`);
    const old = new Date(Date.now() - 120_000);
    utimesSync(`${path}.lock`, old, old);
    expect(withLock(path, () => "ok")).toBe("ok");
  });

  it("fails clearly on a broken file instead of overwriting it", () => {
    const path = join(tempDir(), "bugs.json");
    writeFileSync(path, "not json");
    expect(() => file(path, input(), NOW)).toThrow();
    expect(readFileSync(path, "utf8")).toBe("not json");
  });
});

describe("the bug-tracker command", () => {
  const setup = () => {
    const dir = tempDir();
    return { dir, path: join(dir, "bugs.json") };
  };

  it("files a bug from a file, with attachments resolved in the cwd", () => {
    const { dir, path } = setup();
    writeFileSync(join(dir, "body.md"), "## Problem\nBroken.");
    const r = runCli(
      [
        "new",
        "--title",
        "Fix: broken",
        "--severity",
        "critical",
        "--source",
        "sweep",
        "--ref",
        "R/browser/03-support/F4",
        "--run",
        "R",
        "--labels",
        "bug, ui",
        "--from",
        "body.md",
        "--attach",
        "shot.png",
      ],
      path,
      dir,
      NOW,
    );
    expect(r).toEqual({ code: 0, out: "YKBUGS-1\n", err: "" });
    const bug = readStore(path).bugs[0]!;
    expect(bug.evidence).toContain("Broken.");
    expect(bug.group).toBe("03-support");
    expect(bug.labels).toEqual(["bug", "ui"]);
    expect(bug.attachments).toEqual([join(dir, "shot.png")]);
  });

  it("says when a finding was already filed", () => {
    const { dir, path } = setup();
    const args = ["new", "--title", "t", "--body", "b", "--ref", "x/F1"];
    runCli(args, path, dir, NOW);
    expect(runCli(args, path, dir, NOW).out).toContain("already filed");
  });

  it("lists as JSON for the scripts and as text for people", () => {
    const { dir, path } = setup();
    runCli(["new", "--title", "t", "--body", "b"], path, dir, NOW);
    const json = JSON.parse(
      runCli(["list", "--open", "--json"], path, dir).out,
    );
    expect(json.bugs[0].key).toBe("YKBUGS-1");
    expect(runCli(["list"], path, dir).out).toContain(
      "YKBUGS-1\tnew\tmedium\tt",
    );
    expect(runCli(["list", "--status", "fixed"], path, dir).out).toBe(
      "No bugs.\n",
    );
  });

  it("gets, comments and updates", () => {
    const { dir, path } = setup();
    runCli(["new", "--title", "t", "--body", "b"], path, dir, NOW);
    expect(
      runCli(["comment", "YKBUGS-1", "--body", "hi"], path, dir).code,
    ).toBe(0);
    expect(
      runCli(
        ["update", "YKBUGS-1", "--status", "fixed", "--fixed-in", "abc"],
        path,
        dir,
      ).out,
    ).toBe("YKBUGS-1 is fixed\n");
    const got = JSON.parse(runCli(["get", "1", "--json"], path, dir).out).bug;
    expect(got.status).toBe("fixed");
    expect(got.fixedIn).toBe("abc");
    expect(got.comments[0].body).toBe("hi");
  });

  it("fails with a message and exit 1", () => {
    const { dir, path } = setup();
    for (const args of [
      ["get", "YKBUGS-9"],
      ["new"],
      ["new", "--title", "t"],
      ["new", "--title", "t", "--body", "b", "--severity", "huge"],
      ["update", "YKBUGS-1", "--status", "nope"],
      ["list", "--status", "nope"],
      ["frobnicate"],
      ["comment"],
    ]) {
      const r = runCli(args, path, dir);
      expect(r.code, args.join(" ")).toBe(1);
      expect(r.err).not.toBe("");
    }
    expect(runCli([], path, dir).out).toContain("pnpm -s bug-tracker");
  });
});
