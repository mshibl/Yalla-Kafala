"use client";
import React, { useEffect, useRef, useState } from "react";
import type { Blog } from "@/lib/types";
import BlogCard from "./BlogCard";
import BlogsHeader from "./BlogsHeader";
import BlogsNavigation from "./BlogsNavigation";
import { useLocale } from "@/components/Providers/LocaleProvider";

const BlogsClient = ({ blogs }: { blogs: Blog[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const blogRefs = useRef<(HTMLDivElement | null)[]>([]);
  const locale = useLocale();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-0", "translate-y-10");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (headingRef.current) observer.observe(headingRef.current);
    if (descRef.current) observer.observe(descRef.current);

    blogRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const nextBlog = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % blogs.length);
  };

  const prevBlog = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + blogs.length) % blogs.length,
    );
  };
  if (blogs.length === 0) return null;

  return (
    <section
      id="blogs"
      className="section-padding bg-gradient-to-b from-gray-50 to-gray-100"
    >
      <div className="container mx-auto">
        <BlogsHeader headingRef={headingRef} descRef={descRef} />
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden relative rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(${locale === "en" ? "-" : ""}${activeIndex * 100}%)`,
              }}
            >
              {blogs.map((blog, index) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  cardRef={(el) => {
                    blogRefs.current[index] = el;
                  }}
                  index={index}
                />
              ))}
            </div>
          </div>
          <BlogsNavigation
            activeIndex={activeIndex}
            blogsLength={blogs.length}
            onPrev={prevBlog}
            onNext={nextBlog}
            onDotClick={setActiveIndex}
          />
        </div>
      </div>
    </section>
  );
};

export default BlogsClient;
