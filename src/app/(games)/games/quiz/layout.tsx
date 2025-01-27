import type { Metadata } from "next";
import "@/src/utils/global.css";
import AppTheme from "@/src/utils/AppTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { CssBaseline } from "@mui/material";

export const metadata: Metadata = {
  title: "تطبيق نكست",
  description: "تم إنشاؤه بواسطة create next app",
};

export default function GamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={AppTheme}>
            <CssBaseline />
            <div className="games-layout">{children}</div>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
