"use client";
import React, { useEffect, useRef } from "react";
import { MissionCard } from "./MissionCard";
import { translations } from "./translations";
import { useLocale } from "@/components/Providers/LocaleProvider";
import { missionCards } from "./constants";

const Mission = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const locale = useLocale();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            target.classList.add("opacity-100");
            target.classList.remove("opacity-0", "translate-y-10");
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (headingRef.current) observer.observe(headingRef.current);
    if (textRef.current) observer.observe(textRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="mission"
      ref={sectionRef}
      className="section-padding bg-gray-50"
    >
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2
            ref={headingRef}
            className="heading-md text-primary mb-6 opacity-0 translate-y-10 transition-all duration-700 ease-out"
          >
            {translations.mission.title[locale]}
          </h2>
          <p
            ref={textRef}
            className="text-gray-600 text-lg opacity-0 translate-y-10 transition-all duration-700 ease-out"
          >
            {translations.mission.description[locale]}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {missionCards.map((card, index) => (
            <MissionCard
              key={index}
              image={card.image}
              title={card.title[locale]}
              description={card.description[locale]}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission;
