import type { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createCarouselImage = mutation({
  args: {
    uploadthingKey: v.string(),
    src: v.string(),
    captionEn: v.optional(v.string()),
    captionAr: v.optional(v.string()),
    altDescription: v.string(),
    order: v.float64(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const id = await ctx.db.insert("carouselImages", args);
    return id;
  },
});

export const updateCarouselImage = mutation({
  args: {
    id: v.string(),
    uploadthingKey: v.string(),
    src: v.string(),
    captionEn: v.optional(v.string()),
    captionAr: v.optional(v.string()),
    altDescription: v.string(),
    order: v.float64(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const { id, ...rest } = args;
    await ctx.db.patch(id as Id<"carouselImages">, rest);
  },
});

export const deleteCarouselImage = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    await ctx.db.delete(args.id as Id<"carouselImages">);
  },
});
