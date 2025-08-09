"use client";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Loader2, Sparkles } from "lucide-react";
import {
  addBoardMemberFormSchema,
  type AddBoardMembersFormValues,
  type AddNewBoardMember,
} from "./types";
import { Switch } from "@/components/ui/switch";
import { TipTapEditor } from "@/components/TiptapEditor";
import Image from "next/image";
import type { BoardMember } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EditBoardMemberDialog({
  boardMember,
  onUpdate,
}: {
  boardMember: BoardMember;
  onUpdate: (id: string, boardMember: AddNewBoardMember) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    boardMember.imageUrl || null,
  );
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [fileChanged, setFileChanged] = useState(false);
  const form = useForm<AddBoardMembersFormValues>({
    resolver: zodResolver(addBoardMemberFormSchema),
    defaultValues: {
      nameEn: boardMember.nameEn,
      nameAr: boardMember.nameAr,
      bioEn: boardMember.bioEn,
      bioAr: boardMember.bioAr,
      type: boardMember.type,
      file: undefined,
      country: boardMember.country,
    },
  });
  // Update form values when FAQ prop changes
  useEffect(() => {
    form.reset({
      nameEn: boardMember.nameEn,
      nameAr: boardMember.nameAr,
      bioEn: boardMember.bioEn,
      bioAr: boardMember.bioAr,
      type: boardMember.type,
      file: undefined,
      country: boardMember.country,
    });
  }, [boardMember, form]);
  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("file", file);
      setFileChanged(true);
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setObjectUrl(imageUrl);
    }
  };

  async function onSubmit(values: AddBoardMembersFormValues) {
    try {
      setIsLoading(true);
      await onUpdate(boardMember.id, {
        ...values,
        file: values.file,
      });
      setOpen(false);
    } catch (error) {
      console.error("Failed to update story:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Story</DialogTitle>
          <DialogDescription>
            Make changes to the story information below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (Ar)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Arabic name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bioEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Bio</FormLabel>
                    <FormControl>
                      <TipTapEditor
                        content={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Enter the bio in English"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bioAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arabic Bio</FormLabel>
                    <FormControl>
                      <TipTapEditor
                        content={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Enter the bio in Arabic"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
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
                        {!fileChanged && (
                          <FormDescription className="text-amber-500">
                            Choose a new image if you want to replace the
                            existing one
                          </FormDescription>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Type</FormLabel>
                        <FormDescription>
                          Select the type of board member
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="board">Board</SelectItem>
                            <SelectItem value="advisor">Advisor</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Country</FormLabel>
                        <FormDescription>
                          Select the country of the board member
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="egypt">Egypt</SelectItem>
                            <SelectItem value="usa">USA</SelectItem>
                            <SelectItem value="all">All</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
