"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Plus, Eye, EyeOff, Star, Loader2 } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { TipTapEditor } from "@/components/TiptapEditor";
import {
  FaqFormSchema,
  type AddFaqDialogProps,
  type FaqFormValues,
} from "./types";

export const AddFaqDialog: React.FC<AddFaqDialogProps> = ({ onAddFaq }) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(FaqFormSchema),
    defaultValues: {
      questionEn: "",
      questionAr: "",
      answerEn: "",
      answerAr: "",
      publish: true,
      featured: false,
    },
  });

  const onSubmit = async (values: FaqFormValues) => {
    setIsSubmitting(true);
    await onAddFaq(values);
    form.reset();
    setOpen(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add New FAQ</DialogTitle>
              <DialogDescription>
                Add a new frequently asked question in both English and Arabic.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="questionEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Question</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the question in English"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="questionAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arabic Question</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the question in Arabic"
                        {...field}
                        dir="rtl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answerEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Answer</FormLabel>
                    <FormControl>
                      <TipTapEditor
                        content={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Enter the answer in English"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answerAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arabic Answer</FormLabel>
                    <FormControl>
                      <TipTapEditor
                        content={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Enter the answer in Arabic"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="publish"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {field.value ? (
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Published
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <EyeOff className="h-4 w-4" />
                            Draft
                          </div>
                        )}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {field.value
                          ? "This FAQ will be visible to users"
                          : "This FAQ will be saved as a draft"}
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {field.value ? (
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Featured
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <EyeOff className="h-4 w-4" />
                            Not Featured
                          </div>
                        )}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {field.value
                          ? "This FAQ will be featured on the homepage"
                          : "This FAQ will not be featured on the homepage"}
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Adding..." : "Add FAQ"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
