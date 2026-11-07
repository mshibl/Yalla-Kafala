import React from "react";
import BlogCard from "./BlogCard";
import type { Blog } from "@/lib/types.js";

interface BlogGridProps {
  blogs: Blog[];
  blogsRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

const BlogGrid = ({ blogs, blogsRef }: BlogGridProps) => {
  return (
    <div
      className={
        // A few posts read as features, one per row; more fill a grid.
        blogs.length < 3
          ? "mx-auto grid max-w-5xl grid-cols-1 gap-8"
          : "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      }
    >
      {blogs.map((blog, index) => (
        <BlogCard
          key={index}
          blog={blog}
          index={index}
          featured={blogs.length < 3}
          reference={(el) => {
            blogsRef.current[index] = el;
          }}
        />
      ))}
    </div>
  );
};

export default BlogGrid;
