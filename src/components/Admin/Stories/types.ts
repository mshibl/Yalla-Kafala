import type { Story } from "@/lib/types";
import { z } from "zod";

export interface AddNewStory {
  titleEn: string;
  titleAr: string;
  contentEn: string;
  contentAr: string;
  descriptionEn: string;
  descriptionAr: string;
  file: File;
  publish: boolean;
  featured: boolean;
}

export interface UpdateStory extends Omit<AddNewStory, "file"> {
  id: number;
  file?: File;
}

export interface StoryCardProps {
  story: Story;
  onUpdate: (updatedStory: UpdateStory) => Promise<void>;
  onDelete: (storyId: number) => Promise<void>;
  showArabic: boolean;
}

export interface AddStoryDialogProps {
  onAddStory: (newStory: AddNewStory) => Promise<void>;
}

export interface EditStoryDialogProps {
  story: Story;
  onUpdate: (updatedStory: UpdateStory) => Promise<void>;
}

export const addStoryFormSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleAr: z.string().min(1, "Arabic title is required"),
  contentEn: z.string().min(1, "English content is required"),
  contentAr: z.string().min(1, "Arabic content is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  descriptionAr: z.string().min(1, "Arabic description is required"),
  file: z.instanceof(File, { message: "Image is required" }),
  publish: z.boolean(),
  featured: z.boolean(),
});

export type AddStoryFormValues = z.infer<typeof addStoryFormSchema>;

export const editStoryFormSchema = z.object({
  titleEn: z.string().min(1, "English title is required"),
  titleAr: z.string().min(1, "Arabic title is required"),
  contentEn: z.string().min(1, "English content is required"),
  contentAr: z.string().min(1, "Arabic content is required"),
  descriptionEn: z.string().min(1, "English description is required"),
  descriptionAr: z.string().min(1, "Arabic description is required"),
  file: z.instanceof(File, { message: "Image is required" }).optional(),
  publish: z.boolean(),
  featured: z.boolean(),
});

export type EditStoryFormValues = z.infer<typeof editStoryFormSchema>;
