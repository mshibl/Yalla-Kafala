"use server";

import { revalidatePath } from "next/cache";

/**
 * Revalidate FAQ routes (Homepage and FAQs page)
 */
export async function revalidateFaqs() {
  try {
    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/faqs", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate FAQs:", error);
    return { success: false };
  }
}

/**
 * Revalidate Carousel routes (Homepage)
 */
export async function revalidateCarousel() {
  try {
    revalidatePath("/[locale]", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate Carousel:", error);
    return { success: false };
  }
}

/**
 * Revalidate Resources page
 */
export async function revalidateResources() {
  try {
    revalidatePath("/[locale]/resources", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate Resources:", error);
    return { success: false };
  }
}

/**
 * Revalidate Blog routes (Homepage, Blog listing, and Blog details)
 */
export async function revalidateBlog(blogId?: string) {
  try {
    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/kafala-blogs", "page");
    revalidatePath("/[locale]/kafala-articles", "page");
    if (blogId) {
      // Revalidate both locales and both routes: the story's category may have just changed.
      for (const route of ["kafala-blogs", "kafala-articles"]) {
        revalidatePath(`/en/${route}/${blogId}`, "page");
        revalidatePath(`/ar/${route}/${blogId}`, "page");
      }
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate Blog:", error);
    return { success: false };
  }
}
