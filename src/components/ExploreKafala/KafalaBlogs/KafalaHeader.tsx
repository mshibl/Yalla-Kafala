import { useLocale } from "@/components/Providers/LocaleProvider";
import type { StoryCategory } from "@/lib/types";
import PageHeader from "@/components/ui/PageHeader";
import { translations } from "./translations";
export const KafalaHeader = ({ category }: { category: StoryCategory }) => {
  const locale = useLocale();
  return (
    <PageHeader
      className="mb-12"
      width="max-w-4xl"
      eyebrow={translations.eyebrow[category][locale]}
      title={translations.title[category][locale]}
      lede={translations.description[category][locale]}
    />
  );
};

export default KafalaHeader;
