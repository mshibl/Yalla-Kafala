import type { Locale } from "../Providers/LocaleProvider";
import Hero from "./Hero";
import AboutEvent from "./AboutEvent";
import VideoSection from "./VideoSection";
import Highlights from "./Highlights";
import ReserveCallout from "./ReserveCallout";
import Panelists from "./Panelists";
import Moderator from "./Moderator";
import Program from "./Program";
import ClassicalArabicBand from "./ClassicalArabicBand";
import Team from "./Team";
import Tickets from "./Tickets";
import Sponsorships from "./Sponsorships";
import AboutYK from "./AboutYK";

const YallaKafalaGala = ({ locale }: { locale: Locale }) => {
  // locale is accepted for future localization needs
  return (
    <main className="text-[#333333]">
      <Hero />
      <AboutEvent />
      <VideoSection />
      <Highlights />
      <ReserveCallout />
      <Panelists />
      <Moderator />
      <ClassicalArabicBand />
      <Program />
      <Team />
      <Tickets />
      <Sponsorships />
      <AboutYK />
    </main>
  );
};

export default YallaKafalaGala;
