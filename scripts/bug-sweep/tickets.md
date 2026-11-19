# Bug sweep: file the bugs

The bug sweep tested Yallakafala at commit `{{SHA}}` (the working directory). Haiku agents used the site in a browser. Their **{{COUNT}} findings** are in `{{RUN_DIR}}/findings.md`, each with its ID (`browser/<group>/F<n>`). No filter ran before you: every finding is yours to check. Screenshots are in `{{RUN_DIR}}/browser/<group>/screenshots/`.

You have **{{MINUTES}} minutes**. Stop at **{{DEADLINE}}**: check with `date +%H:%M`. Take the critical and high findings first.

Your job: make sure each finding is real, then file **one bug per root cause** in the local bug file (keys `{{PROJECT}}-<n>`) with `pnpm -s bug-tracker`. The agents only reported what they saw, so some findings are still wrong.

## Check each finding

1. Read it, and look at its screenshot (the Read tool shows images).
2. Trace it in the code: the page under `src/app`, the component, the Convex function in `convex/`, and the translations. Check the intended behaviour in `docs/agents/feature-map.md`. In Arabic findings, check whether the English and the Arabic text really differ.
3. {{BROWSER_NOTE}}
4. Decide: a **bug** (file it), a **duplicate** of another finding or an open bug, or **not a bug** (intended, misread, or caused by the test setup: a slow computer, a third party that is off in this copy, another agent changing the data).

## File bugs

First run `pnpm -s bug-tracker list --open --json` and don't file a problem that already has an open bug (`pnpm -s bug-tracker get {{PROJECT}}-<n>` shows one in full).

Write each bug's body to `{{RUN_DIR}}/bugs/<n>-<short-name>.md`, then:

```
pnpm -s bug-tracker new --source sweep --run {{RUN_ID}} --commit {{SHA}} --title "<Fix: what is wrong, in plain words>" --labels bug,browser --severity <critical|high|medium|low> --ref {{RUN_ID}}/<the finding ID, e.g. browser/02-stories/F2> --from {{RUN_DIR}}/bugs/<n>-<short-name>.md [--attach <screenshot>]…
```

It prints the new key (`{{PROJECT}}-<n>`). Attach the screenshots that show the bug (`--attach {{RUN_DIR}}/browser/<group>/screenshots/<file>`). `--ref` makes filing the same finding twice harmless: the second one is a "seen again" comment on its bug, and the group is read from it.

Add the `ui` label when the fix is in a screen, `rtl` for Arabic-only problems, and `admin` for the admin area. Group low-severity findings of one area into one bug. The body has this shape:

```
## Problem

<What goes wrong, for whom, and why it matters. One short paragraph.>

## Evidence

- Bug sweep `{{RUN_ID}}`, findings <ID>, … (screenshots: `{{RUN_DIR}}/browser/<group>/screenshots/<file>`)
- Steps to reproduce on the demo data.
- Where: `path/to/file.tsx:<line>`, and the lines that cause it.

## Fix

1. <What to change, specific enough for another agent to start.>

## Done when

- <The behaviour after the fix.>
- `pnpm check` passes, and a unit test covers it if the logic can be tested without a browser.

Severity: <critical | high | medium | low>. Found by the bug sweep (Haiku), checked by Opus.
```

Don't edit code, don't commit, and don't write or run Playwright tests.

## Write your results (the sweep reads these files)

Write them as you go, so they survive if the time runs out:

- `{{RUN_DIR}}/filed.json`: the bugs you filed, `[{"ticket": "YKBUGS-3", "title": "...", "severity": "high", "findings": ["browser/02-stories/F2", "browser/01-learn/F1"]}]`.
- `{{RUN_DIR}}/not-bugs.json`: the findings you judged not real, `[{"id": "browser/03-support/F4", "reason": "the dialog closes on purpose after a second"}]`. Later sweeps show these to their agents so they aren't reported again.
- `{{RUN_DIR}}/duplicates.json`: findings that duplicate another finding or an open bug, `[{"id": "...", "of": "YKBUGS-3 or another finding ID"}]`.
- `{{RUN_DIR}}/owner.md`: product or design questions for the owner, one or two sentences each with your recommendation (no bugs for these).

Every finding in `findings.md` must end up in exactly one of `filed.json`, `not-bugs.json`, `duplicates.json` or `owner.md`. End with one line: findings checked, bugs filed.
