# Bug council

A way to harden a branch with the bug sweep: sweep it, fix the worst bugs the sweep filed, sweep the fixed areas again, and score every round, until the score says the branch is clean. The sweep finds the bugs; `pnpm bug-council score` keeps the score; an agent is the loop around them.

## Who runs it, and when

Only when the owner asks, and never as part of feature work or to check a change. The sweep builds the site, starts a throwaway backend and drives a browser with browser agents (`agent-browser`); it is not an end-to-end test and writes no specs. `pnpm bug-sweep --dry-run` prints the plan and the first prompt and starts nothing.

## The bug sweep

`pnpm bug-sweep` tests one commit of the site:

1. **The app.** The commit is checked out in a worktree (`../yk-bug-sweep`) and started the same safe, local way as the design council: a throwaway local Convex backend with invented demo rows, and a production build in council test mode, on port 3700 (Convex 3710 and 3711). See [design-council.md](design-council.md), "The test-only login and the demo data": the admin area opens through a flag-guarded test-only login, nothing reaches production, and the sweep refuses any non-local URL. The demo rows are written again between waves.
2. **Browser agents.** Six groups (`scripts/bug-sweep/browser/groups/`), each a brief for one cheap model (Haiku) driving `agent-browser`: the public pages to learn, the stories (blogs and articles), support (donate, partnerships, newsletter), language (English, Arabic and right to left), and the admin area's stories and site settings. They run in waves of two (`--browser-per-wave`) and each walks the flows of its group from the **feature map** (`docs/agents/feature-map.md`: 46 flows, each with its route). A flow ends `pass`, `fail`, `blocked` or `not reached`.
3. **Findings.** Each agent writes `findings.md`; the sweep joins them.
4. **One Opus ticket agent** reads every finding, de-duplicates them against the open bugs and each other, drops what is not a bug, and files **one bug per root cause** in the local bug store (below). There is **no scoring filter**: Hakimy puts a model-scored threshold in front of its ticket agent; here every finding goes to the agent, who decides. It is the only judgement between a finding and a bug, so read `reports/bug-sweep/<run>/not-bugs.md` too.
5. **The report.** `reports/bug-sweep/<run>/report.md` (and `latest.md`): the flows by group, the new bugs, the re-checks.

```sh
pnpm bug-sweep --ref <branch>                               # a full sweep of the branch's last commit
pnpm bug-sweep --ref <branch> --recheck YKBUGS-12,YKBUGS-15   # check those fixed bugs, then only their groups
pnpm bug-sweep --groups 1,4                                 # only these browser groups
pnpm bug-sweep --dry-run                                    # print the plan and the first prompt, start nothing
```

All options are in `USAGE` in `scripts/lib/bugSweep.ts`. The sweep tests a **committed** ref (default `HEAD`), not the working tree: commit first. The ref must contain the councils' scripts (this branch, or one merged with it), because the worktree runs them.

`--recheck` walks each named fixed bug again, in the browser group it belongs to; a bug found `still there` gets a comment with the evidence and goes back to `new`. Then the groups of those bugs are walked in full.

### Before the first run

By the owner, once:

```sh
pnpm install
npm i -g agent-browser    # the browser agents' CLI; follow its own install notes for its browser (unchecked here)
```

and the `claude` CLI signed in. (The sweep does not use Playwright; the design council does, and needs `pnpm exec playwright install chromium`.) The sweep checks `claude`, `agent-browser`, `pnpm`, `npx`, the ports and the machine's load before it starts anything. Whether `agent-browser` works on your machine is **unchecked**: it was never run while this was built.

### Not covered

Clerk sign-in itself, uploads, the Facebook sync, a successful newsletter sign-up, the links out to donation, volunteer and social pages, email, the sitemap and robots. The feature map lists them under "Not covered by the sweep", and the agents are told not to report them.

## The bug store

There is no hosted bug tracker. Bugs live in `reports/bugs/bugs.json` (git-ignored; `BUG_STORE=<file>` moves it), behind `scripts/lib/bugTracker.ts`, with keys `YKBUGS-1`, `YKBUGS-2`… Writes take a lock folder and replace the file atomically, so the sweep's agent and you can use it at the same time.

```sh
pnpm -s bug-tracker list --open                              # the open bugs
pnpm -s bug-tracker get YKBUGS-3
pnpm -s bug-tracker new --title "…" --severity high --from body.md --source manual
pnpm -s bug-tracker comment YKBUGS-3 --body "…"
pnpm -s bug-tracker update YKBUGS-3 --status in_progress     # new | in_progress | fixed | wont_fix
pnpm -s bug-tracker update YKBUGS-3 --status fixed --fixed-in <sha> --pr <url>
```

Severities are `critical`, `high`, `medium` and `low`; sources are `sweep` and `manual`. A bug is open while its status is `new` or `in_progress`.

## What the score is made of

One round is one finished sweep. Its score is, for every browser group and for all of them together:

- **Flow pass rate.** Each flow a group walks ends `pass`, `fail`, `blocked` or `not reached`. The rate is pass over pass, fail and blocked: a flow the agent never reached is left out, so a slow agent doesn't lower it. A group the sweep skipped keeps the flow numbers of the last round that walked it (the README marks the round).
- **Open critical and high bugs.** The store's live count of open bugs from any source, by group where the bug's reference names one; a bug with no group counts in the overall number only.
- **New critical and high bugs** this sweep filed.
- **Re-checks.** Of the fixed bugs the sweep walked again: how many are `fixed`, `still there` or could not be checked.

## done, stalled and continue

`pnpm bug-council score` scores the latest finished sweep (it starts no browser and no agent); the last line it prints is the state.

**`done`** needs all of:

- no open critical or high bug;
- the flow pass rate at the bar (95%; `--pass-rate <percent>`);
- no fixed bug found `still there` in the latest round;
- two full sweeps (every browser group), and the two latest of them filed no new critical or high bug. A targeted sweep never counts.

**`stalled`**: the last three rounds lowered neither the open critical and high bugs nor raised the pass rate, while one of them could still improve (an open critical or high bug, or a pass rate under the bar). A council that is only waiting for its clean full sweeps is not stalled.

**`continue`** is every other case. The README says why, one line per unmet rule, and lists **Fix next**: the open critical, then high bugs, the area with the lowest pass rate first, five at most (`--next <n>`).

The agent also stops after eight rounds. Scoring a sweep run again replaces its round instead of adding one.

```sh
pnpm bug-council score
pnpm bug-council score --run <folder or run id> --council <name> --pass-rate 95 --next 5
```

## Where the runs are kept

`reports/bug-council/<name>/` (git-ignored). `<name>` is the branch name in lower case with other characters as `-` (`--council <name>` overrides it).

| File           | What                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| `history.json` | One record per round: the sweep run, its commit, the groups it walked, the score per group and overall |
| `README.md`    | The state, the rounds table, the latest round per area, why it is not done, and Fix next               |

The sweeps themselves stay in `reports/bug-sweep/<run>/`, and the bugs in `reports/bugs/bugs.json`.

## Changing it

- **The measuring stick** is the feature map, the agent prompts in `scripts/bug-sweep/` and each bug's severity. Change them between councils, never during one: rounds scored on different sticks don't compare.
- **The rules for `done` and `stalled`** are `verdict` in `scripts/lib/bugCouncil.ts`, with its tests beside it.

## Left out of the port

No nightly schedule (no installer, no cron), no kb slots or ticket checks, no Jev scoring filter (above), no code-review part (`codeReview.ts` and `code/*`), no PostHog and no mobile app: none of them exist here, or the owner's brief left them out.
