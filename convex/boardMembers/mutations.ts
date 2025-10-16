import type { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createBoardMember = mutation({
  args: {
    publish: v.boolean(),
    nameEn: v.string(),
    nameAr: v.string(),
    imageUrl: v.string(),
    imageKey: v.string(),
    bioEn: v.string(),
    bioAr: v.string(),
    type: v.union(v.literal("board"), v.literal("advisor")),
    country: v.union(v.literal("egypt"), v.literal("usa"), v.literal("all")),
  },
  handler: async (ctx, args) => {
    const boardMemberId = await ctx.db.insert("boardMembers", args);
    return boardMemberId;
  },
});

export const updateBoardMember = mutation({
  args: {
    id: v.string(),
    publish: v.boolean(),
    nameEn: v.string(),
    nameAr: v.string(),
    imageUrl: v.optional(v.string()),
    imageKey: v.optional(v.string()),
    bioEn: v.string(),
    bioAr: v.string(),
    type: v.union(v.literal("board"), v.literal("advisor")),
    country: v.union(v.literal("egypt"), v.literal("usa"), v.literal("all")),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id as Id<"boardMembers">, rest);
  },
});

export const deleteBoardMember = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id as Id<"boardMembers">);
  },
});
