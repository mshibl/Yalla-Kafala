import { HAIKU } from "./bugSweep";
import type { Flow } from "./featureFlows";

/**
 * The bug sweep's browser part (scripts/bug-sweep.ts): six Haiku agents, each
 * with a group of screens and a time limit, look for bugs, errors and
 * slowness on a local test-mode build of the site, on a throwaway backend
 * seeded with the demo content (scripts/council/seedData.ts).
 */

export type Group = {
  /** 1–6; the order of scripts/bug-sweep/browser/groups/. */
  id: number;
  /** Folder and browser-session name. */
  slug: string;
  title: string;
};

export const GROUPS: Group[] = [
  { id: 1, slug: "01-learn", title: "Learning pages" },
  { id: 2, slug: "02-stories", title: "Blogs, articles, FAQs and resources" },
  { id: 3, slug: "03-support", title: "Donate, newsletter and links" },
  { id: 4, slug: "04-language", title: "Language, layout and errors" },
  { id: 5, slug: "05-admin-stories", title: "Admin: blogs and FAQs" },
  { id: 6, slug: "06-admin-site", title: "Admin: board, carousel, resources" },
];

/**
 * Which feature-map flows (docs/agents/feature-map.md) each group walks, by
 * the flow's role section (`role`, matched on the `##` heading) and route
 * (without the language prefix). The rules must not overlap: a unit test
 * fails when a flow fits no group or two, so a new flow has to be placed
 * here.
 */
type FlowRule = { role?: RegExp; route: RegExp };

const ANY = /^/;

export const GROUP_FLOWS: Record<number, FlowRule[]> = {
  // The pages that explain kafala and the organisation.
  1: [{ role: /^Public visitor: learn$/, route: ANY }],
  // Blogs, articles, the FAQ page and the resources.
  2: [{ role: /^Public visitor: stories$/, route: ANY }],
  // The donate page and dialog, the newsletter, outside links.
  3: [{ role: /^Public visitor: support$/, route: ANY }],
  // The language switch, the mobile menu, the footer, redirects, 404.
  4: [{ role: /^Public visitor: language and layout$/, route: ANY }],
  // The admin sign-in, dashboard, blogs and articles, FAQs.
  5: [{ role: /^Admin: stories and FAQs$/, route: ANY }],
  // The admin's board members, carousel and resources.
  6: [{ role: /^Admin: site content$/, route: ANY }],
};

/** The groups whose rules fit a flow: exactly one when the rules are right. */
export function groupsOf(flow: Pick<Flow, "role" | "route">): number[] {
  return GROUPS.filter((g) =>
    (GROUP_FLOWS[g.id] ?? []).some(
      (rule) =>
        (!rule.role || rule.role.test(flow.role)) &&
        rule.route.test(flow.route),
    ),
  ).map((g) => g.id);
}

/** The flows `group` (a group id) walks. */
export function flowsFor(group: number, flows: Flow[]): Flow[] {
  return flows.filter((f) => groupsOf(f).includes(group));
}

/**
 * Which groups share a wave. The demo is reseeded before every wave, so only
 * the two agents of one wave share data: each pair is one group that changes
 * things (the admin groups) and one that doesn't touch the same content, or
 * two that only read.
 */
export const PAIRS: [number, number][] = [
  [3, 5],
  [4, 6],
  [1, 2],
];

/** The chosen groups in waves of `perWave`, keeping PAIRS together first. */
export function planWaves(ids: number[], perWave: number): Group[][] {
  if (perWave < 1) throw new Error("perWave must be at least 1");
  const chosen = new Set(ids);
  const order = [
    ...PAIRS.flat().filter((id) => chosen.has(id)),
    ...ids.filter((id) => !PAIRS.flat().includes(id)),
  ];
  const groups = order.map((id) => {
    const group = GROUPS.find((g) => g.id === id);
    if (!group) throw new Error(`No group ${id}: pick 1–${GROUPS.length}`);
    return group;
  });
  const waves: Group[][] = [];
  for (let i = 0; i < groups.length; i += perWave)
    waves.push(groups.slice(i, i + perWave));
  return waves;
}

/**
 * Tools a hunting agent may use: the browser, the clock, and files in its
 * own folder (its working directory). Anything else is refused without a
 * prompt (`dontAsk`), so it cannot change code or reach other services.
 */
export function huntArgs(prompt: string): string[] {
  return [
    "-p",
    prompt,
    "--model",
    HAIKU,
    "--permission-mode",
    "dontAsk",
    "--allowedTools",
    "Bash(agent-browser:*)",
    "Bash(date:*)",
    "Bash(mkdir:*)",
    "Read(./**)",
    // Edit rules cover every file-writing tool, Write included.
    "Edit(./**)",
    "--disallowedTools",
    "WebFetch",
    "WebSearch",
    "Agent",
    "--strict-mcp-config",
    "--output-format",
    "stream-json",
    "--verbose",
  ];
}
