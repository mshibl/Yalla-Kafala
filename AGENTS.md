## Councils (design council, bug sweep, bug council)

Three tools drive a browser against a throwaway local copy of the site: `pnpm design-council` (screenshots scored by a panel of models), `pnpm bug-sweep` (browser agents walk the flows in `docs/agents/feature-map.md`) and `pnpm bug-council` (fix-and-sweep loop on top of the sweep). Details: `docs/design-council.md`, `docs/bug-council.md` and the skills in `.claude/skills/`.

- Start them **only when the owner asks**, in that session. Never during feature work, and never to verify a change you made.
- Feature work runs the fast checks only, with no browser: `pnpm lint`, `pnpm typecheck` and `pnpm test`.
- Never point them at production. They start their own local Convex backend and a build in council test mode (`NEXT_PUBLIC_COUNCIL_TEST_MODE`, refused on any non-local Convex URL); never set that flag in a deploy.
- `--dry-run` on `pnpm design-council` and `pnpm bug-sweep` prints the plan and starts nothing.
- Bugs the sweep files live in `reports/bugs/bugs.json` (`pnpm -s bug-tracker …`, keys `YKBUGS-n`), git-ignored.
