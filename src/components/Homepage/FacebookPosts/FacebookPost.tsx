"use client";
import React, { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FacebookPostType } from "@/lib/types";
import Link from "next/link";
import { useLocale } from "@/components/Providers/LocaleProvider";
interface FacebookPostProps {
  post: FacebookPostType;
  index: number;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const FacebookPost: React.FC<FacebookPostProps> = ({ post, index }) => {
  const postRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const locale = useLocale();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.1 },
    );

    if (postRef.current) observer.observe(postRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Card
      ref={postRef}
      className={cn(
        "overflow-hidden transition-all duration-500 opacity-0 translate-y-8",
        isVisible && "opacity-100 translate-y-0",
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={post.image}
          alt="Facebook post"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">YK</span>
            </div>
            <span className="font-medium">
              {locale === "en" ? "Yallakafala" : "يلا كفالة"}
            </span>
          </div>
          <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">
          {locale === "ar" ? post.contentAr : post.contentEn}
        </p>

        <div className="flex gap-4 text-sm text-gray-500 mb-4">
          {post.likes > 0 && (
            <span>
              ♥ {post.likes} {locale === "en" ? "likes" : "إعجابات"}
            </span>
          )}
          {post.comments > 0 && (
            <span>
              💬 {post.comments} {locale === "en" ? "comments" : "تعليقات"}
            </span>
          )}
          {post.shares > 0 && (
            <span>
              ↗ {post.shares} {locale === "en" ? "shares" : "مشاركات"}
            </span>
          )}
        </div>

        <Link href={post.permalink} target="_blank">
          <Button variant="outline" className="w-full group">
            {locale === "en" ? "View on Facebook" : "عرض على فيسبوك"}
            <ExternalLink
              size={16}
              className="ml-2 group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </Link>
      </div>
    </Card>
  );
};
