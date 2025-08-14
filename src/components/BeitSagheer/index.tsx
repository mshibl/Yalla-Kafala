import {
  BookOpen,
  Utensils,
  Stethoscope,
  Shield,
  Home,
  Heart,
} from "lucide-react";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ServicesSection from "./ServicesSection";
import ImpactSection from "./ImpactSection";
import type { Locale } from "../Providers/LocaleProvider";

const BeitSagheer = ({ locale }: { locale: Locale }) => {
  // Services provided at Beit Sagheer
  const services = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Quality Education",
      titleAr: "تعليم عالي الجودة",
      description:
        "Access to quality education tailored to each child's needs and abilities, ensuring they develop the skills needed for a bright future.",
      descriptionAr:
        "توفير تعليم عالي الجودة يلبي احتياجات وقدرات كل طفل، لضمان تطوير المهارات اللازمة لمستقبل مشرق.",
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Nutritious Food",
      titleAr: "غذاء مغذي",
      description:
        "Balanced, healthy meals that provide all the nutrients children need for proper growth and development.",
      descriptionAr:
        "وجبات متوازنة وصحية توفر جميع العناصر الغذائية التي يحتاجها الأطفال للنمو والتطور السليم.",
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Proper Healthcare",
      titleAr: "رعاية صحية مناسبة",
      description:
        "Regular medical check-ups, preventive care, and immediate attention to health concerns to ensure physical wellbeing.",
      descriptionAr:
        "فحوصات طبية منتظمة، ورعاية وقائية، واهتمام فوري بالمشاكل الصحية لضمان الصحة الجسدية.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privacy & Safety",
      titleAr: "الخصوصية والأمان",
      description:
        "A secure environment where children can develop and thrive without fear, with respect for their personal space and dignity.",
      descriptionAr:
        "بيئة آمنة حيث يمكن للأطفال النمو والازدهار دون خوف، مع احترام خصوصيتهم وكرامتهم.",
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Family Environment",
      titleAr: "بيئة أسرية",
      description:
        "A nurturing home setting with dedicated caregivers who provide emotional support and stability.",
      descriptionAr:
        "بيئة منزلية حاضنة مع مقدمي رعاية مكرسين يوفرون الدعم العاطفي والاستقرار.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Emotional Support",
      titleAr: "دعم عاطفي",
      description:
        "Counseling and guidance to help children process their experiences and develop healthy emotional responses.",
      descriptionAr:
        "الإرشاد والدعم لمساعدة الأطفال على معالجة تجاربهم وتطوير استجابات عاطفية صحية.",
    },
  ];

  // Dummy impact statistics
  const impactStats = [
    {
      number: "7",
      label: "Girls",
      labelAr: "فتيات",
      description:
        "secured in Yalla Kafala's first safe & nurturing Small Home",
      descriptionAr: "أمنت في أول بيت صغير آمن وحاضن في يلا كفالة",
    },
    {
      number: "100%",
      label: "Education Access",
      labelAr: "الوصول إلى التعليم",
      description: "to quality schools for children in Yalla Family House",
      descriptionAr:
        "للأطفال في بيت العائلة اليلا وصول إلى التعليم عالي الجودة",
    },
    {
      number: "24/7",
      label: "Care",
      labelAr: "رعاية",
      description: "Provided by trained caregivers in our Small Home",
      descriptionAr: "مقدمي رعاية مدربون في بيتنا الصغير",
    },
    {
      number: "0",
      label: "Children",
      labelAr: "أطفال",
      description: "Returned to institutional care",
      descriptionAr: "يعودون إلى الرعاية المؤسسية",
    },
  ];

  const localizedServices = services.map((service) => ({
    ...service,
    title: locale === "ar" ? service.titleAr : service.title,
    description: locale === "ar" ? service.descriptionAr : service.description,
  }));

  const localizedImpactStats = impactStats.map((stat) => ({
    ...stat,
    label: locale === "ar" ? stat.labelAr : stat.label,
    description: locale === "ar" ? stat.descriptionAr : stat.description,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <HeroSection locale={locale} />
        <AboutSection locale={locale} />
        <ServicesSection services={localizedServices} locale={locale} />
        <ImpactSection impactStats={localizedImpactStats} locale={locale} />
      </main>
    </div>
  );
};

export default BeitSagheer;
