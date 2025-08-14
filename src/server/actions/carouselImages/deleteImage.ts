"use server";

import type { CarouselImage } from "@/lib/types";
import { db } from "@/server/db";
import { carouselImages } from "@/server/db/schema";
import { utapi } from "@/server/uploadThing";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteCarouselImage(id: number): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const [deletedImage] = await db
      .delete(carouselImages)
      .where(eq(carouselImages.id, id))
      .returning();
    if (!deletedImage) {
      return {
        success: false,
        message: "Image not found",
      };
    }
    // delete the old image
    await utapi.deleteFiles(deletedImage.uploadthingKey);

    // Revalidate the listings page to show the new listing
    revalidateTag("carousel-images");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/admin/carousel");
    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting image:", error);

    return {
      success: false,
      message: "Failed to delete image",
    };
  }
}
