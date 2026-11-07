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
    showAll: (total: number) => `Show all ${total} questions`,
  },
  ar: {
    search: "ابحث في الأسئلة",
    count: (shown: number, total: number) =>
      shown === total ? `${total} سؤالاً` : `${shown} من ${total} سؤالاً`,
    none: "لا يوجد سؤال يطابق بحثك.",
    showAll: (total: number) => `عرض كل الأسئلة (${total})`,
  },
};

const FIRST = 12;

const stripTags = (html: string) => html.replace(/<[^>]+>/g, " ");

/** The FAQs as one searchable, numbered accordion. */
const FAQsSearchList = ({ faqs, locale }: { faqs: Faq[]; locale: Locale }) => {
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
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
  const matches = needle
    ? items.filter((item) =>
        `${item.question} ${stripTags(item.answer)}`
          .toLowerCase()
          .includes(needle),
      )
    : items;
  // A long list starts with the first questions; search always covers all.
  const shown = needle || showAll ? matches : matches.slice(0, FIRST);

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
          {t.count(matches.length, items.length)}
        </p>
      </div>

      {matches.length === 0 ? (
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
                <span className="text-start text-base font-semibold leading-snug text-gray-900">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 pt-0 text-gray-700 md:px-6">
                <div
                  className="prose prose-gray max-w-none text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {shown.length < matches.length && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="outline-button font-semibold"
          >
            {t.showAll(matches.length)}
          </button>
        </div>
      )}
    </div>
  );
};

export default FAQsSearchList;
