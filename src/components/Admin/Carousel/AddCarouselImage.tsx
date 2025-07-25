"use client";
import React, { useState } from "react";
import type { ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import {
  type AddNewCarouselImage,
  type CarouselImageFormValues,
  CarouselImageFormSchema,
} from "./types";

interface AddCarouselImageDialogProps {
  onAddImage: (newImage: AddNewCarouselImage) => Promise<void>;
}

export const AddCarouselImageDialog: React.FC<AddCarouselImageDialogProps> = ({
  onAddImage,
}) => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CarouselImageFormValues>({
    resolver: zodResolver(CarouselImageFormSchema),
    defaultValues: {
      captionEn: "",
      captionAr: "",
      altDescription: "",
      order: 1,
    },
  });

  // Keep track of the current object URL to revoke it
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      form.trigger("image");
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setObjectUrl(imageUrl);
    }
  };

  const handleAddImage = async (values: CarouselImageFormValues) => {
    try {
      setIsLoading(true);
      await onAddImage({
        file: values.image,
        captionEn: values.captionEn,
        captionAr: values.captionAr,
        altDescription: values.altDescription,
        order: values.order,
      });
      form.reset();
      setPreview(null);
      setOpen(false);
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Carousel Image
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Carousel Image</DialogTitle>
          <DialogDescription>
            Add a new image to the homepage carousel. Fill in all fields and
            click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleAddImage)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="image"
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
                          if (e.target.files?.[0]) {
                            onChange(e.target.files[0]);
                          }
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
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="captionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Caption (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed description"
                      className="resize-none w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Additional details about this carousel slide.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="captionAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arabic Caption (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed description in Arabic"
                      className="resize-none w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Additional details about this carousel slide in Arabic.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="altDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Image description"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    A description of the image for accessibility.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Position in the carousel sequence (lower numbers appear
                    first).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
