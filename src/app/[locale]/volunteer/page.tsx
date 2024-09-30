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
        },
      ],
      locale,
      type: "website",
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
