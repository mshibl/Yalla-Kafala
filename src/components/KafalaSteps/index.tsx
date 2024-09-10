import { fetchBoardMembers } from "@/src/utils/fetch-board-members";
import HelpChildrenAndFamilies from "../aboutUs/helpChildrenAndFamilies";
import YallaKafalaBeginning from "../aboutUs/WhoWeAre/beginning";
import Board from "../aboutUs/WhoWeAre/board";
import Founder from "../aboutUs/WhoWeAre/founder";
import HeroImage from "../aboutUs/WhoWeAre/heroImage";
import Initiatives from "../aboutUs/WhoWeAre/initiatives";
import KafalaStepsQuote from "./KafalaStepsQuote";
import { Box } from "@mui/material";
import RequiredDocuments from "./requiredDocuments";
import FamilyCard from "./familyCard";
import StepsDesktop from "./stepsDesktop";
import StepsMobile from "./stepsMobile";

const stepsEnglish = [
  {
    title: "Step 1",
    description: "Meeting with applying families",
    details:
      "Initial consultation with prospective Kafala families to discuss the process and requirements.",
    image: "/images/kafala_step_1.png",
  },
  {
    title: "Step 2",
    description: "Submit a kafala application form",
    details:
      "Complete and submit the official Kafala application form, providing necessary details.",
    image: "/images/kafala_step_2.png",
  },
  {
    title: "Step 3",
    description: "Evaluation Stage",
    details:
      "Assess the suitability of the applying family through initial and detailed evaluations, along with document revision and accreditation",
    image: "/images/kafala_step_3.png",
  },
  {
    title: "Step 4",
    description: "The journey to find my child",
    details:
      "Facilitating the process from issuance of viewing authorization to meeting prospective children, and completing bonding visits paralleled with medical assessments",
    image: "/images/kafala_step_4.png",
  },
  {
    title: "Step 5",
    description: "Social compatibility stage",
    details:
      "Facilitating the process from viewing authorization to meeting prospective children for social compatibility assessment, and conducting bonding visits paralleled with medical evaluations.",
    image: "/images/kafala_step_5.png",
  },
  {
    title: "Step 6",
    description: "Start a savings account",
    details: `Providing a copy of the birth certificate to start a savings account for the child worth 3000 EGP, or to open a bank account in "Nasser's Social Bank" to deposit 3000 EGP under the child's name. Facilitating financial security for the child's future.`,
    image: "/images/kafala_step_6.png",
  },
];
const stepsArabic = [
  {
    title: "الخطوة 1",
    description: "لقاء مع الأسر المتقدمة",
    details:
      "استشارة مبدئية مع الأسر المتقدمة للكفالة لمناقشة العملية والمتطلبات.",
    image: "/images/kafala_step_1.png",
  },
  {
    title: "الخطوة 2",
    description: "تقديم استمارة طلب الكفالة",
    details:
      "إكمال وتقديم استمارة طلب الكفالة الرسمية، مع تقديم التفاصيل اللازمة.",
    image: "/images/kafala_step_2.png",
  },
  {
    title: "الخطوة 3",
    description: "مرحلة التقييم",
    details:
      "تقييم مدى ملاءمة الأسرة المتقدمة من خلال التقييمات الأولية والتفصيلية، ومراجعة المستندات والاعتماد.",
    image: "/images/kafala_step_3.png",
  },
  {
    title: "الخطوة 4",
    description: "رحلتي للعثور على طفلي",
    details:
      "تسهيل العملية من إصدار إذن العرض إلى لقاء الأطفال المحتملين، وإتمام زيارات التعارف بالتوازي مع الفحوصات الطبية.",
    image: "/images/kafala_step_4.png",
  },
  {
    title: "الخطوة 5",
    description: "مرحلة التوافق الاجتماعي",
    details:
      "تسهيل العملية من إصدار إذن العرض إلى لقاء الأطفال المحتملين لتقييم التوافق الاجتماعي، وإجراء زيارات التعارف بالتوازي مع التقييمات الطبية.",
    image: "/images/kafala_step_5.png",
  },
  {
    title: "الخطوة 6",
    description: "فتح حساب توفير",
    details: `تقديم نسخة من شهادة الميلاد لفتح حساب توفير للطفل بقيمة 3000 جنيه مصري، أو فتح حساب بنكي في "بنك ناصر الاجتماعي" لإيداع 3000 جنيه باسم الطفل. تسهيل الأمان المالي لمستقبل الطفل.`,
    image: "/images/kafala_step_6.png",
  },
];

const KafalaSteps = async ({ locale }: { locale: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <HeroImage src="/images/kafala_steps.png" />
      <KafalaStepsQuote locale={locale} />
      <StepsDesktop
        steps={locale === "en" ? stepsEnglish : stepsArabic}
        locale={locale}
      />
      <StepsMobile
        steps={locale === "en" ? stepsEnglish : stepsArabic}
        locale={locale}
      />
      <RequiredDocuments locale={locale} />
      <FamilyCard locale={locale} />
      <HelpChildrenAndFamilies locale={locale} />
    </Box>
  );
};

export default KafalaSteps;
