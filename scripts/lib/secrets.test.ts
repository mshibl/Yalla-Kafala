// Run with `pnpm test:scripts` (Node's own test runner).
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { secretMatches } from "../../convex/lib/secrets.ts";

describe("secretMatches", () => {
  test("accepts the configured secret", () => {
    assert.equal(secretMatches("s3cret-value", "s3cret-value"), true);
  });

  test("rejects a wrong secret of the same length", () => {
    assert.equal(secretMatches("s3cret-valuX", "s3cret-value"), false);
  });

  test("rejects a prefix or a longer string", () => {
    assert.equal(secretMatches("s3cret", "s3cret-value"), false);
    assert.equal(secretMatches("s3cret-value-extra", "s3cret-value"), false);
  });

  test("fails closed when no secret is configured", () => {
    assert.equal(secretMatches("", undefined), false);
    assert.equal(secretMatches("", ""), false);
    assert.equal(
      secretMatches("yallakafala-default-secret-2026", undefined),
      false,
    );
  });
});
