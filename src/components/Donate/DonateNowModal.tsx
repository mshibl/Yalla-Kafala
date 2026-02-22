"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ExternalLink, Landmark, LineChart } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { givebutterDonationUrl } from "@/constants/links";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

type Locale = "en" | "ar";

type DonateNowModalProps = {
  locale: Locale;
  className?: string;
  children?: React.ReactNode;
  onTriggerClick?: () => void;
  style?: React.CSSProperties;
  asChild?: boolean;
};

const copy = {
  en: {
    trigger: "Donate Now",
    title: "Choose your donation type",
    description:
      "Support Yalla Kafala through a regular online donation or a stock donation.",
    cardBankTitle: "Donate by card or bank",
    cardBankDescription: "Fast online donation on Givebutter.",
    stockTitle: "Donate stock",
    stockDescription: "Review the stock donation steps on our website.",
    note: "Stock donations are processed through AMCF.",
  },
  ar: {
    trigger: "تبرع الآن",
    title: "اختر نوع التبرع",
    description: "ادعم يلا كفالة بالتبرع الإلكتروني أو بتبرع الأسهم.",
    cardBankTitle: "تبرع بالبطاقة أو البنك",
    cardBankDescription: "تبرع إلكتروني سريع عبر Givebutter.",
    stockTitle: "تبرع بالأسهم",
    stockDescription: "راجع خطوات التبرع بالأسهم على موقعنا.",
    note: "تتم معالجة تبرعات الأسهم عبر AMCF.",
  },
};

export default function DonateNowModal({
  locale,
  className,
  children,
  onTriggerClick,
  style,
  asChild = false,
}: DonateNowModalProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const t = copy[locale];

  const handleTriggerClick = () => {
    onTriggerClick?.();
    setOpen(true);
  };

  const modalBody = (
    <div className="space-y-3 pt-1">
      <a
        href={givebutterDonationUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setOpen(false)}
        className="group flex w-full items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <span className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
          <Landmark className="h-4 w-4" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold text-gray-900">
            {t.cardBankTitle}
          </span>
          <span className="mt-1 block text-sm text-gray-600">
            {t.cardBankDescription}
          </span>
        </span>
        <span className="mt-1 text-gray-400 transition-colors group-hover:text-primary">
          <ExternalLink className="h-4 w-4" />
        </span>
      </a>

      <Link
        href={`/${locale}/stock-donation`}
        onClick={() => setOpen(false)}
        className="group flex w-full items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <span className="mt-0.5 rounded-lg bg-secondary/10 p-2 text-secondary">
          <LineChart className="h-4 w-4" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold text-gray-900">
            {t.stockTitle}
          </span>
          <span className="mt-1 block text-sm text-gray-600">
            {t.stockDescription}
          </span>
        </span>
        <span className="mt-1 text-gray-400 transition-colors group-hover:text-primary">
          <ExternalLink className="h-4 w-4" />
        </span>
      </Link>

      <p className="pt-1 text-xs text-gray-500">{t.note}</p>
    </div>
  );

  const Trigger = asChild ? Slot : "button";

  return (
    <>
      <Trigger
        onClick={handleTriggerClick}
        className={cn(className)}
        aria-haspopup="dialog"
        style={style}
        {...(!asChild ? { type: "button" as const } : {})}
      >
        {children ?? t.trigger}
      </Trigger>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[85vh] px-4 pb-5">
            <DrawerHeader className="px-0">
              <DrawerTitle>{t.title}</DrawerTitle>
              <DrawerDescription>{t.description}</DrawerDescription>
            </DrawerHeader>
            {modalBody}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t.title}</DialogTitle>
              <DialogDescription>{t.description}</DialogDescription>
            </DialogHeader>
            {modalBody}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
