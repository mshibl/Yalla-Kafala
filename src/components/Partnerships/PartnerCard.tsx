import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/components/Providers/LocaleProvider";
import type { Partner } from "./types";

interface PartnerCardProps {
  partner: Partner;
  locale: Locale;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, locale }) => {
  const name = locale === "ar" ? partner.nameAr : partner.nameEn;
  const description =
    locale === "ar" ? partner.descriptionAr : partner.descriptionEn;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        <img
          src={partner.logo}
          alt={`${name} logo`}
          className="h-24 object-contain"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-primary">{name}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default PartnerCard;
