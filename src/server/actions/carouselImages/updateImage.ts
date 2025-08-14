"use server";

import type { CarouselImage } from "@/lib/types";
import { db } from "@/server/db";
import { carouselImages } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { utapi } from "@/server/uploadThing";

export async function updateCarouselImage(data: {
  id: number;
  uploadthingKey?: string;
  src?: string;
  captionEn?: string;
  captionAr?: string;
  altDescription?: string;
  order?: number;
}): Promise<{
  success: boolean;
  message: string;
  data?: CarouselImage;
}> {
  try {
    if (data.src && data.uploadthingKey) {
      // if a new image is provided, delete the old one
      const currentImage = await db.query.carouselImages.findFirst({
        where: eq(carouselImages.id, data.id),
      });

      if (!currentImage) {
        return { success: false, message: "Image not found" };
      }
      if (currentImage.src !== data.src) {
        // delete the old image
        await utapi.deleteFiles(currentImage.uploadthingKey);
      }
    }

    const [updatedImage] = await db
      .update(carouselImages)
      .set({
        uploadthingKey: data.uploadthingKey,
        src: data.src,
        captionEn: data.captionEn,
        captionAr: data.captionAr,
        altDescription: data.altDescription,
        order: data.order,
      })
      .where(eq(carouselImages.id, data.id))
      .returning();
    // Revalidate the listings page to show the new listing
    revalidateTag("carousel-images");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/admin/carousel");
    return {
      success: true,
      message: "Image updated successfully",
      data: updatedImage,
    };
  } catch (error) {
    console.error("Error updating image:", error);

    return {
      success: false,
      message: "Failed to update image",
    };
  }
}
