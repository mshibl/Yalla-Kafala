import BlogDetails from "@/components/ExploreKafala/KafalaBlogs/BlogDetails";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";

export default async function KafalaArticlePage({
  params,
}: {
  params: Promise<{ id: string; locale: Locale }>;
}) {
  const { locale, id } = await params;
  return <BlogDetails id={id} locale={locale} category="article" />;
}

export async function generateStaticParams() {
  const articles = await fetchQuery(api.stories.queries.getStories, {
    publishedOnly: true,
    category: "article",
  });
  // Never return an empty list. When the build runs with zero published articles, an empty
  // result left the deployed route answering 500 for every id (including articles published
  // after the build) until the next deploy. A placeholder id keeps the route on-demand
  // rendered; it simply renders "Article Not Found".
  if (articles.length === 0) {
    return [{ id: "placeholder" }];
  }
  return articles.map((a) => ({ id: a.id }));
}
