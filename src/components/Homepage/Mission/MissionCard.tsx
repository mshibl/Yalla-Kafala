"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
interface MissionCardProps {
  image: string;
  title: string;
  description: string;
  delay: number;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  image,
  title,
  description,
  delay,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              if (cardRef.current) {
                cardRef.current.classList.add("opacity-100");
                cardRef.current.classList.remove("opacity-0", "translate-y-10");
              }
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className="flex items-start gap-4 rounded-2xl border border-primary/10 bg-white p-5 text-start shadow-sm opacity-0 translate-y-10 transition-all duration-700 ease-out md:flex-col md:items-center md:p-8 md:text-center"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 md:h-16 md:w-16">
        <Image src={image} alt="" width={44} height={44} />
      </div>
      <div>
        <h3 className="mb-1.5 text-xl font-semibold text-gray-900 md:mb-3">
          {title}
        </h3>
        <p className="text-[15px] leading-relaxed text-gray-700">
          {description}
        </p>
      </div>
    </div>
  );
};
