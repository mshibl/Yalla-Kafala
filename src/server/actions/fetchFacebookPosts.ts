"use server";
import type { FacebookPostType } from "@/lib/types";
import { generateTranslatedText } from "./ai/generateTranslatedText";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface FacebookPagingCursors {
  before: string;
  after: string;
}

interface FacebookPaging {
  cursors: FacebookPagingCursors;
  next?: string;
}

interface FacebookResponse {
  data: any[];
  paging: FacebookPaging;
}

const translationSystemPrompt = `You are a translator. You will be given a facebook post and will return the following format: {
            arabic: string,
            english: string
          }

          - If the post is in english, the english field should be the same as the post content and the arabic field should be the translated text.
          - If the post is in arabic, the arabic field should be the same as the post content and the english field should be the translated text.
          - If the post is in both languages, dont translate the text. Extract the english text into the english field and the arabic text into the arabic field.

          Your job is to only translate the text to the language that is not provided without changing the text.
          `;

// Helper to map a raw Facebook post to internal structure
function mapFacebookPost(post: any): FacebookPostType {
  return {
    id: post.id,
    image: post.full_picture || "",
    contentEn: post.message || "", // Will be translated if needed
    contentAr: post.message || "", // Will be translated if needed
    date: post.created_time,
    likes: post.reactions?.summary?.total_count || 0,
    comments: post.comments?.summary?.total_count || 0,
    shares: post.shares?.count || 0,
    permalink: post.permalink_url || "",
  };
}

// Helper to fetch posts from Facebook API (with pagination)
async function fetchPostsFromFacebook(
  minPosts: number,
): Promise<FacebookPostType[]> {
  const latestFacebookPosts: FacebookPostType[] = [];
  let nextPageUrl: string | null =
    `https://graph.facebook.com/v20.0/469771757195549/posts?limit=10&fields=message,created_time,permalink_url,full_picture,attachments,id,comments.summary(true),reactions.summary(true),shares&access_token=${process.env.FACEBOOK_PAGE_ACCESS_TOKEN}`;

  while (latestFacebookPosts.length < minPosts && nextPageUrl !== null) {
    const response = await fetch(nextPageUrl, {
      method: "GET",
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      console.error("Facebook API response not OK:", {
        status: response.status,
        statusText: response.statusText,
      });
      break;
    }
    const data: FacebookResponse = await response.json();
    if (!Array.isArray(data.data)) {
      console.error("Facebook posts data is not an array:", data);
      break;
    }
    const posts = data.data.map(mapFacebookPost);
    latestFacebookPosts.push(...posts);
    nextPageUrl = data.paging?.next || null;
  }
  return latestFacebookPosts.slice(0, minPosts);
}

// Helper to translate posts
async function translatePosts(
  posts: FacebookPostType[],
): Promise<FacebookPostType[]> {
  return Promise.all(
    posts.map(async (post) => {
      const translatedPost = await generateTranslatedText({
        text: post.contentEn,
        system: translationSystemPrompt,
      });
      return {
        ...post,
        contentAr: translatedPost?.arabic ?? post.contentAr,
        contentEn: translatedPost?.english ?? post.contentEn,
      };
    }),
  );
}

// Helper to sync DB with Facebook posts
async function syncDatabaseWithFacebook(
  dbPosts: FacebookPostType[],
  latestPosts: FacebookPostType[],
) {
  const dbPostIds = new Set(dbPosts.map((post) => String(post.id)));
  const latestPostIds = new Set(latestPosts.map((post) => String(post.id)));
  const newPosts = latestPosts.filter((post) => !dbPostIds.has(post.id));
  const removedPosts = dbPosts.filter((post) => !latestPostIds.has(post.id));

  const idsToRemove = removedPosts.map((post) => post.id);

  // Check for changed images in kept posts
  const keptPosts = dbPosts.filter((post) => latestPostIds.has(post.id));
  const latestPostsMap = new Map(latestPosts.map((post) => [String(post.id), post]));
  const imagesToUpdate: { id: string; image: string }[] = [];

  for (const dbPost of keptPosts) {
    const latestPost = latestPostsMap.get(String(dbPost.id));
    if (latestPost && dbPost.image !== latestPost.image) {
      imagesToUpdate.push({ id: dbPost.id, image: latestPost.image });
      dbPost.image = latestPost.image; // sync locally in memory
    }
  }

  let translatedNewPosts: FacebookPostType[] = [];
  if (newPosts.length > 0) {
    translatedNewPosts = await translatePosts(newPosts);
  }

  // Call the single sync mutation in Convex
  await fetchMutation(api.facebookPosts.mutations.syncFacebookPosts, {
    secret: process.env.INTERNAL_SYNC_SECRET || "yallakafala-default-secret-2026",
    postsToInsert: translatedNewPosts,
    idsToRemove,
    imagesToUpdate,
  });

  return { translatedNewPosts, removedPosts };
}

// Helper to sort and limit posts
function getSortedLimitedPosts(
  posts: FacebookPostType[],
  limit: number,
): FacebookPostType[] {
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

/**
 * fetchFacebookPosts.ts
 *
 * This module defines the fetchFacebookPosts server action, which is responsible for:
 *   - Fetching the latest posts from a specific Facebook page using the Facebook Graph API.
 *   - Translating post content between Arabic and English as needed.
 *   - Synchronizing the latest posts with Convex (adding new posts, removing outdated ones).
 *   - Returning the most recent 4 posts, sorted by date (descending).
 */
export const fetchFacebookPosts: () => Promise<
  FacebookPostType[]
> = async () => {
  try {
    // Fetch the stored Facebook posts directly from Convex
    return await fetchQuery(api.facebookPosts.queries.getFacebookPosts, { limit: 4 });
  } catch (error) {
    console.error("Error fetching Facebook posts:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return [];
  }
};

export const syncFacebookPostsAction = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Unauthorized: Only authenticated admins can sync Facebook posts.",
      };
    }

    // Fetch all posts currently stored in Convex
    const dbPosts = await fetchQuery(api.facebookPosts.queries.getFacebookPosts, { limit: 100 });
    // Fetch latest posts from Facebook
    const latestFacebookPosts = await fetchPostsFromFacebook(4);
    // Sync DB (remove outdated, insert new, update image URLs)
    await syncDatabaseWithFacebook(dbPosts, latestFacebookPosts);

    // Revalidate homepage cache on-demand
    revalidatePath("/[locale]", "page");

    return {
      success: true,
      message: "Facebook posts synced successfully.",
    };
  } catch (error) {
    console.error("Error syncing Facebook posts:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to sync Facebook posts.",
    };
  }
};
