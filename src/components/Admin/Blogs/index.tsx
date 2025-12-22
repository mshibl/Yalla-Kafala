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

import { type Blog } from "@/lib/types";
import { toast } from "sonner";
import { createBlog } from "@/server/actions/blogs/createBlog";
import { deleteBlog } from "@/server/actions/blogs/deleteBlog";
import { updateBlog } from "@/server/actions/blogs/updateBlog";
import type { AddNewBlog, UpdateBlog } from "./types";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { AddBlogDialog } from "./AddBlog";
import { BlogCard } from "./BlogCard";

const BlogsManagement = ({ blogs: initialBlogs }: { blogs: Blog[] }) => {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [showArabic, setShowArabic] = useState(false);
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

      const result = await createBlog({
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

      if (!result.success || !result.data) {
        toast.error("Failed to add blog");
        return;
      }
      setBlogs([...blogs, result.data]);
      toast.success("Blog added successfully");
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Failed to add blog");
    }
  };

  const handleUpdateBlog = async (updatedBlog: UpdateBlog) => {
    try {
      let imageUrl = undefined;
      let uploadthingKey = undefined;

      if (updatedBlog.file) {
        const imageResult = await startUpload([updatedBlog.file]);
        if (!imageResult || !imageResult[0]) {
          toast.error("Failed to upload image");
          return;
        }
        imageUrl = imageResult[0].ufsUrl;
        uploadthingKey = imageResult[0].key;
      }

      const result = await updateBlog({
        id: updatedBlog.id,
        titleEn: updatedBlog.titleEn,
        titleAr: updatedBlog.titleAr,
        contentEn: updatedBlog.contentEn,
        contentAr: updatedBlog.contentAr,
        descriptionEn: updatedBlog.descriptionEn,
        descriptionAr: updatedBlog.descriptionAr,
        imageUrl: imageUrl,
        imageKey: uploadthingKey,
        publish: updatedBlog.publish,
        featured: updatedBlog.featured,
      });

      if (!result.success || !result.data) {
        toast.error("Failed to update blog");
        return;
      }
      setBlogs(
        blogs.map((blog) => (blog.id === updatedBlog.id ? result.data! : blog)),
      );
      toast.success("Blog updated successfully");
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog");
    }
  };

  const handleDeleteBlog = async (blogId: number) => {
    const result = await deleteBlog(blogId);
    if (!result.success) {
      toast.error("Failed to delete blog");
      return;
    }
    setBlogs(blogs.filter((blog) => blog.id !== blogId));
    toast.success("Blog deleted successfully");
  };

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
