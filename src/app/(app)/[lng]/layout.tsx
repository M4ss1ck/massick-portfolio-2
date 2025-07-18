import { getTranslations, getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import IntlErrorHandlingProvider from '@/components/providers/IntlErrorHandlingProvider';

export async function generateMetadata(props: {
    params: Promise<{
        lng: string
    }>
}) {
    const params = await props.params;
    const { lng } = params;
    const t = await getTranslations({ locale: lng });
    return {
        title: t('portfolio'),
        description: t('portfolio_description'),
    };
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
    const { lng } = params;
    const { children } = props;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(lng as 'en' | 'es')) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={lng}>
            <body>
                <IntlErrorHandlingProvider locale={lng} messages={messages}>
                    {children}
                </IntlErrorHandlingProvider>
            </body>
        </html>
    )
}