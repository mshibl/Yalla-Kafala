import type { FAQ } from "@/lib/types";
import { z } from "zod";

export interface AddNewFaq {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  publish: boolean;
  featured: boolean;
}

export interface UpdateFaq extends AddNewFaq {
  id: number;
}

export interface FaqCardProps {
  faq: FAQ;
  onUpdate: (updatedFaq: UpdateFaq) => Promise<void>;
  onDelete: (faqId: number) => Promise<void>;
  showArabic: boolean;
}

export interface AddFaqDialogProps {
  onAddFaq: (newFaq: AddNewFaq) => Promise<void>;
}

export interface EditFaqDialogProps {
  faq: FAQ;
  onUpdate: (updatedFaq: UpdateFaq) => Promise<void>;
}

export const FaqFormSchema = z.object({
  questionEn: z.string().min(1, "English question is required"),
  questionAr: z.string().min(1, "Arabic question is required"),
  answerEn: z.string().min(1, "English answer is required"),
  answerAr: z.string().min(1, "Arabic answer is required"),
  publish: z.boolean(),
  featured: z.boolean(),
});

export type FaqFormValues = z.infer<typeof FaqFormSchema>;
