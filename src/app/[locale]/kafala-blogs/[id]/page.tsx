import BlogDetails from "@/components/ExploreKafala/KafalaBlogs/BlogDetails";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";

export default async function KafalaBlogPage({
  params,
}: {
  params: Promise<{ id: string; locale: Locale }>;
}) {
  const { locale, id } = await params;
  return <BlogDetails id={id} locale={locale} />;
}

export async function generateStaticParams() {
  const blogsIds = await fetchQuery(api.stories.queries.getStoryIds);
  if (!blogsIds) {
    return [];
  }
  return blogsIds;
}
