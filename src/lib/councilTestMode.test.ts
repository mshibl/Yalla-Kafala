import { describe, expect, it } from "vitest";
import { checkCouncilTestMode } from "./councilTestMode";

const LOCAL = "http://127.0.0.1:3610";

describe("checkCouncilTestMode", () => {
  it("is off by default", () => {
    expect(checkCouncilTestMode({ convexUrl: LOCAL })).toEqual({ on: false });
    expect(checkCouncilTestMode({ flag: "0", convexUrl: LOCAL })).toEqual({
      on: false,
    });
    expect(checkCouncilTestMode({ flag: "true", convexUrl: LOCAL })).toEqual({
      on: false,
    });
  });

  it("is on only for the flag with a local Convex URL", () => {
    expect(checkCouncilTestMode({ flag: "1", convexUrl: LOCAL })).toEqual({
      on: true,
    });
    expect(
      checkCouncilTestMode({ flag: "1", convexUrl: "http://localhost:3210" }),
    ).toEqual({ on: true });
    expect(
      checkCouncilTestMode({ flag: "1", convexUrl: "http://[::1]:3210" }),
    ).toEqual({ on: true });
  });

  it("refuses a cloud Convex URL, such as production or the cloud dev data", () => {
    const verdict = checkCouncilTestMode({
      flag: "1",
      convexUrl: "https://happy-animal-123.convex.cloud",
    });
    expect(verdict).toMatchObject({ on: false });
    expect("refused" in verdict).toBe(true);
  });

  it("refuses a look-alike host", () => {
    const verdict = checkCouncilTestMode({
      flag: "1",
      convexUrl: "https://localhost.evil.example",
    });
    expect("refused" in verdict).toBe(true);
  });

  it("refuses on Vercel even with a local URL", () => {
    const verdict = checkCouncilTestMode({
      flag: "1",
      convexUrl: LOCAL,
      vercel: "1",
    });
    expect("refused" in verdict).toBe(true);
  });

  it("refuses a missing or broken Convex URL", () => {
    expect("refused" in checkCouncilTestMode({ flag: "1" })).toBe(true);
    expect(
      "refused" in checkCouncilTestMode({ flag: "1", convexUrl: "nope" }),
    ).toBe(true);
  });

  it("says nothing when the flag is off, whatever the URL", () => {
    expect(
      checkCouncilTestMode({
        convexUrl: "https://happy-animal-123.convex.cloud",
        vercel: "1",
      }),
    ).toEqual({ on: false });
  });
});
