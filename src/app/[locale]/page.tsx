import Hero from "@/components/Homepage/Hero";
import Mission from "@/components/Homepage/Mission";
import Impact from "@/components/Homepage/Impact/index";
import Blogs from "@/components/Homepage/Blog/index";
import FacebookPosts from "@/components/Homepage/FacebookPosts/index";
import { MakeDifference } from "@/components/Homepage/MakeDifference";
import Donate from "@/components/Homepage/Donate";
import FAQs from "@/components/Homepage/FAQs/index";
import NewsletterPopover from "@/components/Homepage/NewsletterPopover";
import type { Locale } from "@/components/Providers/LocaleProvider";
const HomePage = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  return (
    <>
      <NewsletterPopover />
      <Hero locale={locale} />
      <Mission />
      <Impact locale={locale} />
      <Blogs />
      <FAQs locale={locale} />
      <FacebookPosts locale={locale} />
      {/* <Donate /> */}
    </>
  );
};

export default HomePage;
export const revalidate = 86400; // Revalidates the cache every 24 hours to get the latest posts. The first request after 24 hours will trigger the revalidation.
