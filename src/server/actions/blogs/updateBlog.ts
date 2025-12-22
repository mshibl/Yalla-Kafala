"use server";

import type { Blog } from "@/lib/types";
import { db } from "@/server/db";
import { stories } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import DOMPurify from "isomorphic-dompurify";
import { utapi } from "@/server/uploadThing";

export async function updateBlog(data: {
  id: number;
  titleEn?: string;
  titleAr?: string;
  contentEn?: string;
  contentAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  imageUrl?: string;
  imageKey?: string;
  publish?: boolean;
  featured?: boolean;
}): Promise<{
  success: boolean;
  message: string;
  data?: Blog;
}> {
  try {
    const sanitizedContentEn = data.contentEn
      ? DOMPurify.sanitize(data.contentEn, {
          ALLOWED_TAGS: ["p", "b", "i", "em", "strong", "u", "ul", "ol", "li"],
          ALLOWED_ATTR: [], // No attributes allowed
        })
      : undefined;
    const sanitizedContentAr = data.contentAr
      ? DOMPurify.sanitize(data.contentAr, {
          ALLOWED_TAGS: ["p", "b", "i", "em", "strong", "u", "ul", "ol", "li"],
          ALLOWED_ATTR: [], // No attributes allowed
        })
      : undefined;

    if (data.imageUrl && data.imageKey) {
      // if a new image is provided, delete the old one
      const currentBlog = await db.query.stories.findFirst({
        where: eq(stories.id, data.id),
      });

      if (!currentBlog) {
        return { success: false, message: "Blog not found" };
      }
      if (currentBlog.imageUrl !== data.imageUrl) {
        // delete the old image
        await utapi.deleteFiles(currentBlog.imageKey);
      }
    }
    const [updatedBlog] = await db
      .update(stories)
      .set({
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
      .where(eq(stories.id, data.id))
      .returning();
    // Revalidate the listings page to show the new listing
    revalidateTag("blogs");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/blogs");
    revalidatePath("/admin/blogs");
    return {
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    };
  } catch (error) {
    console.error("Error updating Blog:", error);

    return {
      success: false,
      message: "Failed to update Blog",
    };
  }
}
