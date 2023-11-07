"use client"
import React from 'react'
import { languages } from '@/app/i18n/settings'
import Link from './Link';
import { useStore } from '@/state/store';

const LanguageSwitcher = ({ path }: { path: string | null }) => {
    const { setLng, lng: current } = useStore()
    const changeLng = (lng: string) => (e: React.MouseEvent<HTMLAnchorElement>) => setLng(lng)
    if (languages.length === 0 || !path) return <></>
    return (
        <ul className='flex flex-row items-center justify-center gap-4 z-10'>
            {languages.map(lng => (
                <li key={lng} className='border border-white px-2'>
                    <Link href={path} lng={lng} onClick={changeLng(lng)} disabled={lng === current}>{lng}</Link>
                </li>
            ))}
        </ul>
    )
}

export default LanguageSwitcher