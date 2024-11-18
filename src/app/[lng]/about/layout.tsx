import { dir } from 'i18next'
import { languages } from '../../i18n/settings'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About',
    description: 'About me',
}

export const runtime = 'edge';

export async function generateStaticParams() {
    return languages.map((lng) => ({ lng }))
}

export default function RootLayout({
    children,
    params: {
        lng
    }
}: {
    children: React.ReactNode,
    params: {
        lng: string
    }
}) {
    return (
        <html lang={lng} dir={dir(lng)}>
            <head />
            <body>
                {children}
            </body>
        </html>
    )
}