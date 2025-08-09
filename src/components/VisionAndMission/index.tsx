"use client";
import React from "react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";

type ValueKey = "inclusion" | "community" | "collaboration" | "compassion";

interface ValueItem {
  key: ValueKey;
  icon: string;
  emoji: string;
}

const VisionMission = ({ locale }: { locale: Locale }) => {
  // Values data with icons mapping
  const values: ValueItem[] = [
    {
      key: "inclusion",
      icon: "Inclusion",
      emoji: "🌍",
    },
    {
      key: "community",
      icon: "Community",
      emoji: "👪",
    },
    {
      key: "collaboration",
      icon: "Collaboration",
      emoji: "🤝",
    },
    {
      key: "compassion",
      icon: "Compassion",
      emoji: "❤️",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-white pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-[20%] right-[5%] w-64 h-64 rounded-full bg-primary/5 animate-float"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-[40%] left-[10%] w-48 h-48 rounded-full bg-secondary/5 animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-[10%] right-[15%] w-40 h-40 rounded-full bg-primary/5 animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-6">
              {translations.header.title[locale]}
            </h1>
            <p className="text-gray-700 text-lg mb-8">
              {translations.vision.description[locale]}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#vision" className="outline-button">
                {translations.vision.title[locale]}
              </a>
              <a href="#values" className="primary-button">
                {translations.values.title[locale]}
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </section>

      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-6">
            {/* Vision Section */}
            <div id="vision" className="max-w-4xl mx-auto mb-20">
              <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-xl shadow-md">
                <div className="md:w-1/3 flex flex-col items-center text-center">
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    {translations.vision.title[locale]}
                  </h2>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-primary text-2xl">✨</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-lg text-gray-700">
                    {translations.vision.description[locale]}
                  </p>
                </div>
              </div>
            </div>

            {/* Mission Section */}
            <div id="mission" className="max-w-4xl mx-auto mb-20">
              <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 rounded-xl shadow-md">
                <div className="md:w-1/3 flex flex-col items-center text-center">
                  <h2 className="text-2xl font-bold text-primary mb-4">
                    {translations.mission.title[locale]}
                  </h2>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <span className="text-primary text-2xl">🎯</span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-lg text-gray-700 mb-4">
                    {translations.mission.description1[locale]}
                  </p>
                  <p className="text-lg text-gray-700">
                    {translations.mission.description2[locale]}
                  </p>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div id="values" className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-10 text-center">
                {translations.values.title[locale]}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value) => (
                  <div
                    key={value.key}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <span className="text-primary text-2xl">
                          {value.emoji}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-primary">
                        {translations.values[value.key].title[locale]}
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      {translations.values[value.key].description[locale]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VisionMission;
