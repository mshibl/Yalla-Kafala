import type { Id } from "../_generated/dataModel";
import { mutation, type MutationCtx } from "../_generated/server";
import { v } from "convex/values";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const getUniqueSlug = async (ctx: MutationCtx, base: string) => {
  let candidate = base || "resource";
  let suffix = 1;

  while (true) {
    const existing = await ctx.db
      .query("resources")
      .withIndex("by_slug", (q) => q.eq("slug", candidate))
      .first();

    if (!existing) {
      return candidate;
    }

    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
};

export const createResource = mutation({
  args: {
    nameEn: v.string(),
    nameAr: v.string(),
    link: v.string(),
    uploadthingKey: v.string(),
  },
  handler: async (ctx, args) => {
    const baseSlug = slugify(args.nameEn);
    const slug = await getUniqueSlug(ctx, baseSlug);
    const resourceId = await ctx.db.insert("resources", {
      ...args,
      slug,
    });
    return resourceId;
  },
});

export const updateResource = mutation({
  args: {
    id: v.string(),
    nameEn: v.string(),
    nameAr: v.string(),
    link: v.string(),
    uploadthingKey: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const existing = await ctx.db.get(id as Id<"resources">);

    if (!existing) {
      return;
    }

    let nextSlug = existing.slug;
    if (existing.nameEn !== rest.nameEn) {
      const baseSlug = slugify(rest.nameEn);
      nextSlug = await getUniqueSlug(ctx, baseSlug);
    }

    await ctx.db.patch(id as Id<"resources">, {
      ...rest,
      slug: nextSlug,
    });
  },
});

export const deleteResource = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id as Id<"resources">);
  },
});
