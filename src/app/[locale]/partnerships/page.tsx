import ErrorBoundary from "@/src/components/ErrorBoundary";
import LoadingFallback from "@/src/components/LoadingFallback";
import Partnerships from "@/src/components/Partnerships";
import { Metadata } from "next";
import { Suspense } from "react";
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "شراكاتنا" : "Our Partnerships";
  const description = isArabic
    ? "تعمل يلا كفالة بالتعاون مع وزارة التضامن الاجتماعي واللجان المحلية في مختلف المحافظات لدعم الأسر الكافلة وتحسين رعاية الأيتام. نعتز بتعاوننا مع مؤسسات المجتمع المدني والشركات لتوفير حياة أفضل للأطفال."
    : "Yalla Kafala collaborates with the Ministry of Social Solidarity and local committees across various governorates to support kafala families and improve orphan care. We take pride in our partnerships with civil society organizations and companies to provide a better life for children.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://yallakafala.org/partnerships",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/partnerships.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: "website",
    },
  };
}

const PartnershipsPage = ({
  params: { locale },
}: {
  params: { locale: string };
}) => {
  return (
    <ErrorBoundary locale={locale}>
      <Suspense fallback={<LoadingFallback />}>
        <Partnerships locale={locale} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default PartnershipsPage;
