"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ResilientImage from "@/components/ui/ResilientImage";
import { STORY_ROUTES, type Blog } from "@/lib/types";
import { translations } from "./translations";
import { useLocale } from "@/components/Providers/LocaleProvider";
import Link from "next/link";
interface BlogCardProps {
  blog: Blog;
  index: number;
  reference: (el: HTMLDivElement | null) => void;
  featured?: boolean;
}

const toText = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const BlogCard = ({ blog, index, reference, featured }: BlogCardProps) => {
  const locale = useLocale();
  const title = locale === "en" ? blog.titleEn : blog.titleAr;
  const content = locale === "en" ? blog.contentEn : blog.contentAr;
  const excerpt = toText(content ?? "");
  const Arrow = locale === "en" ? ArrowRight : ArrowLeft;

  return (
    <div
      ref={reference}
      className="opacity-0 translate-y-10 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Link
        href={`/${locale}/${STORY_ROUTES[blog.category]}/${blog.id}`}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-lg",
          featured && "md:grid md:grid-cols-[3fr_2fr] md:items-center",
        )}
      >
        <div
          className={cn(
            "bg-gray-100",
            featured && "md:flex md:items-center md:self-stretch",
          )}
        >
          <div className="aspect-video w-full overflow-hidden">
            <ResilientImage
              src={blog.imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </div>
        <div
          className={cn(
            "flex flex-1 flex-col p-6",
            featured && "md:justify-center md:p-10",
          )}
        >
          <h3
            className={cn(
              "mb-3 text-xl font-semibold leading-snug text-gray-900",
              featured && "md:text-3xl",
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "mb-6 leading-relaxed text-gray-700",
              featured ? "line-clamp-5" : "line-clamp-3",
            )}
          >
            {excerpt}
          </p>
          <span className="mt-auto inline-flex items-center gap-2 font-semibold text-primary group-hover:underline underline-offset-4">
            {translations.readFull[blog.category][locale]}
            <Arrow size={18} aria-hidden="true" />
          </span>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
