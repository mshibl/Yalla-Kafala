"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddBoardMemberDialog } from "./AddBoardMember";
import { toast } from "sonner";
import type { AddNewBoardMember } from "./types";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { EditBoardMemberDialog } from "./EditBoardMember";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Trash2 } from "lucide-react";

const BoardMembersManagement = () => {
  const boardMembers = useQuery(api.boardMembers.queries.getBoardMembers);
  const createBoardMember = useMutation(
    api.boardMembers.mutations.createBoardMember,
  );
  const updateBoardMember = useMutation(
    api.boardMembers.mutations.updateBoardMember,
  );
  const deleteBoardMember = useMutation(
    api.boardMembers.mutations.deleteBoardMember,
  );
  // Setup uploadthing
  const { useUploadThing } = generateReactHelpers<OurFileRouter>();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {},
    onUploadError: (error) => {
      toast.error(`Error uploading: ${error.message}`);
    },
  });

  const handleCreateBoardMember = async (newBoardMember: AddNewBoardMember) => {
    try {
      if (!newBoardMember.file) {
        toast.error("Image is required");
        return;
      }

      const imageResult = await startUpload([newBoardMember.file]);
      if (!imageResult || !imageResult[0]) {
        toast.error("Failed to upload image");
        return;
      }
      const imageUrl = imageResult[0].ufsUrl;
      const imageKey = imageResult[0].key;

      await createBoardMember({
        nameEn: newBoardMember.nameEn,
        nameAr: newBoardMember.nameAr,
        bioEn: newBoardMember.bioEn,
        bioAr: newBoardMember.bioAr,
        imageUrl: imageUrl,
        imageKey: imageKey,
        type: newBoardMember.type,
        country: newBoardMember.country,
      });

      toast.success("Board member added successfully");
    } catch (error) {
      console.error("Error creating board member:", error);
      toast.error("Failed to add board member");
    }
  };

  const handleUpdateBoardMember = async (
    id: string,
    updatedBoardMember: AddNewBoardMember,
  ) => {
    try {
      let imageUrl = undefined;
      let uploadthingKey = undefined;

      if (updatedBoardMember.file) {
        const imageResult = await startUpload([updatedBoardMember.file]);
        if (!imageResult || !imageResult[0]) {
          toast.error("Failed to upload image");
          return;
        }
        imageUrl = imageResult[0].ufsUrl;
        uploadthingKey = imageResult[0].key;
      }

      await updateBoardMember({
        id,
        nameEn: updatedBoardMember.nameEn,
        nameAr: updatedBoardMember.nameAr,
        bioEn: updatedBoardMember.bioEn,
        bioAr: updatedBoardMember.bioAr,
        type: updatedBoardMember.type,
        country: updatedBoardMember.country,
      });

      toast.success("Board member updated successfully");
    } catch (error) {
      console.error("Error updating board member:", error);
      toast.error("Failed to update board member");
    }
  };

  const handleDeleteBoardMember = async (boardMemberId: string) => {
    await deleteBoardMember({ id: boardMemberId });
    toast.success("Board member deleted successfully");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-4">
            Board Members
          </CardTitle>
          <AddBoardMemberDialog onAddBoardMember={handleCreateBoardMember} />
        </div>
        <CardDescription>
          Manage the board members that appear on the website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boardMembers?.map((boardMember) => (
                <TableRow key={boardMember.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      {boardMember.imageUrl ? (
                        <AvatarImage
                          src={boardMember.imageUrl}
                          alt={boardMember.nameEn}
                        />
                      ) : null}
                      <AvatarFallback>
                        {getInitials(boardMember.nameEn)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{boardMember.nameEn}</span>
                      <span className="text-muted-foreground text-xs">
                        {boardMember.nameAr}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {boardMember.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <EditBoardMemberDialog
                        boardMember={boardMember}
                        onUpdate={handleUpdateBoardMember}
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete board member?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete this board member from the
                              database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteBoardMember(boardMember.id)
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
          {!boardMembers && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Loading board members...
            </div>
          )}
          {boardMembers && boardMembers.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No board members found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BoardMembersManagement;
