import Section from "./Section";
import { Card } from "@/components/ui/card";

export default function VideoSection() {
  return (
    <Section id="video">
      <h2 className="text-2xl font-elegant font-semibold tracking-wide leading-tight">
        About Yalla Kafala
      </h2>
      <p className="max-w-3xl text-lg font-luxury leading-relaxed text-muted-foreground">
        This year, Yalla Kafala is expanding our reach to help thousands more
        children transition from institutional care into safe, loving families.
        Your support at the gala helps us train, guide, and advocate for more
        kafala parents than ever before, ensuring every child has a home to
        thrive in.
      </p>
      <div className="relative w-full max-w-4xl">
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-rose-500/10 via-fuchsia-500/10 to-amber-400/10 blur-2xl" />
        <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-foreground/10 to-foreground/5 shadow-[var(--shadow-elevate)]">
          <Card className="rounded-[1rem] overflow-hidden">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/SdZ15R9ya2U?si=5zGLbW-jLZXA9g4w"
                title="YallaKafala Gala teaser"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}
