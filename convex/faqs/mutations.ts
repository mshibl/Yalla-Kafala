import type { Id } from "../_generated/dataModel";
import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createFaq = mutation({
  args: {
    questionEn: v.string(),
    questionAr: v.string(),
    answerEn: v.string(),
    answerAr: v.string(),
    publish: v.boolean(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const faqId = await ctx.db.insert("faqs", args);
    return faqId;
  },
});

export const updateFaq = mutation({
  args: {
    id: v.string(),
    questionEn: v.string(),
    questionAr: v.string(),
    answerEn: v.string(),
    answerAr: v.string(),
    publish: v.boolean(),
    featured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const { id, ...rest } = args;
    await ctx.db.patch(id as Id<"faqs">, rest);
  },
});

export const deleteFaq = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    await ctx.db.delete(args.id as Id<"faqs">);
  },
});
