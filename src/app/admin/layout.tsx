import { Providers } from "@/components/Providers";
import "@/styles/globals.css";
import { Toaster } from "sonner";
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
