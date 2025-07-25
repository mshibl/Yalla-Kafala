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
import { type FAQ } from "@/lib/types";
import { toast } from "sonner";
import { createFaq } from "@/server/actions/faqs/createFaq";
import { deleteFaq } from "@/server/actions/faqs/deleteFaq";
import { updateFaq } from "@/server/actions/faqs/updateFaq";
import type { AddNewFaq, UpdateFaq } from "./types";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

const FaqsManagement = ({ faqs: initialFaqs }: { faqs: FAQ[] }) => {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs);
  const [showArabic, setShowArabic] = useState(false);

  const handleCreateFaq = async (newFaq: AddNewFaq) => {
    const result = await createFaq(newFaq);
    if (!result.success || !result.data) {
      toast.error("Failed to add FAQ");
      return;
    }
    setFaqs([...faqs, result.data]);
    toast.success("FAQ added successfully");
  };

  const handleUpdateFaq = async (updatedFaq: UpdateFaq) => {
    const result = await updateFaq(updatedFaq);
    if (!result.success || !result.data) {
      toast.error("Failed to update FAQ");
      return;
    }
    setFaqs(faqs.map((faq) => (faq.id === updatedFaq.id ? result.data! : faq)));
    toast.success("FAQ updated successfully");
  };

  const handleDeleteFaq = async (faqId: number) => {
    const result = await deleteFaq(faqId);
    if (!result.success) {
      toast.error("Failed to delete FAQ");
      return;
    }
    setFaqs(faqs.filter((faq) => faq.id !== faqId));
    toast.success("FAQ deleted successfully");
  };

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
