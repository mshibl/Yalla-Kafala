import { translations } from "./translations";
const NourStory = ({ locale }: { locale: string }) => (
  <div className="mt-16 bg-gray-50 p-8 rounded-xl">
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="md:w-1/3">
        <img
          src="https://images.unsplash.com/photo-1594708767771-a5f97c3b1eb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt={"A child's success story"}
          className="w-full h-64 object-cover rounded-lg shadow-md"
        />
      </div>
      <div className="md:w-2/3">
        <h3 className="text-2xl font-semibold text-primary mb-4">
          {locale === "ar"
            ? translations.nourStory.title.ar
            : translations.nourStory.title.en}
        </h3>
        <p className="text-gray-600 mb-4">
          {locale === "ar"
            ? translations.nourStory.description1.ar
            : translations.nourStory.description1.en}
        </p>
        <p className="text-gray-600">
          {locale === "ar"
            ? translations.nourStory.description2.ar
            : translations.nourStory.description2.en}
        </p>
      </div>
    </div>
  </div>
);

export default NourStory;
