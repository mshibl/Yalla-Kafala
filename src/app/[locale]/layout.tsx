import "@/styles/globals.css";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
// import Navbar from "@/src/components/Navbar";
// import AppFooter from "@/src/components/AppFooter";
import Script from "next/script";
import { PostHogProvider } from "@/components/Providers/PostHogProvider";
import Navbar from "@/components/AppHeader";
import Footer from "@/components/AppFooter";
import { Toaster } from "@/components/ui/sonner";
import { LocaleProvider } from "@/components/Providers/LocaleProvider";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { Providers } from "@/components/Providers";
export async function generateViewport({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Viewport> {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === "ar";

  const title = isArabic ? "يلا كفالة" : "Yalla Kafala";
  const description = isArabic
    ? "يلا كفالة هي منظمة غير حكومية تحول حالة الطفل في مصر من خلال الكفالة (الحماية/التبني). مع مكاتب في مصر وسان فرانسيسكو ، نحن نقدم خيارات الرعاية المبتكرة ، خدمات الدعم ، والدعم المتطوع للأيتام."
    : "Yalla Kafala is an NGO transforming child welfare in Egypt through Kafala (guardianship/adoption). With offices in Egypt and San Francisco, we offer innovative care alternatives, support services, and advocacy for orphans.";

  const url = `https://yallakafala.org/${locale}`;
  const imageUrl = "https://yallakafala.org/images/yk-team-1.webp";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
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
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@YallaKafala",
    },
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
    },
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

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <html dir={locale === "en" ? "ltr" : "rtl"} lang={locale}>
      <head>
        <Script
          src="https://secure.givelively.org/widgets/branded_donation/yalla-kafala.js"
          strategy="lazyOnload"
          async={true}
        />
      </head>
      <GoogleTagManager gtmId="GTM-W8P5HTS6" />
      <body>
        <Providers locale={locale}>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer locale={locale} />
          </div>
          <Toaster
            toastOptions={{
              style: {
                background: "white",
              },
            }}
          />
        </Providers>
      </body>
      <GoogleAnalytics gaId="GTM-W8P5HTS6" />
    </html>
  );
}

export async function generateStaticParams() {
  // Putting this here means all pages will be generated for both locales. If this function is put in the page, it will only statically generate that page
  return [{ locale: "en" }, { locale: "ar" }];
}
