import { query } from "../_generated/server";
import { v } from "convex/values";

export const getFaqs = query({
  args: {
    publishedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let faqsQuery = ctx.db.query("faqs");
    const faqs = await faqsQuery.collect();

    // Unpublished FAQs are for signed-in admins only.
    const identity = await ctx.auth.getUserIdentity();
    let filtered = faqs;
    if (args.publishedOnly || identity === null) {
      filtered = faqs.filter(faq => faq.publish);
    }

    return filtered.map(faq => ({
      id: faq._id.toString(),
      questionEn: faq.questionEn,
      questionAr: faq.questionAr,
      answerEn: faq.answerEn,
      answerAr: faq.answerAr,
      publish: faq.publish,
      featured: faq.featured,
    }));
  },
});
