import type { MetadataRoute } from "next";

import { buildSitemap } from "@/lib/sitemap/buildSitemap";

/** Regenerate periodically so new blogs/resources appear without redeploying. */
export const revalidate = 3600;

/** Uses filesystem discovery + DB/Convex; must not run on Edge. */
export const runtime = "nodejs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemap();
}
