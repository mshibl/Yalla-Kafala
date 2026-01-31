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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Pencil, Loader2 } from "lucide-react";
import type { Resource } from "@/lib/types";
import {
  editResourceFormSchema,
  type EditResourceFormValues,
  type EditResource,
} from "./types";

export function EditResourceDialog({
  resource,
  onUpdate,
}: {
  resource: Resource;
  onUpdate: (id: string, resource: EditResource) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const form = useForm<EditResourceFormValues>({
    resolver: zodResolver(editResourceFormSchema),
    defaultValues: {
      nameEn: resource.nameEn,
      nameAr: resource.nameAr,
      file: undefined,
    },
  });

  useEffect(() => {
    form.reset({
      nameEn: resource.nameEn,
      nameAr: resource.nameAr,
      file: undefined,
    });
    setSelectedFileName(null);
  }, [resource, form]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file);
      setSelectedFileName(file.name);
    }
  };

  async function onSubmit(values: EditResourceFormValues) {
    try {
      setIsLoading(true);
      await onUpdate(resource.id, {
        slug: resource.slug,
        nameEn: values.nameEn,
        nameAr: values.nameAr,
        file: values.file,
        uploadthingKey: resource.uploadthingKey,
        link: resource.link,
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to update resource:", error);
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
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Edit Resource</DialogTitle>
          <DialogDescription>
            Update the English/Arabic names or upload a new file.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (English)</FormLabel>
                  <FormControl>
                    <Input placeholder="Resource name in English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (Arabic)</FormLabel>
                  <FormControl>
                    <Input placeholder="اسم المورد بالعربية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>Upload New File</FormLabel>
                  <FormControl>
                    <Input type="file" onChange={handleFileChange} />
                  </FormControl>
                  <FormDescription>
                    Upload a new file to replace the current resource file.
                  </FormDescription>
                  {selectedFileName ? (
                    <FormDescription>
                      Selected: {selectedFileName}
                    </FormDescription>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
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
