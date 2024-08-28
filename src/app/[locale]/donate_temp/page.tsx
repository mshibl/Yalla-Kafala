import ErrorBoundary from "@/src/components/ErrorBoundary";
import { useLocationData } from "@/src/utils/useLocationData";
import { Box, Typography } from "@mui/material";
import HeroImage from "@/src/components/aboutUs/WhoWeAre/heroImage";
import DonationForm from "@/src/components/DonationForm";
import EgyptDonationOptions from "@/src/components/EgyptDonationOptionsNew";

const DonatePage = ({
  params: { locale },
}: {
  params: { locale: "ar" | "en" };
}) => {
  return (
    <ErrorBoundary locale={locale}>
      <HeroImage src="/images/donation_page_hero.png" />
      <Box
        sx={{
          marginX: { xs: "10%", md: "25%" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "24px", md: "45px" },
            fontWeight: "bold",
            marginTop: { xs: "20px", md: "20px" },
            lineHeight: { xs: "32px", md: "61px" },
            color: "primary.main",
          }}
          variant="h2"
        >
          {locale === "en" ? "Transform Lives:" : "تغيير الحياة:"}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "24px", md: "45px" },
            fontWeight: "bold",
            marginBottom: { xs: "10px", md: "20px" },
            lineHeight: { xs: "32px", md: "61px" },
            color: "secondary.main",
          }}
          variant="h2"
        >
          {locale === "en" ? "Your Donations, Their Hope" : "تبرعاتكم، أملهم"}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "16px", md: "24px" },
            lineHeight: { xs: "25px", md: "32px" },
          }}
          variant="body1"
        >
          {locale === "en" ? (
            <>
              Every child deserves a chance to dream, to thrive, to be loved.
              Your donation has the power to make this come true. It&apos;s more
              than a gift; it&apos;s a lifeline. It&apos;s a chance to provide
              food, shelter, education, and hope. It&apos;s a chance to rewrite
              the story of a child&apos;s life.
            </>
          ) : (
            <>
              يلا كفالة هي منظمة غير حكومية رائدة تأسست في عام 2020، مكرسة
              لإعادة تشكيل رعاية الأطفال في مصر من خلال خيارات الرعاية البديلة
              والكفالة (الوصاية / التبني). <br /> <br /> إلهامًا من رحلة مؤسسنا
              رشا مكي الشخصية وكفالتها لابنها مصطفى، أطلقنا أول موقع ويب مخصص
              للكفالة في مصر وأسسنا يلا كفالة. <br /> <br /> بمقرات رئيسية في
              مصر وسان فرانسيسكو، نحن نسعى لتوفير بيئات منزلية مغذية للأيتام من
              خلال بدائل الرعاية الابتكارية وخدمات الدعم والدعوة.
            </>
          )}
        </Typography>
        <DonationForm locale={locale} />
      </Box>
      <EgyptDonationOptions locale={locale} />
    </ErrorBoundary>
  );
};

export default DonatePage;
