import React from 'react'
import { useTranslations } from 'next-intl';
import { Link, routing, usePathname } from '@/i18n/routing';


const LanguageSwitcher = () => {
    const t = useTranslations();
    const path = usePathname();
    return (
        <ul className='flex flex-row items-start justify-center gap-4 z-10 p-4 text-sm'>
            <em>{t("language")}:</em>
            {routing.locales.map(lng => (
                <li key={lng} className='px-2'>
                    <Link href={path} lang={lng}>{lng}</Link>
                </li>
            ))}
        </ul>
    )
}

export default LanguageSwitcher