# Design council

A way to improve the site's design without a designer: a panel of models scores screenshots of the main pages, in English and Arabic, side by side with screenshots of other sites, and says what to fix. An agent fixes it, and the next round scores it again. The rounds go on until every reviewer gives every category the target score or more, and the site scores at least as well as every reference site.

The idea is to treat design as a "hill climb": a score that can be raised one round at a time. Scores from models are noisy, so the council guards against the usual ways a hill climb fools itself:

- **Several reviewers**, ideally from different providers (Claude models and Codex), each in a fresh session. One model's score means little; all of them agreeing means more.
- **Reference sites in the same pass.** A reviewer looking at our site alone scores it too generously. Next to strong sites, the scores become honest, and "better than these" becomes the goal.
- **Blind reviewers.** They never see the target or earlier rounds' scores: a reviewer told the goal tends to score near it.
- **A pass must repeat.** Two passing rounds in a row, the second with no changes.

## Running it

Needs Node 22.18 or later (it runs the TypeScript scripts as they are), the Claude Code CLI, and a Chromium for Playwright (`pnpm exec playwright install chromium` once, or `CHROMIUM_PATH=<path to chrome>`).

```sh
pnpm design-council                                       # build this checkout, the next round, target 9
pnpm design-council --url https://www.yallakafala.org     # photograph production instead of building
pnpm design-council --url https://<branch>.vercel.app     # or a branch's Vercel preview
pnpm design-council --target 9.5                          # a higher bar
pnpm design-council --reviewers codex                     # one reviewer while far from the target, to save usage
pnpm design-council --review-only                         # score this round's screenshots again
pnpm design-council --capture-only                        # only the screenshots
pnpm design-council --help                                # every option
```

The whole loop (fix, check, commit, next round, when to stop) is the agent's: the `design-council` skill (`.claude/skills/design-council/SKILL.md`). In Claude Code, `/design-council` starts it.

Before the first round:

- **The keys, for a local build**: the build validates its environment (`src/env.js`), so the checkout needs its `.env` or `.env.local`. The council copies them into its worktree and nowhere else. Without them, use `--url`.
- **Reference sites**: put three to six screenshots of each of two or three other sites in `design/references/<site>/` (see the README there). The folder is git-ignored: other organisations' screenshots stay on the machine.
- **A second provider**: install the Codex CLI (`npm i -g @openai/codex`) and log in. Without it, Codex is skipped and the council is Claude models only.

## What one round does

1. **The site.** Either:
   - *a local build*: the working tree, committed or not, becomes a commit of its own (the branch and the index are untouched), checked out in a worktree beside the repo (`../yalla-kafala-design-council`), so a dev server in this checkout and its `.next` are never disturbed; then `pnpm install`, `pnpm build` and `next start` on port 5600 (`--port`) there;
   - or, with `--url`, a deployment as it is (the history records the URL instead of a commit).
2. **Screenshots.** Playwright as a library (no tests) opens each page in `scripts/design-council/screens.ts` at 390 px (2× pixels) and 1440 px, the main ones in Arabic too, in the light theme. Before each page loads, the values in `STORAGE` go into its local storage (the newsletter popup skips subscribers, so it doesn't cover the page). Each page is scrolled through, so lazy images and reveals load, and photographed whole, cut at 3000 px.
3. **Reviewers.** Each gets the prompt in `scripts/design-council/reviewer.md`, the screenshots and the reference sites. Claude models run through `claude -p`, only able to read the round's folder; Codex runs through `codex exec` in a read-only sandbox. Each scores ours and every reference site from 1 to 10 in each category, and lists up to 15 issues with concrete fixes and up to five things to keep.
4. **Verdict.** A gap is a category where a reviewer scored ours below the target, or below a reference site it scored higher. The round passes with no gaps, and only if every reviewer answered.

Screenshots are stills: an empty area can be an image that hadn't loaded. Check a finding against the live page before fixing it.

## The rubric

| Key | Category |
|---|---|
| `impression` | First impression (the first screen of each page) |
| `hierarchy` | Visual hierarchy and focus |
| `typography` | Typography, in English and Arabic |
| `color` | Colour, contrast and legibility |
| `layout` | Layout, spacing and rhythm |
| `components` | Components: cards, buttons, icons, imagery |
| `mobile` | Phone layout |
| `rtl` | Arabic and right to left |
| `trust` | Trust and clarity: what kafala is, why trust Yalla Kafala, what to do next (learn, apply, donate) |
| `polish` | Overall polish and character |

## Where things are

| Path | What |
|---|---|
| `scripts/design-council.ts` | One round, end to end, with the screenshots (`capture()`) |
| `scripts/lib/designCouncil.ts` | The pure parts: options, rubric, reviewer command lines, reading answers, the verdict and the reports |
| `scripts/lib/designCouncil.test.ts` | Their tests: `pnpm test:scripts` |
| `scripts/design-council/screens.ts` | Which pages, at which widths, which in Arabic; what the reviewers are told the site is; `STORAGE` |
| `scripts/design-council/reviewer.md` | The reviewers' prompt |
| `.claude/skills/design-council/SKILL.md` | The loop for the agent |
| `design/references/` | Other sites' screenshots (git-ignored, but for its README) |
| `reports/design-council/<branch>/` | The runs (git-ignored): `README.md` with every round's scores, and per round `screens/`, each reviewer's answer, `scores.md`, `feedback.md`, `notes.md` (the agent's) and `logs/` |

The scripts are excluded from `tsc` (`tsconfig.json` excludes `scripts/`); Node strips their types when it runs them.

## Changing it

- **Pages**: add or change entries in `screens.ts` (`path` without the language prefix; `arabic: true` for an Arabic shot too). Keep it to a dozen or so screenshots' worth: every reviewer looks at every screenshot in one pass.
- **Reviewers**: `--reviewers` takes `opus`, `sonnet`, `fable`, `haiku`, `claude:<model id>`, `codex` or `codex:<model>`; the default is `opus,sonnet,codex`.
- **Rubric or prompt**: change them between climbs, never during one: scores from different rubrics don't compare, and changing the measuring stick to raise a score defeats the point.
