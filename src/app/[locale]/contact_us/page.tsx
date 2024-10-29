import ContactUsForm from "@/src/components/ContactUsForm";
import { Metadata } from "next";
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isArabic = locale === "ar";

  const title = isArabic ? "اتصل بنا" : "Contact Us";
  const description = isArabic
    ? "تواصل معنا لأي استفسارات أو معلومات حول يلا كفالة. نحن هنا لمساعدتك!"
    : "Reach out to us for any inquiries or information about Yalla Kafala. We are here to help!";

  const url = `https://yallakafala.org/${locale}/contact`;
  const imageUrl = "https://yallakafala.org/images/contact.jpg";

  return {
    title,
    description,
    alternates: {
      languages: {
        en: "/en/contact",
        ar: "/ar/contact",
      },
    },
    keywords: isArabic
      ? ["اتصل بنا", "كفالة", "دعم", "استفسارات", "مساعدة"]
      : ["contact us", "kafala", "support", "inquiries", "help"],
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
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
          alt: isArabic ? "اتصل بنا - يلا كفالة" : "Contact Us - Yalla Kafala",
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
      "og:image:secure_url": imageUrl, // WhatsApp specific
      "fb:pages": "469771757195549", // Facebook Page ID
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

const ContactUsPage = ({
  params: { locale },
}: {
  params: { locale: "ar" | "en" };
}) => {
  return <ContactUsForm locale={locale} />;
};

export default ContactUsPage;
