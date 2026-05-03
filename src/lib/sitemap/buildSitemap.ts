/**
 * Builds the URL list served at `/sitemap.xml` for search engines (wired in `src/app/sitemap.ts`).
 * Static paths and dynamic route keys come from `locale-route-manifest.generated.ts`, produced at
 * build time (see `prebuild` / `pnpm run sitemap:manifest`) so this module does not read the disk
 * at request time — serverless runtimes (e.g. Vercel) often omit the `src/` tree from the bundle.
 * Values for dynamic segments (blog IDs, resource slugs) still load from Postgres and Convex.
 * Canonical URLs use `NEXT_PUBLIC_URL` from env.
 */

import type { MetadataRoute } from "next";
import { fetchQuery } from "convex/nextjs";

import { env } from "@/env";
import type { Resource } from "@/lib/types";
import { api } from "../../../convex/_generated/api";
import { db } from "@/server/db";
import {
  LOCALE_DYNAMIC_ROUTE_KEYS,
  LOCALE_STATIC_PATHS,
} from "@/lib/sitemap/locale-route-manifest.generated";

const LOCALES = ["ar", "en"] as const;

/** Relative path under `[locale]` (e.g. `kafala-blogs/[id]`). */
type DynamicRouteKey = string;

type DynamicSegmentResolver = () => Promise<string[]>;

/**
 * When you add a new dynamic route under `[locale]`, register it here once, then run
 * `pnpm run sitemap:manifest` so `LOCALE_DYNAMIC_ROUTE_KEYS` includes the new key.
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
 * Produces the full sitemap payload for Next.js: every static route per locale from the build-time
 * manifest, plus expanded URLs for each dynamic route using `DYNAMIC_SEGMENT_RESOLVERS`.
 */
export async function buildSitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [...LOCALE_STATIC_PATHS];
  const dynamicKeys = [...LOCALE_DYNAMIC_ROUTE_KEYS];

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
