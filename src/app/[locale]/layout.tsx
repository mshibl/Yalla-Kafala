import AppTheme from "@/src/utils/AppTheme";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import type { Metadata } from "next";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Box, Container, CssBaseline } from "@mui/material";
import { NextIntlClientProvider, useMessages } from "next-intl";
import Navbar from "@/src/components/Navbar";
import AppFooter from "@/src/components/AppFooter";
import AiAssistant from "@/src/components/AIAssistant/ai-assistant";

import { PostHogProvider } from "../providers";
import Script from "next/script";

export async function generateMetadata({
	params: { locale },
}: {
	params: { locale: string };
}): Promise<Metadata> {
	const isArabic = locale === "ar";

  const title = isArabic
    ? "يلا كفالة"
    : "What Is Kafala? | Islamic Guardianship & Orphan Support";
  const description = isArabic
    ? "يلا كفالة هي منظمة غير حكومية تحول حالة الطفل في مصر من خلال الكفالة (الحماية/التبني). مع مكاتب في مصر وسان فرانسيسكو ، نحن نقدم خيارات الرعاية المبتكرة ، خدمات الدعم ، والدعم المتطوع للأيتام."
    : "Learn how Islamic Kafala differs from adoption. Discover its religious roots, legal framework, and why it offers loving homes to orphans without changing identity.";

	const url = `https://yallakafala.org/${locale}`;
	const imageUrl = "https://yallakafala.org/images/yk-team-1.jpg";

	return {
		title,
		description,
		alternates: {
			languages: {
				en: "/en",
				ar: "/ar",
			},
		},
		keywords: isArabic
			? [
					"كفالة",
					"تبني",
					"أيتام",
					"مصر",
					"رعاية الأطفال",
					"حماية الطفل",
					"منظمة غير حكومية",
					"دار أيتام",
					"رعاية بديلة",
					"حقوق الطفل",
					"دعم الأطفال",
					"الأسر البديلة",
					"الرعاية الاجتماعية",
					"تمكين الأطفال",
					"العمل الخيري",
					"التطوع في مصر",
					"مساعدة الأطفال المحتاجين",
					"برامج رعاية الأيتام",
					"الأسر الكافلة",
					"حماية الأطفال المعرضين للخطر",
					"التنمية الاجتماعية",
					"الدعم النفسي للأطفال",
					"الرعاية الصحية للأيتام",
					"التعليم للأطفال المحرومين",
					"مؤسسة خيرية للأطفال",
					"يلا كفالة",
					"خدمات الدعم للأيتام",
					"تحسين حياة الأطفال",
					"الحماية الاجتماعية للأطفال",
					"مبادرات رعاية الطفل",
				]
			: [
					"kafala",
					"adoption",
					"orphans",
					"Egypt",
					"child welfare",
					"child protection",
					"NGO",
					"orphanage",
					"alternative care",
					"children's rights",
					"child support",
					"foster families",
					"social care",
					"child empowerment",
					"charity work",
					"volunteering in Egypt",
					"helping children in need",
					"orphan care programs",
					"sponsoring families",
					"protecting at-risk children",
					"social development",
					"psychological support for children",
					"healthcare for orphans",
					"education for underprivileged children",
					"children's charity foundation",
					"Yalla Kafala",
					"support services for orphans",
					"improving children's lives",
					"social protection for children",
					"child care initiatives",
					"Egyptian adoption",
					"guardianship in Egypt",
					"child advocacy",
					"family-based care",
					"child development programs",
					"community outreach",
					"child poverty alleviation",
					"child rights advocacy",
					"sustainable child care",
					"international adoption in Egypt",
				],
		viewport: {
			width: "device-width",
			initialScale: 1,
			maximumScale: 1,
		},
		openGraph: {
			title,
			description,
			url,
			siteName: "Yalla Kafala",
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: isArabic
						? "يلا كفالة - رعاية الأطفال في مصر"
						: "Yalla Kafala - Child Welfare in Egypt",
				},
			],
			locale: isArabic ? "ar_EG" : "en_US",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [imageUrl],
			creator: "@YallaKafala",
		},
		other: {
			"og:image:width": "1200",
			"og:image:height": "630",
			"og:site_name": "Yalla Kafala",
			"og:locale": isArabic ? "ar_EG" : "en_US",
			"og:locale:alternate": isArabic ? "en_US" : "ar_EG",

			// WhatsApp specific
			"og:image:secure_url": imageUrl,

			// Facebook specific (in addition to the facebook object above)
			"fb:pages": "469771757195549", // Replace with your Facebook Page ID
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
	};
}

const LocaleLayout = ({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: "ar" | "en" };
}) => {
	const messages = useMessages();

	return (
		<html dir={locale === "en" ? "ltr" : "rtl"} lang={locale}>
			<Script
				src="https://secure.givelively.org/widgets/branded_donation/yalla-kafala.js"
				strategy="beforeInteractive"
			/>
			<GoogleTagManager gtmId="GTM-W8P5HTS6" />
			<body>
				<AppRouterCacheProvider options={{ enableCssLayer: true }}>
					<NextIntlClientProvider messages={messages}>
						<ThemeProvider theme={AppTheme}>
							<CssBaseline />
							<Container disableGutters={true} maxWidth={false}>
								<Navbar locale={locale} />
								<Box
									sx={{
										display: "flex",
										justifyContent: "center",
										flexDirection: "column",
										alignItems: "center",
										width: "100%",
									}}
								>
									<PostHogProvider>
										<Box sx={{ width: "100%", maxWidth: "xl" }}>
											{children}
											<AiAssistant />
										</Box>
									</PostHogProvider>
								</Box>
								<AppFooter />
							</Container>
						</ThemeProvider>
					</NextIntlClientProvider>
				</AppRouterCacheProvider>
			</body>
			<GoogleAnalytics gaId="GTM-W8P5HTS6" />
		</html>
	);
};
export default LocaleLayout;
