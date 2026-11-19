# Design council

A way to improve the UI without a designer on the team: a panel of models answers a yes/no checklist about screenshots of the site, side by side with screenshots of other sites, and says what to fix. An agent fixes it, and the next round checks it again. The rounds go on until the council says it is done, or that it has stopped climbing.

The idea comes from treating design as a "hill climb": a number that can be raised one round at a time. Model opinions are noisy, so the council guards against the usual ways a hill climb fools itself:

- **A checklist, not a grade.** Each reviewer answers yes/no questions (`scripts/design-council/checklist.ts`: "Does every screen have one clearly primary action?"), each `pass`, `fail` or `na`. A score is the share of the checks that pass, so it moves when a check starts passing, not when a reviewer's mood changes.
- **Several reviewers**, ideally from different providers (Claude models and Codex), each in a fresh session. One model's answer means little; all of them agreeing means more.
- **Reference sites in the same pass.** A reviewer looking at our site alone is too generous. Next to other sites, the answers become honest.
- **Blind reviewers.** They never see the target or earlier rounds' scores: a reviewer told the goal tends to answer near it.
- **A ledger of issues.** Each issue a reviewer raises gets an ID and stays in the run's `issues.json` until most reviewers who look at it say it is fixed. A closed issue that comes back reopens.
- **A blind comparison.** From round 2, each screen whose picture changed is shown next to last round's, in random order, unlabelled, and the reviewers say which they would ship.

## Who runs it, and when

Only the owner starts it, or an agent the owner asked to, in that session. It builds the site, starts a throwaway backend and drives a browser, so it is never part of feature work and never a way to check a change (AGENTS.md). It is not an end-to-end test: it writes no specs and asserts nothing.

## Before the first run

One-time setup, by the owner:

```sh
pnpm install
pnpm exec playwright install chromium     # the browser the screenshots use (Playwright is only a library here)
npm i -g @openai/codex                    # optional: a second provider; without it Codex is skipped
```

You also need the `claude` CLI signed in (the reviewers run through `claude -p`), and `pnpm`/`npx` on the PATH. The script checks this and the ports before it starts anything, and says what is missing.

- **Reference sites**: put three to six screenshots of each of two or three other sites in `design/references/<site>/` (see the README there). The folder is git-ignored: other organisations' screenshots stay on the machine.
- **The tested commit must contain the council's scripts.** The round snapshots your working tree into a worktree and builds that, so run it from a checkout that has `scripts/design-council*` (this branch, or one merged with it).

## Running it

```sh
pnpm design-council                      # the next round, target 90
pnpm design-council --target 95          # a higher bar: the overall share of passing checks
pnpm design-council --reviewers codex    # one reviewer while far from the target, to save usage
pnpm design-council --review-only        # answer this round's screenshots again
pnpm design-council --capture-only       # only the screenshots
pnpm design-council --screens home,donate  # only these screens
pnpm design-council --dry-run            # print the reviewers' prompt, run nothing
```

`--dry-run` starts nothing: no app, no browser, no reviewer. All options are in `USAGE` in `scripts/lib/designCouncil.ts`; an unknown option prints them. The whole loop (fix, check, commit, next round, when to stop) is the agent's: the `design-council` skill (`.claude/skills/design-council/SKILL.md`).

## What a run starts

| What                                              | Where                                                   |
| ------------------------------------------------- | ------------------------------------------------------- |
| Worktree of the snapshot                          | `../yk-design-council` (beside the repo)                |
| A local Convex backend (anonymous, throwaway)     | `http://127.0.0.1:3610`, HTTP actions on 3611           |
| The site, a production build in council test mode | `http://localhost:3600`                                 |
| Demo data                                         | invented rows, written fresh at the start of each round |
| Logs                                              | `reports/design-council/<run>/round-NN/logs/`           |

The bug sweep uses 3700, 3710 and 3711, so the two can run together. Everything is stopped when the script ends, and the script runs `pkill -f` on the worktree's `.convex` folder as its last step, because the backend binary can outlive it. Nothing points at production: the backend script refuses a cloud Convex deployment, and `assertLocalUrl` checks the URL again before the site starts.

## The test-only login and the demo data

The admin area is behind Clerk, which a script can't sign in to, and the public pages need content. So a run uses a safe local copy of the site, and nothing else:

- **A throwaway Convex backend** (`scripts/council-backend.sh`): the anonymous local backend of the Convex CLI (`CONVEX_AGENT_MODE=anonymous npx convex dev`), state in `.convex/local/` inside the worktree. The script refuses to run if any `.env*` file or the shell names a cloud deployment.
- **Invented demo data** (`scripts/council/seedData.ts`): a few stories (the blogs and articles, published and a draft), FAQs, board members, carousel images, resources and Facebook posts, with placeholder text and no real people, and no newsletter subscribers. It is imported with `convex import --replace` at the start of each round (and between the bug sweep's waves), so every round starts from the same rows. No script reads or copies `.env*` files.
- **A flag-guarded test-only login.** The site is built with `NEXT_PUBLIC_COUNCIL_TEST_MODE=1`. In that mode only (`src/lib/councilTestMode.ts`):
  - `GET /api/council/login` sets the cookie `council_admin=1` and redirects to `/admin`; `/api/council/logout` clears it; `/api/council/session` hands the browser the local backend's admin key, so the Convex client acts as a fixed test admin. Without the flag all three answer 404.
  - The middleware treats the cookie as a signed-in admin instead of asking Clerk, and the providers leave Clerk and PostHog out.
  - The mode **refuses to switch on** (it throws) unless the Convex URL is a local address and `VERCEL` is unset. It does not rely on `NODE_ENV`: the councils run `next start`, which is `production` anyway. A production or cloud build, which has a cloud Convex URL, cannot run it, and the flag is never set in any deploy.
- The screenshots log in with `GET /api/council/login`; the bug-sweep agents do the same.

Not covered, because it needs a real service: Clerk sign-in itself, uploads, the Facebook sync, a successful newsletter sign-up, the links out to donation, volunteer and social pages, email, the sitemap and robots.

## What one round does

1. **Snapshot.** The working tree, committed or not, becomes a commit of its own (the branch and the index are untouched), checked out in `../yk-design-council`.
2. **The app.** `pnpm install --frozen-lockfile` there, the local backend, the seed, a production build in test mode and `pnpm start` on 3600 (`scripts/lib/localApp.ts`). The build uses dummy values for the keys the site's env schema requires, with `SKIP_ENV_VALIDATION=1`.
3. **Screenshots.** Playwright as a library (`scripts/lib/designCapture.ts`) photographs the screens in `scripts/design-council/screens.ts`: the main public pages at 360 px (2× pixels) and 1280 px, the main ones in Arabic too, and the admin pages after the test-only login. Pages taller than 2400 px are cut there.
4. **Reviewers.** Each gets the prompt in `scripts/design-council/reviewer.md`, the screenshots and the reference sites. Claude models run through `claude -p`, only able to read the round's folder; Codex runs through `codex exec` in a read-only sandbox. Each answers the checklist for ours and for every reference site, lists the new issues it would defend (with a severity, a kind and a concrete fix) and up to five things to keep. From round 2 each also says, for every open issue of the ledger, whether it is `fixed`, `still` there or `worse`.
5. **Comparison** (from round 2). Each shot whose picture changed is put beside the last round's as `A` and `B`, at random, and each reviewer, in a call of its own, says which it would ship, or `same`. A shot is judged by what most reviewers said; the round is `better`, `worse` or `same` by how many shots are `new` against `old`. The key (which letter was which round) is written after the answers are in. `compare.md` shows the result.
6. **The ledger.** One Sonnet call joins duplicate new issues. An open issue closes when more than half of the reviewers who answered it say `fixed`. An issue is **confirmed** when two or more reviewers stand behind it (raised it, or say it is `still` or `worse`). A `structural` issue changes what a screen holds (it removes, merges, reorders or adds a section or a control); a `visual` one doesn't.
7. **Verdict**: `DONE` or `CONTINUE`, and `STALLED` or not (below).

## When it is done

A round is **done** when all of these hold:

1. No open issue is confirmed, `high` and `visual`.
2. Every reviewer's overall share of passing checks is at least the target (default 90).
3. No reviewer puts our overall share more than 10 points under the best reference site's overall share. References are compared on the overall share only: they are not asked about every screen of ours, and a reference site can't be expected to pass checks about screens it doesn't have.
4. The round's pictures are not still `better` than last round's (round 1 has no comparison): a round that still made things better has more to climb.
5. Every reviewer answered.

Otherwise the verdict is `CONTINUE` and says, in plain words, which rule is unmet. The run's `README.md` states the same rules and lists the reasons.

The run is **stalled** when each of the last two rounds closed no issue and made no picture `better`. The agent stops and reports what is holding it back. Ten rounds is the other limit.

`structural` issues never count against done: the fixing agent leaves them alone, and the run's `proposals.md` lists the open ones (screens, problem, proposed change, how many reviewers raised it), most confirmed first, for the owner to decide.

## The checklist

Grouped in these categories (`CATEGORIES` in `scripts/lib/designCouncil.ts`); the questions are in `scripts/design-council/checklist.ts`. A category's share is the share of its checks, among those not `na`, that pass; the overall share is the average of the categories that have one.

| Key           | Category                       |
| ------------- | ------------------------------ |
| `hierarchy`   | Visual hierarchy and focus     |
| `typography`  | Typography                     |
| `color`       | Colour and contrast            |
| `spacing`     | Spacing, alignment and density |
| `consistency` | Consistency across screens     |
| `components`  | Components, icons and controls |
| `mobile`      | Phone layout (360 px)          |
| `rtl`         | Arabic and right to left       |
| `polish`      | Overall polish and character   |

## Where things are

| Path                                                                                   | What                                                                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/design-council.ts`                                                            | One round, end to end                                                                                                                                                                                                                                                                 |
| `scripts/lib/designCouncil.ts`                                                         | The pure parts: options, categories, reviewer command lines, reading answers, the ledger, the comparison, the verdict, `stalled`, the proposals and the reports (tests beside it)                                                                                                     |
| `scripts/lib/designCapture.ts`                                                         | The screenshots                                                                                                                                                                                                                                                                       |
| `scripts/lib/localApp.ts`, `scripts/council-backend.sh`, `scripts/council/seedData.ts` | The local backend, the demo rows, the build (shared with the bug sweep)                                                                                                                                                                                                               |
| `src/lib/councilTestMode.ts`, `src/app/api/council/*`                                  | The flag-guarded test-only login                                                                                                                                                                                                                                                      |
| `scripts/design-council/screens.ts`                                                    | Which screens, at which widths, in which language; what the reviewers are told the site is                                                                                                                                                                                            |
| `scripts/design-council/checklist.ts`                                                  | The yes/no checks                                                                                                                                                                                                                                                                     |
| `scripts/design-council/reviewer.md`, `compare.md`                                     | The reviewers' prompts (the checklist round; the comparison)                                                                                                                                                                                                                          |
| `.claude/skills/design-council/SKILL.md`                                               | The loop for the agent                                                                                                                                                                                                                                                                |
| `design/references/`                                                                   | Other sites' screenshots (git-ignored, but for its README)                                                                                                                                                                                                                            |
| `reports/design-council/<branch>/`                                                     | The runs (git-ignored): `README.md` (the rules and every round's shares), `issues.json` (the ledger), `proposals.md` (for the owner), and per round `screens/`, each reviewer's answer, `scores.md`, `feedback.md`, `compare.md` (from round 2), `notes.md` (the agent's) and `logs/` |

## Changing it

- **Screens**: add or change entries in `screens.ts`. Keep it to a dozen or so: every reviewer looks at every screenshot in one pass. A path can use a `{name}` value found by a `Lookup` (a link on a page): the demo's blog IDs are made by the database, so the blog screen looks one up on the blog list. The admin pages have no language prefix (`unprefixed: true`).
- **Reviewers**: `--reviewers` takes `opus`, `sonnet`, `fable`, `haiku`, `claude:<model id>`, `codex` or `codex:<model>`; the default is `opus,sonnet,codex`.
- **Checklist or prompts**: change them between climbs, never during one: shares from different checklists don't compare, and changing the measuring stick to raise a score defeats the point.

## Left out of the port

The code-review part of Hakimy's tooling (`codeReview.ts` and `code/*`) is not here, by the owner's brief. The council reviews screenshots only.
