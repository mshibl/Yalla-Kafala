import type { Ending } from "./agentRunner";
import { combineScores, type FlowScore, rateText } from "./featureFlows";
import type { RechecksFile } from "./recheck";

/**
 * The bug sweep's one report (report.md): what ran, what was found, and what
 * the Opus agent filed, rejected or merged. No filter runs between the
 * browser agents and Opus: every finding is checked and, when real, filed.
 */

export type AreaRun = {
  slug: string;
  title: string;
  ending: Ending;
  minutes: number;
  findings: number;
  /** The area's feature-map flow results (flows.md). */
  flows?: FlowScore;
};

export type Filed = {
  ticket: string;
  title: string;
  severity?: string;
  findings: string[];
};

export type TicketResults = {
  ran: boolean;
  ending?: Ending;
  filed: Filed[];
  notBugs: { id: string; reason: string }[];
  duplicates: { id: string; of: string }[];
  owner: string;
};

export function sweepReport(r: {
  runId: string;
  ref: string;
  sha: string;
  startedAt: string;
  areas: AreaRun[];
  /** Ids of every finding of the run. */
  findingIds: string[];
  tickets: TicketResults;
  /** Fixed bugs this run checked again (`--recheck`). */
  rechecks?: RechecksFile;
}): string {
  const total = r.findingIds.length;
  const t = r.tickets;
  const accounted = new Set([
    ...t.filed.flatMap((f) => f.findings),
    ...t.notBugs.map((n) => n.id),
    ...t.duplicates.map((d) => d.id),
  ]);
  const unaccounted = t.ran
    ? r.findingIds.filter((id) => !accounted.has(id))
    : [];

  const rechecks = r.rechecks?.rechecks ?? [];
  const count = (result: string) =>
    rechecks.filter((c) => c.result === result).length;
  const flowAreas = r.areas.filter((a) => a.flows);
  const overall = combineScores(flowAreas.map((a) => a.flows!));
  const lines = [
    `# Bug sweep ${r.runId}`,
    `${r.ref} at \`${r.sha.slice(0, 12)}\`, started ${r.startedAt}.`,
    "## Summary",
    [
      ...(rechecks.length
        ? [
            `- **Fixed bugs checked again: ${count("fixed")} fixed, ${count("still there")} still there, ${count("could not check")} could not be checked.**${count("still there") && r.rechecks?.actions.length ? " The ones still there got a comment and were reopened." : ""}`,
          ]
        : []),
      `- **${total} findings** from ${r.areas.length} browser agents.`,
      ...(flowAreas.length
        ? [
            `- **Flows: ${rateText(overall.rate)} passed** (${overall.pass} passed, ${overall.fail} failed, ${overall.blocked} blocked, ${overall.notReached} not reached).`,
          ]
        : []),
      t.ran
        ? `- **Opus filed ${t.filed.length} bugs**, judged ${t.notBugs.length} not real (also to the not-bugs ledger) and ${t.duplicates.length} duplicates${unaccounted.length ? `; ${unaccounted.length} it didn't get to` : ""}. Opus ${t.ending}.`
        : "- No bugs filed: the run stopped after the findings list (`--no-tickets`) or had nothing to file.",
    ].join("\n"),
  ];
  if (t.filed.length)
    lines.push(
      "## Bugs filed",
      "| Bug | Title | Severity | Findings |\n|---|---|---|---|\n" +
        t.filed
          .map(
            (f) =>
              `| ${f.ticket} | ${f.title.replaceAll("|", "/")} | ${f.severity ?? ""} | ${f.findings.join(", ")} |`,
          )
          .join("\n"),
    );
  if (t.owner.trim()) lines.push("## For the owner", t.owner.trim());
  if (unaccounted.length)
    lines.push(
      "## Not handled by Opus",
      `These findings are in \`findings.md\` but Opus filed, rejected or merged none of them (it ran out of time):\n\n${unaccounted.map((id) => `- ${id}`).join("\n")}`,
    );
  if (t.notBugs.length)
    lines.push(
      "## Opus: not real",
      t.notBugs.map((n) => `- ${n.id}: ${n.reason}`).join("\n"),
    );
  if (flowAreas.length)
    lines.push(
      "## Flows",
      "Feature-map flows each browser agent walked (`flows.md`; `flows.json` has every flow). Rate = passed ÷ (passed + failed + blocked); flows not reached are left out of it.\n\n| Area | Passed | Failed | Blocked | Not reached | Rate |\n|---|---|---|---|---|---|\n" +
        [
          ...flowAreas.map((a) => ({
            name: a.title,
            s: a.flows! as FlowScore,
          })),
          { name: "**All areas**", s: overall },
        ]
          .map(
            ({ name, s }) =>
              `| ${name} | ${s.pass} | ${s.fail} | ${s.blocked} | ${s.notReached} | ${rateText(s.rate)} |`,
          )
          .join("\n"),
    );
  if (rechecks.length) {
    const cell = (text: string) =>
      text.replace(/\s+/g, " ").replaceAll("|", "/").trim();
    lines.push(
      "## Fixed bugs checked again",
      "Bugs marked fixed that the browser agents followed again (`rechecks.json`). One that is still there got a comment with the evidence and went back to new; it was not filed again.\n\n| Bug | Title | Group | Result | Evidence |\n|---|---|---|---|---|\n" +
        rechecks
          .map(
            (c) =>
              `| ${c.bug} | ${cell(c.title)} | ${c.group || "–"} | ${c.result} | ${cell(c.evidence)} |`,
          )
          .join("\n"),
    );
  }
  lines.push(
    "## Agents",
    "| Area | Findings | Agent | Minutes |\n|---|---|---|---|\n" +
      r.areas
        .map(
          (a) =>
            `| ${a.title} | ${a.findings} | ${a.ending} | ${a.minutes.toFixed(1)} |`,
        )
        .join("\n"),
    "Every finding in full: `findings.md`. Each agent's files and transcript: its folder and `logs/`.",
  );
  return lines.join("\n\n") + "\n";
}
