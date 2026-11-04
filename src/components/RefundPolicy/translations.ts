type Section = { title: string; body?: string[]; items?: string[] };

type Copy = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: Section[];
  contactTitle: string;
  contactIntro: string;
  emailLabel: string;
  phoneLabel: string;
  addressLabel: string;
};

/**
 * Refund terms & processing timelines for online payments (Paymob / CIB).
 * Timelines below must stay in sync with what is agreed with CIB/Paymob.
 */
export const LAST_UPDATED = "2026-11-04";

export const translations: Record<"en" | "ar", Copy> = {
  en: {
    title: "Refund Policy",
    lastUpdated: "Last updated",
    intro:
      "This policy explains the terms, conditions and processing timelines for refunds of online payments and donations made to Yalla Kafala through our website. All online payments on this website are processed in Egyptian Pounds (EGP).",
    sections: [
      {
        title: "1. General terms",
        body: [
          "Donations to Yalla Kafala are voluntary contributions that directly support our programs for children without parental care. As a rule, completed donations are final and non-refundable, except in the cases listed below.",
        ],
      },
      {
        title: "2. When you are eligible for a refund",
        items: [
          "You were charged more than once for the same donation (duplicate transaction).",
          "An incorrect amount was charged due to a technical or entry error.",
          "The transaction was made without the cardholder's authorization.",
          "A paid service or event registration was cancelled by Yalla Kafala.",
        ],
      },
      {
        title: "3. When refunds are not available",
        items: [
          "Requests submitted more than 14 days after the transaction date.",
          "Donations that have already been allocated and receipted, where none of the conditions in section 2 apply.",
          "Change of mind after a donation was completed successfully.",
        ],
      },
      {
        title: "4. How to request a refund",
        body: [
          "Send your request to info@yallakafala.org (or call us on the number below) within 14 days of the transaction date and include:",
        ],
        items: [
          "Your full name, email and phone number.",
          "Transaction date, amount (EGP) and the transaction / reference number from your confirmation.",
          "The last 4 digits of the card used.",
          "The reason for the refund request.",
        ],
      },
      {
        title: "5. Processing timelines",
        items: [
          "Acknowledgement: we confirm receipt of your request within 2 business days.",
          "Review & decision: we review the request and notify you of the decision within 7 business days of receipt.",
          "Refund issued: approved refunds are issued through our payment provider within 3 business days of approval.",
          "Reaching your account: depending on your bank, the refunded amount usually appears on your card statement within 7–14 business days after it is issued.",
        ],
      },
      {
        title: "6. Refund method and currency",
        body: [
          "Approved refunds are returned to the original payment method (the same card or wallet used for the payment) in Egyptian Pounds (EGP), for the original amount charged. We do not issue refunds in cash or to a different card or account. Yalla Kafala does not charge any fee for processing a refund; however, your bank may apply its own fees or exchange rates for cards issued outside Egypt.",
        ],
      },
      {
        title: "7. Changes to this policy",
        body: [
          "We may update this policy from time to time. Any changes will be published on this page with an updated date.",
        ],
      },
    ],
    contactTitle: "Contact us",
    contactIntro: "For any questions about payments or refunds, contact us:",
    emailLabel: "Email",
    phoneLabel: "Phone",
    addressLabel: "Office address",
  },
  ar: {
    title: "سياسة الاسترداد",
    lastUpdated: "آخر تحديث",
    intro:
      "توضح هذه السياسة شروط وأحكام والمدد الزمنية لمعالجة طلبات استرداد المدفوعات والتبرعات الإلكترونية المقدمة إلى يلا كفالة عبر موقعنا. تتم معالجة جميع المدفوعات الإلكترونية على هذا الموقع بالجنيه المصري.",
    sections: [
      {
        title: "١. الشروط العامة",
        body: [
          "التبرعات إلى يلا كفالة هي مساهمات طوعية تدعم برامجنا للأطفال فاقدي الرعاية الوالدية بشكل مباشر. كقاعدة عامة، التبرعات المكتملة نهائية وغير قابلة للاسترداد، باستثناء الحالات المذكورة أدناه.",
        ],
      },
      {
        title: "٢. الحالات المؤهلة للاسترداد",
        items: [
          "خصم مبلغ التبرع نفسه أكثر من مرة (معاملة مكررة).",
          "خصم مبلغ غير صحيح بسبب خطأ تقني أو خطأ في الإدخال.",
          "إجراء المعاملة دون تفويض من صاحب البطاقة.",
          "إلغاء يلا كفالة لخدمة مدفوعة أو تسجيل في فعالية.",
        ],
      },
      {
        title: "٣. الحالات غير المؤهلة للاسترداد",
        items: [
          "الطلبات المقدمة بعد مرور أكثر من ١٤ يومًا من تاريخ المعاملة.",
          "التبرعات التي تم تخصيصها وإصدار إيصال بها، ما لم تنطبق أي من حالات البند ٢.",
          "تغيير الرأي بعد إتمام التبرع بنجاح.",
        ],
      },
      {
        title: "٤. كيفية طلب الاسترداد",
        body: [
          "أرسل طلبك إلى info@yallakafala.org (أو اتصل بنا على الرقم أدناه) خلال ١٤ يومًا من تاريخ المعاملة، متضمنًا:",
        ],
        items: [
          "الاسم الكامل والبريد الإلكتروني ورقم الهاتف.",
          "تاريخ المعاملة والمبلغ (بالجنيه المصري) ورقم المعاملة / المرجع من رسالة التأكيد.",
          "آخر ٤ أرقام من البطاقة المستخدمة.",
          "سبب طلب الاسترداد.",
        ],
      },
      {
        title: "٥. المدد الزمنية للمعالجة",
        items: [
          "التأكيد: نؤكد استلام طلبك خلال يومي عمل.",
          "المراجعة والقرار: نراجع الطلب ونبلغك بالقرار خلال ٧ أيام عمل من استلامه.",
          "إصدار الاسترداد: يتم إصدار المبالغ المعتمدة عبر مزود خدمة الدفع خلال ٣ أيام عمل من الموافقة.",
          "وصول المبلغ إلى حسابك: حسب البنك الخاص بك، يظهر المبلغ المسترد عادةً في كشف حساب البطاقة خلال ٧ إلى ١٤ يوم عمل من إصداره.",
        ],
      },
      {
        title: "٦. طريقة الاسترداد والعملة",
        body: [
          "يتم رد المبالغ المعتمدة إلى وسيلة الدفع الأصلية (نفس البطاقة أو المحفظة المستخدمة في الدفع) بالجنيه المصري وبقيمة المبلغ الأصلي المخصوم. لا نقوم بالاسترداد نقدًا أو إلى بطاقة أو حساب مختلف. لا تفرض يلا كفالة أي رسوم على معالجة الاسترداد، إلا أن البنك الخاص بك قد يطبق رسومه أو أسعار صرفه الخاصة على البطاقات الصادرة خارج مصر.",
        ],
      },
      {
        title: "٧. التعديلات على هذه السياسة",
        body: [
          "قد نقوم بتحديث هذه السياسة من وقت لآخر، وسيتم نشر أي تعديلات على هذه الصفحة مع تاريخ التحديث.",
        ],
      },
    ],
    contactTitle: "تواصل معنا",
    contactIntro: "لأي استفسارات بخصوص المدفوعات أو الاسترداد، تواصل معنا:",
    emailLabel: "البريد الإلكتروني",
    phoneLabel: "الهاتف",
    addressLabel: "عنوان المكتب",
  },
};
