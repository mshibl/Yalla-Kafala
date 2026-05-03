import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "@/styles/globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/images/yk_logo.svg", type: "image/svg+xml" }],
  },
};

const LocaleLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html dir="ltr" lang="en">
      <body>
        <Providers locale={"en"}>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
};
export default LocaleLayout;
