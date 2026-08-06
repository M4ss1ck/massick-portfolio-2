import type { Metadata } from "next";
import { getMessages, getLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import localFont from "next/font/local";
import "./globals.css";

import IntlErrorHandlingProvider from "@/components/providers/IntlErrorHandlingProvider";
import QueryProvider from "@/components/providers/QueryProvider";

const federant = localFont({
    src: "./fonts/federant-latin-400-normal.woff2",
    weight: "400",
    style: "normal",
    display: "optional",
    preload: true,
    adjustFontFallback: false,
    fallback: ["system-ui"],
    variable: "--font-federant",
});

const kodeMono = localFont({
    src: "./fonts/kode-mono-latin-wght-normal.woff2",
    weight: "400 700",
    style: "normal",
    display: "optional",
    preload: true,
    adjustFontFallback: false,
    fallback: ["monospace"],
    variable: "--font-kode-mono",
});

export const metadata: Metadata = {
    title: "My portfolio",
    description: "Next(js) version, on steroids!",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const messages = await getMessages();
    const locale = await getLocale();
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
                        {children}
                    </IntlErrorHandlingProvider>
                </QueryProvider>
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
