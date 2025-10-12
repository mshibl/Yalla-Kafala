import Section from "./Section";

export default function Hero() {
  return (
    <Section id="hero" className="pt-12">
      <div
        className="relative mx-auto w-full max-w-xl md:max-w-2xl group"
        aria-label="Gala invitation card"
      >
        {/* Subtle glow behind the card */}
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-rose-500/10 via-fuchsia-500/10 to-amber-400/10 blur-2xl" />

        {/* Gradient border frame */}
        <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-foreground/10 to-foreground/5 shadow-[var(--shadow-elevate)] transition-transform duration-700 ease-out group-hover:scale-[1.01]">
          <div className="relative overflow-hidden rounded-[1rem] bg-background">
            {/* Image */}
            <img
              src="/images/invitation.jpeg"
              alt="YallaKafala Gala invitation card"
              loading="eager"
              className="h-full w-full object-cover "
            />

            {/* Soft vignette */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.15),transparent_30%),linear-gradient(to_bottom,rgba(0,0,0,0.08),transparent_40%)]" />

            {/* Gentle glass reflection */}
            <div className="pointer-events-none absolute -left-24 -top-24 h-2/3 w-2/3 rotate-12 rounded-2xl bg-white/10 blur-2xl mix-blend-overlay" />
          </div>
        </div>
      </div>
    </Section>
  );
}
