import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SEED, toJsonl } from "./seedData";

const PUBLIC = join(import.meta.dirname, "../../public");

describe("the demo seed", () => {
  it("covers every state the screens and flows need", () => {
    const stories = SEED.stories;
    expect(stories.some((s) => s.category === "blog" && s.publish)).toBe(true);
    expect(stories.some((s) => s.category === "article" && s.publish)).toBe(
      true,
    );
    expect(stories.some((s) => !s.publish)).toBe(true);
    expect(stories.some((s) => s.featured)).toBe(true);
    expect(SEED.faqs.some((f) => !f.publish)).toBe(true);
    expect(SEED.faqs.some((f) => f.featured)).toBe(true);
    expect(SEED.boardMembers.some((m) => m.type === "advisor")).toBe(true);
    expect(SEED.boardMembers.some((m) => m.country === "usa")).toBe(true);
    expect(SEED.boardMembers.some((m) => !m.publish)).toBe(true);
    expect(SEED.carouselImages.length).toBeGreaterThanOrEqual(3);
  });

  it("has both languages everywhere and unique keys", () => {
    for (const s of SEED.stories) {
      expect(s.titleEn).not.toBe("");
      expect(s.titleAr).not.toBe("");
    }
    const slugs = SEED.resources.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const keys = SEED.stories.map((s) => s.imageKey);
    expect(new Set(keys).size).toBe(keys.length);
    const orders = SEED.carouselImages.map((c) => c.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("uses only the site's own images and files (no third party)", () => {
    const paths = [
      ...SEED.stories.map((s) => s.imageUrl),
      ...SEED.boardMembers.map((m) => m.imageUrl ?? ""),
      ...SEED.carouselImages.map((c) => c.src),
      ...SEED.facebookPosts.map((p) => p.image),
      ...SEED.resources.map((r) => r.link),
    ];
    for (const p of paths) {
      expect(p.startsWith("/")).toBe(true);
      expect(existsSync(join(PUBLIC, p)), `${p} is in public/`).toBe(true);
    }
  });

  it("writes one JSON object per line", () => {
    const text = toJsonl(SEED.faqs);
    const lines = text.trimEnd().split("\n");
    expect(lines).toHaveLength(SEED.faqs.length);
    for (const line of lines) expect(() => JSON.parse(line)).not.toThrow();
    expect(text.endsWith("\n")).toBe(true);
  });
});
