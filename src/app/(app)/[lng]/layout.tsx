import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import "../globals.css";

import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
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

export async function generateMetadata(props: {
    params: Promise<{
        lng: string;
    }>;
}) {
    const params = await props.params;
    const { lng } = params;
    const t = await getTranslations({ locale: lng });
    return {
        title: t("portfolio"),
        description: t("portfolio_description"),
    };
}

export default async function RootLayout(props: {
    children: React.ReactNode;
    params: Promise<{
        lng: string;
    }>;
}) {
    const params = await props.params;
    const { lng } = params;
    const { children } = props;

    if (!routing.locales.includes(lng as "en" | "es")) {
        notFound();
    }

    setRequestLocale(lng);

    const messages = await getMessages({ locale: lng });

    return (
        <html lang={lng} className={`${federant.variable} ${kodeMono.variable}`}>
            <body>
                <QueryProvider>
                    <IntlErrorHandlingProvider locale={lng} messages={messages}>
                        <LocaleSync />
                        <SpotlightSnapshotProvider>{children}</SpotlightSnapshotProvider>
                    </IntlErrorHandlingProvider>
                </QueryProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
