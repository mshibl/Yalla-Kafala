import {
  HandCoins,
  Users,
  Share2,
  MessageCircleHeart,
  Gift,
  Calendar,
} from "lucide-react";

export const donationMethods = [
  {
    icon: <HandCoins className="w-6 h-6" />,
    title: { en: "Make a Donation", ar: "تبرع" },
    description: {
      en: "Your financial support helps orphaned children.",
      ar: "دعمكم المالي يساعد الأطفال الأيتام.",
    },
    link: "https://givebutter.com/yallakafaladonations",
    color: "#7b2082", // primary
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: { en: "Volunteer", ar: "تطوع" },
    description: {
      en: "Share your time and skills to make a direct impact.",
      ar: "شارك وقتك ومهاراتك لإحداث تأثير مباشر.",
    },
    link: "/volunteer",
    color: "#1a9cb7", // secondary
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: { en: "Spread the Word", ar: "شارك الكلمة" },
    description: {
      en: "Help us reach more potential families and donors.",
      ar: "ساعدنا في الوصول إلى المزيد من العائلات والمتبرعين.",
    },
    link: "/spread-the-word",
    color: "#EDB842", // accent
  },
  {
    icon: <MessageCircleHeart className="w-6 h-6" />,
    title: { en: "WhatsApp Us", ar: "تواصل معنا" },
    description: {
      en: "Connect via WhatsApp for inquiries or to help.",
      ar: "تواصل معنا عبر الواتساب للاستفسارات أو للمساعدة.",
    },
    link: "https://wa.me/1234567890",
    color: "#25D366", // WhatsApp green
  },
  {
    icon: <Gift className="w-6 h-6" />,
    title: { en: "Donate Items", ar: "تبرع المواد" },
    description: {
      en: "Contribute clothes, toys, books, and essentials.",
      ar: "تبرع الملابس، الألعاب، الكتب، والمواد الأساسية.",
    },
    link: "/donate-items",
    color: "#FF6B6B", // warm red
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: { en: "Attend Events", ar: "حضور الأحداث" },
    description: {
      en: "Join our fundraising and awareness events.",
      ar: "انضم إلى أحداثنا التمويلية والوعي المحدث.",
    },
    link: "/events",
    color: "#4E5DE3", // indigo
  },
];
