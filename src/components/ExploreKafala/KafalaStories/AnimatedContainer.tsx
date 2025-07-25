"use client";

import React, { useEffect, useRef } from "react";
import KafalaHeader from "./KafalaHeader";
import StoryGrid from "./StoryGrid";
import type { Story } from "@/lib/types.js";

interface AnimatedContainerProps {
  stories: Story[];
}

const AnimatedContainer = ({ stories }: AnimatedContainerProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const storiesRef = useRef<(HTMLDivElement | null)[]>([]);

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

    if (headerRef.current) observer.observe(headerRef.current);
    storiesRef.current.forEach((story) => {
      if (story) observer.observe(story);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container mx-auto px-6">
      <div
        ref={headerRef}
        className="opacity-0 translate-y-10 transition-all duration-700 ease-out"
      >
        <KafalaHeader />
      </div>
      <StoryGrid stories={stories} storiesRef={storiesRef} />
    </div>
  );
};

export default AnimatedContainer;
