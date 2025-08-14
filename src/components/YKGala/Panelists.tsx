import { Mic } from "lucide-react";
import Section from "./Section";
import { panelists } from "./constants";
import Profile from "./Profile";

export default function Panelists() {
  return (
    <>
      <Section id="panelists">
        <div className="relative w-full max-w-3xl">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-rose-500/10 via-fuchsia-500/10 to-amber-400/10 blur-2xl" />
          <div className="flex flex-col items-center gap-2">
            <Mic className="size-10 text-brand" aria-hidden>
              {" "}
            </Mic>
            <h2 className="text-2xl font-elegant font-semibold tracking-wide leading-tight">
              Panelists
            </h2>
            <hr className="w-24 border-t-2 border-brand/60" />
          </div>
        </div>
        {panelists.map((person, index) => (
          <Profile key={index} person={person} />
        ))}
      </Section>
    </>
  );
}
