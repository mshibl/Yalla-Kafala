export const requiredDocuments = {
  en: [
    "National ID card or passport (copy) for husband and wife",
    "Copy of the marriage contract (for a family of a husband and wife)",
    "Copy of the divorce certificate (if the applicant is a divorced woman)",
    "Husband's death certificate (if the applicant is a widow)",
    "Criminal record certificate for husband and wife, issued for the Ministry of Social Solidarity",
    "Copy of educational qualifications, if any (approval without them is possible, depending on the social and psychological assessment and the committee's decision)",
    "Recent health certificate showing the applicants are free of hepatitis B and C",
    "7-panel drug test from a government lab",
    "Bank letter (an I-Score certificate from any bank)",
    "Multiphasic personality test (Minnesota MMPI) at a government or university hospital; the result must carry the seal of the Republic before it goes to the local committee",
    "Computerised birth certificates for biological children, if any",
    "Statement of property and of salary, pension or any other income",
    "Proof of residence (electricity bill, or copy of the property deed or lease)",
    "Copy of the guarantor's national ID card",
    "Families living abroad: a criminal record certificate from the country of residence, notarised and certified by the Egyptian embassy there",
  ],
  ar: [
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
  ],
};
export const steps = {
  en: [
    {
      title: "Meeting with applying families",
      description:
        "Initial consultation with prospective Kafala families to discuss the process and requirements.",
    },
    {
      title: "Submit a kafala application form",
      description:
        "Complete and submit the official Kafala application form, providing necessary details.",
    },
    {
      title: "Evaluation stage",
      description:
        "Assess the suitability of the applying family through initial and detailed evaluations, along with document revision and accreditation",
    },
    {
      title: "The journey to find my child",
      description:
        "Facilitating the process from issuance of viewing authorization to meeting prospective children, and completing bonding visits paralleled with medical assessments",
    },
    {
      title: "Social compatibility stage",
      description:
        "Facilitating the process from viewing authorization to meeting prospective children for social compatibility assessment, and conducting bonding visits paralleled with medical evaluations.",
    },
    {
      title: "Start a savings account",
      description: `Providing a copy of the birth certificate to start a savings account for the child worth 3000 EGP, or to open a bank account in "Nasser's Social Bank" to deposit 3000 EGP under the child's name. Facilitating financial security for the child's future.`,
    },
  ],
  ar: [
    {
      title: "لقاء مع الأسر المتقدمة",
      description:
        "استشارة مبدئية مع الأسر المتقدمة للكفالة لمناقشة العملية والمتطلبات.",
    },
    {
      title: "تقديم استمارة طلب الكفالة",
      description:
        "إكمال وتقديم استمارة طلب الكفالة الرسمية، مع تقديم التفاصيل اللازمة.",
    },
    {
      title: "مرحلة التقييم",
      description:
        "تقييم مدى ملاءمة الأسرة المتقدمة من خلال التقييمات الأولية والتفصيلية، ومراجعة المستندات والاعتماد.",
    },
    {
      title: "رحلتي للعثور على طفلي",
      description:
        "تسهيل العملية من إصدار إذن العرض إلى لقاء الأطفال المحتملين، وإتمام زيارات التعارف بالتوازي مع الفحوصات الطبية.",
    },
    {
      title: "مرحلة التوافق الاجتماعي",
      description:
        "تسهيل العملية من إصدار إذن العرض إلى لقاء الأطفال المحتملين لتقييم التوافق الاجتماعي، وإجراء زيارات التعارف بالتوازي مع التقييمات الطبية.",
    },
    {
      title: "فتح حساب توفير",
      description: `تقديم نسخة من شهادة الميلاد لفتح حساب توفير للطفل بقيمة 3000 جنيه مصري، أو فتح حساب بنكي في "بنك ناصر الاجتماعي" لإيداع 3000 جنيه باسم الطفل. تسهيل الأمان المالي لمستقبل الطفل.`,
    },
  ],
};

export const familyCardSteps = {
  en: [
    "Kafala parent/s make an insurance number for the child from the nearest insurance office that gets this number using the national ID number present in the electronic birth certificate of the child.",
    "Kafala parent/s open a bank account in 'Nasser's Social bank' under the name of the child.",
    "Kafala parent/s deposit 200 EGP in account number 21812 under 'Nasser's Social bank'; Cairo branch under the name of the Kafala parent/s. Another way to deposit the amount is through Fawry using the same bank information.",
    "Kafala parent/s then go to the social administration in their district in order to receive copies of their personal national ID numbers; a receipt to open an account; a recent 6x4 picture of the child and both parents.",
    "The company in contract with the ministry issues the card after sending all the documents to the ministry and hands it over the courier company.",
    "The courier company then delivers the card to the provided address.",
  ],
  ar: [
    "الذهاب الى الادارة الاجتماعية في محيط سكن الاسرة البديلة الكافلة، حيث يتم تسليم صور الأرقام القومية للوالدين الكافلين، وإيصال فتح الحساب، وإيصال دفع ٢٠٠ جنيه وصور حديثة ٤*٦ للطفل المكفول وللوالدين الكافلين ٥",
    "تسدد الأسرة البديلة الكافلة مبلغ ٢٠٠ جنيه على رقم الحساب ( ٢١٨١٢ ) التابع لبنك ناصر الإجتماعي فرع القاهرة باسم الأسر البديلة أو من خلال الدفع الفوري لذات الحساب",
    " تستخرج الأسرة البديلة الكافلة الرقم التأميني للطفل من أقرب مكتب تأمينات الذي يقوم بدوره باستخراجه باستخدام الرقم القومي الوارد بشهادة الميلاد المميكنة للطفل",
    "تقوم الشركة المتعاقدة مع الوزارة باستخراج البطاقة بعد ارسال البيانات والمستندات لها بمعرفة الوزارة وتسليمها الى شركة شحن لتوصيلها لمحل سكن الأسرة البديلة الكافلة",
    "تقوم الأسرة البديلة الكافلة بفتح حساب بنكي لدى بنك ناصر الاجتماعي بإسم الطفل المكفول",
    "تقوم الشركة المتعاقد معها بتوصيل البطاقة مباشرة للأسرة البديلة الكافلة بمحل سكنها",
  ],
};
