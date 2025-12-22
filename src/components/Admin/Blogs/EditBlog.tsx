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
import { Pencil, Loader2, Sparkles } from "lucide-react";
import type { EditBlogDialogProps } from "./types";
import { editBlogFormSchema, type EditBlogFormValues } from "./types";
import { Switch } from "@/components/ui/switch";
import { TipTapEditor } from "@/components/TiptapEditor";
import Image from "next/image";

export function EditBlogDialog({ blog, onUpdate }: EditBlogDialogProps) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(blog.imageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [fileChanged, setFileChanged] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const form = useForm<EditBlogFormValues>({
    resolver: zodResolver(editBlogFormSchema),
    defaultValues: {
      titleEn: blog.titleEn,
      titleAr: blog.titleAr,
      contentEn: blog.contentEn,
      contentAr: blog.contentAr,
      descriptionEn: blog.descriptionEn,
      descriptionAr: blog.descriptionAr,
      publish: blog.publish,
      featured: blog.featured,
      file: undefined,
    },
  });
  // Update form values when FAQ prop changes
  useEffect(() => {
    form.reset({
      titleEn: blog.titleEn,
      titleAr: blog.titleAr,
      contentEn: blog.contentEn,
      contentAr: blog.contentAr,
      descriptionEn: blog.descriptionEn,
      descriptionAr: blog.descriptionAr,
      publish: blog.publish,
      featured: blog.featured,
    });
  }, [blog, form]);
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
      setFileChanged(true);
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setObjectUrl(imageUrl);
    }
  };

  async function onSubmit(values: EditBlogFormValues) {
    try {
      setIsLoading(true);
      await onUpdate({
        ...values,
        id: blog.id,
        file: values.file,
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to update blog:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Blog</DialogTitle>
          <DialogDescription>
            Make changes to the blog information below.
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
                        onClick={() => {}}
                        className="ml-auto bg-purple-500 text-white transition-colors hover:bg-purple-600 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isGenerating ? "Generating..." : "Generate with AI"}
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
                        onClick={() => {}}
                        className="ml-auto bg-purple-500 text-white transition-colors hover:bg-purple-600 dark:bg-purple-600 dark:text-white dark:hover:bg-purple-700"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isGenerating ? "Generating..." : "Generate with AI"}
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
                              height={160}
                              width={160}
                              src={preview}
                              alt="Preview"
                              className="max-h-40 w-full rounded-md object-cover"
                            />
                          </div>
                        )}
                        {!fileChanged && (
                          <FormDescription className="text-amber-500">
                            Choose a new image if you want to replace the
                            existing one
                          </FormDescription>
                        )}
                      </div>
                    </FormControl>
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
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
