import type { Metadata } from "next";
import { getMessages, getLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "@fontsource/federant";
import "@fontsource-variable/kode-mono";
import federantLatin from "@fontsource/federant/files/federant-latin-400-normal.woff2";
import kodeMonoLatin from "@fontsource-variable/kode-mono/files/kode-mono-latin-wght-normal.woff2";

import IntlErrorHandlingProvider from "@/components/providers/IntlErrorHandlingProvider";
import QueryProvider from "@/components/providers/QueryProvider";

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
        <html lang={locale}>
            <head>
                <link
                    rel="preload"
                    as="font"
                    type="font/woff2"
                    href={federantLatin}
                    crossOrigin="anonymous"
                />
                <link
                    rel="preload"
                    as="font"
                    type="font/woff2"
                    href={kodeMonoLatin}
                    crossOrigin="anonymous"
                />
            </head>
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
