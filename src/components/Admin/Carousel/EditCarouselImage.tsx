"use client";
import React, { useState } from "react";
import type { ChangeEvent } from "react";
import type { CarouselImage } from "@/lib/types";
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
import { Loader2, Pencil } from "lucide-react";
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
import {
  CarouselImageFormSchema,
  type CarouselImageFormValues,
  type UpdateCarouselImage,
} from "./types";
import Image from "next/image";
interface EditCarouselImageDialogProps {
  image: CarouselImage;
  onUpdate: (updatedImage: UpdateCarouselImage) => Promise<void>;
}

export const EditCarouselImageDialog: React.FC<
  EditCarouselImageDialogProps
> = ({ image, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(image.src);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CarouselImageFormValues>({
    resolver: zodResolver(CarouselImageFormSchema),
    defaultValues: {
      captionEn: image.captionEn || undefined,
      captionAr: image.captionAr || undefined,
      altDescription: image.altDescription || "",
      order: image.order,
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

  const handleUpdateImage = async (values: CarouselImageFormValues) => {
    try {
      setIsLoading(true);
      await onUpdate({
        id: image.id,
        file: values.image,
        captionEn: values.captionEn,
        captionAr: values.captionAr,
        altDescription: values.altDescription,
        order: values.order,
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to update image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 bg-white/80 hover:bg-white"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Carousel Image</DialogTitle>
          <DialogDescription>
            Make changes to the carousel image. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateImage)}
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
                  <FormLabel>English Caption</FormLabel>
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
                  <FormLabel>Arabic Caption</FormLabel>
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
                    Updating...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
