import { query } from "../_generated/server";
import { v } from "convex/values";

export const getFaqs = query({
  args: {
    publishedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let faqsQuery = ctx.db.query("faqs");
    const faqs = await faqsQuery.collect();

    let filtered = faqs;
    if (args.publishedOnly) {
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
