import { Card, CardContent } from "@/components/ui/card";
import { translations } from "./translations";

type Service = {
  icon: React.ReactNode;
  title: string;
  description: string;
  titleAr: string;
  descriptionAr: string;
};

const ServicesSection = ({
  services,
  locale,
}: {
  services: Service[];
  locale: string;
}) => (
  <section className="py-16 md:py-24 bg-gray-50">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {locale === "ar"
            ? translations.servicesSection.title.ar
            : translations.servicesSection.title.en}
        </h2>
        <p className="text-lg text-gray-600">
          {locale === "ar"
            ? translations.servicesSection.description.ar
            : translations.servicesSection.description.en}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="border-none">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {locale === "ar" ? service.titleAr : service.title}
              </h3>
              <p className="text-gray-600">
                {locale === "ar" ? service.descriptionAr : service.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
