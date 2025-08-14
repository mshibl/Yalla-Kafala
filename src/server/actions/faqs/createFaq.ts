"use server";

import type { FAQ } from "@/lib/types";
import { db } from "@/server/db";
import { faqs } from "@/server/db/schema";
import { revalidatePath, revalidateTag } from "next/cache";
import DOMPurify from "isomorphic-dompurify";

export async function createFaq(data: {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  publish: boolean;
  featured: boolean;
}): Promise<{
  success: boolean;
  message: string;
  data?: FAQ;
}> {
  try {
    const sanitizedAnswerEn = DOMPurify.sanitize(data.answerEn, {
      ALLOWED_TAGS: ["p", "b", "i", "em", "strong", "u", "ul", "ol", "li"],
      ALLOWED_ATTR: [], // No attributes allowed
    });
    const sanitizedAnswerAr = DOMPurify.sanitize(data.answerAr, {
      ALLOWED_TAGS: ["p", "b", "i", "em", "strong", "u", "ul", "ol", "li"],
      ALLOWED_ATTR: [], // No attributes allowed
    });
    const [newFaq] = await db
      .insert(faqs)
      .values({
        questionEn: data.questionEn,
        questionAr: data.questionAr,
        answerEn: sanitizedAnswerEn,
        answerAr: sanitizedAnswerAr,
        publish: data.publish,
        featured: data.featured,
      })
      .returning();
    // Revalidate the faqs page to show the new listing
    revalidateTag("faqs");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/faqs");
    revalidatePath("/admin/faqs");
    return {
      success: true,
      message: "FAQ created successfully",
      data: newFaq,
    };
  } catch (error) {
    console.error("Error creating FAQ:", error);

    return {
      success: false,
      message: "Failed to create FAQ",
    };
  }
}
