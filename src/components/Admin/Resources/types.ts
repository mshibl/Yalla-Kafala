import { z } from "zod";
import type { Resource } from "@/lib/types";

export interface AddNewResource {
  nameEn: string;
  nameAr: string;
  file: File;
}

export interface EditResource extends Omit<Resource, "id"> {
  file?: File;
}

export const addResourceFormSchema = z
  .object({
    nameEn: z.string().min(1, "English name is required"),
    nameAr: z.string().min(1, "Arabic name is required"),
    file: z.instanceof(File, { message: "File is required" }),
  });

export type AddResourceFormValues = z.infer<typeof addResourceFormSchema>;

export const editResourceFormSchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  file: z.instanceof(File).optional(),
});

export type EditResourceFormValues = z.infer<typeof editResourceFormSchema>;
