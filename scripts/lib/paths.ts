/**
 * Where things live. Every council script takes its paths from here.
 */
import { resolve } from "node:path";

/** The repo root (this folder's `scripts/lib/../..`). */
export const ROOT = resolve(import.meta.dirname, "../..");

/** The feature map the bug sweep walks. */
export const FEATURE_MAP = "docs/agents/feature-map.md";
