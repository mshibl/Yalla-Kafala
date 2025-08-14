"use server";

import type { Story } from "@/lib/types";
import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import DOMPurify from "isomorphic-dompurify";
import { stories } from "@/server/db/schema";

export async function createStory(data: {
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  imageKey: string;
  publish: boolean;
  featured: boolean;
}): Promise<{
  success: boolean;
  message: string;
  data?: Story;
}> {
  try {
    const sanitizedContentEn = DOMPurify.sanitize(data.contentEn, {
      ALLOWED_TAGS: ["p", "b", "i", "em", "strong", "u", "ul", "ol", "li"],
      ALLOWED_ATTR: [], // No attributes allowed
    });
    const sanitizedContentAr = DOMPurify.sanitize(data.contentAr, {
      ALLOWED_TAGS: ["p", "b", "i", "em", "strong", "u", "ul", "ol", "li"],
      ALLOWED_ATTR: [], // No attributes allowed
    });
    const [newStory] = await db
      .insert(stories)
      .values({
        titleEn: data.titleEn,
        titleAr: data.titleAr,
        contentEn: sanitizedContentEn,
        contentAr: sanitizedContentAr,
        descriptionEn: data.descriptionEn,
        descriptionAr: data.descriptionAr,
        imageUrl: data.imageUrl,
        imageKey: data.imageKey,
        publish: data.publish,
        featured: data.featured,
      })
      .returning();
    // Revalidate the listings page to show the new listing
    revalidateTag("stories");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/stories");
    revalidatePath("/admin/stories");
    return {
      success: true,
      message: "Story created successfully",
      data: newStory,
    };
  } catch (error) {
    console.error("Error creating story:", error);

    return {
      success: false,
      message: "Failed to create story",
    };
  }
}
