import { query } from "../_generated/server";
import { v } from "convex/values";
import type { Resource } from "../../src/lib/types";

export const getResources = query({
  handler: async (ctx): Promise<Resource[]> => {
    const resources = await ctx.db.query("resources").collect();

    return resources
      .map((resource) => ({
        id: resource._id.toString(),
        ...resource,
      }))
      .sort((a, b) => a.nameEn.localeCompare(b.nameEn));
  },
});

export const getResourceBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args): Promise<Resource | null> => {
    const resource = await ctx.db
      .query("resources")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!resource) {
      return null;
    }

    return {
      id: resource._id.toString(),
      ...resource,
    };
  },
});
