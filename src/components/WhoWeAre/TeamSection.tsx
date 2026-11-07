import React from "react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { BoardMemberCard } from "./BoardMemberCard";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { featuredBoardMembers } from "./teamHighlights";
import type { BoardMember } from "@/lib/types";

const normalizeName = (name: string) =>
  name.toLocaleLowerCase().replace(/[^a-z0-9\u0600-\u06ff]/g, "");

const mergeByName = (featured: BoardMember[], current: BoardMember[]) => {
  const seen = new Set<string>();
  return [...featured, ...current].filter((member) => {
    const key = normalizeName(member.nameEn);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const TeamSection = async ({ locale }: { locale: Locale }) => {
  const boardMembers = await fetchQuery(
    api.boardMembers.queries.getBoardMembers,
    { publishedOnly: true },
  );

  const currentBoardMembers = (boardMembers ?? []).filter(
    (member) => member.type === "board",
  );
  const advisors = (boardMembers ?? []).filter(
    (member) => member.type === "advisor",
  );
  // The founder has her own section just above, so the grid leaves her out.
  const founderKey = normalizeName(translations.founder.name.en);
  const allBoardMembers = mergeByName(featuredBoardMembers, currentBoardMembers)
    .filter((member) => normalizeName(member.nameEn) !== founderKey)
    // Portraits first, so a monogram never leads the grid.
    .sort((a, b) => Number(!a.imageUrl) - Number(!b.imageUrl));

  return (
    <section
      id="our-team"
      className="bg-white py-16 md:py-20"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6">
        <h2 className="heading-lg mb-10 text-center text-gray-900">
          {translations.team.title[locale]}
        </h2>

        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <h3 className="mb-5 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
              {translations.team.sections.boardMembers[locale]}
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {allBoardMembers.map((member) => (
                <BoardMemberCard
                  key={member.id}
                  member={member}
                  locale={locale}
                />
              ))}
            </div>
          </div>

          {advisors.length > 0 && (
            <div>
              <h3 className="mb-5 font-sans text-sm font-semibold uppercase tracking-wider text-gray-900">
                {translations.team.sections.advisoryCommittee[locale]}
              </h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {advisors.map((member) => (
                  <BoardMemberCard
                    key={member.id}
                    member={member}
                    locale={locale}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
