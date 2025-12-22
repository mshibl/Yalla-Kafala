import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Blog } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/components/Providers/LocaleProvider";
import { ArrowRight, ArrowLeft } from "lucide-react";
interface BlogCardProps {
  blog: Blog;
  cardRef?: React.Ref<HTMLDivElement>;
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, cardRef, index }) => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const title = isRtl ? blog.titleAr : blog.titleEn;
  const description = isRtl ? blog.descriptionAr : blog.descriptionEn;
  return (
    <div
      ref={cardRef}
      className="w-full flex-shrink-0 opacity-0 translate-y-10 transition-all duration-700 ease-out"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="border-none overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            <div className="md:col-span-6 relative h-80 md:h-[450px] overflow-hidden group">
              <Image
                fill
                src={blog.imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:bg-gradient-to-r"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8 md:hidden">
                <h3 className="text-white text-2xl font-serif font-medium mb-2">
                  {title}
                </h3>
                <p className="text-white/90 text-sm line-clamp-2">
                  {description}
                </p>
              </div>
            </div>
            <div className="md:col-span-6 p-6 md:p-10 flex flex-col justify-center">
              <div className="hidden md:block mb-6">
                <span className="text-indigo-600 text-sm font-medium uppercase tracking-wider mb-2 block">
                  {locale === "en" ? "Kafala Blog" : "مدونة كفالة"}
                </span>
                <h3 className="text-gray-800 text-3xl font-serif font-medium leading-tight">
                  {title}
                </h3>
              </div>
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-indigo-600/40 rounded"></div>
                <p className="text-gray-700 leading-relaxed pl-6 relative z-10">
                  {description}
                </p>
                <div className="mt-8 pl-6 ">
                  <Link href={`/kafala-blogs/${blog.id}`}>
                    <button className="cursor-pointer flex items-center text-indigo-700 font-medium group">
                      {locale === "en"
                        ? "Read Full Blog"
                        : "اقرأ المدونة بالكامل"}
                      {isRtl ? (
                        <ArrowLeft size={20} />
                      ) : (
                        <ArrowRight size={20} />
                      )}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogCard;
