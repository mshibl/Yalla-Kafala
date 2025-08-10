import Section from "./Section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";

export default function AboutEvent() {
  return (
    <Section id="about">
      <h2 className="text-2xl font-elegant font-semibold tracking-wide leading-tight">
        Yalla Kafala&apos;s First Annual Fundraising Gala
      </h2>
      <p className="max-w-3xl text-lg font-luxury leading-relaxed text-muted-foreground">
        Join us for an evening of connection and inspiration. Enjoy a gourmet
        three-course dinner, live DJ entertainment, and a powerful founder panel
        featuring leading Egyptian innovators. Dress to impress in formal
        attire. All proceeds support Yalla Kafala&apos;s mission to sponsor
        orphaned children in Egypt with care, advocacy, education, and
        opportunity.
      </p>

      {/* Subtle glow behind the details */}
      <div className="relative w-full max-w-4xl">
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-rose-500/10 via-fuchsia-500/10 to-amber-400/10 blur-2xl" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left md:text-center">
          {/* Location */}
          <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-foreground/10 to-foreground/5 shadow-[var(--shadow-elevate)]">
            <Card className="rounded-[1rem] h-full">
              <CardContent className="p-6 flex items-center md:block gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto md:mb-3">
                  <MapPin className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground">
                    Address
                  </div>
                  <Link
                    href="https://www.google.com/maps/search/?api=1&query=Google&query_place_id=ChIJz6I9mu13j4ARzwOM_usAL-M"
                    className="text-md md:text-lg font-semibold font-luxury text-[#333333]"
                  >
                    Grand Hyatt at SFO 55 S McDonnell Rd San Francisco, CA 94128
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Date */}
          <div className="rounded-2xl p-[1.5px] bg-gradient-to-r from-foreground/10 to-foreground/5 shadow-[var(--shadow-elevate)]">
            <Card className="rounded-[1rem] h-full">
              <CardContent className="p-6 flex items-center md:block gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto md:mb-3">
                  <CalendarIcon className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-sm uppercase tracking-widest text-muted-foreground">
                    Date
                  </div>
                  <div className="text-md md:text-lg font-semibold font-luxury text-[#333333]">
                    Saturday, October 18 6:30PM PDT
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}
