import type { MetadataRoute } from "next";
import { headers } from "next/headers";

import { resolveSitemapSite } from "@/lib/sitemap/buildSitemap";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { origin } = resolveSitemapSite((await headers()).get("host"));
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
