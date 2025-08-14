import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/components/Providers/LocaleProvider";
export default function BackToStoriesButton({ locale }: { locale: Locale }) {
  return (
    <Link href={`/${locale}/kafala-stories`}>
      <Button variant="outline" className="flex items-center gap-2 w-full">
        {locale === "en" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
        {locale === "en" ? "Back to Stories" : "رجوع إلى القصص"}
      </Button>
    </Link>
  );
}
