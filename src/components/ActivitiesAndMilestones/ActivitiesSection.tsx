"use client";

import React from "react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { Calendar, Users, Book, Globe, Shield, Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ActivitiesSectionProps {
  locale: Locale;
}

const ActivitiesSection = ({ locale }: ActivitiesSectionProps) => {
  const activityIcons = [
    <Users className="w-5 h-5 text-primary" />,
    <Book className="w-5 h-5 text-primary" />,
    <Globe className="w-5 h-5 text-primary" />,
    <Shield className="w-5 h-5 text-primary" />,
    <Heart className="w-5 h-5 text-primary" />,
  ];

  const activities = translations.activities.map((activity, index) => ({
    title: activity.title[locale],
    description: activity.description[locale],
    content: activity.content[locale],
    icon: activityIcons[index],
  }));

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <Calendar className="text-primary w-8 h-8" />
            <h2 className="text-3xl font-serif font-bold text-gray-800">
              {translations.sections.activities[locale]}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity, index) => (
              <Card
                key={index}
                className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      {activity.icon}
                    </div>
                    <CardTitle className="text-xl">{activity.title}</CardTitle>
                  </div>
                  <CardDescription>{activity.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-gray-700 text-sm">{activity.content}</p>
                  <div className="h-px w-16 bg-primary/20 my-4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
