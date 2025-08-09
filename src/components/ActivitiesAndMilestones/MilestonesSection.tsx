"use client";

import React from "react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface MilestonesSectionProps {
  locale: Locale;
}

const MilestonesSection = ({ locale }: MilestonesSectionProps) => {
  const milestones = translations.milestones.map((milestone) => ({
    year: milestone.year,
    title: milestone.title[locale],
    description: milestone.description[locale],
    image: milestone.image,
    position: milestone.position,
  }));

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <Flag className="text-primary w-8 h-8" />
            <h2 className="text-3xl font-serif font-bold text-gray-800">
              {translations.sections.milestones[locale]}
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2 z-0" />

            <div className="space-y-24">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative flex items-center",
                    milestone.position === "left"
                      ? "flex-row"
                      : "flex-row-reverse",
                  )}
                >
                  <div className="absolute left-1/2 w-4 h-4 rounded-full bg-primary -translate-x-1/2 z-10" />

                  <div
                    className={cn(
                      "w-1/2 px-6",
                      milestone.position === "left"
                        ? "pr-12 text-right"
                        : "pl-12 text-left",
                    )}
                  >
                    <p className="text-primary-600 font-bold mb-2">
                      {milestone.year}
                    </p>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>

                  <div
                    className={cn(
                      "w-1/2 px-6",
                      milestone.position === "left" ? "pl-12" : "pr-12",
                    )}
                  >
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="w-full h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MilestonesSection;
