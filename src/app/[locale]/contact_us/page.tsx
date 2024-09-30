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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://yallakafala.org/contact",
      siteName: "Yalla Kafala",
      images: [
        {
          url: "https://yallakafala.org/images/contact.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: "website",
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
