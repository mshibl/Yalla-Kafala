import { query } from "../_generated/server";

export const getCarouselImages = query({
  handler: async (ctx) => {
    const images = await ctx.db
      .query("carouselImages")
      .withIndex("by_order")
      .collect();
    
    // Map internal Convex _id to string id to match the expected schema/types in nextjs
    return images.map(img => ({
      id: img._id.toString(),
      uploadthingKey: img.uploadthingKey,
      src: img.src,
      captionEn: img.captionEn,
      captionAr: img.captionAr,
      altDescription: img.altDescription,
      order: img.order,
    }));
  },
});
