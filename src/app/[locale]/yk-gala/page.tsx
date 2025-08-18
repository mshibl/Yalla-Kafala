import type { Locale } from "@/components/Providers/LocaleProvider";
import YallaKafalaGala from "@/components/YKGala";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title:
      locale === "ar" ? "YK Gala - Yalla Kafala" : "YK Gala - Yalla Kafala",
    description:
      locale === "ar"
        ? "انضم إلينا في حفل YK Gala السنوي لدعم أطفال الأيتام"
        : "Join us for the annual YK Gala to support orphaned children",
    openGraph: {
      title:
        locale === "ar" ? "YK Gala - Yalla Kafala" : "YK Gala - Yalla Kafala",
      description:
        locale === "ar"
          ? "انضم إلينا في حفل YK Gala السنوي لدعم أطفال الأيتام"
          : "Join us for the annual YK Gala to support Kafala children",
      images: [
        {
          url: "https://yallakafala.org/images/invitation.webp",
          width: 1200,
          height: 630,
          alt: locale === "ar" ? "YK Gala دعوة" : "YK Gala Invitation",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        locale === "ar" ? "YK Gala - Yalla Kafala" : "YK Gala - Yalla Kafala",
      description:
        locale === "ar"
          ? "انضم إلينا في حفل YK Gala السنوي لدعم أطفال الأيتام"
          : "Join us for the annual YK Gala to support Kafala children",
      images: ["/images/invitation.webp"],
    },
  };
}

export default async function YKGalaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <YallaKafalaGala locale={locale} />;
}
