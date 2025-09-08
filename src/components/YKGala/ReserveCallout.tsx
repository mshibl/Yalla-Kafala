import Link from "next/link";
import Section from "./Section";
import { Button } from "@/components/ui/button";

export default function ReserveCallout() {
  return (
    <Section id="reserve">
      <h2 className="text-2xl font-elegant font-semibold tracking-wide leading-tight">
        Reserve Your Gala Tickets
      </h2>
      <p className="max-w-3xl text-lg font-luxury leading-relaxed text-muted-foreground">
        At Yalla Kafala, we believe every child deserves love, dignity, and the
        chance to thrive. In Egypt, millions of orphaned children lack the
        security of family and essential care. This gala supports our mission to
        provide long-term sponsorship, education, advocacy and belonging.
      </p>
      <div className="relative w-full max-w-3xl">
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-rose-500/10 via-fuchsia-500/10 to-amber-400/10 blur-2xl" />
        <div className="p-8 flex flex-col items-center gap-4">
          <Button asChild size="lg" className="text-lg font-luxury">
            <Link
              href="https://givebutter.com/YKgala2025"
              aria-label="Reserve now"
            >
              Reserve Now
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
