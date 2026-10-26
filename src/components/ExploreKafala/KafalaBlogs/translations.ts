import type { StoryCategory } from "@/lib/types";

export const translations = {
  title: {
    blog: {
      en: "Kafala Blogs",
      ar: "مدونات الكفالة",
    },
    article: {
      en: "Research & Educational Articles",
      ar: "مقالات بحثية وتعليمية",
    },
  },
  description: {
    blog: {
      en: "Every child deserves a loving home. These blogs highlight the transformative power of Kafala, changing lives and creating forever families.",
      ar: "يحتاج كل طفل إلى منزل حبيب. تلعب هذه المدونات دورًا محوريًا في تعريف الكفالة، تحويل حياة الأطفال وإنشاء أسر للأبد.",
    },
    article: {
      en: "Research-based articles that build knowledge and awareness about Kafala.",
      ar: "مقالات قائمة على البحث لنشر المعرفة والوعي حول الكفالة.",
    },
  },
  readFull: {
    blog: {
      en: "Read Full Blog",
      ar: "اقرأ المدونة بالكامل",
    },
    article: {
      en: "Read Full Article",
      ar: "اقرأ المقال بالكامل",
    },
  },
  backTo: {
    blog: {
      en: "Back to Blogs",
      ar: "رجوع إلى المدونات",
    },
    article: {
      en: "Back to Articles",
      ar: "رجوع إلى المقالات",
    },
  },
  empty: {
    blog: {
      en: "No blogs found",
      ar: "لا توجد مدونات",
    },
    article: {
      en: "No articles yet. Check back soon.",
      ar: "لا توجد مقالات بعد. تابعونا قريبًا.",
    },
  },
  notFound: {
    blog: "Blog Not Found",
    article: "Article Not Found",
  },
} satisfies Record<string, Record<StoryCategory, unknown>>;
