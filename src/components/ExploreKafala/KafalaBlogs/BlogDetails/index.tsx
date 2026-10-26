import { MakeDifference } from "@/components/Homepage/MakeDifference";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Suspense } from "react";
import LoadingState from "./LoadingState";
import BlogContent from "./BlogContent";
import BlogNotFound from "./BlogNotFound";
import type { StoryCategory } from "@/lib/types";

const BlogDetailsFetch = async ({
  id,
  locale,
  category,
}: {
  id: string;
  locale: Locale;
  category: StoryCategory;
}) => {
  const blog = await fetchQuery(api.stories.queries.getStoryById, { id });
  // Each story lives under one route only: a blog at /kafala-blogs, an article at /kafala-articles.
  if (!blog || blog.category !== category) {
    return <BlogNotFound category={category} />;
  }

  return <BlogContent blog={blog} locale={locale} />;
};

export default function BlogDetails({
  id,
  locale,
  category = "blog",
}: {
  id: string;
  locale: Locale;
  category?: StoryCategory;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24 md:pt-32">
        <Suspense fallback={<LoadingState />}>
          <BlogDetailsFetch id={id} locale={locale} category={category} />
        </Suspense>
      </main>
    </div>
  );
}
