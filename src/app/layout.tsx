import "@/src/utils/global.css";
import { Metadata } from "next";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";


// This  top function runs automatically for every page that uses this layout. It receives the locale from the URL (like /en or /ar)
// It returns an object containing the metadata (title, description, image, etc.)

  const title = isArabic ? "يلا كفالة" : "Yalla Kafala";
  const description = isArabic
    ? "يلا كفالة هي منظمة غير حكومية تحول حالة الطفل في مصر من خلال الكفالة (الحماية/التبني). مع مكاتب في مصر وسان فرانسيسكو ، نحن نقدم خيارات الرعاية المبتكرة ، خدمات الدعم ، والدعم المتطوع للأيتام."
    : "Yalla Kafala is an NGO transforming child welfare in Egypt through Kafala (guardianship/adoption). With offices in Egypt and San Francisco, we offer innovative care alternatives, support services, and advocacy for orphans.";

  const url = `https://yallakafala.org/${locale}`;
  const imageUrl = "https://yallakafala.org/images/yk-team-1.jpg";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
    // alternates is to tell search engines en and ar versions exist
    // keywords are to help google understand your content
    keywords: isArabic
      ? [
          "كفالة",
          "تبني",
          "أيتام",
          "مصر",
          "رعاية الأطفال",
          "حماية الطفل",
          "منظمة غير حكومية",
          "دار أيتام",
          "رعاية بديلة",
          "حقوق الطفل",
          "دعم الأطفال",
          "الأسر البديلة",
          "الرعاية الاجتماعية",
          "تمكين الأطفال",
          "العمل الخيري",
          "التطوع في مصر",
          "مساعدة الأطفال المحتاجين",
          "برامج رعاية الأيتام",
          "الأسر الكافلة",
          "حماية الأطفال المعرضين للخطر",
          "التنمية الاجتماعية",
          "الدعم النفسي للأطفال",
          "الرعاية الصحية للأيتام",
          "التعليم للأطفال المحرومين",
          "مؤسسة خيرية للأطفال",
          "يلا كفالة",
          "خدمات الدعم للأيتام",
          "تحسين حياة الأطفال",
          "الحماية الاجتماعية للأطفال",
          "مبادرات رعاية الطفل",
        ]
      : [
          "kafala",
          "adoption",
          "orphans",
          "Egypt",
          "child welfare",
          "child protection",
          "NGO",
          "orphanage",
          "alternative care",
          "children's rights",
          "child support",
          "foster families",
          "social care",
          "child empowerment",
          "charity work",
          "volunteering in Egypt",
          "helping children in need",
          "orphan care programs",
          "sponsoring families",
          "protecting at-risk children",
          "social development",
          "psychological support for children",
          "healthcare for orphans",
          "education for underprivileged children",
          "children's charity foundation",
          "Yalla Kafala",
          "support services for orphans",
          "improving children's lives",
          "social protection for children",
          "child care initiatives",
          "Egyptian adoption",
          "guardianship in Egypt",
          "child advocacy",
          "family-based care",
          "child development programs",
          "community outreach",
          "child poverty alleviation",
          "child rights advocacy",
          "sustainable child care",
          "international adoption in Egypt",
        ],
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
    // viewport makes page responsive on phones
    openGraph: {
      title,
      description,
      url,
      siteName: "Yalla Kafala",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: isArabic
            ? "يلا كفالة - رعاية الأطفال في مصر"
            : "Yalla Kafala - Child Welfare in Egypt",
        },
      ],
      locale: isArabic ? "ar_EG" : "en_US",
      type: "website",
    },
    // Open Graph is for social preview 
    // shows preview card with image, title and description
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@YallaKafala",
    },
    // controls how link looks on twitter 
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:site_name": "Yalla Kafala",
      "og:locale": isArabic ? "ar_EG" : "en_US",
      "og:locale:alternate": isArabic ? "en_US" : "ar_EG",

      // WhatsApp specific
      "og:image:secure_url": imageUrl,

      // Facebook specific (in addition to the facebook object above)
      "fb:pages": "469771757195549", // Replace with your Facebook Page ID
    }, // other metadata (social + search bots)
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
// Since we have a `not-found.tsx` page on the root, a layout file
// is required, even if it's just passing children through.
export default function RootLayout({ children }: Props) {
  return children;
}
