import type { MetadataRoute } from "next";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { eq } from "drizzle-orm";
import { fetchQuery } from "convex/nextjs";

import { env } from "@/env";
import type { Resource } from "@/lib/types";
import { api } from "../../../convex/_generated/api";
import { db } from "@/server/db";
import { stories } from "@/server/db/schema";

const LOCALES = ["ar", "en"] as const;

/** Relative path under `[locale]` (e.g. `kafala-blogs/[id]`). */
type DynamicRouteKey = string;

type DynamicSegmentResolver = () => Promise<string[]>;

/**
 * When you add a new dynamic route under `[locale]`, register it here once.
 * Static routes under `src/app/[locale]` are picked up automatically from the filesystem.
 */
const DYNAMIC_SEGMENT_RESOLVERS: Record<DynamicRouteKey, DynamicSegmentResolver> = {
  "kafala-blogs/[id]": async () => {
    const rows = await db
      .select({ id: stories.id })
      .from(stories)
      .where(eq(stories.publish, true));
    return rows.map((r) => String(r.id));
  },
  "resources/[slug]": async () => {
    const resources = await fetchQuery(api.resources.queries.getResources, {});
    return resources.map((r: Resource) => r.slug);
  },
};

function isDynamicSegment(segment: string): boolean {
  return segment.startsWith("[") && segment.endsWith("]");
}

function isRouteGroup(segment: string): boolean {
  return segment.startsWith("(") && segment.endsWith(")");
}

/**
 * Walk `src/app/[locale]` and collect every `page.tsx` route: static paths (no dynamic segments)
 * and dynamic route keys (path under locale with bracket segments preserved).
 */
function discoverLocaleRoutes(localeRoot: string): {
  staticPaths: string[];
  dynamicKeys: string[];
} {
  const staticPaths: string[] = [];
  const dynamicKeys = new Set<string>();

  function walk(dir: string, segments: string[]): void {
    const entries = readdirSync(dir, { withFileTypes: true });
    const hasPage = entries.some((e) => e.isFile() && e.name === "page.tsx");

    if (hasPage) {
      const hasDynamic = segments.some(isDynamicSegment);
      if (hasDynamic) {
        dynamicKeys.add(segments.join("/"));
      } else {
        staticPaths.push(segments.length ? segments.join("/") : "");
      }
    }

    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const child = join(dir, e.name);
      // Parentheses folders are route groups and are not URL segments.
      if (isRouteGroup(e.name)) {
        walk(child, segments);
      } else {
        walk(child, [...segments, e.name]);
      }
    }
  }

  walk(localeRoot, []);

  staticPaths.sort();
  return {
    staticPaths,
    dynamicKeys: [...dynamicKeys].sort(),
  };
}

function getSiteOrigin(): string {
  const raw = env.NEXT_PUBLIC_URL.trim().replace(/\/+$/, "");
  return raw.startsWith("http") ? raw : `https://${raw}`;
}

function urlFor(locale: string, pathWithoutLocale: string): string {
  const base = getSiteOrigin();
  const suffix = pathWithoutLocale ? `/${pathWithoutLocale}` : "";
  return `${base}/${locale}${suffix}`;
}

export async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  const localeRoot = join(process.cwd(), "src", "app", "[locale]");
  const { staticPaths, dynamicKeys } = discoverLocaleRoutes(localeRoot);

  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const locale of LOCALES) {
    for (const path of staticPaths) {
      entries.push({
        url: urlFor(locale, path),
        lastModified: now,
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.8,
      });
    }
  }

  for (const key of dynamicKeys) {
    const resolver = DYNAMIC_SEGMENT_RESOLVERS[key];
    if (!resolver) {
      if (env.NODE_ENV === "development") {
        console.warn(
          `[sitemap] No resolver for dynamic route "${key}". Add it to DYNAMIC_SEGMENT_RESOLVERS in src/lib/sitemap/buildSitemap.ts`,
        );
      }
      continue;
    }

    const values = await resolver();
    const pathPrefix = key.replace(/\/\[[^\]]+]$/, "");

    for (const locale of LOCALES) {
      for (const value of values) {
        const path =
          pathPrefix === "" ? `${value}` : `${pathPrefix}/${value}`;
        entries.push({
          url: urlFor(locale, path),
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
        });
      }
    }
  }

  return entries;
}
