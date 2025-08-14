import type { Story } from "@/lib/types";
import { db } from "@/server/db";
import { unstable_cache as Cache } from "next/cache";

export const fetchStories = Cache(
  async ({
    featuredOnly = false,
    publishedOnly = true,
  }: {
    featuredOnly?: boolean;
    publishedOnly?: boolean;
  } = {}): Promise<{
    success: boolean;
    data?: Story[];
    message?: string;
  }> => {
    try {
      const stories = await db.query.stories.findMany({
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
        data: stories,
        message: "Stories fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching stories:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch stories",
      };
    }
  },
  ["stories"],
);

export const fetchStoryById = Cache(
  async (
    id: number,
  ): Promise<{
    success: boolean;
    data?: Story;
    message?: string;
  }> => {
    try {
      const story = await db.query.stories.findFirst({
        where: (stories, { eq }) => eq(stories.id, id),
      });

      if (!story) {
        return {
          success: false,
          message: "Story not found",
        };
      }
      return {
        success: true,
        data: story,
        message: "Story fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching story:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch story",
      };
    }
  },
  ["stories"],
);

export const fetchStoriesIds = Cache(async (): Promise<{
  success: boolean;
  data?: { id: string }[];
  message?: string;
}> => {
  try {
    const storiesIds = await db.query.stories.findMany({
      columns: {
        id: true,
      },
    });

    return {
      success: true,
      data: storiesIds.map((story) => ({ id: story.id.toString() })), // Convert to string to match ssg requirements
      message: "Stories fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching stories:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch stories",
    };
  }
}, ["stories"]);
