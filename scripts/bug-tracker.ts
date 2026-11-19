/**
 * The local bug tracker: `pnpm -s bug-tracker <command>` (list, get, new,
 * comment, update). Bugs live in reports/bugs/bugs.json; see
 * scripts/lib/bugCli.ts for the options.
 */
import { runCli } from "./lib/bugCli";
import { storeFile } from "./lib/bugTracker";
import { ROOT } from "./lib/paths";

const result = runCli(process.argv.slice(2), storeFile(ROOT), process.cwd());
process.stdout.write(result.out);
process.stderr.write(result.err);
process.exitCode = result.code;
