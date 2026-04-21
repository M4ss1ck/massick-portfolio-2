import React from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "./AnimatedLink";
import { Rocket } from "./icons/Rocket";
import { Profile } from "./icons/Profile";

export default function Menu({ t }: { t: (value: string) => string }) {
    return (
        <aside className="flex flex-row py-1 px-4 md:flex-col justify-between items-center md:items-start absolute w-full md:w-fit left-0 top-0 md:top-[60vh] z-20 rounded-lg lg:transition text-lg text-primary">
            <h2 className="p-1 sm:p-4 text-sm sm:block lg:text-2xl">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 underline-animation"
                >
                    <Rocket className="w-[1em] h-[1em]" />
                    {t("projects")}
                </Link>
            </h2>
            <h2 className="p-1 sm:p-4 text-sm text-center sm:block lg:text-2xl">
                <Link
                    href="/about"
                    className="inline-flex items-center gap-2 underline-animation"
                >
                    <Profile className="w-[1em] h-[1em]" />
                    {t("about")}
                </Link>
            </h2>
            <LanguageSwitcher />
        </aside>
    );
}
