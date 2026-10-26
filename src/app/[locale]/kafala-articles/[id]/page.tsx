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
  return articles.map((a) => ({ id: a.id }));
}
