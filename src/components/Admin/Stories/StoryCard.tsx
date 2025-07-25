import React from "react";
import { Button } from "@/components/ui/button";
import type { StoryCardProps } from "./types";
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
import { EditStoryDialog } from "./EditStory";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Trash2, Eye, EyeOff, Star, StarOff, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onUpdate,
  onDelete,
  showArabic,
}) => {
  const handlePublishToggle = async (publish: boolean) => {
    await onUpdate({
      ...story,
      publish,
    });
  };

  return (
    <div className="group relative rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between p-4">
        <div className="flex-1">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base">
                {showArabic ? story.titleAr : story.titleEn}
              </h3>
              {story.featured && (
                <Badge variant="default" className="bg-amber-500">
                  <Star className="h-3 w-3 mr-1" /> Featured
                </Badge>
              )}
              {!story.publish && (
                <Badge variant="outline" className="text-muted-foreground">
                  Draft
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {showArabic ? story.descriptionAr : story.descriptionEn}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              id={`publish-${story.id}`}
              checked={story.publish}
              onCheckedChange={handlePublishToggle}
            />
            <Label htmlFor={`publish-${story.id}`} className="text-sm">
              {story.publish ? (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Published</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <EyeOff className="h-4 w-4" />
                  <span className="hidden sm:inline">Draft</span>
                </div>
              )}
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <EditStoryDialog story={story} onUpdate={onUpdate} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this story.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(story.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};
