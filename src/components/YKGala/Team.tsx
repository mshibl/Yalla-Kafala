import Section from "./Section";
import { team } from "./constants";
import Profile from "./Profile";

export default function Team() {
  return (
    <>
      <Section id="team">
        <div className="relative w-full max-w-3xl">
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-rose-500/10 via-fuchsia-500/10 to-amber-400/10 blur-2xl" />
          <h2 className="text-2xl font-elegant font-semibold tracking-wide leading-tight">
            The Team
          </h2>
        </div>
        {team.map((person, index) => (
          <Profile key={index} person={person} />
        ))}
      </Section>
    </>
  );
}
