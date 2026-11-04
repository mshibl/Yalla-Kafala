import type { MetadataRoute } from "next";
import { headers } from "next/headers";

import { buildSitemap } from "@/lib/sitemap/buildSitemap";

/** Uses filesystem discovery + DB/Convex; must not run on Edge. */
export const runtime = "nodejs";

/**
 * Rendered per request: eg.yallakafala.org and us.yallakafala.org each list their own URLs.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host");
  return buildSitemap(host);
}
