"use client";

import { useLocale } from "@/components/Providers/LocaleProvider";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useEffect } from "react";

interface ImpactStatProps {
  title: string;
  value: number;
  description: string;
  target: number;
  delay: number;
}

export const ImpactStat: React.FC<ImpactStatProps> = ({
  title,
  value,
  description,
  target,
  delay,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [percent, setPercent] = useState(0);
  const statRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const locale = useLocale();
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entries[0].target);
        }
      },
      { threshold: 0.1 },
    );

    if (statRef.current) observer.observe(statRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timeout = setTimeout(() => {
      let startTime: number | null = null;
      const duration = 2000;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setDisplayValue(Math.floor(progress * value));
        setPercent(Math.floor(progress * ((value / target) * 100)));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, value, target, delay]);

  return (
    <div
      ref={statRef}
      className={cn(
        "bg-white rounded-xl p-6 shadow-md opacity-0 translate-y-10 transition-all duration-700 hover:shadow-lg",
        isVisible && "opacity-100 translate-y-0",
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
      <div className="flex items-end gap-1 mb-3">
        <span className="text-3xl font-bold">
          {locale === "ar" ? displayValue : target}
        </span>
        <span className="text-gray-500 text-sm mb-1">
          / {locale === "ar" ? target : target}
        </span>
      </div>

      <Progress value={percent} className="h-2 mb-4" locale={locale} />

      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};
