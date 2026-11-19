/**
 * The demo content of the councils: invented, harmless rows for every Convex
 * table the site reads, so each public page and each admin list has something
 * to show, in English and Arabic. Images are the site's own /public/images, so
 * nothing is fetched from a third party. scripts/lib/localApp.ts imports it
 * into the throwaway local backend (never a cloud deployment).
 *
 * Rows have no `_id` or `_creationTime`: `convex import` adds them.
 */

const paragraph = (text: string) => `<p>${text}</p>`;

const storyContentEn = [
  "<h2>A first meeting</h2>",
  paragraph(
    "Demo text for the councils. A family in Cairo started the Kafala process after a friend told them what it involves, and the paperwork was shorter than they feared.",
  ),
  paragraph(
    "Every step of the process involves the child's welfare first: a social worker visits, the family meets the child several times, and a court confirms the match.",
  ),
  "<h2>What changed</h2>",
  paragraph(
    "The child now has a home, a school and a name on the family's door. This text is invented for the demo and describes no real family.",
  ),
].join("");

const storyContentAr = [
  "<h2>اللقاء الأول</h2>",
  paragraph(
    "نص تجريبي للمجالس. بدأت أسرة في القاهرة إجراءات الكفالة بعد أن حكى لها صديق ما تتضمنه، وكانت الأوراق أقل مما توقعت.",
  ),
  paragraph(
    "كل خطوة في العملية تضع مصلحة الطفل أولًا: تزور الأخصائية الاجتماعية الأسرة، وتلتقي الأسرة بالطفل عدة مرات، ثم تؤكد المحكمة التوفيق.",
  ),
  "<h2>ما الذي تغيّر</h2>",
  paragraph(
    "للطفل الآن بيت ومدرسة واسم على باب الأسرة. هذا النص مخترع للعرض التجريبي ولا يصف أسرة حقيقية.",
  ),
].join("");

type Story = {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string;
  imageKey: string;
  publish: boolean;
  featured: boolean;
  category: "blog" | "article";
  contentEn: string;
  contentAr: string;
};

const story = (
  n: number,
  fields: Pick<Story, "category" | "publish" | "featured"> & {
    en: [string, string];
    ar: [string, string];
    image: string;
  },
): Story => ({
  titleEn: fields.en[0],
  titleAr: fields.ar[0],
  descriptionEn: fields.en[1],
  descriptionAr: fields.ar[1],
  imageUrl: fields.image,
  imageKey: `demo-story-${n}`,
  publish: fields.publish,
  featured: fields.featured,
  category: fields.category,
  contentEn: storyContentEn,
  contentAr: storyContentAr,
});

export const SEED = {
  stories: [
    story(1, {
      category: "blog",
      publish: true,
      featured: true,
      en: [
        "Our first year as a Kafala family",
        "What the first twelve months looked like, in a family's own words.",
      ],
      ar: [
        "عامنا الأول كأسرة كافلة",
        "كيف كانت الشهور الاثنا عشر الأولى، بكلمات الأسرة نفسها.",
      ],
      image: "/images/child-playing.webp",
    }),
    story(2, {
      category: "blog",
      publish: true,
      featured: true,
      en: [
        "Choosing a school for our daughter",
        "Practical notes from parents on schools, records and paperwork.",
      ],
      ar: [
        "اختيار مدرسة لابنتنا",
        "ملاحظات عملية من الأهالي عن المدارس والسجلات والأوراق.",
      ],
      image: "/images/child-main.webp",
    }),
    story(3, {
      category: "blog",
      publish: true,
      featured: false,
      en: [
        "Talking to children about their story",
        "How families explain Kafala at each age.",
      ],
      ar: [
        "الحديث مع الأطفال عن قصتهم",
        "كيف تشرح الأسر الكفالة في كل مرحلة عمرية.",
      ],
      image: "/images/kafala-steps.webp",
    }),
    story(4, {
      category: "blog",
      publish: false,
      featured: false,
      en: [
        "Draft: a volunteer's diary",
        "An unpublished draft that only the admin area shows.",
      ],
      ar: [
        "مسودة: يوميات متطوعة",
        "مسودة غير منشورة تظهر في لوحة الإدارة فقط.",
      ],
      image: "/images/community.svg",
    }),
    story(5, {
      category: "article",
      publish: true,
      featured: true,
      en: [
        "Family-based care and child development",
        "A short educational article on why a family beats an institution.",
      ],
      ar: [
        "الرعاية الأسرية ونمو الطفل",
        "مقال تعليمي قصير عن سبب تفوق الأسرة على المؤسسة.",
      ],
      image: "/images/what-is-kafala.webp",
    }),
    story(6, {
      category: "article",
      publish: true,
      featured: false,
      en: [
        "Kafala and the law in Egypt: an overview",
        "A plain-language summary of the legal steps.",
      ],
      ar: [
        "الكفالة والقانون في مصر: نظرة عامة",
        "ملخص مبسط للخطوات القانونية.",
      ],
      image: "/images/dar-ifta-fatwa.webp",
    }),
    story(7, {
      category: "article",
      publish: true,
      featured: false,
      en: [
        "Supporting a child through the first months",
        "What the research says about attachment after placement.",
      ],
      ar: [
        "دعم الطفل في الشهور الأولى",
        "ما تقوله الأبحاث عن التعلّق بعد الإلحاق بالأسرة.",
      ],
      image: "/images/collaboration.svg",
    }),
  ],

  faqs: [
    {
      questionEn: "What is Kafala?",
      questionAr: "ما هي الكفالة؟",
      answerEn:
        "Kafala is a commitment to care for a child without parental care as one's own, within the rules of Egyptian law.",
      answerAr:
        "الكفالة هي التزام برعاية طفل فاقد للرعاية الوالدية كأنه ابنك، في إطار القانون المصري.",
      publish: true,
      featured: true,
    },
    {
      questionEn: "Who can become a Kafala family?",
      questionAr: "من يمكنه أن يصبح أسرة كافلة؟",
      answerEn:
        "Married couples and, in some cases, single women who meet the requirements and complete the assessment.",
      answerAr:
        "الأزواج، وفي بعض الحالات النساء غير المتزوجات، ممن يستوفين الشروط ويكملن التقييم.",
      publish: true,
      featured: true,
    },
    {
      questionEn: "How long does the process take?",
      questionAr: "كم تستغرق العملية؟",
      answerEn:
        "It varies from family to family; the Kafala steps page lists each stage.",
      answerAr: "تختلف من أسرة لأخرى؛ وتعرض صفحة خطوات الكفالة كل مرحلة.",
      publish: true,
      featured: true,
    },
    {
      questionEn: "Can I support Yalla Kafala without adopting?",
      questionAr: "هل يمكنني دعم يلا كفالة دون كفالة طفل؟",
      answerEn:
        "Yes: you can donate, volunteer, give stock, or become a partner.",
      answerAr:
        "نعم: يمكنك التبرع أو التطوع أو التبرع بالأسهم أو أن تصبح شريكًا.",
      publish: true,
      featured: false,
    },
    {
      questionEn: "Draft question (unpublished)",
      questionAr: "سؤال مسودة (غير منشور)",
      answerEn: "Only the admin area shows this one.",
      answerAr: "لا يظهر هذا إلا في لوحة الإدارة.",
      publish: false,
      featured: false,
    },
  ],

  boardMembers: [
    {
      publish: true,
      nameEn: "Demo Chair",
      nameAr: "رئيس تجريبي",
      imageUrl: "/images/founder.webp",
      imageKey: "demo-board-1",
      bioEn: "Chairs the board. A demo biography, invented for the councils.",
      bioAr: "يرأس مجلس الإدارة. سيرة ذاتية تجريبية مخترعة للمجالس.",
      type: "board" as const,
      country: "egypt" as const,
    },
    {
      publish: true,
      nameEn: "Demo Treasurer",
      nameAr: "أمين صندوق تجريبي",
      imageUrl: "/images/yk-team-1.webp",
      imageKey: "demo-board-2",
      bioEn: "Looks after the accounts. A demo biography.",
      bioAr: "يتولى الحسابات. سيرة ذاتية تجريبية.",
      type: "board" as const,
      country: "usa" as const,
    },
    {
      publish: true,
      nameEn: "Demo Secretary",
      nameAr: "أمينة سر تجريبية",
      imageUrl: "/images/yk-team-1.webp",
      imageKey: "demo-board-3",
      bioEn: "Keeps the minutes. A demo biography.",
      bioAr: "تدوّن المحاضر. سيرة ذاتية تجريبية.",
      type: "board" as const,
      country: "egypt" as const,
    },
    {
      publish: true,
      nameEn: "Demo Advisor",
      nameAr: "مستشار تجريبي",
      imageUrl: "/images/yk-team-1.webp",
      imageKey: "demo-board-4",
      bioEn: "Advises on child psychology. A demo biography.",
      bioAr: "يقدم المشورة في علم نفس الطفل. سيرة ذاتية تجريبية.",
      type: "advisor" as const,
      country: "all" as const,
    },
    {
      publish: false,
      nameEn: "Demo Hidden Member",
      nameAr: "عضو مخفي تجريبي",
      imageUrl: "/images/yk-team-1.webp",
      imageKey: "demo-board-5",
      bioEn: "Unpublished: only the admin area shows this one.",
      bioAr: "غير منشور: لا يظهر إلا في لوحة الإدارة.",
      type: "advisor" as const,
      country: "usa" as const,
    },
  ],

  resources: [
    {
      nameEn: "Annual report 2024-25",
      nameAr: "التقرير السنوي ٢٤-٢٥",
      slug: "annual-report-2024-25",
      link: "/docs/yk-annual-report-24-25.pdf",
      uploadthingKey: "demo-resource-1",
    },
    {
      nameEn: "Dar Ifta fatwa (source)",
      nameAr: "فتوى دار الإفتاء (المصدر)",
      slug: "dar-ifta-fatwa-source",
      link: "/docs/fatwa-source.pdf",
      uploadthingKey: "demo-resource-2",
    },
  ],

  carouselImages: [
    {
      uploadthingKey: "demo-carousel-1",
      src: "/images/band1.jpeg",
      captionEn: "Every child deserves a family",
      captionAr: "كل طفل يستحق أسرة",
      altDescription: "Demo carousel picture 1",
      order: 1,
    },
    {
      uploadthingKey: "demo-carousel-2",
      src: "/images/band2.jpeg",
      captionEn: "Together we make it possible",
      captionAr: "معًا نجعل ذلك ممكنًا",
      altDescription: "Demo carousel picture 2",
      order: 2,
    },
    {
      uploadthingKey: "demo-carousel-3",
      src: "/images/band3.jpeg",
      altDescription: "Demo carousel picture 3, without a caption",
      order: 3,
    },
  ],

  facebookPosts: [1, 2, 3, 4].map((n) => ({
    id: `demo-post-${n}`,
    image: "/images/yk-team-1.webp",
    contentEn: `Demo post ${n}: news from the Yalla Kafala team. Invented for the councils.`,
    contentAr: `منشور تجريبي ${n}: أخبار من فريق يلا كفالة. مخترع للمجالس.`,
    date: `2026-0${n}-15T10:00:00+0000`,
    likes: 10 * n,
    comments: n,
    shares: n,
    permalink: "https://www.facebook.com/YallaKafala/",
  })),

  emailSubscribers: [] as { email: string }[],
};

export type SeedTable = keyof typeof SEED;

/** One table as JSON Lines, the format `convex import` reads. */
export function toJsonl(rows: readonly object[]): string {
  return rows.map((r) => JSON.stringify(r)).join("\n") + "\n";
}
