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
            {!videoPlaying ? (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={() => setVideoPlaying(true)}
              >
                <img
                  src="/placeholder.svg"
                  alt="Video thumbnail"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-10 bg-primary/90 rounded-full p-4 hover:bg-primary transition-colors duration-300">
                  <Play className="w-12 h-12 text-white" fill="white" />
                </div>
                <div className="absolute bottom-6 left-6 z-10">
                  <h3 className="text-xl font-medium text-white">
                    {translations.video.thumbnailTitle[locale]}
                  </h3>
                  <p className="text-white/80">
                    {translations.video.watchLabel[locale]}
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                <p>Video player would be embedded here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
