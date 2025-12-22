import type { Blog } from "@/lib/types";
import { z } from "zod";

export interface AddNewBlog {
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

export interface UpdateBlog extends Omit<AddNewBlog, "file"> {
  id: number;
  file?: File;
}

export interface BlogCardProps {
  blog: Blog;
  onUpdate: (updatedBlog: UpdateBlog) => Promise<void>;
  onDelete: (blogId: number) => Promise<void>;
  showArabic: boolean;
}

export interface AddBlogDialogProps {
  onAddBlog: (newBlog: AddNewBlog) => Promise<void>;
}

export interface EditBlogDialogProps {
  blog: Blog;
  onUpdate: (updatedBlog: UpdateBlog) => Promise<void>;
}

export const addBlogFormSchema = z.object({
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

export type AddBlogFormValues = z.infer<typeof addBlogFormSchema>;

export const editBlogFormSchema = z.object({
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

export type EditBlogFormValues = z.infer<typeof editBlogFormSchema>;
