"use client";
import { useLocale } from "@/components/Providers/LocaleProvider";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";
import { ExternalLink, FileText } from "lucide-react";
import React from "react";
import { translations } from "./translations";
import Link from "next/link";

const ResourcesList = () => {
  const resources = useQuery(api.resources.queries.getResources);
  const locale = useLocale();
  if (!resources) return null;
  if (resources.length === 0)
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        {translations.emptyState[locale]}
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {resources.map((resource) => (
        <Link
          key={resource.id}
          href={`${resource.link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold leading-snug text-gray-900 group-hover:text-primary">
              {locale === "ar"
                ? resource.nameAr || resource.nameEn
                : resource.nameEn}
            </h3>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              {translations.view[locale]}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ResourcesList;
