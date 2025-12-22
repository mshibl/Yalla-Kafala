import type { Blog } from "@/lib/types";
import { db } from "@/server/db";
import { unstable_cache as Cache } from "next/cache";

export const fetchBlogs = Cache(
  async ({
    featuredOnly = false,
    publishedOnly = true,
  }: {
    featuredOnly?: boolean;
    publishedOnly?: boolean;
  } = {}): Promise<{
    success: boolean;
    data?: Blog[];
    message?: string;
  }> => {
    try {
      const blogs = await db.query.stories.findMany({
        orderBy: (stories, { desc }) => [desc(stories.updatedAt)],
        where: (stories, { eq, and }) =>
          and(
            publishedOnly ? eq(stories.publish, true) : undefined,
            featuredOnly ? eq(stories.featured, true) : undefined,
          ),
        limit: featuredOnly ? 5 : undefined,
      });

      return {
        success: true,
        data: blogs,
        message: "Blogs fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch blogs",
      };
    }
  },
  ["blogs"],
);

export const fetchBlogById = Cache(
  async (
    id: number,
  ): Promise<{
    success: boolean;
    data?: Blog;
    message?: string;
  }> => {
    try {
      const blog = await db.query.stories.findFirst({
        where: (stories, { eq }) => eq(stories.id, id),
      });

      if (!blog) {
        return {
          success: false,
          message: "Blog not found",
        };
      }
      return {
        success: true,
        data: blog,
        message: "Blog fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching blog:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch blog",
      };
    }
  },
  ["blogs"],
);

export const fetchBlogsIds = Cache(async (): Promise<{
  success: boolean;
  data?: { id: string }[];
  message?: string;
}> => {
  try {
    const blogsIds = await db.query.stories.findMany({
      columns: {
        id: true,
      },
    });

    return {
      success: true,
      data: blogsIds.map((blog) => ({ id: blog.id.toString() })), // Convert to string to match ssg requirements
      message: "Blogs fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch blogs",
    };
  }
}, ["blogs"]);
