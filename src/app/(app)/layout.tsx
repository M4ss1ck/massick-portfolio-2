import type { Metadata } from 'next'
import { getMessages, getLocale } from 'next-intl/server';
import './globals.css'
import '@fontsource/federant';
import '@fontsource-variable/kode-mono';

import IntlErrorHandlingProvider from '@/components/providers/IntlErrorHandlingProvider';

export const metadata: Metadata = {
  title: 'My portfolio',
  description: 'Next(js) version, on steroids!',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html>
      <body>
        <IntlErrorHandlingProvider locale={locale} messages={messages}>
          {children}
        </IntlErrorHandlingProvider>
      </body>
    </html>
  );
}
