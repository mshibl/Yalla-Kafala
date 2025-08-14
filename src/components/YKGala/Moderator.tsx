import { Mic } from "lucide-react";
import Section from "./Section";
import Profile from "./Profile";

export default function Panelists() {
  const person = {
    name: "Omar Soudodi",
    title: "Investor & Tech Operator",
    description:
      "Omar is a seasoned entrepreneur and investor with decades of experience leading innovative tech companies in the MENA region and Silicon Valley. As a former Managing Director at PayFort (acquired by Amazon), he’s known for scaling fintech and supporting emerging founders across the globe.",
    image:
      "https://assets.ppassets.com/p-4dydVxxLpCxG4uQ3cWvZxa/flyer/speaker_block_image/base",
  };
  return (
    <>
      <Section id="panelists">
        <div className="relative w-full max-w-3xl">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-rose-500/10 via-fuchsia-500/10 to-amber-400/10 blur-2xl" />
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-2xl font-elegant font-semibold tracking-wide leading-tight">
              Moderator
            </h2>
            <hr className="w-24 border-t-2 border-brand/60" />
          </div>
        </div>

        <Profile person={person} />
      </Section>
    </>
  );
}
