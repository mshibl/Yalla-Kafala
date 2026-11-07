"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export const CopyResourceLinkButton = ({
  href,
  buttonLabel,
  successLabel,
  errorLabel,
}: {
  href: string;
  buttonLabel: string;
  successLabel: string;
  errorLabel: string;
}) => {
  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}${href}`;
      await navigator.clipboard.writeText(url);
      toast.success(successLabel);
    } catch (error) {
      console.error("Failed to copy resource link:", error);
      toast.error(errorLabel);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleCopy}
      className="rounded-full px-4 text-sm font-semibold text-gray-700 hover:text-primary"
    >
      <Copy className="h-4 w-4" aria-hidden="true" />
      {buttonLabel}
    </Button>
  );
};
