"use client";
import React, { useState } from "react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { Play } from "lucide-react";
import { translations } from "./translations";

export const VideoSection = ({ locale }: { locale: Locale }) => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <section className="py-16 bg-gray-50" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-semibold text-center text-primary mb-8">
          {translations.video.title[locale]}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-video bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
              <iframe
                src="https://drive.google.com/file/d/1pNG2124NcWwSvV3LuLmlhj8XtwJ2X7w1/preview"
                width="1065"
                height="100%"
                allow="autoplay"
              ></iframe>{" "}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
