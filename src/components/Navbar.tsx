"use client"
import React from 'react'
import LanguageSwitcher from './LanguageSwitcher'
import { Link } from './AnimatedLink'
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/routing';

export default function Navbar() {
    const t = useTranslations();
    const path = usePathname();
    return (
        <nav className="sticky top-0 flex flex-row py-1 px-4 justify-between items-center z-20 lg:transition text-sm sm:text-lg bg-black/5 backdrop-filter backdrop-blur-lg w-full text-primary">
            <h2 className="p-1 sm:p-4 text-sm sm:block lg:text-2xl font-display mr-auto">
                <Link href="/" className={`${path === '/' ? 'text-secondary' : 'underline-animation'}`}>
                    {t("home")}
                </Link>
            </h2>
            <h2 className="p-1 sm:p-4 text-sm sm:block lg:text-2xl font-display">
                <Link href="/projects" className={`${path === '/projects' ? 'text-secondary pointer-events-none' : 'underline-animation'}`}>
                    {t("projects")}
                </Link>
            </h2>
            <h2 className="p-1 sm:p-4 text-sm sm:block lg:text-2xl font-display truncate">
                <Link href="/about" className={`${path === '/about' ? 'text-secondary pointer-events-none' : 'underline-animation'}`}>
                    {t("about")}
                </Link>
            </h2>
            <LanguageSwitcher showlabel={false} />
        </nav>
    )
}