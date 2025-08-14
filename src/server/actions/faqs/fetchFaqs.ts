import type { FAQ } from "@/lib/types";
import { db } from "@/server/db";
import { unstable_cache as Cache } from "next/cache";

export const fetchFaqs = Cache(
  async ({
    featured,
    publishedOnly,
  }: {
    featured?: boolean;
    publishedOnly?: boolean;
  } = {}): Promise<{
    success: boolean;
    data?: FAQ[];
    message?: string;
  }> => {
    try {
      // Fetch faqs with optional filtering
      const faqs = await db.query.faqs.findMany({
        orderBy: (faqs, { asc }) => [asc(faqs.id)],
        where: (faqs, { and, eq }) =>
          and(
            featured ? eq(faqs.featured, true) : undefined,
            publishedOnly ? eq(faqs.publish, true) : undefined,
          ),
        limit: featured ? 5 : undefined,
      });

      return {
        success: true,
        data: faqs,
        message: "FAQs fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch FAQs",
      };
    }
  },
  ["faqs"],
);
