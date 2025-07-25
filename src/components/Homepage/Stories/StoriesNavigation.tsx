import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/Providers/LocaleProvider";

interface StoriesNavigationProps {
  activeIndex: number;
  storiesLength: number;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}

const StoriesNavigation: React.FC<StoriesNavigationProps> = ({
  activeIndex,
  storiesLength,
  onPrev,
  onNext,
  onDotClick,
}) => {
  const locale = useLocale();
  return (
    <div className="flex justify-center mt-10 gap-4">
      <button
        onClick={locale === "ar" ? onNext : onPrev}
        className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-primary transition-colors"
        aria-label="Previous story"
      >
        {locale === "ar" ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
      </button>
      <div className="flex gap-2">
        {Array.from({ length: storiesLength }).map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === activeIndex ? "bg-primary scale-125" : "bg-gray-300",
            )}
            aria-label={`Go to story ${index + 1}`}
          />
        ))}
      </div>
      <button
        onClick={locale === "ar" ? onPrev : onNext}
        className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-primary transition-colors"
        aria-label="Next story"
      >
        {locale === "ar" ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
      </button>
    </div>
  );
};
export default StoriesNavigation;
