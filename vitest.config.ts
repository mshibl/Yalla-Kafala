import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: { alias: { "@": resolve(import.meta.dirname, "src") } },
  test: {
    include: ["scripts/**/*.test.ts", "src/**/*.test.ts"],
    // Written for Node's own runner (`pnpm test:scripts`).
    exclude: ["scripts/lib/secrets.test.ts", "node_modules/**"],
    environment: "node",
  },
});
