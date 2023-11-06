import React from 'react'
import Massick1x1 from '@/assets/svg/massick-1x1.svg'
import LanguageSwitcher from './LanguageSwitcher'
import Link from './Link'

export default function Menu({ t }: { t: (value: string) => any }) {
    return (
        <aside className="flex flex-row py-1 px-4 md:flex-col justify-between items-center absolute w-full md:w-fit left-0 top-0 md:top-[60vh] z-20  md:border-4 border-b-4 border-primario dark:border-secundario md:-rotate-45 hover:rotate-0  rounded-lg md:-translate-x-2 md:hover:translate-x-12 lg:transition md:hover:scale-150 shadow-md dark:shadow-2xl hover:shadow-primario dark:hover:shadow-secundario bg-slate-200 dark:bg-black">
            <Link href="/" className="md:hidden" aria-label={t("home")}>
                <Massick1x1 className="w-12 h-12 rounded-md text-primario dark:text-secundario" />
            </Link>
            {/* <DarkToggle /> */}
            <LanguageSwitcher />
            <h2 className="hidden px-4 py-8 text-sm text-center sm:block lg:text-lg font-montserrat">
                <Link href="/about" className="text-primario dark:text-secundario">
                    {t("about")}
                </Link>
            </h2>
        </aside>
    )
}