"use client";
import React, { useEffect, useRef, useState } from "react";
import { Heart, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const donationAmounts = [25, 50, 100, 250, 500];

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100");
            entry.target.classList.remove("opacity-0", "translate-y-10");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (contentRef.current) observer.observe(contentRef.current);
    if (formRef.current) observer.observe(formRef.current);

    return () => observer.disconnect();
  }, []);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount =
      selectedAmount || (customAmount ? parseInt(customAmount) : 0);

    if (!amount || amount <= 0) {
      toast.error("Please select a donation amount");
      return;
    }

    if (!name || !email) {
      toast.error("Please provide your name and email to continue.");
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success("Thank you for your donation!");

      setIsSubmitting(false);
      setName("");
      setEmail("");
      setSelectedAmount(50);
      setCustomAmount("");
    }, 1500);
  };

  return (
    <section
      id="donate"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <div
        data-widget-src="https://secure.givelively.org/donate/yalla-kafala?ref=sd_widget"
        id="give-lively-widget"
        className="gl-branded-donation-widget"
      />
      {/* Background Elements */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-64 h-64 rounded-full bg-secondary/5 animate-float"></div>
        <div
          className="absolute bottom-[10%] left-[5%] w-72 h-72 rounded-full bg-primary/5 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div
            ref={contentRef}
            className="opacity-0 translate-y-10 transition-all duration-700 ease-out"
          >
            <div className="chip purple-gradient text-white mb-6">
              Make A Difference
            </div>
            <h2 className="heading-md text-gray-900 mb-6">
              Your Donation Changes Lives
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Your generous support helps us connect orphans with loving
              families, providing them with the care, stability, and
              opportunities they deserve. Every donation, no matter the size,
              brings a child one step closer to a place they can call home.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h3 className="heading-sm text-gray-800 mb-4">
                How Your Donation Helps
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-medium">$25</span> provides essential
                    supplies for a child in transition
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-medium">$50</span> supports
                    educational materials and resources
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-medium">$100</span> funds medical
                    check-ups and healthcare needs
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-medium">$250</span> helps with family
                    placement services
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-600">
                    <span className="font-medium">$500</span> provides
                    comprehensive support for a child&apos;s transition to a new
                    home
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="glass-card p-8 md:p-10 opacity-0 translate-y-10 transition-all duration-700 ease-out"
            style={{ transitionDelay: "200ms" }}
          >
            <h3 className="heading-sm text-gray-800 mb-6 text-center">
              Make Your Donation
            </h3>

            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-3">
                Select Amount
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => handleAmountSelect(amount)}
                    className={cn(
                      "py-3 px-4 rounded-lg text-center transition-all duration-300",
                      selectedAmount === amount
                        ? "bg-primary text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  placeholder="Other amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full py-3 pl-8 pr-4 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "primary-button w-full py-4 font-medium text-lg",
                  isSubmitting && "opacity-70 cursor-not-allowed",
                )}
              >
                {isSubmitting ? "Processing..." : "Donate Now"}
              </button>

              <div className="text-sm text-gray-500 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Your donation will be processed securely. All donations are
                  tax-deductible.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div> */}
    </section>
  );
};

export default Donate;
