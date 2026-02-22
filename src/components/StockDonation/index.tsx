import {
  CheckCircle2,
  CircleHelp,
  Landmark,
  Mail,
  TrendingUp,
} from "lucide-react";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { amcfDonationUrl } from "@/constants/links";

const content = {
  en: {
    badge: "Stock Donations",
    title: "Your Legacy: Investing in a Home for Every Child",
    intro:
      "As we work toward a world where every child in Egypt has a loving family, we invite you to consider a gift that provides support not just for today, but for generations to come.",
    powerTitle: "The Power of Giving Stock",
    powerText:
      "Instead of a traditional cash donation, you can contribute appreciated stock directly to our Endowment Fund held at the Community Foundation. This is one of the most tax-efficient ways to support our mission.",
    whyTitle: "Why give stock through our Community Foundation fund?",
    whyItems: [
      "Maximize Your Impact: By donating stock held for more than a year, you avoid capital gains tax. This allows you to give up to 20% more to our cause than if you sold the stock and donated the cash.",
      "Double Tax Benefit: You can typically deduct the full fair market value of the stock on your taxes, regardless of what you originally paid for it.",
      "Sustainable Hope: Your gift is invested in our Endowment. While the principal remains intact, the annual earnings provide a steady, reliable stream of income that powers our nationwide training and family-home initiatives year after year.",
    ],
    quote:
      '"A gift of stock today becomes a lifetime of hope for a child tomorrow."',
    processTitle: "Stock Donation Process for Yalla Kafala",
    steps: [
      "Visit https://amuslimcf.org/",
      'Click on "Donate".',
      'Select "Appreciated Assets".',
      "Complete the form and provide your stock brokerage with the transfer details at the top of the form.",
      'Answer these questions: "What is your DAF #?" -> Enter END0023. "What is the intended purpose for the gift?" -> Select "Other" and write "Contribution for Yalla Kafala Endown".',
      "Notify us by emailing nonprofitengage@amuslimcf.org once the stock transfer is complete.",
    ],
    amcfTitle: "Why this goes through AMCF",
    amcfText:
      "AMCF provides the compliance, brokerage transfer infrastructure, and endowment administration needed for safe and efficient stock donations. This structure also ensures your gift is stewarded and reported properly.",
    zakatTitle: "How We Handle Zakat-Designated Stock",
    zakatItems: [
      "Immediate Liquidation: All stock gifts designated as Zakat are liquidated immediately upon receipt.",
      "Direct Impact: Unlike our general endowment, Zakat funds are not held for long-term investment. 100% of the liquidated proceeds are applied directly to Zakat-compliant programs (such as the Small Family Home model).",
      "Timely Distribution: We ensure that these funds are deployed within the same calendar year the contribution was made, honoring the spiritual and timing requirements of your obligation.",
    ],
    primaryCta: "Start Stock Donation on AMCF",
    secondaryCta: "Email Confirmation",
    notes: "Important details to copy in the AMCF form",
    dafLabel: "DAF #",
    purposeLabel: "Intended purpose",
    purposeValue: "Contribution for Yalla Kafala Endown",
  },
  ar: {
    badge: "التبرع بالأسهم",
    title: "إرثك: استثمار في بيت لكل طفل",
    intro:
      "بينما نعمل من أجل عالم يحظى فيه كل طفل في مصر بأسرة محبة، ندعوك للتفكير في هدية تدعم رسالتنا اليوم ولأجيال قادمة.",
    powerTitle: "قوة التبرع بالأسهم",
    powerText:
      "بدلاً من التبرع النقدي التقليدي، يمكنك التبرع بالأسهم المرتفعة القيمة مباشرة إلى صندوق الوقف الخاص بنا لدى المؤسسة المجتمعية. هذه من أكثر الطرق كفاءة ضريبية لدعم رسالتنا.",
    whyTitle: "لماذا التبرع بالأسهم عبر صندوقنا في المؤسسة المجتمعية؟",
    whyItems: [
      "تعظيم الأثر: عند التبرع بأسهم محتفظ بها لأكثر من سنة، يمكنك تجنب ضريبة أرباح رأس المال مما قد يزيد قيمة عطائك.",
      "ميزة ضريبية مزدوجة: غالبًا يمكنك خصم كامل القيمة السوقية العادلة للسهم بغض النظر عن سعر الشراء الأصلي.",
      "أمل مستدام: تُستثمر الهبة في الوقف، وتدعم العوائد السنوية برامجنا ومبادراتنا الأسرية على مدار السنوات.",
    ],
    quote: '"هدية أسهم اليوم تصبح عمرًا من الأمل لطفل غدًا."',
    processTitle: "خطوات التبرع بالأسهم ليلا كفالة",
    steps: [
      "قم بزيارة https://amuslimcf.org/",
      'اضغط على "Donate".',
      'اختر "Appreciated Assets".',
      "أكمل النموذج وشارك شركة الوساطة بتفاصيل التحويل الموجودة أعلى النموذج.",
      'أجب عن الأسئلة التالية: "What is your DAF #?" -> أدخل END0023. "What is the intended purpose for the gift?" -> اختر "Other" واكتب "Contribution for Yalla Kafala Endown".',
      "بعد إتمام التحويل، أرسل تأكيدًا إلى nonprofitengage@amuslimcf.org.",
    ],
    amcfTitle: "لماذا يتم ذلك عبر AMCF",
    amcfText:
      "توفر AMCF بنية الامتثال والتحويل وإدارة الوقف اللازمة لاستلام تبرعات الأسهم بأمان وكفاءة، مع حوكمة واضحة وتوثيق مناسب للتبرعات.",
    zakatTitle: "كيف نتعامل مع الأسهم المخصصة للزكاة",
    zakatItems: [
      "تسييل فوري: أي تبرع أسهم مخصص للزكاة يتم تسييله فور الاستلام.",
      "أثر مباشر: لا يتم استثمار أموال الزكاة طويلًا، ويتم توجيه 100% من العائد لبرامج متوافقة مع الزكاة.",
      "توزيع في نفس العام: يتم صرف هذه الأموال خلال نفس السنة الميلادية التي تم فيها التبرع.",
    ],
    primaryCta: "ابدأ التبرع بالأسهم عبر AMCF",
    secondaryCta: "إرسال تأكيد عبر البريد",
    notes: "بيانات مهمة لإدخالها في نموذج AMCF",
    dafLabel: "رقم DAF",
    purposeLabel: "الغرض المقصود",
    purposeValue: "Contribution for Yalla Kafala Endown",
  },
};

export default function StockDonation({ locale }: { locale: Locale }) {
  const t = content[locale];

  return (
    <section className="pt-28 pb-14 md:pt-36 md:pb-20 bg-gradient-to-b from-primary/5 via-white to-secondary/5">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <TrendingUp className="h-4 w-4" />
            {t.badge}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 md:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-700 md:text-lg">
            {t.intro}
          </p>

          <div className="mt-8 rounded-2xl border border-primary/15 bg-white p-5 shadow-sm md:p-7">
            <h2 className="text-xl font-bold text-gray-900">{t.powerTitle}</h2>
            <p className="mt-3 text-gray-700">{t.powerText}</p>
            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              {t.whyTitle}
            </h3>
            <ul className="mt-3 space-y-3">
              {t.whyItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-lg bg-secondary/10 p-4 text-sm font-medium text-gray-800">
              {t.quote}
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
            <h2 className="text-xl font-bold text-gray-900">
              {t.processTitle}
            </h2>
            <ol className="mt-4 space-y-3">
              {t.steps.map((step, idx) => (
                <li key={step} className="flex items-start gap-3 text-gray-700">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2 text-amber-900">
                <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="font-semibold">{t.notes}</p>
              </div>
              <p className="mt-2 text-sm text-amber-900">
                <strong>{t.dafLabel}:</strong> END0023
              </p>
              <p className="mt-1 text-sm text-amber-900">
                <strong>{t.purposeLabel}:</strong> {t.purposeValue}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
            <h2 className="text-xl font-bold text-gray-900">{t.amcfTitle}</h2>
            <p className="mt-3 text-gray-700">{t.amcfText}</p>
          </div>

          <div className="mt-8 rounded-2xl border border-secondary/20 bg-secondary/5 p-5 md:p-7">
            <h2 className="text-xl font-bold text-gray-900">{t.zakatTitle}</h2>
            <ul className="mt-4 space-y-3">
              {t.zakatItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={amcfDonationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              <Landmark className="h-4 w-4" />
              {t.primaryCta}
            </a>
            <a
              href="mailto:nonprofitengage@amuslimcf.org"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
            >
              <Mail className="h-4 w-4" />
              {t.secondaryCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
