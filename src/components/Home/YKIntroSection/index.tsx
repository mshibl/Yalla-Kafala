import { Box, Typography } from "@mui/material";

const YKIntroSection = ({ locale }: { locale: "ar" | "en" }) => {
  return (
    <Box
      display="flex"
      bgcolor="secondary.main"
      color="#ffffff"
      padding={{ xs: "20px", md: "40px" }}
      flexDirection={{ xs: "column", md: "row" }}
    >
      <Box padding={{ xs: "20px", md: "40px" }} flexBasis="100%">
        <Typography variant="h5" paddingBottom="20px" fontWeight={600}>
          {locale === "ar" ? "مؤسسة يلا كفالة" : "Yalla Kafala"}
        </Typography>
        <Typography fontSize="1.2rem"  paddingBottom="20px">
          {locale === "ar"
            ? "يلا كفالة منظمة خيرية غير هادفة للربح تأسست عام ٢٠٢٠ بهدف خلق حياة أفضل للأيتام في مصر من خلال رفع مستوى الوعي حول الكفالة، وتيسير إجراءات الكفالة، وتوجيه الأسر الكفالة وإعدادها من خلال تزويدهم بالأدوات اللازمة لتربية أطفال أصحاء نفسيًا وسلوكيًا."
            : "Yalla Kafala is a non-profit charity founded in 2020 with the aim of creating a better life for orphans in Egypt by raising awareness about Kafala, facilitating Kafala procedures, guiding Kafala families and preparing them by providing them with the necessary tools to raise children who are mentally and behaviorally healthy."}
        </Typography>
      </Box>
      <Box padding="20px" flexBasis="100%" height="300px">
        <iframe
          width="100%"
          height="100%"
          style={{ border: "none" }}
          allowFullScreen={true}
          src="https://www.youtube.com/embed/YK3hWdapJ5w?si=jFh5Useg98pql_RB"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </Box>
    </Box>
  );
};

export default YKIntroSection;
