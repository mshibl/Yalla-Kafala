"use server";
import { db } from "@/server/db";
import { stories } from "@/server/db/schema";
import { utapi } from "@/server/uploadThing";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteBlog(id: number): Promise<{
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
        message: "Blog not found",
      };
    }
    await utapi.deleteFiles(deletedImage.imageKey);

    // Revalidate the listings page to show the new listing
    revalidateTag("blogs");
    revalidatePath("/en");
    revalidatePath("/ar");
    revalidatePath("/blogs");
    revalidatePath("/admin/blogs");
    return {
      success: true,
      message: "Blog deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting blog:", error);

    return {
      success: false,
      message: "Failed to delete blog",
    };
  }
}
