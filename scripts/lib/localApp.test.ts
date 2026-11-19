import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  assertLocalUrl,
  councilAppEnv,
  isLocalUrl,
  PORTS,
  readAdminKey,
  writeSeedFiles,
} from "./localApp";

describe("isLocalUrl", () => {
  it("accepts this machine only", () => {
    expect(isLocalUrl("http://127.0.0.1:3610")).toBe(true);
    expect(isLocalUrl("http://localhost:3610")).toBe(true);
    expect(isLocalUrl("http://[::1]:3610")).toBe(true);
    expect(isLocalUrl("https://happy-animal-123.convex.cloud")).toBe(false);
    expect(isLocalUrl("http://localhost.evil.example")).toBe(false);
    expect(isLocalUrl("not a url")).toBe(false);
    expect(isLocalUrl("")).toBe(false);
  });

  it("assertLocalUrl names what it refused", () => {
    expect(() =>
      assertLocalUrl("The Convex URL", "https://x.convex.cloud"),
    ).toThrow(/The Convex URL .* not a local address/);
    expect(() =>
      assertLocalUrl("The Convex URL", "http://127.0.0.1:1"),
    ).not.toThrow();
  });
});

describe("readAdminKey", () => {
  it("reads adminKey", () => {
    expect(readAdminKey('{"adminKey":"abc","ports":{}}')).toBe("abc");
  });
  it("fails clearly", () => {
    expect(() => readAdminKey("nope")).toThrow(/not valid JSON/);
    expect(() => readAdminKey("{}")).toThrow(/no adminKey/);
    expect(() => readAdminKey('{"adminKey":""}')).toThrow(/no adminKey/);
    expect(() => readAdminKey("null")).toThrow(/no adminKey/);
  });
});

describe("councilAppEnv", () => {
  const base = {
    baseUrl: "http://localhost:3600",
    convexUrl: "http://127.0.0.1:3610",
  };

  it("turns the test mode on, with dummy keys and the local backend", () => {
    const env = councilAppEnv(base);
    expect(env.NEXT_PUBLIC_COUNCIL_TEST_MODE).toBe("1");
    expect(env.NEXT_PUBLIC_CONVEX_URL).toBe("http://127.0.0.1:3610");
    expect(env.SKIP_ENV_VALIDATION).toBe("1");
    expect(env.UPLOADTHING_TOKEN).toBe("council-dummy");
    expect(env.COUNCIL_CONVEX_ADMIN_KEY).toBeUndefined();
  });

  it("adds the admin key only when given (never in the build)", () => {
    expect(
      councilAppEnv({ ...base, adminKey: "k" }).COUNCIL_CONVEX_ADMIN_KEY,
    ).toBe("k");
  });

  it("refuses a cloud backend", () => {
    expect(() =>
      councilAppEnv({ ...base, convexUrl: "https://x.convex.cloud" }),
    ).toThrow(/not a local address/);
  });
});

describe("PORTS", () => {
  it("never share a port between the two tools", () => {
    const all = Object.values(PORTS).flatMap((p) => [
      p.app,
      p.convex,
      p.convexSite,
    ]);
    expect(new Set(all).size).toBe(all.length);
  });
});

describe("writeSeedFiles", () => {
  it("writes one JSON Lines file per non-empty table", () => {
    const dir = mkdtempSync(join(tmpdir(), "seed-"));
    try {
      const files = writeSeedFiles(dir);
      const tables = files.map((f) => f.table).sort();
      expect(tables).toEqual([
        "boardMembers",
        "carouselImages",
        "facebookPosts",
        "faqs",
        "resources",
        "stories",
      ]);
      expect(readdirSync(dir).sort()).toEqual(
        tables.map((t) => `${t}.jsonl`).sort(),
      );
      const stories = readFileSync(join(dir, "stories.jsonl"), "utf8")
        .trim()
        .split("\n")
        .map((l) => JSON.parse(l) as { titleEn: string });
      expect(stories.length).toBeGreaterThanOrEqual(5);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
