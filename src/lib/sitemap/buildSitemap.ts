/**
 * Builds the URL list served at `/sitemap.xml` for search engines (wired in `src/app/sitemap.ts`).
 * Static paths under `src/app/[locale]` are discovered on disk so most new pages require no change
 * here. Paths with dynamic segments (e.g. blog post IDs, resource slugs) need a resolver that
 * loads allowed values from the database or Convex. Canonical URLs use `NEXT_PUBLIC_URL` from env.
 */

import type { MetadataRoute } from "next";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fetchQuery } from "convex/nextjs";

import { env } from "@/env";
import type { Resource } from "@/lib/types";
import { api } from "../../../convex/_generated/api";
import { db } from "@/server/db";

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
    const rows = await db.query.stories.findMany({
      columns: { id: true },
      where: (stories, { eq }) => eq(stories.publish, true),
    });
    return rows.map((r) => String(r.id));
  },
  "resources/[slug]": async () => {
    const resources = await fetchQuery(api.resources.queries.getResources, {});
    return resources.map((r: Resource) => r.slug);
  },
};

/**
 * Returns true when a path segment is a Next.js dynamic route piece (e.g. `[id]`, `[slug]`).
 */
function isDynamicSegment(segment: string): boolean {
  return segment.startsWith("[") && segment.endsWith("]");
}

/**
 * Returns true when a directory is a Next.js route group `(name)`, which must not appear in public URLs.
 */
function isRouteGroup(segment: string): boolean {
  return segment.startsWith("(") && segment.endsWith(")");
}

/**
 * Recursively scans the App Router tree under `localeRoot` and collects URLs relative to `[locale]`.
 *
 * @param localeRoot - Absolute path to `src/app/[locale]`
 * @returns `staticPaths` for segment lists with no brackets, and `dynamicKeys` like `kafala-blogs/[id]`
 *     for routes that need resolver-backed values
 */
function discoverLocaleRoutes(localeRoot: string): {
  staticPaths: string[];
  dynamicKeys: string[];
} {
  const staticPaths: string[] = [];
  const dynamicKeys = new Set<string>();

  /**
   * Depth-first traversal: when a folder contains `page.tsx`, record either a static path or a
   * dynamic key; recurse into children, omitting route group folders from the URL path.
   *
   * @param dir - Directory to read
   * @param segments - URL path segments under `[locale]` built so far (folder names, not files)
   */
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

/**
 * Returns the site origin for absolute sitemap URLs, normalizing `NEXT_PUBLIC_URL` (trim, no
 * trailing slash, default `https` if the env value has no scheme).
 */
function getSiteOrigin(): string {
  const raw = env.NEXT_PUBLIC_URL.trim().replace(/\/+$/, "");
  return raw.startsWith("http") ? raw : `https://${raw}`;
}

/**
 * Composes one sitemap entry URL: `{origin}/{locale}/{path}` with no duplicate slashes when path is empty.
 *
 * @param locale - `ar` or `en`
 * @param pathWithoutLocale - Path after locale (e.g. `faqs`, `kafala-blogs/12`), or empty string for home
 */
function urlFor(locale: string, pathWithoutLocale: string): string {
  const base = getSiteOrigin();
  const suffix = pathWithoutLocale ? `/${pathWithoutLocale}` : "";
  return `${base}/${locale}${suffix}`;
}

/** Single URL path segment from DB/Convex; not pre-encoded elsewhere before sitemap use. */
function encodeDynamicSegment(value: string): string {
  return encodeURIComponent(value);
}

/**
 * Produces the full sitemap payload for Next.js: every discovered static route per locale, plus
 * expanded URLs for each dynamic route using `DYNAMIC_SEGMENT_RESOLVERS`.
 */
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

    const pathPrefix = key.replace(/\/\[[^\]]+]$/, "");

    let values: string[];
    try {
      values = await resolver();
    } catch (error) {
      console.error(
        `[sitemap] Resolver failed for dynamic route "${key}" (pathPrefix "${pathPrefix}"): `,
        error,
      );
      continue;
    }

    for (const locale of LOCALES) {
      for (const value of values) {
        const segment = encodeDynamicSegment(String(value));
        const path =
          pathPrefix === "" ? segment : `${pathPrefix}/${segment}`;
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
