"use server";

import { db } from "@/server/db";
import { faqs } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteFaq(id: number): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const [deletedImage] = await db
      .delete(faqs)
      .where(eq(faqs.id, id))
      .returning();
    if (!deletedImage) {
      return {
        success: false,
        message: "FAQ not found",
      };
    }

    // Revalidate the faqs page to show the new listing
    revalidateTag("faqs");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/faqs");
    revalidatePath("/admin/faqs");
    return {
      success: true,
      message: "FAQ deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting FAQ:", error);

    return {
      success: false,
      message: "Failed to delete FAQ",
    };
  }
}
