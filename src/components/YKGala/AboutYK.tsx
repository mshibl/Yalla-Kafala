import Link from "next/link";
import Section from "./Section";
import { Button } from "@/components/ui/button";

export default function AboutYK() {
  return (
    <Section id="about-yk">
      <h2 className="text-2xl font-elegant font-semibold tracking-wide leading-tight">
        About YallaKafala
      </h2>
      <div className="max-w-3xl space-y-4 text-lg font-luxury leading-relaxed text-muted-foreground text-left md:text-center">
        <p>
          Yalla Kafala is a U.S.-based nonprofit dedicated to supporting
          orphaned and vulnerable children in Egypt through long-term
          sponsorship. We partner with trusted organizations to provide holistic
          care, education, advocacy and emotional support ensuring every child
          has the opportunity to grow with dignity and a true sense of
          belonging.
        </p>
        <p>
          Our mission is rooted in the belief that every child deserves love,
          stability, and the chance to thrive.
        </p>
        <p>
          Contributions to Yalla Kafala, a 501(c)(3) organization, may be
          tax-deductible to the extent permitted by law. The deductible amount
          excludes the fair market value of any goods or services received.
        </p>
      </div>
      <Button asChild size="lg" className="text-lg font-luxury">
        <Link
          href="https://yallakafala.org"
          target="_blank"
          aria-label="Learn more"
        >
          Learn More
        </Link>
      </Button>
    </Section>
  );
}
