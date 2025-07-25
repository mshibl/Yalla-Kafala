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
      className="glass-card flex flex-col items-center justify-center p-8 opacity-0 translate-y-10 transition-all duration-700 ease-out"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Image src={image} alt={title} width={64} height={64} />
      </div>
      <h3 className="heading-sm mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
