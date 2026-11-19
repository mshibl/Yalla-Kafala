# Bug hunt: {{TITLE}}

You are testing Yallakafala, a website about kafala (child sponsorship and alternative family care). Visitors read pages about kafala, the organisation and its stories, donate or sign up for the newsletter, and switch between English and Arabic; staff sign in to an admin area to manage blogs, articles, FAQs, board members, the picture carousel and resources. You have **{{MINUTES}} minutes**. You are stopped automatically at **{{DEADLINE}}**, so never stop before it: check the time with `date +%H:%M` every few pages, and only wrap up once it shows {{DEADLINE}} or later. Use the whole time. When you finish your list early, go deeper: other inputs, the other language, edge cases.

Your job is to find **bugs, errors and slowness** on the screens below. You don't fix anything and you don't read the code. The owner started this sweep, so this browser session needs no further approval. Don't write or run Playwright tests.

## The site

- `{{FOLDER}}/feature-map.md` (a copy of the repo's feature map) lists the flows to walk, per role. The bullets under each flow are what must hold: treat them as the rubric.
- Site: {{BASE_URL}}. A production build on this computer, talking to a throwaway local backend with invented demo content. The data is reset before your run, so change things freely: edit, publish, delete. Another agent is testing a different area at the same time, so a change you didn't make can happen. Note it, but don't report it as a bug unless it repeats.
- Public pages exist in English (`/en/...`) and Arabic (`/ar/...`, right to left). Walk each public flow in both languages; the language switch is in the header.
- **Admin area**: open `{{BASE_URL}}/api/council/login` once. It sets a test-only cookie and sends you to `/admin`. (This replaces the real sign-in, which this copy does not use.) To sign out use the site's sign-out control, or open `{{BASE_URL}}/api/council/logout`.
- The browser is already yours. Your session name is in `AGENT_BROWSER_SESSION`, so plain `agent-browser <command>` works. Don't run `agent-browser close --all`.
- Useful commands: `agent-browser open <url>`, `snapshot -i` (the interactive elements, with refs like @e3), `click @e3`, `fill @e3 "text"`, `press Enter`, `wait --load networkidle`, `screenshot <file>`, `errors`, `console`, `vitals <url> --json`, `set viewport 360 800`, `set viewport 1280 800`, `back`, `reload`. Run `agent-browser skills get core` once if you need more. Run each command on its own: no `cd`, no `&&`, no pipes, or it is refused.

## Check every screen and dialog like this

1. Open it at **360 px wide** (`set viewport 360 800`), then at **1280 px** (`set viewport 1280 800`). Look at both: text cut off, overlapping or off-screen elements, things you must scroll sideways to reach, buttons too small to tap, an empty-looking page. In Arabic also look for text that runs the wrong way, icons or arrows that point the wrong way, and menus that open on the wrong side.
2. Measure it: `agent-browser vitals <url> --json`. Note TTFB, FCP and LCP.
3. Run `agent-browser errors` and `agent-browser console` after loading it and after each action. Any red error or failed request is a finding.
4. Use it like a real person: fill every form, submit it empty, submit wrong values (a very long title, emoji, Arabic text in an English field, a malformed email), double-click submit buttons, press Back after saving, reload in the middle of a flow, open every dialog, menu and tab. Check the empty states and the confirmations ("Are you sure?").
5. Time the actions: anything that takes more than about 1 second to respond after a click, or a page that shows a loading state for more than about 3 seconds, is a slowness finding.

Not bugs, ignore them:

- requests that fail because a third party is not reachable from this copy: UploadThing, Facebook, EmailOctopus, Google Maps and Meet, analytics, fonts or images on other domains;
- the Clerk sign-in screens (the test login replaces them) and the `/api/council/*` pages themselves;
- the items under "Not covered by the sweep" at the end of the feature map.

## Write as you go

Your folder is `{{FOLDER}}`. Write into it straight away and keep adding, so the work survives if the time runs out:

- `pages.md`: one table row per screen or dialog you checked:
  `| Screen | URL | Language | TTFB ms | LCP ms | 360 px ok? | 1280 px ok? | Errors | Notes |`
  Start the file with that header row and `|---|---|---|---|---|---|---|---|---|`.
- `flows.md`: one table row per flow in "Your flows" below, using the flow's id exactly as listed. Start the file with `| Flow id | Result | Finding |` and `|---|---|---|`, and write each row **as soon as you finish that flow**, not at the end:
  `| public-visitor-learn/home-page | pass | |`
  Result is one of:
  - `pass`: you walked the flow (in both languages for a public flow) and every bullet for it in `feature-map.md` held.
  - `fail`: a bullet did not hold. Put the finding's number in the Finding column (`F3`) and write that finding in `findings.md`.
  - `blocked`: you could not get to the flow because of another failure. Put that failure's finding in the Finding column.
  - `not reached`: you ran out of time. List every flow you did not touch this way before you stop.
- `rechecks.md`: only when a "Check these first" part below lists bugs: one row per bug, `| Bug | Result | Evidence |`, Result `fixed`, `still there` or `could not check`. That part says how.
- `findings.md`: one block per problem, the moment you find it. Number them F1, F2, … Use exactly this shape:

```
### F1: <what is wrong, in a few words>

- Severity: critical | high | medium | low
- Type: functional | error | performance | layout | content | accessibility | ux
- Screen: <screen name> (<URL path>)
- Who: <logged out, or the admin>
- Width: 360 | 1280 | both
- Steps:
  1. …
  2. …
- Expected: …
- Actual: …
- Evidence: screenshots/F1-<short-name>.png, plus the error text or the timings
- Repeats: yes, every time | sometimes (n of m tries) | once
```

Severity: **critical** loses or corrupts data, shows an unpublished or admin-only page to a visitor, or blocks a main task (a page crashes, the admin can't save, the donate page is unreachable). **high**: a feature doesn't work or shows wrong information (a language shows the other language's text, a published item missing from its list). **medium**: works but confusing, broken layout, slow. **low**: cosmetic or wording.

- Save a screenshot for every finding: `agent-browser screenshot {{FOLDER}}/screenshots/F1-<short-name>.png`.
- Before you report something, try it once more. Report it even if it doesn't repeat, and say so in "Repeats".
- One problem per block. If one bug shows on several screens, write one block and list the screens.

At the deadline, stop, make sure all the files are saved, and end with one line: how many screens you checked, how many flows passed out of the flows listed, and how many findings you wrote.

## Already known: don't report these again

These were reported in earlier sweeps and either judged not real or already have a bug. Skip them, unless you have new evidence that changes the picture; then say what is new.

{{KNOWN}}

## Your flows

These are the flows of `feature-map.md` that belong to your area (id, title, route). Walk each one, check its bullets, and record it in `flows.md`. Your brief below says where to dig deeper; the flows are what gets counted.

{{FLOWS}}

{{RECHECKS}}

## Your brief

{{BRIEF}}
