"use server";
import { db } from "@/server/db";
import { stories } from "@/server/db/schema";
import { utapi } from "@/server/uploadThing";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteStory(id: number): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const [deletedImage] = await db
      .delete(stories)
      .where(eq(stories.id, id))
      .returning();
    if (!deletedImage) {
      return {
        success: false,
        message: "Story not found",
      };
    }
    await utapi.deleteFiles(deletedImage.imageKey);

    // Revalidate the listings page to show the new listing
    revalidateTag("stories");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/stories");
    revalidatePath("/admin/stories");
    return {
      success: true,
      message: "Story deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting story:", error);

    return {
      success: false,
      message: "Failed to delete story",
    };
  }
}
