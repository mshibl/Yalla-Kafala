---
name: bug-council
description: Fix the bugs the bug sweep finds on a work branch, sweep the fixed areas again, and score each round until no critical or high bug is open and two full sweeps in a row file no new one. Use only when the owner asks to "run the bug council", for a fix-and-sweep-again loop, or to harden a branch with the sweep.
---

# Bug council

A loop: **sweep → score → fix → sweep the fixed areas again → score**, until the score says `done`. `pnpm bug-sweep` finds the bugs and `pnpm bug-council score` keeps the score; you are the loop around them. It writes no Playwright specs, but the sweep builds the site locally, starts a throwaway Convex backend and drives a browser with agent-browser. Read `docs/bug-council.md` first.

## Before the first round

1. Run it only when the owner asks for it in this conversation (AGENTS.md). Not during feature work, and never to check your own change. Otherwise stop and ask.
2. Work on a branch of its own (`council/bugs-<yyyy-mm-dd>`) from the branch the owner names, up to date with it, with a clean tree. The sweep tests the branch's last commit, not uncommitted files: commit before every sweep. The branch must contain the councils' scripts.
3. One council at a time, and not next to the design council's build on the same ports unless the owner says the machine can carry it (the sweep uses 3700–3711, the design council 3600–3611).
4. Bugs live in the local store, `reports/bugs/bugs.json` (`pnpm -s bug-tracker …`, keys `YKBUGS-n`). There is no hosted tracker and no token to set. The owner has installed `agent-browser` and has the `claude` CLI signed in (`docs/bug-council.md`, "Before the first run"); the sweep names what is missing.

## Round 1

1. Commit, then run `pnpm bug-sweep --ref <branch>` in the background. It is a full sweep (every browser group); it runs long.
2. `pnpm bug-council score`. The council is named after the branch: its README is `reports/bug-council/<branch, with / as ->/README.md`.
3. The last line printed is the state: `done`, `stalled` or `continue`. Read the README: the rounds table, the latest round per area, why it isn't done, and **Fix next**.

## Each later round

1. Take **Fix next** from the README: five bugs at most. Put a bug that the last re-check found still there first.
2. For each bug, in order:
   - `pnpm -s bug-tracker update <KEY> --status in_progress`.
   - Where a seam exists (a pure function, a Convex function, a component test), write the failing unit test first. Then fix. Keep the fix to what the bug describes.
   - Commit: `YKBUGS-n: <what was fixed>`.
   - `pnpm -s bug-tracker update <KEY> --status fixed --fixed-in <sha>` once the commit exists on the branch (add `--pr <url>` only when a pull request exists).
3. Run `pnpm test`, `pnpm lint` and `pnpm typecheck` once, after the last fix. Fix what they report, and commit.
4. Sweep only the fixed areas again: `pnpm bug-sweep --ref <branch> --recheck YKBUGS-12,YKBUGS-15`, naming the bugs you just fixed. It checks those bugs first in the groups they belong to, then walks those groups. Run it in the background.
5. `pnpm bug-council score`.

A bug the re-check finds `still there` is back to `new` with a comment: it goes to the top of the next round. A bug that can't be fixed without a product decision stays open with a comment (`pnpm -s bug-tracker comment <KEY> --body "<the decision needed>"`); skip it and list it in the hand-over.

## Full sweeps at the end

A targeted sweep never counts toward `done`. When the score shows no open critical or high bug, run `pnpm bug-sweep --ref <branch>` (full) and score it. Go on with full sweeps, fixing whatever they file, until the two latest full sweeps filed no new critical or high bug.

## When to stop

- **`done`**: no open critical or high bug, the flow pass rate at the bar (95% by default; `--pass-rate <percent>` on `score` changes it), no fixed bug found still there, and the two latest full sweeps filed no new critical or high bug.
- **`stalled`**: the last three rounds lowered neither the open critical and high bugs nor raised the pass rate. Stop and report what is holding it back.
- **Limit**: eight rounds, unless the owner gave another.

## Rules

- Never edit the feature map (`docs/agents/feature-map.md`), the agent prompts (`scripts/bug-sweep/`) or a bug's severity to improve the score. Those are the measuring stick.
- Every finding goes to the Opus ticket agent, which files the real ones: there is no scoring filter. If the agent filed something that isn't a bug, mark it `wont_fix` with a comment saying why; don't delete it.
- Never weaken or delete a test to make a fix pass. A test that was wrong gets a reason in the commit message.
- Write no end-to-end or Playwright specs and run no other browser test.
- Bugs found outside what the sweep filed go to the store with `pnpm -s bug-tracker new --source manual …`.
- Don't push or open a pull request unless the owner asks.

## The hand-over

End with: the council's README (the rounds table), what was fixed (each `YKBUGS-n` with its commit), what is left open with the reason (product decisions, `still there`, new bugs from the last sweep), the state word, and the branch.

## The commands

```
pnpm bug-sweep --ref <branch>                              # full sweep of the branch's last commit
pnpm bug-sweep --ref <branch> --recheck YKBUGS-12,YKBUGS-15  # only the fixed bugs' groups
pnpm bug-sweep --dry-run                                   # print the plan and the first prompts, start nothing
pnpm bug-council score                                     # score the latest finished sweep
pnpm bug-council score --run <folder or run id> --council <name> --pass-rate 95 --next 5
```

All `pnpm bug-sweep` options (`--groups`, `--no-build`, the minutes per agent and more) are in `USAGE` in `scripts/lib/bugSweep.ts`; `pnpm bug-council` with no arguments prints its own.
