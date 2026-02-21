import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Locale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";
import { donationMethods } from "./constants";
import DonateNowModal from "@/components/Donate/DonateNowModal";

type DonationMethodProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  color: string;
};

const DonationMethod = ({
  icon,
  title,
  description,
  link,
  color,
}: DonationMethodProps) => {
  return (
    <div className="group">
      <Link
        href={link}
        className="flex items-center gap-4 p-4 rounded-lg transition-all duration-300 hover:bg-white/50 hover:shadow-sm"
        aria-label={`Learn more about ${title}`}
      >
        <div
          className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <div
            className="text-primary transition-all duration-300 group-hover:scale-110"
            style={{ color }}
          >
            {icon}
          </div>
        </div>
        <div>
          <h3 className="text-base font-medium mb-1 text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        </div>
      </Link>
    </div>
  );
};

export const MakeDifference = ({ locale }: { locale: Locale }) => {
  return (
    <section
      id="make-difference"
      className="py-10 bg-gray-50/50 border-t border-gray-100"
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-primary mb-2">
            {translations.title[locale]}
          </h2>
          <p className="text-gray-600">{translations.description[locale]}</p>
        </div>

        <Card className="border-none shadow-sm bg-gray-50/80 backdrop-blur-sm">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {donationMethods.map((method, index) => (
                <DonationMethod
                  key={index}
                  {...method}
                  title={method.title[locale]}
                  description={method.description[locale]}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <DonateNowModal locale={locale} asChild>
            <Button className="bg-primary hover:bg-primary/90 px-6">
              {translations.getInvolvedButton[locale]}
            </Button>
          </DonateNowModal>
        </div>
      </div>
    </section>
  );
};
