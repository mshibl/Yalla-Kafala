"use server";

import type { CarouselImage } from "@/lib/types";
import { db } from "@/server/db";
import { carouselImages } from "@/server/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";

export async function createCarouselImage(data: {
  uploadthingKey: string;
  src: string;
  captionEn?: string;
  captionAr?: string;
  altDescription?: string;
  order: number;
}): Promise<{
  success: boolean;
  message: string;
  data?: CarouselImage;
}> {
  try {
    const [newImage] = await db
      .insert(carouselImages)
      .values({
        uploadthingKey: data.uploadthingKey,
        src: data.src,
        captionEn: data.captionEn,
        captionAr: data.captionAr,
        altDescription: data.altDescription || "Carousel Image",
        order: data.order,
      })
      .returning();
    // Revalidate the listings page to show the new listing
    revalidateTag("carousel-images");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/admin/carousel");
    return {
      success: true,
      message: "Image created successfully",
      data: newImage,
    };
  } catch (error) {
    console.error("Error creating image:", error);

    return {
      success: false,
      message: "Failed to create carousel image",
    };
  }
}
