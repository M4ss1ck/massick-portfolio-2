import React from 'react'
import Massick1x1 from '@/assets/svg/massick-1x1.svg'
import LanguageSwitcher from './LanguageSwitcher'
import Link from './Link'
import { getPath } from '@/utils/getPath'

export default function Menu({ t }: { t: (value: string) => any }) {
    const path = getPath()
    return (
        <aside className="flex flex-row py-1 px-4 md:flex-col justify-between items-start absolute w-full md:w-fit left-0 top-0 md:top-[60vh] z-20 rounded-lg lg:transition text-lg">
            <Link href="/" className="md:hidden" aria-label={t("home")}>
                <Massick1x1 className="w-12 h-12 rounded-md" />
            </Link>
            {/* <DarkToggle /> */}
            <h2 className="hidden p-4 text-sm sm:block lg:text-2xl font-montserrat">
                <Link href="/projects" className="">
                    {t("projects")}
                </Link>
            </h2>
            <h2 className="hidden p-4 text-sm text-center sm:block lg:text-2xl font-montserrat">
                <Link href="/about" className="">
                    {t("about")}
                </Link>
            </h2>
            <LanguageSwitcher path={path} />
        </aside>
    )
}