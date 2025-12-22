"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Blog } from "@/lib/types.js";
import { useLocale } from "@/components/Providers/LocaleProvider";
import Link from "next/link";
interface BlogCardProps {
  blog: Blog;
  index: number;
  reference: (el: HTMLDivElement | null) => void;
}

const BlogCard = ({ blog, index, reference }: BlogCardProps) => {
  const locale = useLocale();
  // Get the appropriate content based on locale
  const content = locale === "en" ? blog.contentEn : blog.contentAr;
  // Truncate content safely to 150 characters
  const truncatedContent = content ? content.substring(0, 150) : "";

  return (
    <div
      ref={reference}
      className="opacity-0 translate-y-10 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={blog.imageUrl}
            alt={locale === "en" ? blog.titleEn : blog.titleAr}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            {locale === "en" ? blog.titleEn : blog.titleAr}
          </h3>
          <div
            dangerouslySetInnerHTML={{
              __html: truncatedContent + "...",
            }}
            className="text-gray-600 mb-4"
          />

          <Link
            href={`/${locale}/kafala-blogs/${blog.id}`}
            className="inline-flex items-center"
          >
            <Button variant="outline" className="flex items-center gap-2">
              {locale === "en" ? "Read Full Blog" : "اقرأ المدونة بالكامل"}{" "}
              {locale === "en" ? (
                <ArrowRight size={16} className="ml-2" />
              ) : (
                <ArrowLeft size={16} className="ml-2" />
              )}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogCard;
