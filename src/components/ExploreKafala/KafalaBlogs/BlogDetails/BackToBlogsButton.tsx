import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { STORY_ROUTES, type StoryCategory } from "@/lib/types";
import { translations } from "../translations";
export default function BackToBlogsButton({
  locale,
  category = "blog",
}: {
  locale: Locale;
  category?: StoryCategory;
}) {
  return (
    <Link href={`/${locale}/${STORY_ROUTES[category]}`}>
      <Button variant="outline" className="flex items-center gap-2 w-full">
        {locale === "en" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        {translations.backTo[category][locale]}
      </Button>
    </Link>
  );
}
