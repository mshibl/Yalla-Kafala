"use server";

import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";
import { utapi } from "@/server/uploadThing";

export async function deleteResource(
  id: string,
  uploadthingKey: string,
): Promise<{ success: boolean; message: string }> {
  try {
    await utapi.deleteFiles(uploadthingKey);
    await fetchMutation(api.resources.mutations.deleteResource, { id });
    return { success: true, message: "Resource deleted successfully" };
  } catch (error) {
    console.error("Error deleting resource:", error);
    return { success: false, message: "Failed to delete resource" };
  }
}
