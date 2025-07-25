import "@/styles/globals.css";
import { Toaster } from "sonner";
const LocaleLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html dir="ltr" lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
};
export default LocaleLayout;
