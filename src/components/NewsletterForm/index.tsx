"use client";
import { createEmailSubscriber } from "@/server/actions/createEmailSubscriber";
import { toast } from "sonner";
import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useLocale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";

type NewsletterFormProps = {
  title: string;
  description: string;
  inputClassName?: string;
  onSuccessfulSubscribe?: () => void;
};

export const NewsletterForm = ({
  title,
  description,
  inputClassName = "bg-gray-800 border border-gray-700",
  onSuccessfulSubscribe,
}: NewsletterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const locale = useLocale();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");
    const name = formData.get("name");
    const honeypot = formData.get("hpc4b27b6e-eb38-11e9-be00-06b4694bee2a");

    // If honeypot is filled, it's a bot
    if (honeypot) {
      return;
    }

    // Ensure required fields
    if (!email) {
      toast.error(translations.emailRequired[locale]);
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);

    try {
      const res = await createEmailSubscriber({
        name: name as string,
        email: email as string,
      });

      if (res.success) {
        setIsSuccess(true);
        toast.success(translations.success[locale]);
        form.reset();

        // Mark that the user has subscribed
        localStorage.setItem("newsletter-subscribed", "true");

        // Call the success callback if provided
        if (onSuccessfulSubscribe) {
          onSuccessfulSubscribe();
        }

        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error(translations.error[locale]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
      {description && <p className="text-gray-400 mb-4">{description}</p>}
      <form className="space-y-3" onSubmit={handleSubmit} autoComplete="off">
        <input
          name="email"
          type="email"
          placeholder={translations.emailPlaceholder[locale]}
          className={`w-full py-3 px-4 ${inputClassName} rounded-lg focus:outline-none focus:border-primary transition-colors`}
          required
          aria-label="Email address"
          tabIndex={3}
        />
        <input
          name="name"
          type="text"
          placeholder={translations.namePlaceholder[locale]}
          className={`w-full py-3 px-4 ${inputClassName} rounded-lg focus:outline-none focus:border-primary transition-colors`}
          aria-label="Enter your name"
          tabIndex={2}
        />
        {/* Honeypot field (hidden from users) */}
        <div style={{ display: "none" }} aria-hidden="true">
          <input
            type="text"
            name="hpc4b27b6e-eb38-11e9-be00-06b4694bee2a"
            tabIndex={-1}
            autoComplete="nope"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg transition-all flex items-center justify-center ${
            isSuccess
              ? "bg-green-600 hover:bg-green-700"
              : "bg-primary hover:bg-primary/90"
          } text-white`}
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : isSuccess ? (
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 animate-in fade-in duration-300" />
              <span>{translations.successButtonText[locale]}</span>
            </div>
          ) : (
            translations.subscribeButtonText[locale]
          )}
        </button>
      </form>
    </div>
  );
};
