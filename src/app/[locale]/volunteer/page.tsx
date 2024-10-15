import VolunteerForm from "@/src/components/VolunteerForm";
import { Metadata } from "next";
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "تطوع معنا" : "Volunteer with us";
  const description = isArabic
    ? "انضم إلينا كمتطوع وساهم في تحسين حياة الأيتام في مصر. تعبئة النموذج أدناه للتسجيل."
    : "Join us as a volunteer and help improve the lives of orphans in Egypt. Fill out the form below to register.";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: `/en/volunteer`,
        ar: `/ar/volunteer`,
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
      url: "https://yallakafala.org/volunteer",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/volunteer.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: isArabic ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://yallakafala.org/images/volunteer.jpg"],
      creator: "@YallaKafala",
    },
    robots: {
      index: true,
      follow: true,
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:secure_url": "https://yallakafala.org/images/volunteer.jpg",
      "og:locale": isArabic ? "ar_EG" : "en_US",
      "og:locale:alternate": isArabic ? "en_US" : "ar_EG",
    },
  };
}

const VolunteerPage = ({
  params: { locale },
}: {
  params: { locale: "ar" | "en" };
}) => {
  return <VolunteerForm locale={locale} />;
};

export default VolunteerPage;
