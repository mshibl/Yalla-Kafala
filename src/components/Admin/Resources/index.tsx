"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddResourceDialog } from "./AddResource";
import { EditResourceDialog } from "./EditResource";
import type { AddNewResource, EditResource } from "./types";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
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
import { ExternalLink, Trash2 } from "lucide-react";
import { deleteResource as deleteResourceAction } from "@/server/actions/resources/deleteResource";

const ResourcesManagement = () => {
  const resources = useQuery(api.resources.queries.getResources);
  const createResource = useMutation(api.resources.mutations.createResource);
  const updateResource = useMutation(api.resources.mutations.updateResource);

  const { useUploadThing } = generateReactHelpers<OurFileRouter>();
  const { startUpload } = useUploadThing("resourceUploader", {
    onClientUploadComplete: async () => {},
    onUploadError: (error) => {
      toast.error(`Error uploading: ${error.message}`);
    },
  });

  const handleCreateResource = async (newResource: AddNewResource) => {
    try {
      const fileResult = await startUpload([newResource.file]);
      if (!fileResult || !fileResult[0]) {
        toast.error("Failed to upload file");
        return;
      }
      const link = fileResult[0].ufsUrl;
      const uploadthingKey = fileResult[0].key;

      await createResource({
        nameEn: newResource.nameEn.trim(),
        nameAr: newResource.nameAr.trim(),
        link,
        uploadthingKey,
      });

      toast.success("Resource added successfully");
    } catch (error) {
      console.error("Error creating resource:", error);
      toast.error("Failed to add resource");
    }
  };

  const handleUpdateResource = async (
    id: string,
    updatedResource: EditResource,
  ) => {
    try {
      let link = updatedResource.link?.trim() ?? "";
      let uploadthingKey = updatedResource.uploadthingKey;

      if (updatedResource.file) {
        const fileResult = await startUpload([updatedResource.file]);
        if (!fileResult || !fileResult[0]) {
          toast.error("Failed to upload file");
          return;
        }
        link = fileResult[0].ufsUrl;
        uploadthingKey = fileResult[0].key;
      }

      if (!link) {
        toast.error("File upload is required");
        return;
      }

      await updateResource({
        id,
        nameEn: updatedResource.nameEn.trim(),
        nameAr: updatedResource.nameAr.trim(),
        link,
        uploadthingKey,
      });

      toast.success("Resource updated successfully");
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to update resource");
    }
  };

  const handleDeleteResource = async (
    resourceId: string,
    uploadthingKey: string,
  ) => {
    const result = await deleteResourceAction(resourceId, uploadthingKey);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-4">Resources</CardTitle>
          <AddResourceDialog onAddResource={handleCreateResource} />
        </div>
        <CardDescription>
          Manage the files displayed in the Resources page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name (EN)</TableHead>
                <TableHead>Name (AR)</TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="w-[140px] text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources?.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell>
                    <span className="font-medium">{resource.nameEn}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{resource.nameAr}</span>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 max-w-[320px] truncate"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="truncate">{resource.link}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <EditResourceDialog
                        resource={resource}
                        onUpdate={handleUpdateResource}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete resource?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will remove the
                              resource from the website.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteResource(
                                  resource.id,
                                  resource.uploadthingKey,
                                )
                              }
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!resources && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading resources...
            </div>
          )}
          {resources && resources.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No resources found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourcesManagement;
