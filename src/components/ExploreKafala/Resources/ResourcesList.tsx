"use client";
import { useLocale } from "@/components/Providers/LocaleProvider";
import { api } from "@/../convex/_generated/api";
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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {resources.map((resource) => (
        <div
          key={resource.id}
          className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6"
        >
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="font-sans text-lg font-semibold leading-snug text-gray-900">
              {locale === "ar"
                ? resource.nameAr || resource.nameEn
                : resource.nameEn}
            </h3>
          </div>
          <div className="mt-auto flex flex-wrap items-center gap-3">
            <Link
              href={`${resource.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              {translations.view[locale]}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Link>
            <CopyResourceLinkButton
              href={`/${locale}/resources/${resource.slug}`}
              buttonLabel={translations.copyLink[locale]}
              successLabel={translations.copySuccess[locale]}
              errorLabel={translations.copyError[locale]}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourcesList;
