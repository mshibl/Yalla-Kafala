import Section from "./Section";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Sponsorships() {
  return (
    <Section id="sponsorships">
      <h2 className="text-2xl font-elegant font-semibold tracking-wide leading-tight">
        Sponsorships
      </h2>
      <p className="max-w-3xl text-lg font-luxury leading-relaxed text-muted-foreground">
        To learn more about sponsorship opportunities for the Gala, please reach
        out to our Gala Coordinator
      </p>
      <Button asChild size="lg" className="text-lg font-luxury">
        <Link
          href="mailto:logain.asfour@yallakafala.org"
          target="_blank"
          aria-label="Contact us for sponsorships"
        >
          Contact Us
        </Link>
      </Button>
    </Section>
  );
}
