"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddCarouselImageDialog } from "./AddCarouselImage";
import { CarouselImageCard } from "./CarouselImageCard";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";
import type { AddNewCarouselImage, UpdateCarouselImage } from "./types";
import { Loader2 } from "lucide-react";
import { revalidateCarousel } from "@/server/actions/revalidate";

const CarouselManagement = () => {
  const carouselImages = useQuery(api.carouselImages.queries.getCarouselImages);

  const createCarouselImage = useMutation(api.carouselImages.mutations.createCarouselImage);
  const updateCarouselImage = useMutation(api.carouselImages.mutations.updateCarouselImage);
  const deleteCarouselImage = useMutation(api.carouselImages.mutations.deleteCarouselImage);

  // Setup uploadthing
  const { useUploadThing } = generateReactHelpers<OurFileRouter>();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {},
    onUploadError: (error) => {
      toast.error(`Error uploading: ${error.message}`);
    },
  });

  const handleCreateImage = async (newImage: AddNewCarouselImage) => {
    try {
      const imageResult = await startUpload([newImage.file]);
      if (!imageResult || !imageResult[0]) {
        toast.error("Failed to upload image");
        return;
      }
      const imageUrl = imageResult[0].ufsUrl;
      const uploadthingKey = imageResult[0].key;
      const newImageData = {
        uploadthingKey,
        src: imageUrl,
        captionEn: newImage.captionEn || "",
        captionAr: newImage.captionAr || "",
        altDescription: newImage.altDescription || "",
        order: newImage.order,
      };

      await createCarouselImage(newImageData);
      await revalidateCarousel();
      toast.success("Image added successfully");
    } catch (error) {
      console.error("Error creating carousel image:", error);
      toast.error("Failed to add image");
    }
  };

  const handleUpdateImage = async (updatedImage: UpdateCarouselImage) => {
    try {
      let imageUrl: string | undefined;
      let uploadthingKey: string | undefined;
      if (updatedImage.file) {
        const result = await startUpload([updatedImage.file]);
        if (!result || !result[0]) {
          toast.error("Failed to upload image");
          return;
        }
        imageUrl = result[0].ufsUrl;
        uploadthingKey = result[0].key;
      }

      // Read current properties
      const existingImage = carouselImages?.find(img => img.id === updatedImage.id);
      if (!existingImage) {
        toast.error("Image not found");
        return;
      }

      await updateCarouselImage({
        id: updatedImage.id,
        src: imageUrl ?? existingImage.src,
        uploadthingKey: uploadthingKey ?? existingImage.uploadthingKey,
        captionEn: updatedImage.captionEn ?? existingImage.captionEn ?? "",
        captionAr: updatedImage.captionAr ?? existingImage.captionAr ?? "",
        altDescription: updatedImage.altDescription ?? existingImage.altDescription ?? "",
        order: updatedImage.order ?? existingImage.order,
      });

      await revalidateCarousel();
      toast.success("Image updated successfully");
    } catch (error) {
      console.error("Error updating carousel image:", error);
      toast.error("Failed to update image");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteCarouselImage({ id: imageId });
      await revalidateCarousel();
      toast.success("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting carousel image:", error);
      toast.error("Failed to delete image");
    }
  };

  if (!carouselImages) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Carousel Images{" "}
          <AddCarouselImageDialog onAddImage={handleCreateImage} />
        </CardTitle>
        <CardDescription>
          Manage the images that appear in the homepage carousel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carouselImages.map((image) => (
            <CarouselImageCard
              key={image.id}
              image={image}
              onUpdate={handleUpdateImage}
              onDelete={handleDeleteImage}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <p className="text-sm text-gray-500">
          Total images: {carouselImages.length}
        </p>
      </CardFooter>
    </Card>
  );
};

export default CarouselManagement;
