import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';

export async function generateMetadata(props: {
    params: Promise<{
        lng: string
    }>
}) {
    const params = await props.params;
    const {
        lng
    } = params;
    const t = await getTranslations({ locale: lng });
    return {
        title: t('portfolio'),
        description: t('portfolio_description'),
    };
}

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout(
    props: {
        children: React.ReactNode,
        params: Promise<{
            lng: string
        }>
    }
) {
    const params = await props.params;

    const {
        lng
    } = params;

    const {
        children
    } = props;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(lng as 'en' | 'es')) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={lng}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    )
}