export const requiredDocuments = {
  en: [
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
      title: "Evaluation Stage",
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
    "اﻟﺬﻫﺎب اﻟﻰ اﻻدارة اﻻﺟﺘﻤﺎﻋﻴﺔ ﻓﻲ ﻣﺤﻴﻂ ﺳﻜﻦ اﻻﺳﺮة اﻟﺒﺪﻳﻠﺔ اﻟﻜﺎﻓﻠﺔ، ﺣﻴﺚ ﻳﺘﻢ ﺗﺴﻠﻴﻢ ﺻﻮر اﻷرﻗﺎم اﻟﻘﻮﻣﻴﺔ ﻟﻠﻮاﻟﺪﻳﻦ اﻟﻜﺎﻓﻠﻴﻦ، وإﻳﺼﺎل ﻓﺘﺢ اﻟﺤﺴﺎب، وإﻳﺼﺎل دﻓﻊ ٢٠٠ ﺟﻨﻴﻪ وﺻﻮر ﺣﺪﻳﺜﺔ ٤*٦ ﻟﻠﻄﻔﻞ اﻟﻤﻜﻔﻮل وﻟﻠﻮاﻟﺪﻳﻦ اﻟﻜﺎﻓﻠﻴﻦ ٥",
    "ﺗﺴﺪد اﻷﺳﺮة اﻟﺒﺪﻳﻠﺔ اﻟﻜﺎﻓﻠﺔ ﻣﺒﻠﻎ ٢٠٠ ﺟﻨﻴﻪ ﻋﻠﻰ رﻗﻢ اﻟﺤﺴﺎب ( ٢١٨١٢ ) اﻟﺘﺎﺑﻊ ﻟﺒﻨﻚ ﻧﺎﺻﺮ اﻹﺟﺘﻤﺎﻋﻲ ﻓﺮع اﻟﻘﺎﻫﺮة ﺑﺎﺳﻢ اﻷﺳﺮ اﻟﺒﺪﻳﻠﺔ أو ﻣﻦ ﺧﻼل اﻟﺪﻓﻊ اﻟﻔﻮري ﻟﺬات اﻟﺤﺴﺎب",
    " ﺗﺴﺘﺨﺮج اﻷﺳﺮة اﻟﺒﺪﻳﻠﺔ اﻟﻜﺎﻓﻠﺔ اﻟﺮﻗﻢ اﻟﺘﺄﻣﻴﻨﻲ ﻟﻠﻄﻔﻞ ﻣﻦ أﻗﺮب ﻣﻜﺘﺐ ﺗﺄﻣﻴﻨﺎت اﻟﺬي ﻳﻘﻮم ﺑﺪوره ﺑﺎﺳﺘﺨﺮاﺟﻪ ﺑﺎﺳﺘﺨﺪام اﻟﺮﻗﻢ اﻟﻘﻮﻣﻲ اﻟﻮارد ﺑﺸﻬﺎدة اﻟﻤﻴﻼد اﻟﻤﻤﻴﻜﻨﺔ ﻟﻠﻄﻔﻞ",
    "تقوم اﻟﺸﺮﻛﺔ اﻟﻤﺘﻌﺎﻗﺪة ﻣﻊ اﻟﻮزارة ﺑﺎﺳﺘﺨﺮاج اﻟﺒﻄﺎﻗﺔ ﺑﻌﺪ ارﺳﺎل اﻟﺒﻴﺎﻧﺎت واﻟﻤﺴﺘﻨﺪات ﻟﻬﺎ ﺑﻤﻌﺮﻓﺔ اﻟﻮزارة وﺗﺴﻠﻴﻤﻬﺎ اﻟﻰ ﺷﺮﻛﺔ ﺷﺤﻦ ﻟﺘﻮﺻﻴﻠﻬﺎ ﻟﻤﺤﻞ ﺳﻜﻦ اﻷﺳﺮة اﻟﺒﺪﻳﻠﺔ اﻟﻜﺎﻓﻠﺔ",
    "ﺗﻘﻮم اﻷﺳﺮة اﻟﺒﺪﻳﻠﺔ اﻟﻜﺎﻓﻠﺔ ﺑﻔﺘﺢ ﺣﺴﺎب ﺑﻨﲄ ﻟﺪى ﺑﻨﻚ ﻧﺎﺻﺮ اﻻﺟﺘﻤﺎﻋﻲ ﺑﺈﺳﻢ اﻟﻄﻔﻞ اﻟﻤﻜﻔﻮل",
    "ﺗﻘﻮم اﻟﺸﺮﻛﺔ اﻟﻤﺘﻌﺎﻗﺪ ﻣﻌﻬﺎ ﺑﺘﻮﺻﻴﻞ اﻟﺒﻄﺎﻗﺔ ﻣﺒﺎﺷﺮة ﻟﻸﺳﺮة اﻟﺒﺪﻳﻠﺔ اﻟﻜﺎﻓﻠﺔ ﺑﻤﺤﻞ ﺳﻜﻨﻬﺎ",
  ],
};
