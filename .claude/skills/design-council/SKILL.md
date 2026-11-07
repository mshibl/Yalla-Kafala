---
name: design-council
description: Improve the Yalla Kafala site's UI by hill climbing on a design council's scores. Screenshots of the main pages, in English and Arabic, go to several models beside screenshots of other sites; fix what they find, commit, and run another round until every reviewer scores every category at the target or above. Use when someone asks for a design pass, a UI polish loop, or "run the design council".
---

# Design council

A loop: **photograph → score → fix → commit → photograph again**, until the council is satisfied. `pnpm design-council` runs one round; you are the loop around it. It builds the site (or photographs a deployment) and drives a browser (Playwright as a library, no tests). Full reference: `docs/design-council.md`.

## Before the first round

1. Work on a branch of its own from `main` (`design/council-<yyyy-mm-dd>`). Changes reach `main` through a pull request, as everything else in this repo.
2. **How to photograph the site.** A local build needs this checkout's `.env` or `.env.local` (Convex, Clerk and the other keys); the council copies them into its worktree. Without them, photograph a deployment instead: `--url` with production for a baseline, or the branch's Vercel preview to see your changes. Never commit or print the keys.
3. Check `design/references/` (README there). With no reference sites, scores come out too high. If it is empty, say so once, then go on without them.
4. Check the reviewers: `which codex`. A council works best with models from different providers; without Codex it is Claude models only, and the run log says so. Don't install anything yourself.
5. Check the browser: `pnpm exec playwright install chromium` once on a new machine (or set `CHROMIUM_PATH` to a Chromium already there).
6. Read before the first fix: `src/styles/globals.css` and `tailwind.config.ts` (the theme), `src/components/ui` (the shared components), `src/components/AppHeader` and `AppFooter`, and the page's folder in `src/components`. Text lives in each component's `translations.ts`, English and Arabic side by side.

## One round

1. Run `pnpm design-council` in the background (or with `--url <deployment>`; add `--target <n>` if you were given a target; the default is 9). A local build snapshots your working tree, so uncommitted changes count. It takes 5–15 minutes.
2. Its last line is `PASSED` or `NOT YET`. Read, in `reports/design-council/<branch>/`:
   - `README.md`: every round's scores so far.
   - `round-NN/feedback.md`: the gaps, then every issue, high first.
   - `round-NN/scores.md`: every reviewer's score for each category, ours and the references.
3. Look at the screenshots yourself (`round-NN/screens/*.png`, with Read), and at the previous round's, to see what your last changes did.

## Fixing

- **Check a finding against the real page before you fix it.** Screenshots are stills: an empty area can be an image that hadn't loaded, a cut-off one a page longer than the capture. If the live page is fine, fix the capture (`capture()` in `scripts/design-council.ts`, or `STORAGE` in `screens.ts` for popups) rather than the design, and say so in the notes.
- Fix what most reviewers agree on first, then high issues, then the weakest category. A few strong changes per round climb faster than many scattered tweaks, and you can see what helped.
- Change the shared pieces before one page: a theme colour, a `ui` component or the header fixes every page at once and keeps them consistent.
- **English and Arabic together.** Every text change goes in both languages in the component's `translations.ts`. Prefer logical CSS (`ms-`, `pe-`, `text-start`) so layouts mirror in Arabic.
- Content is the organisation's. Fix how it reads and looks; never invent a number, a partner, a claim or religious or legal guidance. When reviewers find content that contradicts itself, or ask for new copy (a line saying what kafala is), draft it, mark it as a draft in the pull request, and leave it for the site's owners to approve.
- Never edit the rubric, the reviewer prompt (`scripts/design-council/reviewer.md`), the screen list or the references to raise a score, and never tell the reviewers the target or earlier scores. Those are the measuring stick.
- Write `round-NN/notes.md`: what you changed and why, in a few lines, and what you skipped.

Then check before each commit: `pnpm check` (lint and typecheck), `pnpm test:scripts` and `pnpm build` if you have the keys. Commit once per round: `Design council round N: <the main changes>`.

## When to stop

- **Passed**: every reviewer gave every category the target or more, and no lower than any reference site they scored. Run one more round with no changes: scores are noisy, and a pass should repeat. Two passes in a row: done.
- **Stalled**: two rounds in a row with no reviewer's average up by 0.2 or more. Stop and report what is holding it back, with the screenshots.
- **Limit**: ten rounds, unless you were given another.
- To save usage while far from the target, use one reviewer first (`--reviewers codex` or `--reviewers sonnet`) and the full council once it reaches the target.

## The report

End with: the history table (`README.md`), before and after screenshots of three to five pages (round 1's and the last round's), what changed in a few bullets, what was skipped and why, any content for the owners to approve, and the branch or pull request.
