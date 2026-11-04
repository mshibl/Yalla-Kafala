import { Heart, MapPin, Mail, Phone } from "lucide-react";
import { volunteerFormUrl } from "@/constants/links";

/** Nav item that opens the region-aware Donate flow (see DonateNowModal). */
export const DONATE_NAV_HREF = "/donate";
import { officialContact, hasOfficialPhone } from "@/constants/contact";

export const contactItems = [
  {
    icon: Heart,
    text: { en: "Volunteer", ar: "التطوع" },
    href: volunteerFormUrl,
  },
  ...(hasOfficialPhone
    ? [
        {
          icon: Phone,
          text: { en: officialContact.phone, ar: officialContact.phone },
          href: `tel:${officialContact.phone}`,
          ltr: true,
        },
      ]
    : []),
  {
    icon: MapPin,
    text: officialContact.address,
    href: officialContact.mapUrl,
  },
  {
    icon: Mail,
    text: {
      en: officialContact.email,
      ar: officialContact.email,
    },
    href: `mailto:${officialContact.email}`,
    ltr: true,
  },
];

export const socials = [
  {
    url: "https://www.facebook.com/YallaKafala/",
    name: "facebook",
  },
  {
    url: "https://x.com/yallakafala",
    name: "x",
  },
  {
    url: "https://www.youtube.com/Yalla%20Kafala",
    name: "youtube",
  },
  {
    url: "https://www.instagram.com/yallakafala",
    name: "instagram",
  },
];

// Shared navigation links for header and footer
export const navigationLinks = [
  { href: "/", text: { en: "Home", ar: "الرئيسية" } },
  {
    group: { en: "Explore Kafala", ar: "استكشف الكفالة" },
    links: [
      {
        href: "/what-is-kafala",
        text: { en: "What is Kafala", ar: "ما هي الكفالة" },
      },
      {
        href: "/fatwa",
        text: { en: "Dar Ifta Fatwa", ar: "فتوى دار الإفتاء" },
      },
      {
        href: "/kafala-steps",
        text: { en: "Kafala Steps", ar: "خطوات الكفالة" },
      },
      {
        href: "/kafala-blogs",
        text: { en: "Kafala Blogs", ar: "مدونات الكفالة" },
      },
      {
        href: "/kafala-articles",
        text: {
          en: "Research & Educational Articles",
          ar: "مقالات بحثية وتعليمية",
        },
      },
      { href: "/faqs", text: { en: "FAQs", ar: "الأسئلة الشائعة" } },
      {
        href: "/resources",
        text: { en: "Resources", ar: "الموارد" },
      },
    ],
  },
  { href: "/beit-sagheer", text: { en: "Beit Sagheer", ar: "البيت الصغير" } },
  {
    group: { en: "About Us", ar: "من نحن" },
    links: [
      { href: "/who-we-are", text: { en: "Who We Are", ar: "من نحن" } },
      {
        href: "/vision-mission",
        text: { en: "Vision & Mission", ar: "الرؤية والرسالة" },
      },
      {
        href: "/activities-and-milestones",
        text: { en: "Activities & Milestones", ar: "الانجازات والأنشطة" },
      },
    ],
  },
  {
    href: DONATE_NAV_HREF,
    text: { en: "Donate Now", ar: "تبرع الآن" },
  },
];
