import { MakeDifference } from "@/components/Homepage/MakeDifference";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Suspense } from "react";
import LoadingState from "./LoadingState";
import BlogContent from "./BlogContent";
import BlogNotFound from "./BlogNotFound";

const BlogDetailsFetch = async ({
  id,
  locale,
}: {
  id: string;
  locale: Locale;
}) => {
  const blog = await fetchQuery(api.stories.queries.getStoryById, { id });
  if (!blog) {
    return <BlogNotFound />;
  }

  return <BlogContent blog={blog} locale={locale} />;
};

export default function BlogDetails({
  id,
  locale,
}: {
  id: string;
  locale: Locale;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-24 md:pt-32">
        <Suspense fallback={<LoadingState />}>
          <BlogDetailsFetch id={id} locale={locale} />
        </Suspense>
      </main>
    </div>
  );
}
