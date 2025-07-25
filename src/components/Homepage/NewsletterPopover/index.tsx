"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { NewsletterForm } from "@/components/NewsletterForm";
import { useLocale } from "@/components/Providers/LocaleProvider";
import { translations } from "./translations";

export const NewsletterPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  useEffect(() => {
    // Initialize or increment visit count
    const trackVisits = () => {
      try {
        // Check if user has already subscribed
        const hasSubscribed = localStorage.getItem("newsletter-subscribed");
        if (hasSubscribed === "true") {
          return; // Don't show popup if already subscribed
        }

        // Get current visit count or initialize if it doesn't exist
        const currentVisitCount = parseInt(
          localStorage.getItem("visit-count") || "0",
        );
        const newVisitCount = Number(currentVisitCount) + 1;

        // Save the new visit count
        localStorage.setItem("visit-count", newVisitCount.toString());

        // Check when to show the popup
        const hasSeenPopup = localStorage.getItem("newsletter-popup-seen");

        // Show on first visit or on fifth visit if they haven't subscribed
        if (!hasSeenPopup || (newVisitCount >= 5 && newVisitCount % 5 === 0)) {
          // Show popup after delay
          const timer = setTimeout(() => {
            setIsOpen(true);
            // Reset the "seen" flag if we're showing it again
            localStorage.removeItem("newsletter-popup-seen");
          }, 500);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        // Handle localStorage errors (e.g., private browsing)
        console.error("Error tracking visits:", error);
      }
    };

    trackVisits();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark that the user has seen the popup
    localStorage.setItem("newsletter-popup-seen", "true");
  };

  const handleSuccessfulSubscribe = () => {
    // Close popup after successful subscription with a small delay
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative bg-white p-0 rounded-xl shadow-xl max-w-4xl w-full mx-4 overflow-hidden flex"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
              aria-label="Close newsletter popup"
            >
              <X size={24} />
            </button>

            {/* Left column - Form */}
            <div className="w-full md:w-1/2 p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {translations.title[locale]}
                </h2>
                <p className="text-gray-600">
                  {translations.description[locale]}
                </p>
              </div>

              <div className="newsletter-popover-form">
                <NewsletterForm
                  title=""
                  description=""
                  inputClassName="bg-white border border-gray-300 focus:ring-1 focus:ring-primary"
                  onSuccessfulSubscribe={handleSuccessfulSubscribe}
                />
              </div>

              <button
                onClick={handleClose}
                className="mt-4 text-sm text-gray-500 hover:text-gray-800 w-full cursor-pointer"
              >
                {translations.skipButtonText[locale]}
              </button>
            </div>

            {/* Right column - Image */}
            <div className="hidden md:block w-1/2 relative">
              <Image
                src="/newsletter-popover-image.webp"
                alt="Join our newsletter"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsletterPopover;
