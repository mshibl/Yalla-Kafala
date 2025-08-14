import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FAQ } from "@/lib/types";
import type { Locale } from "@/components/Providers/LocaleProvider";

export const FaqsList = ({ faqs, locale }: { faqs: FAQ[]; locale: Locale }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border-b border-gray-200 last:border-b-0"
        >
          <AccordionTrigger className="cursor-pointer text-left font-medium text-gray-800 py-5 hover:text-primary transition-colors">
            <div
              dangerouslySetInnerHTML={{
                __html: locale === "ar" ? item.questionAr : item.questionEn,
              }}
            />
          </AccordionTrigger>
          <AccordionContent className="text-gray-600 pb-5">
            <div
              dangerouslySetInnerHTML={{
                __html: locale === "ar" ? item.answerAr : item.answerEn,
              }}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
