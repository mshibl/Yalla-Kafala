"use server";
import type { FacebookPostType } from "@/lib/types";
import { generateTranslatedText } from "./ai/generateTranslatedText";
import { db } from "../db";
import { facebookPosts } from "../db/schema";
import { eq } from "drizzle-orm";

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
    image: post.full_picture,
    contentEn: post.message, // Will be translated if needed
    contentAr: post.message, // Will be translated if needed
    date: post.created_time,
    likes: post.reactions?.summary?.total_count || 0,
    comments: post.comments?.summary?.total_count || 0,
    shares: post.shares?.count || 0,
    permalink: post.permalink_url,
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
  dbPosts: any[],
  latestPosts: FacebookPostType[],
) {
  const dbPostIds = new Set(dbPosts.map((post: any) => String(post.id)));
  const latestPostIds = new Set(latestPosts.map((post) => String(post.id)));
  const newPosts = latestPosts.filter((post) => !dbPostIds.has(post.id));
  const removedPosts = dbPosts.filter((post) => !latestPostIds.has(post.id));

  // Remove all removedPosts from the db
  if (removedPosts.length > 0) {
    await Promise.all(
      removedPosts.map((post) =>
        db.delete(facebookPosts).where(eq(facebookPosts.id, post.id)),
      ),
    );
  }
  // Insert all newPosts into the db
  if (newPosts.length > 0) {
    const translatedNewPosts = await translatePosts(newPosts);
    await db.insert(facebookPosts).values(translatedNewPosts);
    return { translatedNewPosts, removedPosts };
  }
  return { translatedNewPosts: [], removedPosts };
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
 *   - Synchronizing the latest posts with a local database (adding new posts, removing outdated ones).
 *   - Returning the most recent 4 posts, sorted by date (descending), with both Arabic and English content fields.
 *
 * Key Steps:
 *   1. Fetch all posts currently stored in the local database.
 *   2. Fetch the latest posts from the Facebook API, paginating as needed to get at least 4 posts.
 *   3. For each new post (not in the DB), translate its content to ensure both Arabic and English fields are populated.
 *   4. Remove posts from the DB that are no longer present in the latest Facebook data.
 *   5. Insert new/translated posts into the DB.
 *   6. Return the 4 most recent posts, sorted by date.
 *   7. Update the image links in the database if they have changed. Facebook invalidates the images links after a few days.
 *
 * Translation Logic:
 *   - If a post is in English, only the Arabic field is translated.
 *   - If a post is in Arabic, only the English field is translated.
 *   - If a post contains both languages, no translation is performed; the text is split accordingly.
 */
export const fetchFacebookPosts: () => Promise<
  FacebookPostType[]
> = async () => {
  try {
    // Fetch all posts currently stored in the local database
    const dbPosts = await db.query.facebookPosts.findMany();
    // Fetch latest posts from Facebook
    const latestFacebookPosts = await fetchPostsFromFacebook(4);
    // Sync DB (remove outdated, insert new)
    const { translatedNewPosts, removedPosts } = await syncDatabaseWithFacebook(
      dbPosts,
      latestFacebookPosts,
    );
    // Construct the list of posts to return: posts that are now in the DB (dbPosts minus removedPosts) plus translatedNewPosts
    const removedIds = new Set(removedPosts.map((post) => post.id));
    const keptDbPosts = dbPosts.filter((post) => !removedIds.has(post.id));

    // Create a map of latest Facebook posts by ID for quick lookup
    const latestPostsMap = new Map(
      latestFacebookPosts.map((post) => [String(post.id), post]),
    );

    // Update image links in the database if they have changed
    await Promise.all(
      keptDbPosts.map(async (dbPost) => {
        const latestPost = latestPostsMap.get(String(dbPost.id));
        if (latestPost && dbPost.image !== latestPost.image) {
          await db
            .update(facebookPosts)
            .set({ image: latestPost.image })
            .where(eq(facebookPosts.id, dbPost.id));
        }
      }),
    );

    const allPosts = [...translatedNewPosts, ...keptDbPosts];
    // Sort and limit
    return getSortedLimitedPosts(allPosts, 4);
  } catch (error) {
    console.error("Error fetching Facebook posts:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return [];
  }
};
