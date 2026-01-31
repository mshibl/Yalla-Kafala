"use client";
import { useLocale } from "@/components/Providers/LocaleProvider";
import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";
import { ExternalLink, FileText } from "lucide-react";
import React from "react";
import { translations } from "./translations";
import { CopyResourceLinkButton } from "./CopyResourceLinkButton";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 min-w-0">
                  {locale === "ar"
                    ? resource.nameAr || resource.nameEn
                    : resource.nameEn}
                </h3>
                <CopyResourceLinkButton
                  href={`/${locale}/resources/${resource.slug}`}
                  buttonLabel={translations.copyLink[locale]}
                  successLabel={translations.copySuccess[locale]}
                  errorLabel={translations.copyError[locale]}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`${resource.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80"
            >
              {translations.view[locale]}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourcesList;
