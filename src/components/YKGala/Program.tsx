import Section from "./Section";
import { Card, CardContent } from "@/components/ui/card";

export default function Program() {
  return (
    <Section id="program">
      <h2 className="text-2xl font-elegant font-semibold tracking-wide leading-tight">
        Event Program
      </h2>
      <div className="relative w-full max-w-4xl">
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-rose-500/10 via-fuchsia-500/10 to-amber-400/10 blur-2xl" />
        <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-foreground/10 to-foreground/5 shadow-[var(--shadow-elevate)]">
          <Card className="rounded-[1rem]">
            <CardContent className="p-6 md:p-8 text-left space-y-6">
              <div className="border-b border-border/50 pb-4">
                <div className="text-lg font-elegant font-semibold text-primary mb-1">
                  6:30 PM
                </div>
                <div className="text-lg font-luxury text-muted-foreground">
                  Welcome Reception & Classical Arabic Performance
                </div>
              </div>

              <div className="border-b border-border/50 pb-4">
                <div className="text-lg font-elegant font-semibold text-primary mb-1">
                  7:00 PM
                </div>
                <div className="text-lg font-luxury text-muted-foreground">
                  Dinner & Kafala Story
                </div>
              </div>

              <div className="border-b border-border/50 pb-4">
                <div className="text-lg font-elegant font-semibold text-primary mb-1">
                  7:30 PM
                </div>
                <div className="text-lg font-luxury text-muted-foreground">
                  Panel: Social Entrepreneurship And Philanthropy With Bay Area
                  Egyptians Leading Change
                </div>
              </div>

              <div className="border-b border-border/50 pb-4">
                <div className="text-lg font-elegant font-semibold text-primary mb-1">
                  8:30 PM
                </div>
                <div className="text-lg font-luxury text-muted-foreground">
                  Donation Moment
                </div>
              </div>

              <div className="border-b border-border/50 pb-4">
                <div className="text-lg font-elegant font-semibold text-primary mb-1">
                  9:00 PM
                </div>
                <div className="text-lg font-luxury text-muted-foreground">
                  Arabic DJ and Dancing
                </div>
              </div>

              <div>
                <div className="text-lg font-elegant font-semibold text-primary mb-1">
                  11:00 PM
                </div>
                <div className="text-lg font-luxury text-muted-foreground">
                  Farewell
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
