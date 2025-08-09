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
import { Plus, Loader2, Sparkles } from "lucide-react";
import type { AddBoardMembersFormValues, AddNewBoardMember } from "./types";
import { addBoardMemberFormSchema } from "./types";
import { TipTapEditor } from "@/components/TiptapEditor";
import { improveText } from "@/server/actions/ai/improveText";
import { toast } from "sonner";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddBoardMemberDialog({
  onAddBoardMember,
}: {
  onAddBoardMember: (boardMember: AddNewBoardMember) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const form = useForm<AddBoardMembersFormValues>({
    resolver: zodResolver(addBoardMemberFormSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      bioEn: "",
      bioAr: "",
      file: undefined,
      type: "board",
      country: "all",
    },
  });

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
      form.trigger("file");
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
      await onAddBoardMember({
        ...values,
      });
      form.reset();
      setPreview(null);
      setOpen(false);
    } catch (error) {
      console.error("Failed to add story:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Board Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Board Member</DialogTitle>
          <DialogDescription>
            Create a new board member to be displayed on the website.
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
                      <Input placeholder="Enter Arabic title" {...field} />
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
                              src={preview}
                              alt="Preview"
                              height={160}
                              width={160}
                              className="max-h-40 w-full rounded-md object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload an image for this story
                    </FormDescription>
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
                    Uploading...
                  </>
                ) : (
                  "Add Board Member"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
