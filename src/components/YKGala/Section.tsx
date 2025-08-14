import { cn } from "@/lib/utils";
import React from "react";

export type SectionProps = {
  children: React.ReactNode;
  id?: string;
  className?: string;
};

export default function Section({ children, id, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("min-h-screen flex items-center justify-center", className)}
    >
      <div className="container px-6 py-16 flex flex-col items-center justify-center text-center gap-6">
        {children}
      </div>
    </section>
  );
}
