"use client";
import { useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
interface MissionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  icon: Icon,
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
      className="flex items-start gap-4 py-5 text-start opacity-0 translate-y-10 transition-all duration-700 ease-out first:pt-0 md:flex-col md:rounded-2xl md:border md:border-primary/10 md:bg-white md:p-7 md:shadow-sm md:first:pt-7"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F3E8F5] md:h-14 md:w-14">
        <Icon
          className="h-7 w-7 text-primary"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>
      <div>
        <h3 className="mb-1 text-lg font-semibold text-gray-900 md:mb-2 md:text-xl">
          {title}
        </h3>
        <p className="text-base leading-relaxed text-gray-700">{description}</p>
      </div>
    </div>
  );
};
