"use client";

import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
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
      size="icon"
      onClick={handleCopy}
      aria-label={buttonLabel}
      title={buttonLabel}
      className="h-10 w-10 rounded-full text-gray-500 hover:text-primary"
    >
      <Link2 className="h-5 w-5" aria-hidden="true" />
    </Button>
  );
};
