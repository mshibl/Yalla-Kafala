import React from "react";
import BlogCard from "./BlogCard";
import type { Blog } from "@/lib/types.js";

interface BlogGridProps {
  blogs: Blog[];
  blogsRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

const BlogGrid = ({ blogs, blogsRef }: BlogGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog, index) => (
        <BlogCard
          key={index}
          blog={blog}
          index={index}
          reference={(el) => {
            blogsRef.current[index] = el;
          }}
        />
      ))}
    </div>
  );
};

export default BlogGrid;
