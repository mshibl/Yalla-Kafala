import React from "react";
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
  layout = member.imageUrl ? "card" : "line",
}: {
  member: BoardMember;
  locale: Locale;
  /** card: portrait tile; row: small portrait beside the name; line: name only. */
  layout?: "card" | "row" | "line";
}) => {
  const name = locale === "ar" ? member.nameAr : member.nameEn;
  const bio = locale === "ar" ? member.bioAr : member.bioEn;
  const initials = name
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("");
  const role =
    member.type === "advisor"
      ? locale === "ar"
        ? "عضو اللجنة الاستشارية"
        : "Advisory committee"
      : locale === "ar"
        ? "عضو مجلس الإدارة"
        : "Board member";

  return (
    <Dialog>
      <DialogTrigger asChild>
        {layout === "card" ? (
          <button
            type="button"
            className="group w-full overflow-hidden rounded-2xl bg-white text-start shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="relative aspect-[4/5] bg-primary/5">
              <Avatar className="absolute inset-0 h-full w-full rounded-none">
                {member.imageUrl ? (
                  <AvatarImage
                    src={member.imageUrl}
                    alt={name}
                    className="object-cover object-[center_25%]"
                  />
                ) : null}
                <AvatarFallback className="rounded-none bg-[#F3E8F5] font-serif text-5xl font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* One light shared tint, so photos from different sources read as a set. */}
              <div className="pointer-events-none absolute inset-0 bg-primary/[0.05] mix-blend-multiply" />
            </div>
            <div className="p-4">
              <h3 className="mb-1 font-sans text-base font-semibold leading-snug text-gray-900">
                {name}
              </h3>
              <p className="text-sm text-gray-600">
                {role}
                <span aria-hidden="true"> · </span>
                <span className="font-medium text-primary group-hover:underline">
                  {locale === "ar" ? "النبذة" : "Read bio"}
                </span>
              </p>
            </div>
          </button>
        ) : layout === "row" ? (
          <button
            type="button"
            className="group flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-start shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Avatar className="h-20 w-20 shrink-0">
              {member.imageUrl ? (
                <AvatarImage
                  src={member.imageUrl}
                  alt={name}
                  className="object-cover object-[center_25%]"
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span>
              <span className="block text-base font-semibold text-gray-900">
                {name}
              </span>
              <span className="block text-sm text-gray-600 [&>span]:whitespace-nowrap">
                {role}
                <span aria-hidden="true"> · </span>
                <span className="font-medium text-primary group-hover:underline">
                  {locale === "ar" ? "النبذة" : "Read bio"}
                </span>
              </span>
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#FBF8F4] px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-200 hover:text-primary"
          >
            {name}
            <span className="font-medium text-primary">
              {locale === "ar" ? "النبذة" : "Read bio"}
            </span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">
            {name}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 min-w-0">
          <div className="flex min-w-0 flex-col items-start gap-6 sm:flex-row">
            <Avatar className="h-24 w-24 shrink-0">
              {member.imageUrl ? (
                <AvatarImage src={member.imageUrl} alt={name} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div
              dangerouslySetInnerHTML={{ __html: bio }}
              className="max-h-[55vh] min-w-0 flex-1 overflow-y-auto break-words pe-2 leading-relaxed text-gray-700 [&_p]:mb-4 [&_p:last-child]:mb-0"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
