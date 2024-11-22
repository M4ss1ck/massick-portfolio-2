"use client";
import React from 'react'
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, routing, usePathname } from '@/i18n/routing';


const LanguageSwitcher = () => {
    const t = useTranslations();
    const path = usePathname();
    const router = useRouter();
    const locale = useLocale();

    const setLanguage = (lng: string) => {
        router.push(path, { locale: lng });
    }
    return (
        <ul className='flex flex-row items-start justify-center z-10 p-4 text-sm lg:text-2xl'>
            <span>{t("language")}:</span>
            {routing.locales.map(lng => (
                <li key={lng} className='px-2'>
                    <button
                        className={`hover:underline ${lng === locale ? 'underline' : 'disabled'}`}
                        onClick={() => setLanguage(lng)}
                        disabled={lng === locale}
                    >
                        {lng}
                    </button>
                </li>
            ))}
        </ul>
    )
}

export default LanguageSwitcher