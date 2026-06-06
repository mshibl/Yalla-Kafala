import { query } from "../_generated/server";
import { v } from "convex/values";
import type { Id } from "../_generated/dataModel";

export const getStories = query({
  args: {
    featuredOnly: v.optional(v.boolean()),
    publishedOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let stories = await ctx.db.query("stories").order("desc").collect();

    let filtered = stories;
    if (args.publishedOnly) {
      filtered = filtered.filter(s => s.publish);
    }
    if (args.featuredOnly) {
      filtered = filtered.filter(s => s.featured);
    }

    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    return filtered.map(story => ({
      id: story._id.toString(),
      titleEn: story.titleEn,
      titleAr: story.titleAr,
      contentEn: story.contentEn,
      contentAr: story.contentAr,
      descriptionEn: story.descriptionEn,
      descriptionAr: story.descriptionAr,
      imageUrl: story.imageUrl,
      imageKey: story.imageKey,
      publish: story.publish,
      featured: story.featured,
      createdAt: new Date(story._creationTime).toISOString(),
      updatedAt: new Date(story._creationTime).toISOString(),
    }));
  },
});

export const getStoryById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const story = await ctx.db.get(args.id as Id<"stories">);
      if (!story) return null;

      return {
        id: story._id.toString(),
        titleEn: story.titleEn,
        titleAr: story.titleAr,
        contentEn: story.contentEn,
        contentAr: story.contentAr,
        descriptionEn: story.descriptionEn,
        descriptionAr: story.descriptionAr,
        imageUrl: story.imageUrl,
        imageKey: story.imageKey,
        publish: story.publish,
        featured: story.featured,
        createdAt: new Date(story._creationTime).toISOString(),
        updatedAt: new Date(story._creationTime).toISOString(),
      };
    } catch {
      return null;
    }
  },
});

export const getStoryIds = query({
  handler: async (ctx) => {
    const stories = await ctx.db.query("stories").collect();
    return stories.map(s => ({ id: s._id.toString() }));
  },
});
