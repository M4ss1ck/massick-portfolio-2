import React from 'react'
import { headers } from "next/headers";
import Link from 'next/link'
import { languages } from '@/app/i18n/settings'

const LanguageSwitcher = () => {
    const headersList = headers();
    const path = headersList.get("x-pathname")
    if (languages.length === 0 || !path) return <></>
    const replaceLocaleInPath = (locale: string) => {
        return path.replace(/^\/\w{2}/, `/${locale}`)
    }
    return (
        <ul className='flex flex-row items-center justify-center gap-4 z-10'>
            {languages.map(lng => (
                <li key={lng} className='border border-white px-2'><Link href={replaceLocaleInPath(lng)}>{lng}</Link></li>)
            )}
        </ul>
    )
}

export default LanguageSwitcher