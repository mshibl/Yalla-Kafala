"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ActivityCardProps {
  title: string;
  description: string;
  image: string;
  fullDescription: string;
  readMoreLabel: string;
  isRtl: boolean;
}

const ActivityCard = ({
  title,
  description,
  image,
  fullDescription,
  readMoreLabel,
  isRtl,
}: ActivityCardProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="w-[300px] h-[350px] cursor-pointer hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
          <div className="h-40 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <CardHeader className="p-4">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 mt-auto">
            <div className="flex items-center text-primary text-sm font-medium">
              <span>{readMoreLabel}</span>
              {isRtl ? (
                <ArrowLeft className="mr-1 w-4 h-4" />
              ) : (
                <ArrowRight className="ml-1 w-4 h-4" />
              )}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <img
            src={image}
            alt={title}
            className="w-full h-64 object-cover rounded-md mb-4"
          />
          <div className="text-sm text-gray-700 space-y-2">
            {fullDescription.split("\n").map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityCard;
