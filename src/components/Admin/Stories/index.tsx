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
import { AddStoryDialog } from "./AddStory";
import { StoryCard } from "./StoryCard";
import { type Story } from "@/lib/types";
import { toast } from "sonner";
import { createStory } from "@/server/actions/stories/createStory";
import { deleteStory } from "@/server/actions/stories/deleteStory";
import { updateStory } from "@/server/actions/stories/updateStory";
import type { AddNewStory, UpdateStory } from "./types";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

const StoriesManagement = ({
  stories: initialStories,
}: {
  stories: Story[];
}) => {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [showArabic, setShowArabic] = useState(false);
  // Setup uploadthing
  const { useUploadThing } = generateReactHelpers<OurFileRouter>();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {},
    onUploadError: (error) => {
      toast.error(`Error uploading: ${error.message}`);
    },
  });

  const handleCreateStory = async (newStory: AddNewStory) => {
    try {
      if (!newStory.file) {
        toast.error("Image is required");
        return;
      }

      const imageResult = await startUpload([newStory.file]);
      if (!imageResult || !imageResult[0]) {
        toast.error("Failed to upload image");
        return;
      }
      const imageUrl = imageResult[0].ufsUrl;
      const imageKey = imageResult[0].key;

      const result = await createStory({
        titleEn: newStory.titleEn,
        titleAr: newStory.titleAr,
        contentEn: newStory.contentEn,
        contentAr: newStory.contentAr,
        descriptionEn: newStory.descriptionEn,
        descriptionAr: newStory.descriptionAr,
        imageUrl: imageUrl,
        imageKey: imageKey,
        publish: newStory.publish,
        featured: newStory.featured,
      });

      if (!result.success || !result.data) {
        toast.error("Failed to add story");
        return;
      }
      setStories([...stories, result.data]);
      toast.success("Story added successfully");
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error("Failed to add story");
    }
  };

  const handleUpdateStory = async (updatedStory: UpdateStory) => {
    try {
      let imageUrl = undefined;
      let uploadthingKey = undefined;

      if (updatedStory.file) {
        const imageResult = await startUpload([updatedStory.file]);
        if (!imageResult || !imageResult[0]) {
          toast.error("Failed to upload image");
          return;
        }
        imageUrl = imageResult[0].ufsUrl;
        uploadthingKey = imageResult[0].key;
      }

      const result = await updateStory({
        id: updatedStory.id,
        titleEn: updatedStory.titleEn,
        titleAr: updatedStory.titleAr,
        contentEn: updatedStory.contentEn,
        contentAr: updatedStory.contentAr,
        descriptionEn: updatedStory.descriptionEn,
        descriptionAr: updatedStory.descriptionAr,
        imageUrl: imageUrl,
        imageKey: uploadthingKey,
        publish: updatedStory.publish,
        featured: updatedStory.featured,
      });

      if (!result.success || !result.data) {
        toast.error("Failed to update story");
        return;
      }
      setStories(
        stories.map((story) =>
          story.id === updatedStory.id ? result.data! : story,
        ),
      );
      toast.success("Story updated successfully");
    } catch (error) {
      console.error("Error updating story:", error);
      toast.error("Failed to update story");
    }
  };

  const handleDeleteStory = async (storyId: number) => {
    const result = await deleteStory(storyId);
    if (!result.success) {
      toast.error("Failed to delete story");
      return;
    }
    setStories(stories.filter((story) => story.id !== storyId));
    toast.success("Story deleted successfully");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-4">
            Stories
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowArabic(!showArabic)}
            >
              <Languages className="h-4 w-4" />
              {showArabic ? "Show English" : "Show Arabic"}
            </Button>
          </CardTitle>
          <AddStoryDialog onAddStory={handleCreateStory} />
        </div>
        <CardDescription>
          Manage the stories that appear on the website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onUpdate={handleUpdateStory}
              onDelete={handleDeleteStory}
              showArabic={showArabic}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <p className="text-sm text-gray-500">Total Stories: {stories.length}</p>
      </CardFooter>
    </Card>
  );
};

export default StoriesManagement;
