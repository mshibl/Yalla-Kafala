"use client";
import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Locale } from "@/components/Providers/LocaleProvider";

type Faq = {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
};

const copy = {
  en: {
    search: "Search the questions",
    count: (shown: number, total: number) =>
      shown === total ? `${total} questions` : `${shown} of ${total} questions`,
    none: "No question matches your search.",
  },
  ar: {
    search: "ابحث في الأسئلة",
    count: (shown: number, total: number) =>
      shown === total ? `${total} سؤالاً` : `${shown} من ${total} سؤالاً`,
    none: "لا يوجد سؤال يطابق بحثك.",
  },
};

const stripTags = (html: string) => html.replace(/<[^>]+>/g, " ");

/** The FAQs as one searchable, numbered accordion. */
const FAQsSearchList = ({ faqs, locale }: { faqs: Faq[]; locale: Locale }) => {
  const [query, setQuery] = useState("");
  const t = copy[locale];
  const items = useMemo(
    () =>
      faqs.map((faq, index) => ({
        index,
        question: locale === "en" ? faq.questionEn : faq.questionAr,
        answer: locale === "en" ? faq.answerEn : faq.answerAr,
      })),
    [faqs, locale],
  );
  const needle = query.trim().toLowerCase();
  const shown = needle
    ? items.filter((item) =>
        `${item.question} ${stripTags(item.answer)}`
          .toLowerCase()
          .includes(needle),
      )
    : items;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">{t.search}</span>
          <Search
            className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            className="w-full rounded-full border border-gray-200 bg-white py-3 pe-4 ps-12 text-base text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </label>
        <p className="text-sm text-gray-600">
          {t.count(shown.length, items.length)}
        </p>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl bg-white p-6 text-center text-gray-600 shadow-sm">
          {t.none}
        </p>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-3">
          {shown.map((item) => (
            <AccordionItem
              key={item.index}
              value={`item-${item.index}`}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="gap-4 px-5 py-4 text-start hover:no-underline md:px-6">
                <span className="flex items-start gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary tabular-nums">
                    {item.index + 1}
                  </span>
                  <span className="text-start text-base font-semibold leading-snug text-gray-900">
                    {item.question}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 pt-0 text-gray-700 md:px-6">
                <div
                  className="prose prose-gray max-w-none ps-11 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default FAQsSearchList;
