/**
 * The bug store on disk. Bugs live in `reports/bugs/bugs.json` of the owner's
 * checkout (git-ignored); `BUG_STORE` moves it, which is how agents working in
 * a worktree reach the same file. Every change takes a lock and is written to
 * a temporary file first, so two agents filing at once can't lose a bug.
 *
 * The data rules are in bugStore.ts; the command agents use is
 * scripts/bug-tracker.ts (`pnpm -s bug-tracker …`).
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import {
  addComment,
  type Bug,
  fileBug,
  type Filter,
  getBug,
  listBugs,
  type NewBug,
  parseStore,
  setStatus,
  type Store,
} from "./bugStore";

export { KEY_PREFIX } from "./bugStore";

export type Env = Record<string, string | undefined>;

/** The bug file: `BUG_STORE`, else `reports/bugs/bugs.json` under `root`. */
export function storeFile(root: string, env: Env = process.env): string {
  return resolve(env.BUG_STORE || join(root, "reports/bugs/bugs.json"));
}

const LOCK_STALE_MS = 30_000;
const LOCK_WAIT_MS = 10_000;

function sleepSync(ms: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

/** Runs `fn` while holding the lock next to `file` (a directory made with mkdir). */
export function withLock<T>(file: string, fn: () => T): T {
  const lock = `${file}.lock`;
  mkdirSync(dirname(file), { recursive: true });
  const started = Date.now();
  for (;;) {
    try {
      mkdirSync(lock);
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      try {
        if (Date.now() - statSync(lock).mtimeMs > LOCK_STALE_MS)
          rmSync(lock, { recursive: true, force: true });
      } catch {
        // the other process just released it
      }
      if (Date.now() - started > LOCK_WAIT_MS)
        throw new Error(`The bug file is locked (${lock}); remove it if stale`);
      sleepSync(50);
    }
  }
  try {
    return fn();
  } finally {
    rmSync(lock, { recursive: true, force: true });
  }
}

export function readStore(file: string): Store {
  return parseStore(existsSync(file) ? readFileSync(file, "utf8") : "");
}

function writeStore(file: string, store: Store) {
  const temp = `${file}.${process.pid}.tmp`;
  writeFileSync(temp, `${JSON.stringify(store, null, 2)}\n`);
  renameSync(temp, file);
}

/** Reads, changes and writes the store under the lock. */
export function update<T>(file: string, change: (store: Store) => T): T {
  return withLock(file, () => {
    const store = readStore(file);
    const result = change(store);
    writeStore(file, store);
    return result;
  });
}

export function file(
  path: string,
  input: NewBug,
  now = new Date(),
): { bug: Bug; created: boolean } {
  return update(path, (store) => fileBug(store, input, now));
}

export function comment(
  path: string,
  key: string,
  body: string,
  now = new Date(),
): Bug {
  return update(path, (store) => addComment(store, key, body, now));
}

export function status(
  path: string,
  key: string,
  to: string,
  extra: { fixedIn?: string; pr?: string } = {},
  now = new Date(),
): Bug {
  return update(path, (store) => setStatus(store, key, to, now, extra));
}

export function get(path: string, key: string): Bug | undefined {
  return getBug(readStore(path), key);
}

export function list(path: string, filter: Filter = {}): Bug[] {
  return listBugs(readStore(path), filter);
}

/** Open bugs as `{ id, title }`, for the agents' "already known" lists. */
export function openBugs(path: string): { id: string; title: string }[] {
  return list(path, { open: true }).map((b) => ({ id: b.key, title: b.title }));
}
