import type { MetadataRoute } from "next";

const baseUrl = "https://www.yallakafala.org";
const locales = ["en", "ar"] as const;
const routes = [
  "",
  "/activities-and-milestones",
  "/beit-sagheer",
  "/donate",
  "/faqs",
  "/fatwa",
  "/kafala-blogs",
  "/kafala-steps",
  "/partnerships",
  "/resources",
  "/stock-donation",
  "/vision-mission",
  "/what-is-kafala",
  "/who-we-are",
  "/yk-gala",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified,
    })),
  );
}
