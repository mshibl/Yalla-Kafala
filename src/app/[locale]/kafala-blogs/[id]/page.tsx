import BlogDetails from "@/components/ExploreKafala/KafalaBlogs/BlogDetails";
import BlogNotFound from "@/components/ExploreKafala/KafalaBlogs/BlogDetails/BlogNotFound";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { fetchBlogsIds } from "@/server/actions/blogs/fetchBlogs";

export default async function KafalaBlogPage({
  params,
}: {
  params: Promise<{ id: string; locale: Locale }>;
}) {
  const { locale, id } = await params;
  if (isNaN(parseInt(id))) {
    return <BlogNotFound />;
  }
  return <BlogDetails id={parseInt(id)} locale={locale} />;
}

export async function generateStaticParams() {
  const blogsIds = await fetchBlogsIds();
  if (!blogsIds.success || !blogsIds.data) {
    return [];
  }
  return blogsIds.data;
}
