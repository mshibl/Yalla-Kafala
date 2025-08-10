import Link from "next/link";
import Section from "./Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Tickets() {
  return (
    <Section id="tickets">
      <h2 className="text-2xl font-elegant font-semibold tracking-wide leading-tight">
        Buy Your Gala Tickets Here
      </h2>
      <p className="max-w-3xl text-lg font-luxury leading-relaxed text-muted-foreground">
        Join us for an unforgettable evening where every ticket turns an
        orphanage into a home.
      </p>
      <div className="relative w-full max-w-3xl">
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-rose-500/10 via-fuchsia-500/10 to-amber-400/10 blur-2xl" />
        <div className="rounded-2xl p-[1.5px]  shadow-[var(--shadow-elevate)]">
          <Card className="rounded-[1rem] bg-transparent border-none shadow-none">
            <CardContent className="p-8 flex flex-col items-center gap-4">
              <Button asChild size="lg" className="text-lg font-luxury">
                <Link
                  href="https://givebutter.com/c/YKgala2025"
                  aria-label="Book tickets"
                >
                  Book Tickets
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
