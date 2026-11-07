"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Blog } from "@/lib/types";
import ResilientImage from "@/components/ui/ResilientImage";
import { useLocale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";

/** The three most recent featured stories, then a link to all of them. */
const BlogsClient = ({ blogs }: { blogs: Blog[] }) => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  if (blogs.length === 0) return null;
  const recent = blogs.slice(0, 3);

  return (
    <section id="blogs" className="section-padding bg-[#FBF8FC]">
      <div className="container mx-auto px-6">
        <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow mb-3">
              {translations.blogs.eyebrow[locale]}
            </span>
            <h2 className="heading-lg mb-4 text-gray-900">
              {translations.blogs.title[locale]}
            </h2>
            <p className="text-lg text-gray-700">
              {translations.blogs.description[locale]}
            </p>
          </div>
          <Link
            href={`/${locale}/kafala-blogs`}
            className="inline-flex shrink-0 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
          >
            {translations.blogs.seeAll[locale]}
            <Arrow size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recent.map((blog) => {
            const title = isRtl ? blog.titleAr : blog.titleEn;
            const description = isRtl ? blog.descriptionAr : blog.descriptionEn;
            return (
              <Link
                key={blog.id}
                href={`/${locale}/kafala-blogs/${blog.id}`}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-lg"
              >
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <ResilientImage
                    src={blog.imageUrl}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-3 text-xl font-semibold leading-snug text-gray-900">
                    {title}
                  </h3>
                  <p className="mb-6 line-clamp-3 leading-relaxed text-gray-700">
                    {description}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 group-hover:underline">
                    {translations.blogs.readMore[locale]}
                    <Arrow size={18} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BlogsClient;
