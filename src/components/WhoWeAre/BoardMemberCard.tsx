import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Locale } from "@/components/Providers/LocaleProvider";
import type { BoardMember } from "@/lib/types";

export const BoardMemberCard = ({
  member,
  locale,
}: {
  member: BoardMember;
  locale: Locale;
}) => {
  const name = locale === "ar" ? member.nameAr : member.nameEn;
  const bio = locale === "ar" ? member.bioAr : member.bioEn;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div className="relative pt-[100%] bg-gray-100">
            <Avatar className="absolute inset-0 w-full h-full rounded-none">
              <AvatarImage
                src={member.imageUrl}
                alt={name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-none text-4xl font-semibold">
                {name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardContent className="p-4 bg-white">
            <h3 className="font-semibold text-lg text-primary mb-1">{name}</h3>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="bg-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">
            {name}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={member.imageUrl} alt={name} />
              <AvatarFallback className="text-2xl">
                {name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div
              dangerouslySetInnerHTML={{ __html: bio }}
              className="text-gray-700 flex-1"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
