import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import "../globals.css";

import { routing } from "@/i18n/routing";
import { LocaleSync } from "@/components/LocaleSync";
import IntlErrorHandlingProvider from "@/components/providers/IntlErrorHandlingProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { SpotlightSnapshotProvider } from "@/components/SpotlightSnapshotProvider";

const federant = localFont({
    src: "../fonts/federant-latin-400-normal.woff2",
    weight: "400",
    style: "normal",
    display: "optional",
    preload: true,
    adjustFontFallback: false,
    fallback: ["system-ui"],
    variable: "--font-federant",
});

const kodeMono = localFont({
    src: "../fonts/kode-mono-latin-wght-normal.woff2",
    weight: "400 700",
    style: "normal",
    display: "optional",
    preload: true,
    adjustFontFallback: false,
    fallback: ["monospace"],
    variable: "--font-kode-mono",
});

export function generateStaticParams() {
    return routing.locales.map((lng) => ({ lng }));
}

export async function generateMetadata() {
    const t = await getTranslations();
    return {
        title: t("portfolio"),
        description: t("portfolioDescription"),
    };
}

export default async function RootLayout({ children }: LayoutProps<"/[lng]">) {
    const locale = await getLocale();
    const messages = await getMessages();

    return (
        <html
            lang={locale}
            className={`${federant.variable} ${kodeMono.variable}`}
        >
            <body>
                <QueryProvider>
                    <IntlErrorHandlingProvider
                        locale={locale}
                        messages={messages}
                    >
                        <LocaleSync />
                        <SpotlightSnapshotProvider>
                            {children}
                        </SpotlightSnapshotProvider>
                    </IntlErrorHandlingProvider>
                </QueryProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
