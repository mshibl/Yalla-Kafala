"use client";
import React, { useState } from "react";
import type { CarouselImage } from "@/lib/types";
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
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { EditCarouselImageDialog } from "./EditCarouselImage";
import type { UpdateCarouselImage } from "./types";
import Image from "next/image";
interface CarouselImageCardProps {
  image: CarouselImage;
  onUpdate: (updatedImage: UpdateCarouselImage) => Promise<void>;
  onDelete: (imageId: number) => Promise<void>;
}

export const CarouselImageCard: React.FC<CarouselImageCardProps> = ({
  image,
  onUpdate,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(image.id);
    setIsDeleting(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="relative h-48">
        <Image
          fill
          src={image.src}
          alt={image.altDescription || image.captionEn || "Carousel image"}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 flex gap-2">
          <EditCarouselImageDialog image={image} onUpdate={onUpdate} />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8 bg-white/80 hover:bg-red-100"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-red-500" />
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  carousel image from the homepage.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm text-gray-600 line-clamp-2">{image.captionEn}</p>
        <p className="text-xs text-gray-400 mt-1">Order: {image.order}</p>
      </div>
    </div>
  );
};
