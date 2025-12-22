import { MakeDifference } from "@/components/Homepage/MakeDifference";
import type { Locale } from "@/components/Providers/LocaleProvider";

import { fetchBlogById } from "@/server/actions/blogs/fetchBlogs";
import { Suspense } from "react";
import LoadingState from "./LoadingState";
import BlogContent from "./BlogContent";
import BlogNotFound from "./BlogNotFound";

const BlogDetailsFetch = async ({
  id,
  locale,
}: {
  id: number;
  locale: Locale;
}) => {
  const blog = await fetchBlogById(id);
  if (!blog.success || !blog.data) {
    return <BlogNotFound />;
  }

  return <BlogContent blog={blog.data} locale={locale} />;
};

export default function BlogDetails({
  id,
  locale,
}: {
  id: number;
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
