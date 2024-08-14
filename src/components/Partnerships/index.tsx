"use client";

import { Box } from "@mui/material";
import PartnerItem from "./PartnerItem";
import Image from "next/image";
import useResponsiveBreakpoint from "@/src/utils/mui-utils";
import HelpChildrenAndFamilies from "../aboutUs/helpChildrenAndFamilies";

const Partnerships = ({ locale }: { locale: string }) => {
  const isMD = useResponsiveBreakpoint("md");

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        marginTop="40px"
        marginBottom="20px"
        width="700px"
        maxWidth="100%"
        px="20px"
      >
        <Box
          justifySelf="flex-start"
          width="70%"
          style={{
            color: "#87226C",
            fontSize: isMD ? "50px" : "32px",
            fontWeight: "bold",
            marginBottom: "20px",
            lineHeight: "1.2",
          }}
        >
          {locale === "en"
            ? "Partnerships & Collaborations"
            : "شركاء يلا كفالة"}
        </Box>
        <Box>
          {locale === "en"
            ? "We collaborate with a diverse network of partners including the Ministry of Social Solidarity in government, nurseries and preschools in education, NGOs aligned with our mission, and receive in-kind support from corporations in the corporate sector, all working together to scale our efforts, innovate services, and sustain our impact."
            : "نتعاون مع شبكة متنوعة من الشركاء بما في ذلك الحكومة المصرية ممثلة في وزارة التضامن الاجتماعي، والمؤسسات غير الحكومية التي تشارك رسالتنا، وعدد من رياض الأطفال والحضانات، ونتلقى دعمًا عينيًا من بعض الشركات الخاصة. تساعدنا هذه الشراكات على توسيع جهودنا، وابتكار مزيد من الخدمات، والحفاظ على تأثيرنا."}
        </Box>
      </Box>
      <Box display="flex" gap="15px" flexWrap="wrap" justifyContent="center">
        <PartnerItem>
          <Image
            src="/images/save-the-children-logo.png"
            alt={
              locale === "en"
                ? "Save the children logo"
                : "شعار مؤسسة إنقاذ الأطفال"
            }
            width={84}
            height={93}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/moss-logo.png"
            alt={
              locale === "en"
                ? "Ministry of Social Solidarity logo"
                : "شعار وزارة التضامن الاجتماعي"
            }
            width={120}
            height={101}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/little-harvard-academy-logo.png"
            alt={
              locale === "en"
                ? "Little Harvard Academy logo"
                : "شعار أكاديمية ليتل هارفارد"
            }
            width={129}
            height={129}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/adopt-international-logo.png"
            alt={
              locale === "en"
                ? "Adopt International logo"
                : "شعار مؤسسة التبنى الدولية"
            }
            width={139}
            height={139}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/adapt-garment-logo.png"
            alt={
              locale === "en" ? "Adapt Garment logo" : "شعار شركة أدابت جارمنت"
            }
            width={155}
            height={155}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/unicef-logo.png"
            alt={locale === "en" ? "UNICEF logo" : "شعار اليونيسيف"}
            width={145}
            height={145}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/kiddos-logo.png"
            alt={locale === "en" ? "Kiddos logo" : "شعار كيدوز"}
            width={137}
            height={137}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/p&g-logo.png"
            alt={locale === "en" ? "P&G logo" : "شعار بي آند جي"}
            width={121}
            height={121}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/nilco-logo.png"
            alt={locale === "en" ? "Nilco logo" : "شعار نيلكو"}
            width={141}
            height={141}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/logic-consulting.png"
            alt={locale === "en" ? "Logic Consulting logo" : "شعار شركة لوجيك"}
            width={127}
            height={127}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/colors-nursery-logo.png"
            alt={locale === "en" ? "Colors Nursery logo" : "شعار حضانة كولورز"}
            width={136}
            height={136}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/montessori-city-pre-school-logo.png"
            alt={
              locale === "en"
                ? "Montessori City Pre-School logo"
                : "شعار حضانة مونتيسوري سيتي "
            }
            width={137}
            height={137}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/under-5-logo.png"
            alt={locale === "en" ? "Under 5 logo" : "شعار حضانة تحت 5"}
            width={131}
            height={131}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/kiva-logo.png"
            alt={locale === "en" ? "Kiva preschool logo" : "شعار حضانة كيفا"}
            width={147}
            height={147}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/innovvette-logo.png"
            alt={locale === "en" ? "Innovvette logo" : "شعار شركة إنوفيت"}
            width={149}
            height={149}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/the-field-logo.png"
            alt={locale === "en" ? "The Field logo" : "شعار ذا فيلد"}
            width={149}
            height={149}
          />
        </PartnerItem>
        <PartnerItem>
          <Image
            src="/images/lilliput-logo.png"
            alt={
              locale === "en" ? "Lilliput preschool logo" : "شعار حضانة ليليبت"
            }
            width={149}
            height={149}
          />
        </PartnerItem>
      </Box>
      <Box
        width="700px"
        maxWidth="100%"
        marginTop="20px"
        marginBottom="20px"
        px="20px"
      >
        {locale === "en"
          ? "By supporting Yalla Kafala, you give hope, support, and contribute to a better future for our children. Together, we can build a future where every child knows the love of a family and the promise of a bright tomorrow."
          : "من خلال دعم يلا كفالة، يمكنك أن تمنح الأمل والدعم وتساهم في مستقبل أفضل لأطفالنا. معًا، يمكننا بناء مستقبل يعرف فيه كل طفل حب العائلة وأمل في غد مشرق."}
      </Box>
      <HelpChildrenAndFamilies locale={locale} />
    </Box>
  );
};

export default Partnerships;
