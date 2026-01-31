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
      variant="outline"
      size="icon"
      onClick={handleCopy}
      aria-label={buttonLabel}
      title={buttonLabel}
    >
      <Copy className="h-4 w-4" />
    </Button>
  );
};
