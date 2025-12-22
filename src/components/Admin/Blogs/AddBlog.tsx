"use client";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Sparkles } from "lucide-react";
import type { AddBlogDialogProps } from "./types";
import { addBlogFormSchema, type AddBlogFormValues } from "./types";
import { Switch } from "@/components/ui/switch";
import { TipTapEditor } from "@/components/TiptapEditor";
import { improveText } from "@/server/actions/ai/improveText";
import { toast } from "sonner";
import Image from "next/image";
export function AddBlogDialog({ onAddBlog }: AddBlogDialogProps) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [isGeneratingEnDescription, setIsGeneratingEnDescription] =
    useState(false);
  const [isGeneratingArDescription, setIsGeneratingArDescription] =
    useState(false);

  const form = useForm<AddBlogFormValues>({
    resolver: zodResolver(addBlogFormSchema),
    defaultValues: {
      titleEn: "",
      titleAr: "",
      contentEn: "",
      contentAr: "",
      descriptionEn: "",
      descriptionAr: "",
      publish: false,
      featured: false,
      file: undefined,
    },
  });

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file);
      form.trigger("file");
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setObjectUrl(imageUrl);
    }
  };

  async function onSubmit(values: AddBlogFormValues) {
    try {
      setIsLoading(true);
      await onAddBlog({
        ...values,
        file: values.file,
      });
      form.reset();
      setPreview(null);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add blog:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function generateDescriptionWithAI(
    value: string,
    field: "descriptionEn" | "descriptionAr",
  ): Promise<void> {
    if (field === "descriptionEn") {
      setIsGeneratingEnDescription(true);
    } else {
      setIsGeneratingArDescription(true);
    }
    if (value === "") {
      toast.error("Please enter the blog content first");
      setIsGeneratingEnDescription(false);
      setIsGeneratingArDescription(false);
      return;
    }
    const description = await improveText({
      text: value,
      system: `You are an expert writer. You will be given a blog in English or Arabic. You will need to generate a short description for the blog. The description should be short around 20 words. If the text is in English, the description should be in English. If the text is in Arabic, the description should be in Arabic.
        

      Guidlines:
      - Use postive words
      - Use hopeful words and focus on the positive side of the blog
      - The description should be about the child and the parent
      - Only describe the family but not the blog. Don't say "Beautiful blog" for example

      A good description should like this for example:
      "The blog of Rasha and Mustafa and their journey to find a new home"

        `,
    });
    if (!description) {
      toast.error("Failed to generate description");
    } else {
      form.setValue(field, description);
    }

    setIsGeneratingEnDescription(false);
    setIsGeneratingArDescription(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Blog
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Blog</DialogTitle>
          <DialogDescription>
            Create a new blog to be displayed on the website.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="titleEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="titleAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title (Ar)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Arabic title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Content</FormLabel>
                    <FormControl>
                      <TipTapEditor
                        content={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Enter the content in English"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contentAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arabic Content</FormLabel>
                    <FormControl>
                      <TipTapEditor
                        content={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Enter the blog content in Arabic"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="descriptionEn"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Description</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          generateDescriptionWithAI(
                            form.getValues("contentEn"),
                            "descriptionEn",
                          )
                        }
                        className="ml-auto bg-purple-500 text-white transition-colors hover:bg-purple-600 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isGeneratingEnDescription
                          ? "Generating..."
                          : "Generate with AI"}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Enter short description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descriptionAr"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Description (Ar)</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          generateDescriptionWithAI(
                            form.getValues("contentAr"),
                            "descriptionAr",
                          )
                        }
                        className="ml-auto bg-purple-500 text-white transition-colors hover:bg-purple-600 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isGeneratingArDescription
                          ? "Generating..."
                          : "Generate with AI"}
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Enter Arabic description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageChange(e);
                          }}
                          className="w-full"
                          {...rest}
                        />
                        {preview && (
                          <div className="mt-2">
                            <Image
                              src={preview}
                              alt="Preview"
                              height={160}
                              width={160}
                              className="max-h-40 w-full rounded-md object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload an image for this blog
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="publish"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Publish</FormLabel>
                        <FormDescription>
                          Make this blog visible on the website
                        </FormDescription>
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>
                          Show this blog in featured sections
                        </FormDescription>
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
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Add Blog"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
