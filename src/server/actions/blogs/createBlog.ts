"use server";

import type { Blog } from "@/lib/types";
import { db } from "@/server/db";
import { revalidatePath, revalidateTag } from "next/cache";
import DOMPurify from "isomorphic-dompurify";
import { stories } from "@/server/db/schema";

export async function createBlog(data: {
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
  data?: Blog;
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
    const [newBlog] = await db
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
    revalidateTag("blogs");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/blogs");
    revalidatePath("/admin/blogs");
    return {
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    };
  } catch (error) {
    console.error("Error creating blog:", error);

    return {
      success: false,
      message: "Failed to create blog",
    };
  }
}
