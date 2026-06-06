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
    if (blogId) {
      // Revalidate both locales for the specific blog ID
      revalidatePath(`/en/kafala-blogs/${blogId}`, "page");
      revalidatePath(`/ar/kafala-blogs/${blogId}`, "page");
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to revalidate Blog:", error);
    return { success: false };
  }
}
