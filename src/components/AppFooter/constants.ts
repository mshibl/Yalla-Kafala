import { Heart } from "lucide-react";

import { MapPin } from "lucide-react";

import { Mail } from "lucide-react";

export const contactItems = [
  {
    icon: Heart,
    text: { en: "Volunteer", ar: "التطوع" },
    href: "/volunteer",
  },
  {
    icon: MapPin,
    text: {
      en: "24 Al Lasilki Al Sagheer Street, New Maadi, Cairo, Egypt.",
      ar: "٢٤ شارع اللاسلكي الصغير، المعادي الجديدة، القاهرة، مصر",
    },
    href: "https://maps.app.goo.gl/d24Rt7cnGfYYkSyq8?g_st=ic",
  },
  {
    icon: Mail,
    text: {
      en: "info@yallakafala.org",
      ar: "info@yallakafala.org",
    },
    href: "mailto:info@yallakafala.org",
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
  { href: "/yk-gala", text: { en: "YK Gala", ar: "احتفال يلا كفالة" } },
  {
    group: { en: "Explore Kafala", ar: "استكشف الكفالة" },
    links: [
      {
        href: "/what-is-kafala",
        text: { en: "What is Kafala", ar: "ما هي الكفالة" },
      },
      {
        href: "/kafala-steps",
        text: { en: "Kafala Steps", ar: "خطوات الكفالة" },
      },
      {
        href: "/kafala-stories",
        text: { en: "Kafala Stories", ar: "قصص الكفالة" },
      },
      { href: "/faqs", text: { en: "FAQs", ar: "الأسئلة الشائعة" } },
    ],
  },
  { href: "/beit-sagheer", text: { en: "Beit Sagheer", ar: "البيت الصغير" } },
  {
    group: { en: "About Us", ar: "من نحن" },
    links: [
      { href: "/who-we-are", text: { en: "Who We Are", ar: "من نحن" } },
      {
        href: "/activities-and-milestones",
        text: { en: "Activities & Milestones", ar: "الانجازات والأنشطة" },
      },
      { href: "/partnerships", text: { en: "Partnerships", ar: "الشركاء" } },
      {
        href: "/vision-mission",
        text: { en: "Vision & Mission", ar: "الرؤية والرسالة" },
      },
    ],
  },
  {
    href: "https://givebutter.com/yallakafaladonations",
    text: { en: "Donate Now", ar: "تبرع الآن" },
  },
];
