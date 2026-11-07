import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "@/components/Providers/LocaleProvider";

interface BlogsNavigationProps {
  activeIndex: number;
  blogsLength: number;
  onPrev: () => void;
  onNext: () => void;
}

const BlogsNavigation: React.FC<BlogsNavigationProps> = ({
  activeIndex,
  blogsLength,
  onPrev,
  onNext,
}) => {
  const locale = useLocale();
  return (
    <div className="flex items-center justify-center mt-10 gap-4">
      <button
        onClick={locale === "ar" ? onNext : onPrev}
        className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-primary transition-colors"
        aria-label="Previous blog"
      >
        {locale === "ar" ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
      </button>
      <div
        className="flex min-w-[5rem] items-center justify-center gap-1 font-medium tabular-nums text-gray-600"
        aria-live="polite"
      >
        <span className="text-primary">{activeIndex + 1}</span>
        <span aria-hidden="true">/</span>
        <span>{blogsLength}</span>
      </div>
      <button
        onClick={locale === "ar" ? onPrev : onNext}
        className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-primary transition-colors"
        aria-label="Next blog"
      >
        {locale === "ar" ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
      </button>
    </div>
  );
};
export default BlogsNavigation;
