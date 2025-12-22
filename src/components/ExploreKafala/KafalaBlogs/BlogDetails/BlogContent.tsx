import type { Blog } from "@/lib/types";
import type { Locale } from "@/components/Providers/LocaleProvider";
import BackToBlogsButton from "./BackToBlogsButton";

export default function BlogContent({
  blog,
  locale,
}: {
  blog: Blog;
  locale: Locale;
}) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-8">
            {locale === "en" ? blog.titleEn : blog.titleAr}
          </h1>
          <div className="flex justify-start mb-8">
            <BackToBlogsButton locale={locale} />
          </div>
          <div className="aspect-video bg-gray-100 overflow-hidden rounded-lg mb-8">
            <img
              src={blog.imageUrl}
              alt={locale === "en" ? blog.titleEn : blog.titleAr}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="mt-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: locale === "en" ? blog.contentEn : blog.contentAr,
                }}
                className="prose-lg prose-p:my-4 prose-headings:text-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
