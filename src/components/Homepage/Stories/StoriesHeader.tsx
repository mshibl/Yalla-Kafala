import { useLocale } from "@/components/Providers/LocaleProvider";
import React from "react";
import { translations } from "./translations";

interface StoriesHeaderProps {
  headingRef: React.Ref<HTMLHeadingElement>;
  descRef: React.Ref<HTMLParagraphElement>;
}

const StoriesHeader: React.FC<StoriesHeaderProps> = ({
  headingRef,
  descRef,
}) => {
  const locale = useLocale();
  return (
    <div className="max-w-3xl mx-auto text-center mb-16">
      <h2
        ref={headingRef}
        className="heading-md text-primary mb-6 opacity-0 translate-y-10 transition-all duration-700 ease-out"
      >
        {translations.stories.title[locale]}
      </h2>
      <p
        ref={descRef}
        className="text-gray-600 text-lg opacity-0 translate-y-10 transition-all duration-700 ease-out"
      >
        {translations.stories.description[locale]}
      </p>
    </div>
  );
};

export default StoriesHeader;
