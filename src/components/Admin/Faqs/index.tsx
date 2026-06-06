"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddFaqDialog } from "./AddFaq";
import { FaqCard } from "./FaqCard";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { AddNewFaq, UpdateFaq } from "./types";
import { Button } from "@/components/ui/button";
import { Languages, Loader2 } from "lucide-react";
import { revalidateFaqs } from "@/server/actions/revalidate";

const FaqsManagement = () => {
  const faqs = useQuery(api.faqs.queries.getFaqs, { publishedOnly: false });
  const [showArabic, setShowArabic] = useState(false);

  const createFaq = useMutation(api.faqs.mutations.createFaq);
  const updateFaq = useMutation(api.faqs.mutations.updateFaq);
  const deleteFaq = useMutation(api.faqs.mutations.deleteFaq);

  const handleCreateFaq = async (newFaq: AddNewFaq) => {
    try {
      await createFaq(newFaq);
      await revalidateFaqs();
      toast.success("FAQ added successfully");
    } catch (error) {
      console.error("Error creating FAQ:", error);
      toast.error("Failed to add FAQ");
    }
  };

  const handleUpdateFaq = async (updatedFaq: UpdateFaq) => {
    try {
      await updateFaq({
        id: updatedFaq.id,
        questionEn: updatedFaq.questionEn,
        questionAr: updatedFaq.questionAr,
        answerEn: updatedFaq.answerEn,
        answerAr: updatedFaq.answerAr,
        publish: updatedFaq.publish,
        featured: updatedFaq.featured,
      });
      await revalidateFaqs();
      toast.success("FAQ updated successfully");
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Failed to update FAQ");
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    try {
      await deleteFaq({ id: faqId });
      await revalidateFaqs();
      toast.success("FAQ deleted successfully");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ");
    }
  };

  if (!faqs) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-4">
            FAQs
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowArabic(!showArabic)}
            >
              <Languages className="h-4 w-4" />
              {showArabic ? "Show English" : "Show Arabic"}
            </Button>
          </CardTitle>
          <AddFaqDialog onAddFaq={handleCreateFaq} />
        </div>
        <CardDescription>
          Manage the frequently asked questions that appear on the website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {faqs.map((faq) => (
            <FaqCard
              key={faq.id}
              faq={faq}
              onUpdate={handleUpdateFaq}
              onDelete={handleDeleteFaq}
              showArabic={showArabic}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <p className="text-sm text-gray-500">Total FAQs: {faqs.length}</p>
      </CardFooter>
    </Card>
  );
};

export default FaqsManagement;
