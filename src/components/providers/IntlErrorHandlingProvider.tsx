'use client';

import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';

export default function IntlErrorHandlingProvider({
  locale,
  messages,
  children
}: {
  locale: string,
  messages: AbstractIntlMessages,
  children: React.ReactNode
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      onError={console.log}
      getMessageFallback={({ key }) => `${key}`}
      timeZone='America/Santiago'
    >
      {children}
    </NextIntlClientProvider>
  );
}