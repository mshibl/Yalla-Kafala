import type { BoardMember } from "@/lib/types";
import { z } from "zod";

export interface AddNewBoardMember extends Omit<BoardMember, "id"> {
  file: File;
}

export interface EditNewBoardMember extends Omit<BoardMember, "id"> {
  file?: File;
}

export const addBoardMemberFormSchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  bioEn: z.string().min(1, "English bio is required"),
  bioAr: z.string().min(1, "Arabic bio is required"),
  file: z.instanceof(File, { message: "Image is required" }),
  type: z.enum(["board", "advisor"]),
  country: z.enum(["egypt", "usa", "all"]),
  publish: z.boolean(),
});

export type AddBoardMembersFormValues = z.infer<
  typeof addBoardMemberFormSchema
>;

export const editBoardMemberFormSchema = addBoardMemberFormSchema.partial();

export type EditBoardMembersFormValues = z.infer<
  typeof editBoardMemberFormSchema
>;
