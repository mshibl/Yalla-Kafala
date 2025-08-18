import { Button } from "../ui/button";
import Link from "next/link";
import Section from "./Section";
import Image from "next/image";

export default function ClassicalArabicBand() {
  return (
    <Section id="classical-arabic-band">
      <h2 className="text-2xl font-elegant font-semibold tracking-wide leading-tight">
        Classical Arabic Band Performance
      </h2>

      <div className="max-w-4xl space-y-6">
        <p className="text-lg font-luxury text-muted-foreground leading-relaxed">
          Experience an unforgettable evening of music as Reyad, Seif, and Loay
          bring the rich traditions of Arabic classics to life.
        </p>

        <p className="text-lg font-luxury text-muted-foreground leading-relaxed">
          Their performance will weave together timeless favorites, transporting
          you with melodies that celebrate heritage, artistry, and cultural
          pride.
        </p>

        <div className="flex justify-center items-center gap-4">
          <Link href="https://www.youtube.com/@Reyadmusic">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Image src="/youtube.svg" alt="YouTube" width={20} height={20} />
              Watch on YouTube
            </Button>
          </Link>
          <Link href="https://www.instagram.com/reyadmusic/">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2"
            >
              <Image
                src="/instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
              />
              Follow on Instagram
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/images/band1.jpeg"
              alt="Classical Arabic Band Performance"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/images/band2.jpeg"
              alt="Traditional Arabic Instruments"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src="/images/band3.jpeg"
              alt="Arabic Music Performance"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}
