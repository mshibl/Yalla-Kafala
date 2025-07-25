"use client";
import React, { useEffect, useRef, useState } from "react";
import type { Story } from "@/lib/types";
import StoryCard from "./StoryCard";
import StoriesHeader from "./StoriesHeader";
import StoriesNavigation from "./StoriesNavigation";
import { useLocale } from "@/components/Providers/LocaleProvider";

const StoriesClient = ({ stories }: { stories: Story[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const locale = useLocale();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-0", "translate-y-10");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (headingRef.current) observer.observe(headingRef.current);
    if (descRef.current) observer.observe(descRef.current);

    storyRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const nextStory = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % stories.length);
  };

  const prevStory = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + stories.length) % stories.length,
    );
  };
  if (stories.length === 0) return null;

  return (
    <section
      id="stories"
      className="section-padding bg-gradient-to-b from-gray-50 to-gray-100"
    >
      <div className="container mx-auto">
        <StoriesHeader headingRef={headingRef} descRef={descRef} />
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden relative rounded-xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(${locale === "en" ? "-" : ""}${activeIndex * 100}%)`,
              }}
            >
              {stories.map((story, index) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  cardRef={(el) => {
                    storyRefs.current[index] = el;
                  }}
                  index={index}
                />
              ))}
            </div>
          </div>
          <StoriesNavigation
            activeIndex={activeIndex}
            storiesLength={stories.length}
            onPrev={prevStory}
            onNext={nextStory}
            onDotClick={setActiveIndex}
          />
        </div>
      </div>
    </section>
  );
};

export default StoriesClient;
