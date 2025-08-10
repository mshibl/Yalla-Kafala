import Section from "./Section";
import { Card, CardContent } from "@/components/ui/card";

export default function Highlights() {
  return (
    <Section id="highlights">
      <h2 className="text-2xl font-elegant font-semibold tracking-wide leading-tight">
        Our Gala&apos;s Fundraising Goal
      </h2>
      <p className="max-w-3xl text-lg font-luxury leading-relaxed text-muted-foreground">
        One Night. Infinite Futures. Be the reason a child wakes up to love, not
        walls.
        <br />
        Buy your gala tickets today to make a direct impact on the following
        initiatives
      </p>
      <div className="relative w-full max-w-4xl">
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-rose-500/10 via-fuchsia-500/10 to-amber-400/10 blur-2xl" />
        <div className="flex flex-col gap-6 text-left">
          <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-foreground/10 to-foreground/5 shadow-[var(--shadow-elevate)]">
            <Card className="rounded-[1rem] h-full">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                  1
                </div>
                <div className="text-lg font-luxury pt-2">
                  <strong>Small Home:</strong> Launch of Yalla Kafala&apos;s
                  Permanent Campus in Egypt
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-foreground/10 to-foreground/5 shadow-[var(--shadow-elevate)]">
            <Card className="rounded-[1rem] h-full">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                  2
                </div>
                <div className="text-lg font-luxury pt-2">
                  <strong>Child &amp; Family Support: </strong> Child protection
                  and Women&apos;s empowerment programs
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-foreground/10 to-foreground/5 shadow-[var(--shadow-elevate)]">
            <Card className="rounded-[1rem] h-full">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                  3
                </div>
                <div className="text-lg font-luxury pt-2">
                  <strong>Advocacy:</strong> & Policy influence for children and
                  Kafala rights.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}
