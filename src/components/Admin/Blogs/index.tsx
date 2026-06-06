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

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import type { AddNewBlog, UpdateBlog } from "./types";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";
import { Button } from "@/components/ui/button";
import { Languages, Loader2 } from "lucide-react";
import { AddBlogDialog } from "./AddBlog";
import { BlogCard } from "./BlogCard";
import { revalidateBlog } from "@/server/actions/revalidate";

const BlogsManagement = () => {
  const blogs = useQuery(api.stories.queries.getStories, { publishedOnly: false });
  const [showArabic, setShowArabic] = useState(false);

  const createStory = useMutation(api.stories.mutations.createStory);
  const updateStory = useMutation(api.stories.mutations.updateStory);
  const deleteStory = useMutation(api.stories.mutations.deleteStory);

  // Setup uploadthing
  const { useUploadThing } = generateReactHelpers<OurFileRouter>();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {},
    onUploadError: (error) => {
      toast.error(`Error uploading: ${error.message}`);
    },
  });

  const handleCreateBlog = async (newBlog: AddNewBlog) => {
    try {
      if (!newBlog.file) {
        toast.error("Image is required");
        return;
      }

      const imageResult = await startUpload([newBlog.file]);
      if (!imageResult || !imageResult[0]) {
        toast.error("Failed to upload image");
        return;
      }
      const imageUrl = imageResult[0].ufsUrl;
      const imageKey = imageResult[0].key;

      await createStory({
        titleEn: newBlog.titleEn,
        titleAr: newBlog.titleAr,
        contentEn: newBlog.contentEn,
        contentAr: newBlog.contentAr,
        descriptionEn: newBlog.descriptionEn,
        descriptionAr: newBlog.descriptionAr,
        imageUrl: imageUrl,
        imageKey: imageKey,
        publish: newBlog.publish,
        featured: newBlog.featured,
      });

      await revalidateBlog();
      toast.success("Blog added successfully");
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Failed to add blog");
    }
  };

  const handleUpdateBlog = async (updatedBlog: UpdateBlog) => {
    try {
      let imageUrl: string | undefined = undefined;
      let uploadthingKey: string | undefined = undefined;

      if (updatedBlog.file) {
        const imageResult = await startUpload([updatedBlog.file]);
        if (!imageResult || !imageResult[0]) {
          toast.error("Failed to upload image");
          return;
        }
        imageUrl = imageResult[0].ufsUrl;
        uploadthingKey = imageResult[0].key;
      }

      // Read current blog properties
      const existingBlog = blogs?.find(b => b.id === updatedBlog.id);
      if (!existingBlog) {
        toast.error("Blog not found");
        return;
      }

      await updateStory({
        id: updatedBlog.id,
        titleEn: updatedBlog.titleEn,
        titleAr: updatedBlog.titleAr,
        contentEn: updatedBlog.contentEn,
        contentAr: updatedBlog.contentAr,
        descriptionEn: updatedBlog.descriptionEn,
        descriptionAr: updatedBlog.descriptionAr,
        imageUrl: imageUrl ?? existingBlog.imageUrl,
        imageKey: uploadthingKey ?? existingBlog.imageKey,
        publish: updatedBlog.publish,
        featured: updatedBlog.featured,
      });

      await revalidateBlog(updatedBlog.id);
      toast.success("Blog updated successfully");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog");
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      await deleteStory({ id: blogId });
      await revalidateBlog(blogId);
      toast.success("Blog deleted successfully");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
    }
  };

  if (!blogs) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-4">
            Blogs
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
          <AddBlogDialog onAddBlog={handleCreateBlog} />
        </div>
        <CardDescription>
          Manage the blogs that appear on the website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onUpdate={handleUpdateBlog}
              onDelete={handleDeleteBlog}
              showArabic={showArabic}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <p className="text-sm text-gray-500">Total Blogs: {blogs.length}</p>
      </CardFooter>
    </Card>
  );
};

export default BlogsManagement;
