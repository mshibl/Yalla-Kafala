import React from "react";
import { Button } from "@/components/ui/button";
import type { FaqCardProps } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditFaqDialog } from "./EditFaq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Trash2, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const FaqCard: React.FC<FaqCardProps> = ({
  faq,
  onUpdate,
  onDelete,
  showArabic,
}) => {
  const handlePublishToggle = async (publish: boolean) => {
    await onUpdate({
      ...faq,
      publish,
    });
  };

  return (
    <div className="group relative rounded-lg border bg-card text-card-foreground shadow-sm">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-none">
          <div className="flex items-center gap-4 px-4">
            <div className="flex-1">
              <div
                className={`flex items-center gap-2 py-4 ${showArabic ? "flex-row-reverse" : ""}`}
              >
                <Badge variant="outline" className="text-xs font-normal">
                  {showArabic ? "AR" : "EN"}
                </Badge>
                <p
                  className="font-medium text-base"
                  dir={showArabic ? "rtl" : "ltr"}
                >
                  {showArabic ? faq.questionAr : faq.questionEn}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id={`publish-${faq.id}`}
                  checked={faq.publish}
                  onCheckedChange={handlePublishToggle}
                />
                <Label htmlFor={`publish-${faq.id}`} className="text-sm">
                  {faq.publish ? (
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      Published
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <EyeOff className="h-4 w-4" />
                      Draft
                    </div>
                  )}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <EditFaqDialog faq={faq} onUpdate={onUpdate} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this FAQ.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(faq.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <AccordionTrigger className="hover:no-underline py-4" />
          </div>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-6">
              <div className="space-y-4 mb-0">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-normal">
                      EN
                    </Badge>
                    <h3 className="text-sm font-medium">Question</h3>
                  </div>
                  <div className="text-sm">{faq.questionEn}</div>
                  <h3 className="text-sm font-medium mt-4">Answer</h3>
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: faq.answerEn }}
                  ></div>
                </div>
              </div>
              <div className="space-y-4" dir="rtl">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-normal">
                      AR
                    </Badge>
                    <h3 className="text-sm font-medium">السؤال</h3>
                  </div>
                  <p className="text-sm">{faq.questionAr}</p>
                  <h3 className="text-sm font-medium mt-4">الإجابة</h3>
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: faq.answerAr }}
                  ></div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
