import React from "react";
import StoryCard from "./StoryCard";
import type { Story } from "@/lib/types.js";

interface StoryGridProps {
  stories: Story[];
  storiesRef: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

const StoryGrid = ({ stories, storiesRef }: StoryGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {stories.map((story, index) => (
        <StoryCard
          key={index}
          story={story}
          index={index}
          reference={(el) => {
            storiesRef.current[index] = el;
          }}
        />
      ))}
    </div>
  );
};

export default StoryGrid;
