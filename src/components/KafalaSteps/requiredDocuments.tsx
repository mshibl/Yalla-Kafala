import { Box, Typography } from "@mui/material";
import React from "react";
const englishRequiredDocuments = [
  "National ID or passport of husband and wife",
  "Copy of wedding certificate (in cases where the family is composed of a husband and a wife)",
  "Copy of divorce certificate (in cases where the applicant is a divorcee)",
  "Copy of husband's death certificate (in cases where the applicant is a widow)",
  "Criminal status for husband and wife; education qualifications (if present since approval can be granted based on cultural and psychological research along with the committee's decision)",
  "Recent health certificate to prove the absence of viruses B and C from applicants",
  "All requested documents for accreditation of provided information ex. Property statement; monthly salaries, pension, or other sources of income; statement of residence (electricity receipt or copy of rent/property contract)",
  "Heptagonal drug analysis from a government authority",
  "Bank statements ( I score certificate issued from a bank )",
  "Completion of psychological assessment (Minnesota MMPI) multifaceted personality in government or university hospitals, provided that the test result received is approved by the logo of the Republic before being presented to the local committee",
  "Criminal status of families living abroad to be brought from their country of residence and to be accredited by the Egyptian embassy of that country.",
];
const arabicRequiredDocuments = [
  "بطاقة الرقم القومي أو صورة جواز السفر للزوج والزوجة",
  "صورة عقد الزواج (في حالة الأسرة المكونة من زوج وزوجة)",
  "صورة قسيمة الطلاق (في حالة كون المتقدمة سيدة مطلقة)",
  "شهادة وفاة الزوج (في حالة كون المتقدمة أرملة)",
  "صحيفة الحالة الجنائية للزوج والزوجة لصالح وزارة التضامن الاجتماعي",
  "صورة المؤهلات الدراسية ان وجدت (يمكن الموافقة على عدم وجودها وفقا لنتيجة البحث الاجتماعي والنفسي وقرار اللجنة)",
  "شهادة صحية حديثة تثبت خلو المتقدمين من فيروس B و C",
  "عمل تحليل سباعي للمخدرات من جهة حكومية",
  "خطاب البنك (شهادة ال I-SCORE من أي بنك)",
  "اجراء الاختبار النفسي متعدد الأوجه الشخصية (مينيسوتا - MMPI) بمستشفى حكومي أو جامعي على أن يتم استلام نتيجة الاختبار معتمد بشعار الجمهورية قبل العرض على اللجنة المحلية",
  "شهادة ميلاد مميكنة للأبناء البيولوجيين ان وجدوا",
  "بيان بالممتلكات ومفردات المرتب أو المعاش أو مصدر الدخل أيا كان",
  "بيان بالمسكن (فاتورة كهرباء أو صورة ملكية/عقد الايجار)",
  "صورة بطاقة الرقم القومي للضامن",
  "تقدم الأسر المقيمة بالخارج صحيفة جنائية من البلد التي تقيم بها, على ان يتم توثيقها والتصديق عليها من السفارة المصرية الكائنة في ذات البلد",
];
const RequiredDocuments = ({ locale }: { locale: string }) => {
  const documents =
    locale === "en" ? englishRequiredDocuments : arabicRequiredDocuments;

  return (
    <Box
      sx={{
        backgroundColor: "secondary.main",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        marginTop: { xs: "0px", lg: "50px" },
        paddingTop: { xs: "30px", lg: "90px" },
        paddingX: { xs: "30px", lg: "200px" },
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "20px", lg: "40px" },
          fontWeight: "bold",
          width: "100%",
        }}
        color={"white"}
        variant="h3"
        textAlign={"start"}
      >
        {locale === "en"
          ? "Required Documents for kafala"
          : "الاوراق المطلوبة للكفالة"}
      </Typography>
      <ul>
        {documents.map((document, index) => {
          return (
            <Box key={index} component={"li"} color={"white"}>
              <Typography> {document}</Typography>
            </Box>
          );
        })}
      </ul>
    </Box>
  );
};

export default RequiredDocuments;
