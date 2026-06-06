import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const syncFacebookPosts = mutation({
  args: {
    secret: v.string(),
    postsToInsert: v.array(
      v.object({
        id: v.string(),
        image: v.string(),
        contentEn: v.string(),
        contentAr: v.string(),
        date: v.string(),
        likes: v.float64(),
        comments: v.float64(),
        shares: v.float64(),
        permalink: v.string(),
      })
    ),
    idsToRemove: v.array(v.string()),
    imagesToUpdate: v.array(
      v.object({
        id: v.string(),
        image: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const expectedSecret = process.env.INTERNAL_SYNC_SECRET || "yallakafala-default-secret-2026";
    if (args.secret !== expectedSecret) {
      throw new Error("Unauthorized: Invalid secret token");
    }
    // 1. Remove outdated posts
    for (const fbId of args.idsToRemove) {
      const existing = await ctx.db
        .query("facebookPosts")
        .withIndex("by_fbId", (q) => q.eq("id", fbId))
        .first();
      if (existing) {
        await ctx.db.delete(existing._id);
      }
    }

    // 2. Update changed images
    for (const item of args.imagesToUpdate) {
      const existing = await ctx.db
        .query("facebookPosts")
        .withIndex("by_fbId", (q) => q.eq("id", item.id))
        .first();
      if (existing && existing.image !== item.image) {
        await ctx.db.patch(existing._id, { image: item.image });
      }
    }

    // 3. Insert new posts
    for (const post of args.postsToInsert) {
      await ctx.db.insert("facebookPosts", post);
    }
  },
});
