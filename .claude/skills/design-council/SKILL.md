---
name: design-council
description: Improve the site's UI by hill climbing on a design council's yes/no checklist. Screenshots of the site go to several models, beside screenshots of other sites; fix the issues they confirm, commit, and run another round until the council says done or stalls. Use only when the owner asks for a design pass, a UI polish loop, or "run the design council".
---

# Design council

A loop: **photograph → check → fix → commit → photograph again**, until the council is done or stalled. `pnpm design-council` runs one round; you are the loop around it. It is not an end-to-end test and writes no specs, but it does build the site locally, start a throwaway Convex backend and drive a browser.

A score is the share of the checklist's yes/no checks that pass (`scripts/design-council/checklist.ts`), so it moves when a check starts passing, not when a reviewer feels differently. Every round also lists the issues the reviewers found (the ledger, `issues.json`) and, from round 2, which of the changed screens look better or worse than last round's.

## Before the first round

0. Run it only when the owner asked you to, in this session (AGENTS.md). Not during feature work, and never to check your own change. Otherwise stop and ask.
1. Work on a branch of its own (`design/council-<yyyy-mm-dd>`) from the branch the owner names, up to date with it. The branch must hold the council's scripts: the round snapshots your working tree and builds that.
2. The owner has done the one-time setup (`docs/design-council.md`, "Before the first run"): `pnpm install`, `pnpm exec playwright install chromium`, and for Codex `npm i -g @openai/codex`. If `claude`, `pnpm` or the browser is missing the script stops with the command to run; don't install anything bigger yourself.
3. Check `design/references/` (README there). With no reference sites, scores come out too high. If it is empty, tell the owner once, then go on without them.
4. Check the reviewers: `which codex`. A council works best with models from different providers; without Codex it is Claude models only, and the run log says so.
5. Read `docs/design-council.md`, then the layout and the styles (`src/styles/globals.css`, `src/components`) before the first fix. The site is in English and Arabic: the Arabic pages are right to left.

## One round

1. Run `pnpm design-council` in the background (add `--target <n>` if the owner gave a target: a percent of passing checks; the default is 90). It snapshots your working tree, so uncommitted changes count. It takes 10–25 minutes: a build, the screenshots, then the reviewers in parallel.
2. Its output says `DONE` or `CONTINUE` with a reason for each rule not met, and `STALLED` when it has stopped climbing. Read, in `reports/design-council/<branch>/`:
   - `README.md`: the rules, every round's shares, and the reasons it is not done.
   - `round-NN/feedback.md`: what got worse (revert candidates), the gaps, the failed checks, then the open issues, confirmed first.
   - `round-NN/compare.md`: for each screen that changed, which picture the reviewers would ship, this round's or last round's.
   - `round-NN/scores.md`: every reviewer's share for each category, ours and the references.
   - `proposals.md`: the structural issues, for the owner.
3. Look at the screenshots yourself (`round-NN/screens/*.png`, with Read), and at the previous round's, to see what your last changes did.

## Fixing

- Fix the **confirmed** issues first (two or more reviewers stand behind them), highest severity first, then the failed checks of the weakest category. Don't do every issue: a few strong changes per round climb faster than many scattered tweaks, and you can see what helped.
- **Skip `structural` issues.** Those change what a screen holds (they remove, merge, reorder or add a section or a control); they are the owner's call. They are in `proposals.md` and never keep the council from finishing. Point the owner to that file in the hand-over; don't act on them.
- **Revert a change whose screen was judged worse** (`feedback.md` lists them under "Got worse"; `compare.md` has each reviewer's reason), unless you can fix what made it worse in the same round.
- Change the system before the page: a shared component, a style variable or the layout shell fixes every screen at once and keeps them consistent. A one-off class on one page is the last resort.
- Keep the site's rules: text in both languages (English and Arabic) in the same change; logical CSS only (`ms-`, `pe-`, `text-start`) so Arabic mirrors; no new heavy dependencies.
- Change how things look, not what they do. Never drop a feature, a field, a confirmation or text the site needs to please a reviewer. A suggestion that contradicts what the owner decided is skipped; note it in the round's notes.
- Never edit the checklist (`scripts/design-council/checklist.ts`), the reviewer prompt (`scripts/design-council/reviewer.md`), the screen list or the references to raise a score, and never tell the reviewers the target or earlier scores. Those are the measuring stick.
- Write `round-NN/notes.md`: what you changed and why, in a few lines, and what you skipped.

Then run `pnpm test`, `pnpm lint` and `pnpm typecheck` once when the work is done (never a browser test). Commit once per round: `Design council round N: <the main changes>`.

## When to stop

Stop on the first of these:

- **Done**: the output says `DONE`. That is: no confirmed high visual issue open, every reviewer's overall share at or above the target, no reviewer putting ours more than 10 points under the best reference site, the round's pictures no longer better than last round's, and every reviewer answered. There is no repeat round to run.
- **Stalled**: the output says `STALLED`: the last two rounds closed no issue and made no picture better. Stop and report what is holding it back, with the screenshots.
- **Limit**: ten rounds, unless the owner gave another.

To save usage while far from the target, the owner may ask for one reviewer first (`--reviewers codex` or `--reviewers sonnet`) and the full council once it gets close.

## The report

End with: the history table (`README.md`), before and after screenshots of three to five screens (round 1's and the last round's), what changed in a few bullets, what was skipped and why, the proposals waiting for the owner (`reports/design-council/<branch>/proposals.md`), and the branch. Don't push or open a pull request unless the owner asks.
