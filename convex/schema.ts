import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  boardMembers: defineTable({
    nameEn: v.string(),
    nameAr: v.string(),
    imageUrl: v.optional(v.string()),
    imageKey: v.optional(v.string()),
    bioEn: v.string(),
    bioAr: v.string(),
    type: v.union(v.literal("board"), v.literal("advisor")),
    country: v.union(v.literal("egypt"), v.literal("usa"), v.literal("all")),
  }),
});
