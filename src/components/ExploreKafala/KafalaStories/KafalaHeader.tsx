import { useLocale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
export const KafalaHeader = () => {
  const locale = useLocale();
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 text-center">
        {translations.title[locale]}
      </h1>
      <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
      <p className="text-gray-600 text-center max-w-3xl mx-auto">
        {translations.description[locale]}
      </p>
    </div>
  );
};

export default KafalaHeader;
