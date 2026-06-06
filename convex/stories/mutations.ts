import type { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createStory = mutation({
  args: {
    titleEn: v.string(),
    titleAr: v.string(),
    contentEn: v.string(),
    contentAr: v.string(),
    descriptionEn: v.string(),
    descriptionAr: v.string(),
    imageUrl: v.string(),
    imageKey: v.string(),
    publish: v.boolean(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const storyId = await ctx.db.insert("stories", args);
    return storyId;
  },
});

export const updateStory = mutation({
  args: {
    id: v.string(),
    titleEn: v.string(),
    titleAr: v.string(),
    contentEn: v.string(),
    contentAr: v.string(),
    descriptionEn: v.string(),
    descriptionAr: v.string(),
    imageUrl: v.string(),
    imageKey: v.string(),
    publish: v.boolean(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const { id, ...rest } = args;
    await ctx.db.patch(id as Id<"stories">, rest);
  },
});

export const deleteStory = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    await ctx.db.delete(args.id as Id<"stories">);
  },
});
