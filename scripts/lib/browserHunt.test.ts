import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  flowsFor,
  GROUPS,
  groupsOf,
  huntArgs,
  PAIRS,
  planWaves,
} from "./browserHunt";
import { parseFeatureMap } from "./featureFlows";

describe("planWaves", () => {
  test("all six groups in three waves of two, each wave one pair", () => {
    const waves = planWaves(
      GROUPS.map((g) => g.id),
      2,
    );
    expect(waves.map((w) => w.map((g) => g.id))).toEqual(PAIRS);
  });

  test("every group is in exactly one pair", () => {
    expect(PAIRS.flat().sort((a, b) => a - b)).toEqual(GROUPS.map((g) => g.id));
  });

  test("a wave never pairs an admin group with the public page it edits", () => {
    // 5 edits blogs and FAQs (read by 1 and 2); 6 edits the board, carousel
    // and resources (read by 1, 2 and 4's home page); 3 and 4 read little.
    for (const [a, b] of PAIRS) {
      const admin = [a, b].filter((id) => id >= 5);
      const readers = [a, b].filter((id) => id <= 2);
      expect(admin.length + readers.length === 2 && admin.length === 1).toBe(
        false,
      );
    }
  });

  test("a subset keeps the pair order and the wave size", () => {
    const waves = planWaves([6, 1, 4], 2);
    expect(waves.map((w) => w.map((g) => g.id))).toEqual([[4, 6], [1]]);
  });

  test("an unknown group is refused", () => {
    expect(() => planWaves([7], 2)).toThrow(/No group 7/);
  });
});

describe("flowsFor", () => {
  const flows = parseFeatureMap(
    readFileSync(
      join(import.meta.dirname, "../../docs/agents/feature-map.md"),
      "utf8",
    ),
  );

  test("the feature map has flows", () => {
    expect(flows.length).toBeGreaterThan(30);
    expect(flows.every((f) => f.route.startsWith("/"))).toBe(true);
  });

  test("every flow of the feature map is in exactly one group", () => {
    const wrong = flows
      .map((f) => ({ id: f.id, groups: groupsOf(f) }))
      .filter((f) => f.groups.length !== 1);
    // A new flow in docs/agents/feature-map.md must be placed in GROUP_FLOWS.
    expect(wrong).toEqual([]);
  });

  test("the groups' flows add up to the whole map", () => {
    const placed = GROUPS.flatMap((g) => flowsFor(g.id, flows));
    expect(placed.map((f) => f.id).sort()).toEqual(
      flows.map((f) => f.id).sort(),
    );
  });

  test("a few flows land where the briefs say", () => {
    const of = (id: number) => flowsFor(id, flows).map((f) => f.id);
    expect(of(1)).toContain("public-visitor-learn/home-page");
    expect(of(2)).toContain("public-visitor-stories/faqs");
    expect(of(3)).toContain("public-visitor-support/donate-page");
    expect(of(4)).toContain("public-visitor-language-and-layout/mobile-menu");
    expect(of(5)).toContain("admin-stories-and-faqs/dashboard");
    expect(of(6)).toContain("admin-site-content/carousel-list");
  });

  test("a flow that matches no rule belongs to no group", () => {
    expect(
      groupsOf({ role: "Public visitor: new section", route: "/brand-new" }),
    ).toEqual([]);
  });
});

test("every group has a brief", () => {
  const dir = join(import.meta.dirname, "../bug-sweep/browser/groups");
  expect(readdirSync(dir).sort()).toEqual(
    GROUPS.map((g) => `${g.slug}.md`).sort(),
  );
});

test("a browser agent runs on Haiku and can't edit outside its folder", () => {
  const args = huntArgs("go");
  expect(args).toContain("claude-haiku-5-5");
  expect(args).toEqual(expect.arrayContaining(["dontAsk", "Edit(./**)"]));
  expect(args.filter((a) => /^Bash\(/.test(a))).toEqual([
    "Bash(agent-browser:*)",
    "Bash(date:*)",
    "Bash(mkdir:*)",
  ]);
});
