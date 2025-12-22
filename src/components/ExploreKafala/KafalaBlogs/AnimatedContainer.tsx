"use client";

import React, { useEffect, useRef } from "react";
import KafalaHeader from "./KafalaHeader";
import BlogGrid from "./BlogGrid";
import type { Blog } from "@/lib/types.js";

interface AnimatedContainerProps {
  blogs: Blog[];
}

const AnimatedContainer = ({ blogs }: AnimatedContainerProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const blogsRef = useRef<(HTMLDivElement | null)[]>([]);

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

    if (headerRef.current) observer.observe(headerRef.current);
    blogsRef.current.forEach((blog) => {
      if (blog) observer.observe(blog);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container mx-auto px-6">
      <div
        ref={headerRef}
        className="opacity-0 translate-y-10 transition-all duration-700 ease-out"
      >
        <KafalaHeader />
      </div>
      <BlogGrid blogs={blogs} blogsRef={blogsRef} />
    </div>
  );
};

export default AnimatedContainer;
