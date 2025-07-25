import { z } from "zod";

export interface AddNewCarouselImage {
  file: File;
  captionEn?: string;
  captionAr?: string;
  altDescription?: string;
  order: number;
}

export interface UpdateCarouselImage {
  id: number;
  file?: File;
  captionEn?: string;
  captionAr?: string;
  altDescription?: string;
  order?: number;
}

// Define form schema with zod
export const CarouselImageFormSchema = z.object({
  image: z.instanceof(File, { message: "Image is required" }),
  captionEn: z.string().optional(),
  captionAr: z.string().optional(),
  altDescription: z.string().optional(),
  order: z.coerce
    .number()
    .int()
    .positive({ message: "Order must be a positive number" }),
});

export type CarouselImageFormValues = z.infer<typeof CarouselImageFormSchema>;
