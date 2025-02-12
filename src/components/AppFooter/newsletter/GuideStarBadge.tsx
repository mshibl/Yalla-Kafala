import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const GuideStarBadge = () => {
  const t = useTranslations("AppFooter.newsletter");
  const locale = useLocale();

  return (
    <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
      <Box mr={locale === "ar" ? 0 : "10px"} ml={locale === "ar" ? "10px" : 0}>
        <Link href="https://www.guidestar.org/profile/85-3323627">
          <Image
            src="/images/GuideStarIcon_Platinum.svg"
            alt="GuideStar Platinum Level"
            width={87}
            height={87}
          />
        </Link>
      </Box>
      <Typography color="#ffffff" variant="body2">
        {locale === "ar"
          ? "يلا كفالة أحد المشاركين فى برنامج GuideStar البلاتيني مما يدل على التزام المؤسسة بالشفافية  "
          : "Yalla Kafala is a Platinum Level participant in the GuideStar program, demonstrating our commitment to transparency."}
      </Typography>
    </Box>
  );
};

export default GuideStarBadge;
