"use client";

import React from "react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AchievementsSectionProps {
  locale: Locale;
}

const AchievementsSection = ({ locale }: AchievementsSectionProps) => {
  const achievements = translations.achievements.map((achievement) => ({
    count: achievement.count,
    title: achievement.title[locale],
    description: achievement.description[locale],
  }));

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <Award className="text-primary w-8 h-8" />
            <h2 className="text-3xl font-serif font-bold text-gray-800">
              {translations.sections.achievements[locale]}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card
                key={index}
                className="text-center bg-white hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-primary text-4xl font-bold">
                    {achievement.count}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-bold mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-700">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
