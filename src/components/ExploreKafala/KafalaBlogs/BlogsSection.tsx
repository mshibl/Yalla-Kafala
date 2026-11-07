import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import AnimatedContainer from "./AnimatedContainer";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Locale } from "@/components/Providers/LocaleProvider";
import type { StoryCategory } from "@/lib/types";
import { translations } from "./translations";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

const BlogsContent = async ({
  locale,
  category,
}: {
  locale: Locale;
  category: StoryCategory;
}) => {
  const blogs = await fetchQuery(api.stories.queries.getStories, {
    publishedOnly: true,
    category,
  });

  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-2xl font-bold">
          {translations.empty[category][locale]}
        </p>
      </div>
    );
  }

  return <AnimatedContainer blogs={blogs} category={category} />;
};

const moreReading = {
  title: { en: "More reading", ar: "للمزيد من القراءة" },
  links: [
    {
      href: "/what-is-kafala",
      title: { en: "What is kafala", ar: "ما هي الكفالة" },
      text: {
        en: "Kafala in Islam: lineage, inheritance and the virtue of caring for an orphan.",
        ar: "الكفالة في الإسلام: النسب والميراث وفضل كفالة اليتيم.",
      },
    },
    {
      href: "/fatwa",
      title: { en: "Dar Ifta fatwa", ar: "فتوى دار الإفتاء" },
      text: {
        en: "Dar Ifta confirms that Zakat can be given to Yalla Kafala.",
        ar: "دار الإفتاء تؤكد جواز توجيه الزكاة إلى يلا كفالة.",
      },
    },
    {
      href: "/resources",
      title: { en: "Resources", ar: "الموارد" },
      text: {
        en: "Guides, reports and documents to download.",
        ar: "أدلة وتقارير ووثائق للتحميل.",
      },
    },
  ],
};

const MoreReading = ({
  locale,
  category,
}: {
  locale: Locale;
  category: StoryCategory;
}) => {
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const links =
    category === "article"
      ? [
          {
            href: "/kafala-blogs",
            title: { en: "Kafala blogs", ar: "مدونات الكفالة" },
            text: {
              en: "Stories from families who have taken the kafala journey.",
              ar: "قصص من أسر خاضت رحلة الكفالة.",
            },
          },
          ...moreReading.links.slice(0, 2),
        ]
      : moreReading.links;
  return (
    <div className="container mx-auto mt-16 max-w-4xl px-6">
      <h2 className="mb-6 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
        {moreReading.title[locale]}
      </h2>
      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={`/${locale}${link.href}`}
            className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md"
          >
            <h3 className="mb-2 flex items-center justify-between gap-3 text-xl font-semibold text-gray-900">
              {link.title[locale]}
              <Arrow
                className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                aria-hidden="true"
              />
            </h3>
            <p className="leading-relaxed text-gray-700">{link.text[locale]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

const BlogsSection = ({
  locale,
  category,
}: {
  locale: Locale;
  category: StoryCategory;
}) => {
  return (
    <section className="pb-24 pt-10 md:pt-14">
      <Suspense
        fallback={
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="rounded-lg overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        }
      >
        <BlogsContent locale={locale} category={category} />
      </Suspense>
      <MoreReading locale={locale} category={category} />
    </section>
  );
};

export default BlogsSection;
