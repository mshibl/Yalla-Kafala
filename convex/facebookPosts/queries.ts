import { query } from "../_generated/server";
import { v } from "convex/values";

export const getFacebookPosts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("facebookPosts")
      .withIndex("by_date")
      .order("desc")
      .collect();
    
    const limit = args.limit || 4;
    return posts.slice(0, limit).map(p => ({
      id: p.id,
      image: p.image,
      contentEn: p.contentEn,
      contentAr: p.contentAr,
      date: p.date,
      likes: p.likes,
      comments: p.comments,
      shares: p.shares,
      permalink: p.permalink,
    }));
  },
});
