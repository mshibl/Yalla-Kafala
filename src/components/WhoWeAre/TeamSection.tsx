import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User } from "lucide-react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { BoardMemberCard } from "./BoardMemberCard";
import { egyptTeamMembers, usaTeamMembers } from "./teamData";

export const TeamSection = ({ locale }: { locale: Locale }) => {
  return (
    <section
      id="our-team"
      className="py-16 bg-white"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold text-center text-primary mb-8">
          {translations.team.title[locale]}
        </h2>

        <Tabs
          defaultValue="egypt"
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <TabsList
              className="bg-white shadow-sm"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <TabsTrigger value="egypt" className="px-8">
                {translations.team.tabs.egyptTeam[locale]}
              </TabsTrigger>
              <TabsTrigger value="usa" className="px-8">
                {translations.team.tabs.usaTeam[locale]}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="egypt" className="mt-6">
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                <User className="w-5 h-5 me-2" />
                {translations.team.sections.boardMembers[locale]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {egyptTeamMembers
                  .filter((member) => member.type === "board")
                  .map((member, index) => (
                    <BoardMemberCard
                      key={index}
                      member={member}
                      locale={locale}
                    />
                  ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                <User className="w-5 h-5 me-2" />
                {translations.team.sections.advisoryCommittee[locale]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {egyptTeamMembers
                  .filter((member) => member.type === "advisory")
                  .map((member, index) => (
                    <BoardMemberCard
                      key={index}
                      member={member}
                      locale={locale}
                    />
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="usa" className="mt-6">
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                <User className="w-5 h-5 me-2" />
                {translations.team.sections.boardMembers[locale]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usaTeamMembers
                  .filter((member) => member.type === "board")
                  .map((member, index) => (
                    <BoardMemberCard
                      key={index}
                      member={member}
                      locale={locale}
                    />
                  ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                <User className="w-5 h-5 me-2" />
                {translations.team.sections.advisoryCommittee[locale]}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usaTeamMembers
                  .filter((member) => member.type === "advisory")
                  .map((member, index) => (
                    <BoardMemberCard
                      key={index}
                      member={member}
                      locale={locale}
                    />
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
