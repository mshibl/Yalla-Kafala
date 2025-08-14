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
import { AddCarouselImageDialog } from "./AddCarouselImage";
import { CarouselImageCard } from "./CarouselImageCard";
import { type CarouselImage } from "@/lib/types";
import { toast } from "sonner";
import { createCarouselImage } from "@/server/actions/carouselImages/createImage";
import { deleteCarouselImage } from "@/server/actions/carouselImages/deleteImage";
import { updateCarouselImage } from "@/server/actions/carouselImages/updateImage";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";
import type { AddNewCarouselImage, UpdateCarouselImage } from "./types";

const CarouselManagement = ({
  carouselImages: initialCarouselImages,
}: {
  carouselImages: CarouselImage[];
}) => {
  // Sample carousel data - in a real app, this would come from an API
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>(
    initialCarouselImages,
  );

  // Setup uploadthing
  const { useUploadThing } = generateReactHelpers<OurFileRouter>();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {},
    onUploadError: (error) => {
      toast.error(`Error uploading: ${error.message}`);
    },
  });

  const handleCreateImage = async (newImage: AddNewCarouselImage) => {
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
      captionEn: newImage.captionEn,
      captionAr: newImage.captionAr,
      altDescription: newImage.altDescription,
      order: newImage.order,
    };

    const result = await createCarouselImage(newImageData);
    if (!result.success || !result.data) {
      toast.error("Failed to add image");
      return;
    }
    if (result.success) {
      setCarouselImages([...carouselImages, result.data]);
      toast.success("Image added successfully");
    } else {
      toast.error("Failed to add image");
    }
  };

  const handleUpdateImage = async (updatedImage: UpdateCarouselImage) => {
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
    const updatedImageResult = await updateCarouselImage({
      id: updatedImage.id,
      src: imageUrl,
      uploadthingKey,
      captionEn: updatedImage.captionEn,
      captionAr: updatedImage.captionAr,
      altDescription: updatedImage.altDescription,
      order: updatedImage.order,
    });
    if (!updatedImageResult.success || !updatedImageResult.data) {
      toast.error("Failed to update image");
      return;
    }
    setCarouselImages(
      carouselImages.map((img) =>
        img.id === updatedImage.id ? updatedImageResult.data! : img,
      ),
    );
    toast.success("Image updated successfully");
  };

  const handleDeleteImage = async (imageId: number) => {
    const result = await deleteCarouselImage(imageId);
    if (!result.success) {
      toast.error("Failed to delete image");
      return;
    }
    setCarouselImages(carouselImages.filter((img) => img.id !== imageId));
    toast.success("Image deleted successfully");
  };

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
