import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  boardMembers: defineTable({
    publish: v.boolean(),
    nameEn: v.string(),
    nameAr: v.string(),
    imageUrl: v.optional(v.string()),
    imageKey: v.optional(v.string()),
    bioEn: v.string(),
    bioAr: v.string(),
    type: v.union(v.literal("board"), v.literal("advisor")),
    country: v.union(v.literal("egypt"), v.literal("usa"), v.literal("all")),
  }),
  resources: defineTable({
    nameEn: v.string(),
    nameAr: v.string(),
    slug: v.string(),
    link: v.string(),
    uploadthingKey: v.string(),
  }).index("by_slug", ["slug"]),

  // Custom User Profile table mapped to Clerk IDs
  userProfiles: defineTable({
    userId: v.string(), // Clerk user ID (e.g. "user_...")
    profileApproved: v.boolean(),
  }).index("by_userId", ["userId"]),

  carouselImages: defineTable({
    uploadthingKey: v.string(),
    src: v.string(),
    captionEn: v.optional(v.string()),
    captionAr: v.optional(v.string()),
    altDescription: v.string(),
    order: v.float64(),
  }).index("by_order", ["order"]),

  faqs: defineTable({
    questionEn: v.string(),
    questionAr: v.string(),
    answerEn: v.string(),
    answerAr: v.string(),
    publish: v.boolean(),
    featured: v.boolean(),
  }),

  stories: defineTable({
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
  }),

  facebookPosts: defineTable({
    id: v.string(), // FB post ID
    image: v.string(),
    contentEn: v.string(),
    contentAr: v.string(),
    date: v.string(),
    likes: v.float64(),
    comments: v.float64(),
    shares: v.float64(),
    permalink: v.string(),
  })
    .index("by_fbId", ["id"])
    .index("by_date", ["date"]),

  emailSubscribers: defineTable({
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
  }).index("by_email", ["email"]),
});
