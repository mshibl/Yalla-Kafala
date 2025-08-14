"use server";
import type { FAQ } from "@/lib/types";
import { db } from "@/server/db";
import { faqs } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import DOMPurify from "isomorphic-dompurify";

export async function updateFaq(data: {
  id: number;
  questionEn?: string;
  questionAr?: string;
  answerEn?: string;
  answerAr?: string;
  publish?: boolean;
  featured?: boolean;
}): Promise<{
  success: boolean;
  message: string;
  data?: FAQ;
}> {
  try {
    const sanitizedAnswerEn = data.answerEn
      ? DOMPurify.sanitize(data.answerEn, {
          ALLOWED_TAGS: ["p", "b", "i", "em", "strong", "u", "ul", "ol", "li"],
          ALLOWED_ATTR: [], // No attributes allowed
        })
      : undefined;
    const sanitizedAnswerAr = data.answerAr
      ? DOMPurify.sanitize(data.answerAr, {
          ALLOWED_TAGS: ["p", "b", "i", "em", "strong", "u", "ul", "ol", "li"],
          ALLOWED_ATTR: [], // No attributes allowed
        })
      : undefined;
    const [updatedFaq] = await db
      .update(faqs)
      .set({
        questionEn: data.questionEn,
        questionAr: data.questionAr,
        answerEn: sanitizedAnswerEn,
        answerAr: sanitizedAnswerAr,
        publish: data.publish,
        featured: data.featured,
      })
      .where(eq(faqs.id, data.id))
      .returning();
    // Revalidate the faqs page to show the new listing
    revalidateTag("faqs");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/faqs");
    revalidatePath("/admin/faqs");
    return {
      success: true,
      message: "FAQ updated successfully",
      data: updatedFaq,
    };
  } catch (error) {
    console.error("Error updating FAQ:", error);

    return {
      success: false,
      message: "Failed to update FAQ",
    };
  }
}
