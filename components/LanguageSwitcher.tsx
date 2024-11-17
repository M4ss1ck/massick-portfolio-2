"use client"
import React from 'react'
import { languages } from '@/app/i18n/settings'
import { useRouter } from 'next/navigation';
import { useStore } from '@/state/store';
import { useTranslation } from '@/app/i18n';

const LanguageSwitcher = ({ path }: { path: string | null }) => {
    const router = useRouter()
    const { setLng, lng: current } = useStore()
    const changeLng = (lng: string) => (e: React.MouseEvent<HTMLAnchorElement>) => setLng(lng)
    const togglelanguage = () => {
        const lng = current === 'es' ? 'en' : 'es'
        setLng(lng)
        router.refresh()
    }
    if (languages.length === 0 || !path) return <></>
    return (
        <ul className='flex flex-row items-start justify-center gap-4 z-10 p-4 text-sm' onClick={togglelanguage}>
            {/* <em>{t("language")}:</em> */}
            {languages.map(lng => (
                <li key={lng} className='border border-white px-2'>
                    {lng}
                </li>
            ))}
        </ul>
    )
}

export default LanguageSwitcher