import type { CarouselImage } from "@/lib/types";
import { db } from "@/server/db";
import { unstable_cache as Cache } from "next/cache";

export const fetchCarouselImages = Cache(async (): Promise<{
  success: boolean;
  data?: CarouselImage[];
  message?: string;
}> => {
  try {
    // Validate the input

    // Fetch listings with optional filtering
    const carouselImages = await db.query.carouselImages.findMany({
      orderBy: (carouselImages, { asc }) => [asc(carouselImages.order)],
    });

    return {
      success: true,
      data: carouselImages,
      message: "Carousel images fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching carousel images:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch carousel images",
    };
  }
}, ["carousel-images"]);
